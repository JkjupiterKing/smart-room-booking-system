package com.example.demo19.Controller;

import com.example.demo19.Service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo19.Modal.Booking;
import com.example.demo19.Repository.BookingRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/bookings")
public class RoomBookingController {

    private static final Logger logger = LoggerFactory.getLogger(RoomBookingController.class);

    @Autowired
    private BookingRepository bookingRepository;


    @Autowired
    private EmailService emailService;

    @PostMapping("/reserve")
    public ResponseEntity<Map<String, String>> reserveRoom(@RequestBody Booking booking) {
        Map<String, String> response = new HashMap<>();
        // First, attempt to save the booking to the database
        try {
            bookingRepository.save(booking);
        } catch (Exception e) {
            logger.error("Failed to save booking", e);
            response.put("message", "Booking Failed: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }

        // Try to send confirmation email, but do not fail the whole request if email fails
        if (booking.getUser() != null && booking.getUser().getEmail() != null) {
            try {
                emailService.sendBookingConfirmation(booking.getUser().getEmail(), booking);
                response.put("message", "Booking Successful! Confirmation email sent.");
            } catch (Exception e) {
                // Log the email failure and return success for the booking with an email-failed note
                logger.warn("Booking saved but failed to send confirmation email", e);
                response.put("message", "Booking Successful! But confirmation email failed to send: " + e.getMessage());
                // Optionally include an emailStatus field
                response.put("emailStatus", "FAILED");
            }
        } else {
            response.put("message", "Booking Successful! No user email provided for confirmation.");
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Booking>> getAllBookings() {
        try {
            List<Booking> bookings = bookingRepository.findAll();
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            // Log the exception for debugging
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    // New API to update a booking
    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBooking(@PathVariable Long id, @RequestBody Booking updatedBooking) {
        Optional<Booking> existingBooking = bookingRepository.findById(id);

        if (existingBooking.isPresent()) {
            Booking booking = existingBooking.get();
            // Update fields here. For example:
            booking.setCheckInDate(updatedBooking.getCheckInDate());
            booking.setCheckOutDate(updatedBooking.getCheckOutDate());
            // Add other fields you want to update...

            Booking savedBooking = bookingRepository.save(booking);
            return ResponseEntity.ok(savedBooking);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // New API to delete a booking
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        if (bookingRepository.existsById(id)) {
            bookingRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUserId(@PathVariable Long userId) {
        try {
            List<Booking> bookings = bookingRepository.findByUser_Id(userId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
}