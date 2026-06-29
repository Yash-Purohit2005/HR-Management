import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Users, Search, Filter, ArrowUpDown, UserCheck } from "lucide-react";

const ACTIONS = [
  {
    title: "Add Employee",
    description: "Create a new employee record",
    icon: PlusCircle,
    color: { bg: "#EFF6FF", icon: "#2563EB", border: "#BFDBFE", hover: "#DBEAFE" },
    badge: "New",
    badgeColor: { bg: "#EFF6FF", text: "#1D4ED8" },
  },
  {
    title: "View All",
    description: "Browse all employees",
    icon: Users,
    color: { bg: "#F0FDF4", icon: "#16A34A", border: "#BBF7D0", hover: "#DCFCE7" },
  },
  {
    title: "Search",
    description: "Find by name, email or dept",
    icon: Search,
    color: { bg: "#FAF5FF", icon: "#7C3AED", border: "#DDD6FE", hover: "#EDE9FE" },
  },
  {
    title: "Filter",
    description: "Filter by department or role",
    icon: Filter,
    color: { bg: "#FFFBEB", icon: "#D97706", border: "#FDE68A", hover: "#FEF3C7" },
  },
  {
    title: "Sort",
    description: "Sort by joining date",
    icon: ArrowUpDown,
    color: { bg: "#FFF1F2", icon: "#E11D48", border: "#FECDD3", hover: "#FFE4E6" },
  },
  {
    title: "Status",
    description: "Filter active or inactive",
    icon: UserCheck,
    color: { bg: "#ECFEFF", icon: "#0891B2", border: "#A5F3FC", hover: "#CFFAFE" },
  },
];

function QuickActions({ setQuery }) {
  const navigate = useNavigate();

  const handlers = [
    () => navigate("/admin/employees/new"),
    () => setQuery({}),
    () => {
      const keyword = prompt("Enter name, email, or department");
      if (keyword) setQuery((prev) => ({ ...prev, keyword }));
    },
    () => {
      const department = prompt("Enter department to filter");
      const designation = prompt("Enter designation to filter");
      setQuery((prev) => ({ ...prev, department, designation }));
    },
    () => {
      const direction = prompt("Sort direction: asc or desc", "asc");
      if (direction) setQuery((prev) => ({ ...prev, sort: "joiningDate", sortDirection: direction }));
    },
    () => {
      const status = prompt("Enter status: active or inactive");
      if (status) {
        const active = status.toLowerCase() === "active";
        setQuery((prev) => ({ ...prev, active }));
      }
    },
  ];

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      border: "1px solid #F0F0F0",
      boxShadow: "0 1px 12px rgba(0,0,0,0.05)",
      overflow: "hidden",
      fontFamily: "inherit",
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
            Quick Actions
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9CA3AF" }}>
            Manage your employee data
          </p>
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.5px",
          color: "#6B7280", background: "#F9FAFB",
          border: "1px solid #E5E7EB", borderRadius: 6,
          padding: "3px 8px",
        }}>
          6 actions
        </span>
      </div>

      {/* Grid — always 3 cols × 2 rows */}
      <div style={{ padding: 16 }}>
        {/* Row 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
          {ACTIONS.slice(0, 3).map((action, index) => (
            <ActionCard key={index} action={action} onClick={handlers[index]} />
          ))}
        </div>
        {/* Row 2 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {ACTIONS.slice(3, 6).map((action, index) => (
            <ActionCard key={index + 3} action={action} onClick={handlers[index + 3]} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ActionCard({ action, onClick }) {
  const Icon = action.icon;
  const c = action.color;

  return (
    <button
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = c.hover;
        e.currentTarget.style.borderColor = c.icon + "55";
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = c.bg;
        e.currentTarget.style.borderColor = c.border;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 10,
        padding: "14px 14px 12px",
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 12,
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.15s ease",
        position: "relative",
        width: "100%",
      }}
    >
      {/* Badge */}
      {action.badge && (
        <span style={{
          position: "absolute", top: 10, right: 10,
          fontSize: 9, fontWeight: 700, letterSpacing: "0.5px",
          textTransform: "uppercase",
          color: action.badgeColor.text,
          background: action.badgeColor.bg,
          border: `1px solid ${c.border}`,
          borderRadius: 4, padding: "1px 5px",
        }}>
          {action.badge}
        </span>
      )}

      {/* Icon */}
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: "#fff", border: `1px solid ${c.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: c.icon, flexShrink: 0,
      }}>
        <Icon size={17} strokeWidth={2} />
      </div>

      {/* Text */}
      <div>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#111827", letterSpacing: "-0.1px" }}>
          {action.title}
        </p>
        <p style={{ margin: "3px 0 0", fontSize: 11, color: "#6B7280", lineHeight: 1.4 }}>
          {action.description}
        </p>
      </div>
    </button>
  );
}

export default memo(QuickActions);