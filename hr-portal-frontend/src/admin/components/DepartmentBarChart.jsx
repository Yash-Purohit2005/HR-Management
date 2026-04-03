import { useMemo, useState } from "react";

const PALETTE = [
  "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B",
  "#EF4444", "#06B6D4", "#EC4899", "#14B8A6",
  "#F97316", "#6366F1", "#84CC16", "#0EA5E9",
];

export default function DepartmentBarChart({ data }) {
  const [hovered, setHovered] = useState(null);

  const { chartData, total } = useMemo(() => {
    if (!data || data.length === 0) return { chartData: [], total: 0 };
    const total = data.reduce((s, d) => s + d.count, 0);
    const sorted = [...data].sort((a, b) => b.count - a.count);
    const max = sorted[0]?.count || 1;
    return {
      total,
      chartData: sorted.map((d, i) => ({
        ...d,
        color: PALETTE[i % PALETTE.length],
        percentage: total > 0 ? ((d.count / total) * 100).toFixed(1) : "0.0",
        widthPct: ((d.count / max) * 100).toFixed(1),
      })),
    };
  }, [data]);
  
  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      border: "1px solid #F0F0F0",
      boxShadow: "0 1px 12px rgba(0,0,0,0.05)",
      overflow: "hidden",
      fontFamily: "inherit",
      // ⬇️ CHANGED: Set to auto so the card stretches to fit all departments
      height: "auto", 
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
        flexShrink: 0,
      }}>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#111827", letterSpacing: "-0.2px" }}>
            Employees by Department
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9CA3AF" }}>
            {total.toLocaleString()} employees · {chartData.length} departments
          </p>
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.5px",
          color: "#059669", background: "#ECFDF5",
          border: "1px solid #A7F3D0", borderRadius: 6,
          padding: "3px 8px", textTransform: "uppercase",
        }}>
          Live
        </span>
      </div>

      {/* Bar list */}
      {/* ⬇️ CHANGED: Removed flex: 1, overflowY: "auto", and minHeight: 0 */}
      <div style={{
        padding: "12px 20px",
      }}>
        {!chartData.length ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 0" }}>
            <p style={{ margin: 0, fontSize: 13, color: "#9CA3AF" }}>No department data available</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {chartData.map((d, i) => (
              <div
                key={d.department}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  opacity: hovered === null || hovered === i ? 1 : 0.4,
                  transition: "opacity 0.15s",
                  cursor: "default",
                }}
              >
                {/* Label row */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: 6,
                  gap: 8,
                }}>
                  <span style={{
                    fontSize: 12, fontWeight: 600, color: "#374151",
                    overflow: "hidden", textOverflow: "ellipsis",
                    whiteSpace: "nowrap", flex: 1,
                  }}>
                    {d.department}
                  </span>
                  <span style={{ display: "flex", alignItems: "baseline", gap: 4, whiteSpace: "nowrap", flexShrink: 0 }}>
                    <strong style={{ fontSize: 13, fontWeight: 700, color: d.color }}>
                      {d.count.toLocaleString()}
                    </strong>
                    <span style={{ fontSize: 11, color: "#9CA3AF" }}>({d.percentage}%)</span>
                  </span>
                </div>

                {/* Bar track */}
                <div style={{
                  width: "100%", height: 8,
                  background: "#F3F4F6", borderRadius: 99, overflow: "hidden",
                }}>
                  <div style={{
                    width: `${d.widthPct}%`,
                    height: "100%",
                    background: d.color,
                    borderRadius: 99,
                    transition: "width 0.7s cubic-bezier(0.4,0,0.2,1)",
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer stats */}
      {chartData.length > 0 && (
        <div style={{
          borderTop: "1px solid #F3F4F6",
          padding: "12px 20px",
          display: "flex",
          gap: 0,
          flexShrink: 0,
        }}>
          {[
            { label: "Largest", value: chartData[0].department, sub: chartData[0].count.toLocaleString() },
            { label: "Avg / dept", value: Math.round(total / chartData.length).toLocaleString(), sub: "employees" },
            { label: "Smallest", value: chartData[chartData.length - 1].department, sub: chartData[chartData.length - 1].count.toLocaleString() },
          ].map((s, i) => (
            <div key={s.label} style={{
              flex: 1,
              borderLeft: i > 0 ? "1px solid #F3F4F6" : "none",
              paddingLeft: i > 0 ? 14 : 0,
            }}>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {s.label}
              </p>
              <p style={{
                margin: "3px 0 0", fontSize: 12, fontWeight: 700, color: "#111827",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {s.value}
              </p>
              <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF" }}>{s.sub}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}