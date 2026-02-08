package com.mailforge.email_service.exception;

public class InvalidRequestException
        extends BaseServiceException {

    public InvalidRequestException(String message) {
        super(message);
    }
}

