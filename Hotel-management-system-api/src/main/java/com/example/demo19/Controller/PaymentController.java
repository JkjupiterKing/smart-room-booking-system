package com.example.demo19.Controller;

import java.net.http.HttpRequest;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo19.Modal.Payment;
import com.example.demo19.Modal.User;
import com.example.demo19.Repository.PaymentRepository;


@CrossOrigin(origins = "http://localhost:4200")

@RestController
@RequestMapping("/api/payment")
public class PaymentController {
	@Autowired
    private PaymentRepository paymentRepository;

	@PostMapping("/upipayment")
    public ResponseEntity<String> processPayment(@RequestBody Payment paymentData) 
	{
		System.out.println("Hello, World!");
		System.out.println("Printing in payment controller: " + paymentData);

		paymentRepository.save(paymentData);
        return ResponseEntity.ok("payment successfull!");
		
       
    }
}


