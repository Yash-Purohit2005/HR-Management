package com.hrportal.PulseHR.Controller;

import com.hrportal.PulseHR.DTO.*;
import com.hrportal.PulseHR.Security.JwtService;
import com.hrportal.PulseHR.Service.AuthService;
import com.hrportal.PulseHR.ServiceImpl.RateLimiterService;
import jakarta.servlet.http.HttpServletRequest;
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
    private final RateLimiterService rateLimiterService;

    public AuthController(AuthService authService, JwtService jwtService,  RateLimiterService rateLimiterService) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.rateLimiterService = rateLimiterService;
    }

    @PostMapping("/register")
    public ResponseEntity<AdminProfileResponseDTO> register(@Valid @RequestBody RegisterRequestDTO registerRequestDTO) {
        return ResponseEntity.ok(authService.register(registerRequestDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
         @Valid   @RequestBody LoginRequestDTO loginRequestDTO,
         HttpServletRequest request, HttpServletResponse response) {

        String ip = request.getRemoteAddr();

        if (!rateLimiterService.tryLoginRequest(ip)) {
            return ResponseEntity
                    .status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of("error", "Too many login attempts. Please wait 1 minute and try again."));
        }

        AuthResponseDTO authResponse = authService.login(loginRequestDTO);
        jwtService.setTokenInCookie(response, authResponse.getToken());
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
    public ResponseEntity<?> requestReset(
            @RequestBody Map<String, String> request,
            HttpServletRequest httpRequest) {

        String email = request.get("email");

        if (!rateLimiterService.tryForgotPasswordRequest(email)) {
            long retryAfter = rateLimiterService.getForgotPasswordRetryAfter(email);
            return ResponseEntity
                    .status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of(
                            "error", "Too many requests. Please wait before trying again.",
                            "retryAfter", retryAfter  // 👈 exact seconds from bucket
                    ));
        }

        try {
            authService.processForgotPassword(email);
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

    @GetMapping("/forgot-password/status")
    public ResponseEntity<?> forgotPasswordStatus(@RequestParam String email) {
        long retryAfter = rateLimiterService.getForgotPasswordRetryAfter(email);
        return ResponseEntity.ok(Map.of("retryAfter", retryAfter));
    }

}
