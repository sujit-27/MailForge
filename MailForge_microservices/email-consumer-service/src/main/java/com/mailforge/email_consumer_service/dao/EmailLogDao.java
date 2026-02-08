package com.mailforge.email_consumer_service.dao;

import com.mailforge.email_consumer_service.model.EmailLog;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface EmailLogDao extends MongoRepository<EmailLog, String> {

    List<EmailLog> findByEmailId(String emailId);

}
