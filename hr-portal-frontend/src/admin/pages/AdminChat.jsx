// src/admin/pages/AdminChat.jsx
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

const avatarPalette = [
  { bg: "#B5D4F4", text: "#0C447C" },
  { bg: "#9FE1CB", text: "#085041" },
  { bg: "#FAC775", text: "#633806" },
  { bg: "#F4C0D1", text: "#72243E" },
  { bg: "#CECBF6", text: "#3C3489" },
  { bg: "#C0DD97", text: "#27500A" },
];

const getAvatarColor = (email) => {
  if (!email) return avatarPalette[0];
  const index = email.charCodeAt(0) % avatarPalette.length;
  return avatarPalette[index];
};

const AdminChat = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [input, setInput] = useState("");
  const [unreadMap, setUnreadMap] = useState({});
  const bottomRef = useRef(null);
  const currentEmailRef = useRef(null);

  const { messages, send, loading, currentEmail } = useChat(selectedEmployee);

  // ─── Store currentEmail in ref for use in effects ───────────────────────────
  useEffect(() => {
    if (currentEmail) currentEmailRef.current = currentEmail;
  }, [currentEmail]);

  // ─── Fetch employee list ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!currentEmail) return;
    API.get("/chat/employees", { params: { adminEmail: currentEmail } })
      .then((res) => setEmployeeList(res.data))
      .catch((err) => console.error("Failed to fetch employee list:", err));
  }, [currentEmail]);

  // ─── Fetch unread counts per sender ─────────────────────────────────────────
  // Backend /api/chat/unread now returns Map<String, Long> grouped by senderEmail
  useEffect(() => {
    if (!currentEmail || employeeList.length === 0) return;
    API.get("/chat/unread", { params: { receiverEmail: currentEmail } })
      .then((res) => {
        // res.data is { "employee@example.com": 3, "other@example.com": 1 }
        setUnreadMap(res.data);
      })
      .catch(() => {});
  }, [employeeList, currentEmail]);

  // ─── Auto scroll ─────────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectEmployee = (email) => {
    setSelectedEmployee(email);
    setInput("");
    // Clear unread badge for this employee immediately on selection
    setUnreadMap((prev) => ({ ...prev, [email]: 0 }));
  };

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



  return (
    <div style={{
      display: "flex", height: "calc(100vh - 120px)",
      border: "0.5px solid var(--color-border-tertiary)",
      borderRadius: "var(--border-radius-lg)", overflow: "hidden",
      background: "var(--color-background-primary)"
    }}>

      {/* ── Sidebar ── */}
      <div style={{
        width: "260px", borderRight: "0.5px solid var(--color-border-tertiary)",
        display: "flex", flexDirection: "column",
        background: "var(--color-background-secondary)", flexShrink: 0
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: "16px", borderBottom: "0.5px solid var(--color-border-tertiary)"
        }}>
          <div style={{ fontSize: "14px", fontWeight: "500", color: "var(--color-text-primary)" }}>
            HR Support Inbox
          </div>
          <div style={{ fontSize: "12px", color: "var(--color-text-secondary)", marginTop: "2px" }}>
            {employeeList.length} conversation{employeeList.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Employee List */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {employeeList.length === 0 ? (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              height: "100%", fontSize: "13px", color: "var(--color-text-secondary)",
              padding: "20px", textAlign: "center"
            }}>
              No conversations yet
            </div>
          ) : (
            employeeList.map((email) => {
              const color = getAvatarColor(email);
              const isActive = selectedEmployee === email;
              const unreadCount = unreadMap[email] || 0;
              return (
                <div
                  key={email}
                  onClick={() => handleSelectEmployee(email)}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "12px 16px", cursor: "pointer",
                    borderBottom: "0.5px solid var(--color-border-tertiary)",
                    borderLeft: isActive ? "2px solid #185FA5" : "2px solid transparent",
                    background: isActive ? "var(--color-background-info)" : "transparent",
                    transition: "background 0.15s"
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "50%",
                    background: color.bg, color: color.text,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "12px", fontWeight: "500", flexShrink: 0
                  }}>
                    {getInitials(email)}
                  </div>

                  {/* Name + Email */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: "13px", fontWeight: "500",
                      color: "var(--color-text-primary)",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                    }}>
                      {formatName(email)}
                    </div>
                    <div style={{
                      fontSize: "11px", color: "var(--color-text-secondary)",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      marginTop: "1px"
                    }}>
                      {email}
                    </div>
                  </div>

                  {/* Unread Badge — only shown when count > 0 */}
                  {unreadCount > 0 && (
                    <div style={{
                      background: "#E24B4A", color: "#fff", fontSize: "10px",
                      borderRadius: "10px", padding: "2px 6px", flexShrink: 0
                    }}>
                      {unreadCount}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Chat Area ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {!selectedEmployee ? (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: "10px"
          }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "50%",
              background: "#B5D4F4", display: "flex",
              alignItems: "center", justifyContent: "center"
            }}>
              <svg width="22" height="22" fill="none" stroke="#185FA5" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </div>
            <div style={{ fontSize: "14px", fontWeight: "500", color: "var(--color-text-primary)" }}>
              Select a conversation
            </div>
            <div style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
              Choose an employee from the sidebar to view messages
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div style={{
              padding: "14px 20px", borderBottom: "0.5px solid var(--color-border-tertiary)",
              display: "flex", alignItems: "center", gap: "12px",
              background: "var(--color-background-primary)"
            }}>
              <div style={{
                width: "38px", height: "38px", borderRadius: "50%",
                background: getAvatarColor(selectedEmployee).bg,
                color: getAvatarColor(selectedEmployee).text,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "13px", fontWeight: "500", flexShrink: 0
              }}>
                {getInitials(selectedEmployee)}
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "500", color: "var(--color-text-primary)" }}>
                  {formatName(selectedEmployee)}
                </div>
                <div style={{ fontSize: "12px", color: "var(--color-text-secondary)", marginTop: "1px" }}>
                  {selectedEmployee}
                </div>
              </div>
              <div style={{
                marginLeft: "auto", width: "8px", height: "8px", borderRadius: "50%",
                background: "#639922", border: "1.5px solid var(--color-background-primary)"
              }} />
            </div>

            {/* Messages */}
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
                  display: "flex", alignItems: "center", justifyContent: "center",
                  height: "100%", color: "var(--color-text-secondary)", fontSize: "13px"
                }}>
                  No messages yet
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
                        {isMine ? "You (HR Admin)" : formatName(selectedEmployee)}
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

            {/* Input */}
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
                placeholder={`Reply to ${formatName(selectedEmployee)}...`}
                style={{
                  flex: 1, resize: "none",
                  border: "0.5px solid var(--color-border-tertiary)",
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
          </>
        )}
      </div>
    </div>
  );
};

export default AdminChat;