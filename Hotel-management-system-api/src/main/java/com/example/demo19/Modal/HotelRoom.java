package com.example.demo19.Modal;

import jakarta.persistence.*;

@Entity
@Table(name = "hotel_rooms")
public class HotelRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Long roomId;

//    @ManyToOne
//    @JoinColumn(name = "hotel_id", nullable = false)
//    private Hotel hotel;

    @Column
    private Long hotelId;

    @Column
    private String hotelName;

    @Column(name = "room_type", nullable = false)
    private String roomType;

    @Column(name = "capacity", nullable = false)
    private int capacity;

    @Column(name = "price_per_night", nullable = false)
    private double pricePerNight;

    @Column(name = "total_rooms", nullable = false)
    private int totalRooms;

    // Constructors
    public HotelRoom() {
    }

    public HotelRoom(Long hoteId, String roomType, int capacity, double pricePerNight, int totalRooms) {
        this.hotelId = hoteId;
        this.roomType = roomType;
        this.capacity = capacity;
        this.pricePerNight = pricePerNight;
        this.totalRooms = totalRooms;
    }

    public Long getHotelId() {
        return hotelId;
    }

    public void setHotelId(Long hotelId) {
        this.hotelId = hotelId;
    }

    // Getters and Setters
    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

//    public Hotel getHotel() {
//        return hotel;
//    }
//
//    public void setHotel(Hotel hotel) {
//        this.hotel = hotel;
//    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public double getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(double pricePerNight) {
        this.pricePerNight = pricePerNight;
    }

    public int getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(int totalRooms) {
        this.totalRooms = totalRooms;
    }

    public String getHotelName() {
        return hotelName;
    }

    public void setHotelName(String hotelName) {
        this.hotelName = hotelName;
    }
}
