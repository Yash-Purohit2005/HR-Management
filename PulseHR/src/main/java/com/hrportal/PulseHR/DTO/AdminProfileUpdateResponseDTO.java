package com.hrportal.PulseHR.DTO;

public class AdminProfileUpdateResponseDTO {

    private String username;
    private String email;
    private String phone;
    private String department;
    private boolean forceLogout;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public void setForceLogout(boolean forceLogout) {
        this.forceLogout=forceLogout;
    }
    public boolean getForceLogout() {
        return forceLogout;
    }
}
