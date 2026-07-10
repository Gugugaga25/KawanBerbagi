import React, { useState, useEffect } from 'react';

// Import komponen dari file terpisah
import PantiManagement from './PantiManagement';
import DonaturManagement from './DonaturManagement';
import KebutuhanManagement from './KebutuhanManagement';
import DashboardOverview from './DashboardOverview';
import AdminSidebar, { TabType } from '@/Components/Admin/AdminSidebar';
import AdminHeader from '@/Components/Admin/AdminHeader';

// --- KOMPONEN UTAMA ---
export default function AdminDashboard({ pantis = [] }: { pantis?: any[] }) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

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

    // Jalankan saat komponen pertama kali di-mount
    handleUrlChange();

    // Dengarkan perubahan histori browser (jika user klik tombol Back/Forward)
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // 2. Fungsi ganti tab dan update URL tanpa reload
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    
    // Buat URL baru sesuai tab
    const newUrl = tab === 'dashboard' 
      ? window.location.pathname 
      : `${window.location.pathname}?tab=${tab}`;
    
    // Ubah URL di address bar browser tanpa me-reload halaman
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  // 3. Penentu konten berdasarkan tab aktif
  const renderContent = () => {
    switch (activeTab) {
      case 'panti': return <PantiManagement pantis={pantis} />;
      case 'donatur': return <DonaturManagement />;
      case 'kebutuhan': return <KebutuhanManagement />;
      case 'dashboard':
      default: 
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F4F3EF] font-sans">
      
      {/* Sidebar Navigation */}
      <AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <AdminHeader activeTab={activeTab} />

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>

      </main>
    </div>
  );
}