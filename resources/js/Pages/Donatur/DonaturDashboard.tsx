import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { router } from '@inertiajs/react';

import DonaturSidebar, { DonaturTabType } from '@/Components/Donatur/DonaturSidebar';
import DonaturHeader from '@/Components/Donatur/DonaturHeader';
import DonaturOverview from './DonaturOverview';
import CariPanti from './DonaturSearch';
import DonasiSaya from './DonaturDonasi';
import ProfilSaya from './DonaturProfile';

export default function DonaturDashboard({ 
  needs = [], 
  pantis = [],
  myDonations = [],
  donaturData = null,
  recentDonations = [],
  urgentNeeds = [],
  stats = { totalDonasi: 0, pantiTerbantu: 0 },
  needsResi = [],
  impactStories = [],
}: { 
  needs?: any[]; 
  pantis?: any[];
  myDonations?: any[];
  donaturData?: any;
  recentDonations?: any[];
  urgentNeeds?: any[];
  stats?: { totalDonasi: number; pantiTerbantu: number };
  needsResi?: any[];
  impactStories?: any[];
}) {
  const [activeTab, setActiveTab] = useState<DonaturTabType>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as DonaturTabType;

      if (tabParam && ['dashboard', 'cari', 'donasi', 'dampak', 'profil', 'pengaturan'].includes(tabParam)) {
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
    if (tab === 'chat') {
      router.visit(route('donatur.chat'));
      return;
    }
    setActiveTab(tab);
    setIsMobileMenuOpen(false); // Tutup menu mobile setelah klik
    
    const newUrl = tab === 'dashboard'
      ? window.location.pathname
      : `${window.location.pathname}?tab=${tab}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'cari': return <CariPanti needs={needs} pantis={pantis} />;
      case 'donasi': return <DonasiSaya myDonations={myDonations} />;
      case 'profil':
      case 'pengaturan': return <ProfilSaya donaturData={donaturData} />;
      case 'dashboard':
      default:
        return <DonaturOverview 
          donaturData={donaturData}
          recentDonations={recentDonations}
          urgentNeeds={urgentNeeds}
          stats={stats}
          needsResi={needsResi}
          impactStories={impactStories}
        />;
    }
  };

  // Helper untuk inisial nama donatur jika tidak ada foto profil
  const getInitials = (name?: string) => {
    if (!name) return 'DN';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Helper untuk judul dinamis mode Mobile
  const getMobileTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard';
      case 'cari': return 'Cari Panti';
      case 'chat': return 'Pesan';
      case 'donasi': return 'Donasi Saya';
      case 'dampak': return 'Riwayat Dampak';
      case 'profil': return 'Profil';
      case 'pengaturan': return 'Pengaturan';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="flex h-screen font-sans bg-white text-[#293681] overflow-hidden">
      
      {/* ================= OVERLAY MOBILE ================= */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <div className={`
        fixed inset-y-0 left-0 z-50 h-full transform transition-transform duration-300 ease-in-out w-64 lg:w-64 lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <DonaturSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          donaturData={donaturData}
          stats={stats}
        />
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#F4F3EF]">
        
        {/* ================= MOBILE HEADER ================= */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white z-30 shadow-md">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-[#4274D9] text-white hover:bg-[#293681] active:scale-95 transition-all border border-black/5"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#293681] tracking-wide uppercase text-sm">
                {getMobileTitle(activeTab)}
              </span>
            </div>
          </div>
          
          {/* Indikator Avatar / Inisial Donatur di kanan atas mobile */}
          {donaturData?.foto_profil ? (
            <img 
              src={donaturData.foto_profil} 
              alt={donaturData.nama_lengkap || 'Donatur'} 
              className="w-10 h-10 rounded-full object-cover border-2 border-[#4274D9]/20" 
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#4274D9] border-2 border-white/20 flex items-center justify-center text-[12pt] font-bold text-white shadow-inner">
              {getInitials(donaturData?.nama_lengkap)}
            </div>
          )}
        </div>

        {/* Header Desktop Asli */}
        <div className="hidden lg:block">
          <DonaturHeader activeTab={activeTab} donaturData={donaturData} />
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