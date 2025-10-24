package com.hrportal.PulseHR.Controller;

import com.hrportal.PulseHR.DTO.*;
import com.hrportal.PulseHR.Enums.LeaveStatus;
import com.hrportal.PulseHR.Service.ActivityLogService;
import com.hrportal.PulseHR.Service.LeaveService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaves")
@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
public class LeaveRequestController {

    private final LeaveService leaveService;


    public LeaveRequestController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @PostMapping("/apply")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> applyLeave(
            @Valid @RequestBody LeaveRequestDTO dto,
            Authentication auth) {
        String username = auth.getName();
        LeaveRequestDTO savedLeave = leaveService.applyLeave(dto, username);
        return ResponseEntity.ok(Map.of(
                "message", "Leave applied successfully",
                "leave", savedLeave
        ));
    }


    @GetMapping("/my-leaves")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Page<LeaveRequestDTO>> getMyLeaves(
            Authentication auth,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "appliedOn") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        String direction = sortDir.trim().toLowerCase();
        if (!direction.equals("asc") && !direction.equals("desc")) {
            direction = "desc"; // fallback to default
        }
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(direction), sortBy));
        return ResponseEntity.ok(leaveService.getLeavesByEmployee(auth.getName(), pageable));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<LeaveRequestDTO>> getAllLeaves(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "appliedOn") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortDir), sortBy));
        return ResponseEntity.ok(leaveService.getAllLeaves(pageable));
    }

    @PutMapping("/update-status/{leaveId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LeaveRequestDTO> updateStatus(
            @PathVariable Long leaveId,
            @RequestParam LeaveStatus status) {

        return ResponseEntity.ok(leaveService.updateLeaveStatus(leaveId, status));
    }

    @DeleteMapping("/cancel/{leaveId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> cancelLeave(@PathVariable Long leaveId, Authentication auth) {
        leaveService.cancelLeave(leaveId, auth.getName());
        return ResponseEntity.ok("Leave cancelled successfully");
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LeaveStatsDTO> getLeaveStatsForAdmin() {
        return ResponseEntity.ok(leaveService.getStatsForAdmin());
    }

    @GetMapping("/my-leave-stats")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<LeaveStatsDTO> getLeaveStatsForUser(Authentication auth) {
        return ResponseEntity.ok(leaveService.getStatsForUser(auth.getName()));
    }

    @GetMapping("/stats/monthly-trends")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MonthlyLeaveTrendDTO>> getMonthlyTrends() {
        return ResponseEntity.ok(leaveService.getMonthlyLeaveTrends());
    }

    @GetMapping("/stats/leave-type-breakdown")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LeaveTypeBreakdownDTO>> getLeaveTypeBreakdown() {
        return ResponseEntity.ok(leaveService.getLeaveTypeBreakdown());
    }

    @GetMapping("/stats/employee-wise")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EmployeeLeaveStatsDTO>> getEmployeeWiseStats() {
        return ResponseEntity.ok(leaveService.getEmployeeWiseLeaveStats());
    }



}
