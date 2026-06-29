package com.hrportal.PulseHR.Utility;

import com.hrportal.PulseHR.DTO.AdminProfileResponseDTO;
import com.hrportal.PulseHR.Entity.AdminProfile;

import java.util.ArrayList;

public class AdminMapper {

    public static AdminProfileResponseDTO adminDTO(AdminProfile profile){
        AdminProfileResponseDTO dto = new AdminProfileResponseDTO();
        dto.setId(profile.getId());
        dto.setUsername(profile.getUser().getUsername());
        dto.setEmail(profile.getUser().getEmail());
        dto.setPhone(profile.getPhone());
        dto.setDepartment(profile.getDepartment());
        dto.setPreviousCompany(profile.getPreviousCompany());
        dto.setRoles(new ArrayList<>(profile.getUser().getRoles()));
        return dto;
    }
}
