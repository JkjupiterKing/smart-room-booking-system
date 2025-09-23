package com.example.demo19.Repository;

import com.example.demo19.Modal.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser_Id(Long userId);

    @Query("SELECT b FROM Booking b WHERE b.hotelId = :hotelId AND b.roomType = :roomType " +
           "AND b.checkOutDate > :checkInDate AND b.checkInDate < :checkOutDate")
    List<Booking> findOverlappingBookings(@Param("hotelId") Long hotelId,
                                          @Param("roomType") String roomType,
                                          @Param("checkInDate") LocalDate checkInDate,
                                          @Param("checkOutDate") LocalDate checkOutDate);


    @Query(value = """
    SELECT hr.hotel_id AS hotelId, hr.hotel_name AS hotelName, hr.room_type AS roomType,
           COALESCE(b.number_of_bookings, 0) AS numberOfBookings, hr.total_rooms AS totalRooms
    FROM hotel_rooms hr
    LEFT JOIN (
        SELECT hotel_id, room_type, COUNT(*) AS number_of_bookings
        FROM bookings
        WHERE (check_in_date BETWEEN :startDate AND :endDate - INTERVAL '1 day')
           OR (check_out_date BETWEEN :startDate + INTERVAL '1 day' AND :endDate - INTERVAL '1 day')
        GROUP BY hotel_id,  hotel_name, room_type
    ) b ON hr.hotel_id = b.hotel_id AND hr.room_type = b.room_type
""", nativeQuery = true)
    List<com.example.demo19.dto.AvailabilityCheckResponse> findAvailability(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}