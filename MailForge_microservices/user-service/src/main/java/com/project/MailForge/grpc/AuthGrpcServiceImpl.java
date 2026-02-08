package com.project.MailForge.grpc;

import auth.*;
import com.project.MailForge.model.User;
import com.project.MailForge.service.UserService;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Slf4j
@GrpcService
public class AuthGrpcServiceImpl extends UserGrpcServiceGrpc.UserGrpcServiceImplBase {

    private final UserService userService;

    private static final Logger log = LoggerFactory.getLogger(AuthGrpcServiceImpl.class);

    public AuthGrpcServiceImpl(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void createUser(CreateUserRequest request, StreamObserver<UserResponse> responseObserver) {
        try {
            log.info("Received gRPC request to create user: {}", request.getEmail());

            User user = userService.createInternalUser(
                    request.getEmail(),
                    request.getFirstName(),
                    request.getLastName()
            );

            UserResponse response = mapToUserResponse(user);

            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            log.error("Failed to create user in gRPC: ", e);
            // Returns ALREADY_EXISTS or INTERNAL error to the Auth-Service
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Could not create user profile: " + e.getMessage())
                    .asRuntimeException());
        }
    }

    @Override
    public void getUserByEmail(GetUserByEmailRequest request, StreamObserver<UserResponse> responseObserver) {
        try {
            User user = userService.getUserByEmail(request.getEmail());

            if (user == null) {
                responseObserver.onError(Status.NOT_FOUND
                        .withDescription("User not found with email: " + request.getEmail())
                        .asRuntimeException());
                return;
            }

            responseObserver.onNext(mapToUserResponse(user));
            responseObserver.onCompleted();
        } catch (Exception e) {
            responseObserver.onError(Status.INTERNAL
                    .withDescription(e.getMessage())
                    .asRuntimeException());
        }
    }

    @Override
    public void getUserById(GetUserByIdRequest request, StreamObserver<UserResponse> responseObserver) {
        try {
            User user = userService.getUserById(request.getUserId());

            if (user == null) {
                responseObserver.onError(Status.NOT_FOUND
                        .withDescription("User not found with ID: " + request.getUserId())
                        .asRuntimeException());
                return;
            }

            responseObserver.onNext(mapToUserResponse(user));
            responseObserver.onCompleted();
        } catch (Exception e) {
            responseObserver.onError(Status.INTERNAL
                    .withDescription(e.getMessage())
                    .asRuntimeException());
        }
    }

    /**
     * Helper method to map your Database Entity to the gRPC Response message.
     */
    private UserResponse mapToUserResponse(User user) {
        return UserResponse.newBuilder()
                .setId(user.getId())
                .setEmail(user.getEmail())
                .setRole(user.getRole() != null ? user.getRole().name() : "USER")
                .setPlan(user.getPlan())
                .build();
    }
}