package com.hrportal.PulseHR.ServiceImpl;

import com.hrportal.PulseHR.DTO.*;
import com.hrportal.PulseHR.Entity.AdminProfile;
import com.hrportal.PulseHR.Entity.User;
import com.hrportal.PulseHR.Exception.EmailAlreadyExistsException;
import com.hrportal.PulseHR.Exception.InvalidCredentialsException;
import com.hrportal.PulseHR.Repository.AdminProfileRepository;
import com.hrportal.PulseHR.Repository.UserRepository;
import com.hrportal.PulseHR.Security.JwtService;
import com.hrportal.PulseHR.Service.AuthService;
import com.hrportal.PulseHR.Utility.AdminMapper;
import com.hrportal.PulseHR.Utility.UserMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AdminProfileRepository adminProfileRepository;
    private final EmailService emailService;

    public AuthServiceImpl(UserRepository userRepository,
                           AdminProfileRepository adminProfileRepository,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService,
                           EmailService emailService) {
        this.userRepository = userRepository;
        this.adminProfileRepository=adminProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService= emailService;
    }

    @Override
    public AdminProfileResponseDTO register(RegisterRequestDTO request) {
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

        AdminProfile profile = new AdminProfile();
        profile.setUser(user);
        profile.setPhone(request.getPhoneNo());
        profile.setDepartment(request.getDepartment());
        profile.setPreviousCompany(request.getPreviousCompany());

        adminProfileRepository.save(profile);
        return AdminMapper.adminDTO(profile);
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

        String role = user.getRoles().stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("User has no role assigned"));

        String token = jwtService.generateToken(request.getEmail(), role);


        return new AuthResponseDTO(token, role, user.getUsername());
    }

    @Override
    @Transactional
    public void completeOnboarding(SetUpPasswordRequestDTO request) {
        // 1. Find the user by the setupToken
        User user = userRepository.findBySetupToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid or already used invitation link."));

        // 2. Security Check: Is the token expired?
        if (user.getSetupTokenExpiry() != null && user.getSetupTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("This invitation link has expired. Please contact your HR Admin.");
        }

        // 3. Update the User Security Info
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPasswordSet(true);      // Flip the flag
        user.setSetupToken(null);        // IMPORTANT: Delete token so it can't be used twice
        user.setSetupTokenExpiry(null);

        userRepository.save(user);
    }

    @Override
    public void processForgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email address not found."));

        if (!user.isActive()) {
            throw new RuntimeException("This account is inactive. Please contact Admin.");
        }

        // Generate token and set short expiry (15 mins)
        String token = UUID.randomUUID().toString();
        user.setSetupToken(token);
        user.setSetupTokenExpiry(LocalDateTime.now().plusMinutes(15));

        userRepository.save(user);

        // Send email
        emailService.sendForgotPasswordEmail(user.getEmail(), user.getUsername(), token);
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findBySetupToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset link."));

        if (user.getSetupTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("This link has expired.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));

        // CRITICAL: Clear the token so it cannot be used a second time
        user.setSetupToken(null);
        user.setSetupTokenExpiry(null);

        userRepository.save(user);
    }


}
