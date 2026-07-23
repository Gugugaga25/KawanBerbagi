import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { router } from '@inertiajs/react';

import PantiSidebar, { PantiTabType } from '@/Components/Panti/PantiSidebar';
import PantiHeader from '@/Components/Panti/PantiHeader';
import PantiOverview from './PantiOverview';
import PantiWishlist from './PantiWishlist';
import PantiProfile from './PantiProfile';
import PantiDonasiMasuk from './PantiDonasiMasuk';
import PantiSettings from './PantiSettings';

export default function PantiDashboard({ auth, pantiData, needs = [], donations = [], notifications = [] }: { auth: any, pantiData?: any, needs?: any[], donations?: any[], notifications?: any[] }) {
  const [activeTab, setActiveTab] = useState<PantiTabType>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as PantiTabType;

      if (tabParam && ['dashboard', 'kebutuhan', 'donasi', 'profil', 'pengaturan'].includes(tabParam)) {
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
    if (tab === 'chat') {
      router.visit(route('panti.chat'));
      return;
    }
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    
    const newUrl = tab === 'dashboard'
      ? window.location.pathname
      : `${window.location.pathname}?tab=${tab}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  // Helper Judul Dinamis untuk Header Mobile
  const getMobileTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard';
      case 'kebutuhan': return 'Kebutuhan & Wishlist';
      case 'chat': return 'Pesan Chat';
      case 'donasi': return 'Donasi Masuk';
      case 'profil': return 'Profil Panti';
      case 'pengaturan': return 'Pengaturan';
      default: return 'Dashboard';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'kebutuhan': return <PantiWishlist needs={needs} />;
      case 'donasi': return <PantiDonasiMasuk donations={donations} />;
      case 'profil': return <PantiProfile pantiData={pantiData} needs={needs} />;
      case 'pengaturan': return <PantiSettings auth={auth} />;
      case 'dashboard':
      default:
        return <PantiOverview pantiData={pantiData} needs={needs} donations={donations} notifications={notifications} />;
    }
  };

  return (
    <div className="flex h-screen font-sans bg-white text-[#293681] overflow-hidden">
      
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
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#F8FAFC]">
        
        {/* ================= MOBILE HEADER ================= */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white z-30 shadow-md border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-[#4274D9] text-white hover:bg-[#293681] active:scale-95 transition-all"
            >
              <Menu size={20} />
            </button>
            <span className="font-extrabold text-[#293681] tracking-wide uppercase text-sm">
              {getMobileTitle(activeTab)}
            </span>
          </div>

          {/* Indikator Inisial Panti Mobile */}
          <div className="w-9 h-9 rounded-full bg-[#4274D9] flex items-center justify-center font-extrabold text-xs text-white shadow-xs">
            {pantiData?.nama_yayasan ? pantiData.nama_yayasan.charAt(0).toUpperCase() : 'P'}
          </div>
        </div>

        {/* Header Desktop */}
        <div className="hidden lg:block">
          <PantiHeader activeTab={activeTab} orgName={pantiData?.nama_yayasan} />
        </div>

        {/* Area Konten */}
        <div className={`flex-1 overflow-y-auto ${activeTab === 'profil' ? 'p-0' : 'p-4 md:p-8'}`}>
          <div className={`${activeTab === 'profil' ? 'w-full' : 'max-w-7xl mx-auto space-y-6'}`}>
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}