// ── useLeaveStats.js ──────────────────────────────────────────────────────

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { getToken } from "../../services/authService";

export const useLeaveStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
  setLoading(true);
  axios
    .get("http://localhost:8080/api/leaves/stats", {  // ← fixed
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    .then((res) => setStats(res.data))
    .catch(console.error)
    .finally(() => setLoading(false));
}, [tick]);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  return { stats, loading, refresh };
};