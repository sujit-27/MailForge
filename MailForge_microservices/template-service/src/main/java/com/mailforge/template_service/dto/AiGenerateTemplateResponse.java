package com.mailforge.template_service.dto;

import java.util.List;

public class AiGenerateTemplateResponse {

    private String suggestedName;
    private String subjectTemplate;
    private String bodyTemplate;
    private List<String> variables;

    public AiGenerateTemplateResponse(
            String suggestedName,
            String subjectTemplate,
            String bodyTemplate,
            List<String> variables
    ) {
        this.suggestedName = suggestedName;
        this.subjectTemplate = subjectTemplate;
        this.bodyTemplate = bodyTemplate;
        this.variables = variables;
    }

    public String getSuggestedName() {
        return suggestedName;
    }

    public void setSuggestedName(String suggestedName) {
        this.suggestedName = suggestedName;
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

    // getters
}
