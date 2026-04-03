import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle, loading, success, error
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        try {
            await API.post("/auth/forgot-password", { email });
            setStatus("success");
            setMessage("Check your email for the reset link.");
        } catch (err) {
            setStatus("error");
            setMessage(err.response?.data?.message || "Something went wrong.");
        }
    };

    // Icon matching the Login page style
    const UserIcon = () => (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M7.5 7.5a3 3 0 100-6 3 3 0 000 6zM2 13s1.5-3.5 5.5-3.5 5.5 3.5 5.5 3.5" stroke="#BBBBBB" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
    );

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                {/* Brand Section */}
                <div style={styles.brand}>
                    <div style={styles.brandDot}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="4" fill="#C5703A" />
                            <circle cx="4" cy="4" r="2" fill="#fff" opacity="0.5" />
                        </svg>
                    </div>
                    <span style={styles.brandName}>Pulse<span style={{ color: "#C5703A" }}>HR</span></span>
                </div>

                {/* Header Section */}
                <div style={{ marginBottom: 28 }}>
                    <div style={styles.stepBadge}>
                        <div style={styles.stepBadgeDot} />
                        Password Recovery
                    </div>
                    <h1 style={styles.h1}>Forgot Password?</h1>
                    <p style={styles.sub}>Enter your email to receive a recovery link.</p>
                </div>

                {status === "success" ? (
                    <div style={styles.successBox}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{marginRight: 8}}>
                            <circle cx="7" cy="7" r="6" stroke="#155724" strokeWidth="1.5" />
                            <path d="M4 7l2 2 4-4" stroke="#155724" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {message}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                        {status === "error" && (
                            <div style={styles.errorBox}>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <circle cx="7" cy="7" r="6" stroke="#C62828" strokeWidth="1.5" />
                                    <path d="M7 4v3.5" stroke="#C62828" strokeWidth="1.5" strokeLinecap="round" />
                                    <circle cx="7" cy="10" r="0.75" fill="#C62828" />
                                </svg>
                                {message}
                            </div>
                        )}

                        <div style={styles.field}>
                            <label style={styles.label}>Email Address</label>
                            <div style={{ position: "relative" }}>
                                <span style={styles.inputIcon}><UserIcon /></span>
                                <input 
                                    type="email" 
                                    placeholder="name@company.com"
                                    style={styles.input} 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={status === "loading"} style={styles.btn}>
                            {status === "loading" ? "Sending Request..." : "Send Reset Link"}
                            {status !== "loading" && (
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                    <path d="M3 7.5h9M9 4l3.5 3.5L9 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>
                    </form>
                )}

                <div style={{ height: 1, background: "#F0EDE8", margin: "24px 0" }} />

                <Link to="/" style={styles.backLink}>
                    ← Back to Login
                </Link>
            </div>
            
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Sora:wght@700&display=swap');
            `}</style>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F0EDE8",
        padding: 20,
        fontFamily: "'DM Sans', sans-serif",
    },
    card: {
        width: "100%",
        maxWidth: 420,
        background: "#fff",
        borderRadius: 24,
        padding: "40px 36px",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
    },
    brand: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 32,
    },
    brandDot: {
        width: 28, height: 28,
        borderRadius: 8,
        background: "#1A1A2E",
        display: "flex", alignItems: "center", justifyContent: "center",
    },
    brandName: {
        fontFamily: "'Sora', sans-serif",
        fontSize: 15, fontWeight: 700,
        color: "#1A1A2E", letterSpacing: "-0.3px",
    },
    stepBadge: {
        display: "inline-flex", alignItems: "center", gap: 6,
        background: "#FFF3EA", border: "1px solid #F0C9A8",
        borderRadius: 20, padding: "4px 12px",
        fontSize: 11, fontWeight: 600, color: "#C5703A",
        letterSpacing: "0.5px", textTransform: "uppercase",
        marginBottom: 14,
    },
    stepBadgeDot: {
        width: 6, height: 6, borderRadius: "50%", background: "#C5703A",
    },
    h1: {
        fontFamily: "'Sora', sans-serif",
        fontSize: 22, fontWeight: 700,
        color: "#1A1A2E", letterSpacing: "-0.5px",
        margin: "0 0 6px",
    },
    sub: {
        fontSize: 13, color: "#888", lineHeight: 1.6, margin: 0,
    },
    field: {
        display: "flex", flexDirection: "column", marginBottom: 18,
    },
    label: {
        fontSize: 12, fontWeight: 600, color: "#444",
        letterSpacing: "0.3px", marginBottom: 7,
        textTransform: "uppercase",
    },
    inputIcon: {
        position: "absolute", left: 14, top: "50%",
        transform: "translateY(-50%)",
        display: "flex", alignItems: "center", color: "#BBB",
    },
    input: {
        width: "100%", padding: "12px 14px 12px 42px",
        fontSize: 14, fontFamily: "'DM Sans', sans-serif",
        borderRadius: 12, border: "1.5px solid #E8E4E0",
        background: "#FAFAF9", color: "#1A1A2E",
        outline: "none", boxSizing: "border-box",
    },
    btn: {
        width: "100%", padding: 14,
        background: "#1A1A2E", color: "#fff",
        border: "none", borderRadius: 12,
        fontSize: 14, fontWeight: 600,
        fontFamily: "'DM Sans', sans-serif",
        cursor: "pointer", marginTop: 8,
        display: "flex", alignItems: "center",
        justifyContent: "center", gap: 8,
    },
    successBox: {
        background: "#E8F5E9", border: "1px solid #A5D6A7",
        borderRadius: 10, padding: "10px 14px",
        fontSize: 13, color: "#1B5E20",
        display: "flex", alignItems: "center",
        marginTop: 10,
    },
    errorBox: {
        background: "#FFF1F0", border: "1px solid #FFCDD2",
        borderRadius: 10, padding: "10px 14px",
        fontSize: 12, color: "#C62828",
        display: "flex", alignItems: "center", gap: 8,
        marginBottom: 18,
    },
    backLink: {
        display: 'block', 
        textAlign: 'center', 
        fontSize: 13, 
        color: '#C5703A', 
        textDecoration: 'none', 
        fontWeight: 600
    }
};

export default ForgotPassword;