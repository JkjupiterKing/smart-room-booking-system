package com.example.demo19.Controller;

import java.nio.charset.StandardCharsets;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo19.Modal.User;
import com.example.demo19.Service.EmailService;
import com.example.demo19.Repository.UserRepository;


@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200") 

public class UserController {

	@Autowired
	private EmailService emailService;

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

	// Registration endpoint
	@PostMapping("/register")
	public ResponseEntity<?> registerUser(@RequestBody User user) {
		// Check if the username already exists
		if (userRepository.findByUsername(user.getUsername()) != null) {
			return ResponseEntity
					.status(HttpStatus.BAD_REQUEST)
					.body("Username already exists!");
		}

		// Save user
		User savedUser = userRepository.save(user);

		// ✅ Send Welcome Email
		if (savedUser.getEmail() != null && !savedUser.getEmail().isEmpty()) {
			emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getUsername());
		}

		Map<String, Object> response = new HashMap<>();
		response.put("message", "User registered successfully!");
		response.put("user", savedUser);

		return ResponseEntity
				.status(HttpStatus.OK)
				.body(response);
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
				Map<String, Object> response = new HashMap<>();
				response.put("message", "Login successful!");
				response.put("user", existingUser);

				return ResponseEntity
						.ok()
						.body(response);
			} else {
				return ResponseEntity
						.status(HttpStatus.BAD_REQUEST)
						.body("Invalid credentials!");
			}
		}

	// Update endpoint
	@PutMapping("/update/{id}")
	public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
		Optional<User> userOptional = userRepository.findById(id);
		if (!userOptional.isPresent()) {
			return ResponseEntity
					.status(HttpStatus.NOT_FOUND)
					.body("User not found!");
		}
		User user = userOptional.get();
		user.setUsername(updatedUser.getUsername());
		user.setPassword(updatedUser.getPassword());
		user.setEmail(updatedUser.getEmail()); // Added this line to update the email
		userRepository.save(user);
		return ResponseEntity.ok("User updated successfully!");
	}
	// Delete endpoint
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<?> deleteUser(@PathVariable Long id) {
		if (!userRepository.existsById(id)) {
			return ResponseEntity
					.status(HttpStatus.NOT_FOUND)
					.body("User not found!");
		}
		userRepository.deleteById(id);
		return ResponseEntity.ok("User deleted successfully!");
	}

	@GetMapping("/all")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
