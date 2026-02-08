package com.mailforge.template_service.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "templates")
public class Template {

    @Id
    private String id; // templateId

    // SYSTEM or USER
    private TemplateVisibility visibility;

    // null for SYSTEM templates
    private String ownerUserId;

    // optional: project scoped templates
    private String projectId;

    // Friendly, Formal, Professional, Custom
    private String tag;

    private String name;

    private String subjectTemplate;
    private String bodyTemplate;

    // Allowed variables: name, otp, company
    private List<String> variables;

    // Versioning
    private int version;

    // ACTIVE / ARCHIVED
    private TemplateStatus status;

    // AI metadata
    private boolean aiGenerated;
    private String aiPrompt;

    // Audit
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // -------- getters & setters --------

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public TemplateVisibility getVisibility() {
        return visibility;
    }

    public void setVisibility(TemplateVisibility visibility) {
        this.visibility = visibility;
    }

    public String getOwnerUserId() {
        return ownerUserId;
    }

    public void setOwnerUserId(String ownerUserId) {
        this.ownerUserId = ownerUserId;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSubjectTemplate() {
        return subjectTemplate;
    }

    public void setSubjectTemplate(String subjectTemplate) {
        this.subjectTemplate = subjectTemplate;
    }

    public String getBodyTemplate() {
        return bodyTemplate;
    }

    public void setBodyTemplate(String bodyTemplate) {
        this.bodyTemplate = bodyTemplate;
    }

    public List<String> getVariables() {
        return variables;
    }

    public void setVariables(List<String> variables) {
        this.variables = variables;
    }

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }

    public TemplateStatus getStatus() {
        return status;
    }

    public void setStatus(TemplateStatus status) {
        this.status = status;
    }

    public boolean isAiGenerated() {
        return aiGenerated;
    }

    public void setAiGenerated(boolean aiGenerated) {
        this.aiGenerated = aiGenerated;
    }

    public String getAiPrompt() {
        return aiPrompt;
    }

    public void setAiPrompt(String aiPrompt) {
        this.aiPrompt = aiPrompt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

