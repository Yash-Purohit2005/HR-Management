package com.hrportal.PulseHR.Controller;

import com.hrportal.PulseHR.DTO.ChatMessageDTO;
import com.hrportal.PulseHR.ServiceImpl.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    // ─── WebSocket: Send a message (employee → admin or admin → employee) ─────
    // React sends to /app/chat.send
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessageDTO dto, Principal principal) {
        // Override senderEmail with authenticated user from JWT
        // This prevents spoofing — client cannot fake who they are
        dto.setSenderEmail(principal.getName());
        chatService.sendMessage(dto);
    }

    // ─── REST: Load conversation history ─────────────────────────────────────
    // GET /api/chat/history?employeeEmail=xxx&adminEmail=yyy
    @GetMapping("/history")
    public List<ChatMessageDTO> getHistory(
            @RequestParam String employeeEmail,
            @RequestParam String adminEmail) {
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
    @GetMapping("/unread")
    public Map<String, Long> getUnreadCount(@RequestParam String receiverEmail) {
        return chatService.getUnreadCountPerSender(receiverEmail);
    }

    // ─── REST: Mark messages as read ─────────────────────────────────────────
    // PUT /api/chat/read?senderEmail=xxx&receiverEmail=yyy
    @PutMapping("/read")
    public void markAsRead(
            @RequestParam String senderEmail,
            @RequestParam String receiverEmail) {
        chatService.markAsRead(senderEmail, receiverEmail);
    }

    // ─── REST: Get all admin emails (for employee to send message to) ─────────────
// GET /api/chat/admins
    @GetMapping("/admins")
    public List<String> getAllAdminEmails() {
        return chatService.getAllAdminEmails();
    }
}
