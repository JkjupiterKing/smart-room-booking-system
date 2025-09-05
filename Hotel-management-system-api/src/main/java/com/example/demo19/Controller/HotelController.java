package com.example.demo19.Controller;

import com.example.demo19.dto.HotelResponseDTO;
import com.example.demo19.dto.HotelSimpleDTO;
import com.example.demo19.dto.LocationDTO;
import com.example.demo19.Modal.Hotel;
import com.example.demo19.Modal.Location;
import com.example.demo19.Repository.HotelRepository;
import com.example.demo19.Repository.LocationRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import jakarta.persistence.EntityNotFoundException;

import java.io.IOException;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/hotels")
@CrossOrigin
public class HotelController {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private WebClient.Builder webClientBuilder;

    @Value("${GEMINI_API_KEY}")
    private String geminiApiKey;

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
    @GetMapping("/search")
    public ResponseEntity<List<HotelResponseDTO>> searchHotels(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) List<Long> hotelIds) {

        List<Hotel> hotels;
        if (hotelIds != null && !hotelIds.isEmpty()) {
            hotels = hotelRepository.findAllById(hotelIds);
        } else if (city != null && !city.isEmpty()) {
            hotels = hotelRepository.findByLocation_CityIgnoreCase(city);
        } else {
            hotels = hotelRepository.findAll();
        }

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

    @PostMapping("/ai-search")
    public Mono<ResponseEntity<List<Long>>> aiSearch(@RequestBody Map<String, String> request) {
        String userQuery = request.get("query");
        System.out.println("userQuery = " + userQuery);
        List<HotelSimpleDTO> hotels = hotelRepository.findAllSimplified();
        System.out.println("hotels = " + hotels);
        String hotelsJson;
        try {
            hotelsJson = convertDTOListToJson(hotels);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return Mono.just(ResponseEntity.status(500).body(Collections.<Long>emptyList()));
        }

        String prompt = "Based on the following hotel data, return only a JSON array of hotel IDs that match the user's request. Do not include any other text in the response. Hotel data: " + hotelsJson + ". User request: " + userQuery;

        WebClient webClient = webClientBuilder.baseUrl("https://generativelanguage.googleapis.com").build();

        return webClient.post()
                .uri("/v1beta/models/gemini-2.0-flash:generateContent?key=" + geminiApiKey)
                .header("Content-Type", "application/json")
                .bodyValue(Map.of("contents", List.of(Map.of("parts", List.of(Map.of("text", prompt))))))
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    try {
                        System.out.println("HotelController.aiSearch");
                        System.out.println("response = " + response);
                        List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                        Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                        String text = (String) parts.get(0).get("text");
                        System.out.println("text = " + text);
                        // Assuming the response is a JSON array of numbers, e.g., "[1, 2, 3]"
//                        List<Long> hotelIds = new ObjectMapper().readValue(text.replaceAll("[^0-9,]", ""), new TypeReference<List<Long>>() {});
                        List<Long> hotelIds = new ObjectMapper()
                                .readValue(text, new TypeReference<List<Long>>() {});
                        return ResponseEntity.ok(hotelIds);
                    } catch (Exception e) {
                        e.printStackTrace();
                        return ResponseEntity.status(500).body(Collections.<Long>emptyList());
                    }
                })
                .defaultIfEmpty(ResponseEntity.status(404).body(Collections.<Long>emptyList()));
    }

    private String convertDTOListToJson(List<HotelSimpleDTO> dtoList) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(dtoList);
    }
}