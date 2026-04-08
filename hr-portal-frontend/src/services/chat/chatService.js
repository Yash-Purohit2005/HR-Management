// src/services/chat/chatService.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getToken } from "../authService";

const SOCKET_URL = "http://localhost:8080/ws";

let stompClient = null;
let isConnected = false;
let messageQueue = []; // ✅ Queue messages until connected

// ─── Connect to WebSocket ─────────────────────────────────────────────────────
export const connectWebSocket = (onMessageReceived) => {
  // ✅ Prevent duplicate connections
  if (stompClient && isConnected) {
    console.log("✅ WebSocket already connected");
    return;
  }

  const token = getToken();

  stompClient = new Client({
    webSocketFactory: () => new SockJS(SOCKET_URL),

    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    reconnectDelay: 5000,

    onConnect: () => {
      console.log("✅ WebSocket connected");
      isConnected = true;

      // Subscribe to private messages
      stompClient.subscribe("/user/queue/messages", (message) => {
        const parsed = JSON.parse(message.body);
        onMessageReceived(parsed);
      });

      // ✅ Flush any queued messages
      messageQueue.forEach((dto) => {
        stompClient.publish({
          destination: "/app/chat.send",
          body: JSON.stringify(dto),
        });
      });
      messageQueue = [];
    },

    onStompError: (frame) => {
      console.error("❌ WebSocket error:", frame);
      isConnected = false;
    },

    onDisconnect: () => {
      console.log("🔌 WebSocket disconnected");
      isConnected = false;
    },
  });

  stompClient.activate();
};

// ─── Send a message ───────────────────────────────────────────────────────────
export const sendMessage = (chatMessageDTO) => {
  if (stompClient && isConnected) {
    stompClient.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(chatMessageDTO),
    });
  } else {
    // ✅ Queue message if not yet connected
    console.warn("⚠️ WebSocket not connected yet, queuing message...");
    messageQueue.push(chatMessageDTO);
  }
};

// ─── Disconnect ───────────────────────────────────────────────────────────────
export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    isConnected = false;
    messageQueue = [];
    console.log("🔌 WebSocket manually disconnected");
  }
};