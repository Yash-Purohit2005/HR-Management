import { useState, useEffect } from "react";
import { User, Mail, Phone, Building, Briefcase, Calendar, Users, ArrowLeft, CheckCircle2, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getToken } from "../../services/authService";

// ── Reusable primitives (same as CreateEmployees) ──────────────────────────

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

function Input({ icon: Icon, ...props }) {
    const [focused, setFocused] = useState(false);
    return (
        <div style={{ position: "relative" }}>
            {Icon && (
                <Icon size={15} strokeWidth={2} style={{
                    position: "absolute", left: 11, top: "50%",
                    transform: "translateY(-50%)",
                    color: focused ? "#2563EB" : "#9CA3AF",
                    transition: "color 0.15s", pointerEvents: "none",
                }} />
            )}
            <input
                {...props}
                onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
                onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
                style={{
                    ...(Icon ? { ...inputStyle, paddingLeft: 38 } : inputStyle),
                    border: `1px solid ${focused ? "#2563EB" : "#E5E7EB"}`,
                    boxShadow: focused ? "0 0 0 3px rgba(37,99,235,0.1)" : "none",
                    background: focused ? "#fff" : "#F9FAFB",
                }}
            />
        </div>
    );
}

function SelectInput({ children, ...props }) {
    const [focused, setFocused] = useState(false);
    return (
        <select
            {...props}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
                ...inputStyle,
                border: `1px solid ${focused ? "#2563EB" : "#E5E7EB"}`,
                boxShadow: focused ? "0 0 0 3px rgba(37,99,235,0.1)" : "none",
                background: focused ? "#fff" : "#F9FAFB",
                appearance: "none", cursor: "pointer",
            }}
        >
            {children}
        </select>
    );
}

