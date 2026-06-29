import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Add this for navigation
import { ToastContainer, toast } from "react-toastify";
import { Calendar, CheckCircle, Clock, XCircle, Filter, Plus, Search } from "lucide-react";
import API from "../../services/api"; 
import SearchBar from "../component/SearchBar";

function LeaveRequest() {
  const navigate = useNavigate(); // Hook for navigation
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("appliedOn");
  const [sortDir, setSortDir] = useState("desc");
  const [cancelingId, setCancelingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({ total: 0, approved: 0, rejected: 0, pending: 0 });

  const fetchLeaveStats = async () => {
    try {
      const res = await API.get("/leaves/my-leave-stats");
      setStats(res.data);
    } catch (err) {
      toast.error("Failed to load leave stats");
    }
  };

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await API.get(
        `/leaves/my-leaves?page=${page}&size=10&sortBy=${sortBy}&sortDir=${sortDir}&search=${searchTerm}`
      );
      setLeaves(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error("Failed to load leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveStats();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchLeaves();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, page, sortBy, sortDir]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "APPROVED": return { bg: "#E6F4EA", color: "#1E7E34", icon: <CheckCircle size={14} /> };
      case "REJECTED": return { bg: "#FCE8E6", color: "#D93025", icon: <XCircle size={14} /> };
      case "CANCELLED": return { bg: "#F1F3F4", color: "#5F6368", icon: <Clock size={14} /> };
      default: return { bg: "#FFF4E5", color: "#B05E27", icon: <Clock size={14} /> };
    }
  };

  const cancelLeave = async (leaveId) => {
    if (!window.confirm("Are you sure you want to cancel this leave?")) return;
    setCancelingId(leaveId);
    try {
      await API.delete(`/leaves/cancel/${leaveId}`);
      toast.success("Leave cancelled successfully");
      fetchLeaves();
      fetchLeaveStats();
    } catch (err) {
      toast.error(err.response?.data || "Failed to cancel leave");
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <div style={styles.page}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Stats Section */}
      <div style={styles.statsGrid}>
        <StatCard label="Total Requests" value={stats.total} icon={<Calendar size={20} color="#1A1A2E" />} />
        <StatCard label="Approved" value={stats.approved} icon={<CheckCircle size={20} color="#1E7E34" />} />
        <StatCard label="Pending" value={stats.pending} icon={<Clock size={20} color="#B05E27" />} />
        <StatCard label="Rejected" value={stats.rejected} icon={<XCircle size={20} color="#D93025" />} />
      </div>

      <div style={styles.mainCard}>
        <div style={styles.cardHeader}>
          <div>
            <h2 style={styles.h2}>My Leave History</h2>
            <p style={styles.subText}>View and manage your time-off requests</p>
          </div>
          <button 
            style={styles.btnPrimary} 
            onClick={() => navigate("/user/leave-apply")} // Simple navigation
          >
            <Plus size={18} /> Apply Leave
          </button>
        </div>

        <div style={styles.filterBar}>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <div style={styles.sortWrapper}>
            <Filter size={16} color="#888" />
            <span style={styles.sortLabel}>Sort By:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.select}>
              <option value="appliedOn">Applied On</option>
              <option value="startDate">Start Date</option>
              <option value="endDate">End Date</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.theadRow}>
                <th style={styles.th}>Applied On</th>
                <th style={styles.th}>Period</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Reason</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={styles.tdCenter}>Loading records...</td></tr>
              ) : leaves.length === 0 ? (
                <tr><td colSpan="6" style={styles.tdCenter}>No leave records found.</td></tr>
              ) : (
                leaves.map((leave) => {
                  const status = getStatusStyle(leave.status);
                  return (
                    <tr key={leave.leaveId} style={styles.tr}>
                      <td style={styles.td}>{leave.appliedOn}</td>
                      <td style={styles.td}>
                         <div style={{fontSize: '13px', fontWeight: '600', color: '#1A1A2E'}}>{leave.startDate}</div>
                         <div style={{fontSize: '11px', color: '#888'}}>to {leave.endDate}</div>
                      </td>
                      <td style={styles.td}><span style={styles.typeText}>{leave.leaveType}</span></td>
                      <td style={{...styles.td, maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{leave.reason}</td>
                      <td style={styles.td}>
                        <span style={{...styles.statusBadge, backgroundColor: status.bg, color: status.color}}>
                          {status.icon} {leave.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {leave.status === "PENDING" && (
                          <button 
                            onClick={() => cancelLeave(leave.leaveId)}
                            disabled={cancelingId === leave.leaveId}
                            style={styles.cancelBtn}
                          >
                            {cancelingId === leave.leaveId ? "..." : "Cancel"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={styles.pagination}>
          <button disabled={page === 0} onClick={() => setPage(page - 1)} style={styles.pageBtn}>Prev</button>
          <span style={styles.pageInfo}>Page {page + 1} of {totalPages}</span>
          <button disabled={page + 1 === totalPages} onClick={() => setPage(page + 1)} style={styles.pageBtn}>Next</button>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ label, value, icon }) => (
  <div style={styles.statCard}>
    <div style={styles.statIcon}>{icon}</div>
    <div>
      <p style={styles.statLabel}>{label}</p>
      <h3 style={styles.statValue}>{value}</h3>
    </div>
  </div>
);

const styles = {
  page: { padding: "30px", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "30px" },
  statCard: { background: "#fff", padding: "20px", borderRadius: "16px", display: "flex", alignItems: "center", gap: "15px", border: "1px solid #E8E4E0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" },
  statIcon: { width: "44px", height: "44px", borderRadius: "12px", background: "#F8F9FA", display: "flex", alignItems: "center", justifyContent: "center" },
  statLabel: { fontSize: "11px", color: "#888", margin: 0, fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" },
  statValue: { fontSize: "24px", color: "#1A1A2E", margin: 0, fontWeight: "800" },
  mainCard: { background: "#fff", borderRadius: "24px", padding: "30px", border: "1px solid #E8E4E0", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  h2: { fontFamily: "'Sora', sans-serif", fontSize: "22px", color: "#1A1A2E", margin: 0 },
  subText: { fontSize: "13px", color: "#888", margin: "4px 0 0 0" },
  btnPrimary: { background: "#1A1A2E", color: "#fff", padding: "10px 22px", borderRadius: "10px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", fontSize: "14px", boxShadow: "0 4px 10px rgba(26,26,46,0.2)" },
  filterBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", gap: "20px", flexWrap: "wrap" },
  sortWrapper: { display: "flex", alignItems: "center", gap: "10px" },
  sortLabel: { fontSize: "13px", fontWeight: "600", color: "#444" },
  select: { padding: "8px 12px", borderRadius: "8px", border: "1px solid #E8E4E0", outline: "none", fontSize: "13px", background: "#FAFAF9" },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  theadRow: { borderBottom: "2px solid #F0EDE8" },
  th: { padding: "15px", textAlign: "left", fontSize: "11px", textTransform: "uppercase", color: "#888", fontWeight: "700", letterSpacing: "0.5px" },
  tr: { borderBottom: "1px solid #F8F9FA" },
  td: { padding: "15px", fontSize: "14px", color: "#444" },
  tdCenter: { padding: "40px", textAlign: "center", color: "#888" },
  statusBadge: { padding: "6px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "800", display: "inline-flex", alignItems: "center", gap: "6px" },
  cancelBtn: { padding: "6px 14px", borderRadius: "8px", border: "1px solid #FCE8E6", background: "#FFF1F0", color: "#D93025", fontSize: "12px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s" },
  typeText: { fontWeight: "700", color: "#1A1A2E" },
  pagination: { marginTop: "25px", display: "flex", justifyContent: "center", alignItems: "center", gap: "15px" },
  pageBtn: { padding: "8px 18px", borderRadius: "10px", border: "1px solid #E8E4E0", background: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
  pageInfo: { fontSize: "13px", color: "#888", fontWeight: "600" }
};

export default LeaveRequest;
