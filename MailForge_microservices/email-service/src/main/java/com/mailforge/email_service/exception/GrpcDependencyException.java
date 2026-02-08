package com.mailforge.email_service.exception;

public class GrpcDependencyException
        extends BaseServiceException {

    public GrpcDependencyException(String message) {
        super(message);
    }
}
