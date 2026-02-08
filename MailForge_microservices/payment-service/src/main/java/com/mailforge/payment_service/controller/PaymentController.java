package com.mailforge.payment_service.controller;

import com.mailforge.payment_service.dto.*;
import com.mailforge.payment_service.dto.PaymentResult;
import com.mailforge.payment_service.service.PaymentService;
import com.mailforge.payment_service.service.SubscriptionService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final SubscriptionService subscriptionService;

    public PaymentController(PaymentService paymentService,
                             SubscriptionService subscriptionService) {
        this.paymentService = paymentService;
        this.subscriptionService = subscriptionService;
    }

    // 1. Create Razorpay Order
    @PostMapping("/create-order")
    public ResponseEntity<CreateOrderResponse> createOrder(@RequestHeader("X-USER-ID") String userId, @RequestBody CreateOrderRequest request) {
        return ResponseEntity.ok(paymentService.createOrder(userId, request));
    }

    // 2. Verify Payment
    @PostMapping("/verify")
    public ResponseEntity<PaymentVerifyResponse> verifyPayment(@RequestHeader("X-USER-ID") String userId, @RequestBody PaymentVerifyRequest request) {
        PaymentResult result = paymentService.verifyAndCapture(userId, request);

        if (result.isSuccess()) {
            subscriptionService.activatePlan(
                    result.getUserId(),
                    result.getPlanType(),
                    result.getPaymentId()
            );
        }

        return ResponseEntity.ok(new PaymentVerifyResponse(result.getStatus()));
    }

    // 3. Webhook
    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody String payload,@RequestHeader("X-Razorpay-Signature") String signature) {
        paymentService.processWebhook(payload, signature);
        return ResponseEntity.ok("OK");
    }

    // 4. Get current subscription
    @GetMapping("/subscription")
    public ResponseEntity<SubscriptionDto> getMySubscription(@RequestHeader("X-USER-ID") String userId) {
        return ResponseEntity.ok(subscriptionService.getCurrentUserSubscription(userId));
    }

    // 5. Get all transactions of logged-in user
    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionDto>> getMyTransactions(@RequestHeader("X-USER-ID") String userId) {
        return ResponseEntity.ok(paymentService.getMyTransactions(userId));
    }

    // 6. Get single transaction by ID
    @GetMapping("/transactions/{transactionId}")
    public ResponseEntity<TransactionDto> getTransactionById(@PathVariable String transactionId) {
        return ResponseEntity.ok(paymentService.getTransactionById(transactionId));
    }

    // 7. Cancel / Downgrade plan
    @PostMapping("/subscription/cancel")
    public ResponseEntity<Void> cancelSubscription(@RequestHeader("X-USER-ID") String userId) {
        subscriptionService.cancelCurrentPlan(userId);
        return ResponseEntity.ok().build();
    }
}


