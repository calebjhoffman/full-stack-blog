// lib/fetchWithAuth.js
export async function fetchWithAuth(url, options = {}) {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  let res = await fetch(BASE_URL + url, {
    ...options,
    credentials: 'include',
  });

  if (res.status === 401) {
    // Try to refresh
    const refreshRes = await fetch(BASE_URL + '/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (refreshRes.ok) {
      // Retry original request
      res = await fetch(BASE_URL + url, {
        ...options,
        credentials: 'include',
      });
    }
  }

  return res;
}
