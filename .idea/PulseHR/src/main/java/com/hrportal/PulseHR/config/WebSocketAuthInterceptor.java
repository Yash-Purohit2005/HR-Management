package com.hrportal.PulseHR.config;

import com.hrportal.PulseHR.Security.JwtService;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtService jwtService;

    public WebSocketAuthInterceptor(JwtService jwtService) {
        this.jwtService = jwtService;
    }


    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {

            String token = null;
            String authHeader = accessor.getFirstNativeHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
            if (token == null) {
                token = accessor.getFirstNativeHeader("token");
            }
            if (token == null) {
                throw new IllegalArgumentException("Missing JWT token in WebSocket CONNECT");
            }

            String email = jwtService.extractEmail(token);
            if (email == null || !jwtService.isTokenValid(token, email)) {
                throw new IllegalArgumentException("Invalid or expired JWT token");
            }

            // ✅ FIX 1: extract real role from JWT instead of hardcoding ROLE_USER
            String role = jwtService.extractRole(token);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            List.of(new SimpleGrantedAuthority("ROLE_" + role))
                    );

            // ✅ FIX 1: store role in session so controller can read it
            accessor.getSessionAttributes().put("role", role);
            accessor.setUser(authentication);
        }

        return message;
    }
}