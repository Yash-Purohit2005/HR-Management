import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, ShieldCheck, ArrowLeft, CheckCircle2, KeyRound } from "lucide-react";
import { changePasswordAPI } from "../../services/admin-services/changePassword";

function PasswordField({ label, name, value, onChange, show, onToggle, placeholder }) {
  const [focused, setFocused] = useState(false);

  const strengthCheck = name === "newPassword" && value.length > 0;
  const strength = value.length === 0 ? 0
    : value.length < 6 ? 1
    : value.length < 10 ? 2
    : /[A-Z]/.test(value) && /[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value) ? 4
    : 3;

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "#EF4444", "#F59E0B", "#3B82F6", "#10B981"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", letterSpacing: "0.1px" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {/* Lock icon */}
        <div style={{
          position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)",
          width: 28, height: 28, borderRadius: 8,
          background: focused ? "#EFF6FF" : "#F3F4F6",
          border: `1px solid ${focused ? "#BFDBFE" : "#E5E7EB"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none", transition: "all 0.15s",
        }}>
          <Lock size={13} color={focused ? "#2563EB" : "#9CA3AF"} strokeWidth={2} />
        </div>

        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", padding: "10px 44px 10px 48px",
            fontSize: 13, color: "#111827",
            background: focused ? "#fff" : "#F9FAFB",
            border: `1px solid ${focused ? "#2563EB" : "#E5E7EB"}`,
            borderRadius: 10, outline: "none",
            boxShadow: focused ? "0 0 0 3px rgba(37,99,235,0.1)" : "none",
            transition: "all 0.15s", boxSizing: "border-box",
            fontFamily: "inherit",
          }}
        />

        {/* Toggle visibility */}
        <button
          type="button"
          onClick={onToggle}
          style={{
            position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer",
            color: "#9CA3AF", display: "flex", alignItems: "center", padding: 2,
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#374151"}
          onMouseLeave={(e) => e.currentTarget.style.color = "#9CA3AF"}
        >
          {show ? <EyeOff size={15} strokeWidth={2} /> : <Eye size={15} strokeWidth={2} />}
        </button>
      </div>

      {/* Strength indicator — only for new password */}
      {strengthCheck && (
        <div style={{ display: "flex", gap: 4, alignItems: "center", marginTop: 2 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 99,
              background: i <= strength ? strengthColor[strength] : "#E5E7EB",
              transition: "background 0.2s",
            }} />
          ))}
          <span style={{ fontSize: 10, fontWeight: 600, color: strengthColor[strength], marginLeft: 6, whiteSpace: "nowrap" }}>
            {strengthLabel[strength]}
          </span>
        </div>
      )}
    </div>
  );
}

export default function ChangePassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [show, setShow] = useState({ old: false, new: false, confirm: false });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); setError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }
    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const response = await changePasswordAPI({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });
      setMessage(response.data);
      setSuccess(true);
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = formData.confirmPassword.length > 0 && formData.newPassword === formData.confirmPassword;
  const passwordsMismatch = formData.confirmPassword.length > 0 && formData.newPassword !== formData.confirmPassword;

  return (
    <div style={{ padding: "32px 24px", display: "flex", justifyContent: "center", fontFamily: "inherit" }}>
      <div style={{ width: "100%", maxWidth: 480 }}>

        {/* Header */}
        <div style={{
          background: "#fff",
          borderRadius: "16px 16px 0 0",
          border: "1px solid #F0F0F0",
          borderBottom: "1px solid #F9FAFB",
          padding: "20px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: "0 1px 12px rgba(0,0,0,0.05)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "#EFF6FF", border: "1px solid #BFDBFE", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShieldCheck size={18} color="#2563EB" strokeWidth={2} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#111827", letterSpacing: "-0.2px" }}>Change Password</p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9CA3AF" }}>Update your account password</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/admin/admin-profile")}
            onMouseEnter={(e) => e.currentTarget.style.background = "#F3F4F6"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#F9FAFB"}
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, color: "#6B7280", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, padding: "7px 12px", cursor: "pointer", transition: "background 0.15s" }}
          >
            <ArrowLeft size={14} strokeWidth={2} /> Back
          </button>
        </div>

        {/* Body */}
        <div style={{
          background: "#fff",
          borderRadius: "0 0 16px 16px",
          border: "1px solid #F0F0F0",
          borderTop: "none",
          boxShadow: "0 1px 12px rgba(0,0,0,0.05)",
          padding: "24px",
        }}>

          {/* Success banner */}
          {success && (
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "12px 14px", marginBottom: 20,
              background: "#ECFDF5", border: "1px solid #A7F3D0",
              borderRadius: 10, fontSize: 12, fontWeight: 500, color: "#059669",
            }}>
              <CheckCircle2 size={15} strokeWidth={2} />
              {message || "Password updated successfully!"}
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div style={{
              padding: "10px 14px", marginBottom: 20,
              background: "#FEF2F2", border: "1px solid #FECACA",
              borderRadius: 10, fontSize: 12, fontWeight: 500, color: "#DC2626",
            }}>
              {error}
            </div>
          )}

          {/* Section header */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "#EFF6FF", border: "1px solid #BFDBFE", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <KeyRound size={13} color="#2563EB" strokeWidth={2} />
            </div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#111827" }}>Update Credentials</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            <PasswordField
              label="Current Password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              show={show.old}
              onToggle={() => setShow((p) => ({ ...p, old: !p.old }))}
              placeholder="Enter current password"
            />

            <PasswordField
              label="New Password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              show={show.new}
              onToggle={() => setShow((p) => ({ ...p, new: !p.new }))}
              placeholder="Enter new password"
            />

            {/* Confirm password with match indicator */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
                Confirm New Password
              </label>
              <div style={{ position: "relative" }}>
                <div style={{
                  position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)",
                  width: 28, height: 28, borderRadius: 8,
                  background: passwordsMatch ? "#ECFDF5" : passwordsMismatch ? "#FEF2F2" : "#F3F4F6",
                  border: `1px solid ${passwordsMatch ? "#A7F3D0" : passwordsMismatch ? "#FECACA" : "#E5E7EB"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  pointerEvents: "none", transition: "all 0.15s",
                }}>
                  <Lock size={13} color={passwordsMatch ? "#059669" : passwordsMismatch ? "#DC2626" : "#9CA3AF"} strokeWidth={2} />
                </div>
                <input
                  type={show.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter new password"
                  required
                  style={{
                    width: "100%", padding: "10px 44px 10px 48px",
                    fontSize: 13, color: "#111827",
                    background: passwordsMatch ? "#F0FDF4" : passwordsMismatch ? "#FEF2F2" : "#F9FAFB",
                    border: `1px solid ${passwordsMatch ? "#A7F3D0" : passwordsMismatch ? "#FECACA" : "#E5E7EB"}`,
                    borderRadius: 10, outline: "none", transition: "all 0.15s",
                    boxSizing: "border-box", fontFamily: "inherit",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShow((p) => ({ ...p, confirm: !p.confirm }))}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex", alignItems: "center", padding: 2 }}
                >
                  {show.confirm ? <EyeOff size={15} strokeWidth={2} /> : <Eye size={15} strokeWidth={2} />}
                </button>
              </div>
              {passwordsMatch && (
                <p style={{ margin: 0, fontSize: 11, color: "#059669", fontWeight: 500 }}>✓ Passwords match</p>
              )}
              {passwordsMismatch && (
                <p style={{ margin: 0, fontSize: 11, color: "#DC2626", fontWeight: 500 }}>✗ Passwords do not match</p>
              )}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "#F3F4F6", margin: "4px 0" }} />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || passwordsMismatch}
              onMouseEnter={(e) => { if (!loading && !passwordsMismatch) e.currentTarget.style.background = "#1D4ED8"; }}
              onMouseLeave={(e) => { if (!loading && !passwordsMismatch) e.currentTarget.style.background = "#2563EB"; }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "10px 24px", fontSize: 12, fontWeight: 700,
                color: "#fff", background: "#2563EB",
                border: "none", borderRadius: 10,
                cursor: loading || passwordsMismatch ? "not-allowed" : "pointer",
                opacity: loading || passwordsMismatch ? 0.6 : 1,
                transition: "background 0.15s",
                boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
                width: "100%",
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", animation: "spin 0.7s linear infinite" }} />
                  Updating…
                </>
              ) : (
                <><ShieldCheck size={14} strokeWidth={2} /> Update Password</>
              )}
            </button>
          </form>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}