import React from 'react';
import { Search, Home } from 'lucide-react';
import { Link } from '@inertiajs/react';
import NotificationBell from '@/Components/Donatur/NotificationBell';

const TAB_LABEL: Record<string, string> = {
  dashboard: 'Ringkasan Donasi',
  cari: 'Cari Panti',
  chat: 'Pesan Chat',
  donasi: 'Donasi Saya',
  dampak: 'Riwayat Dampak',
  profil: 'Profil Saya',
  pengaturan: 'Pengaturan Akun',
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
        <div className="bg-[#4274D9]/10 text-[#4274D9] border border-[#4274D9]/20 px-2.5 py-1 rounded-lg text-[12px] font-bold uppercase tracking-wider">
          Panel Donatur
        </div>
        <h2 className="text-lg font-bold text-[#293681]">
          {TAB_LABEL[activeTab] ?? 'Ringkasan Donasi'}
        </h2>
      </div>

      {/* Sisi Kanan: Lihat Beranda, Notifikasi, & Profil */}
      <div className="flex items-center gap-4">

        {/* Tombol Kembali ke Landing Page */}
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 text-[#293681] hover:bg-[#4274D9]/10 hover:text-[#4274D9] transition-all text-xs font-bold shadow-xs border border-slate-200/60"
          title="Kembali ke Landing Page"
        >
          <Home size={14} />
          <span className="hidden sm:inline">Lihat Beranda</span>
        </Link>

        {/* Tombol Notifikasi */}
        <NotificationBell />

        {/* Identitas Akun */}
        <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-100">
          {foto ? (
            <img
              src={foto}
              alt={namaLengkap}
              className="w-9 h-9 rounded-full object-cover border-2 border-[#4274D9] shadow-sm"
            />
          ) : (
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-[12pt] shadow-sm bg-[#4274D9] text-white shadow-[#4274D9]/20"
            >
              {initials}
            </div>
          )}
          <div className="hidden lg:block text-left">
            <p className="text-[10pt] font-extrabold text-[#293681] leading-tight truncate max-w-[140px]">
              {namaLengkap}
            </p>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
              Donatur
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}