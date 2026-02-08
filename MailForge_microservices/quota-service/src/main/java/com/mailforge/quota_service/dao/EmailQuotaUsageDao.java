package com.mailforge.quota_service.dao;

import com.mailforge.quota_service.model.EmailQuotaUsage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailQuotaUsageDao extends JpaRepository<EmailQuotaUsage, String> {

}

