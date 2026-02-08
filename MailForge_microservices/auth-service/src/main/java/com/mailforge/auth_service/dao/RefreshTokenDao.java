package com.mailforge.auth_service.dao;

import com.mailforge.auth_service.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenDao extends JpaRepository<RefreshToken, String> {

    Optional<RefreshToken> findByToken(String refreshToken);

    void deleteByToken(String refreshToken);

    RefreshToken findByUserId(String userId);
}
