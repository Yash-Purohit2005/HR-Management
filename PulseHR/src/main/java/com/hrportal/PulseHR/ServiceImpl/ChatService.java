package com.hrportal.PulseHR.ServiceImpl;


import com.hrportal.PulseHR.DTO.ChatMessageDTO;
import com.hrportal.PulseHR.Entity.ChatMessage;
import com.hrportal.PulseHR.Entity.Conversation;
import com.hrportal.PulseHR.Repository.ChatMessageRepository;
import com.hrportal.PulseHR.Repository.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;
    private final ConversationService conversationService;



    public ChatService(ChatMessageRepository chatMessageRepository,
                       SimpMessagingTemplate messagingTemplate,
                       UserRepository userRepository,
                       ConversationService conversationService) {
        this.chatMessageRepository = chatMessageRepository;
        this.messagingTemplate = messagingTemplate;
        this.userRepository = userRepository;
        this.conversationService = conversationService;
    }

    // ─── Send a message (employee → admin or admin → employee) ───────────────
    @Transactional
    public ChatMessageDTO sendMessage(ChatMessageDTO dto) {

        // 1. Resolve assigned admin for this user
        String userEmail = "USER".equalsIgnoreCase(dto.getSenderRole())
                ? dto.getSenderEmail()
                : dto.getReceiverEmail();

        Conversation conversation = conversationService.findOrCreate(userEmail);

        // 2. Validate admin side: if admin is sending, they must be the assigned admin
        if ("ADMIN".equalsIgnoreCase(dto.getSenderRole()) &&
                !conversation.getAdminEmail().equals(dto.getSenderEmail())) {
            throw new AccessDeniedException("You are not assigned to this user");
        }

        // 3. Save message
        ChatMessage entity = new ChatMessage();
        entity.setSenderEmail(dto.getSenderEmail());
        entity.setReceiverEmail(dto.getReceiverEmail());
        entity.setContent(dto.getContent());
        entity.setSenderRole(dto.getSenderRole());
        entity.setRead(false);
        ChatMessage saved = chatMessageRepository.save(entity);

        ChatMessageDTO response = toDTO(saved);

        // 4. ✅ Route to the ONE assigned party — not all admins
        String target = "USER".equalsIgnoreCase(dto.getSenderRole())
                ? conversation.getAdminEmail()   // user → their assigned admin only
                : conversation.getUserEmail();    // admin → the user

        messagingTemplate.convertAndSendToUser(target, "/queue/messages", response);

        // 5. Echo to sender
        messagingTemplate.convertAndSendToUser(dto.getSenderEmail(), "/queue/messages", response);

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
    @Transactional
    public void markAsRead(String senderEmail, String receiverEmail) {
        chatMessageRepository.markMessagesAsRead(senderEmail, receiverEmail);
    }

    // ─── Entity → DTO mapper ──────────────────────────────────────────────────
    private ChatMessageDTO toDTO(ChatMessage entity) {
        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setId(entity.getId());
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
