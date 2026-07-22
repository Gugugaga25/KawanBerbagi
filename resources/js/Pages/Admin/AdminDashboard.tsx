import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react'; 
import { router, usePage } from '@inertiajs/react';

// Import komponen dari file terpisah
import PantiManagement from './PantiManagement';
import DonaturManagement from './DonaturManagement';
import KebutuhanManagement from './KebutuhanManagement';
import DashboardOverview from './DashboardOverview';
import Laporan from './Laporan'; 
import AdminSettings from './AdminSettings';
import AdminSidebar, { TabType } from '@/Components/Admin/AdminSidebar';
import AdminHeader from '@/Components/Admin/AdminHeader';

interface AdminDashboardProps {
  auth: any; 
  pantis?: any[];
  donaturs?: any[];
  needs?: any[];
  activeShelters?: any[];
  laporans?: any[];
}

export default function AdminDashboard({ 
  auth, 
  pantis = [], 
  donaturs = [], 
  needs = [], 
  activeShelters = [],
  laporans = [] 
}: AdminDashboardProps) {
  
  const { flash } = usePage().props as any;
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as TabType;
      
      if (tabParam && ['dashboard', 'panti', 'donatur', 'kebutuhan', 'laporan', 'pengaturan'].includes(tabParam)) {
        setActiveTab(tabParam);
      } else {
        setActiveTab('dashboard');
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const handleTabChange = (tab: TabType) => {
    if (tab === 'chat') {
      router.visit(route('admin.chat'));
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
      case 'panti': return 'Manajemen Panti';
      case 'donatur': return 'Manajemen Donatur';
      case 'kebutuhan': return 'Manajemen Kebutuhan';
      case 'laporan': return 'Laporan Masuk';
      case 'chat': return 'Pesan Chat';
      case 'pengaturan': return 'Pengaturan';
      default: return 'Dashboard';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'panti': 
        return <PantiManagement pantis={pantis} />;
      case 'donatur': 
        return <DonaturManagement donaturs={donaturs} />;
      case 'kebutuhan': 
        return <KebutuhanManagement needs={needs} activeShelters={activeShelters} />;
      case 'laporan': 
        return <Laporan auth={auth} reports={laporans} />;
      case 'pengaturan':
        return <AdminSettings auth={auth} />;
      case 'dashboard':
      default: 
        return <DashboardOverview pantis={pantis} donaturs={donaturs} needs={needs} laporans={laporans} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased overflow-hidden">
        
        {/* ================= MOBILE OVERLAY ================= */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* ================= RESPONSIVE SIDEBAR ================= */}
        <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <AdminSidebar 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
          />
        </div>

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          
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

            {/* Indikator Admin Mobile */}
            <div className="w-9 h-9 rounded-full bg-[#4274D9] flex items-center justify-center font-extrabold text-xs text-white shadow-xs">
              AD
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block">
            <AdminHeader activeTab={activeTab} laporans={laporans} pantis={pantis} />
          </div>

          {/* Dynamic Content Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              
              {/* FLASH NOTIFICATION BANNER */}
              {flash?.success && (
                <div className="mb-6 p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="text-sm font-bold leading-relaxed">{flash.success}</p>
                      {flash?.wa_link && (
                        <p className="text-xs text-emerald-700 mt-0.5">Klik tombol di samping untuk langsung mengirimkan draf notifikasi resmi ke WhatsApp 081291819276.</p>
                      )}
                    </div>
                  </div>
                  {flash?.wa_link && (
                    <a
                      href={flash.wa_link}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-md transition-all hover:scale-105 active:scale-95"
                    >
                      💬 Kirim WA Ke 081291819276
                    </a>
                  )}
                </div>
              )}

              {renderContent()}
            </div>
          </div>

        </main>
      </div>
  );
}