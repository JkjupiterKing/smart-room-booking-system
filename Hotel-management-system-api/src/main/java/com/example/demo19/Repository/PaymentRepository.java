package com.example.demo19.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo19.Modal.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

}
