import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  PackageSearch, 
  Settings, 
  LogOut 
} from 'lucide-react';

export type TabType = 'dashboard' | 'panti' | 'donatur' | 'kebutuhan';

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
  return (
    <aside className="w-64 bg-white border-r border-gray-200/80 flex flex-col z-20">
      <div className="p-8">
        <h1 className="text-2xl font-extrabold text-[#124354] tracking-tight">
          KawanBerbagi<span className="text-[#4A828F]">.</span>
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        <SidebarItem icon={LayoutDashboard} label="Dashboard" tabId="dashboard" activeTab={activeTab} onClick={onTabChange} />
        <SidebarItem icon={Building2} label="Manajemen Panti" tabId="panti" activeTab={activeTab} onClick={onTabChange} />
        <SidebarItem icon={Users} label="Data Donatur" tabId="donatur" activeTab={activeTab} onClick={onTabChange} />
        <SidebarItem icon={PackageSearch} label="Kebutuhan" tabId="kebutuhan" activeTab={activeTab} onClick={onTabChange} />
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[#5A7C85] hover:bg-[#EAE8E3] hover:text-[#124354] rounded-xl font-medium transition-colors text-sm">
          <Settings size={18} /> Pengaturan
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors text-sm">
          <LogOut size={18} /> Keluar
        </button>
      </div>
    </aside>
  );
}
