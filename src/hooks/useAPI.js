// hooks/useAPI.js
import { useState } from 'react';
import apiService from '../services/api';

export const useAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeRequest = async (requestFn) => {
    try {
      setLoading(true);
      setError(null);
      const result = await requestFn();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    executeRequest,
    clearError: () => setError(null),
  };
};