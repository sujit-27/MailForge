package com.mailforge.payment_service.config;

import com.mailforge.userservice.grpc.UserServiceGrpc;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UserServiceGrpcClientConfig {

    private final UserServiceGrpc.UserServiceBlockingStub blockingStub;
    private final ManagedChannel channel;
    private static final Logger log = LoggerFactory.getLogger(UserServiceGrpcClientConfig.class);

    public UserServiceGrpcClientConfig(
            @Value("${user.service.grpc.host:user-service}") String serverAddress,
            @Value("${user.service.grpc.port:9090}") int serverPort) {

        log.info("Connecting to User Service GRPC Service at {} : {}", serverAddress, serverPort);

        this.channel = ManagedChannelBuilder
                .forAddress(serverAddress, serverPort)
                .usePlaintext()
                .build();

        this.blockingStub = UserServiceGrpc.newBlockingStub(channel);
    }

    @Bean
    public UserServiceGrpc.UserServiceBlockingStub userServiceBlockingStub() {
        return this.blockingStub;
    }
}

