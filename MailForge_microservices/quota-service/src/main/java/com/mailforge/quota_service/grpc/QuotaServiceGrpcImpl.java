package com.mailforge.quota_service.grpc;

import com.mailforge.quota.grpc.*;
import com.mailforge.quota_service.dto.QuotaCheckResult;
import com.mailforge.quota_service.service.QuotaCoreService;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
public class QuotaServiceGrpcImpl extends QuotaServiceGrpc.QuotaServiceImplBase {

    private final QuotaCoreService quotaCoreService;

    public QuotaServiceGrpcImpl(QuotaCoreService quotaCoreService) {
        this.quotaCoreService = quotaCoreService;
    }

    @Override
    public void canSend(CanSendRequest request, StreamObserver<CanSendResponse> responseObserver) {

        String userId = request.getUserId();
        int recipientsCount = request.getRecipientsCount();

        // For now, we assume plan is already synced via SyncPlan.
        // If not present, QuotaCoreService will initialize when needed.
        QuotaCheckResult result = quotaCoreService.canSend(userId, recipientsCount);

        CanSendResponse response = CanSendResponse.newBuilder()
                .setAllowed(result.isAllowed())
                .setRemaining(result.getRemaining())
                .setReason(result.getReason())
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void recordSend(RecordSendRequest request, StreamObserver<RecordSendResponse> responseObserver) {

        String userId = request.getUserId();
        int recipientsCount = request.getRecipientsCount();

        quotaCoreService.recordSend(userId, recipientsCount);

        RecordSendResponse response = RecordSendResponse.newBuilder()
                .setSuccess(true)
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void syncPlan(SyncPlanRequest request, StreamObserver<SyncPlanResponse> responseObserver) {

        String userId = request.getUserId();
        String planType = request.getPlanType();

        quotaCoreService.syncPlan(userId, planType);

        SyncPlanResponse response = SyncPlanResponse.newBuilder()
                .setSuccess(true)
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}

