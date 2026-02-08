package com.mailforge.payment_service.dto;

public class PaymentResult {

    private boolean success;
    private String userId;
    private String planType;
    private String paymentId;
    private String orderId;
    private String status; // SUCCESS / FAILED

    public PaymentResult(boolean success, String userId, String planType, String razorpayPaymentId, String razorpayOrderId, String status) {
        this.success = success;
        this.userId = userId;
        this.planType = planType;
        this.paymentId = razorpayPaymentId;
        this.orderId = razorpayOrderId;
        this.status = status;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
