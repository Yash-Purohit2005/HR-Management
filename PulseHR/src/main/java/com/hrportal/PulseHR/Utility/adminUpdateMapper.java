package com.hrportal.PulseHR.Utility;

import com.hrportal.PulseHR.DTO.AdminProfileUpdateResponseDTO;
import com.hrportal.PulseHR.Entity.AdminProfile;
import com.hrportal.PulseHR.Entity.User;

public class adminUpdateMapper {

    public static AdminProfileUpdateResponseDTO updateAdminMapper(
            User user,
            AdminProfile adminProfile,boolean forceLogout) {

        AdminProfileUpdateResponseDTO dto = new AdminProfileUpdateResponseDTO();

        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setPhone(adminProfile.getPhone());
        dto.setDepartment(adminProfile.getDepartment());
        dto.setForceLogout(forceLogout);
        return dto;
    }
}
