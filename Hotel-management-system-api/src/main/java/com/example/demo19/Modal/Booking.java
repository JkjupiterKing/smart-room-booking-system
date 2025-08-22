package com.example.demo19.Modal;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "bookings") // Changed table name for clarity
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomTitle;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private int adults;
    private int children;
    private String amenities;
    private String meals;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Default constructor
    public Booking() {}

    // Getters and setters for all fields
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoomTitle() {
        return roomTitle;
    }

    public void setRoomTitle(String roomTitle) {
        this.roomTitle = roomTitle;
    }

    public LocalDate getCheckInDate() {
        return checkInDate;
    }

    public void setCheckInDate(LocalDate checkInDate) {
        this.checkInDate = checkInDate;
    }

    public LocalDate getCheckOutDate() {
        return checkOutDate;
    }

    public void setCheckOutDate(LocalDate checkOutDate) {
        this.checkOutDate = checkOutDate;
    }

    public int getAdults() {
        return adults;
    }

    public void setAdults(int adults) {
        this.adults = adults;
    }

    public int getChildren() {
        return children;
    }

    public void setChildren(int children) {
        this.children = children;
    }

    public String getAmenities() {
        return amenities;
    }

    public void setAmenities(String amenities) {
        this.amenities = amenities;
    }

    public String getMeals() {
        return meals;
    }

    public void setMeals(String meals) {
        this.meals = meals;
    }

    public User getUser() { // Getter for user
        return user;
    }

    public void setUser(User user) { // Setter for user
        this.user = user;
    }
}