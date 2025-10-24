package com.hrportal.PulseHR.Controller;

import com.hrportal.PulseHR.DTO.AuthResponseDTO;
import com.hrportal.PulseHR.DTO.LoginRequestDTO;
import com.hrportal.PulseHR.DTO.RegisterRequestDTO;
import com.hrportal.PulseHR.DTO.UserDTO;
import com.hrportal.PulseHR.Security.JwtService;
import com.hrportal.PulseHR.Service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<UserDTO> register(@Valid @RequestBody RegisterRequestDTO registerRequestDTO) {
        return ResponseEntity.ok(authService.register(registerRequestDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(
         @Valid   @RequestBody LoginRequestDTO loginRequestDTO,
            HttpServletResponse response) {


        AuthResponseDTO authResponse = authService.login(loginRequestDTO);

        jwtService.setTokenInCookie(response, authResponse.getToken());

        // Step 3: Return response with token and role
        return ResponseEntity.ok(authResponse);
    }

}
