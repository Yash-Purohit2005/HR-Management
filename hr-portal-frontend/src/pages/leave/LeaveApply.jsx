import { useState } from "react";
import axios from "axios";

function LeaveApply() {
  const [leaveData, setLeaveData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonText,setButtonText] = useState("Apply Leave");
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
      setMessage("Please fill all fields before submitting.");
      return;
    }

    if (leaveData.reason.length < 5 || leaveData.reason.length > 255) {
      setMessage("Reason must be between 5 and 255 characters.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
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

      setMessage("Leave applied successfully!");
      setLeaveData({ leaveType: "", startDate: "", endDate: "", reason: "" });
      setButtonText("Submitted");
      setTimeout(() => setButtonText("Apply Leave"), 2000);

    } catch (error) {
      // Check if backend returned a validation errors object
      if (error.response?.data?.errors) {
        // Combine all error messages into one string
        const errors = Object.values(error.response.data.errors).join(" ");
        setMessage(errors);
      } else {
        // Fallback to generic message or backend message
        setMessage(error.response?.data?.message || "Error applying for leave.");
      }

      setButtonText("Apply Leave");
    }finally{
      setLoading(false);
    }
  };


  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-blue-900">Apply for Leave</h2>

      {message && (
        <div
          className={`p-2 mb-4 rounded text-sm ${message.includes("success")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
            }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Leave Type */}
        <div>
          <label className="block text-gray-700 mb-1">Leave Type</label>
          <select
            name="leaveType"
            value={leaveData.leaveType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Select Leave Type --</option>
            {leaveTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={leaveData.startDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            name="endDate"
            value={leaveData.endDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Reason */}
        <div>
          <label className="block text-gray-700 mb-1">Reason</label>
          <textarea
            name="reason"
            value={leaveData.reason}
            onChange={handleChange}
            className="w-full p-2 border rounded resize-none"
            rows={3}
            placeholder="Enter reason for leave..."
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800 disabled:opacity-50"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
}

export default LeaveApply;
