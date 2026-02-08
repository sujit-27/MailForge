package com.mailforge.email_service.exception;

public abstract class BaseServiceException
        extends RuntimeException {

    public BaseServiceException(String message) {
        super(message);
    }
}

