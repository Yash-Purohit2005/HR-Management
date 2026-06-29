import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Get the token from the URL: ?token=xyz
    const token = searchParams.get('token');
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            return setError("Passwords do not match!");
        }

        setLoading(true);
        try {
            await API.post('/auth/reset-password', { token, password });
            alert("Password reset successful! Redirecting to login...");
            navigate('/'); 
        } catch (error) {
            setError(error.response?.data?.message || "Invalid or expired token.");
        } finally {
            setLoading(false);
        }
    };

    const LockIcon = () => (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <rect x="2.5" y="6.5" width="10" height="7" rx="2" stroke="#BBBBBB" strokeWidth="1.4" />
            <path d="M5 6.5V4.5a2.5 2.5 0 015 0v2" stroke="#BBBBBB" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
    );

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                {/* Brand */}
                <div style={styles.brand}>
                    <div style={styles.brandDot}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="4" fill="#C5703A" />
                            <circle cx="4" cy="4" r="2" fill="#fff" opacity="0.5" />
                        </svg>
                    </div>
                    <span style={styles.brandName}>Pulse<span style={{ color: "#C5703A" }}>HR</span></span>
                </div>

                {/* Header */}
                <div style={{ marginBottom: 28 }}>
                    <div style={styles.stepBadge}>
                        <div style={styles.stepBadgeDot} />
                        Security Update
                    </div>
                    <h1 style={styles.h1}>Set New Password</h1>
                    <p style={styles.sub}>Choose a strong password to secure your account.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {error && (
                        <div style={styles.errorBox}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <circle cx="7" cy="7" r="6" stroke="#C62828" strokeWidth="1.5" />
                                <path d="M7 4v3.5" stroke="#C62828" strokeWidth="1.5" strokeLinecap="round" />
                                <circle cx="7" cy="10" r="0.75" fill="#C62828" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <div style={styles.field}>
                        <label style={styles.label}>New Password</label>
                        <div style={{ position: "relative" }}>
                            <span style={styles.inputIcon}><LockIcon /></span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={styles.input}
                                required
                            />
                        </div>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Confirm New Password</label>
                        <div style={{ position: "relative" }}>
                            <span style={styles.inputIcon}><LockIcon /></span>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                style={styles.input}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} style={styles.btn}>
                        {loading ? "Updating..." : "Update Password"}
                        {!loading && (
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                <path d="M3 7.5h9M9 4l3.5 3.5L9 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>
                </form>

                <div style={{ height: 1, background: "#F0EDE8", margin: "24px 0" }} />
                
                <Link to="/" style={styles.backLink}>Back to Login</Link>
            </div>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Sora:wght@700&display=swap');
            `}</style>
        </div>
    );
};

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

export default ResetPassword;