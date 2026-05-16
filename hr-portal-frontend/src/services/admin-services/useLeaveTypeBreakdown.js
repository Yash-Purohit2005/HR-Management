// ── useLeaveTypeBreakdown.js ──────────────────────────────────────────────
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { getToken } from "../../services/authService";

export const useLeaveTypeBreakdown = () => {
  const [breakdown, setBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://hr-management-production-7384.up.railway.app/api/leaves/stats/leave-type-breakdown", {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((res) => setBreakdown(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [tick]);

  const refresh = useCallback(() => setTick((t) => t + 1), []);
  return { breakdown, loading, refresh };
};