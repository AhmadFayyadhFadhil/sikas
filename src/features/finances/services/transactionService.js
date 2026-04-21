import { supabase } from '../../../config/supabase';

export const transactionService = {
  // Ambil semua transaksi, diurutkan dari terbaru
  async getAllTransactions() {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw new Error(`Supabase Error: ${error.message}`);
      return data || [];
    } catch (err) {
      console.error('getAllTransactions error:', err);
      throw new Error('Gagal memuat data transaksi. Periksa koneksi database.');
    }
  },

  // Tambah transaksi baru (Pemasukan / Pengeluaran)
  async addTransaction(payload) {
    try {
      if (!payload.type || !payload.amount || !payload.category || !payload.date) {
        throw new Error('Semua field transaksi harus diisi');
      }

      const { data, error } = await supabase
        .from('transactions')
        .insert([
          { 
            type: payload.type, 
            amount: payload.amount, 
            category: payload.category, 
            description: payload.description,
            date: payload.date 
          }
        ])
        .select();
        
      if (error) throw new Error(`Supabase Error: ${error.message}`);
      if (!data || data.length === 0) throw new Error('Gagal menyimpan transaksi');
      
      return data[0];
    } catch (err) {
      console.error('addTransaction error:', err);
      throw new Error(err.message || 'Gagal menambahkan transaksi');
    }
  },

  // Hapus transaksi
  async deleteTransaction(id) {
    try {
      if (!id) throw new Error('ID transaksi harus disediakan');

      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
        
      if (error) throw new Error(`Supabase Error: ${error.message}`);
      return true;
    } catch (err) {
      console.error('deleteTransaction error:', err);
      throw new Error(err.message || 'Gagal menghapus transaksi');
    }
  },

  // Hitung statistik dashboard
  async getDashboardStats() {
    try {
      const { data, error } = await supabase.from('transactions').select('type, amount');
      
      if (error) throw new Error(`Supabase Error: ${error.message}`);

      let totalIncome = 0;
      let totalExpense = 0;

      (data || []).forEach(t => {
        const amount = Number(t.amount) || 0;
        if (t.type === 'income') totalIncome += amount;
        if (t.type === 'expense') totalExpense += amount;
      });

      return {
        balance: totalIncome - totalExpense,
        totalIncome,
        totalExpense
      };
    } catch (err) {
      console.error('getDashboardStats error:', err);
      throw new Error(err.message || 'Gagal memuat statistik');
    }
  }
};
