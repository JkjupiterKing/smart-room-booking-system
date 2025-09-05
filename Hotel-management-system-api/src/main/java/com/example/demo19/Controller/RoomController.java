package com.example.demo19.Controller;

import com.example.demo19.Modal.Booking;
import com.example.demo19.Modal.HotelRoom;
import com.example.demo19.Repository.BookingRepository;
import com.example.demo19.Repository.HotelRoomRepository;
import com.example.demo19.dto.AvailabilityCheckRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:4200")
public class RoomController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private HotelRoomRepository hotelRoomRepository;

    @PostMapping("/check-availability")
    public ResponseEntity<Map<String, Boolean>> checkAvailability(@RequestBody AvailabilityCheckRequest request) {
        // Fetch all rooms of the given hotel
//        System.out.println("request.getHotelId():"+request.getHotelId());
//        List<HotelRoom> hotelRooms = hotelRoomRepository.findRoomsByHotelId(request.getHotelId());
//
//        if (hotelRooms.isEmpty()) {
//            return ResponseEntity.ok(Collections.singletonMap("available", false));
//        }
//
        boolean isAvailable = true;
//
//        for (HotelRoom room : hotelRooms) {
//            // Check if room can handle guest count
//            if (room.getCapacity() >= request.getGuests()) {
//                // Check overlapping bookings
//                List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(
//                        room.getRoomId(),
//                        request.getCheckInDate(),
//                        request.getCheckOutDate()
//                );
//
//                int availableRooms = room.getTotalRooms() - overlappingBookings.size();
//
//                if (availableRooms > 0) {
//                    isAvailable = true;
//                    break; // at least one room available, no need to check further
//                }
//            }
//        }

        return ResponseEntity.ok(Collections.singletonMap("available", isAvailable));
    }
}
