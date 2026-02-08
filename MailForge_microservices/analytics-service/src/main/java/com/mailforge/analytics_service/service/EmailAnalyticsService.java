package com.mailforge.analytics_service.service;

import com.mailforge.analytics_service.dao.EmailAnalyticsDao;
import com.mailforge.analytics_service.dto.DailyMetric;
import com.mailforge.analytics_service.dto.ProjectEmailStatsResponse;
import com.mailforge.analytics_service.dto.SenderEmailStatsResponse;
import com.mailforge.analytics_service.model.EmailDelivery;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class EmailAnalyticsService {

    // Initialize the logger for this class
    private static final Logger logger = LoggerFactory.getLogger(EmailAnalyticsService.class);

    private final EmailAnalyticsDao repository;

    public EmailAnalyticsService(EmailAnalyticsDao repository) {
        this.repository = repository;
    }

    /**
     * Aggregates stats by project with validation and logging.
     */
    @Transactional(readOnly = true)
    public ProjectEmailStatsResponse getProjectStats(String projectId) {
        if (projectId == null || projectId.trim().isEmpty()) {
            logger.error("Attempted to fetch stats with null or empty ProjectID");
            return new ProjectEmailStatsResponse(0, 0, 0, 0, 0);
        }

        logger.info("Generating analytics summary for Project: {}", projectId);

        long total = repository.countByProjectId(projectId);
        long sent = repository.countByProjectIdAndStatus(projectId, EmailDelivery.EmailStatus.SENT);
        long failed = repository.countByProjectIdAndStatus(projectId, EmailDelivery.EmailStatus.FAILED);
        long processing = repository.countByProjectIdAndStatus(projectId, EmailDelivery.EmailStatus.PROCESSING);
        long retry = repository.countByProjectIdAndStatus(projectId, EmailDelivery.EmailStatus.RETRY);

        logger.info("Stats generated: [Total: {}, Sent: {}, Processing: {}, Failed: {}, Retry: {}]", total, sent, processing, failed, retry);

        return new ProjectEmailStatsResponse(total,processing, sent, failed, retry);
    }

    /**
     * Fetches logs with validation.
     */
    @Transactional(readOnly = true)
    public List<EmailDelivery> getLogsByProject(String projectId) {
        if (projectId == null || projectId.trim().isEmpty()) {
            logger.warn("Search attempted with invalid ProjectID. Returning empty list.");
            return new ArrayList<>();
        }

        logger.info("Fetching transmission logs for Project: {}", projectId);
        return repository.findByProjectId(projectId);
    }

    /**
     * Fetches filtered logs with validation.
     */
    @Transactional(readOnly = true)
    public List<EmailDelivery> getLogsByProjectAndStatus(String projectId, EmailDelivery.EmailStatus status) {
        if (projectId == null || status == null) {
            logger.error("Invalid filter request: ProjectID: {}, Status: {}", projectId, status);
            return new ArrayList<>();
        }

        logger.info("Filtering logs for Project: {} with Status: {}", projectId, status);
        return repository.findByProjectIdAndStatus(projectId, status);
    }

    public SenderEmailStatsResponse getStatsFromUser(String userId) {

        Long totalRequested = repository.countByUserId(userId);
        Long pendingCount = repository.countByUserIdAndStatus(userId, "PROCESSING");
        Long failedCount = repository.countByUserIdAndStatus(userId, "FAILED");
        Long sentCount = repository.countByUserIdAndStatus(userId, "SENT");

        SenderEmailStatsResponse stats = new SenderEmailStatsResponse();
        stats.setEmail(userId);
        stats.setTotal(totalRequested != null ? totalRequested : 0);
        stats.setProcessing(pendingCount != null ? pendingCount : 0);
        stats.setSent(sentCount != null ? sentCount : 0);
        stats.setFailed(failedCount != null ? failedCount : 0);

        return stats;
    }

    public DailyMetric getTodayStats(String userId) {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = LocalDateTime.now();

        long sent = repository.countByUserIdAndStatusAndCreatedAtBetween(userId, "SENT", start, end);
        long failed = repository.countByUserIdAndStatusAndCreatedAtBetween(userId, "FAILED", start, end);
        long processing = repository.countByUserIdAndStatusAndCreatedAtBetween(userId, "PROCESSING", start, end);

        DailyMetric response = new DailyMetric();
        response.setSent(sent);
        response.setTotal(sent+failed);
        response.setFailed(failed);
        response.setProcessing(processing);

        return response;
    }
}