package com.mailforge.auth_service.service;

import com.mailforge.auth_service.dao.RefreshTokenDao;
import com.mailforge.auth_service.dto.TokenValidationResponse;
import com.mailforge.auth_service.model.AuthUser;
import com.mailforge.auth_service.model.RefreshToken;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Date;

@Service
@Slf4j
public class JwtService {

    private final Key secretKey;
    private final long accessTokenExpiry;
    private final long refreshTokenExpiry;
    private final RefreshTokenDao refreshTokenDao;

    public JwtService(@Value("${jwt.secret}") String secret,
                      @Value("${jwt.access.expiry}") long accessTokenExpiry,
                      @Value("${jwt.refresh.expiry}") long refreshTokenExpiry,
                      RefreshTokenDao refreshTokenDao
    ){
        // Ensure secret is long enough for HS256
        byte[] keyBytes = Base64.getDecoder().decode(secret);
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
        this.accessTokenExpiry = accessTokenExpiry;
        this.refreshTokenExpiry = refreshTokenExpiry;
        this.refreshTokenDao = refreshTokenDao;
    }

    public String generateAccessToken(AuthUser authUser) {
        return Jwts.builder()
                .setSubject(authUser.getUserId())
                .claim("email", authUser.getEmail())
                .claim("role", authUser.getRole().name()) // Added role for Gateway RBAC
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpiry))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(AuthUser authUser) {
        String token = Jwts.builder()
                .setSubject(authUser.getUserId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpiry))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(token);
        refreshToken.setUserId(authUser.getUserId());
        refreshToken.setExpiresAt(LocalDateTime.now().plus(refreshTokenExpiry, ChronoUnit.MILLIS));

        refreshTokenDao.save(refreshToken);
        return token;
    }

    public void validateRefreshToken(String token, String expectedUserId) {
        RefreshToken storedToken = refreshTokenDao.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        if (!storedToken.getUserId().equals(expectedUserId)) {
            throw new RuntimeException("Token owner mismatch");
        }

        if (storedToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            refreshTokenDao.delete(storedToken);
            throw new RuntimeException("Refresh token expired");
        }
    }

    public TokenValidationResponse validateAccessToken(String token) {
        try {
            Claims claims = parseClaims(token);
            TokenValidationResponse response = new TokenValidationResponse();
            response.setValid(true);
            response.setUserId(claims.getSubject());
            response.setEmail(claims.get("email", String.class));
            return response;
        } catch (ExpiredJwtException ex) {
            return createErrorResponse("TOKEN_EXPIRED");
        } catch (JwtException ex) {
            return createErrorResponse("INVALID_TOKEN");
        }
    }

    public String getUserIdFromToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (Exception e) {
            throw new RuntimeException("Could not extract user info from token");
        }
    }

    private TokenValidationResponse createErrorResponse(String error) {
        TokenValidationResponse response = new TokenValidationResponse();
        response.setValid(false);
        response.setError(error);
        return response;
    }

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public void invalidateRefreshToken(String refreshToken) {
        refreshTokenDao.deleteByToken(refreshToken);
    }

    public long getAccessTokenExpiry() { return accessTokenExpiry; }
}