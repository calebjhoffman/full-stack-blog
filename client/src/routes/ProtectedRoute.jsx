import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { user, loading, hasCheckedAuth } = useAuth();

  // 🛑 Wait until auth check is complete before rendering anything
  if (!hasCheckedAuth) {
    return null; // or a spinner if you prefer
  }

  if (loading) {
    return null; // or a spinner
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
