package com.mailforge.email_consumer_service.config;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import com.mailforge.email_consumer_service.dto.EmailRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.listener.ContainerProperties;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableKafka
public class KafkaConsumerConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Bean
    public ConsumerFactory<String, EmailRequest> consumerFactory() {

        Map<String, Object> props = new HashMap<>();

        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "email-consumer-group");
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);

        // 🔥 REQUIRED for deserialization failures
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
                org.springframework.kafka.support.serializer.ErrorHandlingDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
                org.springframework.kafka.support.serializer.ErrorHandlingDeserializer.class);

        props.put(org.springframework.kafka.support.serializer.ErrorHandlingDeserializer.KEY_DESERIALIZER_CLASS,
                org.apache.kafka.common.serialization.StringDeserializer.class);
        props.put(org.springframework.kafka.support.serializer.ErrorHandlingDeserializer.VALUE_DESERIALIZER_CLASS,
                org.springframework.kafka.support.serializer.JsonDeserializer.class);

        // 🔥 TRUST THE PRODUCER PACKAGE
        props.put(JsonDeserializer.TRUSTED_PACKAGES,
                "com.mailforge.email_consumer_service.model");

        props.put(JsonDeserializer.VALUE_DEFAULT_TYPE,
                "com.mailforge.email_consumer_service.model.Email");

        props.put(JsonDeserializer.USE_TYPE_INFO_HEADERS, false);

        return new DefaultKafkaConsumerFactory<>(props);
    }


    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, EmailRequest>
    kafkaListenerContainerFactory() {

        ConcurrentKafkaListenerContainerFactory<String, EmailRequest> factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        factory.setConsumerFactory(consumerFactory());
        factory.getContainerProperties().setAckMode(
                ContainerProperties.AckMode.MANUAL
        );

        return factory;
    }
}
