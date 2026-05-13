import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Protection
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import PortalLayout from '../layouts/PortalLayout';
import ProtectedRoute from './ProtectedRoute';
import UserProtectedRoute from './UserProtectedRoute';
import { useAuth } from '../hooks/useAuth';

// Pages - Admin
import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/admin/DashboardPage';
import KasPage from '../pages/admin/KasPage';
import WargaDataPage from '../pages/admin/WargaDataPage';
import LaporanPage from '../pages/admin/LaporanPage';
import IuranPage from '../pages/admin/IuranPage';

// Pages - Portal
import PortalHomePage from '../pages/warga/PortalHomePage';
import IuranSayaPage from '../pages/warga/IuranSayaPage';
import LaporanRTPage from '../pages/warga/LaporanRTPage';

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/portal" replace />} />

      <Route element={<AuthLayout />}>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/portal" replace /> : <LoginPage />} 
        />
      </Route>

      {/* Admin Routes - Only for Admin Users */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="kas" element={<KasPage />} />
        <Route path="iuran" element={<IuranPage />} />
        <Route path="warga" element={<WargaDataPage />} />
        <Route path="laporan" element={<LaporanPage />} />
      </Route>

      {/* Portal Routes - Public Home + User Protected Pages */}
      <Route path="/portal" element={<PortalLayout />}>
        {/* Halaman Beranda - Bisa diakses siapa saja (tidak perlu login) */}
        <Route index element={<PortalHomePage />} />
        
        {/* Halaman Iuran & Laporan - Harus Login sebagai User */}
        <Route 
          path="iuran" 
          element={
            <UserProtectedRoute>
              <IuranSayaPage />
            </UserProtectedRoute>
          } 
        />
        <Route 
          path="laporan" 
          element={
            <UserProtectedRoute>
              <LaporanRTPage />
            </UserProtectedRoute>
          } 
        />
      </Route>

      <Route path="*" element={
        <div className="flex h-screen items-center justify-center bg-slate-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-800">404</h1>
            <p className="mt-2 text-slate-600">Halaman tidak ditemukan</p>
          </div>
        </div>
      } />
    </Routes>
  );
}
