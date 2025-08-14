package com.example.demo19.Repository;

import com.example.demo19.Modal.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    // Optionally add: Optional<Admin> findByUsername(String username);
}
