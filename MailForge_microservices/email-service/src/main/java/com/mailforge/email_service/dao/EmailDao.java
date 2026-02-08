package com.mailforge.email_service.dao;

import com.mailforge.email_service.model.Email;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmailDao extends MongoRepository<Email, String> {

    List<Email> findByStatus(Email.EmailStatus status);

    List<Email> findByRecipientsContaining(String recipient);

    long countByStatus(Email.EmailStatus queued);
}
