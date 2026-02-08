package com.mailforge.gateway.dto;

public class TokenValidationRequest {
    private final String accessToken;

    public TokenValidationRequest(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getAccessToken() {
        return accessToken;
    }
}

