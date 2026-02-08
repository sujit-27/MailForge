package com.project.MailForge.service;

import com.mailforge.quota.grpc.QuotaServiceGrpc;
import com.mailforge.quota.grpc.SyncPlanRequest;
import com.project.MailForge.dao.UserDao;
import com.project.MailForge.dto.UserResponse;
import com.project.MailForge.grpc.AuthGrpcServiceImpl;
import com.project.MailForge.model.User;
import com.project.MailForge.model.UserRole;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UserService {

    private final UserDao userDao;
    private final QuotaServiceGrpc.QuotaServiceBlockingStub quotaStub;

    public UserService(UserDao userDao,
                       QuotaServiceGrpc.QuotaServiceBlockingStub quotaStub) {
        this.userDao = userDao;
        this.quotaStub = quotaStub;
    }

    private static final Logger log = LoggerFactory.getLogger(AuthGrpcServiceImpl.class);

    public User createInternalUser(String email, String firstName, String lastName) {
        // Prevent duplicate users
        if (userDao.existsByEmail(email)) {
            // This will be caught by the try-catch in gRPC service
            throw new IllegalStateException("User already exists with email: " + email);
        }

        User user = new User();
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRole(UserRole.USER);
        user.setPlan("FREE");

        User savedUser = userDao.save(user);

        // 2. Now sync with Quota Service
        quotaStub.syncPlan(
                SyncPlanRequest.newBuilder()
                        .setUserId(savedUser.getId())
                        .setPlanType("FREE")
                        .build()
        );

        return savedUser;
    }

    public User getUserByEmail(String email) {
        return userDao.findByEmail(email);
    }

    public User getUserById(String userId) {
        return userDao.findById(userId).orElse(null);
    }

    public Boolean existsById(String userId) {
        log.info("Validating existence for userId: {}", userId);
        return userDao.existsById(userId);
    }

    public UserResponse getUserProfile(String userId) {
        if (userId == null) {
            throw new RuntimeException("User identity missing from request context");
        }

        User user = userDao.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setEmail(user.getEmail());
        userResponse.setFirstName(user.getFirstName());
        userResponse.setLastName(user.getLastName());
        userResponse.setPlan(user.getPlan());

        return userResponse;
    }
}