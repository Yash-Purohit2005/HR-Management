package com.hrportal.PulseHR.ServiceImpl;

import com.hrportal.PulseHR.Entity.Conversation;
import com.hrportal.PulseHR.Repository.ConversationRepository;
import com.hrportal.PulseHR.Repository.UserRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final ConversationCacheService cache; // ✅ separate bean

    public ConversationService(ConversationRepository conversationRepository,
                               UserRepository userRepository,
                               ConversationCacheService cache) {
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
        this.cache = cache;
    }

    public Conversation findOrCreate(String userEmail) {
        return cache.findByUserEmail(userEmail)  // ✅ goes through proxy → cache works
                .orElseGet(() -> {
                    String adminEmail = assignAdmin(userEmail);
                    Conversation c = new Conversation();
                    c.setUserEmail(userEmail);
                    c.setAdminEmail(adminEmail);
                    Conversation saved = conversationRepository.save(c);
                    cache.evictUserCache(userEmail);   // ✅ clear stale cache
                    cache.evictAdminCache(adminEmail);
                    return saved;
                });
    }

    public String getAssignedAdmin(String userEmail) {
        return findOrCreate(userEmail).getAdminEmail();
    }

    public List<String> getAssignedUsers(String adminEmail) {
        return cache.findByAdminEmail(adminEmail)  // ✅ cached
                .stream()
                .map(Conversation::getUserEmail)
                .collect(Collectors.toList());
    }

    public String getCounterpart(String email) {
        return cache.findByUserEmail(email)        // ✅ cached
                .map(Conversation::getAdminEmail)
                .orElseGet(() ->
                        cache.findByAdminEmail(email)  // ✅ cached
                                .stream()
                                .map(Conversation::getUserEmail)
                                .findFirst()
                                .orElse(null)
                );
    }

    // ✅ @Cacheable here is fine — called from ChatController (external bean)
    @Cacheable(value = "counterparts", key = "#email")
    public List<String> getAllCounterparts(String email) {
        return cache.findByUserEmail(email)        // ✅ cached
                .map(conv -> List.of(conv.getAdminEmail()))
                .orElseGet(() -> {
                    List<String> users = cache.findByAdminEmail(email)  // ✅ cached
                            .stream()
                            .map(Conversation::getUserEmail)
                            .collect(Collectors.toList());
                    System.out.println("👥 Admin " + email + " has users: " + users);
                    return users;
                });
    }

    private String assignAdmin(String userEmail) {
        List<String> admins = userRepository.findAllAdminEmails();
        if (admins.isEmpty()) throw new RuntimeException("No admins available");
        return admins.stream()
                .min(Comparator.comparingLong(
                        adminEmail -> conversationRepository.countByAdminEmail(adminEmail)))
                .orElseThrow(() -> new RuntimeException("No admins available"));
    }
}