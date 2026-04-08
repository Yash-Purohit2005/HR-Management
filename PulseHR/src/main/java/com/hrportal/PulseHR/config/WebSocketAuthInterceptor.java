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

        // Only intercept CONNECT frames (initial handshake)
        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {

            // 1. Try Authorization header first (Bearer token)
            String token = null;
            String authHeader = accessor.getFirstNativeHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }

            // 2. Fallback: try token header directly
            if (token == null) {
                token = accessor.getFirstNativeHeader("token");
            }

            if (token == null) {
                throw new IllegalArgumentException("Missing JWT token in WebSocket CONNECT");
            }

            // 3. Extract email and validate token
            String email = jwtService.extractEmail(token);
            if (email == null || !jwtService.isTokenValid(token, email)) {
                throw new IllegalArgumentException("Invalid or expired JWT token");
            }

            // 4. Set the authenticated user into the WebSocket session
            // Role will be used later for admin vs employee routing
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            List.of(new SimpleGrantedAuthority("ROLE_USER"))
                    );

            accessor.setUser(authentication);
        }

        return message;
    }
}