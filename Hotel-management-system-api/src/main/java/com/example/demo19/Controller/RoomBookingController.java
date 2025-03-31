package com.example.demo19.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo19.Modal.Booking;
import com.example.demo19.Repository.BookingRepository;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/bookings")
public class RoomBookingController {
    @Autowired
    private BookingRepository bookingRepository;


    @PostMapping("/reserve")
    public ResponseEntity<Map<String, String>> reserveRoom(@RequestBody Booking booking) {
        Map<String, String> response = new HashMap<>();
        try {
            // Save the booking to the database
            bookingRepository.save(booking);
            response.put("message", "Booking Successful!");
            return ResponseEntity.ok(response);  // Sending JSON response
        } catch (Exception e) {
            response.put("message", "Booking Failed: " + e.getMessage());
            return ResponseEntity.status(500).body(response);  // Sending error message as JSON
        }
    }
}

// Endpoint to handle booking submission
//    @PostMapping("/reserve")
//    public ResponseEntity<String> reserveRoom(@RequestBody Booking booking) {
//        try {
//            // Save the booking to the database
//            bookingRepository.save(booking);
//            return ResponseEntity.ok("Booking Successful!");
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body("Booking Failed: " + e.getMessage());
//        }
//    }
//}