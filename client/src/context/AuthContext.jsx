import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();
import { useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState(null);

  useEffect(() => {
  refreshUser(); // ⬅️ this triggers token refresh on first load
}, []);


const refreshUser = async () => {
  setLoading(true);

  try {
    let res;
    try {
      res = await fetch(`${BASE_URL}/auth/me`, {
        credentials: 'include',
      });
    } catch (err) {
      // Swallow fetch error silently (e.g., network down)
      res = { ok: false, status: 500 };
    }

    if (res.status === 401) {
      let refreshRes;
      try {
        refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });
      } catch (err) {
        refreshRes = { ok: false, status: 500 };
      }

      if (!refreshRes.ok) {
        setUser(null);
        setMeta({});
        setHasCheckedAuth(true);
        setLoading(false);
        return;
      }

      try {
        res = await fetch(`${BASE_URL}/auth/me`, {
          credentials: 'include',
        });
      } catch (err) {
        res = { ok: false, status: 500 };
      }

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

    try {
      const metaRes = await fetch(`${BASE_URL}/auth/meta`, {
        credentials: 'include',
      });

      if (metaRes.ok) {
        const metaData = await metaRes.json();
        setMeta(metaData);
      } else {
        setMeta({});
      }
    } catch {
      setMeta({});
    }
  } catch (err) {
    // Unexpected internal error
    console.error('Unexpected auth error:', err);
    setUser(null);
    setMeta({});
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
      setAccessToken(null);
      navigate('/'); // ✅ Redirect to public homepage
    } catch (err) {
      console.error('Logout failed', err);
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
