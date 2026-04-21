import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { transactionService } from '../../features/finances/services/transactionService';
import { exportService } from '../../features/exports/services/exportService';
import { formatRp, formatDate } from '../../utils/formatting';
import { FileText, Download, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LaporanPage() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ balance: 0, totalIncome: 0, totalExpense: 0 });
  const [filterType, setFilterType] = useState('all'); // all, income, expense
  const [filterMonth, setFilterMonth] = useState('all');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [txData, statsData] = await Promise.all([
        transactionService.getAllTransactions(),
        transactionService.getDashboardStats()
      ]);
      setTransactions(txData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Gagal memuat laporan.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter transactions
  const getFilteredTransactions = () => {
    return transactions.filter(t => {
      const typeMatch = filterType === 'all' || t.type === filterType;
      const monthMatch = filterMonth === 'all' || 
        new Date(t.date).getMonth() === parseInt(filterMonth);
      return typeMatch && monthMatch;
    });
  };

  const filteredTx = getFilteredTransactions();
  const filteredIncome = filteredTx.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
  const filteredExpense = filteredTx.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);

  const handleExportPDF = () => {
    if (filteredTx.length === 0) return toast.error('Tidak ada data untuk diekspor');
    try {
      exportService.exportToPDF(filteredTx, {
        rtName: 'Warga RT 01',
        totalIncome: filteredIncome,
        totalExpense: filteredExpense,
        balance: filteredIncome - filteredExpense
      });
      toast.success('✓ PDF berhasil dibuat!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Gagal membuat PDF.');
    }
  };

  const handleExportExcel = () => {
    if (filteredTx.length === 0) return toast.error('Tidak ada data untuk diekspor');
    try {
      exportService.exportToExcel(filteredTx);
      toast.success('✓ Excel berhasil diunduh!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Gagal mengunduh Excel.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Laporan Keuangan</h2>
          <p className="text-slate-500 text-sm mt-1">Ringkasan dan analisis transaksi kas RT.</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-sm text-slate-500 font-medium">Total Pemasukan</span>
                <h3 className="text-2xl font-bold text-emerald-600 mt-2">{formatRp(filteredIncome)}</h3>
              </div>
              <div className="text-emerald-600 opacity-20"><TrendingUp size={32} /></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-sm text-slate-500 font-medium">Total Pengeluaran</span>
                <h3 className="text-2xl font-bold text-red-600 mt-2">{formatRp(filteredExpense)}</h3>
              </div>
              <div className="text-red-600 opacity-20"><TrendingDown size={32} /></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-sm text-slate-500 font-medium">Saldo Keseluruhan</span>
                <h3 className="text-2xl font-bold text-blue-600 mt-2">{formatRp(stats.balance)}</h3>
              </div>
              <div className="text-blue-600 opacity-20"><FileText size={32} /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader title="Filter Laporan" />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tipe Transaksi</label>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">Semua Transaksi</option>
                <option value="income">Pemasukan Saja</option>
                <option value="expense">Pengeluaran Saja</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Bulan</label>
              <select 
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">Semua Bulan</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={i}>
                    {new Date(2024, i).toLocaleDateString('id-ID', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handleExportPDF} variant="outline" className="flex-1">
                <FileText size={16} className="mr-2" />
                PDF
              </Button>
              <Button onClick={handleExportExcel} variant="outline" className="flex-1">
                <Download size={16} className="mr-2" />
                Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader title={`Detail Transaksi (${filteredTx.length})`} />
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200">
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Tanggal</th>
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Keterangan</th>
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Kategori</th>
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Tipe</th>
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">Memuat data...</td></tr>
              ) : filteredTx.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-medium">Tidak ada transaksi sesuai filter.</td></tr>
              ) : (
                filteredTx.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-6 text-sm text-slate-600 whitespace-nowrap">{formatDate(t.date)}</td>
                    <td className="py-3 px-6 text-sm text-slate-700">{t.description || '-'}</td>
                    <td className="py-3 px-6">
                      <span className="inline-flex px-2.5 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {t.category}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-sm font-medium">
                      <span className={t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}>
                        {t.type === 'income' ? 'Masuk' : 'Keluar'}
                      </span>
                    </td>
                    <td className={`py-3 px-6 text-sm font-bold text-right whitespace-nowrap ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatRp(t.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
