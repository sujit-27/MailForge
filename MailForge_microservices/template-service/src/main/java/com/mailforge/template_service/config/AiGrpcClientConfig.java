package com.mailforge.template_service.config;

import com.mailforge.ai.grpc.AiTemplateServiceGrpc;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class AiGrpcClientConfig {

    private final ManagedChannel channel;
    private final AiTemplateServiceGrpc.AiTemplateServiceBlockingStub aiTemplateStub;
    private static final Logger log = LoggerFactory.getLogger(AiGrpcClientConfig.class);

    public AiGrpcClientConfig(
            @Value("${ai.service.address:ai-service}") String host,
            @Value("${ai.service.port:9094}") int port) {

        log.info("Connecting to AI Service GRPC at {} : {}", host, port);

        this.channel = ManagedChannelBuilder
                .forAddress(host, port)
                .usePlaintext()
                .build();

        this.aiTemplateStub = AiTemplateServiceGrpc.newBlockingStub(channel);
    }

    @Bean
    public AiTemplateServiceGrpc.AiTemplateServiceBlockingStub AiTemplateServiceStub() {
        return aiTemplateStub;
    }
}

