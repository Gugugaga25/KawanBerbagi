import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { 
  Flag, Search, Filter, Eye, CheckCircle, AlertTriangle, 
  XCircle, Clock, ShieldAlert, ChevronLeft, ChevronRight,
  MoreVertical, Building2, FileText, Heart, CheckCircle2, Image
} from 'lucide-react';
import Dropdown from '@/Components/Dropdown';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { Link, router } from '@inertiajs/react';
import ProgressBar from '@/Components/UI/ProgressBar';
import InlineSpinner from '@/Components/UI/InlineSpinner';
import { useToast } from '@/Components/UI/Toast';
import EmptyState from '@/Components/UI/EmptyState';

const COLORS = {
  navy: "#083A4F",
  gold: "#A58D66",
  mist: "#C0D5D6",
  teal: "#407E8C",
};

// Interface Data Laporan
interface Report {
  id: string;
  tipe_laporan: 'panti' | 'postingan' | 'keuangan';
  id_target: string;
  pelapor: string;
  terlapor_nama: string;
  alasan: string;
  catatan_tambahan?: string;
  tanggal: string;
  status: 'pending' | 'diproses' | 'selesai' | 'ditolak';
}

export default function Laporan({ auth, reports }: { auth?: any; reports?: Report[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'semua' | 'pending' | 'diproses' | 'selesai'>('semua');
  
  // State Modal Detail
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const [localReports, setLocalReports] = useState<Report[]>(reports || []);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  React.useEffect(() => {
    setLocalReports(reports || []);
  }, [reports]);

  // Filter Data
  const filteredReports = localReports.filter(report => {
    const matchesTab = activeTab === 'semua' || report.status === activeTab;
    const matchesSearch = 
      (report.terlapor_nama || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (report.pelapor || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toString().toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const openDetailModal = (report: Report) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);
  };

  const { showToast } = useToast();

  const handleExportData = () => {
    setIsExporting(true);
    setExportProgress(0);

    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExporting(false);
            showToast('Dokumen laporan data berhasil diekspor.', 'success', 'Ekspor Sukses');
          }, 500);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const handleUpdateStatus = (id: string, newStatus: 'diproses' | 'selesai' | 'ditolak') => {
    const targetReport = localReports.find(r => r.id === id);
    if (!targetReport) return;

    const oldStatus = targetReport.status;

    // Optimistic UI: update local state immediately
    setLocalReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    if (selectedReport?.id === id) {
      setSelectedReport(prev => prev ? { ...prev, status: newStatus } : null);
    }
    showToast(`Status laporan ${id} diperbarui menjadi ${newStatus.toUpperCase()}.`, 'info', 'Status Diperbarui');

    router.patch(route('admin.laporan.status', id), { status: newStatus }, {
      preserveScroll: true,
      onError: () => {
        // Automatic rollback on failure
        setLocalReports(prev => prev.map(r => r.id === id ? { ...r, status: oldStatus } : r));
        if (selectedReport?.id === id) {
          setSelectedReport(prev => prev ? { ...prev, status: oldStatus } : null);
        }
        showToast('Gagal memperbarui status laporan pada server.', 'error', 'Pembaruan Gagal');
      }
    });
  };

  const getStatusBadge = (status: Report['status']) => {
    if (status === 'selesai') return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200"><CheckCircle size={12} /> SELESAI</span>;
    if (status === 'ditolak') return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200"><XCircle size={12} /> DITOLAK</span>;
    if (status === 'diproses') return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200"><ShieldAlert size={12} /> DIPROSES</span>;
    return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200"><Clock size={12} /> PENDING</span>;
  };

  const getCategoryIcon = (type: Report['tipe_laporan']) => {
    switch (type) {
      case 'panti': return <Building2 size={16} className="text-[#407E8C]" />;
      case 'postingan': return <Heart size={16} className="text-rose-500" />;
      case 'keuangan': return <FileText size={16} className="text-amber-600" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h3 className="text-2xl font-bold text-[#124354] flex items-center gap-2">
            <Flag size={24} className="text-[#083A4F]" /> Manajemen Laporan
          </h3>
          <p className="text-sm text-gray-500 mt-1">Pantau, moderasi, dan verifikasi aduan dari pengguna KawanBerbagi.</p>
        </div>

        {/* Search Box */}
          <div className="relative w-full ml-12 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text"
              placeholder="Cari ID atau pihak terlapor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#407E8C]/20 focus:border-[#407E8C] transition-all"
            />
          </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button 
            onClick={handleExportData}
            className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-[#083A4F] text-white hover:bg-[#124354] transition-colors"
          >
            Ekspor Laporan
          </button>
          
          {/* Tabs Filter */}
          <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 w-full sm:w-auto">
            {(['semua', 'pending', 'diproses', 'selesai'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all capitalize ${
                  activeTab === tab 
                    ? 'bg-white text-[#124354] shadow-sm border border-gray-200' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mini Stats (Opsional tapi mempercantik) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex flex-col justify-center">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Total Aduan</p>
          <p className="text-2xl font-black mt-1 text-[#124354]">{localReports.length}</p>
        </div>
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex flex-col justify-center">
          <p className="text-xs text-amber-600 font-bold uppercase tracking-wide">Menunggu</p>
          <p className="text-2xl font-black mt-1 text-amber-600">{localReports.filter((r: Report) => r.status === 'pending').length}</p>
        </div>
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex flex-col justify-center">
          <p className="text-xs text-blue-600 font-bold uppercase tracking-wide">Diproses</p>
          <p className="text-2xl font-black mt-1 text-blue-600">{localReports.filter((r: Report) => r.status === 'diproses').length}</p>
        </div>
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex flex-col justify-center">
          <p className="text-xs text-green-600 font-bold uppercase tracking-wide">Selesai</p>
          <p className="text-2xl font-black mt-1 text-green-600">{localReports.filter((r: Report) => r.status === 'selesai').length}</p>
        </div>
      </div>

      {/* Table Section (Sama persis dengan gaya PantiManagement) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-visible">
        <div className="overflow-visible">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="text-white text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold rounded-tl-2xl" style={{background: COLORS.navy}}>ID Laporan</th>
                <th className="px-6 py-4 font-bold" style={{background: COLORS.navy}}>Objek Terlapor</th>
                <th className="px-6 py-4 font-bold" style={{background: COLORS.navy}}>Pelapor</th>
                <th className="px-6 py-4 font-bold" style={{background: COLORS.navy}}>Alasan Singkat</th>
                <th className="px-6 py-4 font-bold" style={{background: COLORS.navy}}>Status</th>
                <th className="px-6 py-4 font-bold text-center rounded-tr-2xl" style={{background: COLORS.navy}}>Aksi</th>
              </tr>
            </thead>
            <tbody className="text-[#124354] text-sm">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-0 border-b border-gray-100">
                    <EmptyState
                      mode={searchQuery ? 'search' : 'accomplishment'}
                      icon={Flag}
                      title={searchQuery ? 'Laporan Tidak Ditemukan' : 'Semua Beres! 🎉'}
                      description={searchQuery ? undefined : 'Seluruh aduan dan laporan dari pengguna pada status ini telah berhasil Anda tangani.'}
                      searchQuery={searchQuery}
                      onResetSearch={() => {
                        setSearchQuery('');
                        setActiveTab('semua');
                      }}
                    />
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className={`hover:bg-gray-50/80 transition-all ${report.status === 'selesai' || report.status === 'ditolak' ? 'opacity-50 grayscale hover:grayscale-0' : ''}`}>
                    <td className="px-6 py-4 border-b border-gray-100 whitespace-nowrap">
                      <span className="font-bold text-[#124354]">{report.id}</span>
                      <p className="text-xs text-gray-400 mt-0.5">{report.tanggal}</p>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(report.tipe_laporan)}
                        <Link 
                          href={`/panti/${report.id_target}`}
                          className="font-bold text-[#124354] hover:text-[#407E8C] max-w-[150px] truncate transition-colors underline decoration-dashed decoration-[#407E8C]/30 underline-offset-4" 
                          title={`Kunjungi Halaman: ${report.terlapor_nama}`}
                        >
                          {report.terlapor_nama}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-600 border-b border-gray-100">{report.pelapor}</td>
                    <td className="px-6 py-4 text-gray-500 border-b border-gray-100 max-w-[200px] truncate" title={report.alasan}>
                      {report.alasan}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100 whitespace-nowrap">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="px-6 py-4 text-center border-b border-gray-100">
                      <div className="flex justify-center">
                        <Dropdown>
                          <Dropdown.Trigger>
                            <button className="p-2 text-gray-400 hover:text-[#124354] hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreVertical size={18} />
                            </button>
                          </Dropdown.Trigger>
    
                          <Dropdown.Content align="right" width="48" contentClasses="py-1 bg-white border border-gray-100 shadow-xl rounded-xl z-50">
                            <button 
                              onClick={() => openDetailModal(report)}
                              className="flex items-center gap-2 text-[#124354] hover:bg-[#F4F3EF] block w-full px-4 py-2 text-start text-sm leading-5 transition duration-150 ease-in-out font-medium"
                            >
                              <Eye size={16} className="text-[#407E8C]" /> Periksa Detail
                            </button>
                            
                            {report.status === 'pending' && (
                              <button 
                                onClick={() => handleUpdateStatus(report.id, 'diproses')}
                                className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 block w-full px-4 py-2 text-start text-sm leading-5 transition duration-150 font-medium"
                              >
                                <ShieldAlert size={16} /> Proses Laporan
                              </button>
                            )}

                            {report.status === 'diproses' && (
                              <button 
                                onClick={() => handleUpdateStatus(report.id, 'selesai')}
                                className="flex items-center gap-2 text-green-600 hover:bg-green-50 block w-full px-4 py-2 text-start text-sm leading-5 transition duration-150 font-medium"
                              >
                                <CheckCircle2 size={16} /> Tandai Selesai
                              </button>
                            )}
    
                            {(report.status === 'pending' || report.status === 'diproses') && (
                              <button 
                                onClick={() => handleUpdateStatus(report.id, 'ditolak')}
                                className="flex items-center gap-2 text-red-600 hover:bg-red-50 block w-full px-4 py-2 text-start text-sm leading-5 transition duration-150 font-medium border-t border-gray-100"
                              >
                                <XCircle size={16} /> Tolak Laporan
                              </button>
                            )}
                          </Dropdown.Content>
                        </Dropdown>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Simple Pagination Footer */}
        {filteredReports.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex justify-between items-center text-xs text-gray-500 font-medium">
            <span>Menampilkan {filteredReports.length} data</span>
            <div className="flex gap-1">
              <button className="p-1 rounded hover:bg-gray-200 text-gray-400"><ChevronLeft size={16}/></button>
              <button className="p-1 rounded hover:bg-gray-200 text-gray-400"><ChevronRight size={16}/></button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Detail menggunakan standard Inertia/Breeze Modal jika ada, atau Custom UI ini */}
      <Modal show={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} maxWidth="2xl">
        {selectedReport && (
          <div className="bg-white overflow-hidden rounded-2xl">
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EAE8E3] text-[#124354] flex items-center justify-center">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#124354]">Detail Pemeriksaan Kasus</h3>
                  <p className="text-xs text-gray-500 font-medium">ID Laporan: {selectedReport.id}</p>
                </div>
              </div>
            </div>

            {/* Content Modal */}
            <div className="p-6 space-y-6">
              {/* Dua Kolom Identitas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Pihak Terlapor</p>
                  <p className="font-bold text-[#124354] flex items-center gap-2">
                    {getCategoryIcon(selectedReport.tipe_laporan)} {selectedReport.terlapor_nama}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Pelapor & Status</p>
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-700">{selectedReport.pelapor}</p>
                    {getStatusBadge(selectedReport.status)}
                  </div>
                </div>
              </div>

              {/* Substansi Laporan */}
              <div>
                <p className="text-sm font-bold text-[#124354] mb-2">Alasan Utama Pengaduan:</p>
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-sm font-medium text-rose-900 leading-relaxed">
                  "{selectedReport.alasan}"
                </div>
              </div>

              {selectedReport.catatan_tambahan && (
                <div>
                  <p className="text-sm font-bold text-[#124354] mb-2">Kronologi / Catatan Tambahan:</p>
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-600 leading-relaxed">
                    {selectedReport.catatan_tambahan}
                  </div>
                </div>
              )}

              {/* Obyek Bukti (Visualisasi) */}
              {selectedReport.tipe_laporan === 'postingan' && (
                <div>
                  <p className="text-sm font-bold text-[#124354] mb-2">Konten Postingan yang Dilaporkan:</p>
                  <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm flex gap-4 items-start">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center">
                      <Image size={24} className="text-gray-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#124354]">{selectedReport.terlapor_nama}</h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">Isi atau deskripsi lengkap postingan tidak ditampilkan penuh dalam mode ringkas. Kunjungi langsung halaman Panti untuk melihat secara detail konten yang diduga melanggar.</p>
                    </div>
                  </div>
                </div>
              )}
              {selectedReport.tipe_laporan === 'keuangan' && (
                <div>
                  <p className="text-sm font-bold text-[#124354] mb-2">Dokumen Keuangan yang Dilaporkan:</p>
                  <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm flex gap-4 items-center">
                    <div className="w-12 h-12 bg-red-50 text-red-500 rounded-lg shrink-0 flex items-center justify-center">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#124354]">{selectedReport.terlapor_nama}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Laporan PDF / Audit Dokumen</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Modal Aksi Cepat */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 rounded-b-2xl">
              <SecondaryButton onClick={() => setIsDetailModalOpen(false)}>
                Tutup
              </SecondaryButton>
              
              {selectedReport.status === 'pending' && (
                <button 
                  onClick={() => {
                    handleUpdateStatus(selectedReport.id, 'diproses');
                    setIsDetailModalOpen(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                >
                  Proses Laporan
                </button>
              )}
              
              {selectedReport.status === 'diproses' && (
                <button 
                  onClick={() => {
                    handleUpdateStatus(selectedReport.id, 'selesai');
                    setIsDetailModalOpen(false);
                  }}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-green-700 transition-colors"
                >
                  Tandai Selesai
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <ProgressBar 
        isVisible={isExporting} 
        progress={exportProgress} 
        label="Mengekspor Laporan Data" 
        sublabel="Menyiapkan berkas dokumen laporan untuk diunduh..." 
      />

    </div>
  );
}