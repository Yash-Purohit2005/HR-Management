package com.hrportal.PulseHR.ServiceImpl;

import com.hrportal.PulseHR.Entity.Conversation;
import com.hrportal.PulseHR.Repository.ConversationRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConversationCacheService {

    private final ConversationRepository conversationRepository;

    public ConversationCacheService(ConversationRepository conversationRepository) {
        this.conversationRepository = conversationRepository;
    }

    @Cacheable(value = "conversationByUser", key = "#userEmail")
    public Optional<Conversation> findByUserEmail(String userEmail) {
        return conversationRepository.findByUserEmail(userEmail);
    }

    @Cacheable(value = "conversationByAdmin", key = "#adminEmail")
    public List<Conversation> findByAdminEmail(String adminEmail) {
        return conversationRepository.findByAdminEmail(adminEmail);
    }

    @Caching(evict = {
            @CacheEvict(value = "conversationByUser", key = "#userEmail"),
            @CacheEvict(value = "counterparts",       key = "#userEmail")
    })
    public void evictUserCache(String userEmail) { }

    @Caching(evict = {
            @CacheEvict(value = "conversationByAdmin", key = "#adminEmail"),
            @CacheEvict(value = "counterparts",        key = "#adminEmail")
    })
    public void evictAdminCache(String adminEmail) { }
}