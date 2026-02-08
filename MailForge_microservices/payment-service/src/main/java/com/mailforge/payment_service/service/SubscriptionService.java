package com.mailforge.payment_service.service;

import com.mailforge.payment_service.dao.SubscriptionDao;
import com.mailforge.payment_service.dto.SubscriptionDto;
import com.mailforge.payment_service.model.Subscription;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
public class SubscriptionService {

    private static final Logger log = LoggerFactory.getLogger(SubscriptionService.class);

    @Autowired
    private SubscriptionDao subscriptionDao;

    /**
     * Retrieves the current active subscription for a specific user.
     */
    public SubscriptionDto getCurrentUserSubscription(String userId) {
        log.info("Fetching subscription for user: {}", userId);

        return subscriptionDao.findByUserId(userId)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Subscription not found for user: " + userId));
    }

    @Transactional
    public void cancelCurrentPlan(String userId) {
        log.info("Canceling plan for user: {}", userId);

        Subscription sub = subscriptionDao.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("No active subscription to cancel"));

        sub.setStatus("CANCELED");
        subscriptionDao.save(sub);
    }

    @Transactional
    public void activatePlan(String userId, String planType, String paymentId) {
        log.info("Activating {} plan for user: {}", planType, userId);

        // Find existing or create new for "Upsert" logic
        Subscription sub = subscriptionDao.findByUserId(userId)
                .orElse(new Subscription());

        sub.setUserId(userId);
        sub.setPlanType(planType);
        sub.setStatus("ACTIVE");
        sub.setStartDate(LocalDateTime.now());

        // Setting end date for a 30-day standard cycle
        sub.setEndDate(LocalDateTime.now().plusDays(30));
        sub.setLastPaymentId(paymentId);

        subscriptionDao.save(sub);
        log.info("Subscription record persisted for user: {}", userId);
    }

    private SubscriptionDto mapToDto(Subscription sub) {
        SubscriptionDto dto = new SubscriptionDto();
        dto.setPlanType(sub.getPlanType());
        dto.setStatus(sub.getStatus());
        dto.setStartDate(sub.getStartDate());
        dto.setEndDate(sub.getEndDate());
        return dto;
    }
}