package com.example.demo19.Repository;

import com.example.demo19.Modal.HotelRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRoomRepository extends JpaRepository<HotelRoom, Long> {
    @Query("SELECT hr FROM HotelRoom hr WHERE hr.hotel.id = :hotelId")
    List<HotelRoom> findRoomsByHotelId(@Param("hotelId") Long hotelId);
}
