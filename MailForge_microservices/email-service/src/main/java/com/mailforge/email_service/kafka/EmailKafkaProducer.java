package com.mailforge.email_service.kafka;

import com.mailforge.email_service.dto.EmailRequest;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;


@Slf4j
@Service
public class EmailKafkaProducer {

    private static final Logger log = LoggerFactory.getLogger(EmailKafkaProducer.class);

    @Autowired
    private KafkaTemplate<String, EmailRequest> kafkaTemplate;

    @Value("${kafka.topic.email}")
    private String emailTopic;

    /**
     * Publish email request to Kafka
     */
    public void sendEmail(EmailRequest emailRequest) {
        log.info(
                "Publishing email to Kafka | topic={} | projectId={}",
                emailTopic,
                emailRequest.getProjectId()
        );

        kafkaTemplate.send(
                emailTopic,
                emailRequest.getProjectId(), // key → partitioning
                emailRequest
        );

        log.info("Email successfully queued in Kafka");
    }
}
