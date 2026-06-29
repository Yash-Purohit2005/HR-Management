package com.hrportal.PulseHR.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager manager = new CaffeineCacheManager(
                "counterparts",        // getAllCounterparts()
                "conversationByUser",  // findByUserEmail()
                "conversationByAdmin"  // findByAdminEmail()
        );
        manager.setCaffeine(Caffeine.newBuilder()
                .expireAfterWrite(15, TimeUnit.SECONDS)
                .maximumSize(500)
        );
        return manager;
    }
}
