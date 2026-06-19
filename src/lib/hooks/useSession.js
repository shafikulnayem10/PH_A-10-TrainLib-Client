'use client';

import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';

export function useSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await authClient.getSession();
        if (error) {
          setError(error);
        } else {
          setSession(data);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    getSession();
  }, []);

  return { data: session, loading, error };
}