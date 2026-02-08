package com.mailforge.auth_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.CrossOriginOpenerPolicyHeaderWriter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Allow the Gateway to call these without a user token
                        .requestMatchers("/auth/login", "/auth/register", "/auth/validate", "/auth/google", "/auth/logout").permitAll()
                        // Everything else should technically require authentication
                        // even if the Gateway already checked it
                        .anyRequest().authenticated()
                )
                // Since we are using JWTs, we don't need sessions
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }
}

//@Configuration
//public class SecurityConfig {
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws  Exception {
//        http.authorizeHttpRequests(authorize -> authorize.anyRequest().permitAll())
//                .csrf(AbstractHttpConfigurer::disable);
//
//        return http.build();
//    }
//}