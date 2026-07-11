import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';

import PantiSidebar, { PantiTabType } from '@/Components/Panti/PantiSidebar';
import PantiHeader from '@/Components/Panti/PantiHeader';
import PantiOverview from './PantiOverview';
import PantiWishlist from './PantiWishlist';
import PantiProfile from './PantiProfile';
import PantiDonasiMasuk from './PantiDonasiMasuk';

const COLORS = {
  navy: "#083A4F",
  gold: "#A58D66",
  mist: "#C0D5D6",
  teal: "#407E8C",
  cream: "#E5E1DD",
};

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="rounded-[2rem] p-10 flex flex-col items-center justify-center text-center bg-white border border-gray-100 shadow-sm">
      <p className="text-sm font-bold mb-1" style={{ color: COLORS.navy }}>
        {title}
      </p>
      <p className="text-xs text-[#5A7C85]">
        Halaman ini sedang dalam pengembangan.
      </p>
    </div>
  );
}

export default function PantiDashboard() {
  const [activeTab, setActiveTab] = useState<PantiTabType>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as PantiTabType;

      if (tabParam && ['dashboard', 'kebutuhan', 'donasi', 'profil'].includes(tabParam)) {
        setActiveTab(tabParam);
      } else {
        setActiveTab('dashboard');
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const handleTabChange = (tab: PantiTabType) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    
    const newUrl = tab === 'dashboard'
      ? window.location.pathname
      : `${window.location.pathname}?tab=${tab}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'kebutuhan': return <PantiWishlist />;
      case 'donasi': return <PantiDonasiMasuk />;
      case 'profil': return <PantiProfile />;
      case 'dashboard':
      default:
        return <PantiOverview />;
    }
  };

  return (
    <div className="flex h-screen font-sans bg-white text-[#124354] overflow-hidden">
      
      {/* ================= OVERLAY MOBILE ================= */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <div className={`
        fixed inset-y-0 left-0 z-50 h-full transform transition-transform duration-300 ease-in-out w-64 lg:w-64 lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <PantiSidebar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#F4F3EF]">
        
        {/* Header Khusus Mobile (Warna Navy sesuai desain Admin) */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-[#083A4F] z-30">
          <div className="flex items-center gap-3 text-white">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Menu size={20} />
            </button>
            <span className="font-extrabold tracking-wide uppercase text-sm">Dashboard Yayasan</span>
          </div>
        </div>

        {/* Header Desktop Asli */}
        <div className="hidden lg:block">
          <PantiHeader activeTab={activeTab} />
        </div>

        {/* Konten */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}