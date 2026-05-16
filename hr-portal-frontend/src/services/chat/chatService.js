// src/services/chat/chatService.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getToken } from "../authService";

const SOCKET_URL = "https://hr-management-production-7384.up.railway.app/ws";

let stompClient = null;
let isConnected = false;
let messageQueue = [];

// ─── Connect ──────────────────────────────────────────────────────────────────
export const connectWebSocket = (onMessageReceived, onStatusEvent, onConnected) => {
  if (stompClient && isConnected) return;

  const token = getToken();

  stompClient = new Client({
    webSocketFactory: () => new SockJS(SOCKET_URL),
    connectHeaders: { Authorization: `Bearer ${token}` },
    reconnectDelay: 5000,

    onConnect: () => {
      
      isConnected = true;

      stompClient.subscribe("/user/queue/messages", (message) => {
        onMessageReceived(JSON.parse(message.body));
      });

      stompClient.subscribe("/user/queue/status", (message) => {
        if (onStatusEvent) onStatusEvent(JSON.parse(message.body));
      });

      messageQueue.forEach((dto) => {
        stompClient.publish({
          destination: "/app/chat.send",
          body: JSON.stringify(dto),
        });
      });
      messageQueue = [];

      // ✅ Notify caller that connection is ready
      if (onConnected) onConnected();
    },

    onStompError: (frame) => {
      console.error("❌ WebSocket error:", frame);
      isConnected = false;
    },

    onDisconnect: () => {
      isConnected = false;
    },
  });

  stompClient.activate();
};

// ─── Announce self as online to all counterparts ──────────────────────────
export const announceOnline = (email) => {
  if (!stompClient || !isConnected) return;
  stompClient.publish({
    destination: "/app/chat.status.request",
    body: JSON.stringify({ email }),
  });
};

// ─── Send chat message ────────────────────────────────────────────────────────
export const sendMessage = (chatMessageDTO) => {
  if (stompClient && isConnected) {
    stompClient.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(chatMessageDTO),
    });
  } else {
    messageQueue.push(chatMessageDTO);
  }
};

// ─── Send typing event ────────────────────────────────────────────────────────
export const sendTypingEvent = (senderEmail, targetEmail, isTyping) => {
  if (!stompClient || !isConnected) return;
  stompClient.publish({
    destination: "/app/chat.typing",
    body: JSON.stringify({
      email: senderEmail,
      targetEmail,
      type: isTyping ? "TYPING" : "STOP_TYPING",
    }),
  });
};

// ─── Disconnect ───────────────────────────────────────────────────────────────
export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    isConnected = false;
    messageQueue = [];
  }
};