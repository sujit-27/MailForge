package com.mailforge.analytics_service.dao;

import com.mailforge.analytics_service.model.EmailDelivery;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface EmailAnalyticsDao
        extends MongoRepository<EmailDelivery, String> {

    List<EmailDelivery> findByProjectId(String projectId);

    // Fetch logs by project and status
    List<EmailDelivery> findByProjectIdAndStatus(String projectId, EmailDelivery.EmailStatus status);

    // Counts for stats
    long countByProjectId(String projectId);

    long countByProjectIdAndStatus(String projectId, EmailDelivery.EmailStatus status);

    Long countByUserId(String userId);

    Long countByUserIdAndStatus(String userId, String processing);

    long countByUserIdAndStatusAndCreatedAtBetween(
            String userId,
            String status,
            LocalDateTime start,
            LocalDateTime end
    );
}

