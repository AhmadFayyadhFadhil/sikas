import { supabase } from '../../../config/supabase';

export const wargaService = {
  // Ambil semua data warga
  async getAllWarga() {
    const { data, error } = await supabase
      .from('warga')
      .select('*')
      .order('blok', { ascending: true })
      .order('nomor_rumah', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Tambah warga baru
  async addWarga(payload) {
    const { data, error } = await supabase
      .from('warga')
      .insert([payload])
      .select();
      
    if (error) throw error;
    return data[0];
  },

  // Hapus warga
  async deleteWarga(id) {
    const { error } = await supabase
      .from('warga')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  }
};
