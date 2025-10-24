package com.hrportal.PulseHR.ServiceImpl;

import com.hrportal.PulseHR.DTO.PasswordChangeRequestDTO;
import com.hrportal.PulseHR.DTO.UpdateAdminProfileRequestDTO;
import com.hrportal.PulseHR.DTO.UserDTO;
import com.hrportal.PulseHR.Entity.User;
import com.hrportal.PulseHR.Repository.UserRepository;
import com.hrportal.PulseHR.Service.UserService;
import com.hrportal.PulseHR.Utility.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
//@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,PasswordEncoder passwordEncoder){
        this.userRepository=userRepository;
        this.passwordEncoder=passwordEncoder;
    }

    @Override
    public void changePassword(String username, PasswordChangeRequestDTO request) {
        User user = userRepository.findByUsername(username)
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
    public User updateAdminProfile(String username, UpdateAdminProfileRequestDTO request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found with username: " + username));

        if (request.getName() != null) user.setUsername(request.getName());
        if (request.getEmail() != null) user.setEmail(request.getEmail());


        return userRepository.save(user);
    }

    @Override
    public UserDTO getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return UserMapper.userDTO(user);
    }

}
