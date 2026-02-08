package com.project.MailForge.dao;

import com.project.MailForge.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDao extends JpaRepository<User, String> {

    boolean existsByEmail(String email);

    User findByEmail(String email);
}
