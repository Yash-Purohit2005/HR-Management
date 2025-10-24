package com.hrportal.PulseHR.Service;

import com.hrportal.PulseHR.DTO.NotificationDTO;

import java.util.List;

public interface NotificationService {

    NotificationDTO createNotification(NotificationDTO dto);
    List<NotificationDTO> getNotificationsForUser(String role);
}
