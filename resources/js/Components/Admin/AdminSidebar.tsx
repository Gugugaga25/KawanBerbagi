import React from 'react';
import { router } from '@inertiajs/react';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  PackageSearch, 
  Flag, // Ditambahkan untuk menu laporan
  Settings, 
  LogOut 
} from 'lucide-react';

import { Link } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

// Ditambahkan 'laporan' ke dalam tipe Tab
export type TabType = 'dashboard' | 'panti' | 'donatur' | 'kebutuhan' | 'laporan';

const SidebarItem = ({ icon: Icon, label, tabId, activeTab, onClick }: { 
  icon: any, label: string, tabId: TabType, activeTab: string, onClick: (id: TabType) => void 
}) => (
  <button 
    onClick={() => onClick(tabId)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      activeTab === tabId 
        ? 'bg-[#124354] text-white font-bold shadow-md shadow-[#124354]/10' 
        : 'text-[#5A7C85] font-medium hover:bg-[#EAE8E3] hover:text-[#124354]'
    }`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

interface AdminSidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  
  const handleLogout = () => {
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
        <SidebarItem icon={Building2} label="Manajemen Panti" tabId="panti" activeTab={activeTab} onClick={onTabChange} />
        <SidebarItem icon={Users} label="Data Donatur" tabId="donatur" activeTab={activeTab} onClick={onTabChange} />
        <SidebarItem icon={PackageSearch} label="Kebutuhan" tabId="kebutuhan" activeTab={activeTab} onClick={onTabChange} />
        
        {/* Navigasi Baru untuk Halaman Daftar Laporan */}
        <SidebarItem icon={Flag} label="Laporan & Aduan" tabId="laporan" activeTab={activeTab} onClick={onTabChange} />
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[#5A7C85] hover:bg-[#EAE8E3] hover:text-[#124354] rounded-xl font-medium transition-colors text-sm">
          <Settings size={18} /> Pengaturan
        </button>
        <button 
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors text-sm text-left"
        >
          <LogOut size={18} /> Keluar
        </button>
      </div>

      <Modal show={showLogoutModal} onClose={() => setShowLogoutModal(false)} maxWidth="sm">
        <div className="p-6">
          <h2 className="text-lg font-bold text-[#124354]">
            Konfirmasi Keluar
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Apakah Anda yakin ingin keluar?
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <SecondaryButton onClick={() => setShowLogoutModal(false)}>
              Batal
            </SecondaryButton>
            <DangerButton onClick={handleLogout}>
              Ya, Keluar
            </DangerButton>
          </div>
        </div>
      </Modal>
    </aside>
  );
}