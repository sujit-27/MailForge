package com.mailforge.product_service.service;

import com.mailforge.product_service.dao.ProjectDao;
import com.mailforge.product_service.dto.ProjectRequest;
import com.mailforge.product_service.dto.ProjectResponse;
import com.mailforge.product_service.grpc.UserServiceGrpcClient;
import com.mailforge.product_service.model.Project;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProjectService {

    @Autowired
    private ProjectDao projectDao;

    @Autowired
    private UserServiceGrpcClient userServiceGrpcClient;

    private static final Logger log = LoggerFactory.getLogger(ProjectService.class);

    public ProjectResponse createProject(ProjectRequest projectRequest) {

        String isValidUser = userServiceGrpcClient.userValidation(projectRequest.getUserId()).toString();

        if(isValidUser.equals("false")){
            throw new RuntimeException("Invalid User: " + projectRequest.getUserId());
        }

        if (projectDao.existsByNameAndUserId(projectRequest.getName(), projectRequest.getUserId())) {
            throw new RuntimeException("Project with this name already exists for this user");
        }

        String apiKey = UUID.randomUUID().toString().replace("-", "");

        Project project = new Project();
        project.setName(projectRequest.getName());
        project.setDescription(projectRequest.getDescription());
        project.setApiKey(apiKey);
        project.setUserId(projectRequest.getUserId());
        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());

        log.info("Project Successfully created : {}", project.getName());
        Project savedProject = projectDao.save(project);

        return new ProjectResponse(
                savedProject.getId(),
                savedProject.getName(),
                savedProject.getDescription(),
                savedProject.getApiKey(),
                savedProject.getUserId(),
                savedProject.getCreatedAt(),
                savedProject.getUpdatedAt()
        );
    }

    public List<ProjectResponse> getProjectsByUserId(String userId) {

        String isValidUser = userServiceGrpcClient.userValidation(userId).toString();

        if(isValidUser.equals("false")){
            throw new RuntimeException("Invalid User: " + userId);
        }
        List<Project> projects = projectDao.findByUserId(userId);

        return projects.stream().map(
                project -> new ProjectResponse(
                        project.getId(),
                        project.getName(),
                        project.getDescription(),
                        project.getApiKey(),
                        project.getUserId(),
                        project.getCreatedAt(),
                        project.getUpdatedAt()
                )
        ).toList();
    }

    public ProjectResponse getProjectById(String projectId){
        Project project = projectDao.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getApiKey(),
                project.getUserId(),
                project.getCreatedAt(),
                project.getUpdatedAt()
        );
    }

    public ProjectResponse updateProject(String projectId, ProjectRequest updatedRequest) {
        log.info("Request Received to update Project: {} ", updatedRequest.getName());

        String isValidUser = userServiceGrpcClient.userValidation(updatedRequest.getUserId()).toString();

        if(isValidUser.equals("false")){
            throw new RuntimeException("Invalid User: " + updatedRequest.getUserId());
        }

        Project project = projectDao.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        project.setName(updatedRequest.getName());
        project.setDescription(updatedRequest.getDescription());
        project.setUpdatedAt(LocalDateTime.now());

        log.info("Project Details Updated successfully for {}",updatedRequest.getName());
        Project savedProject = projectDao.save(project);
        return new ProjectResponse(
                savedProject.getId(),
                savedProject.getName(),
                savedProject.getDescription(),
                savedProject.getApiKey(),
                savedProject.getUserId(),
                savedProject.getCreatedAt(),
                savedProject.getUpdatedAt()
        );
    }

    public ProjectResponse regenerateApiKey(String projectId) {
        Project project = projectDao.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        String newApiKey = UUID.randomUUID().toString().replace("-", "");
        project.setApiKey(newApiKey);
        project.setUpdatedAt(LocalDateTime.now());

        Project savedProject = projectDao.save(project);

        return new ProjectResponse(
                savedProject.getId(),
                savedProject.getName(),
                savedProject.getDescription(),
                savedProject.getApiKey(),
                savedProject.getUserId(),
                savedProject.getCreatedAt(),
                savedProject.getUpdatedAt()
        );
    }

    public void deleteProject(String projectId) {
        if (!projectDao.existsById(projectId)) {
            throw new RuntimeException("Project not found");
        }
        projectDao.deleteById(projectId);
    }

    public Boolean existsById(String projectId) {
        return projectDao.existsById(projectId);
    }

    public boolean isApiKeyValid(String projectId, String apiKey) {
        Optional<Project> projectOpt = projectDao.findById(projectId);
        return projectOpt.map(project -> project.getApiKey().equals(apiKey)).orElse(false);
    }
}
