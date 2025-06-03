// hooks/usePrizeStats.js - PRODUCTION READY - No console logs
import { useState, useEffect } from 'react';
import apiService from '../services/api';
import { INITIAL_PRIZE_STATS } from '../utils/constants';

export const usePrizeStats = () => {
  const [prizeStats, setPrizeStats] = useState(INITIAL_PRIZE_STATS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrizeStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getPrizeStats();
      setPrizeStats({
        group1: { current: data.groups.group1 || 0, limit: 5 },
        group2: { current: data.groups.group2 || 0, limit: 45 },
        group3: { current: data.groups.group3 || 0, limit: 55 },
        group4: { current: data.groups.group4 || 0, limit: 15 },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrizeStats();
  }, []);

  return {
    prizeStats,
    loading,
    error,
    refetch: fetchPrizeStats,
  };
};