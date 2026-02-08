package com.mailforge.auth_service.service;

import auth.CreateUserRequest;
import auth.UserResponse;
import com.mailforge.auth_service.dao.AuthDao;
import com.mailforge.auth_service.dao.RefreshTokenDao;
import com.mailforge.auth_service.dto.*;
import com.mailforge.auth_service.grpc.AuthGrpcServiceClient;
import com.mailforge.auth_service.model.AccountStatus;
import com.mailforge.auth_service.model.AuthUser;
import com.mailforge.auth_service.model.RefreshToken;
import com.mailforge.auth_service.model.UserRole;
import io.grpc.StatusRuntimeException;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j // Using Lombok for logging
public class AuthService {

    @Autowired
    private AuthDao authDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthGrpcServiceClient grpcClient;

    @Autowired
    private RefreshTokenDao refreshTokenDao;

    @Value("${google.client.id}")
    private String clientId;

    @Value("${google.client.secret}")
    private String clientSecret;

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Starting registration process for email: {}", request.getEmail());

        if (authDao.existsByEmail(request.getEmail())) {
            log.warn("Registration failed: Email {} already exists in Auth database", request.getEmail());
            throw new RuntimeException("Email is already Registered!!");
        }

        // 1. Hash Password
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        // 2. Prepare gRPC Request
        CreateUserRequest grpcRequest = CreateUserRequest.newBuilder()
                .setEmail(request.getEmail())
                .setFirstName(request.getFirstName())
                .setLastName(request.getLastName())
                .build();

        UserResponse grpcResponse;
        try {
            log.info("Calling User Service via gRPC for {}", request.getEmail());
            grpcResponse = grpcClient.createUser(grpcRequest);
            log.info("User profile created with ID {}", grpcResponse.getId());
        } catch (StatusRuntimeException e) {
            log.error("User service gRPC failed: {}", e.getStatus(), e);
            throw new RuntimeException("User registration failed");
        }

        // 3. Create and Save Auth User
        AuthUser authUser = new AuthUser();
        authUser.setUserId(grpcResponse.getId());
        authUser.setEmail(request.getEmail());
        authUser.setPassword(hashedPassword);
        authUser.setStatus(AccountStatus.ACTIVE);
        authUser.setRole(UserRole.valueOf(grpcResponse.getRole()));

        authDao.save(authUser);

        // 3. Generate Tokens
        String accessToken = jwtService.generateAccessToken(authUser);
        String refreshToken = jwtService.generateRefreshToken(authUser);

        log.info("Auth credentials saved for userId: {}", authUser.getUserId());

        log.info("Tokens generated successfully for user: {}", request.getEmail());

        return createAuthResponse(authUser, accessToken, refreshToken);
    }

    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());

        AuthUser authUser = authDao.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.warn("Login failed: Email {} not found", request.getEmail());
                    return new RuntimeException("Invalid credentials");
                });

        if (!passwordEncoder.matches(request.getPassword(), authUser.getPassword())) {
            log.warn("Login failed: Incorrect password for email {}", request.getEmail());
            throw new RuntimeException("Invalid credentials");
        }

        if (authUser.getStatus() != AccountStatus.ACTIVE) {
            log.warn("Login failed: Account {} is currently {}", request.getEmail(), authUser.getStatus());
            throw new RuntimeException("Account disabled");
        }

        String accessToken = jwtService.generateAccessToken(authUser);
        String refreshToken = jwtService.generateRefreshToken(authUser);

        log.info("User {} logged in successfully", request.getEmail());
        return createAuthResponse(authUser, accessToken, refreshToken);
    }

    public TokenResponse refreshToken(RefreshTokenRequest request) {
        log.info("Attempting to refresh token");

        // Use the new helper to get userId without full claim validation
        String userId = jwtService.getUserIdFromToken(request.getRefreshToken());

        AuthUser authUser = authDao.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate against DB record
        jwtService.validateRefreshToken(request.getRefreshToken(), userId);

        String newAccessToken = jwtService.generateAccessToken(authUser);

        TokenResponse response = new TokenResponse();
        response.setAccessToken(newAccessToken);
        response.setRefreshToken(request.getRefreshToken());
        response.setExpiresIn(jwtService.getAccessTokenExpiry());

        log.info("Token successfully refreshed for userId: {}", userId);
        return response;
    }

    public AuthResponse googleAuth(GoogleUser request) {

        // 1. We already have the email and names from the frontend!
        String email = request.getEmail();

        // 2. The rest of your existing logic stays the same
        Optional<AuthUser> existingUser = authDao.findByEmail(email);

        if (existingUser.isPresent()) {
            AuthUser user = existingUser.get();
            String accessToken = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);
            log.info("User {} logged in successfully", request.getEmail());
            return createAuthResponse(user, accessToken, refreshToken);
        } else {
            RegisterRequest registerRequest = new RegisterRequest();
            registerRequest.setEmail(email);
            registerRequest.setFirstName(request.getFirstName());
            registerRequest.setLastName(request.getLastName());
            registerRequest.setPassword("GOOGLE_USER_" + UUID.randomUUID());
            return this.register(registerRequest);
        }
    }

    public TokenValidationResponse validateToken(TokenValidationRequest request) {
        // Validation logic is usually quiet unless it's a failure
        return jwtService.validateAccessToken(request.getAccessToken());
    }

    @Transactional
    public void logout(LogoutRequest request) {
        log.info("UserId {}", request.getUserId());
        RefreshToken token = refreshTokenDao.findByUserId(request.getUserId());
        log.info("Invalidating session for token...");
        jwtService.invalidateRefreshToken(token.getToken());
    }

    // Helper method to reduce code duplication
    private AuthResponse createAuthResponse(AuthUser authUser, String access, String refresh) {
        AuthResponse authResponse = new AuthResponse();
        authResponse.setUserId(authUser.getUserId());
        authResponse.setEmail(authUser.getEmail());
        authResponse.setAccessToken(access);
        authResponse.setRefreshToken(refresh);
        authResponse.setExpiresIn(jwtService.getAccessTokenExpiry());
        return authResponse;
    }
}