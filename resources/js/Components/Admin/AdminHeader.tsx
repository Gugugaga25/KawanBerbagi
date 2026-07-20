import React from 'react';
import { Search, Bell, Flag, Building2 } from 'lucide-react';
import Dropdown from '@/Components/Dropdown';
import { Link } from '@inertiajs/react';

interface AdminHeaderProps {
  activeTab: string;
  laporans?: any[];
  pantis?: any[];
}

export default function AdminHeader({ activeTab, laporans = [], pantis = [] }: AdminHeaderProps) {
  const pendingReports = laporans.filter(r => r.status === 'pending');
  const pendingPantis = pantis.filter(p => p.status === 'Pending' || p.status === 'pending');

  const notifications = [
    ...pendingReports.map(r => ({
      id: `rep-${r.id}`,
      type: 'report',
      title: `Laporan: ${r.terlapor_nama}`,
      desc: r.alasan,
      link: '/admin/dashboard?tab=laporan',
      icon: <Flag size={14} />
    })),
    ...pendingPantis.map(p => ({
      id: `panti-${p.id}`,
      type: 'panti',
      title: `Pendaftaran Baru: ${p.nama}`,
      desc: `Panti menunggu verifikasi admin.`,
      link: '/admin/dashboard?tab=panti',
      icon: <Building2 size={14} />
    }))
  ];

  return (
    <header className="h-20 bg-white border-b border-gray-200/80 flex items-center justify-between px-8 z-10 shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-[#4274D9] uppercase tracking-wider bg-[#D0E7E6]/40 px-2.5 py-1 rounded-md">
          Admin Panel
        </span>
        <h2 className="text-lg font-bold text-[#293681] capitalize">
          {activeTab === 'dashboard' ? 'Dashboard Admin' : `Manajemen ${activeTab}`}
        </h2>
      </div>
      
      <div className="flex items-center gap-5">
        
        <Dropdown>
          <Dropdown.Trigger>
            <button className="relative p-2 text-gray-400 hover:text-[#124354] hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>
          </Dropdown.Trigger>

          <Dropdown.Content align="right" width="64" contentClasses="py-2 bg-white border border-gray-100 shadow-xl rounded-xl z-50">
            <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
              <p className="text-sm font-bold text-[#124354]">Notifikasi Admin</p>
              <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">{notifications.length}</span>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-6 flex flex-col items-center justify-center text-center">
                  <Bell size={24} className="text-gray-300 mb-2" />
                  <p className="text-sm font-bold text-gray-500">Semua Terkendali!</p>
                  <p className="text-xs text-gray-400 mt-1">Tidak ada notifikasi baru untuk saat ini.</p>
                </div>
              ) : (
                notifications.slice(0, 5).map(notif => (
                  <Link 
                    key={notif.id}
                    href={notif.link}
                    className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-lg ${notif.type === 'report' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                        {notif.icon}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#124354] line-clamp-1">{notif.title}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{notif.desc}</p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
            {notifications.length > 0 && (
              <div className="block w-full text-center px-4 py-2 text-xs text-gray-400 bg-gray-50/50 rounded-b-xl border-t border-gray-100">
                Pilih notifikasi untuk melihat detail
              </div>
            )}
          </Dropdown.Content>
        </Dropdown>
        
        <div className="flex items-center gap-3 border-l border-gray-200 pl-5">
          <div className="w-9 h-9 bg-[#124354] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
            A
          </div>
          <div className="hidden lg:block">
            <p className="text-xs font-bold text-[#124354] leading-none">Admin Utama</p>
            <p className="text-[10px] text-gray-400 mt-1 leading-none">Superadmin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
