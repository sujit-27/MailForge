package com.mailforge.auth_service.dto;

import lombok.Data;

@Data
public class LogoutRequest {

    private String userId;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}

