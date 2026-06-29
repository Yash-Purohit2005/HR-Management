package com.hrportal.PulseHR.DTO;

public class StatusEventDTO {

    private String email;
    private String type; // "ONLINE", "OFFLINE", "TYPING", "STOP_TYPING", "READ"
    private String targetEmail;

    public StatusEventDTO() {}

    public StatusEventDTO(String email, String type, String targetEmail) {
        this.email = email;
        this.type = type;
        this.targetEmail = targetEmail;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTargetEmail() {
        return targetEmail;
    }

    public void setTargetEmail(String targetEmail) {
        this.targetEmail = targetEmail;
    }
}
