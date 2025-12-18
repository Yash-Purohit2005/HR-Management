package com.hrportal.PulseHR.ServiceImpl;

import com.hrportal.PulseHR.DTO.*;
import com.hrportal.PulseHR.Entity.Employee;
import com.hrportal.PulseHR.Entity.LeaveRequest;
import com.hrportal.PulseHR.Enums.LeaveStatus;
import com.hrportal.PulseHR.Exception.LeaveAlreadyAppliedException;
import com.hrportal.PulseHR.Exception.ResourceNotFoundException;
import com.hrportal.PulseHR.Repository.EmployeeRepository;
import com.hrportal.PulseHR.Repository.LeaveRequestRepository;
import com.hrportal.PulseHR.Service.ActivityLogService;
import com.hrportal.PulseHR.Service.LeaveService;
import com.hrportal.PulseHR.Utility.LeaveRequestMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaveServiceImpl implements LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final ActivityLogService activityLogService;

    public LeaveServiceImpl(LeaveRequestRepository leaveRequestRepository,
                            EmployeeRepository employeeRepository,ActivityLogService activityLogService) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.employeeRepository = employeeRepository;
        this.activityLogService = activityLogService;
    }


    @Override
    public LeaveRequestDTO applyLeave(LeaveRequestDTO dto, String username) {
        Employee employee = employeeRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found for username: " + username));

        // ✅ Prevent overlapping leave for same user
        boolean alreadyApplied = leaveRequestRepository.existsByEmployeeAndDateRange(
                username, dto.getStartDate(), dto.getEndDate()
        );
        if (alreadyApplied) {
            throw new LeaveAlreadyAppliedException("You already have a leave applied for this date range.");
        }

        // ✅ Create entity
        LeaveRequest leave = LeaveRequestMapper.toEntity(dto, employee);
        leave.setEmployee(employee);
        leave.setStatus(LeaveStatus.PENDING);
        leave.setAppliedOn(LocalDate.now());

        // ✅ Save leave
        LeaveRequest savedLeave = leaveRequestRepository.save(leave);

        // ✅ Log activity
        activityLogService.logActivity(
                "Leave Applied",
                username,
                "Applied leave from " + dto.getStartDate() + " to " + dto.getEndDate()
        );

        // ✅ Return DTO
        return LeaveRequestMapper.toDTO(savedLeave);
    }


    @Override
    public Page<LeaveRequestDTO> getAllLeaves(Pageable pageable) {
        return leaveRequestRepository.findAll(pageable)
                .map(LeaveRequestMapper::toDTO);
    }

    @Override
    public Page<LeaveRequestDTO> getLeavesByEmployee(String username, Pageable pageable,String search) {
        Employee employee = employeeRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found for username: " + username));
        Page<LeaveRequest> leaves;
        if (search != null && !search.trim().isEmpty()) {
            leaves = leaveRequestRepository.searchByEmployeeAndKeyword(employee.getId(), search.toLowerCase(), pageable);
        } else {
            leaves = leaveRequestRepository.findByEmployee(employee, pageable);
        }

        return leaves.map(LeaveRequestMapper::toDTO);
    }

    @Override
    public LeaveRequestDTO updateLeaveStatus(Long leaveId, LeaveStatus status) {
        LeaveRequest leave = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave not found"));
        leave.setStatus(status);
        return LeaveRequestMapper.toDTO(leaveRequestRepository.save(leave));
    }

    @Override
    public void cancelLeave(Long leaveId, String username) {
        LeaveRequest leave = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave not found"));

        if (!leave.getEmployee().getUser().getUsername().equals(username)) {
            throw new AccessDeniedException("You can't cancel someone else's leave.");
        }

        if (!leave.getStatus().equals(LeaveStatus.PENDING)) {
            throw new IllegalStateException("Only PENDING leaves can be cancelled.");
        }

        leaveRequestRepository.delete(leave);
        activityLogService.logActivity("Leave Cancelled", username, "Cancelled leave from " + leave.getStartDate());
    }

    @Override
    public LeaveStatsDTO getStatsForAdmin() {
        LeaveStatsDTO stats = new LeaveStatsDTO();
        stats.setTotal(leaveRequestRepository.count());
        stats.setApproved(leaveRequestRepository.countByStatus("APPROVED"));
        stats.setPending(leaveRequestRepository.countByStatus("PENDING"));
        stats.setRejected(leaveRequestRepository.countByStatus("REJECTED"));
        return stats;
    }

    @Override
    public LeaveStatsDTO getStatsForUser(String username) {
        Employee employee = employeeRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        LeaveStatsDTO stats = new LeaveStatsDTO();
        stats.setTotal(leaveRequestRepository.countByEmployee(employee));
        stats.setApproved(leaveRequestRepository.countByEmployeeAndStatus(employee, LeaveStatus.APPROVED));
        stats.setPending(leaveRequestRepository.countByEmployeeAndStatus(employee, LeaveStatus.PENDING));
        stats.setRejected(leaveRequestRepository.countByEmployeeAndStatus(employee, LeaveStatus.REJECTED));
        return stats;
    }

    @Override
    public List<MonthlyLeaveTrendDTO> getMonthlyLeaveTrends() {
        List<Object[]> results = leaveRequestRepository.getMonthlyLeaveTrends();

        return results.stream().map(obj -> {
            MonthlyLeaveTrendDTO dto = new MonthlyLeaveTrendDTO();
            dto.setMonth((String) obj[1]);  // monthName
            dto.setApplied((Long) obj[2]);
            dto.setApproved((Long) obj[3]);
            dto.setRejected((Long) obj[4]);
            dto.setPending((Long) obj[5]);
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public List<LeaveTypeBreakdownDTO> getLeaveTypeBreakdown() {
        List<Object[]> result = leaveRequestRepository.getLeaveTypeBreakdown();

        return result.stream().map(obj -> {
            LeaveTypeBreakdownDTO dto = new LeaveTypeBreakdownDTO();
            dto.setLeaveType(obj[0].toString()); // Enum to String
            dto.setCount((Long) obj[1]);
            return dto;
        }).collect(Collectors.toList());
    }


    @Override
    public List<EmployeeLeaveStatsDTO> getEmployeeWiseLeaveStats() {
        List<Object[]> result = leaveRequestRepository.getEmployeeWiseLeaveStats();

        return result.stream().map(obj -> {
            EmployeeLeaveStatsDTO dto = new EmployeeLeaveStatsDTO();
            dto.setEmployeeId((Long) obj[0]);
            dto.setEmployeeName((String) obj[1]);
            dto.setApplied((Long) obj[2]);
            dto.setApproved((Long) obj[3]);
            dto.setPending((Long) obj[4]);
            dto.setRejected((Long) obj[5]);
            return dto;
        }).collect(Collectors.toList());
    }



}
