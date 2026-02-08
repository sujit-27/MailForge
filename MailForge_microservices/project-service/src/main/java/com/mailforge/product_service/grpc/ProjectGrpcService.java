package com.mailforge.product_service.grpc;

import com.mailforge.product_service.dao.ProjectDao;
import com.mailforge.product_service.model.Project;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import project.*;
import com.mailforge.product_service.service.ProjectService;

@GrpcService
public class ProjectGrpcService extends ProjectServiceGrpc.ProjectServiceImplBase {

    private static final Logger log = LoggerFactory.getLogger(ProjectGrpcService.class);

    private final ProjectService projectService;

    @Autowired
    private ProjectDao projectDao;

    @Autowired
    public ProjectGrpcService(ProjectService projectService) {
        this.projectService = projectService;
    }

    @Override
    public void projectValidation(ProjectValidationRequest request,
                                  StreamObserver<ProjectValidationResponse> responseObserver) {

        String projectId = request.getProjectId();
        String apiKey = request.getApiKey();

        log.info("Received gRPC ProjectValidation request for projectId={}", projectId);

        // --- argument checking ---
        if (projectId == null || projectId.isBlank()) {
            responseObserver.onError(
                    Status.INVALID_ARGUMENT.withDescription("projectId is required").asRuntimeException()
            );
            return;
        }
        if (apiKey == null || apiKey.isBlank()) {
            responseObserver.onError(
                    Status.INVALID_ARGUMENT.withDescription("apiKey is required").asRuntimeException()
            );
            return;
        }

        try {

            boolean exists = projectService.existsById(projectId);
            if (!exists) {
                responseObserver.onError(
                        Status.NOT_FOUND.withDescription("Project not found: " + projectId).asRuntimeException()
                );
                return;
            }

            boolean validKey = projectService.isApiKeyValid(projectId, apiKey);
            if (!validKey) {
                responseObserver.onError(
                        Status.UNAUTHENTICATED.withDescription("Invalid API key for project: " + projectId).asRuntimeException()
                );
                return;
            }

            // --- SUCCESS ---
            ProjectValidationResponse response = ProjectValidationResponse.newBuilder()
                    .setIsValid(true)
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();

        } catch (Exception ex) {
            log.error("Error validating project {} : {}", projectId, ex.getMessage(), ex);
            responseObserver.onError(
                    Status.INTERNAL.withDescription("Internal server error").withCause(ex).asRuntimeException()
            );
        }
    }

    @Override
    public void resolveApiKey(ApiKeyRequest request, StreamObserver<ApiKeyResponse> responseObserver){

        String apiKey = request.getApiKey();

        log.info("gRPC ResolveApiKey called");

        if (apiKey == null || apiKey.isBlank()) {

            log.warn("ResolveApiKey: empty apiKey");

            responseObserver.onNext(
                    ApiKeyResponse.newBuilder()
                            .setValid(false)
                            .build()
            );
            responseObserver.onCompleted();
            return;
        }try {
            log.info("Api Key : {} ",request.getApiKey());
            Project project = projectDao.findByApiKey(apiKey).orElse(null);

            if (project == null) {

                log.warn("ResolveApiKey: apiKey not found");

                responseObserver.onNext(
                        ApiKeyResponse.newBuilder()
                                .setValid(false)
                                .build()
                );

                responseObserver.onCompleted();
                return;
            }

            log.info("ResolveApiKey success | project={}",
                    project.getId());

            ApiKeyResponse response =
                    ApiKeyResponse.newBuilder()
                            .setValid(true)
                            .setUserId(project.getUserId())
                            .setProjectId(project.getId())
                            .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();

        } catch (Exception e) {

            log.error("ResolveApiKey DB failure", e);

            // IMPORTANT — do not leak exception
            responseObserver.onNext(
                    ApiKeyResponse.newBuilder()
                            .setValid(false)
                            .build()
            );

            responseObserver.onCompleted();
        }
    }
}