function SectionHeader({ icon: Icon, label, color }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
            <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: color.bg, border: `1px solid ${color.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                <Icon size={13} color={color.icon} strokeWidth={2} />
            </div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#111827" }}>{label}</p>
        </div>
    );
}

const Divider = () => (
    <div style={{ height: 1, background: "#F3F4F6", margin: "0 0 24px" }} />
);

// ── Main component ──────────────────────────────────────────────────────────

export default function EditEmployee() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = getToken();

    const [formData, setFormData] = useState({
        firstName: "", lastName: "", email: "", gender: "",
        department: "", designation: "", phone: "",
        previousCompany: "", joiningDate: "", active: true, username: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    // Fetch existing employee data
    useEffect(() => {
        axios.get(`http://localhost:8080/api/admin/employees/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(({ data }) => {
                setFormData({
                    firstName: data.firstName ?? "",
                    lastName: data.lastName ?? "",
                    email: data.email ?? "",
                    gender: data.gender ?? "",
                    department: data.department ?? "",
                    designation: data.designation ?? "",
                    phone: data.phone ?? "",
                    previousCompany: data.previousCompany ?? "",
                    joiningDate: data.joiningDate ?? "",
                    active: data.active ?? true,
                    username: data.username ?? "",
                });
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to load employee details.");
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            await axios.put(
                `http://localhost:8080/api/admin/employees/update/${id}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess(true);
            setTimeout(() => navigate("/admin/admin-dashboard"), 1500);
        } catch (err) {
            console.error(err);
            setError("Failed to update employee. Please check the details.");
        } finally {
            setSaving(false);
        }
    };

    // ── Loading skeleton ──
    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>
                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: "50%",
                        border: "3px solid #E5E7EB", borderTopColor: "#2563EB",
                        animation: "spin 0.7s linear infinite",
                    }} />
                    <p style={{ margin: 0, fontSize: 13, color: "#9CA3AF" }}>Loading employee details…</p>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // ── Success state ──
    if (success) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>
                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: "50%",
                        background: "#ECFDF5", border: "1px solid #A7F3D0",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <CheckCircle2 size={28} color="#059669" strokeWidth={2} />
                    </div>
                    <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>Employee Updated!</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>Redirecting to dashboard…</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            position: "fixed",
            top: 48,
            left: 100,
            right: 0,
            bottom: 0,
            padding: "48px 24px",
        }}>
            {/* inner wrapper centers the card */}
            <div style={{
                display: "flex",
                justifyContent: "center",
                minHeight: "100%",
            }}>
                <div style={{ width: "100%", maxWidth: 760 }}>

                    {/* ── Header ── */}
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
                                background: "#FAF5FF", border: "1px solid #DDD6FE",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <Users size={18} color="#7C3AED" strokeWidth={2} />
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#111827", letterSpacing: "-0.2px" }}>
                                    Edit Employee
                                    {formData.firstName && (
                                        <span style={{ fontWeight: 400, color: "#6B7280", marginLeft: 8 }}>
                                            — {formData.firstName} {formData.lastName}
                                        </span>
                                    )}
                                </p>
                                <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9CA3AF" }}>
                                    Update details for employee ID #{id}
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

                    {/* ── Section tabs ── */}
                    <div style={{
                        background: "#fff",
                        borderLeft: "1px solid #F0F0F0",
                        borderRight: "1px solid #F0F0F0",
                        borderBottom: "1px solid #F3F4F6",
                        display: "flex",
                        padding: "0 24px",
                    }}>
                        {[
                            { label: "Personal", icon: User },
                            { label: "Account", icon: Mail },
                            { label: "Employment", icon: Briefcase },
                        ].map(({ label, icon: Icon }) => (
                            <div key={label} style={{
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

                    {/* ── Form ── */}
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
                        {/* Error banner */}
                        {error && (
                            <div style={{
                                margin: "16px 24px 0",
                                padding: "10px 14px",
                                background: "#FEF2F2", border: "1px solid #FECACA",
                                borderRadius: 10, fontSize: 12, color: "#DC2626", fontWeight: 500,
                            }}>
                                {error}
                            </div>
                        )}

                        {/* ── Personal ── */}
                        <div style={{ padding: "24px 24px 0" }}>
                            <SectionHeader icon={User} label="Personal Information"
                                color={{ bg: "#EFF6FF", border: "#BFDBFE", icon: "#2563EB" }} />
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px", marginBottom: 24 }}>
                                <Field label="First Name" required>
                                    <Input type="text" name="firstName" placeholder="Enter first name" value={formData.firstName} onChange={handleChange} required />
                                </Field>
                                <Field label="Last Name" required>
                                    <Input type="text" name="lastName" placeholder="Enter last name" value={formData.lastName} onChange={handleChange} required />
                                </Field>
                                <Field label="Gender" required>
                                    <SelectInput name="gender" value={formData.gender} onChange={handleChange} required>
                                        <option value="">Select gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </SelectInput>
                                </Field>
                                <Field label="Phone Number">
                                    <Input icon={Phone} type="text" name="phone" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleChange} />
                                </Field>
                            </div>
                            <Divider />
                        </div>

                        {/* ── Account ── */}
                        <div style={{ padding: "0 24px" }}>
                            <SectionHeader icon={Mail} label="Account Information"
                                color={{ bg: "#F0FDF4", border: "#BBF7D0", icon: "#16A34A" }} />
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px", marginBottom: 24 }}>
                                <Field label="Email Address" required>
                                    <Input icon={Mail} type="email" name="email" placeholder="email@company.com" value={formData.email} onChange={handleChange} required />
                                </Field>
                                <Field label="Username" required>
                                    <Input type="text" name="username" placeholder="username" value={formData.username} onChange={handleChange} required />
                                </Field>
                            </div>
                            <Divider />
                        </div>

                        {/* ── Employment ── */}
                        <div style={{ padding: "0 24px" }}>
                            <SectionHeader icon={Briefcase} label="Employment Details"
                                color={{ bg: "#FAF5FF", border: "#DDD6FE", icon: "#7C3AED" }} />
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
                            <Divider />
                        </div>

                        {/* ── Status toggle ── */}
                        <div style={{ padding: "0 24px 24px" }}>
                            <label style={{
                                display: "flex", alignItems: "center", gap: 14,
                                padding: "14px 16px",
                                background: formData.active ? "#F0FDF4" : "#F9FAFB",
                                border: `1px solid ${formData.active ? "#BBF7D0" : "#E5E7EB"}`,
                                borderRadius: 12, cursor: "pointer",
                                transition: "all 0.15s",
                            }}>
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
                                        Employee will have access to company systems
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

                        {/* ── Footer ── */}
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
                                disabled={saving}
                                onMouseEnter={(e) => { if (!saving) e.currentTarget.style.background = "#5B21B6"; }}
                                onMouseLeave={(e) => { if (!saving) e.currentTarget.style.background = "#7C3AED"; }}
                                style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    padding: "9px 24px", fontSize: 12, fontWeight: 700,
                                    color: "#fff", background: "#7C3AED",
                                    border: "none", borderRadius: 10,
                                    cursor: saving ? "not-allowed" : "pointer",
                                    opacity: saving ? 0.7 : 1,
                                    transition: "background 0.15s",
                                    boxShadow: "0 2px 8px rgba(124,58,237,0.3)",
                                }}
                            >
                                {saving ? (
                                    <>
                                        <div style={{
                                            width: 14, height: 14, borderRadius: "50%",
                                            border: "2px solid rgba(255,255,255,0.4)",
                                            borderTopColor: "#fff",
                                            animation: "spin 0.7s linear infinite",
                                        }} />
                                        Saving…
                                    </>
                                ) : (
                                    <>
                                        <Save size={13} strokeWidth={2} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
                </div>

                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
            );
}