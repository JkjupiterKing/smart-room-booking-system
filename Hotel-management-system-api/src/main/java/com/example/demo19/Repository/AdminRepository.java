package com.example.demo19.Repository;

import com.example.demo19.Modal.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional; // Import Optional

public interface AdminRepository extends JpaRepository<Admin, Long> {
    // Custom query method to find an Admin by username and password
    Optional<Admin> findByUsernameAndPassword(String username, String password);
}