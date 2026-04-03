// src/components/CreateNotification.jsx (or whatever your file is named)
import { useState } from "react";
import { Bell, Send, Users, Shield, ChevronDown, CheckCircle2, X } from "lucide-react";

// Import your new service instead of axios
import { createAdminNotification } from "../../services//admin-services/notification"; 

const TARGET_OPTIONS = [
  { value: "USER",  label: "All Employees",   icon: Users,  color: { bg: "#EFF6FF", icon: "#2563EB", border: "#BFDBFE" } },
  { value: "ADMIN", label: "Admins Only",       icon: Shield, color: { bg: "#FAF5FF", icon: "#7C3AED", border: "#DDD6FE" } },
  { value: "ALL",   label: "Everyone",          icon: Bell,   color: { bg: "#ECFDF5", icon: "#059669", border: "#A7F3D0" } },
];

const PRIORITY_OPTIONS = [
  { value: "LOW",    label: "Low",    color: "#6B7280", bg: "#F9FAFB", border: "#E5E7EB" },
  { value: "NORMAL", label: "Normal", color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" },
  { value: "HIGH",   label: "High",   color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  { value: "URGENT", label: "Urgent", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
];

function Field({ label, required, hint, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
          {label}
          {required && <span style={{ color: "#E11D48", marginLeft: 3 }}>*</span>}
        </label>
        {hint && <span style={{ fontSize: 11, color: "#9CA3AF" }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export default function CreateNotification() {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    targetRole: "USER",
    priority: "NORMAL",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
      setError("Title and message are required.");
      return;
    }
    setLoading(true);
    setError("");
    
    try {
      // Use the separated API service here
      await createAdminNotification(formData);
      
      setSuccess(true);
      setFormData({ title: "", message: "", targetRole: "USER", priority: "NORMAL" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send notification.");
    } finally {
      setLoading(false);
    }
  };


  console.log("Notification rendering")
  const selectedTarget = TARGET_OPTIONS.find((t) => t.value === formData.targetRole);
  const selectedPriority = PRIORITY_OPTIONS.find((p) => p.value === formData.priority);

  const inputStyle = (field) => ({
    width: "100%", padding: "9px 12px", fontSize: 13,
    color: "#111827",
    background: focusedField === field ? "#fff" : "#F9FAFB",
    border: `1px solid ${focusedField === field ? "#2563EB" : "#E5E7EB"}`,
    borderRadius: 10, outline: "none",
    boxShadow: focusedField === field ? "0 0 0 3px rgba(37,99,235,0.1)" : "none",
    transition: "all 0.15s", boxSizing: "border-box", fontFamily: "inherit",
  });

  return (
    <div style={{ padding: "32px 24px", display: "flex", justifyContent: "center", fontFamily: "inherit" }}>
      <div style={{ width: "100%", maxWidth: 600 }}>

        {/* Header */}
        <div style={{
          background: "#fff",
          borderRadius: "16px 16px 0 0",
          border: "1px solid #F0F0F0",
          borderBottom: "1px solid #F9FAFB",
          padding: "20px 24px",
          display: "flex", alignItems: "center", gap: 12,
          boxShadow: "0 1px 12px rgba(0,0,0,0.05)",
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "#FFFBEB", border: "1px solid #FDE68A",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Bell size={18} color="#D97706" strokeWidth={2} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#111827", letterSpacing: "-0.2px" }}>
              Create Notification
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9CA3AF" }}>
              Send announcements to employees or admins
            </p>
          </div>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} style={{
          background: "#fff",
          borderRadius: "0 0 16px 16px",
          border: "1px solid #F0F0F0",
          borderTop: "none",
          boxShadow: "0 1px 12px rgba(0,0,0,0.05)",
          padding: "24px",
          display: "flex", flexDirection: "column", gap: 20,
        }}>

          {/* Success banner */}
          {success && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 14px",
              background: "#ECFDF5", border: "1px solid #A7F3D0",
              borderRadius: 10,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={15} color="#059669" strokeWidth={2} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#059669" }}>
                  Notification sent successfully!
                </span>
              </div>
              <button type="button" onClick={() => setSuccess(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#059669", display: "flex" }}>
                <X size={14} strokeWidth={2} />
              </button>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 14px",
              background: "#FEF2F2", border: "1px solid #FECACA",
              borderRadius: 10,
            }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "#DC2626" }}>{error}</span>
              <button type="button" onClick={() => setError("")}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#DC2626", display: "flex" }}>
                <X size={14} strokeWidth={2} />
              </button>
            </div>
          )}

          {/* Target audience */}
          <Field label="Target Audience" required>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {TARGET_OPTIONS.map(({ value, label, icon: Icon, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, targetRole: value }))}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                    padding: "14px 10px",
                    background: formData.targetRole === value ? color.bg : "#F9FAFB",
                    border: `1.5px solid ${formData.targetRole === value ? color.icon : "#E5E7EB"}`,
                    borderRadius: 12, cursor: "pointer",
                    transition: "all 0.15s",
                    boxShadow: formData.targetRole === value ? `0 0 0 3px ${color.icon}18` : "none",
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: formData.targetRole === value ? "#fff" : "#F3F4F6",
                    border: `1px solid ${formData.targetRole === value ? color.border : "#E5E7EB"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: formData.targetRole === value ? color.icon : "#9CA3AF",
                    transition: "all 0.15s",
                  }}>
                    <Icon size={15} strokeWidth={2} />
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    color: formData.targetRole === value ? color.icon : "#6B7280",
                  }}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </Field>

          {/* Priority */}
          <Field label="Priority" required>
            <div style={{ display: "flex", gap: 8 }}>
              {PRIORITY_OPTIONS.map(({ value, label, color, bg, border }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, priority: value }))}
                  style={{
                    flex: 1, padding: "7px 4px",
                    fontSize: 11, fontWeight: 600,
                    color: formData.priority === value ? color : "#6B7280",
                    background: formData.priority === value ? bg : "#F9FAFB",
                    border: `1.5px solid ${formData.priority === value ? border : "#E5E7EB"}`,
                    borderRadius: 8, cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </Field>

          {/* Title */}
          <Field label="Title" required hint={`${formData.title.length}/100`}>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              maxLength={100}
              placeholder="e.g. Office Closed on Friday"
              onFocus={() => setFocusedField("title")}
              onBlur={() => setFocusedField(null)}
              style={inputStyle("title")}
              required
            />
          </Field>

          {/* Message */}
          <Field label="Message" required hint={`${formData.message.length}/500`}>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              maxLength={500}
              rows={4}
              placeholder="Write your notification message here…"
              onFocus={() => setFocusedField("message")}
              onBlur={() => setFocusedField(null)}
              style={{
                ...inputStyle("message"),
                resize: "vertical", minHeight: 100, lineHeight: 1.6,
              }}
              required
            />
          </Field>

          {/* Preview card */}
          {(formData.title || formData.message) && (
            <div style={{
              padding: "14px 16px",
              background: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: 12,
              borderLeft: `3px solid ${selectedPriority?.color || "#9CA3AF"}`,
            }}>
              <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Preview
              </p>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: selectedTarget?.color.bg || "#F3F4F6",
                  border: `1px solid ${selectedTarget?.color.border || "#E5E7EB"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {selectedTarget && <selectedTarget.icon size={14} color={selectedTarget.color.icon} strokeWidth={2} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#111827" }}>
                      {formData.title || <span style={{ color: "#9CA3AF" }}>Notification title…</span>}
                    </p>
                    <span style={{
                      fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px",
                      color: selectedPriority?.color, background: selectedPriority?.bg,
                      border: `1px solid ${selectedPriority?.border}`,
                      borderRadius: 4, padding: "1px 5px",
                    }}>
                      {selectedPriority?.label}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>
                    {formData.message || <span style={{ color: "#9CA3AF" }}>Message preview…</span>}
                  </p>
                  <p style={{ margin: "6px 0 0", fontSize: 10, color: "#9CA3AF" }}>
                    To: {selectedTarget?.label} · Just now
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Divider */}
          <div style={{ height: 1, background: "#F3F4F6" }} />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#B45309"; }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#D97706"; }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "11px 24px", fontSize: 13, fontWeight: 700,
              color: "#fff", background: "#D97706",
              border: "none", borderRadius: 10,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "background 0.15s",
              boxShadow: "0 2px 8px rgba(217,119,6,0.35)",
            }}
          >
            {loading ? (
              <>
                <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", animation: "spin 0.7s linear infinite" }} />
                Sending…
              </>
            ) : (
              <>
                <Send size={14} strokeWidth={2} />
                Send Notification
              </>
            )}
          </button>
        </form>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}