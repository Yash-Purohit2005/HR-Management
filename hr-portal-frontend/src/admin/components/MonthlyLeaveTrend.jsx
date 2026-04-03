import { useMemo } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, Cell,
} from "recharts";

const SERIES = [
  { key: "applied",  label: "Applied",  color: "#3B82F6" },
  { key: "approved", label: "Approved", color: "#10B981" },
  { key: "pending",  label: "Pending",  color: "#F59E0B" },
  { key: "rejected", label: "Rejected", color: "#EF4444" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff", border: "1px solid #E5E7EB",
      borderRadius: 12, padding: "10px 14px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.10)", minWidth: 160,
    }}>
      <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: "#111827" }}>{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.fill, display: "inline-block" }} />
          <span style={{ fontSize: 11, color: "#6B7280", flex: 1 }}>{p.name}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: p.fill }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const CustomLegend = ({ payload }) => (
  <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8, flexWrap: "wrap" }}>
    {payload?.map((p) => (
      <div key={p.value} style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 10, height: 10, borderRadius: 3, background: p.color, display: "inline-block" }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: "#6B7280" }}>{p.value}</span>
      </div>
    ))}
  </div>
);

export default function MonthlyLeaveTrend({ trends = [], loading }) {

  const totalApplied = useMemo(() => trends.reduce((s, d) => s + (d.applied || 0), 0), [trends]);
  const totalApproved = useMemo(() => trends.reduce((s, d) => s + (d.approved || 0), 0), [trends]);
  const approvalRate = totalApplied > 0 ? Math.round((totalApproved / totalApplied) * 100) : 0;

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
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#111827", letterSpacing: "-0.2px" }}>
            Monthly Leave Trends
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9CA3AF" }}>
            Applied, approved, pending & rejected by month
          </p>
        </div>
        {!loading && trends.length > 0 && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "#F0FDF4", border: "1px solid #A7F3D0",
            borderRadius: 8, padding: "4px 10px",
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981", display: "inline-block" }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#059669" }}>
              {approvalRate}% approval rate
            </span>
          </div>
        )}
      </div>

      {/* Chart body */}
      <div style={{ padding: "20px 20px 12px" }}>
        {loading ? (
          <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", border: "3px solid #E5E7EB", borderTopColor: "#3B82F6", animation: "spin 0.7s linear infinite" }} />
              <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>Loading trends…</p>
            </div>
          </div>
        ) : trends.length === 0 ? (
          <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ margin: 0, fontSize: 13, color: "#9CA3AF" }}>No trend data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={trends}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              barCategoryGap="30%"
              barGap={2}
            >
              <CartesianGrid strokeDasharray="4 4" stroke="#F3F4F6" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#6B7280", fontWeight: 500 }}
                tickLine={false}
                axisLine={{ stroke: "#E5E7EB" }}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={false}
                width={32}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F9FAFB", radius: 6 }} />
              <Legend content={<CustomLegend />} />
              {SERIES.map(({ key, label, color }) => (
                <Bar key={key} dataKey={key} name={label} fill={color} radius={[4, 4, 0, 0]} maxBarSize={18} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer summary */}
      {!loading && trends.length > 0 && (
        <div style={{
          borderTop: "1px solid #F3F4F6",
          padding: "12px 20px",
          display: "flex", gap: 0,
        }}>
          {[
            { label: "Total Applied",  value: totalApplied,  color: "#3B82F6" },
            { label: "Total Approved", value: totalApproved, color: "#10B981" },
            { label: "Approval Rate",  value: `${approvalRate}%`, color: "#7C3AED" },
          ].map((s, i) => (
            <div key={s.label} style={{
              flex: 1,
              borderLeft: i > 0 ? "1px solid #F3F4F6" : "none",
              paddingLeft: i > 0 ? 16 : 0,
            }}>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {s.label}
              </p>
              <p style={{ margin: "3px 0 0", fontSize: 18, fontWeight: 800, color: s.color, letterSpacing: "-0.5px" }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}