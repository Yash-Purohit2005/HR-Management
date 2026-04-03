import { useCallback } from "react";
import { MdBeachAccess } from "react-icons/md";
import { useLeaveStats } from "../../services/admin-services/useLeaveStats";
import { useMonthlyLeaveTrends } from "../../services/admin-services/useMonthlyLeaveTrends";
import { useLeaveTypeBreakdown } from "../../services/admin-services/useLeaveTypeBreakdown";
import { useEmployeeLeaveStats } from "../../services/admin-services/useEmployeeLeaveStats";
import LeaveStatsCards from "../components/LeaveStatsCards";
import MonthlyLeaveTrend from "../components/MonthlyLeaveTrend";
import LeaveTypeBreakdown from "../components/LeaveTypeBreakdown";
import EmployeeLeaveStats from "../components/EmployeeLeaveStats";
import AllLeavesTable from "../components/AllLeavesTable";

export default function LeaveManagement() {
  const { stats,     loading: statsLoading,     refresh: refreshStats }     = useLeaveStats();
  const { trends,    loading: trendsLoading,    refresh: refreshTrends }    = useMonthlyLeaveTrends();
  const { breakdown, loading: breakdownLoading, refresh: refreshBreakdown } = useLeaveTypeBreakdown();
  const { data,      loading: empLoading,       refresh: refreshEmp }       = useEmployeeLeaveStats();

  // Called by AllLeavesTable after every approve/reject
  // Refreshes ALL other components so numbers stay in sync
  const handleStatusChange = useCallback(() => {
    refreshStats();
    refreshTrends();
    refreshBreakdown();
    refreshEmp();
  }, [refreshStats, refreshTrends, refreshBreakdown, refreshEmp]);

  const handleRefresh = useCallback(() => {
    handleStatusChange();
  }, [handleStatusChange]);

  return (
    <div className="p-6 space-y-6">

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "#ECFDF5", border: "1px solid #A7F3D0",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <MdBeachAccess size={20} color="#059669" />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#111827", letterSpacing: "-0.4px" }}>
              Leave Management
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9CA3AF" }}>
              Overview of all employee leave requests
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          onMouseEnter={(e) => e.currentTarget.style.background = "#F3F4F6"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#F9FAFB"}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 12, fontWeight: 600, color: "#374151",
            background: "#F9FAFB", border: "1px solid #E5E7EB",
            borderRadius: 8, padding: "7px 14px",
            cursor: "pointer", transition: "background 0.15s",
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Row 1 — stat cards */}
      <LeaveStatsCards stats={stats} loading={statsLoading} />

      {/* Row 2 — charts */}
      <div style={{ display: "flex", gap: 16, alignItems: "stretch" }}>
        <div style={{ flex: 2, minWidth: 0 }}>
          <MonthlyLeaveTrend trends={trends} loading={trendsLoading} />
        </div>
        <div style={{ flex: 1, minWidth: 280 }}>
          <LeaveTypeBreakdown breakdown={breakdown} loading={breakdownLoading} />
        </div>
      </div>

      {/* Row 3 — employee-wise */}
      <EmployeeLeaveStats data={data} loading={empLoading} />

      {/* Row 4 — all requests table */}
      {/* onStatusChange fires after every approve/reject → refreshes stats/charts above */}
      <AllLeavesTable onStatusChange={handleStatusChange} />

    </div>
  );
}