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
          {activeTab === 'dashboard' ? 'Overview Dashboard' : `Manajemen ${activeTab}`}
        </h2>
      </div>
      
      <div className="flex items-center gap-5">
        <div className="relative hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Cari data di sistem..." 
            className="pl-10 pr-4 py-2 bg-[#F4F3EF] rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4A828F] text-[#124354] w-60 transition-all placeholder:text-gray-400"
          />
        </div>
        
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
