package com.mailforge.template_service.dao;

import com.mailforge.template_service.model.Template;
import com.mailforge.template_service.model.TemplateStatus;
import com.mailforge.template_service.model.TemplateVisibility;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface TemplateDao extends MongoRepository<Template, String> {

    // SYSTEM templates
    List<Template> findByVisibilityAndStatus(
            TemplateVisibility visibility,
            TemplateStatus status
    );

    List<Template> findByVisibilityAndTagAndStatus(
            TemplateVisibility visibility,
            String tag,
            TemplateStatus status
    );

    // USER templates
    List<Template> findByOwnerUserIdAndStatus(
            String ownerUserId,
            TemplateStatus status
    );

    long countByOwnerUserIdAndStatus(
            String ownerUserId,
            TemplateStatus status
    );

    Optional<Template> findByIdAndStatus(
            String id,
            TemplateStatus status
    );
}

