package com.hrportal.PulseHR.ServiceImpl;

import com.hrportal.PulseHR.DTO.ActivityLogDTO;
import com.hrportal.PulseHR.Entity.ActivityLog;
import com.hrportal.PulseHR.Repository.ActivityLogRepository;
import com.hrportal.PulseHR.Service.ActivityLogService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivityLogServiceImpl implements ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    public  ActivityLogServiceImpl(ActivityLogRepository activityLogRepository){
        this.activityLogRepository=activityLogRepository;
    }

    @Override
    public void logActivity(String action, String performedBy, String details) {
        ActivityLog log = new ActivityLog();
        log.setAction(action);
        log.setPerformedBy(performedBy);
        log.setDetails(details);
        log.setTimestamp(LocalDateTime.now());

        activityLogRepository.save(log); // 👈 Required to store in DB
    }

    @Override
    public List<ActivityLogDTO> getRecentActivityLogs(int limit) {
        return activityLogRepository.findRecentLogs(limit).stream().map(log -> {
            ActivityLogDTO dto = new ActivityLogDTO();
            dto.setAction(log.getAction());
            dto.setPerformedBy(log.getPerformedBy());
            dto.setDetails(log.getDetails());
            dto.setTimestamp(log.getTimestamp());
            return dto;
        }).collect(Collectors.toList());
    }
}
