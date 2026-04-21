import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { transactionService } from '../../features/finances/services/transactionService';
import { exportService } from '../../features/exports/services/exportService';
import { formatRp, formatDate } from '../../utils/formatting';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LaporanRTPage() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ balance: 0, totalIncome: 0, totalExpense: 0 });
  const [chartData, setChartData] = useState([]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [txData, statsData] = await Promise.all([
        transactionService.getAllTransactions(),
        transactionService.getDashboardStats()
      ]);
      
      setTransactions(txData);
      setStats(statsData);

      // Prepare chart data - group by category for bar chart
      const categoryData = {};
      txData.forEach(tx => {
        if (!categoryData[tx.category]) {
          categoryData[tx.category] = { category: tx.category, income: 0, expense: 0 };
        }
        if (tx.type === 'income') {
          categoryData[tx.category].income += Number(tx.amount);
        } else {
          categoryData[tx.category].expense += Number(tx.amount);
        }
      });

      setChartData(Object.values(categoryData).slice(0, 8)); // Limit to 8 categories
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Gagal memuat laporan RT.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExportPDF = () => {
    if (transactions.length === 0) return toast.error('Tidak ada data untuk diekspor');
    try {
      exportService.exportToPDF(transactions, {
        rtName: 'Warga RT 01',
        totalIncome: stats.totalIncome,
        totalExpense: stats.totalExpense,
        balance: stats.balance
      });
      toast.success('✓ PDF berhasil dibuat!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Gagal membuat PDF.');
    }
  };

  const getCategoryBreakdown = () => {
    const breakdown = {};
    transactions.forEach(tx => {
      if (!breakdown[tx.category]) {
        breakdown[tx.category] = { income: 0, expense: 0 };
      }
      if (tx.type === 'income') {
        breakdown[tx.category].income += Number(tx.amount);
      } else {
        breakdown[tx.category].expense += Number(tx.amount);
      }
    });
    return breakdown;
  };

  const categoryBreakdown = getCategoryBreakdown();

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Laporan Keuangan RT</h2>
        <p className="text-slate-500 text-sm mt-1">Transparansi penuh atas pengelolaan kas dan pengeluaran RT untuk semua warga.</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-800">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-blue-100 font-medium text-sm">Saldo Kas</span>
                {isLoading ? (
                  <div className="h-8 w-40 bg-white/20 animate-pulse rounded mt-2"></div>
                ) : (
                  <h3 className="text-3xl font-bold mt-2">{formatRp(stats.balance)}</h3>
                )}
              </div>
              <Wallet className="opacity-40" size={40} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-emerald-700 font-medium text-sm">Total Pemasukan</span>
                {isLoading ? (
                  <div className="h-8 w-40 bg-emerald-200 animate-pulse rounded mt-2"></div>
                ) : (
                  <h3 className="text-3xl font-bold text-emerald-700 mt-2">{formatRp(stats.totalIncome)}</h3>
                )}
              </div>
              <TrendingUp className="text-emerald-600 opacity-30" size={40} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-red-700 font-medium text-sm">Total Pengeluaran</span>
                {isLoading ? (
                  <div className="h-8 w-40 bg-red-200 animate-pulse rounded mt-2"></div>
                ) : (
                  <h3 className="text-3xl font-bold text-red-700 mt-2">{formatRp(stats.totalExpense)}</h3>
                )}
              </div>
              <TrendingDown className="text-red-600 opacity-30" size={40} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      {!isLoading && chartData.length > 0 && (
        <Card>
          <CardHeader 
            title="Analisis Transaksi per Kategori"
            description="Perbandingan pemasukan dan pengeluaran berdasarkan kategori"
          />
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="category" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickLine={false}
                    tickFormatter={(val) => `Rp${(val / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip 
                    formatter={(value) => formatRp(value)}
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="income" name="Pemasukan" fill="#10b981" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="expense" name="Pengeluaran" fill="#ef4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Breakdown by Category */}
      <Card>
        <CardHeader title="Rincian Transaksi per Kategori" />
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200">
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Kategori</th>
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase text-right">Pemasukan</th>
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase text-right">Pengeluaran</th>
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase text-right">Selisih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.entries(categoryBreakdown).map(([category, data]) => {
                const selisih = data.income - data.expense;
                return (
                  <tr key={category} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm font-medium text-slate-800">{category}</td>
                    <td className="py-4 px-6 text-sm font-bold text-emerald-600 text-right">
                      {data.income > 0 ? formatRp(data.income) : '-'}
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-red-600 text-right">
                      {data.expense > 0 ? formatRp(data.expense) : '-'}
                    </td>
                    <td className={`py-4 px-6 text-sm font-bold text-right ${selisih >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {formatRp(selisih)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader 
          title="Transaksi Terbaru" 
          description={`Total ${transactions.length} transaksi`}
          action={
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <Download size={16} className="mr-2" />
              Unduh Laporan
            </Button>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200">
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Tanggal</th>
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Keterangan</th>
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Kategori</th>
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">Memuat data...</td></tr>
              ) : transactions.slice(0, 10).length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-500">Tidak ada transaksi.</td></tr>
              ) : (
                transactions.slice(0, 10).map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-6 text-sm text-slate-600 whitespace-nowrap">{formatDate(tx.date)}</td>
                    <td className="py-3 px-6 text-sm text-slate-700 max-w-xs truncate">{tx.description || '-'}</td>
                    <td className="py-3 px-6">
                      <span className="inline-flex px-2.5 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {tx.category}
                      </span>
                    </td>
                    <td className={`py-3 px-6 text-sm font-bold text-right ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatRp(tx.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Footer Info */}
      <Card className="border-blue-200 bg-blue-50/30">
        <CardHeader title="📋 Transparansi Keuangan" />
        <CardContent>
          <p className="text-sm text-slate-700 leading-relaxed">
            Laporan ini menampilkan seluruh transaksi keuangan RT secara transparan untuk membangun kepercayaan warga terhadap pengelolaan kas. 
            Data diperbarui secara real-time dari sistem database terpusat. Untuk pertanyaan atau verifikasi lebih lanjut, 
            silakan hubungi pengurus RT setempat.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
