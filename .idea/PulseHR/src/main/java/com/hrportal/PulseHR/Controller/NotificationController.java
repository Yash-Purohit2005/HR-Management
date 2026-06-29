package com.hrportal.PulseHR.Controller;

import com.hrportal.PulseHR.DTO.NotificationDTO;
import com.hrportal.PulseHR.Entity.Notification;
import com.hrportal.PulseHR.Service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService){
        this.notificationService=notificationService;
    }


    @PostMapping("/create-notification")
    public ResponseEntity<?> createNotification(@RequestBody NotificationDTO dto) {
        try {
            // Validate basic requirements if not using @Valid
            if (dto.getTitle() == null || dto.getMessage() == null) {
                return ResponseEntity
                        .badRequest()
                        .body(Map.of("message", "Title and Message are required fields."));
            }

            // Call the service to handle Enum conversion and DB saving
            Notification savedNotification = notificationService.createNotification(dto);

            // Return the saved entity with a 201 Created or 200 OK status
            return new ResponseEntity<>(savedNotification, HttpStatus.CREATED);

        } catch (IllegalArgumentException e) {
            // Catches errors if the Enum conversion fails drastically
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Invalid audience type provided."));

        } catch (Exception e) {
            // General error handler to prevent the frontend from seeing raw stack traces
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "An unexpected error occurred: " + e.getMessage()));
        }
    }

    @GetMapping("/get-notification")
    public ResponseEntity<List<NotificationDTO>> getForUser(Authentication auth) {
        // 1. Safety check: Ensure the user is actually logged in
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 2. Extract the role (e.g., "ROLE_ADMIN" or "ROLE_USER")
        String role = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_USER");

        // 3. Call the service (which now handles the ROLE_ prefix and the switch case)
        List<NotificationDTO> notifications = notificationService.getNotificationsForUser(role);

        return ResponseEntity.ok(notifications);
    }

}
