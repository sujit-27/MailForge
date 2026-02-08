package com.mailforge.payment_service.model;


import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String userId;

    @Column(nullable = false)
    private String planType;     // STANDARD, PROFESSIONAL, ULTIMATE

    @Column(nullable = false)
    private String status;       // ACTIVE, CANCELED, EXPIRED

    @Column(nullable = false)
    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private String lastPaymentId;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getLastPaymentId() {
        return lastPaymentId;
    }

    public void setLastPaymentId(String lastPaymentId) {
        this.lastPaymentId = lastPaymentId;
    }
}
