package com.mailforge.email_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailRequest {

    @NotBlank(message = "Sender cannot be empty")
    @Email(message = "Sender must be a valid email address")
    private String sender;

    private String userId;

    @NotEmpty(message = "At least one recipient is required")
    private List<@Email(message = "Recipient must be a valid email address") String> recipients;

    @NotBlank(message = "Subject cannot be empty")
    private String subject;

    @NotBlank(message = "Body cannot be empty")
    private String body;

    @NotBlank(message = "Project ID cannot be empty")
    private String projectId;

    @NotBlank(message = "API Key cannot be empty")
    private String apiKey;

    // Getters and Setters (Optional if using Lombok)
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

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
