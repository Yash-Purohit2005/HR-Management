package com.hrportal.PulseHR.ServiceImpl;


import com.hrportal.PulseHR.DTO.ChatMessageDTO;
import com.hrportal.PulseHR.Entity.ChatMessage;
import com.hrportal.PulseHR.Repository.ChatMessageRepository;
import com.hrportal.PulseHR.Repository.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;

    public ChatService(ChatMessageRepository chatMessageRepository,
                       SimpMessagingTemplate messagingTemplate,
                       UserRepository userRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.messagingTemplate = messagingTemplate;
        this.userRepository = userRepository;
    }

    // ─── Send a message (employee → admin or admin → employee) ───────────────
    public ChatMessageDTO sendMessage(ChatMessageDTO dto) {

        // 1. Save to DB
        ChatMessage entity = new ChatMessage();
        entity.setSenderEmail(dto.getSenderEmail());
        entity.setReceiverEmail(dto.getReceiverEmail());
        entity.setContent(dto.getContent());
        entity.setSenderRole(dto.getSenderRole());
        entity.setRead(false);
        ChatMessage saved = chatMessageRepository.save(entity);

        // 2. Build response DTO with sentAt populated
        ChatMessageDTO response = toDTO(saved);

        // 3. Push to receiver's private queue in real-time
        // React will subscribe to /user/queue/messages
        messagingTemplate.convertAndSendToUser(
                dto.getReceiverEmail(),
                "/queue/messages",
                response
        );

        // 4. Also push back to sender so their UI updates instantly
        messagingTemplate.convertAndSendToUser(
                dto.getSenderEmail(),
                "/queue/messages",
                response
        );

        return response;
    }

    // ─── Load full conversation history between employee and admin ────────────
    public List<ChatMessageDTO> getConversation(String employeeEmail, String adminEmail) {
        return chatMessageRepository
                .findConversation(employeeEmail, adminEmail)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ─── Get all employees who have messaged admin (for admin sidebar) ────────
    public List<String> getEmployeeList(String adminEmail) {
        return chatMessageRepository
                .findDistinctEmployeesWhoMessagedAdmin(adminEmail);
    }

    // ─── Count unread messages for a user ────────────────────────────────────
    public Map<String, Long> getUnreadCountPerSender(String receiverEmail) {
        return chatMessageRepository
                .findByReceiverEmailAndIsReadFalse(receiverEmail)
                .stream()
                .collect(Collectors.groupingBy(
                        ChatMessage::getSenderEmail,
                        Collectors.counting()
                ));
    }

    // ─── Mark messages as read when conversation is opened ───────────────────
    public void markAsRead(String senderEmail, String receiverEmail) {
        chatMessageRepository.markMessagesAsRead(senderEmail, receiverEmail);
    }

    // ─── Entity → DTO mapper ──────────────────────────────────────────────────
    private ChatMessageDTO toDTO(ChatMessage entity) {
        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setSenderEmail(entity.getSenderEmail());
        dto.setReceiverEmail(entity.getReceiverEmail());
        dto.setContent(entity.getContent());
        dto.setSenderRole(entity.getSenderRole());
        dto.setRead(entity.isRead());
        dto.setSentAt(entity.getSentAt());
        return dto;
    }

    public List<String> getAllAdminEmails() {
        return userRepository.findAllAdminEmails();
    }
}
