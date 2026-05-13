import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { formatRp } from '../../utils/formatting';

/**
 * Modal component for viewing and managing iuran payment details
 */
export default function IuranPaymentModal({ isOpen, onClose, onConfirm, iuran, isLoading = false }) {
  const [paymentProof, setPaymentProof] = useState('');

  if (!iuran) return null;

  const handleConfirm = () => {
    onConfirm(paymentProof);
    setPaymentProof('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Verifikasi Pembayaran Iuran"
      size="md"
    >
      <div className="space-y-4">
        {/* Iuran Details */}
        <div className="bg-slate-50 rounded-lg p-4 space-y-3 border border-slate-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Warga</span>
            <span className="text-sm font-semibold text-slate-800">
              {iuran.warga?.nama_kepala_keluarga || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Alamat</span>
            <span className="text-sm font-semibold text-slate-800">
              Blok {iuran.warga?.blok} No. {iuran.warga?.nomor_rumah}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-200">
            <span className="text-sm text-slate-600">Nominal</span>
            <span className="text-lg font-bold text-emerald-600">
              {formatRp(iuran.nominal)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Bulan</span>
            <span className="text-sm font-semibold text-slate-800">{iuran.bulan}</span>
          </div>
        </div>

        {/* Payment Proof Input (Optional) */}
        <div>
          <Input
            label="Bukti Pembayaran (Opsional)"
            placeholder="No. referensi transfer, no. kwitansi, dll"
            value={paymentProof}
            onChange={(e) => setPaymentProof(e.target.value)}
            maxLength={100}
          />
          <p className="text-xs text-slate-500 mt-1">
            Anda bisa input nomor referensi atau catatan pembayaran
          </p>
        </div>

        {/* Confirmation Message */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <p className="text-sm text-emerald-700">
            ✓ Status akan berubah menjadi <strong>Lunas</strong> dan dicatat dengan tanggal hari ini
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end pt-2">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            onClick={handleConfirm}
            isLoading={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Tandai Lunas
          </Button>
        </div>
      </div>
    </Modal>
  );
}
