package com.example.demo19.Repository;

import com.example.demo19.Modal.Hotel;
import com.example.demo19.dto.HotelSimpleDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByLocation_CityIgnoreCase(String city);

    @Query("SELECT new com.example.demo19.dto.HotelSimpleDTO(h.id, h.name, h.description, h.price, h.rating, new com.example.demo19.dto.LocationDTO(h.location.id, h.location.city, h.location.country)) FROM Hotel h")
    List<HotelSimpleDTO> findAllSimplified();
}
