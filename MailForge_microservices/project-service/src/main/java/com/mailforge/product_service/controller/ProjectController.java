package com.mailforge.product_service.controller;

import com.mailforge.product_service.dto.ProjectRequest;
import com.mailforge.product_service.dto.ProjectResponse;
import com.mailforge.product_service.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping("/create")
    public ResponseEntity<ProjectResponse> create(@RequestBody ProjectRequest projectRequest){
        return ResponseEntity.ok(projectService.createProject(projectRequest));
    }

    @GetMapping("/user")
    public List<ProjectResponse> getProjectsByUser(@RequestHeader("X-User-Id") String userId) {
        return projectService.getProjectsByUserId(userId);
    }

    @GetMapping("/{projectId}")
    public ProjectResponse getProject(@PathVariable String projectId) {
        return projectService.getProjectById(projectId);
    }

    @PutMapping("/{projectId}")
    public ProjectResponse updateProject(
            @PathVariable String projectId,
            @RequestBody ProjectRequest updatedRequest) {
        return projectService.updateProject(projectId, updatedRequest);
    }

    @PutMapping("/{projectId}/regenerate-key")
    public ProjectResponse regenerateKey(@PathVariable String projectId) {
        return projectService.regenerateApiKey(projectId);
    }

    @DeleteMapping("/{projectId}")
    public void deleteProject(@PathVariable String projectId) {
        projectService.deleteProject(projectId);
    }

    @GetMapping("/{projectId}/validate")
    public ResponseEntity<Boolean> validateProject(@PathVariable String projectId){
        return ResponseEntity.ok(projectService.existsById(projectId));
    }

    @GetMapping("/validate-api")
    public ResponseEntity<Boolean> validateApiKey(
            @RequestParam String projectId,
            @RequestParam String apiKey) {
        boolean valid = projectService.isApiKeyValid(projectId, apiKey);
        return ResponseEntity.ok(valid);
    }

}
