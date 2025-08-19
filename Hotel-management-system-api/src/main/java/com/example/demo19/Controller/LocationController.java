package com.example.demo19.Controller;

import com.example.demo19.Modal.Location;
import com.example.demo19.Repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin
public class LocationController {

    @Autowired
    private LocationRepository locationRepository;

    @GetMapping("/all")
    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    @PostMapping("/create")
    public Location createLocation(@RequestBody Location location) {
        return locationRepository.save(location);
    }

    @GetMapping("/{id}")
    public Location getLocationById(@PathVariable Long id) {
        return locationRepository.findById(id).orElseThrow(() -> new RuntimeException("Location not found"));
    }

    @PutMapping("/update/{id}")
    public Location updateLocation(@PathVariable Long id, @RequestBody Location updatedLocation) {
        Location location = locationRepository.findById(id).orElseThrow(() -> new RuntimeException("Location not found"));
        location.setCity(updatedLocation.getCity());
        location.setCountry(updatedLocation.getCountry());
        return locationRepository.save(location);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteLocation(@PathVariable Long id) {
        locationRepository.deleteById(id);
    }
}

