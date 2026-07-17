import React from 'react';
import { Search, Bell } from 'lucide-react';

interface AdminHeaderProps {
  activeTab: string;
}

export default function AdminHeader({ activeTab }: AdminHeaderProps) {
  return (
    <header className="h-20 bg-white border-b border-gray-200/80 flex items-center justify-between px-8 z-10 shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-[#4A828F] uppercase tracking-wider bg-[#F4F3EF] px-2.5 py-1 rounded-md">
          Admin Panel
        </span>
        <h2 className="text-lg font-bold text-[#124354] capitalize">
          {activeTab === 'dashboard' ? 'Dashboard Admin' : `Manajemen ${activeTab}`}
        </h2>
      </div>
      
      <div className="flex items-center gap-5">
        
        <button className="relative p-2 text-gray-400 hover:text-[#124354] hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
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
