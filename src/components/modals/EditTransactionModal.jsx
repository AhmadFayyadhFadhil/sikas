import React, { useState, useEffect } from 'react';
import { X, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { transactionService } from '../../features/finances/services/transactionService';
import toast from 'react-hot-toast';

export default function EditTransactionModal({ transaction, onClose, onUpdated }) {
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(String(transaction.amount));
      setCategory(transaction.category);
      setDescription(transaction.description || '');
      setDate(transaction.date);
    }
  }, [transaction]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !category || !date) return toast.error('Nominal, Kategori, dan Tanggal wajib diisi!');
    setIsSubmitting(true);
    try {
      await transactionService.updateTransaction(transaction.id, {
        type,
        amount: Number(String(amount).replace(/\D/g, '')),
        category,
        description,
        date
      });
      toast.success('Transaksi berhasil diperbarui!');
      onUpdated();
      onClose();
    } catch (err) {
      toast.error('Gagal memperbarui transaksi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const incomeCategories = ['Iuran Bulanan', 'Sumbangan', 'Dana Gotong Royong', 'Lainnya'];
  const expenseCategories = ['Kebersihan', 'Keamanan', 'Konsumsi', 'Listrik Pompa/Jalan', 'Perbaikan Infrastruktur', 'Lainnya'];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900">Edit Transaksi</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipe Transaksi</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-3 py-2 rounded-md flex-1 hover:border-blue-500 transition-colors">
                <input type="radio" name="type" value="income" checked={type === 'income'} onChange={() => setType('income')} className="text-blue-600" />
                <ArrowUpCircle size={18} className="text-emerald-500" />
                <span className="text-sm font-medium text-slate-700">Masuk</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-3 py-2 rounded-md flex-1 hover:border-red-500 transition-colors">
                <input type="radio" name="type" value="expense" checked={type === 'expense'} onChange={() => setType('expense')} className="text-red-600" />
                <ArrowDownCircle size={18} className="text-red-500" />
                <span className="text-sm font-medium text-slate-700">Keluar</span>
              </label>
            </div>
          </div>

          <Input label="Nominal (Rp)" type="number" placeholder="150000" value={amount} onChange={e => setAmount(e.target.value)} />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
            <select
              className="block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="" disabled>Pilih Kategori...</option>
              {(type === 'income' ? incomeCategories : expenseCategories).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <Input label="Tanggal" type="date" value={date} onChange={e => setDate(e.target.value)} />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Keterangan (Opsional)</label>
            <textarea
              className="block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm resize-none"
              rows="2"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Batal</Button>
            <Button type="submit" className="flex-1" isLoading={isSubmitting}>Simpan Perubahan</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
