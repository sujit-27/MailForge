package com.mailforge.payment_service.dto;

import java.time.LocalDateTime;

public class SubscriptionDto {

    private String planType;     // STANDARD, PROFESSIONAL, ULTIMATE
    private String status;       // ACTIVE, CANCELED
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    public String getPlanType() {
        return planType;
    }

    public void setPlanType(String planType) {
        this.planType = planType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }
}
