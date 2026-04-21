import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect ke halaman login lalu save url terakhir agar bisa kembali
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Jika user valid, load komponen aslinya
  return children;
}
