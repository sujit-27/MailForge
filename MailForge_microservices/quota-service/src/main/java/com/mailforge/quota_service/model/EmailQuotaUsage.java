package com.mailforge.quota_service.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "email_quota_usage")
public class EmailQuotaUsage {

    @Id
    @Column(name = "user_id", nullable = false, length = 64)
    private String userId;

    @Column(name = "plan_type", nullable = false, length = 20)
    private String planType; // FREE, PROFESSIONAL, ULTIMATE

    @Column(name = "daily_limit", nullable = false)
    private int dailyLimit;

    @Column(name = "used_today", nullable = false)
    private int usedToday;

    @Column(name = "last_reset", nullable = false)
    private LocalDate lastReset;

    // --- Constructors ---
    public EmailQuotaUsage() {}

    public EmailQuotaUsage(String userId, String planType, int dailyLimit, int usedToday, LocalDate lastReset) {
        this.userId = userId;
        this.planType = planType;
        this.dailyLimit = dailyLimit;
        this.usedToday = usedToday;
        this.lastReset = lastReset;
    }

    // --- Getters & Setters ---
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getPlanType() { return planType; }
    public void setPlanType(String planType) { this.planType = planType; }

    public int getDailyLimit() { return dailyLimit; }
    public void setDailyLimit(int dailyLimit) { this.dailyLimit = dailyLimit; }

    public int getUsedToday() { return usedToday; }
    public void setUsedToday(int usedToday) { this.usedToday = usedToday; }

    public LocalDate getLastReset() { return lastReset; }
    public void setLastReset(LocalDate lastReset) { this.lastReset = lastReset; }
}

