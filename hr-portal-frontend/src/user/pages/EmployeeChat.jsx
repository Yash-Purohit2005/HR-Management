// src/user/pages/EmployeeChat.jsx
import { useState, useEffect, useRef } from "react";
import useChat from "../../services/chat/useChat";
import API from "../../services/api";

const formatName = (email) => {
  if (!email) return "Unknown";
  const local = email.split("@")[0];
  return local
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const getInitials = (email) => {
  if (!email) return "?";
  const parts = email.split("@")[0].replace(/[._-]/g, " ").split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
};

const formatTime = (sentAt) => {
  if (!sentAt) return "";
  return new Date(sentAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const avatarColors = [
  { bg: "#B5D4F4", text: "#0C447C" },
  { bg: "#9FE1CB", text: "#085041" },
  { bg: "#FAC775", text: "#633806" },
  { bg: "#F4C0D1", text: "#72243E" },
  { bg: "#CECBF6", text: "#3C3489" },
];

const getAvatarColor = (email) => {
  if (!email) return avatarColors[0];
  const index = email.charCodeAt(0) % avatarColors.length;
  return avatarColors[index];
};

const EmployeeChat = () => {
  const [adminEmail, setAdminEmail] = useState(null);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
  API.get("/chat/assigned-admin")
    .then((res) => {
       console.log("✅ Assigned admin response:", res.data);
      setAdminEmail(res.data); // returns a single string, not an array
    })
    .catch((err) => console.error("Failed to fetch assigned admin:", err));
}, []);

  const { messages, send, loading, currentEmail } = useChat(adminEmail);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    send(input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!adminEmail) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100%", color: "var(--color-text-secondary)", fontSize: "14px"
      }}>
        Connecting to HR Support...
      </div>
    );
  }

  const adminColor = getAvatarColor(adminEmail);

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "calc(100vh - 120px)",
      background: "var(--color-background-primary)",
      border: "0.5px solid var(--color-border-tertiary)",
      borderRadius: "var(--border-radius-lg)", overflow: "hidden"
    }}>

      {/* ── Header ── */}
      <div style={{
        padding: "14px 20px", borderBottom: "0.5px solid var(--color-border-tertiary)",
        display: "flex", alignItems: "center", gap: "12px",
        background: "var(--color-background-primary)"
      }}>
        <div style={{
          width: "38px", height: "38px", borderRadius: "50%",
          background: adminColor.bg, color: adminColor.text,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "13px", fontWeight: "500", flexShrink: 0
        }}>
          HR
        </div>
        <div>
          <div style={{ fontSize: "14px", fontWeight: "500", color: "var(--color-text-primary)" }}>
            HR Support
          </div>
          <div style={{ fontSize: "12px", color: "var(--color-text-secondary)", marginTop: "1px" }}>
            {formatName(adminEmail)}
          </div>
        </div>
        <div style={{
          marginLeft: "auto", width: "8px", height: "8px", borderRadius: "50%",
          background: "#639922", border: "1.5px solid var(--color-background-primary)"
        }} />
      </div>

      {/* ── Messages ── */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "16px",
        display: "flex", flexDirection: "column", gap: "12px",
        background: "var(--color-background-tertiary)"
      }}>
        {loading ? (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            height: "100%", color: "var(--color-text-secondary)", fontSize: "13px"
          }}>
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", height: "100%", gap: "8px"
          }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "50%",
              background: "#B5D4F4", display: "flex", alignItems: "center",
              justifyContent: "center"
            }}>
              <svg width="20" height="20" fill="none" stroke="#185FA5" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </div>
            <div style={{ fontSize: "13px", fontWeight: "500", color: "var(--color-text-primary)" }}>
              No messages yet
            </div>
            <div style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
              Send a message to HR Support to get started
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMine = msg.senderEmail === currentEmail;
            return (
              <div key={index} style={{
                display: "flex", flexDirection: "column",
                alignItems: isMine ? "flex-end" : "flex-start",
                maxWidth: "68%", alignSelf: isMine ? "flex-end" : "flex-start"
              }}>
                <div style={{
                  fontSize: "11px", color: "var(--color-text-secondary)",
                  marginBottom: "3px", padding: "0 4px"
                }}>
                  {isMine ? "You" : "HR Admin"}
                </div>
                <div style={{
                  padding: "9px 13px",
                  borderRadius: isMine ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  fontSize: "13px", lineHeight: "1.5",
                  background: isMine ? "#185FA5" : "var(--color-background-primary)",
                  color: isMine ? "#fff" : "var(--color-text-primary)",
                  border: isMine ? "none" : "0.5px solid var(--color-border-tertiary)"
                }}>
                  {msg.content}
                </div>
                <div style={{
                  fontSize: "11px", marginTop: "3px", padding: "0 4px",
                  color: "var(--color-text-secondary)"
                }}>
                  {formatTime(msg.sentAt)}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div style={{
        padding: "12px 16px", borderTop: "0.5px solid var(--color-border-tertiary)",
        display: "flex", gap: "10px", alignItems: "center",
        background: "var(--color-background-primary)"
      }}>
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message to HR Support..."
          style={{
            flex: 1, resize: "none", border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: "20px", padding: "8px 14px", fontSize: "13px",
            background: "var(--color-background-secondary)",
            color: "var(--color-text-primary)", outline: "none",
            fontFamily: "var(--font-sans)"
          }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          style={{
            width: "34px", height: "34px", borderRadius: "50%",
            background: input.trim() ? "#185FA5" : "var(--color-background-secondary)",
            border: "0.5px solid var(--color-border-tertiary)",
            cursor: input.trim() ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, transition: "background 0.15s"
          }}
        >
          <svg width="14" height="14" fill="none"
            stroke={input.trim() ? "#fff" : "var(--color-text-secondary)"}
            strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default EmployeeChat;