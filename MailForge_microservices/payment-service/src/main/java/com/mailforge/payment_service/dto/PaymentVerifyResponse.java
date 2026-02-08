package com.mailforge.payment_service.dto;

public class PaymentVerifyResponse {

    private String status;   // SUCCESS / FAILED

    public PaymentVerifyResponse(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
