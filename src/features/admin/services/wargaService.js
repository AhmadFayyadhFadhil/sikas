import { supabase } from '../../../config/supabase';

export const wargaService = {
  async getAllWarga() {
    try {
      const { data, error } = await supabase
        .from('warga')
        .select('*')
        .order('blok', { ascending: true })
        .order('nomor_rumah', { ascending: true });
      
      if (error) throw new Error(`Supabase Error: ${error.message}`);
      return data || [];
    } catch (err) {
      console.error('getAllWarga error:', err);
      throw new Error(err.message || 'Gagal memuat data warga');
    }
  },

  async addWarga(payload) {
    try {
      if (!payload.nama_kepala_keluarga || !payload.blok || !payload.nomor_rumah) {
        throw new Error('Nama KK, Blok, dan Nomor Rumah harus diisi');
      }

      const { data, error } = await supabase
        .from('warga')
        .insert([payload])
        .select();
      
      if (error) throw new Error(`Supabase Error: ${error.message}`);
      if (!data || data.length === 0) throw new Error('Gagal menyimpan data warga');
      
      return data[0];
    } catch (err) {
      console.error('addWarga error:', err);
      throw new Error(err.message || 'Gagal menambahkan data warga');
    }
  },

  async updateWarga(id, payload) {
    try {
      if (!id) throw new Error('ID warga harus disediakan');

      const { data, error } = await supabase
        .from('warga')
        .update(payload)
        .eq('id', id)
        .select();
      
      if (error) throw new Error(`Supabase Error: ${error.message}`);
      if (!data || data.length === 0) throw new Error('Data warga tidak ditemukan');
      
      return data[0];
    } catch (err) {
      console.error('updateWarga error:', err);
      throw new Error(err.message || 'Gagal memperbarui data warga');
    }
  },

  async deleteWarga(id) {
    try {
      if (!id) throw new Error('ID warga harus disediakan');

      const { error } = await supabase
        .from('warga')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(`Supabase Error: ${error.message}`);
      return true;
    } catch (err) {
      console.error('deleteWarga error:', err);
      throw new Error(err.message || 'Gagal menghapus data warga');
    }
  }
};
