package com.example.demo19.dto;

public class AvailabilityCheckResponse {
    private Long hotelId;
    private String hotelName;
    private String roomType;
    private Long numberOfBookings;
    private Long totalRooms;

    public AvailabilityCheckResponse(Long hotelId, String hotelName, String roomType, Long numberOfBookings, Long totalRooms) {
        this.hotelId = hotelId;
        this.hotelName = hotelName;
        this.roomType = roomType;
        this.numberOfBookings = numberOfBookings;
        this.totalRooms = totalRooms;
    }

    // Getters and Setters
    public Long getHotelId() { return hotelId; }
    public void setHotelId(Long hotelId) { this.hotelId = hotelId; }
    public String getHotelName() { return hotelName; }
    public void setHotelName(String hotelName) { this.hotelName = hotelName; }
    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }
    public Long getNumberOfBookings() { return numberOfBookings; }
    public void setNumberOfBookings(Long numberOfBookings) { this.numberOfBookings = numberOfBookings; }
    public Long getTotalRooms() { return totalRooms; }
    public void setTotalRooms(Long totalRooms) { this.totalRooms = totalRooms; }
}
