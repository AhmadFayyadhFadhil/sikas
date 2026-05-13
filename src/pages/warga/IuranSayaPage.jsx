import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { formatRp, formatDate } from '../../utils/formatting';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { iuranService } from '../../features/finances/services/iuranService';
import UnpaidIuranAlert from '../../components/shared/UnpaidIuranAlert';

export default function IuranSayaPage() {
  const { user } = useAuth();
  const [iuranData, setIuranData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, lunas: 0, belumLunas: 0 });

  useEffect(() => {
    const loadIuran = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await iuranService.getIuranByWarga(user.id);
        setIuranData(data);
        setStats({
          total: data.length,
          lunas: data.filter(i => i.status === 'Lunas').length,
          belumLunas: data.filter(i => i.status === 'Belum Lunas').length
        });
      } catch (error) {
        console.error('Error loading iuran:', error);
        toast.error('Gagal memuat data iuran. Hubungi admin jika masalah berlanjut.');
      } finally {
        setIsLoading(false);
      }
    };

    loadIuran();
  }, [user]);

  const getStatusBadge = (status) => {
    if (status === 'Lunas') {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span className="text-sm font-medium text-emerald-700">Lunas</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full">
        <Clock size={16} className="text-amber-600" />
        <span className="text-sm font-medium text-amber-700">Belum Lunas</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Riwayat Iuran Saya</h2>
        <p className="text-slate-500 text-sm mt-1">Pantau status pembayaran iuran bulanan Anda.</p>
      </div>

      {/* Unpaid Iuran Alert */}
      <UnpaidIuranAlert userId={user?.id} showCount={3} />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div>
              <span className="text-sm text-slate-500 font-medium">Total Iuran</span>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">{stats.total}</h3>
              <p className="text-xs text-slate-400 mt-1">bulan tercatat</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/30">
          <CardContent className="p-6">
            <div>
              <span className="text-sm text-emerald-700 font-medium flex items-center gap-2">
                <CheckCircle2 size={16} /> Sudah Lunas
              </span>
              <h3 className="text-3xl font-bold text-emerald-600 mt-2">{stats.lunas}</h3>
              <p className="text-xs text-emerald-600 mt-1">{formatRp(stats.lunas * 150000)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/30">
          <CardContent className="p-6">
            <div>
              <span className="text-sm text-amber-700 font-medium flex items-center gap-2">
                <AlertCircle size={16} /> Belum Lunas
              </span>
              <h3 className="text-3xl font-bold text-amber-600 mt-2">{stats.belumLunas}</h3>
              <p className="text-xs text-amber-600 mt-1">{formatRp(stats.belumLunas * 150000)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Iuran History Table */}
      <Card>
        <CardHeader title="Detail Pembayaran Iuran" />
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200">
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Bulan</th>
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Nominal</th>
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Tanggal Bayar</th>
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Bukti Pembayaran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">Memuat data...</td></tr>
              ) : iuranData.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500">Tidak ada data iuran.</td></tr>
              ) : (
                iuranData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm font-medium text-slate-800">{item.bulan}</td>
                    <td className="py-4 px-6 text-sm font-bold text-slate-800">{formatRp(item.nominal)}</td>
                    <td className="py-4 px-6">{getStatusBadge(item.status)}</td>
                    <td className="py-4 px-6 text-sm text-slate-600">
                      {item.tanggal_bayar ? formatDate(item.tanggal_bayar) : '-'}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {item.bukti_pembayaran ? (
                        <span className="px-2.5 py-1.5 bg-blue-50 text-blue-700 rounded text-xs font-medium border border-blue-200">
                          {item.bukti_pembayaran}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Info Box */}
      <Card className="border-blue-200 bg-blue-50/30">
        <CardHeader title="ℹ️ Informasi Pembayaran" />
        <CardContent>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>• Pembayaran iuran bulanan dilakukan sebelum tanggal 5 setiap bulan</li>
            <li>• Silakan hubungi pengurus RT jika ada kendala pembayaran</li>
            <li>• Kejelasan status pembayaran Anda diperbaharui secara realtime</li>
            <li>• Dokumen bukti pembayaran dapat diminta kepada pengurus RT</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
