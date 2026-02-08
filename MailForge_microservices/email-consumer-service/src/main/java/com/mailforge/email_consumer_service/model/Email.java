package com.mailforge.email_consumer_service.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@Builder
@Document(collection = "emails")
public class Email {

    @Id
    private String id;
    private String userId;
    private String projectId;
    private String sender;
    private List<String> recipients;
    private String subject;
    private String body;

    private EmailStatus status;

    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime sentAt;

    private int attemptCount;
    private LocalDateTime lastRetryAt;

    public Email(String sender, List<String> recipients, String subject, String body, int attemptCount, LocalDateTime lastRetryAt) {
        this.sender = sender;
        this.recipients = recipients;
        this.subject = subject;
        this.body = body;
        this.status = EmailStatus.QUEUED;
        this.createdAt = LocalDateTime.now();
        this.attemptCount = attemptCount;
        this.lastRetryAt = lastRetryAt;
    }

    public Email() {

    }

    public enum EmailStatus {
        PENDING,
        QUEUED,
        SENT,
        FAILED
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public List<String> getRecipients() {
        return recipients;
    }

    public void setRecipients(List<String> recipients) {
        this.recipients = recipients;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public EmailStatus getStatus() {
        return status;
    }

    public void setStatus(EmailStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    public int getAttemptCount() {
        return attemptCount;
    }

    public void setAttemptCount(int attemptCount) {
        this.attemptCount = attemptCount;
    }

    public LocalDateTime getLastRetryAt() {
        return lastRetryAt;
    }

    public void setLastRetryAt(LocalDateTime lastRetryAt) {
        this.lastRetryAt = lastRetryAt;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
