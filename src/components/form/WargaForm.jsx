import React from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function WargaForm({
  nama,
  setNama,
  blok,
  setBlok,
  nomorRumah,
  setNomorRumah,
  statusHunian,
  setStatusHunian,
  noHp,
  setNoHp,
  errors,
  isSubmitting,
  onSubmit,
  submitLabel = "Simpan Data"
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Nama Kepala Keluarga */}
      <Input
        label="Nama Kepala Keluarga"
        placeholder="Contoh: Budi Santoso"
        value={nama}
        onChange={e => setNama(e.target.value)}
        error={errors.nama}
      />

      {/* Blok */}
      <Input
        label="Blok"
        placeholder="Contoh: A, B, C"
        value={blok}
        onChange={e => setBlok(e.target.value)}
        error={errors.blok}
      />

      {/* Nomor Rumah */}
      <Input
        label="Nomor Rumah"
        placeholder="Contoh: 01, 02, 03"
        value={nomorRumah}
        onChange={e => setNomorRumah(e.target.value)}
        error={errors.nomorRumah}
      />

      {/* Status Hunian */}
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

      {/* Nomor WhatsApp */}
      <Input
        label="Nomor WhatsApp"
        placeholder="08123456789"
        value={noHp}
        onChange={e => setNoHp(e.target.value)}
        error={errors.noHp}
      />

      {/* Submit Button */}
      <Button type="submit" isLoading={isSubmitting} className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
