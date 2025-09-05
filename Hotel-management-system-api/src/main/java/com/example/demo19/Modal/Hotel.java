package com.example.demo19.Modal;

import jakarta.persistence.*;

@Entity
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private double price;
    private double rating;

    @Lob
    @Column(name ="image")
    private byte[] image;
    
    @Lob
    @Column(name ="image2")
    private byte[] image2;

    @Lob
    @Column(name ="image3")
    private byte[] image3;

    @Lob
    @Column(name ="image4")
    private byte[] image4;

    @Lob
    @Column(name ="image5")
    private byte[] image5;

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "location_id")
    private Location location;

    private Double longitude;
    private Double latitude;

    // Constructors
    public Hotel() {
    }

    public Hotel(String name, String description, double price, double rating, byte[] image, byte[] image2, byte[] image3, byte[] image4, byte[] image5, Location location, Double longitude, Double latitude) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.rating = rating;
        this.image = image;
        this.image2 = image2;
        this.image3 = image3;
        this.image4 = image4;
        this.image5 = image5;
        this.location = location;
        this.longitude = longitude;
        this.latitude = latitude;
    }

    public Hotel(Long id, String name, String description, double price, double rating, byte[] image, byte[] image2, byte[] image3, byte[] image4, byte[] image5, Location location, Double longitude, Double latitude) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.rating = rating;
        this.image = image;
        this.image2 = image2;
        this.image3 = image3;
        this.image4 = image4;
        this.image5 = image5;
        this.location = location;
        this.longitude = longitude;
        this.latitude = latitude;
    }

    // Getters and Setters

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public byte[] getImage2() {
        return image2;
    }

    public void setImage2(byte[] image2) {
        this.image2 = image2;
    }

    public byte[] getImage3() {
        return image3;
    }

    public void setImage3(byte[] image3) {
        this.image3 = image3;
    }

    public byte[] getImage4() {
        return image4;
    }

    public void setImage4(byte[] image4) {
        this.image4 = image4;
    }

    public byte[] getImage5() {
        return image5;
    }

    public void setImage5(byte[] image5) {
        this.image5 = image5;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }
}