package com.hrportal.PulseHR.Security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;

@Component
//@RequiredArgsConstructor
public class LogoutHandlerImpl implements LogoutHandler {

    private final JwtService jwtService;

    public LogoutHandlerImpl(JwtService jwtService){
        this.jwtService=jwtService;
    }

    @Override
    public void logout(HttpServletRequest request,
                       HttpServletResponse response,
                       Authentication authentication) {
        jwtService.clearTokenCookie(response); // Clears the cookie
    }
}
