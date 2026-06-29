import React, { memo } from "react";
import { formatDistanceToNow } from "date-fns";
import { useRecentActivities } from "../hooks/useRecentActivities";

const ACTION_CONFIG = {
  CREATE:     { label: "Created",     color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", dot: "#10B981" },
  UPDATE:     { label: "Updated",     color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", dot: "#3B82F6" },
  DELETE:     { label: "Deleted",     color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", dot: "#EF4444" },
  REACTIVATE: { label: "Reactivated", color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", dot: "#10B981" },
  DEACTIVATE: { label: "Deactivated", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", dot: "#F59E0B" },
};

const DEFAULT_ACTION = { label: "Action", color: "#6B7280", bg: "#F9FAFB", border: "#E5E7EB", dot: "#9CA3AF" };

function RecentActivities() {
  const { activities, page, totalPages, loading, setPage } = useRecentActivities();

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      border: "1px solid #F0F0F0",
      boxShadow: "0 1px 12px rgba(0,0,0,0.05)",
      overflow: "hidden",
      fontFamily: "inherit",
      height: "100%",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* Header */}
      <div style={{
        padding: "18px 20px 14px",
        borderBottom: "1px solid #F9FAFB",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#111827", letterSpacing: "-0.2px" }}>
            Recent Activities
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9CA3AF" }}>
            Latest actions across the system
          </p>
        </div>
        {!loading && (
          <span style={{
            fontSize: 11, fontWeight: 600, color: "#6B7280",
            background: "#F9FAFB", border: "1px solid #E5E7EB",
            borderRadius: 6, padding: "3px 8px",
          }}>
            Page {page + 1} / {totalPages || 1}
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        {loading ? (
          <div style={{ padding: "32px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#F3F4F6" }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ height: 11, width: "60%", background: "#F3F4F6", borderRadius: 4 }} />
                  <div style={{ height: 10, width: "40%", background: "#F9FAFB", borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        ) : !activities.length ? (
          <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 13, color: "#9CA3AF" }}>No recent activity found</p>
          </div>
        ) : (
          <div style={{ padding: "8px 0" }}>
            {activities.map((a, index) => {
              const cfg = ACTION_CONFIG[a.action] || DEFAULT_ACTION;
              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "10px 20px",
                    borderBottom: index < activities.length - 1 ? "1px solid #F9FAFB" : "none",
                    transition: "background 0.1s",
                    cursor: "default",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {/* Dot avatar */}
                  <div style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: cfg.bg, border: `1.5px solid ${cfg.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: 1,
                  }}>
                    <div style={{
                      width: 9, height: 9, borderRadius: "50%", background: cfg.dot,
                    }} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2, flexWrap: "wrap" }}>
                      {/* Action badge */}
                      <span style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: "0.4px",
                        color: cfg.color, background: cfg.bg,
                        border: `1px solid ${cfg.border}`,
                        borderRadius: 5, padding: "2px 7px",
                        textTransform: "uppercase", whiteSpace: "nowrap",
                      }}>
                        {cfg.label}
                      </span>
                      {/* Performed by */}
                      <span style={{
                        fontSize: 12, fontWeight: 600, color: "#111827",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {a.performedBy}
                      </span>
                    </div>
                    {/* Details */}
                    <p style={{
                      margin: 0, fontSize: 11, color: "#6B7280",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {a.details}
                    </p>
                  </div>

                  {/* Timestamp */}
                  <span style={{
                    fontSize: 11, color: "#9CA3AF", whiteSpace: "nowrap",
                    flexShrink: 0, marginTop: 2,
                  }}>
                    {formatDistanceToNow(new Date(a.timestamp), { addSuffix: true })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination footer */}
      <div style={{
        borderTop: "1px solid #F3F4F6",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}>
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          style={{
            fontSize: 12, fontWeight: 500,
            padding: "5px 14px", borderRadius: 8,
            border: "1px solid #E5E7EB",
            background: page === 0 ? "#F9FAFB" : "#fff",
            color: page === 0 ? "#9CA3AF" : "#374151",
            cursor: page === 0 ? "not-allowed" : "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { if (page > 0) e.currentTarget.style.background = "#F9FAFB"; }}
          onMouseLeave={e => { if (page > 0) e.currentTarget.style.background = "#fff"; }}
        >
          ← Previous
        </button>

        {/* Page dots */}
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const isActive = i === page;
            return (
              <button
                key={i}
                onClick={() => setPage(i)}
                style={{
                  width: isActive ? 20 : 7, height: 7,
                  borderRadius: 99, border: "none",
                  background: isActive ? "#3B82F6" : "#E5E7EB",
                  cursor: "pointer", padding: 0,
                  transition: "all 0.2s",
                }}
              />
            );
          })}
          {totalPages > 7 && (
            <span style={{ fontSize: 11, color: "#9CA3AF" }}>+{totalPages - 7}</span>
          )}
        </div>

        <button
          disabled={page === totalPages - 1 || totalPages === 0}
          onClick={() => setPage(page + 1)}
          style={{
            fontSize: 12, fontWeight: 500,
            padding: "5px 14px", borderRadius: 8,
            border: "1px solid #E5E7EB",
            background: (page === totalPages - 1 || totalPages === 0) ? "#F9FAFB" : "#fff",
            color: (page === totalPages - 1 || totalPages === 0) ? "#9CA3AF" : "#374151",
            cursor: (page === totalPages - 1 || totalPages === 0) ? "not-allowed" : "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { if (page < totalPages - 1) e.currentTarget.style.background = "#F9FAFB"; }}
          onMouseLeave={e => { if (page < totalPages - 1) e.currentTarget.style.background = "#fff"; }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default memo(RecentActivities);