import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { transactionService } from '../../features/finances/services/transactionService';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { formatRp, formatDateShort } from '../../utils/formatting';

export default function DashboardPage() {
  const [stats, setStats] = useState({ balance: 0, totalIncome: 0, totalExpense: 0 });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const { balance, totalIncome, totalExpense } = await transactionService.getDashboardStats();
        setStats({ balance, totalIncome, totalExpense });

        // Build simple chart data from all transactions just for visual
        const allTxs = await transactionService.getAllTransactions();
        
        // Group by Date for Charting (very basic grouping)
        const grouped = allTxs.reduce((acc, tx) => {
          const date = new Date(tx.date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
          if (!acc[date]) acc[date] = { name: date, income: 0, expense: 0 };
          
          if (tx.type === 'income') acc[date].income += Number(tx.amount);
          if (tx.type === 'expense') acc[date].expense += Number(tx.amount);
          return acc;
        }, {});

        // Convert Object to Array & reverse to chronological
        const chartArr = Object.values(grouped).reverse();
        setChartData(chartArr);

      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-6 py-1"><div className="h-40 bg-slate-200 rounded"></div></div></div>;
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-800">
          <CardContent className="h-full flex flex-col justify-center">
            <div className="flex justify-between items-start">
              <span className="text-blue-100 font-medium">Total Kas Tersedia</span>
              <Wallet className="opacity-80" />
            </div>
            <span className="text-3xl font-bold mt-3">Rp {formatRp(stats.balance)}</span>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="h-full flex flex-col justify-center relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-sm text-slate-500 font-medium">Total Pemasukan</span>
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <TrendingUp size={16} className="text-emerald-600" />
              </div>
            </div>
            <span className="text-3xl font-bold text-slate-800 mt-2">Rp {formatRp(stats.totalIncome)}</span>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="h-full flex flex-col justify-center relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-sm text-slate-500 font-medium">Total Pengeluaran</span>
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <TrendingDown size={16} className="text-red-500" />
              </div>
            </div>
            <span className="text-3xl font-bold text-slate-800 mt-2">Rp {formatRp(stats.totalExpense)}</span>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card>
        <CardHeader 
          title="Grafik Arus Kas" 
          description="Pergerakan pemasukan dan pengeluaran harian"
        />
        <CardContent>
          {chartData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-slate-400">
              Belum ada data transaksi yang dicatat.
            </div>
          ) : (
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{fill: '#64748b', fontSize: 12}} fill="#64748b" axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(val) => `Rp${val/1000}k`} />
                  <Tooltip 
                    formatter={(value) => `Rp ${formatRp(value)}`}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Area type="monotone" dataKey="income" name="Pemasukan" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="expense" name="Pengeluaran" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
