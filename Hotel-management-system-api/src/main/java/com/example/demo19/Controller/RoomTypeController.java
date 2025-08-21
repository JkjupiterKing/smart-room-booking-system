package com.example.demo19.Controller;

import com.example.demo19.Modal.RoomType;
import com.example.demo19.Repository.RoomTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/roomtypes")
@CrossOrigin
public class RoomTypeController {

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    @GetMapping("/all")
    public List<RoomType> getAllRoomTypes() {
        return roomTypeRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomType> getRoomTypeById(@PathVariable Long id) {
        Optional<RoomType> roomType = roomTypeRepository.findById(id);
        return roomType.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public RoomType createRoomType(@RequestBody RoomType roomType) {
        return roomTypeRepository.save(roomType);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoomType> updateRoomType(@PathVariable Long id, @RequestBody RoomType roomTypeDetails) {
        Optional<RoomType> optionalRoomType = roomTypeRepository.findById(id);

        if (optionalRoomType.isPresent()) {
            RoomType existingRoomType = optionalRoomType.get();
            existingRoomType.setName(roomTypeDetails.getName());
            existingRoomType.setDescription(roomTypeDetails.getDescription());
            return ResponseEntity.ok(roomTypeRepository.save(existingRoomType));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/Delete/{id}")
    public ResponseEntity<Void> deleteRoomType(@PathVariable Long id) {
        if (roomTypeRepository.existsById(id)) {
            roomTypeRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
