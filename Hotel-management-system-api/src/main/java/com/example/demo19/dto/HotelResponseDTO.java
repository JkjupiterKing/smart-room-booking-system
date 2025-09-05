package com.example.demo19.dto;


public class HotelResponseDTO {

    private Long id;
    private String name;
    private String description;
    private double price;
    private double rating;
    private String imageBase64;
    private String imageBase64_2;
    private String imageBase64_3;
    private String imageBase64_4;
    private String imageBase64_5;

    private LocationDTO location;

    public HotelResponseDTO() {}

    public HotelResponseDTO(Long id, String name, String description, double price, double rating, String imageBase64, String imageBase64_2, String imageBase64_3, String imageBase64_4, String imageBase64_5, LocationDTO location) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.rating = rating;
        this.imageBase64 = imageBase64;
        this.imageBase64_2 = imageBase64_2;
        this.imageBase64_3 = imageBase64_3;
        this.imageBase64_4 = imageBase64_4;
        this.imageBase64_5 = imageBase64_5;
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

    public String getImageBase64_2() { return imageBase64_2; }
    public void setImageBase64_2(String imageBase64_2) { this.imageBase64_2 = imageBase64_2; }

    public String getImageBase64_3() { return imageBase64_3; }
    public void setImageBase64_3(String imageBase64_3) { this.imageBase64_3 = imageBase64_3; }

    public String getImageBase64_4() { return imageBase64_4; }
    public void setImageBase64_4(String imageBase64_4) { this.imageBase64_4 = imageBase64_4; }

    public String getImageBase64_5() { return imageBase64_5; }
    public void setImageBase64_5(String imageBase64_5) { this.imageBase64_5 = imageBase64_5; }

    public LocationDTO getLocation() { return location; }
    public void setLocation(LocationDTO location) { this.location = location; }
}

