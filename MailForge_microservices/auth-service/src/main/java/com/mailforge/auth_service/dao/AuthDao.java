package com.mailforge.auth_service.dao;

import com.mailforge.auth_service.model.AuthUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthDao extends JpaRepository<AuthUser, String > {

    Optional<AuthUser> findByEmail(String email);

    Optional<AuthUser> findByUserId(String userId);

    boolean existsByEmail(String email);
}
