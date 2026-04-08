// src/services/chat/useChat.js
import { useEffect, useRef, useState, useMemo } from "react";
import { connectWebSocket, disconnectWebSocket, sendMessage } from "./chatService";
import API from "../api";
import { getToken } from "../authService";
import { jwtDecode } from "jwt-decode";

const useChat = (targetEmail) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadMap, setUnreadMap] = useState({});

  // 1. Decode JWT once to identify the current user
// Inside useChat.js
const currentUser = useMemo(() => {
  const token = getToken();
  if (token) {
    try {
      const decoded = jwtDecode(token);
      return {
        email: decoded.sub,
        // Check if roles exist, otherwise check if the email contains 'admin' 
        // OR simply default to 'ADMIN' if we are in the AdminChat component
        role: decoded.roles?.includes("ROLE_ADMIN") ? "ADMIN" : "EMPLOYEE",
      };
    } catch (err) {
      console.error("Invalid token", err);
    }
  }
  return { email: null, role: null };
}, []);
  // ─── REFS FOR STABILITY ──────────────────────────────────────────────────
  // These refs allow the WebSocket listener to access the latest state 
  // without needing to restart the connection every time a variable changes.
  const targetEmailRef = useRef(targetEmail);
  const currentUserRef = useRef(currentUser);

  useEffect(() => {
    targetEmailRef.current = targetEmail;
  }, [targetEmail]);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // 2. STABILIZED WEBSOCKET CONNECTION ──────────────────────────────────────
  useEffect(() => {
    const handleMessage = (newMessage) => {
      const activeTarget = targetEmailRef.current;
      const me = currentUserRef.current;

      if (!activeTarget || !me.email) return;

      // Logic: Is this message part of the conversation I am currently looking at?
      const isRelevant =
        newMessage.senderEmail === activeTarget || 
        (newMessage.senderEmail === me.email && newMessage.receiverEmail === activeTarget);

      if (isRelevant) {
        setMessages((prev) => {
          // Robust duplicate check
          const isDuplicate = prev.some((m) => 
            (m.id && m.id === newMessage.id) || 
            (m.content === newMessage.content && m.sentAt === newMessage.sentAt)
          );
          
          if (isDuplicate) return prev;

          return [...prev, newMessage].sort(
            (a, b) => new Date(a.sentAt) - new Date(b.sentAt)
          );
        });
      }

      // Logic: If message is for me but I'm NOT looking at that chat, increment unread
      if (newMessage.receiverEmail === me.email && newMessage.senderEmail !== activeTarget) {
        setUnreadMap((prev) => ({
          ...prev,
          [newMessage.senderEmail]: (prev[newMessage.senderEmail] || 0) + 1,
        }));
      }
    };

    // Connect only once
    if (currentUser.email) {
      connectWebSocket(handleMessage);
    }

    // Cleanup: Only disconnect when the hook is completely destroyed
    return () => {
      console.log("🔌 useChat Unmounting: Disconnecting WebSocket");
      disconnectWebSocket();
    };
  }, []); // Empty array ensures zero re-connection loops

  // 3. LOAD HISTORY & MARK AS READ ──────────────────────────────────────────
useEffect(() => {
  if (!targetEmail || !currentUser.email) return;

  // REPLACEMENT LOGIC:
  // We determine who is who based on the 'role' we detected.
  // If the role detection is still broken, we need to fix the 'currentUser' logic above.
  const isMeAdmin = currentUser.role === "ADMIN";
  
  const employeeEmail = isMeAdmin ? targetEmail : currentUser.email;
  const adminEmail = isMeAdmin ? currentUser.email : targetEmail;

  console.log("Dynamic Fetch Parameters:", { 
    me: currentUser.email, 
    role: currentUser.role, 
    employeeEmail, 
    adminEmail 
  });

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await API.get("/chat/history", {
        params: { employeeEmail, adminEmail },
      });
      setMessages(res.data.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt)));
    } catch (err) {
      console.error("History fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  loadHistory();
}, [targetEmail, currentUser.email, currentUser.role]);// Reload history when user selection changes

  // 4. UNIFIED SEND FUNCTION ────────────────────────────────────────────────
  const send = (content) => {
    if (!content.trim() || !targetEmail) return;

    sendMessage({
      senderEmail: currentUser.email,
      receiverEmail: targetEmail,
      content,
      senderRole: currentUser.role,
    });
  };

  return {
    messages,
    send,
    loading,
    currentEmail: currentUser.email,
    currentRole: currentUser.role,
    unreadMap,
  };
};

export default useChat;