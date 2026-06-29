package com.hrportal.PulseHR.Repository;

import com.hrportal.PulseHR.Entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// ConversationRepository.java
@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    Optional<Conversation> findByUserEmail(String userEmail);
    Optional<Conversation> findByUserEmailAndAdminEmail(String userEmail, String adminEmail);
    List<Conversation> findByAdminEmail(String adminEmail);
    long countByAdminEmail(String adminEmail);
}
