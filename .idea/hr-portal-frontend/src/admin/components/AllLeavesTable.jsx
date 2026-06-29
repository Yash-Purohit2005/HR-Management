import { useState } from "react";
import { ChevronUp, ChevronDown, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { useAllLeaves } from "../../services/admin-services/useAllLeaves";

const STATUS_CONFIG = {
  APPROVED:  { label: "Approved",  color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", dot: "#10B981" },
  PENDING:   { label: "Pending",   color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", dot: "#F59E0B" },
  REJECTED:  { label: "Rejected",  color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", dot: "#EF4444" },
  CANCELLED: { label: "Cancelled", color: "#6B7280", bg: "#F9FAFB", border: "#E5E7EB", dot: "#9CA3AF" },
};

const LEAVE_TYPE_COLORS = {
  SICK:      { bg: "#FFF1F2", text: "#E11D48", border: "#FECDD3" },
  CASUAL:    { bg: "#EFF6FF", text: "#2563EB", border: "#BFDBFE" },
  ANNUAL:    { bg: "#F0FDF4", text: "#16A34A", border: "#BBF7D0" },
  MATERNITY: { bg: "#FAF5FF", text: "#7C3AED", border: "#DDD6FE" },
  PATERNITY: { bg: "#ECFEFF", text: "#0891B2", border: "#A5F3FC" },
  EMERGENCY: { bg: "#FFFBEB", text: "#D97706", border: "#FDE68A" },
};

const DEFAULT_TYPE = { bg: "#F3F4F6", text: "#6B7280", border: "#E5E7EB" };

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 11, fontWeight: 600,
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
      borderRadius: 20, padding: "3px 10px", whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
      {cfg.label}
    </span>
  );
}

function LeaveTypeBadge({ type }) {
  const cfg = LEAVE_TYPE_COLORS[type] || DEFAULT_TYPE;
  return (
    <span style={{
      fontSize: 11, fontWeight: 600,
      color: cfg.text, background: cfg.bg, border: `1px solid ${cfg.border}`,
      borderRadius: 6, padding: "3px 8px", whiteSpace: "nowrap",
    }}>
      {type}
    </span>
  );
}

function SortIcon({ active, dir }) {
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", marginLeft: 4, verticalAlign: "middle", opacity: active ? 1 : 0.3 }}>
      <ChevronUp size={10} style={{ marginBottom: -3, color: active && dir === "asc" ? "#2563EB" : "#9CA3AF" }} />
      <ChevronDown size={10} style={{ color: active && dir === "desc" ? "#2563EB" : "#9CA3AF" }} />
    </span>
  );
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function daysBetween(start, end) {
  if (!start || !end) return 0;
  return Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1;
}

const btnBase = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  minWidth: 32, height: 32, borderRadius: 8,
  border: "1px solid #E5E7EB", background: "#fff", color: "#374151",
  cursor: "pointer", transition: "all 0.15s", padding: "0 6px",
};

const COLS = [
  { key: "leaveId",      label: "ID",         sortable: false },
  { key: "employeeName", label: "Employee",    sortable: false },
  { key: "leaveType",    label: "Type",        sortable: false },
  { key: "startDate",    label: "Start",       sortable: true  },
  { key: "endDate",      label: "End",         sortable: true  },
  { key: "days",         label: "Days",        sortable: false },
  { key: "appliedOn",    label: "Applied On",  sortable: true  },
  { key: "status",       label: "Status",      sortable: false },
  { key: "actions",      label: "Actions",     sortable: false },
];

// ── Component ──────────────────────────────────────────────────────────────
// onStatusChange: called after approve/reject so LeaveHome can refresh
// stats cards, monthly trend, etc.
export default function AllLeavesTable({ onStatusChange }) {
  const { pageData, loading, page, setPage, sortBy, setSortBy, sortDir, setSortDir, updateStatus }
    = useAllLeaves(10, onStatusChange);

  const [loadingId, setLoadingId] = useState(null);

  const leaves = pageData?.content || [];
  const totalPages = pageData?.totalPages || 0;
  const totalElements = pageData?.totalElements || 0;

  const handleSort = (key) => {
    if (sortBy === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(key); setSortDir("desc"); }
  };

  const handleStatusUpdate = async (leaveId, status) => {
    setLoadingId(leaveId);
    try {
      await updateStatus(leaveId, status); // ← this calls onStatusChange internally
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div style={{
      background: "#fff", borderRadius: 16,
      border: "1px solid #F0F0F0",
      boxShadow: "0 1px 12px rgba(0,0,0,0.05)",
      overflow: "hidden", fontFamily: "inherit",
    }}>

      {/* Header */}
      <div style={{
        padding: "18px 20px 14px", borderBottom: "1px solid #F9FAFB",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#111827", letterSpacing: "-0.2px" }}>
            All Leave Requests
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9CA3AF" }}>
            {totalElements.toLocaleString()} total · page {page + 1} of {totalPages || 1}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["PENDING", "APPROVED", "REJECTED"].map((s) => {
            const cfg = STATUS_CONFIG[s];
            return (
              <span key={s} style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.4px",
                color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
                borderRadius: 6, padding: "3px 8px", textTransform: "uppercase",
              }}>
                {cfg.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", position: "relative" }}>
        {loading && (
          <div style={{
            position: "absolute", inset: 0, background: "rgba(255,255,255,0.7)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10,
          }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", border: "3px solid #E5E7EB", borderTopColor: "#2563EB", animation: "spin 0.7s linear infinite" }} />
          </div>
        )}

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #F0F0F0" }}>
              {COLS.map((col) => (
                <th key={col.key} onClick={() => col.sortable && handleSort(col.key)}
                  style={{
                    padding: "10px 16px", textAlign: "left",
                    fontSize: 11, fontWeight: 600, color: "#6B7280",
                    letterSpacing: "0.4px", textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    cursor: col.sortable ? "pointer" : "default", userSelect: "none",
                  }}
                >
                  {col.label}
                  {col.sortable && <SortIcon active={sortBy === col.key} dir={sortDir} />}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {leaves.length === 0 && !loading ? (
              <tr>
                <td colSpan={9} style={{ padding: "48px 20px", textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: 13, color: "#9CA3AF" }}>No leave requests found</p>
                </td>
              </tr>
            ) : (
              leaves.map((leave, i) => (
                <tr key={leave.leaveId}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#FAFAFA"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  style={{ borderBottom: i < leaves.length - 1 ? "1px solid #F9FAFB" : "none", transition: "background 0.1s" }}
                >
                  <td style={{ padding: "12px 16px", color: "#9CA3AF", fontWeight: 500 }}>#{leave.leaveId}</td>
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap", fontWeight: 600, color: "#111827" }}>
                    {leave.employeeName || "—"}
                  </td>
                  <td style={{ padding: "12px 16px" }}><LeaveTypeBadge type={leave.leaveType} /></td>
                  <td style={{ padding: "12px 16px", color: "#6B7280", whiteSpace: "nowrap" }}>{formatDate(leave.startDate)}</td>
                  <td style={{ padding: "12px 16px", color: "#6B7280", whiteSpace: "nowrap" }}>{formatDate(leave.endDate)}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#374151", background: "#F3F4F6", border: "1px solid #E5E7EB", borderRadius: 6, padding: "3px 8px" }}>
                      {daysBetween(leave.startDate, leave.endDate)}d
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#6B7280", whiteSpace: "nowrap" }}>{formatDate(leave.appliedOn)}</td>
                  <td style={{ padding: "12px 16px" }}><StatusBadge status={leave.status} /></td>
                  <td style={{ padding: "12px 16px" }}>
                    {leave.status === "PENDING" ? (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          disabled={loadingId === leave.leaveId}
                          onClick={() => handleStatusUpdate(leave.leaveId, "APPROVED")}
                          onMouseEnter={(e) => e.currentTarget.style.background = "#DCFCE7"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "#F0FDF4"}
                          style={{
                            display: "flex", alignItems: "center", gap: 5,
                            fontSize: 11, fontWeight: 600, color: "#16A34A",
                            background: "#F0FDF4", border: "1px solid #BBF7D0",
                            borderRadius: 7, padding: "5px 10px",
                            cursor: loadingId === leave.leaveId ? "not-allowed" : "pointer",
                            opacity: loadingId === leave.leaveId ? 0.6 : 1,
                            transition: "background 0.15s",
                          }}
                        >
                          {loadingId === leave.leaveId
                            ? <div style={{ width: 11, height: 11, borderRadius: "50%", border: "2px solid #BBF7D0", borderTopColor: "#16A34A", animation: "spin 0.7s linear infinite" }} />
                            : <CheckCircle2 size={12} strokeWidth={2} />
                          }
                          Approve
                        </button>
                        <button
                          disabled={loadingId === leave.leaveId}
                          onClick={() => handleStatusUpdate(leave.leaveId, "REJECTED")}
                          onMouseEnter={(e) => e.currentTarget.style.background = "#FFE4E6"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "#FFF1F2"}
                          style={{
                            display: "flex", alignItems: "center", gap: 5,
                            fontSize: 11, fontWeight: 600, color: "#E11D48",
                            background: "#FFF1F2", border: "1px solid #FECDD3",
                            borderRadius: 7, padding: "5px 10px",
                            cursor: loadingId === leave.leaveId ? "not-allowed" : "pointer",
                            opacity: loadingId === leave.leaveId ? 0.6 : 1,
                            transition: "background 0.15s",
                          }}
                        >
                          {loadingId === leave.leaveId
                            ? <div style={{ width: 11, height: 11, borderRadius: "50%", border: "2px solid #FECDD3", borderTopColor: "#E11D48", animation: "spin 0.7s linear infinite" }} />
                            : <XCircle size={12} strokeWidth={2} />
                          }
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: 11, color: "#9CA3AF" }}>—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          borderTop: "1px solid #F3F4F6", padding: "12px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>
            Page <strong style={{ color: "#111827" }}>{page + 1}</strong> of{" "}
            <strong style={{ color: "#111827" }}>{totalPages}</strong>
          </p>
          <div style={{ display: "flex", gap: 4 }}>
            {[
              { icon: ChevronsLeft,  onClick: () => setPage(0),             disabled: page === 0 },
              { icon: ChevronLeft,   onClick: () => setPage(page - 1),      disabled: page === 0 },
              { icon: ChevronRight,  onClick: () => setPage(page + 1),      disabled: page >= totalPages - 1 },
              { icon: ChevronsRight, onClick: () => setPage(totalPages - 1), disabled: page >= totalPages - 1 },
            ].map(({ icon: Icon, onClick, disabled }, i) => (
              <button key={i} onClick={onClick} disabled={disabled}
                style={{ ...btnBase, opacity: disabled ? 0.35 : 1, cursor: disabled ? "not-allowed" : "pointer", background: disabled ? "#F9FAFB" : "#fff" }}
                onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = "#F3F4F6"; }}
                onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.background = "#fff"; }}
              >
                <Icon size={14} strokeWidth={2} />
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}