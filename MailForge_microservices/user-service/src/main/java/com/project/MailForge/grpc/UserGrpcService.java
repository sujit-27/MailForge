package com.project.MailForge.grpc;

import com.project.MailForge.service.UserService;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import user.UserServiceGrpc;
import user.ValidationRequest;
import user.ValidationResponse;

@GrpcService
public class UserGrpcService extends UserServiceGrpc.UserServiceImplBase {

    @Autowired
    private UserService userService;

    private static final Logger log = LoggerFactory.getLogger(UserGrpcService.class);

    @Override
    public void userValidation(user.ValidationRequest validationRequest,
                             StreamObserver<user.ValidationResponse> responseObserver ) {

        log.info("User Validation request received {}", validationRequest.getUserId());

        // Logic
        String userId = validationRequest.getUserId();
        boolean response = userService.existsById(userId);

        ValidationResponse response1 = ValidationResponse.newBuilder()
                .setIsValid(response)
                .build();

        responseObserver.onNext(response1);
        responseObserver.onCompleted();
    }

}
