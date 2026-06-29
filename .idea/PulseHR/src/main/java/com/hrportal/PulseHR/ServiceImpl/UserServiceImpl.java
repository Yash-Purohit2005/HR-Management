package com.hrportal.PulseHR.ServiceImpl;

import com.hrportal.PulseHR.DTO.*;
import com.hrportal.PulseHR.Entity.AdminProfile;
import com.hrportal.PulseHR.Entity.User;
import com.hrportal.PulseHR.Repository.AdminProfileRepository;
import com.hrportal.PulseHR.Repository.UserRepository;
import com.hrportal.PulseHR.Service.UserService;
import com.hrportal.PulseHR.Utility.AdminMapper;
import com.hrportal.PulseHR.Utility.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import static com.hrportal.PulseHR.Utility.adminUpdateMapper.updateAdminMapper;

@Service
//@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AdminProfileRepository adminProfileRepository;

    public UserServiceImpl(UserRepository userRepository,AdminProfileRepository adminProfileRepository,PasswordEncoder passwordEncoder){
        this.userRepository=userRepository;
        this.adminProfileRepository=adminProfileRepository;
        this.passwordEncoder=passwordEncoder;
    }

    @Override
    public void changePassword(String username, PasswordChangeRequestDTO request) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Old password is incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New password and confirm password do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public AdminProfileUpdateResponseDTO updateAdminProfile(
            String email,
            UpdateAdminProfileRequestDTO request) {

        AdminProfile adminProfile = adminProfileRepository
                .findByUser_Email(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Admin profile not found with email: " + email));

        User user = adminProfile.getUser();
        boolean emailChanged = false;
        // Username check
        if (request.getName() != null &&
                !request.getName().equals(user.getUsername()) &&
                userRepository.existsByUsername(request.getName())) {
            throw new RuntimeException("Username already in use");
        }

        if (request.getName() != null) {
            user.setUsername(request.getName());
        }

        // Email check
        if (request.getEmail() != null &&
                !request.getEmail().equals(user.getEmail())) {

            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already in use");
            }

            user.setEmail(request.getEmail());
            emailChanged = true;
        }

        // Admin profile fields
        if (request.getPhone() != null) {
            adminProfile.setPhone(request.getPhone());
        }

        if (request.getDepartment() != null) {
            adminProfile.setDepartment(request.getDepartment());
        }

        userRepository.save(user);
        adminProfileRepository.save(adminProfile);

        return updateAdminMapper(user, adminProfile,emailChanged);
    }


    @Override
    public AdminProfileResponseDTO getUserProfile(String email) {
        AdminProfile profile = adminProfileRepository.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Admin profile not found"));

        return AdminMapper.adminDTO(profile);
    }

}
