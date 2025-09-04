package com.example.demo19.Controller;

import com.example.demo19.Modal.Booking;
import com.example.demo19.Modal.HotelRoom;
import com.example.demo19.Modal.Booking;
import com.example.demo19.Modal.HotelRoom;
import com.example.demo19.Repository.BookingRepository;
import com.example.demo19.Repository.HotelRoomRepository;
import com.example.demo19.dto.AvailabilityCheckRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    @PostMapping
    public HotelRoom createRoom(@RequestBody HotelRoom hotelRoom) {
        return hotelRoomRepository.save(hotelRoom);
    }

    @GetMapping
    public List<HotelRoom> getAllRooms() {
        return hotelRoomRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HotelRoom> getRoomById(@PathVariable(value = "id") Long roomId) {
        Optional<HotelRoom> hotelRoom = hotelRoomRepository.findById(roomId);
        if (hotelRoom.isPresent()) {
            return ResponseEntity.ok().body(hotelRoom.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<HotelRoom> updateRoom(@PathVariable(value = "id") Long roomId,
                                                @RequestBody HotelRoom roomDetails) {
        Optional<HotelRoom> optionalRoom = hotelRoomRepository.findById(roomId);
        if (optionalRoom.isPresent()) {
            HotelRoom room = optionalRoom.get();
            room.setHotel(roomDetails.getHotel());
            room.setRoomType(roomDetails.getRoomType());
            room.setCapacity(roomDetails.getCapacity());
            room.setPricePerNight(roomDetails.getPricePerNight());
            room.setTotalRooms(roomDetails.getTotalRooms());
            final HotelRoom updatedRoom = hotelRoomRepository.save(room);
            return ResponseEntity.ok(updatedRoom);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable(value = "id") Long roomId) {
        Optional<HotelRoom> optionalRoom = hotelRoomRepository.findById(roomId);
        if (optionalRoom.isPresent()) {
            hotelRoomRepository.delete(optionalRoom.get());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }


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
