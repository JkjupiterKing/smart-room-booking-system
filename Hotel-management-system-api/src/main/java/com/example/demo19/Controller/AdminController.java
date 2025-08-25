package com.example.demo19.Controller;

import com.example.demo19.Modal.Admin;
import com.example.demo19.Repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    @GetMapping("/all")
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    @PostMapping("/create")
    public Admin createAdmin(@RequestBody Admin admin) {
        return adminRepository.save(admin);
    }

    @GetMapping("/{id}")
    public Admin getAdminById(@PathVariable Long id) {
        return adminRepository.findById(id).orElseThrow(() -> new RuntimeException("Admin not found"));
    }
    // New Login Endpoint
    @PostMapping("/login")
    public ResponseEntity<String> loginAdmin(@RequestBody Admin admin) {
        // Find admin by username and password
        Optional<Admin> foundAdmin = adminRepository.findByUsernameAndPassword(admin.getUsername(), admin.getPassword());

        if (foundAdmin.isPresent()) {
            return ResponseEntity.ok("Login Successful! Welcome, " + foundAdmin.get().getUsername());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Credentials");
        }
    }

    @PutMapping("/update/{id}")
    public Admin updateAdmin(@PathVariable Long id, @RequestBody Admin updatedAdmin) {
        Admin admin = adminRepository.findById(id).orElseThrow(() -> new RuntimeException("Admin not found"));
        admin.setUsername(updatedAdmin.getUsername());
        admin.setEmail(updatedAdmin.getEmail());
        admin.setPassword(updatedAdmin.getPassword());
        return adminRepository.save(admin);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteAdmin(@PathVariable Long id) {
        adminRepository.deleteById(id);
    }
}
