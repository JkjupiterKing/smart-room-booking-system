package com.example.demo19.Repository;

import com.example.demo19.Modal.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByLocation_CityIgnoreCase(String city);

}
