package com.example.demo19.Controller;

import com.example.demo19.dto.HotelResponseDTO;
import com.example.demo19.dto.LocationDTO;
import com.example.demo19.Modal.Hotel;
import com.example.demo19.Modal.Location;
import com.example.demo19.Repository.HotelRepository;
import com.example.demo19.Repository.LocationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.persistence.EntityNotFoundException;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/hotels")
@CrossOrigin
public class HotelController {

    @Autowired
    private HotelRepository hotelRepository;

    // 1. Inject LocationRepository
    @Autowired
    private LocationRepository locationRepository;

    // ✅ Create new hotel with image and location
    @PostMapping(value = "/create", consumes = {"multipart/form-data"})
    public ResponseEntity<Hotel> createHotel(
            @RequestPart("hotel") Hotel hotel,
            @RequestPart(name = "image", required = false) MultipartFile image,
            @RequestPart(name = "image2", required = false) MultipartFile image2,
            @RequestPart(name = "image3", required = false) MultipartFile image3,
            @RequestPart(name = "image4", required = false) MultipartFile image4,
            @RequestPart(name = "image5", required = false) MultipartFile image5
    ) throws IOException {

        if (image != null && !image.isEmpty()) {
            hotel.setImage(image.getBytes());
        }
        if (image2 != null && !image2.isEmpty()) {
            hotel.setImage2(image2.getBytes());
        }
        if (image3 != null && !image3.isEmpty()) {
            hotel.setImage3(image3.getBytes());
        }
        if (image4 != null && !image4.isEmpty()) {
            hotel.setImage4(image4.getBytes());
        }
        if (image5 != null && !image5.isEmpty()) {
            hotel.setImage5(image5.getBytes());
        }

        // 2. Handle the Location entity correctly before saving
        if (hotel.getLocation() != null && hotel.getLocation().getId() != null) {
            // It's a detached Location entity, find and re-attach it
            Location managedLocation = locationRepository.findById(hotel.getLocation().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Location not found"));
            hotel.setLocation(managedLocation);
        }

        Hotel savedHotel = hotelRepository.save(hotel);
        return ResponseEntity.ok(savedHotel);
    }

    // ✅ Get all hotels with base64 image and location
    @GetMapping("/all")
    public ResponseEntity<List<HotelResponseDTO>> getAllHotels() {
        List<Hotel> hotels = hotelRepository.findAll();
        List<HotelResponseDTO> response = hotels.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // ✅ Get single hotel by ID with base64 image and location
    @GetMapping("/{id}")
    public ResponseEntity<HotelResponseDTO> getHotelById(@PathVariable Long id) {
        Optional<Hotel> hotel = hotelRepository.findById(id);
        return hotel.map(value -> ResponseEntity.ok(convertToDTO(value)))
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Update hotel by ID (with optional image)
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateHotel(
            @PathVariable Long id,
            @RequestPart("hotel") Hotel hotelDetails,
            @RequestPart(name = "image", required = false) MultipartFile image,
            @RequestPart(name = "image2", required = false) MultipartFile image2,
            @RequestPart(name = "image3", required = false) MultipartFile image3,
            @RequestPart(name = "image4", required = false) MultipartFile image4,
            @RequestPart(name = "image5", required = false) MultipartFile image5) throws IOException {

        return hotelRepository.findById(id).map(hotel -> {
            hotel.setName(hotelDetails.getName());
            hotel.setDescription(hotelDetails.getDescription());
            hotel.setPrice(hotelDetails.getPrice());
            hotel.setRating(hotelDetails.getRating());

            // 3. Handle Location during an update
            Location locationDetails = hotelDetails.getLocation();
            if (locationDetails != null) {
                if (locationDetails.getId() != null) {
                    Location managedLocation = locationRepository.findById(locationDetails.getId())
                            .orElseThrow(() -> new EntityNotFoundException("Location not found"));
                    hotel.setLocation(managedLocation);
                } else {
                    // This case handles when you pass a new, unsaved location during an update
                    hotel.setLocation(locationDetails);
                }
            }


            try {
                if (image != null && !image.isEmpty()) {
                    hotel.setImage(image.getBytes());
                }
                if (image2 != null && !image2.isEmpty()) {
                    hotel.setImage2(image2.getBytes());
                }
                if (image3 != null && !image3.isEmpty()) {
                    hotel.setImage3(image3.getBytes());
                }
                if (image4 != null && !image4.isEmpty()) {
                    hotel.setImage4(image4.getBytes());
                }
                if (image5 != null && !image5.isEmpty()) {
                    hotel.setImage5(image5.getBytes());
                }
            } catch (IOException e) {
                return ResponseEntity.badRequest().build();
            }

            Hotel updated = hotelRepository.save(hotel);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    // ✅ Delete hotel
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteHotel(@PathVariable Long id) {
        return hotelRepository.findById(id).map(hotel -> {
            hotelRepository.delete(hotel);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // ✅ Get hotels by city name
    @Transactional(readOnly = true)
    @GetMapping("/city/{city}")
    public ResponseEntity<List<HotelResponseDTO>> getHotelsByCity(@PathVariable String city) {
        List<Hotel> hotels = hotelRepository.findByLocation_CityIgnoreCase(city);
        List<HotelResponseDTO> response = hotels.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // ✅ Internal method to convert Hotel entity to HotelResponseDTO
    private HotelResponseDTO convertToDTO(Hotel hotel) {
        String base64Image = null;
        if (hotel.getImage() != null) {
            base64Image = Base64.getEncoder().encodeToString(hotel.getImage());
        }

        String base64Image2 = null;
        if (hotel.getImage2() != null) {
            base64Image2 = Base64.getEncoder().encodeToString(hotel.getImage2());
        }

        String base64Image3 = null;
        if (hotel.getImage3() != null) {
            base64Image3 = Base64.getEncoder().encodeToString(hotel.getImage3());
        }

        String base64Image4 = null;
        if (hotel.getImage4() != null) {
            base64Image4 = Base64.getEncoder().encodeToString(hotel.getImage4());
        }

        String base64Image5 = null;
        if (hotel.getImage5() != null) {
            base64Image5 = Base64.getEncoder().encodeToString(hotel.getImage5());
        }

        Location location = hotel.getLocation();
        LocationDTO locationDTO = null;

        if (location != null) {
            locationDTO = new LocationDTO(
                    location.getId(),
                    location.getCity(),
                    location.getCountry()
            );
        }

    return new HotelResponseDTO(
        hotel.getId(),
        hotel.getName(),
        hotel.getDescription(),
        hotel.getPrice(),
        hotel.getRating(),
        base64Image,
        base64Image2,
        base64Image3,
        base64Image4,
        base64Image5,
        locationDTO
    );
    }
}