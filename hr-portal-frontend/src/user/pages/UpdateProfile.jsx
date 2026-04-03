import { useState, useEffect } from "react";
import { User, Mail, Phone, Save, Edit2, ShieldCheck } from "lucide-react";
import API from "../../services/api";
import { toast, ToastContainer } from "react-toastify";

function UpdateProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    API.get("/user/profile")
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to load profile data");
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await API.put("/user/update-profile", profile);
      toast.success("Profile updated successfully!");
      setProfile(res.data);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        toast.error("Unauthorized: You cannot update this profile.");
      } else {
        toast.error("Update failed. Please try again.");
      }
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div style={styles.loading}>Loading Profile...</div>;
  if (!profile) return <div style={styles.loading}>No profile data found</div>;

  return (
    <div style={styles.pageWrapper}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div style={styles.cardContainer}>
        {/* Header Section */}
        <div style={styles.headerRow}>
          <div>
            <h2 style={styles.h2}>Update Profile</h2>
            <p style={styles.sub}>Manage your personal information</p>
          </div>
          <div style={styles.badge}>
            <ShieldCheck size={14} color="#C5703A" />
            <span style={styles.badgeText}>Verified Account</span>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grid}>
            {/* First Name */}
            <div style={styles.field}>
              <label style={styles.label}>
                <User size={14} style={styles.icon} /> First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName || ""}
                onChange={handleChange}
                placeholder="Enter first name"
                style={styles.input}
                required
              />
            </div>

            {/* Last Name */}
            <div style={styles.field}>
              <label style={styles.label}>
                <User size={14} style={styles.icon} /> Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName || ""}
                onChange={handleChange}
                placeholder="Enter last name"
                style={styles.input}
                required
              />
            </div>

            {/* Email */}
            <div style={styles.field}>
              <label style={styles.label}>
                <Mail size={14} style={styles.icon} /> Email Address
              </label>
              <input
                type="email"
                name="email"
                value={profile.email || ""}
                onChange={handleChange}
                placeholder="Enter email address"
                style={styles.input}
                required
              />
            </div>

            {/* Phone */}
            <div style={styles.field}>
              <label style={styles.label}>
                <Phone size={14} style={styles.icon} /> Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={profile.phone || ""}
                onChange={handleChange}
                placeholder="Enter phone number"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.footer}>
            <button type="submit" disabled={updating} style={styles.submitBtn}>
              {updating ? "Saving..." : "Save Changes"}
              {!updating && <Save size={18} />}
            </button>
          </div>
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
    maxWidth: "800px",
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
    fontSize: "24px",
    color: "#1A1A2E",
    margin: 0,
  },
  sub: {
    fontSize: "14px",
    color: "#888",
    margin: "4px 0 0 0",
  },
  badge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "#FFF4E5",
    padding: "6px 12px",
    borderRadius: "20px",
  },
  badgeText: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#C5703A",
    textTransform: "uppercase",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "25px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#1A1A2E",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  icon: {
    color: "#C5703A",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1.5px solid #E8E4E0",
    background: "#FAFAF9",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border 0.2s",
  },
  footer: {
    marginTop: "40px",
    display: "flex",
    justifyContent: "flex-end",
  },
  submitBtn: {
    background: "#1A1A2E",
    color: "#fff",
    border: "none",
    padding: "14px 28px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "15px",
    boxShadow: "0 4px 12px rgba(26,26,46,0.15)",
  },
  loading: {
    padding: "100px",
    textAlign: "center",
    fontFamily: "inherit",
    color: "#888",
  },
};

export default UpdateProfile;
