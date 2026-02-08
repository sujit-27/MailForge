package com.mailforge.payment_service.dto;

import java.time.LocalDateTime;

public class TransactionDto {

    private String transactionId;
    private Double amount;
    private String currency;
    private String status;
    private String planType;
    private String paymentId;
    private String orderId;
    private LocalDateTime createdAt;

    public TransactionDto(String transactionId, Double amount, String currency, String status, String planType, String paymentId, String orderId, LocalDateTime createdAt) {
        this.transactionId = transactionId;
        this.amount = amount;
        this.currency = currency;
        this.status = status;
        this.planType = planType;
        this.paymentId = paymentId;
        this.orderId = orderId;
        this.createdAt = createdAt;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPlanType() {
        return planType;
    }

    public void setPlanType(String planType) {
        this.planType = planType;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
