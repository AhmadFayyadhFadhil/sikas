import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { transactionService } from '../../features/finances/services/transactionService';
import { exportService } from '../../features/exports/services/exportService';
import { Trash2, Plus, ArrowUpCircle, ArrowDownCircle, FileText, Table } from 'lucide-react';

// Utility helper untuk format Rupiah
const formatRp = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number || 0);

export default function KasPage() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await transactionService.getAllTransactions();
      setTransactions(data);
    } catch (error) {
      console.error(error);
      toast.error('Gagal memuat data kas. Pastikan tabel Supabase siap.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !category || !date) {
      return toast.error("Nominal, Kategori, dan Tanggal wajib diisi!");
    }

    setIsSubmitting(true);
    try {
      await transactionService.addTransaction({
        type,
        amount: Number(amount.replace(/\D/g, '')), // membersihkan titik koma jika ada
        category,
        description,
        date
      });
      toast.success("Transaksi berhasil ditambahkan!");
      
      // Reset formulir setengahnya (biarkan bulan/kategori jika perlu)
      setAmount('');
      setDescription('');
      
      // Refresh Data
      loadData();
    } catch (error) {
      toast.error("Gagal menambahkan transaksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data kas ini?")) return;
    try {
      await transactionService.deleteTransaction(id);
      toast.success("Berhasil dihapus!");
      loadData();
    } catch (e) {
      toast.error("Gagal menghapus.");
    }
  };

  const handleExportPDF = () => {
    if (transactions.length === 0) return toast.error("Tidak ada data untuk diekspor");
    
    // Hitung ringkasan untuk header PDF
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, current) => acc + Number(current.amount), 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, current) => acc + Number(current.amount), 0);
    const balance = totalIncome - totalExpense;

    exportService.exportToPDF(transactions, {
      rtName: 'Warga RT 01', 
      totalIncome,
      totalExpense,
      balance
    });
    toast.success("PDF berhasil dibuat!");
  };

  const handleExportExcel = () => {
    if (transactions.length === 0) return toast.error("Tidak ada data untuk diekspor");
    exportService.exportToExcel(transactions);
    toast.success("Excel berhasil diunduh!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Manajemen Kas RT</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Form Input */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader title="Tambah Transaksi Baru" description="Pencatatan pemasukan & pengeluaran" />
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipe Transaksi</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-3 py-2 rounded-md flex-1 hover:border-blue-500 transition-colors">
                    <input 
                      type="radio" 
                      name="type" 
                      value="income" 
                      checked={type === 'income'} 
                      onChange={() => setType('income')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <ArrowUpCircle size={18} className="text-emerald-500" />
                    <span className="text-sm font-medium text-slate-700">Masuk</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-3 py-2 rounded-md flex-1 hover:border-red-500 transition-colors">
                    <input 
                      type="radio" 
                      name="type" 
                      value="expense" 
                      checked={type === 'expense'} 
                      onChange={() => setType('expense')}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <ArrowDownCircle size={18} className="text-red-500" />
                    <span className="text-sm font-medium text-slate-700">Keluar</span>
                  </label>
                </div>
              </div>

              <Input 
                label="Nominal (Rp)" 
                type="number" 
                placeholder="150000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                <select 
                  className="block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="" disabled>Pilih Kategori...</option>
                  {type === 'income' ? (
                    <>
                      <option value="Iuran Bulanan">Iuran Bulanan</option>
                      <option value="Sumbangan">Sumbangan</option>
                      <option value="Dana Gotong Royong">Dana Gotong Royong</option>
                      <option value="Lainnya">Lainnya / Tidak Terduga</option>
                    </>
                  ) : (
                    <>
                      <option value="Kebersihan">Kebersihan Lingkungan</option>
                      <option value="Keamanan">Keamanan / Satpam</option>
                      <option value="Konsumsi">Konsumsi Rapat</option>
                      <option value="Listrik Pompa/Jalan">Listrik Pompa/Jalan</option>
                      <option value="Perbaikan Infrastruktur">Perbaikan Infrastruktur</option>
                      <option value="Lainnya">Lainnya / Tidak Terduga</option>
                    </>
                  )}
                </select>
              </div>

              <Input 
                label="Tanggal" 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Keterangan Catatan (Opsional)</label>
                <textarea 
                  className="block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm resize-none"
                  rows="3"
                  placeholder="Misal: Iuran bulan April blok B2..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                <Plus size={18} className="mr-2" />
                Simpan Transaksi
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Kolom Kanan: Tabel Riwayat */}
        <Card className="lg:col-span-2">
          <CardHeader 
            title="Riwayat Transaksi" 
            description="Daftar arus kas dari yang terbaru" 
            action={
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExportPDF} title="Cetak PDF">
                  <FileText size={16} className="md:mr-2" />
                  <span className="hidden md:inline">Cetak PDF</span>
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportExcel} title="Download Excel">
                  <Table size={16} className="md:mr-2" />
                  <span className="hidden md:inline">Excel</span>
                </Button>
              </div>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200">
                  <th className="py-3 px-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">Tanggal</th>
                  <th className="py-3 px-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">Keterangan</th>
                  <th className="py-3 px-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">Kategori</th>
                  <th className="py-3 px-4 text-xs font-semibold tracking-wide text-slate-500 uppercase text-right">Nominal</th>
                  <th className="py-3 px-4 text-xs font-semibold tracking-wide text-slate-500 uppercase text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr><td colSpan="5" className="px-4 py-8 text-center text-slate-500">Memuat data...</td></tr>
                ) : transactions.length === 0 ? (
                  <tr><td colSpan="5" className="px-4 py-8 text-center text-slate-500 font-medium">Belum ada transaksi sama sekali.</td></tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 text-sm text-slate-600 whitespace-nowrap">{new Date(t.date).toLocaleDateString('id-ID')}</td>
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-slate-800 line-clamp-1">{t.description || t.category}</p>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          {t.category}
                        </span>
                      </td>
                      <td className={`py-3 px-4 text-sm font-bold text-right whitespace-nowrap ${t.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                        {t.type === 'income' ? '+' : '-'}{formatRp(t.amount)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button 
                          onClick={() => handleDelete(t.id)}
                          className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </div>
  );
}
