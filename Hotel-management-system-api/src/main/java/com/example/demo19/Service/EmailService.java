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
        message.setSubject("Room Booking Confirmation - " + booking.getHotelName());

        String text = "Dear Customer,\n\n" +
                "Thank you for your booking. Here are your booking details:\n\n" +
                "Hotel: " + booking.getHotelName() + "\n" +
                "Room Type: " + booking.getRoomType() + "\n" +
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
    public void sendWelcomeEmail(String toEmail, String username) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("yourgmail@gmail.com"); // must match your configured email
        message.setTo(toEmail);
        message.setSubject("Welcome to QuickStay!");
        message.setText("Hi " + username + ",\n\n" +
                "Thank you for registering with QuickStay. We're excited to have you on board!\n\n" +
                "Best Regards,\nQuickStay Team");

        mailSender.send(message);
    }
}
