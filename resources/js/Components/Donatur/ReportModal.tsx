import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { Flag, X, AlertTriangle, Image as ImageIcon, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useToast } from '@/Components/UI/Toast';

export interface ReportTargetData {
  tipe_laporan: 'panti' | 'postingan' | 'keuangan';
  id_target: string;
  judul_target: string;
  target_image?: string;
  target_content?: string;
  id_shelter?: number;
}

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetData: ReportTargetData | null;
}

const REASON_OPTIONS = [
  'Informasi / Konten Tidak Sesuai',
  'Indikasi Penipuan / Data Palsu',
  'Mengandung Unsur SARA / Kekerasan',
  'Spam atau Iklan Komersial',
  'Lainnya',
];

export default function ReportModal({ isOpen, onClose, targetData }: ReportModalProps) {
  const [alasan, setAlasan] = useState(REASON_OPTIONS[0]);
  const [catatanTambahan, setCatatanTambahan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  if (!targetData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      const response = await fetch('/laporan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({
          tipe_laporan: targetData.tipe_laporan,
          id_target: targetData.id_target,
          judul_target: targetData.judul_target,
          target_image: targetData.target_image || null,
          target_content: targetData.target_content || null,
          id_shelter: targetData.id_shelter || null,
          alasan,
          catatan_tambahan: catatanTambahan,
        }),
      });

      if (response.ok) {
        showToast('Laporan Anda berhasil dikirim dan akan segera ditinjau oleh tim Admin KawanBerbagi.', 'success', 'Laporan Berhasil Dikirim');
        onClose();
        setCatatanTambahan('');
      } else {
        const errorData = await response.json().catch(() => ({}));
        showToast(errorData.message || 'Gagal mengirim laporan. Silakan periksa kembali formulir Anda.', 'error', 'Gagal Mengirim Laporan');
      }
    } catch (err) {
      console.error('Error submitting report:', err);
      showToast('Terjadi gangguan koneksi jaringan saat mengirim laporan.', 'error', 'Gagal Mengirim Laporan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} maxWidth="md">
      <div className="p-6 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
              <Flag size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#293681]">
                Laporkan Konten / Postingan
              </h3>
              <p className="text-xs text-gray-500 font-medium">Pengaduan Anda akan ditinjau secara rahasia oleh Admin.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          {/* Scrollable Content Body */}
          <div className="overflow-y-auto flex-1 pr-1 pb-2 space-y-4">
            {/* Target Snapshot Preview Card */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black bg-rose-600 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {targetData.tipe_laporan}
                </span>
                <span className="text-[11px] font-semibold text-gray-400">
                  ID: {targetData.id_target}
                </span>
              </div>

              <h4 className="font-extrabold text-sm text-[#293681]">{targetData.judul_target}</h4>

              {/* Pratinjau Foto Konten jika ada */}
              {targetData.target_image && (
                <div className="space-y-1 mt-2">
                  <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1 uppercase tracking-wider">
                    <ImageIcon size={12} className="text-[#4274D9]" /> Foto Konten Dilaporkan
                  </span>
                  <div className="w-full h-44 rounded-xl overflow-hidden border border-gray-200 bg-gray-900/5">
                    <img src={targetData.target_image} alt="Report Target" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              {/* Pratinjau Teks Konten jika ada */}
              {targetData.target_content && (
                <div className="space-y-1 mt-2">
                  <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1 uppercase tracking-wider">
                    <FileText size={12} className="text-amber-600" /> Teks Deskripsi Konten Dilaporkan
                  </span>
                  <div className="text-xs text-gray-700 bg-white p-3.5 rounded-xl border border-amber-200/60 font-mono leading-relaxed whitespace-pre-line shadow-2xs">
                    "{targetData.target_content}"
                  </div>
                </div>
              )}
            </div>

            {/* Form Pengaduan Fields */}
            <div>
              <label className="block text-xs font-bold text-[#293681] mb-1.5">
                Alasan Utama Pengaduan:
              </label>
              <select
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-[#293681] focus:border-[#4274D9] focus:outline-none shadow-xs"
              >
                {REASON_OPTIONS.map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#293681] mb-1.5">
                Catatan Tambahan (Opsional):
              </label>
              <textarea
                rows={3}
                value={catatanTambahan}
                onChange={(e) => setCatatanTambahan(e.target.value)}
                placeholder="Berikan detail kronologi atau alasan mengapa postingan/konten ini dianggap tidak sesuai..."
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-[#293681] focus:border-[#4274D9] focus:outline-none shadow-xs resize-none"
              />
            </div>
          </div>

          {/* Fixed Action Buttons Footer */}
          <div className="flex justify-between items-center pt-3 mt-2 border-t border-gray-100 shrink-0">
            <SecondaryButton onClick={onClose} disabled={isSubmitting}>
              Batal
            </SecondaryButton>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-extrabold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Flag size={14} /> {isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
