package com.hrportal.PulseHR.ServiceImpl;

import com.hrportal.PulseHR.DTO.NotificationDTO;
import com.hrportal.PulseHR.Entity.Notification;
import com.hrportal.PulseHR.Enums.AudienceType;
import com.hrportal.PulseHR.Repository.NotificationRepository;
import com.hrportal.PulseHR.Service.NotificationService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public NotificationDTO createNotification(NotificationDTO dto) {
        Notification notification = new Notification();
        notification.setTitle(dto.getTitle());
        notification.setMessage(dto.getMessage());
        notification.setImportant(dto.isImportant());
        notification.setCreatedAt(LocalDateTime.now());
        notification.setAudience(AudienceType.valueOf(dto.getAudience().toUpperCase()));
        notificationRepository.save(notification);
        return dto;
    }

    @Override
    public List<NotificationDTO> getNotificationsForUser(String role) {
        List<AudienceType> audiences = switch (role.toUpperCase()) {
            case "ADMIN" -> List.of(AudienceType.ADMIN, AudienceType.ALL);
            case "USER" -> List.of(AudienceType.USER, AudienceType.ALL);
            default -> List.of(AudienceType.ALL);
        };

        return notificationRepository.findTop10ByAudienceInOrderByCreatedAtDesc(audiences).stream()
                .map(n -> {
                    NotificationDTO dto = new NotificationDTO();
                    dto.setTitle(n.getTitle());
                    dto.setMessage(n.getMessage());
                    dto.setCreatedAt(n.getCreatedAt());
                    dto.setImportant(n.isImportant());
                    dto.setAudience(n.getAudience().name());
                    return dto;
                })
                .toList();
    }
}

