import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { getToken } from "../../services/authService";

export const useAllLeaves = (pageSize = 10, onStatusChange) => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("appliedOn");
  const [sortDir, setSortDir] = useState("desc");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8080/api/leaves/all", {
        params: { page, size: pageSize, sortBy, sortDir },
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((res) => setPageData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, sortBy, sortDir, tick]);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  const updateStatus = useCallback(async (leaveId, status) => {
    await axios.put(
      `http://localhost:8080/api/leaves/update-status/${leaveId}`,
      null,
      {
        params: { status },
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
    // refresh the table
    setTick((t) => t + 1);
    // notify parent (LeaveHome) to refresh stats + other components
    onStatusChange?.();
  }, [onStatusChange]);

  return { pageData, loading, page, setPage, sortBy, setSortBy, sortDir, setSortDir, refresh, updateStatus };
};