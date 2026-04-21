import { supabase } from '../../../config/supabase';

export const transactionService = {
  // Ambil semua transaksi, diurutkan dari terbaru
  async getAllTransactions() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Tambah transaksi baru (Pemasukan / Pengeluaran)
  async addTransaction(payload) {
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
      
    if (error) throw error;
    return data[0];
  },

  // Hapus transaksi (Soft delete / Hard Delete)
  async deleteTransaction(id) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  },

  // Hitung total saldo dan statistik untuk Dashboard (diakses terpisah agar optimal)
  async getDashboardStats() {
    const { data, error } = await supabase.from('transactions').select('type, amount');
    if (error) throw error;

    let totalIncome = 0;
    let totalExpense = 0;

    data.forEach(t => {
      if (t.type === 'income') totalIncome += Number(t.amount);
      if (t.type === 'expense') totalExpense += Number(t.amount);
    });

    return {
      balance: totalIncome - totalExpense,
      totalIncome,
      totalExpense
    };
  }
};
