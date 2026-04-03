package com.hrportal.PulseHR.Service;

import com.hrportal.PulseHR.DTO.ActivityLogDTO;
import com.hrportal.PulseHR.Entity.ActivityLog;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ActivityLogService {
    void logActivity(String action, String performedBy, String details);

    Page<ActivityLogDTO> getRecentActivitiesLogs(int page, int size);

}

