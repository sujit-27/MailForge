package com.mailforge.payment_service.dto;

public class CreateOrderRequest {

    private String userId;
    private String planType;   // PROFESSIONAL, ULTIMATE
    private Double amount;

    public String getPlanType() {
        return planType;
    }

    public void setPlanType(String planType) {
        this.planType = planType;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
