package com.example.demo19.dto;

public class LocationDTO {

    private Long id;
    private String city;
    private String country;

    public LocationDTO() {}

    public LocationDTO(Long id, String city, String country) {
        this.id = id;
        this.city = city;
        this.country = country;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
}
