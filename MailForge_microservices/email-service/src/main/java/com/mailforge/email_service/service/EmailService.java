package com.mailforge.email_service.service;

import com.mailforge.email_service.dao.EmailDao;
import com.mailforge.email_service.dto.*;
import com.mailforge.email_service.exception.EmailQueueException;
import com.mailforge.email_service.exception.GrpcDependencyException;
import com.mailforge.email_service.exception.InvalidApiKeyException;
import com.mailforge.email_service.exception.TemplateNotFoundException;
import com.mailforge.email_service.grpc.ProjectGrpcServiceClient;
import com.mailforge.email_service.kafka.EmailKafkaProducer;
import com.mailforge.email_service.model.Email;
import com.mailforge.quota.grpc.CanSendRequest;
import com.mailforge.quota.grpc.CanSendResponse;
import com.mailforge.quota.grpc.QuotaServiceGrpc;
import com.mailforge.template_service.grpc.RenderTemplateRequest;
import com.mailforge.template_service.grpc.RenderTemplateResponse;
import com.mailforge.template_service.grpc.TemplateRenderServiceGrpc;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.common.errors.InvalidRequestException;
import org.apache.kafka.common.errors.ThrottlingQuotaExceededException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.ApiKeyRequest;
import project.ApiKeyResponse;
import project.ProjectServiceGrpc;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class EmailService {

    @Autowired
    private EmailDao emailDao;
    @Autowired
    private ProjectGrpcServiceClient projectGrpcClient;
    @Autowired
    private EmailKafkaProducer emailKafkaProducer;

    private final QuotaServiceGrpc.QuotaServiceBlockingStub quotaStub;

    private final TemplateRenderServiceGrpc.TemplateRenderServiceBlockingStub templateStub;

    private final ProjectServiceGrpc.ProjectServiceBlockingStub projectStub;

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    public EmailService(QuotaServiceGrpc.QuotaServiceBlockingStub quotaStub,
                        TemplateRenderServiceGrpc.TemplateRenderServiceBlockingStub templateStub,
                        ProjectServiceGrpc.ProjectServiceBlockingStub projectStub) {
        this.quotaStub = quotaStub;
        this.templateStub = templateStub;
        this.projectStub = projectStub;
    }

    /**
     * Send email request
     */
    public EmailResponse sendEmail(@Valid EmailRequest request) {

        // 🔐 Validate project & API key
        if (!projectGrpcClient.validateProjectExists(request.getProjectId())) {
            throw new RuntimeException("Invalid Project ID");
        }

        if (!projectGrpcClient.validateApiKey(request.getProjectId(), request.getApiKey())) {
            throw new RuntimeException("Invalid API Key");
        }

        int recipientsCount = request.getRecipients().size();

        CanSendResponse quotaResponse = quotaStub.canSend(
                CanSendRequest.newBuilder()
                        .setUserId(request.getUserId())
                        .setRecipientsCount(recipientsCount)
                        .build()
        );

        if (!quotaResponse.getAllowed()) {
            throw new ThrottlingQuotaExceededException(
                    "Daily email quota exceeded. Remaining: " + quotaResponse.getRemaining()
            );
        }

        // 🗄 Persist email metadata
        Email email = new Email();
        email.setId(UUID.randomUUID().toString());
        email.setUserId(request.getUserId());
        email.setProjectId(request.getProjectId());
        email.setSender(request.getSender());
        email.setRecipients(request.getRecipients());
        email.setSubject(request.getSubject());
        email.setBody(request.getBody());
        email.setStatus(Email.EmailStatus.QUEUED);
        email.setCreatedAt(LocalDateTime.now());

        Email savedEmail = emailDao.save(email);
        log.info("Email {} stored with status QUEUED", savedEmail.getId());

        // 🚀 Publish to Kafka
        emailKafkaProducer.sendEmail(request);

        EmailResponse response =  mapToResponse(savedEmail);
        response.setSource("RAW");

        return response;
    }

    public EmailResponse sendTemplateEmail(TemplateEmailRequest request) {

        // 🔐 Validate project & API key
        if (!projectGrpcClient.validateProjectExists(request.getProjectId())) {
            throw new RuntimeException("Invalid Project ID");
        }

        if (!projectGrpcClient.validateApiKey(request.getProjectId(), request.getApiKey())) {
            throw new RuntimeException("Invalid API Key");
        }

        int recipientsCount = request.getRecipients().size();

        CanSendResponse quotaResponse = quotaStub.canSend(
                CanSendRequest.newBuilder()
                        .setUserId(request.getUserId())
                        .setRecipientsCount(recipientsCount)
                        .build()
        );

        if (!quotaResponse.getAllowed()) {
            throw new ThrottlingQuotaExceededException(
                    "Daily email quota exceeded. Remaining: " + quotaResponse.getRemaining()
            );
        }

        // 1. Render template via Template Service (authoritative render)
        RenderTemplateResponse renderResponse =
                templateStub.renderTemplate(
                        RenderTemplateRequest.newBuilder()
                                .setTemplateId(request.getTemplateId())
                                .putAllVariables(request.getVariables())
                                .build()
                );

        // 2. Create email entity (QUEUED state)
        Email email = new Email();
        email.setId(UUID.randomUUID().toString());
        email.setUserId(request.getUserId());
        email.setProjectId(request.getProjectId());
        email.setSender(request.getSender());
        email.setRecipients(request.getRecipients());
        email.setSubject(renderResponse.getSubject());
        email.setBody(renderResponse.getBody());
        email.setStatus(Email.EmailStatus.QUEUED);
        email.setCreatedAt(LocalDateTime.now());

        Email savedEmail = emailDao.save(email);
        log.info("Email {} stored with status QUEUED", savedEmail.getId());

        EmailRequest emailRequest = new EmailRequest();
        emailRequest.setSender(request.getSender());
        emailRequest.setUserId(request.getUserId());
        emailRequest.setProjectId(request.getProjectId());
        emailRequest.setApiKey(request.getApiKey());
        emailRequest.setSubject(email.getSubject());
        emailRequest.setBody(email.getBody());
        emailRequest.setRecipients(request.getRecipients());

        // 3. Publish to Kafka
        emailKafkaProducer.sendEmail(emailRequest);

        EmailResponse response =  mapToResponse(savedEmail);
        response.setSource("TEMPLATE");

        return response;
    }

    public PublicSendResponse publicSend(String apiKey, PublicSendRequest request) {

        if (apiKey == null || apiKey.isBlank()) {
            log.warn("Missing API key header");
            throw new InvalidRequestException("Missing API key");
        }

        if (request.getRecipients() == null ||
                request.getRecipients().isEmpty()) {
            throw new InvalidRequestException("Recipients required");
        }

        log.info("Public send request | recipients={}", request.getRecipients().size());

        ApiKeyResponse apiResp;

        try {
            apiResp = projectStub.resolveApiKey(
                    ApiKeyRequest.newBuilder()
                            .setApiKey(apiKey)
                            .build()
            );
            log.info("Api Response :{} {} {}",apiResp.getUserId(), apiResp.getProjectId(), apiResp.getValid());
        } catch (Exception e) {
            log.error("gRPC resolveApiKey failed", e);
            throw new GrpcDependencyException("User service unavailable");
        }

        if (!apiResp.getValid()) {
            log.warn("Invalid API key");
            throw new InvalidApiKeyException("Invalid API key");
        }

        String userId = apiResp.getUserId();
        String projectId = apiResp.getProjectId();

        log.info("Resolved API key | project={} user={}", projectId, userId);

        boolean templateMode = request.getTemplateId() != null && !request.getTemplateId().isBlank();

        if (!templateMode && (request.getSubject() == null || request.getBody() == null)) {

            throw new InvalidRequestException(
                    "subject and body required for raw mode");
        }

        try {

            if (!templateMode) {

                EmailRequest emailRequest = new EmailRequest();
                emailRequest.setSender(request.getSender());
                emailRequest.setRecipients(request.getRecipients());
                emailRequest.setUserId(userId);
                emailRequest.setProjectId(projectId);
                emailRequest.setApiKey(apiKey);
                emailRequest.setSubject(request.getSubject());
                emailRequest.setBody(request.getBody());

                EmailResponse resp = sendEmail(emailRequest);

                log.info("RAW email queued");

                return new PublicSendResponse(
                        resp.getStatus(),
                        "RAW",
                        "Email accepted and queued"
                );

            } else {

                TemplateEmailRequest tpl = new TemplateEmailRequest();

                tpl.setSender(request.getSender());
                tpl.setTemplateId(request.getTemplateId());
                tpl.setRecipients(request.getRecipients());
                tpl.setVariables(request.getVariables());
                tpl.setUserId(userId);
                tpl.setProjectId(projectId);
                tpl.setApiKey(apiKey);

                EmailResponse resp = sendTemplateEmail(tpl);

                log.info("TEMPLATE email queued");

                return new PublicSendResponse(
                        resp.getStatus(),
                        "TEMPLATE",
                        "Template email accepted and queued"
                );
            }

        } catch (TemplateNotFoundException e) {

            log.warn("Template not found");
            throw e;

        } catch (Exception e) {

            log.error("Send pipeline failure", e);
            throw new EmailQueueException("Failed to queue email");
        }
    }

    /**
     * Get email by ID
     */
    public EmailResponse getEmailById(String id) {
        Email email = emailDao.findById(id)
                .orElseThrow(() -> new RuntimeException("Email not found"));
        return mapToResponse(email);
    }

    /**
     * Get all emails (optionally by status)
     */
    public List<EmailResponse> getAllEmails(String status) {
        List<Email> emails;

        if (status == null || status.isBlank()) {
            emails = emailDao.findAll();
        } else {
            emails = emailDao.findByStatus(
                    Email.EmailStatus.valueOf(status.toUpperCase())
            );
        }

        return emails.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Delete email by ID
     */
    public void deleteEmail(String id) {
        Email email = emailDao.findById(id)
                .orElseThrow(() -> new RuntimeException("Email not found"));
        emailDao.delete(email);
        log.info("Email {} deleted", id);
    }

    /**
     * Basic stats per sender
     */
    public Map<String, EmailStatsResponse> getSenderWiseStats() {

        List<Email> emails = emailDao.findAll();
        Map<String, EmailStatsResponse> statsMap = new HashMap<>();

        for (Email email : emails) {
            String sender = email.getSender();

            EmailStatsResponse stats =
                    statsMap.getOrDefault(sender, new EmailStatsResponse());

            stats.setTotalEmails(stats.getTotalEmails() + 1);

            switch (email.getStatus()) {
                case QUEUED -> stats.setPendingEmails(stats.getPendingEmails() + 1);
                case SENT -> stats.setSentEmails(stats.getSentEmails() + 1);
                case FAILED -> stats.setFailedEmails(stats.getFailedEmails() + 1);
            }

            statsMap.put(sender, stats);
        }

        return statsMap;
    }

    private EmailResponse mapToResponse(Email email) {
        EmailResponse response = new EmailResponse();
        response.setId(email.getId());
        response.setSender(email.getSender());
        response.setRecipients(email.getRecipients());
        response.setSubject(email.getSubject());
        response.setStatus(email.getStatus().name());
        response.setProjectId(email.getProjectId());
        response.setCreatedAt(email.getCreatedAt());
        response.setSentAt(email.getSentAt());
        return response;
    }

}
