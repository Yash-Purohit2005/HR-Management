import { useState, useEffect,useMemo,useCallback } from "react";
import { getRecentActivities } from "../../services/admin-services/recentlogs";


export const useRecentActivities = (pageSize = 5) => {
  const [activities, setActivities] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchPage = useCallback(async (pageNumber) => {
    try {
      setLoading(true);
      const data = await getRecentActivities(pageNumber, pageSize);
      setActivities(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to fetch recent activities:", err);
      setActivities([]);
      setTotalPages(0);
      setPage(0);
    } finally {
      setLoading(false);
    }
  },[pageSize]);

  // Fetch whenever page changes
  useEffect(() => {
    fetchPage(page);
  }, [page,fetchPage]);

 return useMemo(() => ({
  activities,
  page,
  totalPages,
  loading,
  setPage
}), [activities, page, totalPages, loading]);
};
