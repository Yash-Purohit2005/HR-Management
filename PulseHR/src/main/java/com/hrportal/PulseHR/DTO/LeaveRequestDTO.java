package com.hrportal.PulseHR.DTO;

import com.hrportal.PulseHR.Enums.LeaveStatus;
import com.hrportal.PulseHR.Enums.LeaveType;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class LeaveRequestDTO {

    @NotNull(message = "Start date is required")
    @FutureOrPresent(message = "Start date must be today or in the future")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    @FutureOrPresent(message = "End date must be today or in the future")
    private LocalDate endDate;

    @NotNull(message = "Leave type is required")
    private LeaveType leaveType;

    @NotNull(message = "Reason is required")
    @Size(min = 5, max = 255, message = "Reason must be between 5 and 255 characters")
    private String reason;

    private LeaveStatus status;  // Optional for request, returned in response
    private LocalDate appliedOn; // Only returned
    private Long leaveId;

    public long getLeaveId() {
        return leaveId;
    }

    public void setLeaveId(long leaveId) {
        this.leaveId = leaveId;
    }
// Getters and Setters

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public LeaveType getLeaveType() {
        return leaveType;
    }

    public void setLeaveType(LeaveType leaveType) {
        this.leaveType = leaveType;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LeaveStatus getStatus() {
        return status;
    }

    public void setStatus(LeaveStatus status) {
        this.status = status;
    }

    public LocalDate getAppliedOn() {
        return appliedOn;
    }

    public void setAppliedOn(LocalDate appliedOn) {
        this.appliedOn = appliedOn;
    }
}

