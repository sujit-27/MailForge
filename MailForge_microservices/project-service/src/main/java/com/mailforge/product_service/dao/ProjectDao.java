package com.mailforge.product_service.dao;

import com.mailforge.product_service.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectDao extends MongoRepository<Project, String> {

    boolean existsByNameAndUserId(String name, String userId);

    List<Project> findByUserId(String userId);

    Optional<Project> findByApiKey(String apiKey);
}
