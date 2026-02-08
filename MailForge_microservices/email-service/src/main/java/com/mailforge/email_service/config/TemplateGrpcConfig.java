package com.mailforge.email_service.config;

import com.mailforge.template_service.grpc.TemplateRenderServiceGrpc;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TemplateGrpcConfig {

    @Bean
    public TemplateRenderServiceGrpc.TemplateRenderServiceBlockingStub templateRenderStub(
            @Value("${template.service.host:template-service}") String host,
            @Value("${template.service.port:9093}") int port
    ) {

        ManagedChannel channel = ManagedChannelBuilder
                .forAddress(host, port)
                .usePlaintext()
                .build();

        return TemplateRenderServiceGrpc.newBlockingStub(channel);
    }
}

