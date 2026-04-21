import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar Placeholder */}
      <aside className="w-64 bg-slate-800 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight text-teal-400">SiKas RT</h1>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          <a href="/" className="block px-4 py-2 bg-slate-700 rounded-md">Dashboard</a>
          <a href="#" className="block px-4 py-2 hover:bg-slate-700 rounded-md transition-colors">Transaksi</a>
          <a href="#" className="block px-4 py-2 hover:bg-slate-700 rounded-md transition-colors">Laporan</a>
          <a href="#" className="block px-4 py-2 hover:bg-slate-700 rounded-md transition-colors">Pengaturan</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 flex flex-col">
        {/* Header Placeholder */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
          <h2 className="text-xl font-semibold text-slate-800">Sistem Keuangan RT</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600">Admin</span>
            <div className="w-8 h-8 rounded-full bg-teal-500"></div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
