package com.mailforge.email_service.controller;

import com.mailforge.email_service.dto.*;
import com.mailforge.email_service.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/emails")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/v1/send")
    public ResponseEntity<PublicSendResponse> sendEmailPublic(@RequestHeader("X-API-KEY") String apiKey,
                                                              @Valid @RequestBody PublicSendRequest request) {

        PublicSendResponse response = emailService.publicSend(apiKey, request);

        return ResponseEntity.accepted().body(response);
    }


    @PostMapping
    public ResponseEntity<EmailResponse> sendEmail(@Valid @RequestBody EmailRequest emailRequest) {
        EmailResponse response = emailService.sendEmail(emailRequest);
        return ResponseEntity.accepted().body(response);
    }

    @PostMapping("/send-template-email")
    public ResponseEntity<EmailResponse> sendTemplateEmail(@Valid @RequestBody TemplateEmailRequest request) {
        EmailResponse response = emailService.sendTemplateEmail(request);
        return ResponseEntity.accepted().body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmailResponse> getEmailById(@PathVariable String id) {
        EmailResponse response = emailService.getEmailById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<EmailResponse>> getAllEmails(@RequestParam(required = false) String status) {
        List<EmailResponse> emails = emailService.getAllEmails(status);
        return ResponseEntity.ok(emails);
    }

    @GetMapping("/stats/sender")
    public ResponseEntity<Map<String, EmailStatsResponse>> getSenderWiseStats() {
        Map<String, EmailStatsResponse> stats = emailService.getSenderWiseStats();
        return ResponseEntity.ok(stats);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmail(@PathVariable String id) {
        emailService.deleteEmail(id);
        return ResponseEntity.noContent().build();
    }

}
