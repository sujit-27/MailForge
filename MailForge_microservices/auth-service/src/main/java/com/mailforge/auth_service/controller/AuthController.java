package com.mailforge.auth_service.controller;

import com.mailforge.auth_service.dto.*;
import com.mailforge.auth_service.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(
            @RequestBody GoogleUser request) {
        return ResponseEntity.ok(authService.googleAuth(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(
            @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request));
    }

    @PostMapping("/validate")
    public ResponseEntity<TokenValidationResponse> validate(
            @RequestBody TokenValidationRequest request) {
        return ResponseEntity.ok(authService.validateToken(request));
    }

//    @PostMapping("/validate")
//    public ResponseEntity<TokenValidationResponse> validate(
//            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
//
//        // Check if the header starts with Bearer
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//
//        // Extract just the token part
//        String token = authHeader.substring(7);
//
//        TokenValidationRequest request = new TokenValidationRequest(token);
//        return ResponseEntity.ok(authService.validateToken(request));
//    }


    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @RequestBody LogoutRequest request) {
        authService.logout(request);
        return ResponseEntity.ok().build();
    }
}
