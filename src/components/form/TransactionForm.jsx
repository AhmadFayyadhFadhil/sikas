import React from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export default function TransactionForm({
  type,
  setType,
  amount,
  setAmount,
  category,
  setCategory,
  description,
  setDescription,
  date,
  setDate,
  errors,
  isSubmitting,
  onSubmit,
  submitLabel = "Simpan"
}) {
  const incomeCategories = [
    'Iuran Bulanan',
    'Sumbangan',
    'Dana Gotong Royong',
    'Lainnya'
  ];

  const expenseCategories = [
    'Kebersihan',
    'Keamanan',
    'Konsumsi',
    'Listrik Pompa/Jalan',
    'Perbaikan Infrastruktur',
    'Lainnya'
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Transaction Type */}
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
              className="text-blue-600"
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
              className="text-red-600"
            />
            <ArrowDownCircle size={18} className="text-red-500" />
            <span className="text-sm font-medium text-slate-700">Keluar</span>
          </label>
        </div>
      </div>

      {/* Amount */}
      <Input
        label="Nominal (Rp)"
        type="number"
        placeholder="150000"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        error={errors.amount}
      />

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
        <select
          className="block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="">Pilih Kategori...</option>
          {(type === 'income' ? incomeCategories : expenseCategories).map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
      </div>

      {/* Date */}
      <Input
        label="Tanggal"
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        error={errors.date}
      />

      {/* Description */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">Keterangan (Opsional)</label>
        <textarea
          className="block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm resize-none"
          rows="2"
          placeholder="Tambahkan catatan atau deskripsi..."
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      {/* Submit Button */}
      <Button type="submit" isLoading={isSubmitting} className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
