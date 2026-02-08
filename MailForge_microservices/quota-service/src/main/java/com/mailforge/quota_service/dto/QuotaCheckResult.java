package com.mailforge.quota_service.dto;

public class QuotaCheckResult {

    private final boolean allowed;
    private final int remaining;
    private final String reason;

    private QuotaCheckResult(boolean allowed, int remaining, String reason) {
        this.allowed = allowed;
        this.remaining = remaining;
        this.reason = reason;
    }

    public static QuotaCheckResult allowed(int remaining) {
        return new QuotaCheckResult(true, remaining, "OK");
    }

    public static QuotaCheckResult blocked(int remaining, String reason) {
        return new QuotaCheckResult(false, remaining, reason);
    }

    public boolean isAllowed() { return allowed; }
    public int getRemaining() { return remaining; }
    public String getReason() { return reason; }
}

