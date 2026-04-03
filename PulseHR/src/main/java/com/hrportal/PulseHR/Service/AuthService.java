package com.hrportal.PulseHR.Service;

import com.hrportal.PulseHR.DTO.*;

public interface AuthService {

    AdminProfileResponseDTO register(RegisterRequestDTO request);
    AuthResponseDTO login(LoginRequestDTO request);
    void completeOnboarding(SetUpPasswordRequestDTO request);
    void processForgotPassword(String email);
    void resetPassword(String token, String newPassword);
}
