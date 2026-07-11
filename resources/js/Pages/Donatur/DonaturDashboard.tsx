import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';

import DonaturSidebar, { DonaturTabType } from '@/Components/Donatur/DonaturSidebar';
import DonaturHeader from '@/Components/Donatur/DonaturHeader';
import DonaturOverview from './DonaturOverview';
import CariPanti from './DonaturSearch';
import DonasiSaya from './DonaturDonasi';
import ProfilSaya from './DonaturProfile';

const COLORS = {
  navy: '#083A4F',
  gold: '#A58D66',
  mist: '#C0D5D6',
  teal: '#407E8C',
  cream: '#E5E1DD',
};

export default function DonaturDashboard() {
  const [activeTab, setActiveTab] = useState<DonaturTabType>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as DonaturTabType;

      if (tabParam && ['dashboard', 'cari', 'donasi', 'dampak', 'profil'].includes(tabParam)) {
        setActiveTab(tabParam);
      } else {
        setActiveTab('dashboard');
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const handleTabChange = (tab: DonaturTabType) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false); // Tutup menu mobile setelah klik
    
    const newUrl = tab === 'dashboard'
      ? window.location.pathname
      : `${window.location.pathname}?tab=${tab}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'cari': return <CariPanti />;
      case 'donasi': return <DonasiSaya />;
      case 'profil': return <ProfilSaya />;
      case 'dashboard':
      default:
        return <DonaturOverview />;
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
        <DonaturSidebar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#F4F3EF]">
        
        {/* Header Khusus Mobile */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-[#083A4F] z-30">
          <div className="flex items-center gap-3 text-white">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Menu size={20} />
            </button>
            <span className="font-extrabold tracking-wide uppercase text-sm">Dashboard Donatur</span>
          </div>
        </div>

        {/* Header Desktop Asli */}
        <div className="hidden lg:block">
          <DonaturHeader activeTab={activeTab} />
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