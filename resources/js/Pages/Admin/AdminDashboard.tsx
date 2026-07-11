import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react'; // Tambah icon buat tombol mobile

// Import komponen dari file terpisah
import PantiManagement from './PantiManagement';
import DonaturManagement from './DonaturManagement';
import KebutuhanManagement from './KebutuhanManagement';
import DashboardOverview from './DashboardOverview';
import AdminSidebar, { TabType } from '@/Components/Admin/AdminSidebar';
import AdminHeader from '@/Components/Admin/AdminHeader';

// --- KOMPONEN UTAMA ---
export default function AdminDashboard({ pantis = [], donaturs = [], needs = [], activeShelters = [] }: { pantis?: any[], donaturs?: any[], needs?: any[], activeShelters?: any[] }) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State baru buat mobile menu

  // 1. Sinkronisasi awal & event listener tombol Back/Forward browser
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as TabType;
      
      if (tabParam && ['dashboard', 'panti', 'donatur', 'kebutuhan'].includes(tabParam)) {
        setActiveTab(tabParam);
      } else {
        setActiveTab('dashboard');
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // 2. Fungsi ganti tab dan update URL tanpa reload
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false); // Tutup sidebar otomatis pas ganti tab di HP
    
    const newUrl = tab === 'dashboard' 
      ? window.location.pathname 
      : `${window.location.pathname}?tab=${tab}`;
    
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  // 3. Penentu konten berdasarkan tab aktif
  const renderContent = () => {
    switch (activeTab) {
      case 'panti': return <PantiManagement pantis={pantis} />;
      case 'donatur': return <DonaturManagement donaturs={donaturs} />;
      case 'kebutuhan': return <KebutuhanManagement needs={needs} activeShelters={activeShelters} />;
      case 'dashboard':
      default: 
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F4F3EF] font-sans overflow-hidden">
      
      {/* Overlay Gelap buat di HP (Muncul kalau menu kebuka) */}
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
        {/* Pastiin juga AdminSidebar nerima/pakai h-full di file aslinya */}
        <AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Header Khusus Mobile (Tombol Hamburger) */}
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

        {/* Top Header Asli (Disembunyiin di HP kalau dirasa menuhin layar, atau biarin muncul kalau isinya penting) */}
        <div className="hidden lg:block">
          <AdminHeader activeTab={activeTab} />
        </div>

        {/* Dynamic Content Area */}
        {/* Padding dikurangin dari p-8 jadi p-4 buat mobile biar gak sempit */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>

      </main>
    </div>
  );
}
