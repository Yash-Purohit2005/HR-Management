package com.hrportal.PulseHR.Entity;

import com.hrportal.PulseHR.Enums.AudienceType;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String message;

    private boolean important; // optional: highlight priority
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private AudienceType audience;// USER, ADMIN, ALL

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

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

    public AudienceType getAudience() {
        return audience;
    }

    public void setAudience(AudienceType audience) {
        this.audience = audience;
    }
}

