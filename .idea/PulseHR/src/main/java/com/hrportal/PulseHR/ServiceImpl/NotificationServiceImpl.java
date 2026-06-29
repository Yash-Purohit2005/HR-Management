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

    public Notification createNotification(NotificationDTO dto) {
        Notification notification = new Notification();

        notification.setTitle(dto.getTitle());
        notification.setMessage(dto.getMessage());
        notification.setCreatedAt(LocalDateTime.now());

        // Logic: Mark as 'important' if priority is URGENT
        notification.setImportant("URGENT".equalsIgnoreCase(dto.getPriority()));

        // Enum Mapping: String -> AudienceType (USER, ADMIN, ALL)
        if (dto.getAudience() != null) {
            try {
                notification.setAudience(AudienceType.valueOf(dto.getAudience().toUpperCase()));
            } catch (IllegalArgumentException e) {
                notification.setAudience(AudienceType.USER); // Fallback
            }
        } else {
            notification.setAudience(AudienceType.USER);
        }

        return notificationRepository.save(notification);
    }

    @Override
    public List<NotificationDTO> getNotificationsForUser(String role) {
        // 1. Normalize the role (Handle ROLE_USER -> USER)
        String cleanRole = role.replace("ROLE_", "").toUpperCase();

        // 2. Determine which audiences this user is allowed to see
        List<AudienceType> audiences = switch (cleanRole) {
            case "ADMIN" -> List.of(AudienceType.ADMIN, AudienceType.ALL);
            case "USER" -> List.of(AudienceType.USER, AudienceType.ALL);
            default -> List.of(AudienceType.ALL);
        };

        // 3. Fetch from DB and Map to DTO
        return notificationRepository.findTop10ByAudienceInOrderByCreatedAtDesc(audiences)
                .stream()
                .map(n -> {
                    NotificationDTO dto = new NotificationDTO();
                    dto.setTitle(n.getTitle());
                    dto.setMessage(n.getMessage());
                    dto.setCreatedAt(n.getCreatedAt());
                    dto.setImportant(n.isImportant());
                    // Crucial: Use .name() to get the String "USER" or "ADMIN"
                    dto.setAudience(n.getAudience().name());
                    return dto;
                })
                .toList();
    }
}

