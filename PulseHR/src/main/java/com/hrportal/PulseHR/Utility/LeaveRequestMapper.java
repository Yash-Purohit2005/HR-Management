package com.hrportal.PulseHR.Utility;

import com.hrportal.PulseHR.DTO.LeaveRequestDTO;
import com.hrportal.PulseHR.DTO.LeaveRequestResponseDTO;
import com.hrportal.PulseHR.Entity.Employee;
import com.hrportal.PulseHR.Entity.LeaveRequest;
import com.hrportal.PulseHR.Enums.LeaveStatus;

import java.time.LocalDate;

public class LeaveRequestMapper {

    // Convert Entity to DTO
    public static LeaveRequestDTO toDTO(LeaveRequest leaveRequest) {
        LeaveRequestDTO dto = new LeaveRequestDTO();
        dto.setStartDate(leaveRequest.getStartDate());
        dto.setEndDate(leaveRequest.getEndDate());
        dto.setLeaveType(leaveRequest.getLeaveType());
        dto.setReason(leaveRequest.getReason());
        dto.setStatus(leaveRequest.getStatus());
        dto.setAppliedOn(leaveRequest.getAppliedOn());
        dto.setLeaveId(leaveRequest.getId());
        return dto;
    }

    // Convert DTO to Entity
    public static LeaveRequest toEntity(LeaveRequestDTO dto, Employee employee) {
        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setStartDate(dto.getStartDate());
        leaveRequest.setEndDate(dto.getEndDate());
        leaveRequest.setLeaveType(dto.getLeaveType());
        leaveRequest.setReason(dto.getReason());
        leaveRequest.setStatus(LeaveStatus.PENDING); // Set default enum
        leaveRequest.setAppliedOn(LocalDate.now());
        leaveRequest.setEmployee(employee);
        return leaveRequest;
    }

    public static LeaveRequestResponseDTO toResponseDTO(LeaveRequest leaveRequest) {
        LeaveRequestResponseDTO dto = new LeaveRequestResponseDTO();
        dto.setId(leaveRequest.getId());
        dto.setStartDate(leaveRequest.getStartDate());
        dto.setEndDate(leaveRequest.getEndDate());
        dto.setLeaveType(leaveRequest.getLeaveType().toString());
        dto.setReason(leaveRequest.getReason());
        dto.setStatus(leaveRequest.getStatus().toString());
        dto.setAppliedOn(leaveRequest.getAppliedOn());
        return dto;
    }
}

