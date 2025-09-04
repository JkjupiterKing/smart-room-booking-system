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
        Optional<HotelRoom> roomOptional = hotelRoomRepository.findById(request.getRoomId());
        if (roomOptional.isEmpty()) {
            return ResponseEntity.ok(Collections.singletonMap("available", false));
        }
        HotelRoom room = roomOptional.get();

        if (request.getGuests() > room.getCapacity()) {
            return ResponseEntity.ok(Collections.singletonMap("available", false));
        }

        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(
                request.getRoomId(),
                request.getCheckInDate(),
                request.getCheckOutDate()
        );

        int availableRooms = room.getTotalRooms() - overlappingBookings.size();
        boolean isAvailable = availableRooms > 0;

        return ResponseEntity.ok(Collections.singletonMap("available", isAvailable));
    }
}
