package com.mailforge.product_service.grpc;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import user.UserServiceGrpc;
import user.ValidationRequest;
import user.ValidationResponse;

@Service
public class UserServiceGrpcClient {

    private static final Logger log = LoggerFactory.getLogger(UserServiceGrpcClient.class);

    private final ManagedChannel channel;
    private final UserServiceGrpc.UserServiceBlockingStub blockingStub;

    public UserServiceGrpcClient(
            @Value("${user.service.address:user-service}") String serverAddress,
            @Value("${user.service.grpc.port:9090}") int serverPort) {

        log.info("Connecting to User Service GRPC Service at {} : {}", serverAddress, serverPort);
        this.channel = ManagedChannelBuilder
                .forAddress(serverAddress, serverPort)
                .usePlaintext()
                .build();

        this.blockingStub = UserServiceGrpc.newBlockingStub(channel);
    }

    public ValidationResponse userValidation(String userId) {
        ValidationRequest request = ValidationRequest.newBuilder()
                .setUserId(userId)
                .build();

        ValidationResponse response = blockingStub.userValidation(request);
        log.info("Received response from User Service via GRPC: {}", response);
        return response;
    }

    @PreDestroy
    public void shutdown() {
        log.info("Shutting down gRPC channel to User Service");
        channel.shutdown();
    }
}
