package com.mailforge.ai_service.grpc;

import com.mailforge.ai.grpc.AiTemplateServiceGrpc;
import com.mailforge.ai.grpc.GenerateTemplateRequest;
import com.mailforge.ai.grpc.GenerateTemplateResponse;
import com.mailforge.ai_service.service.GeminiService;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
public class AiTemplateServiceImpl
        extends AiTemplateServiceGrpc.AiTemplateServiceImplBase {

    private final GeminiService geminiService;

    public AiTemplateServiceImpl(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @Override
    public void generateTemplate(
            GenerateTemplateRequest request,
            StreamObserver<GenerateTemplateResponse> responseObserver
    ) {
        try {
            GeminiService.AiTemplateResult result =
                    geminiService.generateEmailTemplate(
                            request.getPrompt(),
                            request.getTone()
                    );

            GenerateTemplateResponse response =
                    GenerateTemplateResponse.newBuilder()
                            .setSubjectTemplate(result.subject())
                            .setBodyTemplate(result.body())
                            .addAllVariables(result.variables())
                            .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();

        } catch (Exception ex) {
            responseObserver.onError(
                    Status.INTERNAL
                            .withDescription(ex.getMessage())
                            .withCause(ex)
                            .asRuntimeException()
            );
        }
    }
}

