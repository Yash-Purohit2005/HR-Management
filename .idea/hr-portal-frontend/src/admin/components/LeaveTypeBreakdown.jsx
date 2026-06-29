import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const PALETTE = [
  "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B",
  "#EF4444", "#06B6D4", "#EC4899", "#14B8A6",
  "#F97316", "#6366F1",
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { leaveType, count, percentage } = payload[0].payload;
  const color = payload[0].payload.fill;
  return (
    <div style={{
      background: "#fff", border: "1px solid #E5E7EB",
      borderRadius: 12, padding: "10px 14px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.10)", minWidth: 150,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{leaveType}</span>
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, color, lineHeight: 1 }}>{count}</div>
      <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{percentage}% of total</div>
    </div>
  );
};

export default function LeaveTypeBreakdown({ breakdown = [], loading }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const { chartData, total } = useMemo(() => {
    const total = breakdown.reduce((s, d) => s + d.count, 0);
    const sorted = [...breakdown].sort((a, b) => b.count - a.count);
    return {
      total,
      chartData: sorted.map((d, i) => ({
        ...d,
        fill: PALETTE[i % PALETTE.length],
        percentage: total > 0 ? ((d.count / total) * 100).toFixed(1) : "0.0",
      })),
    };
  }, [breakdown]);

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
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#111827", letterSpacing: "-0.2px" }}>
            Leave Type Breakdown
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9CA3AF" }}>
            {total.toLocaleString()} total · {chartData.length} types
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

      {/* Donut chart */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 20px 8px", minHeight: 200 }}>
        {loading ? (
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", border: "3px solid #E5E7EB", borderTopColor: "#3B82F6", animation: "spin 0.7s linear infinite" }} />
            <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>Loading…</p>
          </div>
        ) : chartData.length === 0 ? (
          <p style={{ margin: 0, fontSize: 13, color: "#9CA3AF" }}>No data available</p>
        ) : (
          <div style={{ position: "relative", width: "100%", maxWidth: 220 }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="count"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.fill}
                      opacity={activeIndex === null || activeIndex === index ? 1 : 0.35}
                      style={{ cursor: "pointer", transition: "opacity 0.15s" }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center label */}
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center", pointerEvents: "none",
            }}>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#111827", lineHeight: 1 }}>
                {total.toLocaleString()}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 10, color: "#9CA3AF", fontWeight: 600 }}>TOTAL</p>
            </div>
          </div>
        )}
      </div>

      {/* Legend list */}
      {!loading && chartData.length > 0 && (
        <div style={{ padding: "0 20px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
          {chartData.map((d, i) => (
            <div
              key={d.leaveType}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                opacity: activeIndex === null || activeIndex === i ? 1 : 0.4,
                transition: "opacity 0.15s", cursor: "default",
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: 3, background: d.fill, flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", flex: 1 }}>{d.leaveType}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: d.fill }}>{d.count}</span>
              <span style={{ fontSize: 11, color: "#9CA3AF", minWidth: 38, textAlign: "right" }}>{d.percentage}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {!loading && chartData.length > 0 && (
        <div style={{ borderTop: "1px solid #F3F4F6", padding: "12px 20px", flexShrink: 0 }}>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Most common
          </p>
          <p style={{ margin: "3px 0 0", fontSize: 13, fontWeight: 700, color: "#111827" }}>
            {chartData[0]?.leaveType}
            <span style={{ fontWeight: 400, color: "#6B7280", marginLeft: 8 }}>
              {chartData[0]?.count} requests ({chartData[0]?.percentage}%)
            </span>
          </p>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}