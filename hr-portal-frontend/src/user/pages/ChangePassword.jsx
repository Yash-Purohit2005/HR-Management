import { useState } from "react";
import { Lock, Eye, EyeOff, Shield, CheckCircle } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import API from "../../services/api"; 
import { getToken } from "../../services/authService";

function ChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    setLoading(true);
    try {
      await API.put("/user/change-password", form, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      toast.success("Password changed successfully");
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div style={styles.cardContainer}>
        {/* Header Section */}
        <div style={styles.headerRow}>
          <div>
            <h2 style={styles.h2}>Security Settings</h2>
            <p style={styles.sub}>Update your account password</p>
          </div>
          <div style={styles.badge}>
            <Shield size={14} color="#C5703A" />
            <span style={styles.badgeText}>Secure</span>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} style={styles.form}>
          
          {/* Old Password */}
          <div style={styles.field}>
            <label style={styles.label}>Current Password</label>
            <div style={styles.inputWrapper}>
              <input
                type={showPassword.old ? "text" : "password"}
                name="oldPassword"
                value={form.oldPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                style={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowPassword({ ...showPassword, old: !showPassword.old })}
                style={styles.eyeBtn}
              >
                {showPassword.old ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div style={styles.field}>
            <label style={styles.label}>New Password</label>
            <div style={styles.inputWrapper}>
              <input
                type={showPassword.new ? "text" : "password"}
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                style={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                style={styles.eyeBtn}
              >
                {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div style={styles.field}>
            <label style={styles.label}>Confirm New Password</label>
            <div style={styles.inputWrapper}>
              <input
                type={showPassword.confirm ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                style={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                style={styles.eyeBtn}
              >
                {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? "Processing..." : "Update Password"}
            {!loading && <CheckCircle size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    paddingTop: "60px",
    paddingLeft: "20px",
    paddingRight: "20px",
    minHeight: "100vh",
  },
  cardContainer: {
    width: "100%",
    maxWidth: "500px",
    margin: "0 auto",
    background: "#ffffff",
    padding: "40px",
    borderRadius: "24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
    border: "1px solid #E8E4E0",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "35px",
    paddingBottom: "20px",
    borderBottom: "1px solid #F0EDE8",
  },
  h2: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "22px",
    color: "#1A1A2E",
    margin: 0,
  },
  sub: {
    fontSize: "13px",
    color: "#888",
    margin: "4px 0 0 0",
  },
  badge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "#E6F4EA",
    padding: "6px 12px",
    borderRadius: "20px",
  },
  badgeText: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#1E7E34",
    textTransform: "uppercase",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#1A1A2E",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: "12px 45px 12px 16px",
    borderRadius: "12px",
    border: "1.5px solid #E8E4E0",
    background: "#FAFAF9",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    color: "#888",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: 0,
  },
  submitBtn: {
    background: "#1A1A2E",
    color: "#fff",
    border: "none",
    padding: "14px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    fontSize: "15px",
    marginTop: "10px",
    boxShadow: "0 4px 12px rgba(26,26,46,0.15)",
  },
};

export default ChangePassword;
