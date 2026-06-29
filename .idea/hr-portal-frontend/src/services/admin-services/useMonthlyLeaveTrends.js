// ── useMonthlyLeaveTrends.js ──────────────────────────────────────────────
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { getToken } from "../authService";

export const useMonthlyLeaveTrends = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8080/api/leaves/stats/monthly-trends", {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((res) => setTrends(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [tick]);

  const refresh = useCallback(() => setTick((t) => t + 1), []);
  return { trends, loading, refresh };
};