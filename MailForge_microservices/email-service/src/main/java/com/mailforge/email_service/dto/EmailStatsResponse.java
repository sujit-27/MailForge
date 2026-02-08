package com.mailforge.email_service.dto;

import java.time.LocalDateTime;

public class EmailStatsResponse {
    private long totalEmails;
    private long pendingEmails;
    private long sentEmails;
    private long failedEmails;
    private int totalAttempts;
    private LocalDateTime lastRetryAt;

    public EmailStatsResponse() {}

    // Getters and setters
    public long getTotalEmails() { return totalEmails; }
    public void setTotalEmails(long totalEmails) { this.totalEmails = totalEmails; }

    public long getPendingEmails() { return pendingEmails; }
    public void setPendingEmails(long pendingEmails) { this.pendingEmails = pendingEmails; }

    public long getSentEmails() { return sentEmails; }
    public void setSentEmails(long sentEmails) { this.sentEmails = sentEmails; }

    public long getFailedEmails() { return failedEmails; }
    public void setFailedEmails(long failedEmails) { this.failedEmails = failedEmails; }

    public int getTotalAttempts() { return totalAttempts; }
    public void setTotalAttempts(int totalAttempts) { this.totalAttempts = totalAttempts; }

    public LocalDateTime getLastRetryAt() { return lastRetryAt; }
    public void setLastRetryAt(LocalDateTime lastRetryAt) { this.lastRetryAt = lastRetryAt; }
}
