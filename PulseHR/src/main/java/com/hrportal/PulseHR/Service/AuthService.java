package com.hrportal.PulseHR.Service;

import com.hrportal.PulseHR.DTO.AuthResponseDTO;
import com.hrportal.PulseHR.DTO.LoginRequestDTO;
import com.hrportal.PulseHR.DTO.RegisterRequestDTO;
import com.hrportal.PulseHR.DTO.UserDTO;

public interface AuthService {

    UserDTO register(RegisterRequestDTO request);
    AuthResponseDTO login(LoginRequestDTO request);
}
