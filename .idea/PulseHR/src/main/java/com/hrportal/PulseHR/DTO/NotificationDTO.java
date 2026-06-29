package com.hrportal.PulseHR.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

public class NotificationDTO {
    private String title;
    private String message;
    private String priority; // From React: "LOW", "NORMAL", "HIGH", "URGENT"

    @JsonProperty("targetRole") // Mapping the Frontend key to Backend field
    private String audience;


    private boolean important; // For outgoing responses
    private LocalDateTime createdAt;

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getAudience() { return audience; }
    public void setAudience(String audience) { this.audience = audience; }
    public boolean isImportant() {
        return important;
    }

    public void setImportant(boolean important) {
        this.important = important;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}