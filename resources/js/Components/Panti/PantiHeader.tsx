import React from 'react';
import { Search } from 'lucide-react';
import NotificationBell from '@/Components/Donatur/NotificationBell';

const TAB_LABEL: Record<string, string> = {
  dashboard: 'Dashboard Panti',
  kebutuhan: 'Kebutuhan & Wishlist',
  chat: 'Pesan Chat',
  donasi: 'Donasi Masuk',
  profil: 'Profil & Legalitas',
};

interface PantiHeaderProps {
  activeTab: string;
  orgName?: string;
}

export default function PantiHeader({ activeTab, orgName = 'Panti Kasih Ibu' }: PantiHeaderProps) {
  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
      
      {/* Sisi Kiri: Badge Panel & Judul Tab Aktif */}
      <div className="flex items-center gap-3">
        <div className="bg-[#F4F3EF] text-[#124354] px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
          Panel Panti
        </div>
        <h2 className="text-lg font-bold text-[#124354]">
          {TAB_LABEL[activeTab] ?? 'Dashboard Panti'}
        </h2>
      </div>

      {/* Sisi Kanan: Pencarian, Notifikasi, & Profil Pengurus */}
      <div className="flex items-center gap-5">

        {/* Tombol Notifikasi */}
        <NotificationBell userType="panti" />

        {/* Identitas Akun */}
        <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-100">
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm bg-[#124354] text-white shadow-sm">
            {orgName.charAt(0)}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-[#124354] leading-tight truncate max-w-[140px]">
              {orgName}
            </p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">
              Pengurus Panti
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}