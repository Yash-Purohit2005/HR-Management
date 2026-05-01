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

  const currentUser = useMemo(() => {
    const token = getToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return {
          email: decoded.sub,
          role: decoded.role,
        };
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
    return { email: null, role: null };
  }, []);

  const targetEmailRef = useRef(targetEmail);
  const currentUserRef = useRef(currentUser);
  const hasConnectedRef = useRef(false);

  useEffect(() => {
    targetEmailRef.current = targetEmail;
  }, [targetEmail]);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const handleMessage = (newMessage) => {
    const activeTarget = targetEmailRef.current;
    const me = currentUserRef.current;

    // ✅ Only guard against missing email — NOT missing activeTarget
    // Without this fix, unread counts never increment when no conversation is open
    if (!me.email) return;

    const isRelevant =
      activeTarget && (
        newMessage.senderEmail === activeTarget ||
        (newMessage.senderEmail === me.email &&
          newMessage.receiverEmail === activeTarget)
      );

    if (isRelevant) {
      setMessages((prev) => {
        const isDuplicate = prev.some(
          (m) =>
            (m.id && m.id === newMessage.id) ||
            (m.content === newMessage.content &&
              m.sentAt === newMessage.sentAt)
        );
        if (isDuplicate) return prev;
        return [...prev, newMessage].sort(
          (a, b) => new Date(a.sentAt) - new Date(b.sentAt)
        );
      });
    }

    // ✅ Increment unread for messages not from the currently open conversation
    if (
      newMessage.receiverEmail === me.email &&
      newMessage.senderEmail !== activeTarget
    ) {
      setUnreadMap((prev) => ({
        ...prev,
        [newMessage.senderEmail]: (prev[newMessage.senderEmail] || 0) + 1,
      }));
    }
  };

  // ✅ Connect WebSocket only once
  useEffect(() => {
    if (!currentUser.email || hasConnectedRef.current) return;
    hasConnectedRef.current = true;
    connectWebSocket(handleMessage);
    return () => {
      disconnectWebSocket();
    };
  }, [currentUser.email]);

  // ✅ Load history + mark read when target changes
  useEffect(() => {
    if (!currentUser.email || !targetEmail) return;

    if (
      currentUser.email === targetEmail &&
      currentUser.role === "ADMIN"
    ) return;

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
          params: {
            senderEmail: targetEmail,
          },
        });
        // ✅ Clear unread for this conversation after opening it
        setUnreadMap((prev) => ({ ...prev, [targetEmail]: 0 }));

      } catch (err) {
        console.error("❌ History fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [targetEmail, currentUser.email, currentUser.role]);

  const send = (content) => {
    if (!content.trim() || !targetEmail) return;
    sendMessage({
      senderEmail: currentUser.email,
      receiverEmail: targetEmail,
      content,
      senderRole: currentUser.role,
    });
  };

  // ✅ Expose setInitialUnread so AdminChat can seed counts from API on mount
  const setInitialUnread = (map) => {
    setUnreadMap(map);
  };

  return {
    messages,
    send,
    loading,
    currentEmail: currentUser.email,
    currentRole: currentUser.role,
    unreadMap,
    setInitialUnread,
  };
};

export default useChat;