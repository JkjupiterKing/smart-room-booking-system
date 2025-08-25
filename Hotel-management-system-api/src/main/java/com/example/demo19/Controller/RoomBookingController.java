package com.example.demo19.Controller;

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
    @Autowired
    private BookingRepository bookingRepository;


    @PostMapping("/reserve")
    public ResponseEntity<Map<String, String>> reserveRoom(@RequestBody Booking booking) {
        Map<String, String> response = new HashMap<>();
        try {
            // Save the booking to the database
            bookingRepository.save(booking);
            response.put("message", "Booking Successful!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Booking Failed: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
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