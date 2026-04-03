package com.hrportal.PulseHR.ServiceImpl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {


    private JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender){
        this.mailSender=mailSender;
    }

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public void sendWelcomeEmail(String to, String name, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail); // Must match your properties
        message.setTo(to);
        message.setSubject("Welcome to PulseHR!");
        message.setText(
                "Hi " + name + ",\n\n" +
                        "Welcome to PulseHR! Your account has been created by your HR Admin.\n\n" +
                        "To get started, please set up your password by clicking the link below:\n\n" +
                         "http://localhost:5173/setup-password?token=" + token + "\n\n" +
                        "⚠️ This link will expire in 24 hours.\n\n" +
                        "If you did not expect this email, please ignore it or contact your HR Admin.\n\n" +
                        "Regards,\n" +
                        "PulseHR Team"
        );
        mailSender.send(message);
    }

    public void sendForgotPasswordEmail(String toEmail, String name, String token) {
        // Uses the IP variable we set up earlier for Mobile/Laptop support
        String resetLink = frontendUrl + "/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("PulseHR | Password Reset Request");
        message.setText("Hello " + name + ",\n\n" +
                "Click the link below to reset your PulseHR password:\n" +
                resetLink + "\n\n" +
                "Note: This link expires in 15 minutes.\n" +
                "If you didn't request this, you can safely ignore this email.");

        mailSender.send(message);
    }
}
