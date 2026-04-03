import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("jwt"); // clear any old token on page load
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await API.post("/auth/login", { email, password }, { withCredentials: true });

      localStorage.setItem("jwt", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("username", response.data.username);

      if (response.data.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (error) {
      const message = error.response?.data?.message ||
        (error.response?.status === 500 && error.response?.data?.message?.includes("inactive")
          ? "Account is inactive. Contact admin."
          : "Invalid email or password");
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Icons from your design
  const UserIcon = () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M7.5 7.5a3 3 0 100-6 3 3 0 000 6zM2 13s1.5-3.5 5.5-3.5 5.5 3.5 5.5 3.5" stroke="#BBBBBB" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );

  const LockIcon = () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="2.5" y="6.5" width="10" height="7" rx="2" stroke="#BBBBBB" strokeWidth="1.4" />
      <path d="M5 6.5V4.5a2.5 2.5 0 015 0v2" stroke="#BBBBBB" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );

  const EyeIcon = () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M1 7.5C2.5 4.5 5 3 7.5 3s5 1.5 6.5 4.5C12.5 11 10 12.5 7.5 12.5S2.5 11 1 7.5z" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M1 7.5C2.5 4.5 5 3 7.5 3s5 1.5 6.5 4.5C12.5 11 10 12.5 7.5 12.5S2.5 11 1 7.5z" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1 1l13 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
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
            Portal Access
          </div>
          <h1 style={styles.h1}>Welcome back</h1>
          <p style={styles.sub}>Enter your credentials to access your HR dashboard.</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {/* Error Box */}
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

          {/* Email Field */}
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <div style={{ position: "relative" }}>
              <span style={styles.inputIcon}><UserIcon /></span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                style={styles.input}
                required
              />

            </div>
          </div>

          {/* Password Field */}
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={{ position: "relative" }}>
              <span style={styles.inputIcon}><LockIcon /></span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={styles.input}
                required
              />
              <button type="button" style={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? "Authenticating…" : "Login to Account"}
            {!loading && (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M3 7.5h9M9 4l3.5 3.5L9 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </form>

        <div style={{ height: 1, background: "#F0EDE8", margin: "24px 0" }} />

        <p style={styles.footerNote}>
          {/* Apply the brand color and pointer cursor here */}
          <Link to="/forgot-password" style={styles.link}>
            Forgot password?
          </Link>
          <br />
          If you're having trouble, please contact the IT department.
        </p>
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
    marginBottom: 6, margin: "0 0 6px",
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
  eyeBtn: {
    position: "absolute", right: 14, top: "50%",
    transform: "translateY(-50%)",
    background: "none", border: "none",
    cursor: "pointer", color: "#BBB",
    display: "flex", alignItems: "center", padding: 0,
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
  footerNote: {
    fontSize: 12, // Slightly larger for better readability
    color: "#888", // Darker grey so it's visible
    textAlign: "center",
    lineHeight: 1.6,
    margin: 0,
  },
  link: {
    color: "#C5703A", // The PulseHR orange color from your brand
    textDecoration: "none",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "12px",
    display: "inline-block",
    marginTop: "4px",
    transition: "color 0.2s ease", // Smooth hover effect
  },
};

export default Login;