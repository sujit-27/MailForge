package com.mailforge.email_consumer_service.config;

import com.mailforge.quota.grpc.QuotaServiceGrpc;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class QuotaGrpcClientConfig {

    private final ManagedChannel channel;
    private final QuotaServiceGrpc.QuotaServiceBlockingStub quotaStub;
    private static final Logger log = LoggerFactory.getLogger(QuotaGrpcClientConfig.class);

    public QuotaGrpcClientConfig(
            @Value("${quota.service.address:quota-service}") String host,
            @Value("${quota.service.port:9092}") int port) {

        log.info("Connecting to Project Service GRPC at {} : {}", host, port);

        this.channel = ManagedChannelBuilder
                .forAddress(host, port)
                .usePlaintext()
                .build();

        this.quotaStub = QuotaServiceGrpc.newBlockingStub(channel);
    }

    @Bean
    public QuotaServiceGrpc.QuotaServiceBlockingStub quotaServiceStub() {
        return quotaStub;
    }
}

