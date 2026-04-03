package com.hrportal.PulseHR.Controller;

import com.hrportal.PulseHR.DTO.*;
import com.hrportal.PulseHR.Security.JwtService;
import com.hrportal.PulseHR.Service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
//@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"}, allowCredentials = "true")

//@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<AdminProfileResponseDTO> register(@Valid @RequestBody RegisterRequestDTO registerRequestDTO) {
        return ResponseEntity.ok(authService.register(registerRequestDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(
         @Valid   @RequestBody LoginRequestDTO loginRequestDTO,
            HttpServletResponse response) {


        AuthResponseDTO authResponse = authService.login(loginRequestDTO);

        jwtService.setTokenInCookie(response, authResponse.getToken());

        // Step 3: Return response with token and role and username
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/setup-password")
    public ResponseEntity<?> setupPassword(@RequestBody SetUpPasswordRequestDTO request) {
        try {
            authService.completeOnboarding(request);
            return ResponseEntity.ok(Map.of("message", "Password set successfully! You can now log in."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> requestReset(@RequestBody Map<String, String> request) {
        try {
            authService.processForgotPassword(request.get("email"));
            return ResponseEntity.ok(Map.of("message", "Reset link sent successfully."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    // Add the reset endpoint as well
    @PostMapping("/reset-password")
    public ResponseEntity<?> handleReset(@RequestBody Map<String, String> request) {
        try {
            authService.resetPassword(request.get("token"), request.get("password"));
            return ResponseEntity.ok(Map.of("message", "Password updated successfully."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

}
