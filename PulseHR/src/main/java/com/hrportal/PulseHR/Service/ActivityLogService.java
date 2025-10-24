package com.hrportal.PulseHR.Service;

import com.hrportal.PulseHR.DTO.ActivityLogDTO;
import com.hrportal.PulseHR.Entity.ActivityLog;

import java.util.List;

public interface ActivityLogService {
    void logActivity(String action, String performedBy, String details);

    List<ActivityLogDTO> getRecentActivityLogs(int limit);

}

