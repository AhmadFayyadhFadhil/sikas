import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { wargaService } from '../../features/admin/services/wargaService';
import toast from 'react-hot-toast';

export default function EditWargaModal({ warga, onClose, onUpdated }) {
  const [nama, setNama] = useState('');
  const [blok, setBlok] = useState('');
  const [nomorRumah, setNomorRumah] = useState('');
  const [statusHunian, setStatusHunian] = useState('Pemilik');
  const [noHp, setNoHp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (warga) {
      setNama(warga.nama_kepala_keluarga || '');
      setBlok(warga.blok || '');
      setNomorRumah(warga.nomor_rumah || '');
      setStatusHunian(warga.status_hunian || 'Pemilik');
      setNoHp(warga.no_hp || '');
    }
  }, [warga]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nama || !blok || !nomorRumah) return toast.error('Nama KK, Blok, dan Nomor Rumah wajib diisi!');
    setIsSubmitting(true);
    try {
      await wargaService.updateWarga(warga.id, {
        nama_kepala_keluarga: nama,
        blok,
        nomor_rumah: nomorRumah,
        status_hunian: statusHunian,
        no_hp: noHp,
      });
      toast.success('Data warga berhasil diperbarui!');
      onUpdated();
      onClose();
    } catch (err) {
      toast.error('Gagal memperbarui data warga.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900">Edit Data Warga</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input label="Nama Kepala Keluarga *" placeholder="Budi Santoso" value={nama} onChange={e => setNama(e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Blok *" placeholder="A / B" value={blok} onChange={e => setBlok(e.target.value)} />
            <Input label="Nomor Rumah *" placeholder="12A" value={nomorRumah} onChange={e => setNomorRumah(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status Hunian</label>
            <select
              className="block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              value={statusHunian}
              onChange={e => setStatusHunian(e.target.value)}
            >
              <option value="Pemilik">Pemilik Rumah</option>
              <option value="Penyewa">Penyewa / Kontrak</option>
              <option value="Kos">Kos / Pendatang</option>
            </select>
          </div>
          <Input label="Nomor WhatsApp" placeholder="08123456789" value={noHp} onChange={e => setNoHp(e.target.value)} />

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Batal</Button>
            <Button type="submit" className="flex-1" isLoading={isSubmitting}>Simpan Perubahan</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
