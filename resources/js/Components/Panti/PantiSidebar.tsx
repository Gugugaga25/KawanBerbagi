import React from 'react';
import { router } from '@inertiajs/react';
import {
  LayoutDashboard,
  ClipboardList,
  PackageCheck,
  Building2,
  Settings,
  LogOut,
} from 'lucide-react';

export type PantiTabType = 'dashboard' | 'kebutuhan' | 'donasi' | 'profil';

const SidebarItem = ({
  icon: Icon,
  label,
  tabId,
  activeTab,
  onClick,
}: {
  icon: any;
  label: string;
  tabId: PantiTabType;
  activeTab: string;
  onClick: (id: PantiTabType) => void;
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

interface PantiSidebarProps {
  activeTab: PantiTabType;
  onTabChange: (tab: PantiTabType) => void;
  orgName?: string;
  isVerified?: boolean;
}

export default function PantiSidebar({
  activeTab,
  onTabChange,
  orgName = 'Panti Kasih Ibu',
  isVerified = true,
}: PantiSidebarProps) {
  
  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.post('/logout');
  };

  return (
    <aside className="w-64 bg-white h-full border-r border-gray-200/80 flex flex-col z-20">
      {/* Brand mark */}
      <div className="p-7 pb-5">
        <h1 className="text-2xl font-extrabold text-[#124354] tracking-tight">
          KawanBerbagi<span className="text-[#4A828F]">.</span>
        </h1>
      </div>

      <div className="mx-6 border-b border-gray-100" />

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#5A7C85]/50 pl-4 mb-2">
          Menu Utama
        </p>
        <SidebarItem icon={LayoutDashboard} label="Dashboard" tabId="dashboard" activeTab={activeTab} onClick={onTabChange} />
        <SidebarItem icon={ClipboardList} label="Kebutuhan Kami" tabId="kebutuhan" activeTab={activeTab} onClick={onTabChange} />
        <SidebarItem icon={PackageCheck} label="Donasi Masuk" tabId="donasi" activeTab={activeTab} onClick={onTabChange} />
        <SidebarItem icon={Building2} label="Profil Panti" tabId="profil" activeTab={activeTab} onClick={onTabChange} />
      </nav>

      {/* Account footer */}
      <div className="p-4 border-t border-gray-100 space-y-1">        
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[#5A7C85] hover:bg-[#EAE8E3] hover:text-[#124354] rounded-xl font-medium transition-colors text-sm">
          <Settings size={18} /> Pengaturan
        </button>
        
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