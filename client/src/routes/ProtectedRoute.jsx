import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { user, loading, refreshUser, hasCheckedAuth } = useAuth();

  useEffect(() => {
    if (user === null && !loading && !hasCheckedAuth) {
      refreshUser();
    }
  }, [user, loading, hasCheckedAuth]);

  if (loading || (user === null && !hasCheckedAuth)) {
    return null; // or spinner
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}