package com.mailforge.payment_service.grpc;

import com.mailforge.userservice.grpc.GetUserRequest;
import com.mailforge.userservice.grpc.GetUserResponse;
import com.mailforge.userservice.grpc.UpdateUserPlanRequest;
import com.mailforge.userservice.grpc.UserServiceGrpc;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl {

    private final UserServiceGrpc.UserServiceBlockingStub userServiceStub;

    public PaymentServiceImpl(UserServiceGrpc.UserServiceBlockingStub userServiceStub) {
        this.userServiceStub = userServiceStub;
    }

    // 1. Fetch user (before creating order, to validate user exists)
    public GetUserResponse getUser(String userId) {
        return userServiceStub.getUser(
                GetUserRequest.newBuilder()
                        .setUserId(userId)
                        .build()
        );
    }

    // 2. Upgrade plan after successful payment
    public void upgradePlan(String userId, String planType) {
        userServiceStub.updateUserPlan(
                UpdateUserPlanRequest.newBuilder()
                        .setUserId(userId)
                        .setPlanType(planType)
                        .build()
        );
    }
}

