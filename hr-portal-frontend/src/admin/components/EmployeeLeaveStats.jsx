import { useMemo, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const STATUS = [
  { key: "applied",  label: "Applied",  color: "#3B82F6", bg: "#EFF6FF", border: "#BFDBFE" },
  { key: "approved", label: "Approved", color: "#10B981", bg: "#F0FDF4", border: "#BBF7D0" },
  { key: "pending",  label: "Pending",  color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A" },
  { key: "rejected", label: "Rejected", color: "#EF4444", bg: "#FFF1F2", border: "#FECDD3" },
];

const AVATAR_COLORS = [
  ["#EFF6FF", "#2563EB"], ["#F0FDF4", "#16A34A"],
  ["#FAF5FF", "#7C3AED"], ["#FFFBEB", "#D97706"],
  ["#FFF1F2", "#E11D48"], ["#ECFEFF", "#0891B2"],
];

function Avatar({ name, index }) {
  const initials = name
    ? name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";
  const [bg, text] = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <div style={{
      width: 30, height: 30, borderRadius: "50%",
      background: bg, color: text,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 11, fontWeight: 700, flexShrink: 0,
      border: `1.5px solid ${text}22`,
    }}>
      {initials}
    </div>
  );
}

function MiniBar({ value, max, color }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: "#F3F4F6", borderRadius: 99, overflow: "hidden", minWidth: 60 }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: color, borderRadius: 99,
          transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
        }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 20, textAlign: "right" }}>
        {value}
      </span>
    </div>
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

export default function EmployeeLeaveStats({ data = [], loading }) {
  const [sortKey, setSortKey] = useState("applied");
  const [sortDir, setSortDir] = useState("desc");
  const [search, setSearch] = useState("");

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const maxValues = useMemo(() => {
    const max = {};
    STATUS.forEach(({ key }) => {
      max[key] = Math.max(...data.map((d) => d[key] || 0), 1);
    });
    return max;
  }, [data]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter((d) => d.employeeName?.toLowerCase().includes(q));
  }, [data, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = sortKey === "employeeName" ? a.employeeName : (a[sortKey] ?? 0);
      const bv = sortKey === "employeeName" ? b.employeeName : (b[sortKey] ?? 0);
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [filtered, sortKey, sortDir]);

  const COLS = [
    { key: "employeeName", label: "Employee",  sortable: true },
    { key: "applied",      label: "Applied",   sortable: true },
    { key: "approved",     label: "Approved",  sortable: true },
    { key: "pending",      label: "Pending",   sortable: true },
    { key: "rejected",     label: "Rejected",  sortable: true },
    { key: "rate",         label: "Approval %", sortable: false },
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
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        flexWrap: "wrap",
      }}>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#111827", letterSpacing: "-0.2px" }}>
            Employee-wise Leave Stats
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9CA3AF" }}>
            {data.length} employees · click column to sort
          </p>
        </div>

        {/* Search */}
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search employee…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "7px 12px 7px 32px",
              fontSize: 12, color: "#111827",
              background: "#F9FAFB", border: "1px solid #E5E7EB",
              borderRadius: 8, outline: "none",
              width: 200, fontFamily: "inherit",
            }}
            onFocus={(e) => { e.target.style.borderColor = "#2563EB"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
            onBlur={(e) => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }}
          />
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#9CA3AF" }}>⌕</span>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #F0F0F0" }}>
              {COLS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  style={{
                    padding: "10px 16px", textAlign: "left",
                    fontSize: 11, fontWeight: 600, color: "#6B7280",
                    letterSpacing: "0.4px", textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    cursor: col.sortable ? "pointer" : "default",
                    userSelect: "none",
                  }}
                >
                  {col.label}
                  {col.sortable && <SortIcon active={sortKey === col.key} dir={sortDir} />}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #F9FAFB" }}>
                  {COLS.map((c) => (
                    <td key={c.key} style={{ padding: "14px 16px" }}>
                      <div style={{ height: 12, borderRadius: 6, background: "#F3F4F6", width: c.key === "employeeName" ? 140 : 60 }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "48px 20px", textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: 13, color: "#9CA3AF" }}>
                    {search ? `No employees matching "${search}"` : "No data available"}
                  </p>
                </td>
              </tr>
            ) : (
              sorted.map((e, i) => {
                const approvalRate = e.applied > 0
                  ? Math.round((e.approved / e.applied) * 100)
                  : 0;
                const rateColor = approvalRate >= 80 ? "#10B981" : approvalRate >= 50 ? "#F59E0B" : "#EF4444";

                return (
                  <tr
                    key={e.employeeId}
                    onMouseEnter={(el) => el.currentTarget.style.background = "#FAFAFA"}
                    onMouseLeave={(el) => el.currentTarget.style.background = "transparent"}
                    style={{ borderBottom: i < sorted.length - 1 ? "1px solid #F9FAFB" : "none", transition: "background 0.1s" }}
                  >
                    {/* Employee */}
                    <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar name={e.employeeName} index={i} />
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, color: "#111827", fontSize: 12 }}>
                            {e.employeeName}
                          </p>
                          <p style={{ margin: 0, fontSize: 10, color: "#9CA3AF" }}>ID #{e.employeeId}</p>
                        </div>
                      </div>
                    </td>

                    {/* Applied, Approved, Pending, Rejected — each with mini bar */}
                    {STATUS.map(({ key, color }) => (
                      <td key={key} style={{ padding: "12px 16px", minWidth: 120 }}>
                        <MiniBar value={e[key] || 0} max={maxValues[key]} color={color} />
                      </td>
                    ))}

                    {/* Approval rate */}
                    <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                      <span style={{
                        fontSize: 12, fontWeight: 700,
                        color: rateColor,
                        background: rateColor === "#10B981" ? "#F0FDF4" : rateColor === "#F59E0B" ? "#FFFBEB" : "#FFF1F2",
                        border: `1px solid ${rateColor === "#10B981" ? "#BBF7D0" : rateColor === "#F59E0B" ? "#FDE68A" : "#FECDD3"}`,
                        borderRadius: 6, padding: "3px 8px",
                      }}>
                        {approvalRate}%
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}