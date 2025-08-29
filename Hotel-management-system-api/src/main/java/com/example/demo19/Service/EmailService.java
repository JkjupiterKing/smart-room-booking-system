package com.example.demo19.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import com.example.demo19.Modal.Booking;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendBookingConfirmation(String toEmail, Booking booking) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Room Booking Confirmation - " + booking.getRoomTitle());

        String text = "Dear Customer,\n\n" +
                "Thank you for your booking. Here are your booking details:\n\n" +
                "Room: " + booking.getRoomTitle() + "\n" +
                "Check-in: " + booking.getCheckInDate() + "\n" +
                "Check-out: " + booking.getCheckOutDate() + "\n" +
                "Adults: " + booking.getAdults() + "\n" +
                "Children: " + booking.getChildren() + "\n" +
                "Amenities: " + booking.getAmenities() + "\n" +
                "Meals: " + booking.getMeals() + "\n" +
                "Payment Method: " + booking.getPaymentMethod() + "\n" +
                "Total Amount : ₹" + booking.getTotalAmount() + "\n\n" +
                "We look forward to hosting you!\n\n" +
                "Best regards,\nQuickStay Team";

        message.setText(text);
        mailSender.send(message);
    }
}
