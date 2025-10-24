package com.hrportal.PulseHR.Controller;

import com.hrportal.PulseHR.DTO.NotificationDTO;
import com.hrportal.PulseHR.Service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService){
        this.notificationService=notificationService;
    }


    @PostMapping("/admin/create-notification")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NotificationDTO> create(@RequestBody NotificationDTO dto) {
        return ResponseEntity.ok(notificationService.createNotification(dto));
    }

    @GetMapping("/get-notification")
    public ResponseEntity<List<NotificationDTO>> getForUser(Authentication auth) {
        String role = auth.getAuthorities().iterator().next().getAuthority(); // e.g. ROLE_USER
        role = role.replace("ROLE_", ""); // USER or ADMIN
        return ResponseEntity.ok(notificationService.getNotificationsForUser(role));
    }

}
