import { useState } from "react";
import { User, Mail, Phone, Building, Briefcase, Calendar, Users, ArrowLeft, CheckCircle2 } from "lucide-react";
import { createEmployeeAPI } from "../../services/admin-services/createEmployeeAPI";
import { useNavigate } from "react-router-dom";

const SECTIONS = [
  { id: "personal", label: "Personal", icon: User },
  { id: "account", label: "Account", icon: Mail },
  { id: "employment", label: "Employment", icon: Briefcase },
];

function Field({ label, required, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", letterSpacing: "0.1px" }}>
        {label}
        {required && <span style={{ color: "#E11D48", marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  fontSize: 13,
  color: "#111827",
  background: "#F9FAFB",
  border: "1px solid #E5E7EB",
  borderRadius: 10,
  outline: "none",
  transition: "all 0.15s",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const inputWithIconStyle = {
  ...inputStyle,
  paddingLeft: 38,
};

function Input({ icon: Icon, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      {Icon && (
        <Icon
          size={15}
          strokeWidth={2}
          style={{
            position: "absolute", left: 11,
            top: "50%", transform: "translateY(-50%)",
            color: focused ? "#2563EB" : "#9CA3AF",
            transition: "color 0.15s", pointerEvents: "none",
          }}
        />
      )}
      <input
        {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        style={{
          ...(Icon ? inputWithIconStyle : inputStyle),
          border: `1px solid ${focused ? "#2563EB" : "#E5E7EB"}`,
          boxShadow: focused ? "0 0 0 3px rgba(37,99,235,0.1)" : "none",
          background: focused ? "#fff" : "#F9FAFB",
        }}
      />
    </div>
  );
}

function Select({ children, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      {...props}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputStyle,
        border: `1px solid ${focused ? "#2563EB" : "#E5E7EB"}`,
        background: focused ? "#fff" : "#F9FAFB",
        boxShadow: focused ? "0 0 0 3px rgba(37,99,235,0.1)" : "none",
        //  background: focused ? "#fff" : "#F9FAFB",
        appearance: "none",
        cursor: "pointer",
      }}
    >
      {children}
    </select>
  );
}

export default function CreateEmployees() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", gender: "",
    department: "", designation: "", phone: "",
    previousCompany: "", joiningDate: "", active: true, username: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createEmployeeAPI(formData);
      setSuccess(true);
      setTimeout(() => navigate("/admin/admin-dashboard"), 1500);
    } catch (err) {
      console.error(err);
      // This shows the specific error from your Spring Boot @ControllerAdvice
      const errorMessage = err.response?.data?.message || "Failed to create employee.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", fontFamily: "inherit",
      }}>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "#ECFDF5", border: "1px solid #A7F3D0",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <CheckCircle2 size={28} color="#059669" strokeWidth={2} />
          </div>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>Invitation Sent!</p>
          <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>
            An activation link has been sent to <b>{formData.email}</b>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "45vh",
      padding: "12px 24px",
      fontFamily: "inherit",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
    }}>
      <div style={{ width: "100%", maxWidth: 760 }}>

        {/* Header */}
        <div style={{
          background: "#fff",
          borderRadius: "16px 16px 0 0",
          border: "1px solid #F0F0F0",
          borderBottom: "1px solid #F9FAFB",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 12px rgba(0,0,0,0.05)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "#EFF6FF", border: "1px solid #BFDBFE",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Users size={18} color="#2563EB" strokeWidth={2} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#111827", letterSpacing: "-0.2px" }}>
                New Employee
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9CA3AF" }}>
                Add a new team member to the organization
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/admin/admin-dashboard")}
            onMouseEnter={(e) => e.currentTarget.style.background = "#F3F4F6"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#F9FAFB"}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, fontWeight: 500, color: "#6B7280",
              background: "#F9FAFB", border: "1px solid #E5E7EB",
              borderRadius: 8, padding: "7px 12px",
              cursor: "pointer", transition: "background 0.15s",
            }}
          >
            <ArrowLeft size={14} strokeWidth={2} />
            Back
          </button>
        </div>

        {/* Section tabs */}
        <div style={{
          background: "#fff",
          borderLeft: "1px solid #F0F0F0",
          borderRight: "1px solid #F0F0F0",
          borderBottom: "1px solid #F3F4F6",
          display: "flex", gap: 0,
          padding: "0 24px",
        }}>
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <div key={id} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "12px 16px 10px",
              fontSize: 11, fontWeight: 600, color: "#6B7280",
              borderBottom: "2px solid transparent",
              cursor: "default",
            }}>
              <Icon size={13} strokeWidth={2} />
              {label}
            </div>
          ))}
        </div>

        {/* Form body */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#fff",
            borderRadius: "0 0 16px 16px",
            border: "1px solid #F0F0F0",
            borderTop: "none",
            boxShadow: "0 1px 12px rgba(0,0,0,0.05)",
            maxHeight: "calc(100vh - 220px)",
            overflowY: "auto",
          }}
        >
          {/* ── Personal Information ── */}
          <div style={{ padding: "24px 24px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: "#EFF6FF", border: "1px solid #BFDBFE",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <User size={13} color="#2563EB" strokeWidth={2} />
              </div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#111827" }}>Personal Information</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px", marginBottom: 24 }}>
              <Field label="First Name" required>
                <Input type="text" name="firstName" placeholder="Enter first name" value={formData.firstName} onChange={handleChange} required />
              </Field>
              <Field label="Last Name" required>
                <Input type="text" name="lastName" placeholder="Enter last name" value={formData.lastName} onChange={handleChange} required />
              </Field>
              <Field label="Gender" required>
                <Select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Select>
              </Field>
              <Field label="Phone Number">
                <Input icon={Phone} type="text" name="phone" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleChange} />
              </Field>
            </div>

            <div style={{ height: 1, background: "#F3F4F6", marginBottom: 24 }} />
          </div>

          {/* ── Account Information ── */}
          <div style={{ padding: "0 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: "#F0FDF4", border: "1px solid #BBF7D0",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Mail size={13} color="#16A34A" strokeWidth={2} />
              </div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#111827" }}>Account Information</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px", marginBottom: 24 }}>
              <Field label="Email Address" required>
                <Input icon={Mail} type="email" name="email" placeholder="email@company.com" value={formData.email} onChange={handleChange} required />
              </Field>
              <Field label="Username" required>
                <Input type="text" name="username" placeholder="username" value={formData.username} onChange={handleChange} required />
              </Field>
            </div>

            <div style={{ height: 1, background: "#F3F4F6", marginBottom: 24 }} />
          </div>

          {/* ── Employment Details ── */}
          <div style={{ padding: "0 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: "#FAF5FF", border: "1px solid #DDD6FE",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Briefcase size={13} color="#7C3AED" strokeWidth={2} />
              </div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#111827" }}>Employment Details</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px", marginBottom: 24 }}>
              <Field label="Department" required>
                <Input icon={Building} type="text" name="department" placeholder="e.g. Engineering, Sales" value={formData.department} onChange={handleChange} required />
              </Field>
              <Field label="Designation" required>
                <Input type="text" name="designation" placeholder="e.g. Senior Developer" value={formData.designation} onChange={handleChange} required />
              </Field>
              <Field label="Joining Date" required>
                <Input icon={Calendar} type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} required />
              </Field>
              <Field label="Previous Company">
                <Input type="text" name="previousCompany" placeholder="Enter previous company name" value={formData.previousCompany} onChange={handleChange} />
              </Field>
            </div>

            <div style={{ height: 1, background: "#F3F4F6", marginBottom: 24 }} />
          </div>

          {/* ── Status toggle ── */}
          <div style={{ padding: "0 24px 24px" }}>
            <label
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 16px",
                background: formData.active ? "#F0FDF4" : "#F9FAFB",
                border: `1px solid ${formData.active ? "#BBF7D0" : "#E5E7EB"}`,
                borderRadius: 12, cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {/* Custom toggle */}
              <div
                onClick={() => setFormData((p) => ({ ...p, active: !p.active }))}
                style={{
                  width: 40, height: 22, borderRadius: 99,
                  background: formData.active ? "#16A34A" : "#D1D5DB",
                  position: "relative", flexShrink: 0,
                  transition: "background 0.2s", cursor: "pointer",
                }}
              >
                <div style={{
                  position: "absolute",
                  top: 3, left: formData.active ? 21 : 3,
                  width: 16, height: 16, borderRadius: "50%",
                  background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                  transition: "left 0.2s",
                }} />
              </div>
              <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} style={{ display: "none" }} />
              <div>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#111827" }}>Active Employee</p>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: "#6B7280" }}>
                  Employee will have immediate access to company systems
                </p>
              </div>
              <span style={{
                marginLeft: "auto", fontSize: 10, fontWeight: 700,
                letterSpacing: "0.5px", textTransform: "uppercase",
                color: formData.active ? "#059669" : "#6B7280",
                background: formData.active ? "#ECFDF5" : "#F3F4F6",
                border: `1px solid ${formData.active ? "#A7F3D0" : "#E5E7EB"}`,
                borderRadius: 6, padding: "3px 8px", flexShrink: 0,
              }}>
                {formData.active ? "Active" : "Inactive"}
              </span>
            </label>
          </div>

          {/* ── Footer actions ── */}
          <div style={{
            display: "flex", justifyContent: "flex-end", gap: 10,
            padding: "16px 24px",
            borderTop: "1px solid #F3F4F6",
          }}>
            <button
              type="button"
              onClick={() => navigate("/admin/admin-dashboard")}
              onMouseEnter={(e) => e.currentTarget.style.background = "#F3F4F6"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#F9FAFB"}
              style={{
                padding: "9px 20px", fontSize: 12, fontWeight: 600,
                color: "#374151", background: "#F9FAFB",
                border: "1px solid #E5E7EB", borderRadius: 10,
                cursor: "pointer", transition: "background 0.15s",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#1D4ED8"; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#2563EB"; }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "9px 24px", fontSize: 12, fontWeight: 700,
                color: "#fff", background: "#2563EB",
                border: "none", borderRadius: 10,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "background 0.15s",
                boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: 14, height: 14, borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.4)",
                    borderTopColor: "#fff",
                    animation: "spin 0.7s linear infinite",
                  }} />
                  Creating…
                </>
              ) : "Create Employee"}
            </button>
          </div>
        </form>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}