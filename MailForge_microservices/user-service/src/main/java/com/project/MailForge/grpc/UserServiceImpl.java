package com.project.MailForge.grpc;

import com.mailforge.userservice.grpc.*;
import com.project.MailForge.dao.UserDao;
import com.project.MailForge.model.User;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
public class UserServiceImpl extends UserServiceGrpc.UserServiceImplBase {

    private final UserDao userRepository;

    public UserServiceImpl(UserDao userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void getUser(GetUserRequest request,
                        StreamObserver<GetUserResponse> responseObserver) {

        String userId = request.getUserId();

        User user = userRepository.findById(String.valueOf(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));

        GetUserResponse response = GetUserResponse.newBuilder()
                .setUserId(user.getId())
                .setEmail(user.getEmail())
                .setPlanType(user.getPlan())   // FREE / DEV / UNLIMITED
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void updateUserPlan(UpdateUserPlanRequest request,
                               StreamObserver<UpdateUserPlanResponse> responseObserver) {

        String userId = request.getUserId();
        String planType = request.getPlanType();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPlan(planType);
        userRepository.save(user);

        UpdateUserPlanResponse response = UpdateUserPlanResponse.newBuilder()
                .setStatus("SUCCESS")
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}

