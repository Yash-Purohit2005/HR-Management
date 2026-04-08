package com.hrportal.PulseHR.DTO;

import java.time.LocalDateTime;

public class ChatMessageDTO {

    // Who is sending the message
    private String senderEmail;

    // Who is receiving the message
    private String receiverEmail;

    // Message content
    private String content;

    // ADMIN or EMPLOYEE
    private String senderRole;

    // Populated when loading history (null when sending new message)
    private boolean isRead;
    private LocalDateTime sentAt;

    // --- Constructors ---

    public ChatMessageDTO() {}

    public ChatMessageDTO(String senderEmail, String receiverEmail,
                          String content, String senderRole,
                          boolean isRead, LocalDateTime sentAt) {
        this.senderEmail = senderEmail;
        this.receiverEmail = receiverEmail;
        this.content = content;
        this.senderRole = senderRole;
        this.isRead = isRead;
        this.sentAt = sentAt;
    }

    // --- Getters and Setters ---

    public String getSenderEmail() {
        return senderEmail;
    }

    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }

    public String getReceiverEmail() {
        return receiverEmail;
    }

    public void setReceiverEmail(String receiverEmail) {
        this.receiverEmail = receiverEmail;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSenderRole() {
        return senderRole;
    }

    public void setSenderRole(String senderRole) {
        this.senderRole = senderRole;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }
}