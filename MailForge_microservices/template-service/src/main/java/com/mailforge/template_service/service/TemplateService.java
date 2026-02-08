package com.mailforge.template_service.service;

import com.mailforge.ai.grpc.AiTemplateServiceGrpc;
import com.mailforge.ai.grpc.GenerateTemplateRequest;
import com.mailforge.ai.grpc.GenerateTemplateResponse;
import com.mailforge.template_service.dto.*;
import com.mailforge.template_service.model.*;
import com.mailforge.template_service.dao.TemplateDao;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TemplateService {

    private static final int PROFESSIONAL_TEMPLATE_LIMIT = 10;

    private final TemplateDao templateRepository;
    private final AiTemplateServiceGrpc.AiTemplateServiceBlockingStub aiTemplateStub;

    public TemplateService(
            TemplateDao templateRepository,
            AiTemplateServiceGrpc.AiTemplateServiceBlockingStub aiTemplateStub
    ) {
        this.templateRepository = templateRepository;
        this.aiTemplateStub = aiTemplateStub;
    }

    // ================= SYSTEM TEMPLATES =================

    public List<TemplateResponse> getSystemTemplates(String tag) {
        List<Template> templates =
                (tag == null)
                        ? templateRepository.findByVisibilityAndStatus(
                        TemplateVisibility.SYSTEM, TemplateStatus.ACTIVE)
                        : templateRepository.findByVisibilityAndTagAndStatus(
                        TemplateVisibility.SYSTEM, tag, TemplateStatus.ACTIVE);

        return templates.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<TemplateResponse> getUserTemplates(String userId) {
        return templateRepository
                .findByOwnerUserIdAndStatus(userId, TemplateStatus.ACTIVE)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public TemplateResponse createTemplate(String userId, CreateTemplateRequest request) {

        long existingTemplates =
                templateRepository.countByOwnerUserIdAndStatus(userId, TemplateStatus.ACTIVE);

        if (existingTemplates >= PROFESSIONAL_TEMPLATE_LIMIT) {
            throw new IllegalStateException("Template limit exceeded for your plan");
        }

        Template template = new Template();
        template.setVisibility(TemplateVisibility.USER);
        template.setOwnerUserId(userId);
        template.setName(request.getName());
        template.setTag(request.getTag());
        template.setSubjectTemplate(request.getSubjectTemplate());
        template.setBodyTemplate(request.getBodyTemplate());
        template.setVariables(request.getVariables());
        template.setVersion(1);
        template.setStatus(TemplateStatus.ACTIVE);
        template.setAiPrompt(request.getAiPrompt());
        template.setCreatedAt(LocalDateTime.now());
        template.setUpdatedAt(LocalDateTime.now());

        return toResponse(templateRepository.save(template));
    }

    public TemplateResponse getTemplateById(String userId, String templateId) {
        Template template = templateRepository
                .findByIdAndStatus(templateId, TemplateStatus.ACTIVE)
                .orElseThrow(() -> new IllegalArgumentException("Template not found"));

        // SYSTEM templates are accessible to all
        if (template.getVisibility() == TemplateVisibility.SYSTEM) {
            return toResponse(template);
        }

        // USER template ownership check
        if (!userId.equals(template.getOwnerUserId())) {
            throw new SecurityException("You do not own this template");
        }

        return toResponse(template);
    }

    public TemplateResponse updateTemplate(
            String userId,
            String templateId,
            UpdateTemplateRequest request
    ) {
        Template template = templateRepository
                .findByIdAndStatus(templateId, TemplateStatus.ACTIVE)
                .orElseThrow(() -> new IllegalArgumentException("Template not found"));

        if (!userId.equals(template.getOwnerUserId())) {
            throw new SecurityException("You do not own this template");
        }

        template.setSubjectTemplate(request.getSubjectTemplate());
        template.setBodyTemplate(request.getBodyTemplate());
        template.setVariables(request.getVariables());
        template.setVersion(template.getVersion() + 1);
        template.setUpdatedAt(LocalDateTime.now());

        return toResponse(templateRepository.save(template));
    }

    public void archiveTemplate(String userId, String templateId) {
        Template template = templateRepository
                .findByIdAndStatus(templateId, TemplateStatus.ACTIVE)
                .orElseThrow(() -> new IllegalArgumentException("Template not found"));

        if (!userId.equals(template.getOwnerUserId())) {
            throw new SecurityException("You do not own this template");
        }

        template.setStatus(TemplateStatus.ARCHIVED);
        template.setUpdatedAt(LocalDateTime.now());
        templateRepository.save(template);
    }

    public AiGenerateTemplateResponse generateTemplateWithAI(
            String userId,
            AiGenerateTemplateRequest request
    ) {

        // 1️⃣ Enforce plan limit (count SAVED templates only)
        long existingTemplates =
                templateRepository.countByOwnerUserIdAndStatus(userId, TemplateStatus.ACTIVE);

        if (existingTemplates >= PROFESSIONAL_TEMPLATE_LIMIT) {
            throw new IllegalStateException("Template limit exceeded for your plan");
        }

        // 2️⃣ Call AI-service via gRPC
        GenerateTemplateResponse aiResponse =
                aiTemplateStub.generateTemplate(
                        GenerateTemplateRequest.newBuilder()
                                .setPrompt(request.getPrompt())
                                .setTone(request.getTag())
                                .build()
                );

        // 3️⃣ Generate a suggested name (simple & reliable)
        String suggestedName = deriveNameFromPrompt(request.getPrompt(), request.getTag());

        // 4️⃣ Return DRAFT (not saved)
        return new AiGenerateTemplateResponse(
                suggestedName,
                aiResponse.getSubjectTemplate(),
                aiResponse.getBodyTemplate(),
                aiResponse.getVariablesList()
        );
    }

    private String deriveNameFromPrompt(String prompt, String tag) {

        String lower = prompt.toLowerCase();

        if (lower.contains("onboarding")) {
            return "SaaS Onboarding";
        }
        if (lower.contains("welcome")) {
            return "Welcome Email";
        }
        if (lower.contains("otp")) {
            return "OTP Verification";
        }

        return tag+" Template";
    }

    private TemplateResponse toResponse(Template template) {
        TemplateResponse res = new TemplateResponse();
        res.setTemplateId(template.getId());
        res.setName(template.getName());
        res.setTag(template.getTag());
        res.setSubjectTemplate(template.getSubjectTemplate());
        res.setBodyTemplate(template.getBodyTemplate());
        res.setVariables(template.getVariables());
        res.setVersion(template.getVersion());
        res.setStatus(template.getStatus().name());
        res.setSystemTemplate(template.getVisibility() == TemplateVisibility.SYSTEM);
        res.setCreatedAt(template.getCreatedAt());
        res.setUpdatedAt(template.getUpdatedAt());
        return res;
    }
}

