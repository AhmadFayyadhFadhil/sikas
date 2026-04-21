import { useState, useEffect } from 'react';
import { transactionService } from '../../features/finances/services/transactionService';
import { formatRp } from '../../utils/formatting';
import { Wallet, TrendingUp, TrendingDown, ShieldCheck, PieChart, Zap } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';

export default function PortalHomePage() {
  const [stats, setStats] = useState({ balance: 0, totalIncome: 0, totalExpense: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await transactionService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching public stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="text-center pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-[0.2em] border border-blue-100 mx-auto transition-transform hover:scale-105 active:scale-95 cursor-default shadow-sm">
          <Zap size={12} strokeWidth={3} fill="currentColor" className="opacity-80" /> 
          Solusi Digital RT Modern
        </div>
        
        <h1 className="mt-8 text-4xl md:text-5xl font-[900] text-slate-900 tracking-tight leading-[1.1]">
          Transparansi Kas RT <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500">
            Dalam Genggaman.
          </span>
        </h1>
        
        <p className="mt-6 max-w-lg mx-auto text-sm md:text-base text-slate-500 leading-relaxed font-medium">
          Kelola laporan iuran, pengeluaran, dan transparansi keuangan lingkungan Anda dengan sistem otomatis yang terpercaya.
        </p>
      </section>

      {/* Transparansi Kas (Live Stats) */}
      <section className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Balance Card */}
          <Card className="bg-slate-900 border-none shadow-2xl shadow-blue-200/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
               <Wallet size={80} />
            </div>
            <CardContent className="p-7 relative z-10">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Saldo Kas Saat Ini</span>
              <div className="mt-2 flex items-baseline gap-1">
                {loading ? (
                  <div className="h-10 w-40 bg-white/10 animate-pulse rounded"></div>
                ) : (
                  <h3 className="text-4xl font-black text-white">{formatRp(stats.balance)}</h3>
                )}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Terupdate Otomatis</span>
              </div>
            </CardContent>
          </Card>

          {/* Income Card */}
          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white group hover:translate-y-[-4px] transition-all duration-300">
            <CardContent className="p-7">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Pemasukan</span>
                  {loading ? (
                    <div className="h-8 w-32 bg-slate-100 animate-pulse rounded mt-2"></div>
                  ) : (
                    <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{formatRp(stats.totalIncome)}</h3>
                  )}
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:rotate-12 transition-transform">
                  <TrendingUp size={24} />
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2">
                 <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-tighter">Income</span>
                 <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-full"></div>
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Expense Card */}
          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white group hover:translate-y-[-4px] transition-all duration-300">
            <CardContent className="p-7">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Pengeluaran</span>
                  {loading ? (
                    <div className="h-8 w-32 bg-slate-100 animate-pulse rounded mt-2"></div>
                  ) : (
                    <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{formatRp(stats.totalExpense)}</h3>
                  )}
                </div>
                <div className="p-3 bg-red-50 rounded-2xl text-red-600 group-hover:-rotate-12 transition-transform">
                  <TrendingDown size={24} />
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2">
                 <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded uppercase tracking-tighter">Expense</span>
                 <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 w-full"></div>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-10 pt-16 border-t border-slate-100">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight capitalize">Fitur Unggulan Kami</h2>
          <p className="text-slate-500 text-sm max-w-lg mx-auto">Menghadirkan kenyamanan bagi pengurus dan kepercayaan bagi warga melalui sistem yang transparan.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group space-y-4">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
              <ShieldCheck size={28} />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Data Terpusat</h4>
            <p className="text-slate-500 text-sm leading-relaxed">Sistem pencatatan yang aman dan terpusat di cloud Supabase, menghindari resiko kehilangan data fisik.</p>
          </div>

          <div className="group space-y-4">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
              <PieChart size={28} />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Visualisasi Pintar</h4>
            <p className="text-slate-500 text-sm leading-relaxed">Ubah angka-angka rumit menjadi grafik yang estetik dan sangat mudah dipahami oleh seluruh warga.</p>
          </div>

          <div className="group space-y-4">
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
              <Zap size={28} />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Laporan Otomatis</h4>
            <p className="text-slate-500 text-sm leading-relaxed">Cetak laporan mutasi kas kapan saja dalam hitungan detik. Menghemat waktu pengurus RT berjam-jam.</p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="text-center py-10 space-y-6 border-t border-slate-100">
        <h3 className="text-2xl font-bold text-slate-800">Ingin melihat rincian transaksi lebih detail?</h3>
        <p className="text-slate-500 italic text-sm">Hubungi pengurus RT setempat untuk akses pelengkap atau login sebagai pengurus.</p>
      </section>
    </div>
  );
}
