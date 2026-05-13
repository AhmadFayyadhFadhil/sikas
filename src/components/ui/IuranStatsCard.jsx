import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { formatRp } from '../../utils/formatting';

/**
 * Reusable component to display iuran statistics
 */
export default function IuranStatsCard({ stats = {} }) {
  const {
    totalIuran = 0,
    totalTerkumpul = 0,
    totalTerhutang = 0,
    countLunas = 0,
    countBelumLunas = 0,
    percentagePaid = 0
  } = stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Iuran */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Iuran</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatRp(totalIuran)}</h3>
              <p className="text-xs text-slate-400 mt-1">
                {countLunas + countBelumLunas} warga
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <TrendingUp size={20} className="text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terkumpul */}
      <Card className="border-emerald-200 bg-emerald-50/30">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-emerald-700 font-medium">Terkumpul</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">{formatRp(totalTerkumpul)}</h3>
              <p className="text-xs text-emerald-600 mt-1">{countLunas} pembayaran</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 size={20} className="text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terhutang */}
      <Card className="border-amber-200 bg-amber-50/30">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-amber-700 font-medium">Terhutang</p>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">{formatRp(totalTerhutang)}</h3>
              <p className="text-xs text-amber-600 mt-1">{countBelumLunas} belum bayar</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertCircle size={20} className="text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Percentage */}
      <Card className="border-purple-200 bg-purple-50/30">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-purple-700 font-medium">Terkumpul</p>
              <h3 className="text-2xl font-bold text-purple-600 mt-1">{percentagePaid}%</h3>
              <p className="text-xs text-purple-600 mt-1">dari target 100%</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <span className="text-sm font-bold text-purple-600">{percentagePaid}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
