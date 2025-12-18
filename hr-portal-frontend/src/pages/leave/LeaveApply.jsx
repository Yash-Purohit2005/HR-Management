import { useState } from "react";
import { ToastContainer,toast } from "react-toastify";
import axios from "axios";

function LeaveApply() {
  const [leaveData, setLeaveData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Apply Leave");
  const leaveTypes = [
    "SICK",
    "CASUAL",
    "EARNED",
    "MATERNITY",
    "PATERNITY",
    "UNPAID",
    "OTHER",
  ];

  const handleChange = (e) => {
    setLeaveData({ ...leaveData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic frontend validation
    if (!leaveData.leaveType || !leaveData.startDate || !leaveData.endDate || !leaveData.reason) {
      alert("Please fill all fields before submitting.");
      return;
    }

    if (leaveData.reason.length < 5 || leaveData.reason.length > 255) {
      alert("Reason must be between 5 and 255 characters.");
      return;
    }

    try {
      setLoading(true);
      // setMessage("");
      setButtonText("Submitting....");
      // Ensure dates are in yyyy-MM-dd format
      const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${d.getFullYear()}-${month}-${day}`;
      };

      const payload = {
        ...leaveData,
        startDate: formatDate(leaveData.startDate),
        endDate: formatDate(leaveData.endDate),
      };

      // Call backend API
      const token = localStorage.getItem("jwt");
      await axios.post("http://localhost:8080/api/leaves/apply", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // setMessage("Leave applied successfully!");
      toast.success("Leave applied successfully ");
      setLeaveData({ leaveType: "", startDate: "", endDate: "", reason: "" });
      setButtonText("Submitted");
      setTimeout(() => setButtonText("Apply Leave"), 2000);

    } catch (error) {
      // Check if backend returned a validation errors object
      if (error.response?.data?.errors) {
        // Combine all error messages into one string
        const errors = Object.values(error.response.data.errors).join(" ");
        alert(errors);
      } else {
        // Fallback to generic message or backend message
        alert(error.response?.data?.message || "Error applying for leave.");
      }

      setButtonText("Apply Leave");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
    <ToastContainer position="top-right" autoClose={3000}  />
    <div className="max-w-xl mx-auto mt-2 bg-white shadow-lg rounded-2xl p-4 border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3 flex items-center gap-2">
        <i className="fa-solid fa-plane-departure text-blue-700"></i>
        Apply for Leave
      </h2>

      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Leave Type */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Leave Type <span className="text-red-500">*</span>
          </label>
          <select
            name="leaveType"
            value={leaveData.leaveType}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150"
          >
            <option value="">-- Select Leave Type --</option>
            {leaveTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={leaveData.startDate}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="endDate"
              value={leaveData.endDate}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150"
            />
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            name="reason"
            value={leaveData.reason}
            onChange={handleChange}
            rows={4}
            required
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150"
            placeholder="Enter reason for leave..."
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition disabled:opacity-50 shadow-md"
        >
          {loading ? (
            <span className="flex justify-center items-center gap-2">
              <i className="fa-solid fa-spinner fa-spin"></i> Submitting...
            </span>
          ) : (
            <span className="flex justify-center items-center gap-2">
              <i className="fa-solid fa-paper-plane"></i> {buttonText}
            </span>
          )}
        </button>
      </form>
    </div>
  </div>
  );
}

export default LeaveApply;
