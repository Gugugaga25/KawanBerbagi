import React from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import {
  LayoutDashboard,
  Users,
  Building2,
  PackageSearch,
  Flag, // Ditambahkan untuk menu laporan
  Settings,
  LogOut,
  MessageSquare
} from 'lucide-react';

import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

// Ditambahkan 'laporan', 'chat', dan 'pengaturan' ke dalam tipe Tab
export type TabType = 'dashboard' | 'panti' | 'donatur' | 'chat' | 'kebutuhan' | 'laporan' | 'pengaturan';

const SidebarItem = ({ icon: Icon, label, tabId, activeTab, onClick, unreadCount = 0 }: {
  icon: any, label: string, tabId: TabType, activeTab: string, onClick: (id: TabType) => void, unreadCount?: number
}) => {
  const active = activeTab === tabId;
  return (
    <button
      onClick={() => onClick(tabId)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${active
        ? 'bg-[#4274D9] text-white font-bold shadow-md shadow-[#4274D9]/25'
        : 'text-[#293681] font-medium hover:bg-[#4274D9]/10 hover:text-[#4274D9]'
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

interface AdminSidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const { auth } = usePage().props as any;
  const [unreadCount, setUnreadCount] = React.useState(auth?.unread_chat_count ?? 0);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

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

  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <aside className="w-64 bg-white h-full border-r border-gray-200/80 flex flex-col z-20">
      {/* Brand mark */}
      <Link href="/" className="p-7 pb-5 flex items-center gap-2 hover:opacity-80 transition-all group" title="Kembali ke Landing Page">
        <img src="/images/logokb2.png" alt="Logo KawanBerbagi" className="w-8 h-8 object-contain group-hover:scale-105 transition-transform" />
        <h1 className="text-2xl font-extrabold text-[#293681] tracking-tight">
          KawanBerbagi<span className="text-[#4274D9]">.</span>
        </h1>
      </Link>

      <div className="mx-6 border-b border-gray-100" />

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#5A7C85]/50 pl-4 mb-2">
          Menu Utama
        </p>
        <SidebarItem icon={LayoutDashboard} label="Dashboard" tabId="dashboard" activeTab={activeTab} onClick={onTabChange} />
        <SidebarItem icon={Building2} label="Manajemen Panti" tabId="panti" activeTab={activeTab} onClick={onTabChange} />
        <SidebarItem icon={Users} label="Data Donatur" tabId="donatur" activeTab={activeTab} onClick={onTabChange} />
        <SidebarItem icon={MessageSquare} label="Pesan Chat" tabId="chat" activeTab={activeTab} onClick={onTabChange} unreadCount={unreadCount} />
        <SidebarItem icon={PackageSearch} label="Kebutuhan" tabId="kebutuhan" activeTab={activeTab} onClick={onTabChange} />
        <SidebarItem icon={Flag} label="Laporan & Aduan" tabId="laporan" activeTab={activeTab} onClick={onTabChange} />


      </nav>

      <div className="p-4 border-t border-gray-100 space-y-1">
        <button
          onClick={() => onTabChange('pengaturan')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold transition-all text-sm ${
            activeTab === 'pengaturan'
              ? 'bg-[#4274D9] text-white font-extrabold shadow-md shadow-[#4274D9]/25'
              : 'text-[#293681] hover:bg-[#4274D9]/10 hover:text-[#4274D9]'
          }`}
        >
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
          <h2 className="text-lg font-bold text-[#293681]">
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