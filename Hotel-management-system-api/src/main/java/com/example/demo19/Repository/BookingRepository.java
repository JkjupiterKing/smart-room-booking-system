package com.example.demo19.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo19.Modal.Booking;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    // Custom method to find all bookings for a specific user ID
    List<Booking> findByUser_Id(Long userId);
}