package com.mailforge.email_service.config;

import com.mailforge.email_service.grpc.ProjectGrpcServiceClient;
import com.mailforge.quota.grpc.QuotaServiceGrpc;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import project.ProjectServiceGrpc;

@Configuration
public class ProjectGrpcClientConfig {

    private final ManagedChannel channel;
    private final ProjectServiceGrpc.ProjectServiceBlockingStub projectStub;

    private static final Logger log = LoggerFactory.getLogger(ProjectGrpcClientConfig.class);

    public ProjectGrpcClientConfig(
            @Value("${project.service.address:project-service}") String serverAddress,
            @Value("${project.service.grpc.port:9091}") int serverPort) {

        log.info("Connecting to Project Service GRPC at {} : {}", serverAddress, serverPort);

        this.channel = ManagedChannelBuilder
                .forAddress(serverAddress, serverPort)
                .usePlaintext() // internal docker network
                .build();

        this.projectStub = ProjectServiceGrpc.newBlockingStub(channel);
    }

    @Bean
    public ProjectServiceGrpc.ProjectServiceBlockingStub projectServiceStub() {
        return projectStub;
    }

}
