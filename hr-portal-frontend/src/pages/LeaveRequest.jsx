import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import LeaveApply from "./leave/LeaveApply"; // your leave apply form component
import SearchBar from "../components/SearchBar";
function LeaveRequest() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("appliedOn");
  const [sortDir, setSortDir] = useState("desc");
  const [showForm, setShowForm] = useState(false);
  const [cancelingId, setCancelingId] = useState(null); // track which leave is being cancelled
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({ total: 0, approved: 0, rejected: 0, pending: 0 });

  const token = localStorage.getItem("jwt");

  const fetchLeaveStats = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/leaves/my-leave-stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load leave stats");
    }
  };

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/leaves/my-leaves?page=${page}&size=10&sortBy=${sortBy}&sortDir=${sortDir}&search=${searchTerm}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLeaves(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveStats();
  }, []);


  useEffect(() => {

    const delayDebounce = setTimeout(() => {
      fetchLeaves();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, page, sortBy, sortDir]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "text-green-700";
      case "REJECTED":
        return "text-red-700";
      case "CANCELLED":
        return "text-gray-500";
      default:
        return "text-yellow-700";
    }
  };

  // 🔴 Cancel Leave
  const cancelLeave = async (leaveId) => {
    if (!window.confirm("Are you sure you want to cancel this leave?")) return;

    setCancelingId(leaveId);
    try {
      await axios.delete(`http://localhost:8080/api/leaves/cancel/${leaveId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Leave cancelled successfully");
      fetchLeaves();
      fetchLeaveStats();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data || "Failed to cancel leave");
    } finally {
      setCancelingId(null);
    }
  };




  return (
    // <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow relative">

    <div>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* user leave stats */}
      {!showForm && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-100 text-blue-900 p-4 rounded shadow text-center">
            <h3 className="text-lg font-semibold">Total</h3>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-green-100 text-green-800 p-4 rounded shadow text-center">
            <h3 className="text-lg font-semibold">Approved</h3>
            <p className="text-2xl font-bold">{stats.approved}</p>
          </div>
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded shadow text-center">
            <h3 className="text-lg font-semibold">Pending</h3>
            <p className="text-2xl font-bold">{stats.pending}</p>
          </div>
          <div className="bg-red-100 text-red-800 p-4 rounded shadow text-center">
            <h3 className="text-lg font-semibold">Rejected</h3>
            <p className="text-2xl font-bold">{stats.rejected}</p>
          </div>
        </div>
      )}

      {/* user leave tables */}

      <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-blue-900">
            {showForm ? "" : "My Leaves"}
          </h2>

          {!showForm ? "" : <button
            className="bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-800 transition"
            onClick={() => setShowForm(!showForm)}
          >
            Back to Leave
          </button>}

        </div>

        {showForm ? (
          <LeaveApply onSuccess={() => { setShowForm(false); fetchLeaves(); fetchLeaveStats(); }} />
        ) : loading ? (
          <p className="text-center py-4 text-gray-600">Loading...</p>
        ) : (
          <div >
            <div className="flex justify-between items-center mb-4">
              <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              />

              <div className="flex gap-x-6">
                <div>
                  <span className="text-xl mr-1">Sort By :</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border p-2 rounded"
                  >
                    <option value="appliedOn">Applied On</option>
                    <option value="startDate">Start Date</option>
                    <option value="endDate">End Date</option>
                    <option value="status">Status</option>
                  </select>
                </div>
                <button
                  className="bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-800 transition"
                  onClick={() => setShowForm(!showForm)}
                >
                  {showForm ? "" : "Apply Leave"}
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">

              <table className="w-full border-collapse border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="cursor-pointer p-2 border-b text-center" onClick={() => toggleSort("appliedOn")}>Applied On</th>
                    <th className="cursor-pointer p-2 border-b text-center" onClick={() => toggleSort("startDate")}>Start Date</th>
                    <th className="cursor-pointer p-2 border-b text-center" onClick={() => toggleSort("endDate")}>End Date</th>
                    <th className="p-2 border-b text-center">Type</th>
                    <th className="p-2 border-b text-center">Reason</th>
                    <th className="cursor-pointer p-2 border-b text-center" onClick={() => toggleSort("status")}>Status</th>
                    <th className="p-2 border-b text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center p-4 text-gray-600">
                        No leaves found.
                      </td>
                    </tr>
                  ) : (
                    leaves.map((leave, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition">
                        <td className="p-2 border-b text-center">{leave.appliedOn}</td>
                        <td className="p-2 border-b text-center">{leave.startDate}</td>
                        <td className="p-2 border-b text-center">{leave.endDate}</td>
                        <td className="p-2 border-b text-center">{leave.leaveType}</td>
                        <td className="p-2 border-b text-center">{leave.reason}</td>
                        <td className={`p-2 border-b text-center font-semibold ${getStatusColor(leave.status)}`}>
                          {leave.status}
                        </td>
                        <td className="p-2 border-b text-center">
                          {leave.status === "PENDING" ? (
                            <button
                              onClick={() => cancelLeave(leave.leaveId)}
                              className={`bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition ${cancelingId === leave.id ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                              disabled={cancelingId === leave.id}
                            >
                              {cancelingId === leave.id ? "Cancelling..." : "Cancel"}
                            </button>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        )}

        {!showForm && (
          <div className="flex justify-center mt-4 gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1">{page + 1} / {totalPages}</span>
            <button
              disabled={page + 1 === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              Next
            </button>
          </div>

        )}
      </div>
    </div>
  );
}

export default LeaveRequest;
