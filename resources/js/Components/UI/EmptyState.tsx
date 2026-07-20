import React from 'react';
import { SearchX, Inbox, CheckCircle2, RotateCcw, Plus } from 'lucide-react';

export type EmptyStateMode = 'empty' | 'search' | 'accomplishment';

interface EmptyStateProps {
  mode?: EmptyStateMode;
  icon?: React.ElementType;
  title?: string;
  description?: string;
  searchQuery?: string;
  onResetSearch?: () => void;
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
}

export default function EmptyState({
  mode = 'empty',
  icon: CustomIcon,
  title,
  description,
  searchQuery,
  onResetSearch,
  onAction,
  actionLabel,
  className = '',
}: EmptyStateProps) {
  if (mode === 'accomplishment') {
    return (
      <div className={`flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white rounded-3xl border border-dashed border-gray-200 ${className}`}>
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4 border border-emerald-100 shadow-xs">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-xl font-black text-[#124354] mb-1">
          {title || 'Semua Beres!'}
        </h3>
        <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
          {description || 'Tidak ada antrean tugas atau laporan yang memerlukan tindakan Anda saat ini.'}
        </p>
      </div>
    );
  }

  if (mode === 'search') {
    return (
      <div className={`flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white rounded-3xl border border-gray-100 ${className}`}>
        <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4 border border-amber-100">
          <SearchX size={28} />
        </div>
        <h3 className="text-lg font-extrabold text-[#124354] mb-1">
          {title || 'Pencarian Tidak Ditemukan'}
        </h3>
        <p className="text-xs text-gray-500 max-w-md leading-relaxed mb-6">
          {searchQuery ? (
            <>Tidak ada hasil data yang cocok dengan kata kunci <span className="font-bold text-[#124354]">"{searchQuery}"</span>. Silakan periksa kembali ejaan atau reset filter pencarian.</>
          ) : (
            description || 'Tidak ditemukan data yang sesuai dengan kriteria filter yang Anda pilih.'
          )}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {onResetSearch && (
            <button
              onClick={onResetSearch}
              className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#124354] text-xs font-bold transition-all flex items-center gap-2"
            >
              <RotateCcw size={14} /> Reset Filter & Pencarian
            </button>
          )}
          {onAction && actionLabel && (
            <button
              onClick={onAction}
              className="px-4 py-2.5 rounded-xl bg-[#083A4F] hover:bg-[#124354] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
            >
              <Plus size={14} /> {actionLabel}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Initial Empty Mode
  const Icon = CustomIcon || Inbox;

  return (
    <div className={`flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white rounded-3xl border border-gray-100 ${className}`}>
      <div className="w-16 h-16 bg-[#124354]/10 text-[#124354] rounded-2xl flex items-center justify-center mb-4">
        <Icon size={32} />
      </div>
      <h3 className="text-xl font-black text-[#124354] mb-1">
        {title || 'Belum Ada Data'}
      </h3>
      <p className="text-xs text-gray-500 max-w-sm leading-relaxed mb-6">
        {description || 'Mulai daftarkan data baru untuk mulai mengelola informasi di sistem.'}
      </p>

      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-[#083A4F] hover:bg-[#124354] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-[#083A4F]/10"
        >
          <Plus size={16} /> {actionLabel}
        </button>
      )}
    </div>
  );
}
