import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { wargaService } from '../../features/admin/services/wargaService';
import { formRules, hasErrors, getFirstError } from '../../utils/validation';
import { Trash2, UserPlus, Home, UserCheck, Phone } from 'lucide-react';

export default function WargaDataPage() {
  const [wargaList, setWargaList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});

  // Form State
  const [nama, setNama] = useState('');
  const [blok, setBlok] = useState('');
  const [nomorRumah, setNomorRumah] = useState('');
  const [statusHunian, setStatusHunian] = useState('Pemilik');
  const [noHp, setNoHp] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await wargaService.getAllWarga();
      setWargaList(data);
    } catch (error) {
      console.error('Error loading warga:', error);
      toast.error('Gagal memuat data warga.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formData = { nama, blok, nomorRumah, noHp };
    const formErrors = formRules.warga(formData);
    
    if (hasErrors(formErrors)) {
      setErrors(formErrors);
      toast.error(getFirstError(formErrors));
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    try {
      await wargaService.addWarga({
        nama_kepala_keluarga: nama,
        blok,
        nomor_rumah: nomorRumah,
        status_hunian: statusHunian,
        no_hp: noHp || null,
      });
      toast.success("✓ Data warga berhasil ditambahkan!");
      
      // Reset & Refresh
      setNama('');
      setBlok('');
      setNomorRumah('');
      setNoHp('');
      setStatusHunian('Pemilik');
      setShowForm(false);
      setErrors({});
      await loadData();
    } catch (error) {
      console.error('Error adding warga:', error);
      toast.error("Gagal menyimpan data. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, nama_kk) => {
    if (!window.confirm(`Yakin ingin menghapus data Keluarga ${nama_kk}?`)) return;
    try {
      await wargaService.deleteWarga(id);
      toast.success("✓ Data warga berhasil dihapus!");
      await loadData();
    } catch (error) {
      console.error('Error deleting warga:', error);
      toast.error("Gagal menghapus data.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Data Warga RT</h2>
          <p className="text-slate-500 text-sm mt-1">Kelola direktori warga dan informasi kontak.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? 'secondary' : 'primary'}>
          {showForm ? 'Batal Tambah' : <><UserPlus size={18} className="mr-2" /> Tambah Warga</>}
        </Button>
      </div>

      {showForm && (
        <Card className="border-blue-200 border-2 bg-blue-50/20">
          <CardHeader title="Registrasi Kepala Keluarga Baru" />
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:items-end">
              <Input 
                label="Nama Kepala Keluarga *" 
                placeholder="Misal: Budi Santoso"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                error={errors.nama}
              />
              <Input 
                label="Blok Rumah *" 
                placeholder="A / B / Melati"
                value={blok}
                onChange={(e) => setBlok(e.target.value)}
                error={errors.blok}
              />
              <Input 
                label="Nomor Rumah *" 
                placeholder="12A"
                value={nomorRumah}
                onChange={(e) => setNomorRumah(e.target.value)}
                error={errors.nomorRumah}
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status Hunian</label>
                <select 
                  className="block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                  value={statusHunian}
                  onChange={(e) => setStatusHunian(e.target.value)}
                >
                  <option value="Pemilik">Pemilik Rumah</option>
                  <option value="Penyewa">Penyewa / Kontrak</option>
                  <option value="Kos">Kos / Pendatang</option>
                </select>
              </div>
              <Input 
                label="Nomor WhatsApp" 
                placeholder="08123456789"
                value={noHp}
                onChange={(e) => setNoHp(e.target.value)}
                error={errors.noHp}
              />
              <Button type="submit" isLoading={isSubmitting} className="w-full">
                Simpan Data
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tabel Warga */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200">
                <th className="py-3 px-6 text-xs font-semibold tracking-wide text-slate-500 uppercase">Kepala Keluarga</th>
                <th className="py-3 px-6 text-xs font-semibold tracking-wide text-slate-500 uppercase text-center">Blok & Nomor</th>
                <th className="py-3 px-6 text-xs font-semibold tracking-wide text-slate-500 uppercase">Status</th>
                <th className="py-3 px-6 text-xs font-semibold tracking-wide text-slate-500 uppercase">Kontak</th>
                <th className="py-3 px-6 text-xs font-semibold tracking-wide text-slate-500 uppercase text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">Memuat data...</td></tr>
              ) : wargaList.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500 font-medium pt-8 pb-12">Belum ada data warga terdaftar.</td></tr>
              ) : (
                wargaList.map((warga) => (
                  <tr key={warga.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6 text-sm font-semibold text-slate-800">{warga.nama_kepala_keluarga}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2 text-slate-600 font-medium">
                        <Home size={16} className="text-blue-500" />
                        Blok {warga.blok} No {warga.nomor_rumah}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                        ${warga.status_hunian === 'Pemilik' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                          warga.status_hunian === 'Penyewa' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-slate-100 text-slate-700 border-slate-200'}
                      `}>
                        <UserCheck size={14} /> {warga.status_hunian}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {warga.no_hp ? (
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone size={14} /> {warga.no_hp}
                        </div>
                      ) : <span className="text-slate-400 italic text-xs">Kosong</span>}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => handleDelete(warga.id, warga.nama_kepala_keluarga)}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded transition-colors opacity-0 group-hover:opacity-100"
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
  );
}
