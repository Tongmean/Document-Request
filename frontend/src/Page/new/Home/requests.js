import { useState, useEffect, useCallback } from 'react';
import { fetchdrawingRequest } from '../../../๊Ultility/new/requestApi';

export const useDrawingData = () => {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchdrawingRequest();
      
      // 1. Create a lookup map for O(1) access
      const requestDateMap = {};
      response.requestDatedata.forEach(item => {
        if (!requestDateMap[item.request_no]) {
          requestDateMap[item.request_no] = item;
        }
      });

      // 2. Merge the data
      const mergedData = response.data.map(req => {
        const dateInfo = requestDateMap[req.request_no];
        return {
          ...req,
          request_date: dateInfo?.request_date ?? null,
          expected_date: dateInfo?.expected_date ?? null,
        };
      });

      setRowData(mergedData);
      return mergedData; // Exporting via return value
    } catch (err) {
      setError('Failed to load request data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Exporting variables for use in components
  return { rowData, loading, error, reload: load };
};