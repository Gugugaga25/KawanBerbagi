import React from 'react';
import { router, usePage } from '@inertiajs/react';
import {
  LayoutDashboard,
  ClipboardList,
  PackageCheck,
  Building2,
  Settings,
  LogOut,
  MessageCircle,
} from 'lucide-react';

export type PantiTabType = 'dashboard' | 'kebutuhan' | 'donasi' | 'profil' | 'pengaturan' | 'chat';

const SidebarItem = ({
  icon: Icon,
  label,
  tabId,
  activeTab,
  onClick,
  unreadCount = 0,
}: {
  icon: any;
  label: string;
  tabId: PantiTabType;
  activeTab: string;
  onClick: (id: PantiTabType) => void;
  unreadCount?: number;
}) => {
  const active = activeTab === tabId;

  return (
    <button
      onClick={() => onClick(tabId)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-[#124354] text-white font-bold shadow-md shadow-[#124354]/10' 
          : 'text-[#5A7C85] font-medium hover:bg-[#EAE8E3] hover:text-[#124354]'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} />
        <span>{label}</span>
      </div>
      {tabId === 'chat' && unreadCount > 0 && (
        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 shadow-xs animate-pulse" />
      )}
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
  const { auth } = usePage().props as any;
  const [unreadCount, setUnreadCount] = React.useState(auth?.unread_chat_count ?? 0);

  React.useEffect(() => {
    setUnreadCount(auth?.unread_chat_count ?? 0);
  }, [auth?.unread_chat_count]);

  React.useEffect(() => {
    const checkUnread = async () => {
      try {
        const res = await fetch('/chat/unread-count', {
          headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
        });
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.unread_chat_count);
        }
      } catch (e) {
        // ignore
      }
    };

    checkUnread();
    const interval = setInterval(checkUnread, 10000);

    const handleUpdate = (e: CustomEvent) => {
      setUnreadCount(e.detail.unread_chat_count);
    };
    window.addEventListener('unread-chat-count-updated', handleUpdate as any);

    return () => {
      clearInterval(interval);
      window.removeEventListener('unread-chat-count-updated', handleUpdate as any);
    };
  }, []);

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
        <SidebarItem icon={LayoutDashboard} label="Dashboard" tabId="dashboard" activeTab={activeTab} onClick={onTabChange} unreadCount={0} />
        <SidebarItem icon={ClipboardList} label="Kebutuhan Kami" tabId="kebutuhan" activeTab={activeTab} onClick={onTabChange} unreadCount={0} />
        <SidebarItem icon={MessageCircle} label="Pesan Chat" tabId="chat" activeTab={activeTab} onClick={onTabChange} unreadCount={unreadCount} />
        <SidebarItem icon={PackageCheck} label="Donasi Masuk" tabId="donasi" activeTab={activeTab} onClick={onTabChange} unreadCount={0} />
        <SidebarItem icon={Building2} label="Profil Panti" tabId="profil" activeTab={activeTab} onClick={onTabChange} unreadCount={0} />
      </nav>

      {/* Account footer */}
      <div className="p-4 border-t border-gray-100 space-y-1">        
        <button 
          onClick={() => onTabChange('pengaturan')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all text-sm ${
            activeTab === 'pengaturan'
              ? 'bg-[#124354] text-white font-bold shadow-md shadow-[#124354]/10'
              : 'text-[#5A7C85] hover:bg-[#EAE8E3] hover:text-[#124354]'
          }`}
        >
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