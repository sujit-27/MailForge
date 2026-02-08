package com.mailforge.email_consumer_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }


    @Bean
    public WebClient brevoWebClient(WebClient.Builder webClientBuilder,
                                    @Value("${brevo.api.key}") String brevoApiKey) {
        return webClientBuilder
                .baseUrl("https://api.brevo.com/v3/smtp/email")
                .defaultHeader("Content-Type", "application/json")
                .defaultHeader("api-key", brevoApiKey)
                .clientConnector(
                        new ReactorClientHttpConnector(
                                HttpClient.create()
                                        .responseTimeout(Duration.ofSeconds(10))
                        )
                )
                .build();
    }
}
