package com.mailforge.template_service.dto;

import jakarta.validation.constraints.NotBlank;

public class AiGenerateTemplateRequest {

    @NotBlank
    private String prompt;

    @NotBlank
    private String tag; // Professional, Friendly, Formal

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }
}

