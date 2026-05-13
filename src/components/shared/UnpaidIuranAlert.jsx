import React, { useState, useEffect } from 'react';
import { AlertCircle, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { formatRp } from '../../utils/formatting';
import { iuranService } from '../../features/finances/services/iuranService';
import toast from 'react-hot-toast';

/**
 * Component to display unpaid iuran notifications
 * Can be used on dashboard or portal
 */
export default function UnpaidIuranAlert({ userId = null, showCount = 3 }) {
  const [unpaidData, setUnpaidData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalUnpaid, setTotalUnpaid] = useState(0);

  useEffect(() => {
    const loadUnpaidIuran = async () => {
      setIsLoading(true);
      try {
        let data;
        if (userId) {
          // Get unpaid iuran for specific user
          data = await iuranService.getIuranByWarga(userId);
          data = data.filter(i => i.status === 'Belum Lunas');
        } else {
          // Get all unpaid iuran (admin view)
          data = await iuranService.getUnpaidIuran();
        }
        
        setUnpaidData(data.slice(0, showCount));
        setTotalUnpaid(data.length);
      } catch (error) {
        console.error('Error loading unpaid iuran:', error);
        toast.error('Gagal memuat data iuran');
      } finally {
        setIsLoading(false);
      }
    };

    loadUnpaidIuran();
  }, [userId, showCount]);

  if (isLoading) {
    return (
      <Card className="border-amber-200 bg-amber-50/30">
        <CardContent className="p-4">
          <div className="text-center text-sm text-slate-600">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (totalUnpaid === 0) {
    return null;
  }

  return (
    <Card className="border-amber-200 bg-amber-50/50 ring-1 ring-amber-100">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <AlertCircle size={20} className="text-amber-600 flex-shrink-0" />
          <h3 className="font-semibold text-amber-900">
            {userId ? 'Iuran Belum Dibayar' : 'Notifikasi Iuran'}
          </h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {unpaidData.map((iuran) => (
          <div
            key={iuran.id}
            className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-100"
          >
            <div className="flex-1">
              {!userId && (
                <p className="text-xs font-medium text-slate-600">
                  {iuran.warga?.nama_kepala_keluarga || 'N/A'}
                </p>
              )}
              <p className="text-sm text-slate-700">
                Bulan <strong>{iuran.bulan}</strong>
              </p>
              <p className="text-xs text-slate-600">
                Nominal: <span className="font-semibold">{formatRp(iuran.nominal)}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <div className="text-right">
                <p className="text-xs text-amber-600 font-medium">Belum Lunas</p>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </div>
          </div>
        ))}

        {totalUnpaid > showCount && (
          <div className="pt-2 text-center">
            <p className="text-xs text-amber-700 font-medium">
              +{totalUnpaid - showCount} lainnya belum dibayar
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
