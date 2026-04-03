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
                "Created employee: " + createdEmployee.getFirstName() + " " + createdEmployee.getLastName() + " " + " (ID: " + createdEmployee.getId() + ")"
        );
        return createdEmployee;
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<EmployeeDTO> updateEmployee(
            @PathVariable Long id,
            @RequestBody EmployeeDTO employeeDTO) {
        // Enforce ID from path
        employeeDTO.setId(id);

        EmployeeDTO updatedEmployee = employeeService.updateEmployee(employeeDTO);

        activityLogService.logActivity(
                "UPDATE",
                "Admin",
                "Updated employee: " +
                        updatedEmployee.getFirstName() + " " +
                        updatedEmployee.getLastName() +
                        " (ID: " + updatedEmployee.getId() + ")"
        );

        return ResponseEntity.ok(updatedEmployee);
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
    public Page<ActivityLogDTO> getRecentActivities(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return activityLogService.getRecentActivitiesLogs(page, size);
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
        System.out.println("Deactivate API called for ID: " + id);
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

    @PatchMapping("/admin/update-profile")
    public ResponseEntity<AdminProfileUpdateResponseDTO> updateAdminProfile(@RequestBody UpdateAdminProfileRequestDTO request,
                                                      Principal principal) {
        String email = principal.getName(); // Fetch currently logged-in admin
        AdminProfileUpdateResponseDTO adminProfileUpdateResponseDTO = userService.updateAdminProfile(email, request);
        activityLogService.logActivity(
                "UPDATE",
                "Admin", // Or fetch dynamically from the authenticated user
                "Updated profile successfully"
        );
        return ResponseEntity.ok(adminProfileUpdateResponseDTO);
    }

    // In AdminController.java

    @GetMapping("/admin-profile")
    public ResponseEntity<AdminProfileResponseDTO> viewAdminProfile(Authentication authentication) {
        String email = authentication.getName();
       AdminProfileResponseDTO adminProfileResponseDTO= userService.getUserProfile(email);
        return ResponseEntity.ok(adminProfileResponseDTO);
    }




}
