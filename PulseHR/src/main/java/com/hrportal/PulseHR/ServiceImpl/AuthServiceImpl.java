package com.hrportal.PulseHR.ServiceImpl;

import com.hrportal.PulseHR.DTO.AuthResponseDTO;
import com.hrportal.PulseHR.DTO.LoginRequestDTO;
import com.hrportal.PulseHR.DTO.RegisterRequestDTO;
import com.hrportal.PulseHR.DTO.UserDTO;
import com.hrportal.PulseHR.Entity.User;
import com.hrportal.PulseHR.Exception.EmailAlreadyExistsException;
import com.hrportal.PulseHR.Exception.InvalidCredentialsException;
import com.hrportal.PulseHR.Repository.UserRepository;
import com.hrportal.PulseHR.Security.JwtService;
import com.hrportal.PulseHR.Service.AuthService;
import com.hrportal.PulseHR.Utility.UserMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;


    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public UserDTO register(RegisterRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exist");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(Set.of(request.getRole().toUpperCase()));
        user.setActive(true);

        userRepository.save(user);
        return UserMapper.userDTO(user);
    }

    @Override
    public AuthResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!user.isActive()) {
            throw new RuntimeException("Account is inactive. Contact admin.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid username or password");
        }

        String token = jwtService.generateToken(request.getEmail());
        String role = user.getRoles().stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("User has no role assigned"));

        return new AuthResponseDTO(token, role, user.getUsername());
    }
}
