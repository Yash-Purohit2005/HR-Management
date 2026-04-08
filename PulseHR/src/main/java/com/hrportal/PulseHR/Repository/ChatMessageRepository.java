package com.hrportal.PulseHR.Repository;

import com.hrportal.PulseHR.Entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    // Get full conversation between employee and admin (both directions)
    @Query("SELECT m FROM ChatMessage m WHERE " +
            "(m.senderEmail = :employeeEmail AND m.receiverEmail = :adminEmail) OR " +
            "(m.senderEmail = :adminEmail AND m.receiverEmail = :employeeEmail) " +
            "ORDER BY m.sentAt ASC")
    List<ChatMessage> findConversation(
            @Param("employeeEmail") String employeeEmail,
            @Param("adminEmail") String adminEmail
    );

    // Get all distinct employees who have chatted with admin (for admin sidebar)
    // ChatMessageRepository.java - replace the existing query
    // Returns the *other* party's email in every conversation involving adminEmail
    @Query("SELECT DISTINCT " +
            "CASE WHEN m.senderEmail = :adminEmail THEN m.receiverEmail ELSE m.senderEmail END " +
            "FROM ChatMessage m " +
            "WHERE m.senderEmail = :adminEmail OR m.receiverEmail = :adminEmail")
    List<String> findDistinctEmployeesWhoMessagedAdmin(@Param("adminEmail") String adminEmail);

    // Count unread messages for a receiver
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE " +
            "m.receiverEmail = :receiverEmail AND m.isRead = false")
    long countUnreadMessages(@Param("receiverEmail") String receiverEmail);

    // Mark all messages in a conversation as read
    @Modifying
    @Transactional
    @Query("UPDATE ChatMessage m SET m.isRead = true WHERE " +
            "m.senderEmail = :senderEmail AND m.receiverEmail = :receiverEmail AND m.isRead = false")
    void markMessagesAsRead(
            @Param("senderEmail") String senderEmail,
            @Param("receiverEmail") String receiverEmail
    );

    // In ChatMessageRepository.java
    List<ChatMessage> findByReceiverEmailAndIsReadFalse(String receiverEmail);


}