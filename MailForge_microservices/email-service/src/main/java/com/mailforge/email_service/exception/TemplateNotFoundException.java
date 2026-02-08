package com.mailforge.email_service.exception;

public class TemplateNotFoundException
        extends BaseServiceException {

    public TemplateNotFoundException(String message) {
        super(message);
    }
}
