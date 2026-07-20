import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react'; 
import { router } from '@inertiajs/react';

// Import komponen dari file terpisah
import PantiManagement from './PantiManagement';
import DonaturManagement from './DonaturManagement';
import KebutuhanManagement from './KebutuhanManagement';
import DashboardOverview from './DashboardOverview';
import Laporan from './Laporan'; 
import AdminSettings from './AdminSettings';
import AdminSidebar, { TabType } from '@/Components/Admin/AdminSidebar';
import AdminHeader from '@/Components/Admin/AdminHeader';
import { ToastProvider } from '@/Components/UI/Toast';

// 1. FIX: Tambahkan auth ke interface
interface AdminDashboardProps {
  auth: any; 
  pantis?: any[];
  donaturs?: any[];
  needs?: any[];
  activeShelters?: any[];
  laporans?: any[];
}

// --- KOMPONEN UTAMA ---
export default function AdminDashboard({ 
  auth, // <-- 2. FIX: Terima auth dari props bawaan Inertia
  pantis = [], 
  donaturs = [], 
  needs = [], 
  activeShelters = [],
  laporans = [] 
}: AdminDashboardProps) {
  
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 

  // Sinkronisasi awal & event listener tombol Back/Forward browser
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

  // Fungsi ganti tab dan update URL tanpa reload
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

  // Penentu konten berdasarkan tab aktif
  const renderContent = () => {
    switch (activeTab) {
      case 'panti': 
        return <PantiManagement pantis={pantis} />;
      case 'donatur': 
        return <DonaturManagement donaturs={donaturs} />;
      case 'kebutuhan': 
        return <KebutuhanManagement needs={needs} activeShelters={activeShelters} />;
      case 'laporan': 
        // 3. FIX: Oper prop auth dan reports ke komponen Laporan
        return <Laporan auth={auth} reports={laporans} />;
      case 'pengaturan':
        return <AdminSettings auth={auth} />;
      case 'dashboard':
      default: 
        return <DashboardOverview />;
    }
  };

  return (
    <ToastProvider>
      <div className="flex h-screen bg-[#F4F3EF] font-sans antialiased overflow-hidden">
        {/* Sidebar Desktop & Mobile */}
        <AdminSidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
        />

        {/* Main Container */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          
          {/* Header Khusus Mobile */}
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

          {/* Top Header Asli */}
          <div className="hidden lg:block">
            <AdminHeader activeTab={activeTab} laporans={laporans} pantis={pantis} />
          </div>

          {/* Dynamic Content Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </div>

        </main>
      </div>
    </ToastProvider>
  );
}