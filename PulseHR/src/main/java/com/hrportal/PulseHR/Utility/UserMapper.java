package com.hrportal.PulseHR.Utility;

import com.hrportal.PulseHR.DTO.UserDTO;
import com.hrportal.PulseHR.Entity.User;

public class UserMapper {

    public static UserDTO userDTO(User user){
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setActive(user.isActive());
        dto.setRoles(user.getRoles());
        return dto;
    }

    public static User convertToEntity(UserDTO dto) {
        User user = new User();
        user.setId(dto.getId());
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setRoles(dto.getRoles());
        return user;
    }
}
