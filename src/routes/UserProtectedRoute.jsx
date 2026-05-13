import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function UserProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect ke halaman login jika belum login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Jika user sudah login (user biasa atau admin), tampilkan halaman
  return children;
}
