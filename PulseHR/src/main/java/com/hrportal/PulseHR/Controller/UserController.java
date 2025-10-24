package com.hrportal.PulseHR.Controller;

import com.hrportal.PulseHR.DTO.EmployeeDTO;
import com.hrportal.PulseHR.DTO.PasswordChangeRequestDTO;
import com.hrportal.PulseHR.Service.EmployeeService;
import com.hrportal.PulseHR.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/api/user")
@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
//@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"}, allowCredentials = "true")
public class UserController {

    private final UserService userService;
    private final EmployeeService employeeService;

    public UserController(UserService userService, EmployeeService employeeService) {
        this.userService = userService;
        this.employeeService = employeeService;
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<EmployeeDTO> viewEmployeeProfile(Authentication authentication) {
        String username = authentication.getName();
        EmployeeDTO employeeDTO = employeeService.getEmployeeProfileByUsername(username);
        return ResponseEntity.ok(employeeDTO);
    }

    @PutMapping("/update-profile")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<EmployeeDTO> updateEmployeeProfile(@RequestBody EmployeeDTO updatedDto, Authentication authentication) {
        String username = authentication.getName();
        EmployeeDTO updated = employeeService.updateEmployeeProfileByUsername(username, updatedDto);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/change-password")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<String> changePassword(@RequestBody PasswordChangeRequestDTO request, Authentication authentication) {
        String username = authentication.getName();
        userService.changePassword(username, request);
        return ResponseEntity.ok("Password changed successfully");
    }

}

