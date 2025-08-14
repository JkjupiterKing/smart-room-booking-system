package com.example.demo19.Repository;

import com.example.demo19.Modal.Location;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationRepository extends JpaRepository<Location, Long> {
    // Add custom query methods as needed
}

