import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState(null);


  const refreshUser = async () => {
    setLoading(true);

    try {
      let res = await fetch(`${BASE_URL}/auth/me`, {
        credentials: 'include',
      });

      // fetch user meta separately
      const metaRes = await fetch(`${BASE_URL}/auth/meta`, {
        credentials: 'include',
      });
      if (metaRes.ok) {
        const metaData = await metaRes.json();
        setMeta(metaData);
      }

      if (res.status === 401) {
        // Try refresh
        const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });

        if (!refreshRes.ok) throw new Error('Refresh failed');

        // Retry user fetch after refresh
        res = await fetch(`${BASE_URL}/auth/me`, {
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Still unauthorized');
      }

      const userData = await res.json();
      setUser(userData);
    } catch (err) {
      console.error('Auth refresh error:', err);
      setUser(null);
      setMeta({});
    } finally {
      setLoading(false);
      setHasCheckedAuth(true);
    }
  };

  const logout = async () => {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    setUser(null);
    setMeta({});
    setHasCheckedAuth(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        meta,
        loading,
        hasCheckedAuth,
        refreshUser,
        logout,
        setMeta,
        previewAvatarUrl,
        setPreviewAvatarUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
