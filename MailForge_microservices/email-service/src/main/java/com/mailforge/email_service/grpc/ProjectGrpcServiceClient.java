package com.mailforge.email_service.grpc;

import com.mailforge.email_service.config.ProjectGrpcClientConfig;
import project.ProjectServiceGrpc;
import project.ProjectValidationRequest;
import project.ProjectValidationResponse;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.Status;
import io.grpc.StatusRuntimeException;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ProjectGrpcServiceClient {

    private static final Logger log = LoggerFactory.getLogger(ProjectGrpcServiceClient.class);

    private final ProjectServiceGrpc.ProjectServiceBlockingStub projectStub;

    public ProjectGrpcServiceClient(ProjectServiceGrpc.ProjectServiceBlockingStub projectStub){
        this.projectStub = projectStub;
    }

    /**
     * Check whether a project exists.
     *
     * Note: proto exposes only one RPC (projectValidation) which requires projectId + apiKey.
     * To determine existence without a known apiKey we call the RPC with a placeholder apiKey
     * and interpret the returned gRPC status:
     *  - NOT_FOUND => project does NOT exist (return false)
     *  - UNAUTHENTICATED => project exists but apiKey invalid (return true)
     *  - successful response => project exists (return true)
     */
    public boolean validateProjectExists(String projectId) {
        log.info("Checking existence of projectId={} via gRPC", projectId);

        ProjectValidationRequest request = ProjectValidationRequest.newBuilder()
                .setProjectId(projectId)
                .setApiKey("placeholder-do-not-use") // non-blank placeholder to avoid INVALID_ARGUMENT
                .build();

        try {
            ProjectValidationResponse resp = projectStub.projectValidation(request);
            // If call succeeds, project exists (resp.getIsValid() might be true only if apiKey matched,
            // but success implies project exists)
            log.debug("projectValidation response for existence check: {}", resp);
            return true;
        } catch (StatusRuntimeException e) {
            Status.Code code = e.getStatus().getCode();
            log.info("gRPC status while checking existence for {} : {}", projectId, code);
            if (code == Status.Code.NOT_FOUND) {
                return false;
            }
            if (code == Status.Code.UNAUTHENTICATED) {
                // project exists but placeholder apiKey invalid
                return true;
            }
            // for other errors, rethrow to let caller decide (or return false if you prefer)
            log.error("Unexpected gRPC error during project existence check: {}", e.getStatus(), e);
            throw e;
        }
    }

    /**
     * Validate apiKey for a projectId.
     *
     * Returns true only if the service responds successfully and isValid == true.
     * Returns false when project not found or apiKey invalid.
     */
    public boolean validateApiKey(String projectId, String apiKey) {
        log.info("Validating API Key via gRPC for projectId={}", projectId);

        ProjectValidationRequest request = ProjectValidationRequest.newBuilder()
                .setProjectId(projectId)
                .setApiKey(apiKey)
                .build();

        try {
            ProjectValidationResponse resp = projectStub.projectValidation(request);
            log.info("Received response from Project Service gRPC: {}", resp);
            return resp.getIsValid();
        } catch (StatusRuntimeException e) {
            Status.Code code = e.getStatus().getCode();
            log.info("gRPC status during API key validation for {} : {}", projectId, code);
            if (code == Status.Code.NOT_FOUND || code == Status.Code.UNAUTHENTICATED) {
                return false;
            }
            log.error("Unexpected gRPC error during API key validation: {}", e.getStatus(), e);
            throw e;
        }
    }
}
