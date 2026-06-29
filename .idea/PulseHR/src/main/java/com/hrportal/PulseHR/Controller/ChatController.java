package com.hrportal.PulseHR.Controller;

import com.hrportal.PulseHR.DTO.ChatMessageDTO;
import com.hrportal.PulseHR.DTO.StatusEventDTO;
import com.hrportal.PulseHR.ServiceImpl.ChatService;
import com.hrportal.PulseHR.ServiceImpl.ConversationService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;
    private final ConversationService conversationService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(ChatService chatService, ConversationService conversationService, SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.conversationService = conversationService;
        this.messagingTemplate = messagingTemplate;
    }

    // ─── WebSocket: Send a message (employee → admin or admin → employee) ─────
    // React sends to /app/chat.send
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessageDTO dto, Principal principal) {

        // ✅ Override email — prevents identity spoofing
        dto.setSenderEmail(principal.getName());

        // ✅ Override role — prevents privilege spoofing
        // Cast Principal to get the granted authorities set by the interceptor
        if (principal instanceof UsernamePasswordAuthenticationToken auth) {
            String role = auth.getAuthorities().stream()
                    .findFirst()
                    .map(a -> a.getAuthority().replace("ROLE_", ""))
                    .orElse("USER");
            dto.setSenderRole(role);
        }

        chatService.sendMessage(dto);
    }

    // ─── REST: Load conversation history ─────────────────────────────────────
    // GET /api/chat/history?employeeEmail=xxx&adminEmail=yyy
    // ChatController — guard history endpoint
    @GetMapping("/history")
    public List<ChatMessageDTO> getHistory(
            @RequestParam String employeeEmail,
            @RequestParam String adminEmail,
            Principal principal) {

        // ✅ A user can only fetch their own conversation
        // An admin can fetch any conversation they're assigned to
        // (add role check here once role is available via Principal)
        if (!principal.getName().equals(employeeEmail) &&
                !principal.getName().equals(adminEmail)) {
            throw new AccessDeniedException("Not your conversation");
        }

        return chatService.getConversation(employeeEmail, adminEmail);
    }

    // ─── REST: Get employee list for admin sidebar ────────────────────────────
    // GET /api/chat/employees?adminEmail=xxx
    @GetMapping("/employees")
    public List<String> getEmployeeList(@RequestParam String adminEmail) {
        return chatService.getEmployeeList(adminEmail);
    }

    // ─── REST: Get unread message count ──────────────────────────────────────
    // GET /api/chat/unread?receiverEmail=xxx
    // Backend alternative — derive email from Spring Security context
    @GetMapping("/unread")
    public Map<String, Long> getUnreadCount(@AuthenticationPrincipal UserDetails userDetails) {
        return chatService.getUnreadCountPerSender(userDetails.getUsername());
    }

    // ─── REST: Mark messages as read ─────────────────────────────────────────
    // PUT /api/chat/read?senderEmail=xxx&receiverEmail=yyy
    @PutMapping("/read")
    public void markAsRead(
            @RequestParam String senderEmail,
            Authentication authentication) {

        String receiver = authentication.getName();
        chatService.markAsRead(senderEmail, receiver);

        StatusEventDTO readEvent = new StatusEventDTO(receiver, "READ", senderEmail);
        messagingTemplate.convertAndSendToUser(
                senderEmail, "/queue/status", readEvent
        );

        System.out.println("✅ READ receipt sent from " + receiver + " to " + senderEmail);
    }

    // ─── REST: Get all admin emails (for employee to send message to) ─────────────
// GET /api/chat/admins
    @GetMapping("/admins")
    public List<String> getAllAdminEmails() {
        return chatService.getAllAdminEmails();
    }

    @GetMapping("/assigned-admin")
    public ResponseEntity<String> getAssignedAdmin(Principal principal) {
        String adminEmail = conversationService.getAssignedAdmin(principal.getName());
        return ResponseEntity.ok(adminEmail);
    }

    // ✅ NEW: Get all users assigned to logged-in admin
    @GetMapping("/my-users")
    public List<String> getMyUsers(Principal principal) {
        return conversationService.getAssignedUsers(principal.getName());
    }

    // Add to ChatController.java
    @MessageMapping("/chat.typing")
    public void handleTyping(@Payload StatusEventDTO dto, Principal principal) {
        // Override email — prevent spoofing
        dto.setEmail(principal.getName());

        // Send typing event to target only
        messagingTemplate.convertAndSendToUser(
                dto.getTargetEmail(), "/queue/status", dto
        );
    }

    // ─── Send pending READ receipts to user on reconnect ─────────────────
    @GetMapping("/pending-reads")
    public void sendPendingReads(Principal principal) {
        String email = principal.getName();
        // Find all messages sent by this user that are now read
        List<String> readByList = chatService.getReadReceiptsPending(email);
        for (String readerEmail : readByList) {
            StatusEventDTO readEvent = new StatusEventDTO(readerEmail, "READ", email);
            messagingTemplate.convertAndSendToUser(
                    email, "/queue/status", readEvent
            );
        }
    }

    // ─── WebSocket: Request current online status ─────────────────────────────
    @MessageMapping("/chat.status.request")
    public void handleStatusRequest(@Payload StatusEventDTO dto, Principal principal) {
        String requesterEmail = principal.getName();
        List<String> counterparts = conversationService.getAllCounterparts(requesterEmail);

        // 1. Tell all counterparts that requester is ONLINE (existing logic)
        for (String counterpart : counterparts) {
            StatusEventDTO onlineEvent = new StatusEventDTO(requesterEmail, "ONLINE", counterpart);
            messagingTemplate.convertAndSendToUser(
                    counterpart, "/queue/status", onlineEvent
            );
        }

        // 2. NEW — Also tell the requester which of their counterparts are currently online
        // We can't know who is online server-side without a presence store,
        // so we ask each counterpart to announce themselves back
        for (String counterpart : counterparts) {
            StatusEventDTO pingEvent = new StatusEventDTO(requesterEmail, "STATUS_PING", counterpart);
            messagingTemplate.convertAndSendToUser(
                    counterpart, "/queue/status", pingEvent
            );
        }
    }
}
