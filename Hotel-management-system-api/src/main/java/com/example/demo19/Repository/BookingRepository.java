package com.example.demo19.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo19.Modal.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

}