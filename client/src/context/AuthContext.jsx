import { createContext, useContext, useState, useEffect } from 'react';
import { ColorModeContext } from './ColorModeContext';

const AuthContext = createContext();
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState(null);

  const { setMode } = useContext(ColorModeContext); // ✅ Direct access, safe now

  useEffect(() => {
    refreshUser();
  }, []);

  // ✅ Sync theme preference on meta change
  useEffect(() => {
    if (!meta?.theme_preference) return;

    const preferred = meta.theme_preference;
    if (preferred === 'dark' || preferred === 'light') {
      setMode(preferred);
    }
  }, [meta.theme_preference, setMode]);

  const refreshUser = async () => {
    setLoading(true);

    try {
      let res = await fetch(`${BASE_URL}/auth/me`, {
        credentials: 'include',
      });

      if (res.status === 401) {
        const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });

        if (!refreshRes.ok) {
          setUser(null);
          setMeta({});
          setHasCheckedAuth(true);
          setLoading(false);
          return;
        }

        res = await fetch(`${BASE_URL}/auth/me`, {
          credentials: 'include',
        });

        if (!res.ok) {
          console.error('Token refreshed but user fetch still failed');
          setUser(null);
          setMeta({});
          setHasCheckedAuth(true);
          setLoading(false);
          return;
        }
      }

      const userData = await res.json();
      setUser(userData);

      const metaRes = await fetch(`${BASE_URL}/auth/meta`, {
        credentials: 'include',
      });

      if (metaRes.ok) {
        const metaData = await metaRes.json();
        setMeta(metaData);
      }

    } catch (err) {
      console.error('Unexpected auth error:', err);
      setUser(null);
    } finally {
      setLoading(false);
      setHasCheckedAuth(true);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      setMeta({});
      setPreviewAvatarUrl(null);
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const updateMeta = async (updates) => {
    const res = await fetch(`${BASE_URL}/auth/meta`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updates),
    });

    if (res.ok) {
      setMeta((prev) => ({ ...prev, ...updates }));
    } else {
      console.error('❌ Failed to update meta on server');
    }
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
        updateMeta,
        previewAvatarUrl,
        setPreviewAvatarUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
