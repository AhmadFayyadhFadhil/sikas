import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  // Jika tidak login, redirect ke login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Jika login tapi bukan admin, redirect ke portal
  if (!isAdmin) {
    return <Navigate to="/portal" replace />;
  }

  // Jika admin, load komponen aslinya
  return children;
}
