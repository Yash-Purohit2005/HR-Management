import { useEffect, useState, useCallback } from "react";
import { getEmployeeStats } from "../../services/admin-services/stats";

export const useEmployeeStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setLoading(true);
    getEmployeeStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, [tick]);

  // Call this after deactivate/reactivate to re-fetch stats
  const refreshStats = useCallback(() => setTick((t) => t + 1), []);

  return { stats, loading, refreshStats };
};