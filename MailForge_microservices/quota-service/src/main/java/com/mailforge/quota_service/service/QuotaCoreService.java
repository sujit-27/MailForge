package com.mailforge.quota_service.service;

import com.mailforge.quota_service.dao.EmailQuotaUsageDao;
import com.mailforge.quota_service.dto.QuotaCheckResult;
import com.mailforge.quota_service.model.EmailQuotaUsage;
import com.mailforge.quota_service.policy.PlanLimitResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class QuotaCoreService {

    private final EmailQuotaUsageDao repository;

    private static final Logger log = LoggerFactory.getLogger(QuotaCoreService.class);

    public QuotaCoreService(EmailQuotaUsageDao repository) {
        this.repository = repository;
    }

    @Transactional
    public QuotaCheckResult canSend(String userId, int recipientsCount) {

        EmailQuotaUsage usage = repository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("Quota not initialized. Call SyncPlan first."));

        resetIfNewDay(usage);

        int dailyLimit = usage.getDailyLimit();
        int usedToday = usage.getUsedToday();

        if (dailyLimit != Integer.MAX_VALUE && usedToday + recipientsCount > dailyLimit) {

            log.info("Remaining Limit {}",dailyLimit - (usedToday + recipientsCount));
            return QuotaCheckResult.blocked(
                    dailyLimit - usedToday,
                    "DAILY_LIMIT_EXCEEDED"
            );
        }

        int remaining = (dailyLimit == Integer.MAX_VALUE)
                ? Integer.MAX_VALUE
                : dailyLimit - (usedToday + recipientsCount);

        log.info("Allowed and Left Emails are {}", remaining);
        return QuotaCheckResult.allowed(remaining);
    }

    @Transactional
    public void recordSend(String userId, int recipientsCount) {
        EmailQuotaUsage usage = repository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("Quota record not found for user: " + userId));

        resetIfNewDay(usage);
        usage.setUsedToday(usage.getUsedToday() + recipientsCount);
        log.info("{} Emails sent", recipientsCount);
        repository.save(usage);
    }

    @Transactional
    public void syncPlan(String userId, String newPlanType) {
        int newLimit = PlanLimitResolver.getDailyLimit(newPlanType);

        EmailQuotaUsage usage = repository.findById(userId)
                .orElse(new EmailQuotaUsage());

        usage.setUserId(userId);
        usage.setPlanType(newPlanType);
        usage.setDailyLimit(newLimit);

        if (usage.getLastReset() == null) {
            usage.setUsedToday(0);
            usage.setLastReset(LocalDate.now());
        }
        log.info("New plan synced {}", newPlanType);

        repository.save(usage);
    }

    private EmailQuotaUsage initializeUser(String userId, String planType) {
        int limit = PlanLimitResolver.getDailyLimit(planType);

        EmailQuotaUsage usage = new EmailQuotaUsage();
        usage.setUserId(userId);
        usage.setPlanType(planType);
        usage.setDailyLimit(limit);
        usage.setUsedToday(0);
        usage.setLastReset(LocalDate.now());

        return repository.save(usage);
    }

    private void resetIfNewDay(EmailQuotaUsage usage) {
        LocalDate today = LocalDate.now();

        if (!today.equals(usage.getLastReset())) {
            usage.setUsedToday(0);
            usage.setLastReset(today);
            repository.save(usage);
        }
    }
}

