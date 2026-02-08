package com.mailforge.gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import com.mailforge.gateway.dto.*;
import reactor.core.publisher.Mono;

@Component
public class JwtValidationGatewayFilterFactory
        extends AbstractGatewayFilterFactory<Object> {

    private final WebClient webClient;

    private static final Logger log = LoggerFactory.getLogger(JwtValidationGatewayFilterFactory.class);

    public JwtValidationGatewayFilterFactory(
            WebClient.Builder webClientBuilder,
            @Value("${auth.service.url}") String authServiceUrl) {

        this.webClient = webClientBuilder
                .baseUrl(authServiceUrl)
                .build();
    }

    @Override
    public GatewayFilter apply(Object config) {

        return (exchange, chain) -> {

            String path = exchange.getRequest()
                    .getURI()
                    .getPath();

            log.info("Path: {}",path);

            if (exchange.getRequest().getMethod() == HttpMethod.OPTIONS) {
                return chain.filter(exchange);
            }

            if (path.contains("/v1")) {
                return chain.filter(exchange);
            }

            String authHeader = exchange.getRequest()
                    .getHeaders()
                    .getFirst(HttpHeaders.AUTHORIZATION);

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            String token = authHeader.substring(7);

            return webClient.post()
                    .uri("/auth/validate")
                    .bodyValue(new TokenValidationRequest(token))
                    .retrieve()
                    .bodyToMono(TokenValidationResponse.class)
                    .flatMap(response -> {

                        if (!response.isValid()) {
                            exchange.getResponse()
                                    .setStatusCode(HttpStatus.UNAUTHORIZED);
                            return exchange.getResponse().setComplete();
                        }

                        // Inject headers for downstream services
                        return chain.filter(
                                exchange.mutate()
                                        .request(exchange.getRequest().mutate()
                                                .header("X-User-Id", response.getUserId())
                                                .build())
                                        .build()
                        );
                    })
                    .onErrorResume(ex -> {
                        exchange.getResponse()
                                .setStatusCode(HttpStatus.UNAUTHORIZED);
                        return exchange.getResponse().setComplete();
                    });
        };
    }
}
