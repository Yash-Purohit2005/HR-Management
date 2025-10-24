package com.hrportal.PulseHR.Controller;

import com.hrportal.PulseHR.DTO.*;
import com.hrportal.PulseHR.Entity.ActivityLog;
import com.hrportal.PulseHR.Entity.User;
import com.hrportal.PulseHR.Service.ActivityLogService;
import com.hrportal.PulseHR.Service.EmployeeService;
import com.hrportal.PulseHR.Service.UserService;
import com.hrportal.PulseHR.Utility.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/employees")
//@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminEmployeeController {

    private final EmployeeService employeeService;
    private final ActivityLogService activityLogService;
    private final UserService userService;

    public AdminEmployeeController(EmployeeService employeeService, ActivityLogService activityLogService,UserService userService) {
        this.employeeService = employeeService;
        this.activityLogService = activityLogService;
        this.userService=userService;
    }


    @PostMapping("/create-employee")
    public EmployeeDTO createEmployee(@RequestBody EmployeeDTO employeeDTO) {
        EmployeeDTO createdEmployee = employeeService.createEmployee(employeeDTO);
        activityLogService.logActivity(
                "CREATE",
                "Admin",
                "Created employee: " + createdEmployee.getFirstName() + " (ID: " + createdEmployee.getId() + ")"
        );
        return createdEmployee;
    }

    @PutMapping("/update/{id}")
    public EmployeeDTO updateEmployee(@PathVariable Long id, @RequestBody EmployeeDTO employeeDTO) {
        EmployeeDTO updatedEmployee = employeeService.updateEmployee(id,employeeDTO);
        activityLogService.logActivity(
                "UPDATE",
                "Admin",
                "Updated employee: " + updatedEmployee.getFirstName() + " (ID: " + updatedEmployee.getId() + ")"
        );
        return updatedEmployee;
    }

    @DeleteMapping("/delete/{id}")
    public void deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        activityLogService.logActivity(
                "DELETE",
                "Admin", // Or fetch dynamically from the authenticated user
                "Deleted employee with ID: " + id
        );
    }

    @GetMapping("/get-all-employee")
    public Page<EmployeeDTO> getAllEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return employeeService.getAllEmployees(pageable);
    }

    @GetMapping("/search")
    public Page<EmployeeDTO> searchEmployees(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return employeeService.searchEmployees(keyword, pageable);
    }

    @GetMapping("/filter")
    public Page<EmployeeDTO> filterEmployees(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String designation,
            @RequestParam(required = false) Boolean active,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return employeeService.filterEmployees(department, designation, active, pageable);
    }

    @GetMapping("/recent")
    public List<EmployeeDTO> getRecentEmployees() {
        return employeeService.getRecentEmployees();
    }

    @GetMapping("/stats")
    public EmployeeStatsDTO getEmployeeStats() {
        return employeeService.getEmployeeStatistics();
    }

    @GetMapping("/logs/recent")
    public List<ActivityLogDTO> getRecentActivityLogs(@RequestParam(defaultValue = "10") int limit) {
        return activityLogService.getRecentActivityLogs(limit);
    }

    @GetMapping("/sort")
    public Page<EmployeeDTO> getSortedEmployeesByJoiningDate(
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return employeeService.getEmployeesSortedByJoiningDate(direction, pageable);
    }

    @GetMapping("/status")
    public List<EmployeeDTO> getEmployeesByStatus(@RequestParam boolean active) {
        return employeeService.getEmployeesByStatus(active);
    }

    @GetMapping("/{id}")
    public EmployeeDTO getEmployeeById(@PathVariable Long id) {
        return employeeService.getEmployeeById(id);
    }

    @PutMapping("/deactivate/{id}")
    public ResponseEntity<String> deactivateEmployee(@PathVariable Long id) {
        employeeService.deactivateEmployee(id);
        activityLogService.logActivity(
                "DEACTIVATE",
                "Admin", // Or fetch dynamically from the authenticated user
                "Deactivate employee with ID: " + id
        );
        return ResponseEntity.ok("Employee deactivated successfully.");
    }

    @PutMapping("/reactivate/{id}")
    public ResponseEntity<String> reactivateEmployee(@PathVariable Long id) {
        employeeService.reactivateEmployee(id);
        activityLogService.logActivity(
                "REACTIVATE",
                "Admin", // Or fetch dynamically from the authenticated user
                "Reactivate employee with ID: " + id
        );
        return ResponseEntity.ok("Employee reactivated successfully.");
    }

    @PutMapping("/admin/update-profile")
    public ResponseEntity<UserDTO> updateAdminProfile(@RequestBody UpdateAdminProfileRequestDTO request,
                                                      Principal principal) {
        String username = principal.getName(); // Fetch currently logged-in admin
        User updatedUser = userService.updateAdminProfile(username, request);
        UserDTO userDto = UserMapper.userDTO(updatedUser);
        activityLogService.logActivity(
                "UPDATE",
                "Admin", // Or fetch dynamically from the authenticated user
                "Updated profile successfully"
        );
        return ResponseEntity.ok(userDto);
    }

    // In AdminController.java

    @GetMapping("/admin/profile")
    public ResponseEntity<UserDTO> viewAdminProfile(Authentication authentication) {
        String username = authentication.getName();
        UserDTO userDTO = userService.getUserProfile(username);
        return ResponseEntity.ok(userDTO);
    }




}
