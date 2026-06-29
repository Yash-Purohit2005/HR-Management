import { memo } from "react";
import { Users, UserCheck, UserX, Building2 } from "lucide-react";

const CARDS = [
  {
    key: "totalEmployees",
    label: "Total Employees",
    icon: Users,
    color: { bg: "#EFF6FF", icon: "#2563EB", border: "#BFDBFE", text: "#2563EB", trend: "#DBEAFE" },
  },
  {
    key: "activeEmployees",
    label: "Active Employees",
    icon: UserCheck,
    color: { bg: "#F0FDF4", icon: "#16A34A", border: "#BBF7D0", text: "#16A34A", trend: "#DCFCE7" },
  },
  {
    key: "inactiveEmployees",
    label: "Inactive Employees",
    icon: UserX,
    color: { bg: "#FFF1F2", icon: "#E11D48", border: "#FECDD3", text: "#E11D48", trend: "#FFE4E6" },
  },
  {
    key: "totalDepartment",
    label: "Total Departments",
    icon: Building2,
    color: { bg: "#FAF5FF", icon: "#7C3AED", border: "#DDD6FE", text: "#7C3AED", trend: "#EDE9FE" },
  },
];

function StatsCards({ stats }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: 16,
    }}>
      {CARDS.map(({ key, label, icon: Icon, color }) => {
        const value = stats?.[key] ?? "—";
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
              background: "#fff",
              borderRadius: 16,
              border: `1px solid #F0F0F0`,
              boxShadow: "0 1px 12px rgba(0,0,0,0.05)",
              padding: "20px 20px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              transition: "all 0.18s ease",
              fontFamily: "inherit",
              cursor: "default",
            }}
          >
            {/* Top row: label + icon */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{
                margin: 0, fontSize: 12, fontWeight: 600,
                color: "#6B7280", letterSpacing: "0.2px",
              }}>
                {label}
              </p>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: color.bg,
                border: `1px solid ${color.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: color.icon, flexShrink: 0,
              }}>
                <Icon size={17} strokeWidth={2} />
              </div>
            </div>

            {/* Value */}
            <div>
              <h2 style={{
                margin: 0,
                fontSize: 32,
                fontWeight: 800,
                color: color.text,
                letterSpacing: "-1px",
                lineHeight: 1,
              }}>
                {typeof value === "number" ? value.toLocaleString() : value}
              </h2>
            </div>

            {/* Bottom bar accent */}
            <div style={{
              height: 4, borderRadius: 99,
              background: color.trend,
              overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                width: stats?.totalEmployees
                  ? `${Math.min(100, ((stats[key] ?? 0) / stats.totalEmployees) * 100)}%`
                  : "100%",
                background: color.icon,
                borderRadius: 99,
                transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default memo(StatsCards);