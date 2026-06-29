package com.hrportal.PulseHR.Service;

import com.hrportal.PulseHR.DTO.NotificationDTO;
import com.hrportal.PulseHR.Entity.Notification;

import java.util.List;

public interface NotificationService {

    Notification createNotification(NotificationDTO dto);
    List<NotificationDTO> getNotificationsForUser(String role);
}
