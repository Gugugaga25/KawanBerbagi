import React from 'react';
import { AlertOctagon, RefreshCw, XCircle } from 'lucide-react';
import Modal from '@/Components/Modal';

interface CriticalErrorModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onRetry?: () => void;
  onClose: () => void;
}

export default function CriticalErrorModal({
  isOpen,
  title = 'Terjadi Kesalahan Sistem Kritis',
  message = 'Permintaan Anda gagal diproses oleh server. Silakan coba lagi beberapa saat lagi.',
  onRetry,
  onClose,
}: CriticalErrorModalProps) {
  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onClose={onClose}>
      <div className="p-6 sm:p-8 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
          <AlertOctagon size={32} />
        </div>

        <h3 className="text-xl font-bold text-[#124354] mb-2">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-md mx-auto">
          {message}
        </p>

        {/* Action Buttons (Wajib Berikan Tombol Solusi) */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-all shadow-md shadow-red-600/20 flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} /> Coba Lagi
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold transition-all flex items-center justify-center gap-2"
          >
            <XCircle size={16} /> Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
}
