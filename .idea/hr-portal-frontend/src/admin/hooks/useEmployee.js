import { useState, useEffect,useCallback } from "react";
import { fetchEmployeesAPI } from "../../services/admin-services/getEmployee";

// useEmployee hook — make sure setQuery triggers a re-fetch
// useEmployee.js
export function useEmployee(pageSize = 10) {
  const [query, setQueryState] = useState({});
  const [page, setPage] = useState(0);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0); // 👈 add this

  useEffect(() => {
    setLoading(true);
    fetchEmployeesAPI(query, page, pageSize)
      .then(data => setPageData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query, page, refreshTick]); // 👈 add refreshTick as dependency

  const fetchEmployees = useCallback((newPage = 0) => {
    setPage(newPage);
  }, []);

  const refresh = useCallback(() => {
    setRefreshTick(t => t + 1); // 👈 bumps tick → triggers useEffect
  }, []);

  const setQuery = useCallback((q) => {
    setQueryState(q);
    setPage(0);
  }, []);

  return { pageData, loading, setQuery, fetchEmployees, refresh };
}