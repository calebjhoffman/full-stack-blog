import { useEffect, useState } from 'react';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // 🧠 Try to refresh access token first
        const refreshRes = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        });

        if (!refreshRes.ok) throw new Error('Refresh failed');

        // 🎯 Then fetch the user info
        const meRes = await fetch('/api/auth/me', {
          credentials: 'include',
        });

        if (!meRes.ok) throw new Error('Unauthorized');

        const data = await meRes.json();
        setUser(data);
      } catch (err) {
        console.warn('❌ Auth load failed:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return { user, loading };
}
