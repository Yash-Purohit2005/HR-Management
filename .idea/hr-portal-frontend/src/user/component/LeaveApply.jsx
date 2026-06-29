import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import API from "../../services/api";
import { toast } from "react-toastify";

function LeaveApply() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/leaves/apply", formData);
      toast.success("Leave applied successfully!");
      navigate("/user/leaves"); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.cardContainer}>
        {/* Header Row: Title and Button side-by-side */}
        <div style={styles.headerRow}>
          <div>
            <h2 style={styles.h2}>Apply for Leave</h2>
            <p style={styles.sub}>Fill in the details for manager approval</p>
          </div>
          
          <button onClick={() => navigate(-1)} style={styles.backBtnInline}>
            <ArrowLeft size={16} />
            <span>Back to List</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Leave Type</label>
            <select 
              style={styles.input} 
              required
              onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
            >
              <option value="">Select Type</option>
              <option value="SICK">Sick Leave</option>
              <option value="CASUAL">Casual Leave</option>
              <option value="EARNED">Earned Leave</option>
            </select>
          </div>

          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Start Date</label>
              <input 
                type="date" 
                style={styles.input} 
                required 
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>End Date</label>
              <input 
                type="date" 
                style={styles.input} 
                required 
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Reason</label>
            <textarea 
              style={styles.textarea} 
              placeholder="Briefly explain the reason..." 
              rows="4"
              required
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? "Processing..." : "Submit Application"}
            {!loading && <Send size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    paddingTop: "60px", // This moves the container down from the top
    paddingLeft: "20px",
    paddingRight: "20px"
  },
  cardContainer: { 
    width: "100%",
    maxWidth: "600px", 
    margin: "0 auto",
    background: "#ffffff", // Pure white card background
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)", // Subtle shadow for depth
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "1px solid #F0EDE8"
  },
  h2: { 
    fontFamily: "'Sora', sans-serif", 
    fontSize: "22px", 
    color: "#1A1A2E", 
    margin: 0 
  },
  sub: { 
    fontSize: "13px", 
    color: "#888", 
    margin: "4px 0 0 0" 
  },
  backBtnInline: { 
    display: "flex", 
    alignItems: "center", 
    gap: "8px", 
    background: "#F8F9FA", 
    border: "1px solid #E8E4E0", 
    color: "#1A1A2E", 
    padding: "8px 14px",
    borderRadius: "10px",
    fontSize: "13px", 
    fontWeight: "600", 
    cursor: "pointer"
  },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  row: { display: "flex", gap: "15px" },
  field: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { 
    fontSize: "11px", 
    fontWeight: "700", 
    color: "#1A1A2E", 
    textTransform: "uppercase", 
    display: "block" 
  },
  input: { 
    width: "100%", 
    padding: "12px", 
    borderRadius: "10px", 
    border: "1.5px solid #E8E4E0", 
    background: "#FAFAF9", 
    outline: "none",
    boxSizing: "border-box" 
  },
  textarea: { 
    width: "100%", 
    padding: "12px", 
    borderRadius: "10px", 
    border: "1.5px solid #E8E4E0", 
    background: "#FAFAF9", 
    outline: "none", 
    resize: "none",
    fontFamily: "inherit",
    boxSizing: "border-box"
  },
  submitBtn: { 
    background: "#1A1A2E", 
    color: "#fff", 
    border: "none", 
    padding: "15px", 
    borderRadius: "10px", 
    fontWeight: "700", 
    cursor: "pointer", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    gap: "10px", 
    marginTop: "10px" 
  }
};

export default LeaveApply;