package com.mailforge.payment_service.service;

import com.mailforge.payment_service.dao.TransactionDao;
import com.mailforge.payment_service.dto.*;
import com.mailforge.payment_service.grpc.PaymentServiceImpl;
import com.mailforge.payment_service.model.Transaction;
import com.mailforge.quota.grpc.QuotaServiceGrpc;
import com.mailforge.quota.grpc.SyncPlanRequest;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import jakarta.annotation.PostConstruct;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.Optional;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    @Autowired
    private TransactionDao transactionDao;

    @Autowired
    private PaymentServiceImpl paymentGrpcService;

    @Autowired
    private SubscriptionService subscriptionService;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Value("${razorpay.webhook.secret}")
    private String webhookSecret;

    private final QuotaServiceGrpc.QuotaServiceBlockingStub quotaStub;

    private RazorpayClient razorpayClient;

    public PaymentService(QuotaServiceGrpc.QuotaServiceBlockingStub quotaStub) {
        this.quotaStub = quotaStub;
    }

    @PostConstruct
    public void init() throws RazorpayException {
        this.razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
        log.info("Razorpay Client initialized successfully for MailForge");
    }

    public CreateOrderResponse createOrder(String userId, CreateOrderRequest request) {
        log.info("Initiating order creation for user: {} with amount: {}", userId, request.getAmount());
        try {
            //paymentGrpcService.getUser(userId);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", request.getAmount() * 100);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "rcpt_" + UUID.randomUUID().toString().substring(0, 20));
            Order order = razorpayClient.orders.create(orderRequest);
            String orderId = order.get("id");

            Transaction tx = new Transaction();
            tx.setUserId(userId);
            tx.setOrderId(orderId);
            tx.setAmount(request.getAmount());
            tx.setCurrency("INR");
            tx.setStatus("CREATED");
            tx.setPlanType(request.getPlanType());
            tx.setGateway("RAZORPAY");

            transactionDao.save(tx);
            log.info("Order created successfully: {}", orderId);

            CreateOrderResponse response = new CreateOrderResponse();
            response.setRazorpayOrderId(orderId);
            response.setAmount(order.get("amount"));
            response.setCurrency("INR");
            response.setRazorpayKey(razorpayKeyId);

            log.info("Response returned : {}, {}, {}, {}",response.getRazorpayOrderId(),response.getAmount(),response.getCurrency(),response.getRazorpayKey());
            return response;
        } catch (Exception e) {
            log.error("Order creation failed: {}", e);
            throw new RuntimeException("Failed to initiate order");
        }
    }

    @Transactional
    public PaymentResult verifyAndCapture(String userId, PaymentVerifyRequest request) {
        log.info("Verifying payment for Order: {}", request.getRazorpayOrderId());
        try {
            String payload = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();
            boolean isValid = Utils.verifySignature(payload, request.getRazorpaySignature(), razorpayKeySecret);

            if (!isValid) {
                log.warn("SECURITY ALERT: Signature mismatch for Order: {}", request.getRazorpayOrderId());
                return new PaymentResult(false, userId, request.getPlanType(), request.getRazorpayPaymentId(), request.getRazorpayOrderId(), "FAILED");
            }

            Transaction tx = transactionDao.findByOrderId(request.getRazorpayOrderId())
                    .orElseThrow(() -> new RuntimeException("Order record not found"));

            if ("SUCCESS".equals(tx.getStatus())) {
                return new PaymentResult(true, userId, tx.getPlanType(), tx.getPaymentId(), tx.getOrderId(), "SUCCESS");
            }

            // 1. Update Transaction Status
            tx.setPaymentId(request.getRazorpayPaymentId());
            tx.setStatus("SUCCESS");
            transactionDao.save(tx);

            // 2. Activate Subscription (Dates/Access)
            subscriptionService.activatePlan(userId, tx.getPlanType(), tx.getPaymentId());

            // 3. Update User Service (External Identity)
            paymentGrpcService.upgradePlan(userId, tx.getPlanType());

            quotaStub.syncPlan(
                    SyncPlanRequest.newBuilder()
                            .setUserId(userId)
                            .setPlanType(tx.getPlanType())
                            .build()
            );

            log.info("Plan activation complete for user: {}", userId);
            return new PaymentResult(true, userId, tx.getPlanType(), tx.getPaymentId(), tx.getOrderId(), "SUCCESS");
        } catch (Exception e) {
            log.error("Verification failed: {}", e.getMessage());
            throw new RuntimeException("Payment verification failed");
        }
    }

    @Transactional
    public void processWebhook(String payload, String signature) {
        try {
            if (!Utils.verifyWebhookSignature(payload, signature, webhookSecret)) {
                log.error("Invalid Webhook Signature.");
                return;
            }

            JSONObject json = new JSONObject(payload);
            if ("order.paid".equals(json.getString("event"))) {
                JSONObject entity = json.getJSONObject("payload").getJSONObject("order").getJSONObject("entity");
                String orderId = entity.getString("id");

                transactionDao.findByOrderId(orderId).ifPresent(tx -> {
                    if (!"SUCCESS".equals(tx.getStatus())) {
                        tx.setStatus("SUCCESS");
                        transactionDao.save(tx);

                        // Failsafe Activation
                        subscriptionService.activatePlan(tx.getUserId(), tx.getPlanType(), "WEBHOOK_CAPTURED");
                        paymentGrpcService.upgradePlan(tx.getUserId(), tx.getPlanType());
                    }
                });
            }
        } catch (Exception e) {
            log.error("Webhook error: {}", e.getMessage());
        }
    }

    public List<TransactionDto> getMyTransactions(String userId) {
        return transactionDao.findByUserId(userId).stream()
                .map(this::mapToDto).collect(Collectors.toList());
    }

    public TransactionDto getTransactionById(String transactionId) {
        return transactionDao.findById(transactionId)
                .map(this::mapToDto).orElseThrow();
    }

    private TransactionDto mapToDto(Transaction tx) {
        return new TransactionDto(tx.getId().toString(), tx.getAmount(), tx.getCurrency(),
                tx.getStatus(), tx.getPlanType(), tx.getPaymentId(), tx.getOrderId(), tx.getCreatedAt());
    }
}