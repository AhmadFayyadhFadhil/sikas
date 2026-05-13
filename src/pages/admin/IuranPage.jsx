import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { iuranService } from '../../features/finances/services/iuranService';
import { formatRp, formatDate } from '../../utils/formatting';
import { CheckCircle2, Clock, Plus, Search, Download, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function IuranPage() {
  const [iuranData, setIuranData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bulkFormData, setBulkFormData] = useState({ nominal: '150000' });
  const [selectedIuran, setSelectedIuran] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isBulkCreating, setIsBulkCreating] = useState(false);

  // Load data
  const loadIuran = async () => {
    setIsLoading(true);
    try {
      const data = await iuranService.getIuranByMonth(
        parseInt(filterMonth.split('-')[1]),
        parseInt(filterMonth.split('-')[0])
      );
      setIuranData(data);

      const stats = await iuranService.getIuranStats();
      setStats(stats);
    } catch (error) {
      console.error('Error loading iuran:', error);
      toast.error('Gagal memuat data iuran');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIuran();
  }, [filterMonth]);

  const handleBulkCreate = async () => {
    if (!bulkFormData.nominal || bulkFormData.nominal <= 0) {
      toast.error('Nominal harus lebih dari 0');
      return;
    }

    setIsBulkCreating(true);
    try {
      const [year, month] = filterMonth.split('-');
      const result = await iuranService.bulkCreateIuran(
        parseInt(month),
        parseInt(year),
        parseInt(bulkFormData.nominal)
      );
      toast.success(`${result.count} iuran berhasil dibuat`);
      setBulkFormData({ nominal: '150000' });
      setShowBulkModal(false);
      loadIuran();
    } catch (error) {
      console.error('Error bulk creating iuran:', error);
      toast.error(error.message || 'Gagal membuat iuran');
    } finally {
      setIsBulkCreating(false);
    }
  };

  const handleMarkAsPaid = async () => {
    if (!selectedIuran) return;

    try {
      await iuranService.markAsPaid(selectedIuran.id);
      toast.success('Status pembayaran berhasil diperbarui');
      setShowPaymentModal(false);
      setSelectedIuran(null);
      loadIuran();
    } catch (error) {
      console.error('Error marking as paid:', error);
      toast.error(error.message || 'Gagal memperbarui status pembayaran');
    }
  };

  const handleDelete = async (id) => {
    try {
      await iuranService.deleteIuran(id);
      toast.success('Iuran berhasil dihapus');
      loadIuran();
    } catch (error) {
      console.error('Error deleting iuran:', error);
      toast.error(error.message || 'Gagal menghapus iuran');
    }
  };

  const filteredData = iuranData.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    const wargaName = item.warga?.nama_kepala_keluarga?.toLowerCase() || '';
    const blok = item.warga?.blok?.toLowerCase() || '';
    const rumah = item.warga?.nomor_rumah?.toString() || '';
    return (
      wargaName.includes(searchLower) ||
      blok.includes(searchLower) ||
      rumah.includes(searchLower)
    );
  });

  const getStatusBadge = (status) => {
    if (status === 'Lunas') {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
          <CheckCircle2 size={14} className="text-emerald-600" />
          <span className="text-xs font-medium text-emerald-700">Lunas</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full">
        <Clock size={14} className="text-amber-600" />
        <span className="text-xs font-medium text-amber-700">Belum Lunas</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Manajemen Iuran</h2>
        <p className="text-slate-500 text-sm mt-1">Kelola pembayaran iuran warga dan tracking status pembayaran.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 font-medium">Total Iuran</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatRp(stats.totalIuran)}</h3>
            <p className="text-xs text-slate-400 mt-1">{stats.totalIuran > 0 ? `${stats.countLunas + stats.countBelumLunas} pihak` : '-'}</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/30">
          <CardContent className="p-4">
            <p className="text-xs text-emerald-700 font-medium">Terkumpul</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">{formatRp(stats.totalTerkumpul)}</h3>
            <p className="text-xs text-emerald-600 mt-1">{stats.countLunas} pembayaran</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/30">
          <CardContent className="p-4">
            <p className="text-xs text-amber-700 font-medium">Terhutang</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">{formatRp(stats.totalTerhutang)}</h3>
            <p className="text-xs text-amber-600 mt-1">{stats.countBelumLunas} belum bayar</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/30">
          <CardContent className="p-4">
            <p className="text-xs text-blue-700 font-medium">Persentase Terkumpul</p>
            <h3 className="text-2xl font-bold text-blue-600 mt-1">{stats.percentagePaid || 0}%</h3>
            <p className="text-xs text-blue-600 mt-1">target: 100%</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1">
          <Input
            label="Cari warga..."
            placeholder="Nama, blok, atau nomor rumah"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={() => setShowBulkModal(true)}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Buat Iuran Bulan Ini
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Warga</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Blok</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Nominal</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Tanggal Bayar</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">Loading...</td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                      Tidak ada data iuran untuk bulan ini
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                        {item.warga?.nama_kepala_keluarga || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        Blok {item.warga?.blok} No. {item.warga?.nomor_rumah}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                        {formatRp(item.nominal)}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {item.tanggal_bayar ? formatDate(item.tanggal_bayar) : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {item.status === 'Belum Lunas' && (
                            <button
                              onClick={() => {
                                setSelectedIuran(item);
                                setShowPaymentModal(true);
                              }}
                              className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                              title="Tandai Lunas"
                            >
                              <CheckCircle2 size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedIuran(item);
                              setDeleteConfirm(true);
                            }}
                            className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Create Modal */}
      <Modal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        title="Buat Iuran Massal"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Bulan & Tahun"
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          />
          <Input
            label="Nominal Iuran (Rp)"
            type="number"
            value={bulkFormData.nominal}
            onChange={(e) => setBulkFormData({ ...bulkFormData, nominal: e.target.value })}
            placeholder="150000"
          />
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              ℹ️ Sistem akan membuat iuran untuk semua warga yang terdaftar dengan nominal Rp {formatRp(parseInt(bulkFormData.nominal) || 0)}
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => setShowBulkModal(false)}
            >
              Batal
            </Button>
            <Button
              onClick={handleBulkCreate}
              isLoading={isBulkCreating}
            >
              Buat Iuran
            </Button>
          </div>
        </div>
      </Modal>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Tandai Sebagai Lunas"
        size="md"
      >
        <div className="space-y-4">
          {selectedIuran && (
            <>
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <p className="text-sm text-slate-600">
                  <strong>Warga:</strong> {selectedIuran.warga?.nama_kepala_keluarga}
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Nominal:</strong> {formatRp(selectedIuran.nominal)}
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Bulan:</strong> {selectedIuran.bulan}
                </p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <p className="text-sm text-emerald-700">
                  ✓ Pembayaran akan dicatat dengan tanggal hari ini
                </p>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="secondary"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleMarkAsPaid}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Tandai Lunas
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm}
        title="Hapus Iuran?"
        message={`Hapus iuran ${selectedIuran?.warga?.nama_kepala_keluarga} bulan ${selectedIuran?.bulan}?`}
        onConfirm={() => {
          handleDelete(selectedIuran.id);
          setDeleteConfirm(false);
        }}
        onCancel={() => setDeleteConfirm(false)}
        variant="danger"
      />
    </div>
  );
}
