package com.hrportal.PulseHR.DTO;

import java.time.LocalDateTime;

public class ChatMessageDTO {

    private Long id;
    private String senderEmail;
    private String receiverEmail;
    private String content;
    private String senderRole;
    private boolean isRead;
    private LocalDateTime sentAt;

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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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