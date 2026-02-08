package com.mailforge.auth_service.grpc;

import auth.CreateUserRequest;
import auth.UserGrpcServiceGrpc;
import auth.UserResponse;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AuthGrpcServiceClient {

    private static final Logger log = LoggerFactory.getLogger(AuthGrpcServiceClient.class);

    private final ManagedChannel channel;
    private final UserGrpcServiceGrpc.UserGrpcServiceBlockingStub blockingStub;

    public AuthGrpcServiceClient(
            @Value("${user.service.address:user-service}") String serverAddress,
            @Value("${user.service.grpc.port:9090}") int serverPort) {

        log.info("Connecting to User Service GRPC at {} : {}", serverAddress, serverPort);

        this.channel = ManagedChannelBuilder
                .forAddress(serverAddress, serverPort)
                .usePlaintext()
                .build();

        this.blockingStub = UserGrpcServiceGrpc.newBlockingStub(channel);
    }

    public UserResponse createUser(CreateUserRequest request) {
        return blockingStub.createUser(request);
    }
}
