package com.mailforge.email_service.exception;

public class InvalidApiKeyException
        extends BaseServiceException {

    public InvalidApiKeyException(String message) {
        super(message);
    }
}

