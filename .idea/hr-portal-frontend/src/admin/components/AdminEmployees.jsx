import EmployeeTable from "./EmployeeTable";
import Pagination from "./Pagination";

function AdminEmployees({ employees, currentPage, totalPages, onPageChange, refreshData, loading }) {
  return (
    // ✅ relative + overlay: table stays mounted, spinner appears on top
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 rounded-lg">
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      )}
      <EmployeeTable employees={employees} refreshData={refreshData} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}

export default AdminEmployees;