package com.example.demo19.Controller;

import com.example.demo19.Modal.Booking;
import com.example.demo19.Modal.HotelRoom;
import com.example.demo19.Modal.Location;
import com.example.demo19.Modal.RoomType;
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

    @PostMapping("")
    public HotelRoom addRoom(@RequestBody HotelRoom hotelRoom) {
        return hotelRoomRepository.save(hotelRoom);
    }

    @GetMapping("/all")
    public List<HotelRoom> getAllRooms() {
        return hotelRoomRepository.findAll();
    }

    @GetMapping("/{id}")
    public HotelRoom getRoomById(@PathVariable Long id) {
        return hotelRoomRepository.findById(id).orElseThrow(() -> new RuntimeException("Room not found"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HotelRoom> updateRoom(@PathVariable Long id, @RequestBody HotelRoom hotelRoom) {
        Optional<HotelRoom> optionalRoom = hotelRoomRepository.findById(id);

        if (optionalRoom.isPresent()) {
            HotelRoom existingRoom = optionalRoom.get();
            existingRoom.setHotelId(hotelRoom.getHotelId());
            existingRoom.setHotelName(hotelRoom.getHotelName());
            existingRoom.setRoomType(hotelRoom.getRoomType());
            existingRoom.setTotalRooms(hotelRoom.getTotalRooms());
            existingRoom.setPricePerNight(hotelRoom.getPricePerNight());
            existingRoom.setCapacity(hotelRoom.getCapacity());
            return ResponseEntity.ok(hotelRoomRepository.save(existingRoom));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        hotelRoomRepository.deleteById(id);
    }

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
