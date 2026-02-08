package com.mailforge.gateway.dto;

public class TokenValidationResponse {
    private boolean valid;
    private String userId;
    private String role;

    public boolean isValid() {
        return valid;
    }

    public String getUserId() {
        return userId;
    }

    public String getRole() {
        return role;
    }
}
