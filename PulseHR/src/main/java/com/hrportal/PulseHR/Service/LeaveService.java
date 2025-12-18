package com.hrportal.PulseHR.Service;

import com.hrportal.PulseHR.DTO.*;
import com.hrportal.PulseHR.Enums.LeaveStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface LeaveService {

    LeaveRequestDTO applyLeave(LeaveRequestDTO dto, String username);
    Page<LeaveRequestDTO> getAllLeaves(Pageable pageable); // pagination + sorting
    Page<LeaveRequestDTO> getLeavesByEmployee(String username, Pageable pageable,String search);
    LeaveRequestDTO updateLeaveStatus(Long leaveId, LeaveStatus status);
    void cancelLeave(Long leaveId, String username);
    LeaveStatsDTO getStatsForAdmin();
    LeaveStatsDTO getStatsForUser(String username);
    List<MonthlyLeaveTrendDTO> getMonthlyLeaveTrends();
    List<LeaveTypeBreakdownDTO> getLeaveTypeBreakdown();
    List<EmployeeLeaveStatsDTO> getEmployeeWiseLeaveStats();


}
