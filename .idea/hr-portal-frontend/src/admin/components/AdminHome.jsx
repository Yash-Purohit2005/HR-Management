import { useCallback } from "react";
import DepartmentStats from "./DepartmentStats";
import QuickActions from "./QuickActions";
import RecentActivities from "./RecentActivities";
import StatsCards from "./Statscard";
import { useEmployee } from "../hooks/useEmployee";
import { useEmployeeStats } from "../hooks/useEmployeeStats";
import AdminEmployees from "./AdminEmployees";

export default function AdminHome() {
  const { stats, loading, refreshStats } = useEmployeeStats();
  const { pageData, loading: employeeLoading, setQuery, fetchEmployees, refresh } = useEmployee(10);

  const handleSetQuery = useCallback((q) => setQuery(q), [setQuery]);
  const handlePageChange = useCallback((page) => fetchEmployees(page), [fetchEmployees]);

  // Refresh both table AND stats cards after deactivate/reactivate
  const handleRefresh = useCallback(() => {
    refresh();
    refreshStats();
  }, [refresh, refreshStats]);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="p-6 space-y-6">
      <StatsCards stats={stats} />

      <QuickActions setQuery={handleSetQuery} />

      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        <div className="flex-1 flex flex-col">
          <RecentActivities />
        </div>
        <div className="flex-1 flex flex-col">
          <DepartmentStats stats={stats} />
        </div>
      </div>

      

      <AdminEmployees
        employees={pageData?.content || []}
        currentPage={pageData?.number || 0}
        totalPages={pageData?.totalPages || 0}
        onPageChange={handlePageChange}
        refreshData={handleRefresh}   // ← calls both refresh + refreshStats
        loading={employeeLoading}
      />
    </div>
  );
}