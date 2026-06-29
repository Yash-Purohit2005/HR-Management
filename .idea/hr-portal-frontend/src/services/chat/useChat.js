// src/services/chat/useChat.js
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  connectWebSocket,
  disconnectWebSocket,
  sendMessage,
  sendTypingEvent,
  announceOnline,
} from "./chatService";
import API from "../api";
import { getToken } from "../authService";
import { jwtDecode } from "jwt-decode";

const useChat = (targetEmail) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadMap, setUnreadMap] = useState({});
  const [onlineUsers, setOnlineUsers] = useState({});
  const [typingUsers, setTypingUsers] = useState({});

  const currentUser = useMemo(() => {
    const token = getToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return { email: decoded.sub, role: decoded.role };
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
    return { email: null, role: null };
  }, []);

  const targetEmailRef = useRef(targetEmail);
  const currentUserRef = useRef(currentUser);
  const hasConnectedRef = useRef(false);
  const typingTimeoutRef = useRef({});
  const typingDebounceRef = useRef(null);
  const isTypingRef = useRef(false);

  useEffect(() => { targetEmailRef.current = targetEmail; }, [targetEmail]);
  useEffect(() => { currentUserRef.current = currentUser; }, [currentUser]);

  // ─── Handle incoming chat messages ───────────────────────────────────────
  const handleStatusEvent = useCallback((event) => {
    const { email, type } = event;

    switch (type) {
      case "ONLINE":
        setOnlineUsers((prev) => ({ ...prev, [email]: true }));
        break;

      case "OFFLINE":
        setOnlineUsers((prev) => ({ ...prev, [email]: false }));
        break;

      case "STATUS_PING":
        // Someone is asking if we're online — respond back
        announceOnline(currentUserRef.current.email);
        break;

      case "TYPING":
        setTypingUsers((prev) => ({ ...prev, [email]: true }));
        if (typingTimeoutRef.current[email]) {
          clearTimeout(typingTimeoutRef.current[email]);
        }
        typingTimeoutRef.current[email] = setTimeout(() => {
          setTypingUsers((prev) => ({ ...prev, [email]: false }));
        }, 3000);
        break;

      case "STOP_TYPING":
        if (typingTimeoutRef.current[email]) {
          clearTimeout(typingTimeoutRef.current[email]);
        }
        setTypingUsers((prev) => ({ ...prev, [email]: false }));
        break;

      case "READ":
       
        setMessages((prev) => {
         

          return prev.map((m) => {
            if (m.senderEmail === currentUserRef.current.email &&
              m.receiverEmail === email) {
              
              return { ...m, isRead: true };
            }
            if (m.receiverEmail === currentUserRef.current.email &&
              m.senderEmail === email) {
              return { ...m, isRead: true };
            }
            return m;
          });
        });
        break;

      default:
        break;
    }
  }, []);

  // ─── Handle incoming chat messages ───────────────────────────────────────
  const handleMessage = useCallback((msg) => {
    const myEmail = currentUserRef.current.email;
    const target = targetEmailRef.current;


    setMessages((prev) => {
      // ── Case 1: My own message echo — replace temp ──
      if (msg.senderEmail === myEmail) {
        const hasTempMsg = prev.some((m) => m.id?.toString().startsWith("temp-"));
        if (hasTempMsg) {
          return prev.map((m) =>
            m.id?.toString().startsWith("temp-") && m.content === msg.content
              ? { ...msg, isRead: m.isRead || msg.isRead }
              : m
          );
        }
        // No temp message — avoid duplicate
        const alreadyExists = prev.some((m) => m.id === msg.id);
        if (alreadyExists) return prev;
        return [...prev, msg];
      }

      // ── Case 2: Message from current conversation partner ──
      if (msg.senderEmail === target) {
        API.put("/chat/read", null, {
          params: { senderEmail: msg.senderEmail },
        }).catch(console.error);
        return [...prev, { ...msg, isRead: true }];
      }

      // ── Case 3: Message from someone else — unread count only ──
      setUnreadMap((prev) => ({
        ...prev,
        [msg.senderEmail]: (prev[msg.senderEmail] || 0) + 1,
      }));
      return prev; // ← don't add to messages list
    });
  }, []);

  // ─── Typing handler with debounce ────────────────────────────────────────
  const handleTyping = useCallback(() => {
    if (!targetEmailRef.current || !currentUserRef.current.email) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      sendTypingEvent(
        currentUserRef.current.email,
        targetEmailRef.current,
        true
      );
    }

    if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
    typingDebounceRef.current = setTimeout(() => {
      isTypingRef.current = false;
      sendTypingEvent(
        currentUserRef.current.email,
        targetEmailRef.current,
        false
      );
    }, 2000);
  }, []);

  // ─── Connect WebSocket once ───────────────────────────────────────────────
  useEffect(() => {
    if (!currentUser.email || hasConnectedRef.current) return;
    hasConnectedRef.current = true;

    connectWebSocket(handleMessage, handleStatusEvent, () => {
      // Announce ourselves as ONLINE after connection is ready
      setTimeout(() => {
        announceOnline(currentUser.email);
        API.get("/chat/pending-reads").catch(console.error);

      }, 500);
    });

    return () => { disconnectWebSocket(); };
  }, [currentUser.email]);

  // ─── Load history + mark read when target changes ────────────────────────
  useEffect(() => {
    if (!currentUser.email || !targetEmail) return;
    if (currentUser.email === targetEmail && currentUser.role === "ADMIN") return;

    const isMeAdmin = currentUser.role === "ADMIN";
    const employeeEmail = isMeAdmin ? targetEmail : currentUser.email;
    const adminEmail = isMeAdmin ? currentUser.email : targetEmail;

    const loadHistory = async () => {
      try {
        setLoading(true);
        const res = await API.get("/chat/history", {
          params: { employeeEmail, adminEmail },
        });
        setMessages(
          res.data.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt))
        );
        await API.put("/chat/read", null, {
          params: { senderEmail: targetEmail },
        });
        setUnreadMap((prev) => ({ ...prev, [targetEmail]: 0 }));
        await API.get("/chat/pending-reads").catch(console.error);
      } catch (err) {
        console.error("❌ History fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [targetEmail, currentUser.email, currentUser.role]);

  // ─── Send message ─────────────────────────────────────────────────────────
  const send = (content) => {
    if (!content.trim() || !targetEmail) return;

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      senderEmail: currentUser.email,
      receiverEmail: targetEmail,
      content,
      senderRole: currentUser.role,
      sentAt: new Date().toISOString(),
      isRead: false,
      id: tempId,
    };

    const messageToSend = {
      senderEmail: currentUser.email,
      receiverEmail: targetEmail,
      content,
      senderRole: currentUser.role,
    };

    sendMessage(messageToSend);
    setMessages((prev) => [...prev, optimisticMessage]);
  };


  const setInitialUnread = (map) => setUnreadMap(map);

  return {
    messages,
    send,
    loading,
    currentEmail: currentUser.email,
    currentRole: currentUser.role,
    unreadMap,
    setInitialUnread,
    onlineUsers,
    typingUsers,
    handleTyping,
  };
};

export default useChat;