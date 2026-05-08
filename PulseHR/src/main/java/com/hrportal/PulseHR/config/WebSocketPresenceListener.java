package com.hrportal.PulseHR.config;

import com.hrportal.PulseHR.DTO.StatusEventDTO;
import com.hrportal.PulseHR.ServiceImpl.ConversationService;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;
import java.time.Instant;
import java.util.List;

@Component
public class WebSocketPresenceListener {

    private final SimpMessagingTemplate messagingTemplate;
    private final ConversationService conversationService;
    private final ThreadPoolTaskScheduler scheduler;

    public WebSocketPresenceListener(SimpMessagingTemplate messagingTemplate,
                                     ConversationService conversationService) {
        this.messagingTemplate = messagingTemplate;
        this.conversationService = conversationService;

        // ✅ Spring-managed scheduler — cache proxy works inside its threads
        this.scheduler = new ThreadPoolTaskScheduler();
        this.scheduler.setPoolSize(2);
        this.scheduler.setThreadNamePrefix("ws-presence-");
        this.scheduler.initialize();
    }

    @EventListener
    public void handleConnect(SessionConnectedEvent event) {
        Principal principal = event.getUser();
        if (principal == null) return;

        String email = principal.getName();
        System.out.println("🟢 CONNECTED: " + email);

        // ✅ Use Spring scheduler instead of raw new Thread()
        // Cache proxy works correctly here
        scheduler.schedule(
                () -> broadcastStatus(email, "ONLINE"),
                Instant.now().plusMillis(500)
        );
    }

    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        Principal principal = event.getUser();
        if (principal == null) {
            System.out.println("❌ Disconnect — no principal");
            return;
        }
        String email = principal.getName();
        System.out.println("⚫ DISCONNECTED: " + email);
        broadcastStatus(email, "OFFLINE");
    }

    private void broadcastStatus(String email, String type) {
        try {
            List<String> counterparts = conversationService.getAllCounterparts(email);
            System.out.println("📡 Broadcasting " + type + " from " + email
                    + " to counterparts: " + counterparts);

            if (counterparts.isEmpty()) {
                System.out.println("⚠️ No counterparts found for: " + email);
                return;
            }

            for (String counterpart : counterparts) {
                StatusEventDTO statusEvent = new StatusEventDTO(email, type, counterpart);
                messagingTemplate.convertAndSendToUser(
                        counterpart, "/queue/status", statusEvent
                );
            }
        } catch (Exception e) {
            System.out.println("❌ broadcastStatus error: " + e.getMessage());
        }
    }
}