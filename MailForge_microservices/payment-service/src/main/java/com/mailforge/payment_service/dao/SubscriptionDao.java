package com.mailforge.payment_service.dao;

import com.mailforge.payment_service.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubscriptionDao extends JpaRepository<Subscription, String> {
    Optional<Subscription> findByUserId(String userId);
}
