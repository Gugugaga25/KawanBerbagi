import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { router } from '@inertiajs/react';
import AdminSidebar, { TabType } from '@/Components/Admin/AdminSidebar';
import AdminHeader from '@/Components/Admin/AdminHeader';

interface AdminLayoutProps {
    children: React.ReactNode;
    activeTab?: TabType;
}

export default function AdminLayout({ children, activeTab = 'dashboard' }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: TabType) => {
    setIsMobileMenuOpen(false);
    // Use Inertia routing for navigation between tabs from standalone pages
    const url = tab === 'dashboard' ? '/admin/dashboard' : `/admin/dashboard?tab=${tab}`;
    router.get(url);
  };

  return (
    <div className="flex h-screen bg-[#F4F3EF] font-sans overflow-hidden">
      {/* Mobile Dark Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <div className={`
        fixed inset-y-0 left-0 z-50 h-full transform transition-transform duration-300 ease-in-out w-64 lg:w-64 lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-[#083A4F] z-30">
          <div className="flex items-center gap-3 text-white">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Menu size={20} />
            </button>
            <span className="font-extrabold tracking-wide uppercase text-sm">Pusat Kendali</span>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block">
          <AdminHeader activeTab={activeTab} />
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
