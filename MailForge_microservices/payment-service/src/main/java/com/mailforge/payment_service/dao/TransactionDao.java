package com.mailforge.payment_service.dao;

import com.mailforge.payment_service.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionDao extends JpaRepository<Transaction, String> {

    Optional<Transaction> findByOrderId(String razorpayOrderId);

    List<Transaction> findByUserId(String userId);
}
