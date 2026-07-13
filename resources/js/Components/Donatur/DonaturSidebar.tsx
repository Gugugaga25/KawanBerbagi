import React from 'react';
import { router } from '@inertiajs/react';
import {
  LayoutDashboard,
  Search,
  PackageCheck,
  Heart,
  UserCircle2,
  Settings,
  LogOut,
} from 'lucide-react';

export type DonaturTabType = 'dashboard' | 'cari' | 'donasi' | 'dampak' | 'profil' | 'pengaturan';

const SidebarItem = ({
  icon: Icon,
  label,
  tabId,
  activeTab,
  onClick,
}: {
  icon: any;
  label: string;
  tabId: DonaturTabType;
  activeTab: string;
  onClick: (id: DonaturTabType) => void;
}) => {
  const active = activeTab === tabId;
  return (
    <button
      onClick={() => onClick(tabId)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-[#124354] text-white font-bold shadow-md shadow-[#124354]/10' 
          : 'text-[#5A7C85] font-medium hover:bg-[#EAE8E3] hover:text-[#124354]'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );
};

interface DonaturSidebarProps {
  activeTab: DonaturTabType;
  onTabChange: (tab: DonaturTabType) => void;
  donorName?: string;
  totalDonations?: number;
}

export default function DonaturSidebar({
  activeTab,
  onTabChange,
  donorName = 'Budi Santoso',
  totalDonations = 12,
}: DonaturSidebarProps) {
  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.post('/logout');
  };

  return (
    <aside className="w-64 bg-white h-full border-r border-gray-200/80 flex flex-col z-20">
      
      {/* Brand mark & Mini Stat */}
      <div className="p-7 pb-5">
        <h1 className="text-2xl font-extrabold text-[#124354] tracking-tight">
          KawanBerbagi<span className="text-[#4A828F]">.</span>
        </h1>
      </div>

      <div className="mx-6 border-b border-gray-100" />

      {/* Navigasi Utama */}
      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#5A7C85]/50 pl-4 mb-2">
          Menu Utama
        </p>
        <SidebarItem icon={LayoutDashboard} label="Dashboard" tabId="dashboard" activeTab={activeTab} onClick={onTabChange} />
        <SidebarItem icon={Search} label="Cari Panti" tabId="cari" activeTab={activeTab} onClick={onTabChange} />
        <SidebarItem icon={PackageCheck} label="Donasi Saya" tabId="donasi" activeTab={activeTab} onClick={onTabChange} />
        <SidebarItem icon={UserCircle2} label="Profil Saya" tabId="profil" activeTab={activeTab} onClick={onTabChange} />
      </nav>

      {/* Footer Navigasi (Pengaturan & Keluar) */}
      <div className="p-4 border-t border-gray-100 space-y-1">    
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors text-sm"
        >
          <LogOut size={18} /> Keluar
        </button>
      </div>
    </aside>
  );
}