import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Home, Receipt, FileBarChart, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export default function PortalLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navLinks = [
    { name: "Beranda", path: "/portal", icon: Home },
    { name: "Iuran Saya", path: "/portal/iuran", icon: Receipt },
    { name: "Laporan RT", path: "/portal/laporan", icon: FileBarChart },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">RT</span>
              </div>
              <h1 className="text-xl font-bold text-slate-800">SiKas Portal</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 h-full">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors h-full ${
                      isActive
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <link.icon size={16} className="mr-2" />
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop User Actions */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 px-4 py-2 rounded-lg transition-colors shadow-sm"
                  >
                    Dashboard Admin
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <LogOut size={16} />
                    Keluar
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                  Login Pengurus
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white shadow-lg absolute w-full">
            <div className="pt-2 pb-3 space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block pl-3 pr-4 py-3 border-l-4 text-base font-medium ${
                      isActive
                        ? "bg-blue-50 border-blue-600 text-blue-700"
                        : "border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <link.icon size={20} />
                      {link.name}
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="pt-4 pb-4 border-t border-slate-200">
              {user ? (
                <div className="px-4 space-y-3">
                  <div className="flex items-center mb-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                        {user?.email ? user.email.charAt(0).toUpperCase() : 'W'}
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-slate-800">{user?.email}</div>
                      <div className="text-sm font-medium text-slate-500">Warga RT 01</div>
                    </div>
                  </div>
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-800 text-white rounded-lg font-medium"
                  >
                    Dashboard Admin
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-50 text-red-600 rounded-lg font-medium"
                  >
                    <LogOut size={20} />
                    Keluar
                  </button>
                </div>
              ) : (
                <div className="px-4">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium"
                  >
                    Login Pengurus
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p className="text-sm text-slate-500">© 2026 SiKas RT. Hak Cipta Dilindungi.</p>
          <div className="text-sm text-slate-400">Versi 1.0.0</div>
        </div>
      </footer>
    </div>
  );
}
