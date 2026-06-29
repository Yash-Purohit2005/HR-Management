package com.hrportal.PulseHR.Service;

import com.hrportal.PulseHR.DTO.*;
import com.hrportal.PulseHR.Entity.User;

public interface UserService {
    void changePassword(String username, PasswordChangeRequestDTO request);
    AdminProfileUpdateResponseDTO updateAdminProfile(String email, UpdateAdminProfileRequestDTO request);
    AdminProfileResponseDTO getUserProfile(String email);
}
