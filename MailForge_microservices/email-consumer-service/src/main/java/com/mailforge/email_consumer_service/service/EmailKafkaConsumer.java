package com.mailforge.email_consumer_service.service;

import com.mailforge.email_consumer_service.dao.EmailLogDao;
import com.mailforge.email_consumer_service.model.Email;
import com.mailforge.email_consumer_service.model.EmailLog;
import com.mailforge.quota.grpc.QuotaServiceGrpc;
import com.mailforge.quota.grpc.RecordSendRequest;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static com.mailforge.email_consumer_service.model.EmailLog.EmailStatus.*;

@Slf4j
@Service
public class EmailKafkaConsumer {

    private static final Logger log = LoggerFactory.getLogger(EmailKafkaConsumer.class);

    @Autowired
    private EmailLogDao emailLogDao;

    @Autowired
    private WebClient brevoWebClient;

    @Value("${kafka.email.max-retries:3}")
    private int maxRetries;

    // ✅ FIXED / REGISTERED BREVO SENDER
    @Value("${mail.sender.email}")
    private String systemSenderEmail;

    @Value("${mail.sender.name:MailForge}")
    private String systemSenderName;

    private final QuotaServiceGrpc.QuotaServiceBlockingStub quotaStub;

    public EmailKafkaConsumer(QuotaServiceGrpc.QuotaServiceBlockingStub quotaStub) {
        this.quotaStub = quotaStub;
    }

    @KafkaListener(
            topics = "email-queue",
            groupId = "email-consumer-group",
            concurrency = "3",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void consumeEmail(Email event, Acknowledgment acknowledgment) {

        log.info("📥 Received email event from Kafka (user sender: {})", event.getSender());

        EmailLog logEntry = new EmailLog();
        logEntry.setProjectId(event.getProjectId());
        logEntry.setSender(event.getSender()); // user-provided (for reference)
        logEntry.setRecipients(event.getRecipients());
        logEntry.setSubject(event.getSubject());
        logEntry.setStatus(PROCESSING);
        logEntry.setMessage("Email received from Kafka");
        logEntry.setAttemptNumber(0);
        logEntry.setCreatedAt(LocalDateTime.now());

        emailLogDao.save(logEntry);

        int attempt = 0;
        boolean sent = false;

        while (!sent && attempt < maxRetries) {
            try {

                brevoWebClient.post()
                        .bodyValue(buildBrevoPayload(event))
                        .retrieve()
                        .onStatus(
                                status -> status.is4xxClientError() || status.is5xxServerError(),
                                response -> response.bodyToMono(String.class)
                                        .map(body -> new RuntimeException("Brevo error: " + body))
                        )
                        .bodyToMono(String.class)
                        .block();

                // ✅ SUCCESS
                logEntry.setStatus(SENT);
                logEntry.setMessage("Email sent successfully via Brevo");
                logEntry.setAttemptNumber(attempt + 1);
                logEntry.setLastRetryAt(LocalDateTime.now());
                emailLogDao.save(logEntry);

                quotaStub.recordSend(
                        RecordSendRequest.newBuilder()
                                .setUserId(event.getUserId())
                                .setRecipientsCount(event.getRecipients().size())
                                .build()
                );

                log.info("Quota Service Updated with {} more emails", event.getRecipients().size());

                acknowledgment.acknowledge();
                sent = true;

                log.info("✅ Email sent successfully to {}", event.getRecipients());

            } catch (Exception ex) {
                attempt++;

                log.error("Attempt {} failed for email {}", attempt, event.getSender(), ex);

                logEntry.setStatus(FAILED);
                logEntry.setMessage("Attempt " + attempt + " failed: " + ex.getMessage());
                logEntry.setAttemptNumber(attempt);
                logEntry.setLastRetryAt(LocalDateTime.now());
                emailLogDao.save(logEntry);

                if (attempt < maxRetries) {
                    try {
                        long delayMs = (long) Math.pow(2, attempt) * 1000L;
                        Thread.sleep(delayMs);
                        log.info("⏳ Retrying email after {} ms", delayMs);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        break;
                    }
                } else {
                    acknowledgment.acknowledge(); // prevent infinite retry
                    log.error("❌ Max retries reached. Giving up.");
                }
            }
        }
    }

    // ✅ BREVO PAYLOAD WITH FIXED SENDER + USER REPLY-TO
//    private String buildBrevoPayload(Email email) {
//
//        List<String> recipients = email.getRecipients();
//        StringBuilder toArray = new StringBuilder("[");
//
//        for (int i = 0; i < recipients.size(); i++) {
//            toArray.append("{\"email\":\"").append(recipients.get(i)).append("\"}");
//            if (i < recipients.size() - 1) {
//                toArray.append(",");
//            }
//        }
//        toArray.append("]");
//
//        return "{"
//                + "\"sender\": {"
//                + "\"email\": \"" + systemSenderEmail + "\","
//                + "\"name\": \"" + systemSenderName + "\""
//                + "},"
//                + "\"replyTo\": {"
//                + "\"email\": \"" + email.getSender() + "\""
//                + "},"
//                + "\"to\": " + toArray + ","
//                + "\"subject\": \"" + email.getSubject() + "\","
//                + "\"htmlContent\": \"" + email.getBody().replace("\"", "\\\"") + "\""
//                + "}";
//    }

    private Map<String, Object> buildBrevoPayload(Email email) {

        return Map.of(
                "sender", Map.of(
                        "email", systemSenderEmail,
                        "name", systemSenderName
                ),

                "replyTo", Map.of(
                        "email", email.getSender()
                ),

                "to", email.getRecipients()
                        .stream()
                        .map(r -> Map.of("email", r))
                        .toList(),

                "subject", email.getSubject(),

                "htmlContent", email.getBody().replace("\n", "<br/>")
        );
    }

}
