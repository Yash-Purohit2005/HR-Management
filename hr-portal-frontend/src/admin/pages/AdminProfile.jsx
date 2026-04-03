import { useEffect, useState } from "react";
import adminService from "../../services/admin-services/adminService";
import { User, Mail, Phone, Building2, Briefcase, Shield, ArrowLeft, Pencil, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Avatar({ name }) {
  const initials = name
    ? name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "A";
  return (
    <div style={{
      width: 64, height: 64, borderRadius: "50%",
      background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
      border: "2px solid #BFDBFE",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 22, fontWeight: 800, color: "#2563EB",
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function InfoField({ label, value, icon: Icon, color }) {
  const c = color || { bg: "#F9FAFB", icon: "#9CA3AF", border: "#E5E7EB" };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", letterSpacing: "0.3px", textTransform: "uppercase" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <div style={{
          position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)",
          width: 28, height: 28, borderRadius: 8,
          background: c.bg, border: `1px solid ${c.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
        }}>
          <Icon size={13} color={c.icon} strokeWidth={2} />
        </div>
        <div style={{
          width: "100%", padding: "10px 12px 10px 48px",
          fontSize: 13, fontWeight: 500, color: "#111827",
          background: "#F9FAFB", border: "1px solid #E5E7EB",
          borderRadius: 10, boxSizing: "border-box",
          minHeight: 42, display: "flex", alignItems: "center",
        }}>
          {value || <span style={{ color: "#9CA3AF", fontWeight: 400 }}>Not provided</span>}
        </div>
      </div>
    </div>
  );
}

export default function AdminProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminService.getAdminProfile()
      .then((res) => setProfile(res.data))
      .catch((err) => { console.error(err); setError("Unable to load admin profile"); });
  }, []);

  if (error) {
    return (
      <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>
        <div style={{ textAlign: "center", padding: "24px 32px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 16 }}>
          <p style={{ margin: 0, fontSize: 13, color: "#DC2626", fontWeight: 600 }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid #E5E7EB", borderTopColor: "#2563EB", animation: "spin 0.7s linear infinite" }} />
          <p style={{ margin: 0, fontSize: 13, color: "#9CA3AF" }}>Loading profile…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.username;

  return (
    <>
      <div style={{
        padding: "32px 24px",
        display: "flex",
        justifyContent: "center",
      }}>
        <div style={{ width: "100%", maxWidth: 760 }}>

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
                <User size={18} color="#2563EB" strokeWidth={2} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#111827", letterSpacing: "-0.2px" }}>Admin Profile</p>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9CA3AF" }}>Basic administrator information</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/admin/admin-dashboard")}
              onMouseEnter={(e) => e.currentTarget.style.background = "#F3F4F6"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#F9FAFB"}
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, color: "#6B7280", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, padding: "7px 12px", cursor: "pointer", transition: "background 0.15s" }}
            >
              <ArrowLeft size={14} strokeWidth={2} /> Back
            </button>
          </div>

          {/* Profile hero */}
          <div style={{
            background: "#fff",
            borderLeft: "1px solid #F0F0F0", borderRight: "1px solid #F0F0F0",
            borderBottom: "1px solid #F3F4F6",
            padding: "24px",
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <Avatar name={fullName} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#111827", letterSpacing: "-0.4px" }}>
                {fullName}
              </p>
              <p style={{ margin: "3px 0 0", fontSize: 12, color: "#6B7280" }}>{profile.email}</p>
              <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                {profile.roles?.map((role) => (
                  <span key={role} style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.4px",
                    textTransform: "uppercase",
                    color: "#2563EB", background: "#EFF6FF",
                    border: "1px solid #BFDBFE", borderRadius: 6,
                    padding: "3px 9px",
                  }}>
                    <Shield size={10} strokeWidth={2} /> {role}
                  </span>
                ))}
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  fontSize: 10, fontWeight: 700,
                  color: "#059669", background: "#ECFDF5",
                  border: "1px solid #A7F3D0", borderRadius: 6,
                  padding: "3px 9px",
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", display: "inline-block" }} />
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Info fields */}
          <div style={{
            background: "#fff",
            borderLeft: "1px solid #F0F0F0", borderRight: "1px solid #F0F0F0",
            padding: "24px",
          }}>
            {/* Section label */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "#EFF6FF", border: "1px solid #BFDBFE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={13} color="#2563EB" strokeWidth={2} />
              </div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#111827" }}>Account Details</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px" }}>
              <InfoField label="Username" value={profile.username} icon={User}
                color={{ bg: "#EFF6FF", icon: "#2563EB", border: "#BFDBFE" }} />
              <InfoField label="Email Address" value={profile.email} icon={Mail}
                color={{ bg: "#F0FDF4", icon: "#16A34A", border: "#BBF7D0" }} />
              <InfoField label="Phone Number" value={profile.phone} icon={Phone}
                color={{ bg: "#FFFBEB", icon: "#D97706", border: "#FDE68A" }} />
              <InfoField label="Department" value={profile.department} icon={Building2}
                color={{ bg: "#FAF5FF", icon: "#7C3AED", border: "#DDD6FE" }} />
              <InfoField label="Previous Company" value={profile.previousCompany} icon={Briefcase}
                color={{ bg: "#FFF1F2", icon: "#E11D48", border: "#FECDD3" }} />
              <InfoField label="Designation" value={profile.designation} icon={Briefcase}
                color={{ bg: "#ECFEFF", icon: "#0891B2", border: "#A5F3FC" }} />
            </div>
          </div>

          {/* Footer actions */}
          <div style={{
            background: "#fff",
            borderRadius: "0 0 16px 16px",
            border: "1px solid #F0F0F0",
            borderTop: "1px solid #F3F4F6",
            padding: "16px 24px",
            display: "flex", justifyContent: "flex-end", gap: 10,
            boxShadow: "0 1px 12px rgba(0,0,0,0.05)",
          }}>
            <button
              onClick={() => navigate("/admin/change-password")}
              onMouseEnter={(e) => e.currentTarget.style.background = "#F3F4F6"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#F9FAFB"}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", fontSize: 12, fontWeight: 600, color: "#374151", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 10, cursor: "pointer", transition: "background 0.15s" }}
            >
              <KeyRound size={13} strokeWidth={2} /> Change Password
            </button>
            <button
              onClick={() => navigate("/admin/edit-profile")}
              onMouseEnter={(e) => e.currentTarget.style.background = "#1D4ED8"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#2563EB"}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 20px", fontSize: 12, fontWeight: 700, color: "#fff", background: "#2563EB", border: "none", borderRadius: 10, cursor: "pointer", transition: "background 0.15s", boxShadow: "0 2px 8px rgba(37,99,235,0.3)" }}
            >
              <Pencil size={13} strokeWidth={2} /> Edit Profile
            </button>
          </div>

        </div>
      </div>
    
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
