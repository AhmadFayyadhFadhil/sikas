import { supabase } from '../../../config/supabase';

export const iuranService = {
  /**
   * Get all iuran records for a specific warga/resident
   * @param {string} wargaId - ID of the resident
   */
  async getIuranByWarga(wargaId) {
    try {
      if (!wargaId) throw new Error('ID warga harus disediakan');

      const { data, error } = await supabase
        .from('iuran')
        .select('*')
        .eq('warga_id', wargaId)
        .order('bulan', { ascending: false });

      if (error) throw new Error(`Supabase Error: ${error.message}`);
      return data || [];
    } catch (err) {
      console.error('getIuranByWarga error:', err);
      throw new Error(err.message || 'Gagal memuat data iuran');
    }
  },

  /**
   * Get all iuran records (admin view)
   */
  async getAllIuran() {
    try {
      const { data, error } = await supabase
        .from('iuran')
        .select('*, warga:warga_id(nama_kepala_keluarga, blok, nomor_rumah)')
        .order('bulan', { ascending: false });

      if (error) throw new Error(`Supabase Error: ${error.message}`);
      return data || [];
    } catch (err) {
      console.error('getAllIuran error:', err);
      throw new Error(err.message || 'Gagal memuat data iuran');
    }
  },

  /**
   * Create iuran record
   */
  async addIuran(payload) {
    try {
      if (!payload.warga_id || !payload.nominal || !payload.bulan) {
        throw new Error('ID warga, nominal, dan bulan wajib diisi');
      }

      const { data, error } = await supabase
        .from('iuran')
        .insert([
          {
            warga_id: payload.warga_id,
            nominal: payload.nominal,
            bulan: payload.bulan,
            status: 'Belum Lunas',
            tanggal_bayar: null,
            bukti_pembayaran: null
          }
        ])
        .select();

      if (error) throw new Error(`Supabase Error: ${error.message}`);
      if (!data || data.length === 0) throw new Error('Gagal menyimpan data iuran');

      return data[0];
    } catch (err) {
      console.error('addIuran error:', err);
      throw new Error(err.message || 'Gagal menambahkan iuran');
    }
  },

  /**
   * Mark iuran as paid
   */
  async markAsPaid(id, buktiPembayaran = null) {
    try {
      if (!id) throw new Error('ID iuran harus disediakan');

      const { data, error } = await supabase
        .from('iuran')
        .update({
          status: 'Lunas',
          tanggal_bayar: new Date().toISOString().split('T')[0],
          bukti_pembayaran: buktiPembayaran
        })
        .eq('id', id)
        .select();

      if (error) throw new Error(`Supabase Error: ${error.message}`);
      if (!data || data.length === 0) throw new Error('Data iuran tidak ditemukan');

      return data[0];
    } catch (err) {
      console.error('markAsPaid error:', err);
      throw new Error(err.message || 'Gagal memperbarui status pembayaran');
    }
  },

  /**
   * Get iuran statistics
   */
  async getIuranStats() {
    try {
      const { data, error } = await supabase
        .from('iuran')
        .select('status, nominal');

      if (error) throw new Error(`Supabase Error: ${error.message}`);

      let totalIuran = 0;
      let totalTerkumpul = 0;
      let totalTerhutang = 0;
      let countLunas = 0;
      let countBelumLunas = 0;

      (data || []).forEach(i => {
        const nominal = Number(i.nominal) || 0;
        totalIuran += nominal;

        if (i.status === 'Lunas') {
          totalTerkumpul += nominal;
          countLunas += 1;
        } else {
          totalTerhutang += nominal;
          countBelumLunas += 1;
        }
      });

      return {
        totalIuran,
        totalTerkumpul,
        totalTerhutang,
        countLunas,
        countBelumLunas,
        percentagePaid: totalIuran > 0 ? Math.round((totalTerkumpul / totalIuran) * 100) : 0
      };
    } catch (err) {
      console.error('getIuranStats error:', err);
      throw new Error(err.message || 'Gagal memuat statistik iuran');
    }
  },

  /**
   * Get all iuran for a specific month
   */
  async getIuranByMonth(bulan, tahun) {
    try {
      if (!bulan || !tahun) throw new Error('Bulan dan tahun harus disediakan');

      const monthStr = `${tahun}-${String(bulan).padStart(2, '0')}`;

      const { data, error } = await supabase
        .from('iuran')
        .select('*, warga:warga_id(nama_kepala_keluarga, blok, nomor_rumah, no_hp)')
        .ilike('bulan', `${monthStr}%`)
        .order('warga->blok', { ascending: true });

      if (error) throw new Error(`Supabase Error: ${error.message}`);
      return data || [];
    } catch (err) {
      console.error('getIuranByMonth error:', err);
      throw new Error(err.message || 'Gagal memuat data iuran per bulan');
    }
  },

  /**
   * Get unpaid iuran records
   */
  async getUnpaidIuran() {
    try {
      const { data, error } = await supabase
        .from('iuran')
        .select('*, warga:warga_id(nama_kepala_keluarga, blok, nomor_rumah, no_hp)')
        .eq('status', 'Belum Lunas')
        .order('bulan', { ascending: false });

      if (error) throw new Error(`Supabase Error: ${error.message}`);
      return data || [];
    } catch (err) {
      console.error('getUnpaidIuran error:', err);
      throw new Error(err.message || 'Gagal memuat data iuran yang belum dibayar');
    }
  },

  /**
   * Update iuran nominal/amount
   */
  async updateIuran(id, payload) {
    try {
      if (!id) throw new Error('ID iuran harus disediakan');

      const { data, error } = await supabase
        .from('iuran')
        .update(payload)
        .eq('id', id)
        .select();

      if (error) throw new Error(`Supabase Error: ${error.message}`);
      if (!data || data.length === 0) throw new Error('Data iuran tidak ditemukan');

      return data[0];
    } catch (err) {
      console.error('updateIuran error:', err);
      throw new Error(err.message || 'Gagal memperbarui iuran');
    }
  },

  /**
   * Bulk create iuran for all residents for a specific month
   */
  async bulkCreateIuran(bulan, tahun, nominal) {
    try {
      if (!bulan || !tahun || nominal === undefined) {
        throw new Error('Bulan, tahun, dan nominal harus disediakan');
      }

      // Get all active residents
      const { data: wargaList, error: wargaError } = await supabase
        .from('warga')
        .select('id');

      if (wargaError) throw new Error(`Gagal ambil data warga: ${wargaError.message}`);
      if (!wargaList || wargaList.length === 0) throw new Error('Tidak ada data warga');

      const monthStr = `${tahun}-${String(bulan).padStart(2, '0')}`;
      const iuranRecords = wargaList.map(warga => ({
        warga_id: warga.id,
        nominal: nominal,
        bulan: monthStr,
        status: 'Belum Lunas',
        tanggal_bayar: null,
        bukti_pembayaran: null
      }));

      const { data, error } = await supabase
        .from('iuran')
        .insert(iuranRecords)
        .select();

      if (error) throw new Error(`Supabase Error: ${error.message}`);
      return {
        success: true,
        count: data?.length || 0,
        data: data || []
      };
    } catch (err) {
      console.error('bulkCreateIuran error:', err);
      throw new Error(err.message || 'Gagal membuat iuran massal');
    }
  },

  /**
   * Delete iuran record
   */
  async deleteIuran(id) {
    try {
      if (!id) throw new Error('ID iuran harus disediakan');

      const { error } = await supabase
        .from('iuran')
        .delete()
        .eq('id', id);

      if (error) throw new Error(`Supabase Error: ${error.message}`);
      return { success: true };
    } catch (err) {
      console.error('deleteIuran error:', err);
      throw new Error(err.message || 'Gagal menghapus iuran');
    }
  }
};
