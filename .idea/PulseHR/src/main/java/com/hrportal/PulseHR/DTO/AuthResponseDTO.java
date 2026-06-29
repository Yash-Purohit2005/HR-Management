package com.hrportal.PulseHR.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//@Data
//@NoArgsConstructor
//@AllArgsConstructor
public class AuthResponseDTO {
    private String token;
    private String role;
    private String username;

    public AuthResponseDTO() {}

    public AuthResponseDTO(String token, String role,String username) {
        this.token = token;
        this.role = role;
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }


    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
