import { useEffect, useState } from "react";
import { User, Mail, Phone, Calendar, Building2, UserCheck, Shield, MapPin } from "lucide-react";
import API from "../../services/api";

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    API.get("/user/profile")
      .then(res => setProfile(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!profile) return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner} />
      <p style={{ color: "#888", marginTop: 12 }}>Retrieving profile...</p>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.avatarWrapper}>
            <img
              src={`https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&background=1A1A2E&color=fff&size=128&font-size=0.33`}
              alt="Profile"
              style={styles.avatar}
            />
            {profile.active && <div style={styles.onlineIndicator} />}
          </div>
          
          <div style={styles.headerText}>
            <div style={styles.badge}>
              <div style={styles.badgeDot} />
              Employee Profile
            </div>
            <h2 style={styles.h1}>
              {profile.firstName} {profile.lastName}
            </h2>
            <p style={styles.sub}>
              {profile.designation} • {profile.department}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div style={styles.grid}>
          <InfoItem icon={<Mail size={18} />} label="Email Address" value={profile.email} />
          <InfoItem icon={<User size={18} />} label="Username" value={profile.username} />
          <InfoItem icon={<Phone size={18} />} label="Phone Number" value={profile.phone} />
          <InfoItem icon={<UserCheck size={18} />} label="Gender" value={profile.gender} />
          <InfoItem icon={<Building2 size={18} />} label="Previous Experience" value={profile.previousCompany || "N/A"} />
          <InfoItem icon={<Calendar size={18} />} label="Joining Date" value={profile.joiningDate} />
        </div>

        {/* Roles Section */}
        <div style={styles.footer}>
          <div style={styles.roleHeader}>
            <Shield size={18} style={{ color: "#C5703A" }} />
            <span style={styles.label}>Access Permissions</span>
          </div>
          <div style={styles.roleList}>
            {profile.roles.map((role, index) => (
              <span key={index} style={styles.roleBadge}>
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component for clean mapping
const InfoItem = ({ icon, label, value }) => (
  <div style={styles.infoBox}>
    <div style={styles.iconContainer}>{icon}</div>
    <div>
      <p style={styles.label}>{label}</p>
      <p style={styles.value}>{value}</p>
    </div>
  </div>
);

const styles = {
  page: {
    padding: "40px 20px",
    // background: "#F0EDE8",
    minHeight: "100vh",
    fontFamily: "'DM Sans', sans-serif",
  },
  card: {
    maxWidth: "800px",
    margin: "0 auto",
    background: "#ffffff",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
    border: "1px solid rgba(0,0,0,0.05)",
  },
  header: {
    background: "#1A1A2E",
    padding: "40px",
    display: "flex",
    alignItems: "center",
    gap: "30px",
    color: "#fff",
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: "110px",
    height: "110px",
    borderRadius: "20px",
    border: "4px solid rgba(255,255,255,0.1)",
    objectFit: "cover",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: "-5px",
    right: "-5px",
    width: "20px",
    height: "20px",
    background: "#4ADE80",
    border: "4px solid #1A1A2E",
    borderRadius: "50%",
  },
  headerText: {
    flex: 1,
  },
  h1: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "28px",
    margin: "0 0 4px 0",
    letterSpacing: "-0.5px",
  },
  sub: {
    fontSize: "15px",
    color: "rgba(255,255,255,0.7)",
    margin: 0,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(197, 112, 58, 0.2)",
    border: "1px solid rgba(197, 112, 58, 0.4)",
    borderRadius: "20px",
    padding: "4px 12px",
    fontSize: "10px",
    fontWeight: "700",
    color: "#C5703A",
    textTransform: "uppercase",
    marginBottom: "12px",
  },
  badgeDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#C5703A",
  },
  grid: {
    padding: "40px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "30px",
    background: "#fff",
  },
  infoBox: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },
  iconContainer: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "#FAFAF9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#1A1A2E",
    border: "1px solid #E8E4E0",
  },
  label: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    margin: "0 0 2px 0",
  },
  value: {
    fontSize: "15px",
    fontWeight: "500",
    color: "#1A1A2E",
    margin: 0,
  },
  footer: {
    padding: "30px 40px",
    borderTop: "1px solid #F0EDE8",
    background: "#FAFAF9",
  },
  roleHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "15px",
  },
  roleList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  roleBadge: {
    background: "#1A1A2E",
    color: "#fff",
    padding: "6px 14px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
  },
  loadingContainer: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#F0EDE8",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #E8E4E0",
    borderTopColor: "#C5703A",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  }
};

export default Profile;

