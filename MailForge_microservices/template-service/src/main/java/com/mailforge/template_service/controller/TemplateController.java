package com.mailforge.template_service.controller;

import com.mailforge.template_service.dto.*;
import com.mailforge.template_service.service.TemplateService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/templates")
public class TemplateController {

    private final TemplateService templateService;

    public TemplateController(TemplateService templateService) {
        this.templateService = templateService;
    }

    /**
     * 1️⃣ Get SYSTEM templates (Free + Paid users)
     * Tags: Formal, Friendly, Professional
     */
    @GetMapping("/system")
    public List<TemplateResponse> getSystemTemplates(
            @RequestParam(required = false) String tag
    ) {
        return templateService.getSystemTemplates(tag);
    }

    /**
     * 2️⃣ Get USER templates (Paid users only)
     */
    @GetMapping("/my")
    public List<TemplateResponse> getUserTemplates(
            @RequestHeader("X-USER-ID") String userId
    ) {
        return templateService.getUserTemplates(userId);
    }

    /**
     * Generate an USER template (Paid users)
     */
    @PostMapping("/ai/generate")
    public AiGenerateTemplateResponse generateTemplateWithAI(
            @RequestHeader("X-USER-ID") String userId,
            @Valid @RequestBody AiGenerateTemplateRequest request
    ) {
        return templateService.generateTemplateWithAI(userId, request);
    }

    /**
     * 3️⃣ Create a USER template (Paid users)
     */
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public TemplateResponse createTemplate(
            @RequestHeader("X-USER-ID") String userId,
            @Valid @RequestBody CreateTemplateRequest request
    ) {
        return templateService.createTemplate(userId, request);
    }

    /**
     * 4️⃣ Get template by ID (Refresh button use-case)
     */
    @GetMapping("/{templateId}")
    public TemplateResponse getTemplateById(
            @RequestHeader("X-USER-ID") String userId,
            @PathVariable String templateId
    ) {
        return templateService.getTemplateById(userId, templateId);
    }

    /**
     * 5️⃣ Update USER template
     */
    @PutMapping("/{templateId}")
    public TemplateResponse updateTemplate(
            @RequestHeader("X-USER-ID") String userId,
            @PathVariable String templateId,
            @Valid @RequestBody UpdateTemplateRequest request
    ) {
        return templateService.updateTemplate(userId, templateId, request);
    }

    /**
     * 6️⃣ Archive template (soft delete)
     */
    @DeleteMapping("/{templateId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void archiveTemplate(
            @RequestHeader("X-USER-ID") String userId,
            @PathVariable String templateId
    ) {
        templateService.archiveTemplate(userId, templateId);
    }
}

