import React from 'react';
import { router, usePage, Link } from '@inertiajs/react';
import {
  LayoutDashboard,
  Search,
  PackageCheck,
  UserCircle2,
  LogOut,
  MessageCircle,
  Settings,
} from 'lucide-react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

const COLORS = {
  navy: '#293681',
  teal: '#4274D9',
  mist: '#D0E7E6',
};

export type DonaturTabType = 'dashboard' | 'cari' | 'donasi' | 'dampak' | 'profil' | 'pengaturan' | 'chat';

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
  tabId: DonaturTabType;
  activeTab: string;
  onClick: (id: DonaturTabType) => void;
  unreadCount?: number;
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

interface DonaturSidebarProps {
  activeTab: DonaturTabType;
  onTabChange: (tab: DonaturTabType) => void;
  donaturData?: {
    nama_lengkap: string;
    foto_profil?: string | null;
    kota?: string | null;
  } | null;
  stats?: { totalDonasi: number; pantiTerbantu: number };
}

export default function DonaturSidebar({
  activeTab,
  onTabChange,
  donaturData = null,
  stats = { totalDonasi: 0, pantiTerbantu: 0 },
}: DonaturSidebarProps) {
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

  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  const executeLogout = () => {
    router.post('/logout');
  };

  const namaLengkap = donaturData?.nama_lengkap ?? 'Donatur';
  const initials = namaLengkap.charAt(0).toUpperCase();
  const foto = donaturData?.foto_profil ?? null;
  const kota = donaturData?.kota ?? null;

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

      {/* Navigasi Utama */}
      <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#5A7C85]/50 pl-4 mb-2">
          Menu Utama
        </p>
        <SidebarItem icon={LayoutDashboard} label="Dashboard" tabId="dashboard" activeTab={activeTab} onClick={onTabChange} unreadCount={0} />
        <SidebarItem icon={Search} label="Cari Panti" tabId="cari" activeTab={activeTab} onClick={onTabChange} unreadCount={0} />
        <SidebarItem icon={MessageCircle} label="Pesan Chat" tabId="chat" activeTab={activeTab} onClick={onTabChange} unreadCount={unreadCount} />
        <SidebarItem icon={PackageCheck} label="Donasi Saya" tabId="donasi" activeTab={activeTab} onClick={onTabChange} unreadCount={0} />
      </nav>

      {/* Footer Navigasi */}
      <div className="p-4 border-t border-gray-100 space-y-1">
        <SidebarItem
          icon={Settings}
          label="Pengaturan"
          tabId="pengaturan"
          activeTab={activeTab}
          onClick={onTabChange}
        />
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors text-sm text-left cursor-pointer"
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
            <DangerButton onClick={executeLogout}>
              Ya, Keluar
            </DangerButton>
          </div>
        </div>
      </Modal>
    </aside>
  );
}