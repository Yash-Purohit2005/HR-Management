import { memo } from "react";
import { CheckCircle2, Clock, XCircle, LayoutList } from "lucide-react";

const CARDS = [
  {
    key: "total",
    label: "Total Requests",
    icon: LayoutList,
    color: { bg: "#EFF6FF", icon: "#2563EB", border: "#BFDBFE", text: "#2563EB", bar: "#DBEAFE" },
  },
  {
    key: "approved",
    label: "Approved",
    icon: CheckCircle2,
    color: { bg: "#F0FDF4", icon: "#16A34A", border: "#BBF7D0", text: "#16A34A", bar: "#DCFCE7" },
  },
  {
    key: "pending",
    label: "Pending",
    icon: Clock,
    color: { bg: "#FFFBEB", icon: "#D97706", border: "#FDE68A", text: "#D97706", bar: "#FEF3C7" },
  },
  {
    key: "rejected",
    label: "Rejected",
    icon: XCircle,
    color: { bg: "#FFF1F2", icon: "#E11D48", border: "#FECDD3", text: "#E11D48", bar: "#FFE4E6" },
  },
];

function LeaveStatsCards({ stats, loading }) {
  if (loading) {
    return (
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16,
      }}>
        {CARDS.map((_, i) => (
          <div key={i} style={{
            background: "#fff", borderRadius: 16,
            border: "1px solid #F0F0F0", padding: "20px",
            height: 110,
            background: "linear-gradient(90deg, #F9FAFB 25%, #F3F4F6 50%, #F9FAFB 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
          }} />
        ))}
        <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: 16,
    }}>
      {CARDS.map(({ key, label, icon: Icon, color }) => {
        const value = stats?.[key] ?? 0;
        const total = stats?.total || 1;
        const pct = Math.min(100, Math.round((value / total) * 100));

        return (
          <div
            key={key}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.10)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 1px 12px rgba(0,0,0,0.05)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
            style={{
              background: "#fff", borderRadius: 16,
              border: "1px solid #F0F0F0",
              boxShadow: "0 1px 12px rgba(0,0,0,0.05)",
              padding: "20px 20px 18px",
              display: "flex", flexDirection: "column", gap: 14,
              transition: "all 0.18s ease", cursor: "default",
              fontFamily: "inherit",
            }}
          >
            {/* Top row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#6B7280" }}>{label}</p>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: color.bg, border: `1px solid ${color.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: color.icon, flexShrink: 0,
              }}>
                <Icon size={17} strokeWidth={2} />
              </div>
            </div>

            {/* Value */}
            <h2 style={{
              margin: 0, fontSize: 32, fontWeight: 800,
              color: color.text, letterSpacing: "-1px", lineHeight: 1,
            }}>
              {value.toLocaleString()}
            </h2>

            {/* Progress bar */}
            <div style={{ height: 4, borderRadius: 99, background: color.bar, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${key === "total" ? 100 : pct}%`,
                background: color.icon, borderRadius: 99,
                transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
              }} />
            </div>

            {/* Percentage label (skip for total) */}
            {key !== "total" && (
              <p style={{ margin: "-8px 0 0", fontSize: 11, color: "#9CA3AF" }}>
                {pct}% of total requests
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default memo(LeaveStatsCards);