package com.example.demo19.dto;


public class HotelResponseDTO {

    private Long id;
    private String name;
    private String description;
    private double price;
    private double rating;
    private String imageBase64;

    private LocationDTO location;

    public HotelResponseDTO() {}

    public HotelResponseDTO(Long id, String name, String description, double price, double rating, String imageBase64, LocationDTO location) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.rating = rating;
        this.imageBase64 = imageBase64;
        this.location = location;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public String getImageBase64() { return imageBase64; }
    public void setImageBase64(String imageBase64) { this.imageBase64 = imageBase64; }

    public LocationDTO getLocation() { return location; }
    public void setLocation(LocationDTO location) { this.location = location; }
}

