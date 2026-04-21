import React from 'react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold text-slate-800">Dashboard Utama</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 font-medium text-sm">Total Saldo</h3>
          <p className="text-3xl font-bold text-teal-600 mt-2">Rp 15.000.000</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 font-medium text-sm">Pemasukan Bulan Ini</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">Rp 3.500.000</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 font-medium text-sm">Pengeluaran Bulan Ini</h3>
          <p className="text-3xl font-bold text-rose-600 mt-2">Rp 1.200.000</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 min-h-[400px]">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Grafik Pemasukan vs Pengeluaran</h3>
        <p className="text-slate-500 text-sm">Area untuk meletakkan chart Recharts (segera hadir).</p>
      </div>
    </motion.div>
  );
};

export default Dashboard;
