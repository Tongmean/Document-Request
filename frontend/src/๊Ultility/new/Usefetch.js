import { useEffect, useState } from "react";
import apiClient from "../apiClient";

export const Usefetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

//   console.log("useFetch called with URL:", url);

  useEffect(() => {
    if (!url) return;

    let isMounted = true; // prevent memory leaks

    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await apiClient.get(url);
        // console.log("Response from API:", response);

        if (response.data?.success) {
          if (isMounted) setData(response.data.data); // ✅ usually data.data
        } else {
          if (isMounted) setError(response.data?.msg || "Request failed");
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.msg || err.message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // cleanup
    };
  }, [url]);

  return { data, loading, error };
};
