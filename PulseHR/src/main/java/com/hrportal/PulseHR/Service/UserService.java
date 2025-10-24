package com.hrportal.PulseHR.Service;

import com.hrportal.PulseHR.DTO.PasswordChangeRequestDTO;
import com.hrportal.PulseHR.DTO.UpdateAdminProfileRequestDTO;
import com.hrportal.PulseHR.DTO.UserDTO;
import com.hrportal.PulseHR.Entity.User;

public interface UserService {
    void changePassword(String username, PasswordChangeRequestDTO request);
    User updateAdminProfile(String username, UpdateAdminProfileRequestDTO request);
    UserDTO getUserProfile(String username);
}
