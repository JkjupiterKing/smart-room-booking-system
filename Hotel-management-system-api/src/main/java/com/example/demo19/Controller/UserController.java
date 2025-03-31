package com.example.demo19.Controller;


import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo19.Modal.User;
import com.example.demo19.Repository.UserRepository;



@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200") 

public class UserController {
	

	    @Autowired
	    private UserRepository userRepository;

	    // Registration endpoint
//	    @PostMapping("/register")
//	    public String registerUser(@RequestBody User user) {
//	        // Check if the username already exists
//	        if (userRepository.findByUsername(user.getUsername()) != null) {
//	            return "Username already exists!";
//	        }
//	        // Save user with plain text password (not recommended for production)
//	        userRepository.save(user);
//	        return "User registered successfully!";
//	    }

	    @PostMapping("/register")
	    public ResponseEntity<?> registerUser(@RequestBody User user) {
	        // Check if the username already exists
	        if (userRepository.findByUsername(user.getUsername()) != null) {
	            return ResponseEntity
	                .status(HttpStatus.BAD_REQUEST)
	                .body("Username already exists!");
	        }
	        
	        // Save user
	        userRepository.save(user);
	        return ResponseEntity
	            .status(HttpStatus.OK)
	            .body("User registered successfully!");
	    }
	    
	    // Login endpoint
	    @PostMapping("/login")
	    public ResponseEntity<?> loginUser(@RequestBody User user) {
	        // Check if the user exists
	        User existingUser = userRepository.findByUsername(user.getUsername());
	        if (existingUser == null) {
	            return ResponseEntity
	                .status(HttpStatus.BAD_REQUEST)
	                .body("User not found!");
	        }

	        // Check if the password matches
	        if (user.getPassword().equals(existingUser.getPassword())) {
	            return ResponseEntity
	                .ok()
	                .body("Login successful!");
	        } else {
	            return ResponseEntity
	                .status(HttpStatus.BAD_REQUEST)
	                .body("Invalid credentials!");
	        }
	    }
	    
}
