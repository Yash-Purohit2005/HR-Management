package com.hrportal.PulseHR.ServiceImpl;

import com.hrportal.PulseHR.Entity.Conversation;
import com.hrportal.PulseHR.Repository.ConversationRepository;
import com.hrportal.PulseHR.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

// ConversationService.java
@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;

    public ConversationService(ConversationRepository conversationRepository,
                               UserRepository userRepository) {
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
    }

    public Conversation findOrCreate(String userEmail) {
        return conversationRepository.findByUserEmail(userEmail)
                .orElseGet(() -> {
                    String adminEmail = assignAdmin(userEmail); // ← pass userEmail here
                    Conversation c = new Conversation();
                    c.setUserEmail(userEmail);
                    c.setAdminEmail(adminEmail);
                    return conversationRepository.save(c);
                });
    }

    public String getAssignedAdmin(String userEmail) {
        return findOrCreate(userEmail).getAdminEmail();
    }

    // ✅ Returns all users assigned to a specific admin
    public List<String> getAssignedUsers(String adminEmail) {
        return conversationRepository.findByAdminEmail(adminEmail)
                .stream()
                .map(Conversation::getUserEmail)
                .collect(Collectors.toList());
    }

    private String assignAdmin(String userEmail) {
        List<String> admins = userRepository.findAllAdminEmails();

        System.out.println("✅ Available admins: " + admins); // remove after testing

        if (admins.isEmpty()) throw new RuntimeException("No admins available");

        return admins.stream()
                .min(Comparator.comparingLong(
                        adminEmail -> conversationRepository.countByAdminEmail(adminEmail)))
                .orElseThrow(() -> new RuntimeException("No admins available"));
    }
}
