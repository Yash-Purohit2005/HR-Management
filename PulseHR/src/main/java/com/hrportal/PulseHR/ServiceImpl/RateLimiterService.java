package com.hrportal.PulseHR.ServiceImpl;

import io.github.bucket4j.*;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimiterService {

    // Separate buckets for login and forgot-password per IP
    private final Map<String, Bucket> loginBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> forgotPasswordBuckets = new ConcurrentHashMap<>();
    private final Map<String, Long> forgotPasswordExpiryMap = new ConcurrentHashMap<>();
    // Max 5 login attempts per minute per IP
    private Bucket createLoginBucket() {
        return Bucket.builder()
                .addLimit(Bandwidth.builder()
                        .capacity(5)
                        .refillIntervally(5, Duration.ofMinutes(1))
                        .build())
                .build();
    }

    // Max 3 forgot-password attempts per 10 minutes per IP
    private Bucket createForgotPasswordBucket() {
        return Bucket.builder()
                .addLimit(Bandwidth.builder()
                        .capacity(3)
                        .refillIntervally(3, Duration.ofMinutes(10))
                        .build())
                .build();
    }

    public boolean tryLoginRequest(String ipAddress) {
        Bucket bucket = loginBuckets.computeIfAbsent(ipAddress, k -> createLoginBucket());
        return bucket.tryConsume(1);
    }

    public long getForgotPasswordRetryAfter(String key) {
        if (key == null) return 0;
        String normalizedKey = key.trim().toLowerCase();

        Long expiryAt = forgotPasswordExpiryMap.get(normalizedKey);
        if (expiryAt == null) return 0;

        long remaining = (expiryAt - System.currentTimeMillis()) / 1000;

        if (remaining <= 0) {
            forgotPasswordExpiryMap.remove(normalizedKey);
            return 0;
        }

        return remaining;
    }

    public boolean tryForgotPasswordRequest(String key) {
        if (key == null) return false;
        String normalizedKey = key.trim().toLowerCase();
        Bucket bucket = forgotPasswordBuckets.computeIfAbsent(normalizedKey, k -> createForgotPasswordBucket());

        boolean consumed = bucket.tryConsume(1);

        if (!consumed) {
            // Already rate limited, expiry already recorded
        } else if (bucket.getAvailableTokens() == 0) {
            // Just consumed the last token — record expiry now
            forgotPasswordExpiryMap.put(normalizedKey, System.currentTimeMillis() + Duration.ofMinutes(10).toMillis());
        }

        return consumed;
    }
}
