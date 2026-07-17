import React from 'react';
import { Search } from 'lucide-react';
import NotificationBell from '@/Components/Donatur/NotificationBell';

const TAB_LABEL: Record<string, string> = {
  dashboard: 'Ringkasan Donasi',
  cari: 'Cari Panti',
  chat: 'Pesan Chat',
  donasi: 'Donasi Saya',
  dampak: 'Riwayat Dampak',
  profil: 'Profil Saya',
};

const COLORS = {
  navy: '#083A4F',
  mist: '#C0D5D6',
};

interface DonaturHeaderProps {
  activeTab: string;
  donaturData?: {
    nama_lengkap: string;
    foto_profil?: string | null;
  } | null;
}

export default function DonaturHeader({ activeTab, donaturData = null }: DonaturHeaderProps) {
  const namaLengkap = donaturData?.nama_lengkap ?? 'Donatur';
  const initials = namaLengkap.charAt(0).toUpperCase();
  const foto = donaturData?.foto_profil ?? null;

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
      
      {/* Sisi Kiri: Badge Panel & Judul Tab Aktif */}
      <div className="flex items-center gap-3">
        <div className="bg-[#F4F3EF] text-[#124354] px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
          Panel Donatur
        </div>
        <h2 className="text-lg font-bold text-[#124354]">
          {TAB_LABEL[activeTab] ?? 'Ringkasan Donasi'}
        </h2>
      </div>

      {/* Sisi Kanan: Pencarian, Notifikasi, & Profil */}
      <div className="flex items-center gap-5">

        {/* Tombol Notifikasi */}
        <NotificationBell />

        {/* Identitas Akun */}
        <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-100">
          {foto ? (
            <img
              src={foto}
              alt={namaLengkap}
              className="w-9 h-9 rounded-full object-cover border-2 shadow-sm"
              style={{ borderColor: COLORS.mist }}
            />
          ) : (
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm"
              style={{ backgroundColor: COLORS.navy, color: '#fff' }}
            >
              {initials}
            </div>
          )}
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-[#124354] leading-tight truncate max-w-[140px]">
              {namaLengkap}
            </p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">
              Donatur
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}