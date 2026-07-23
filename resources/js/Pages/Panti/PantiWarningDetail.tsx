import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  FileText,
  Image as ImageIcon,
  ShieldAlert,
  ChevronRight,
  Edit3,
  CheckCircle2,
  Menu
} from 'lucide-react';
import PantiSidebar, { PantiTabType } from '@/Components/Panti/PantiSidebar';
import PantiHeader from '@/Components/Panti/PantiHeader';
import { useToast } from '@/Components/UI/Toast';

interface PantiWarningDetailProps {
  auth?: any;
  notification: any;
  reportData?: any;
  targetImage?: string;
  targetContent?: string;
  judulTarget?: string;
  pantiData?: any;
}

export default function PantiWarningDetail({ notification, reportData, targetImage: propTargetImage, targetContent: propTargetContent, judulTarget: propJudulTarget, pantiData }: PantiWarningDetailProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const { showToast } = useToast();

  const notifData = notification?.data || {};
  const isWarning = notification?.type === 'admin_warning';

  const finalJudulTarget = propJudulTarget || notifData?.judul_target || reportData?.judul_target || 'Konten Panti';
  const finalTargetImage = propTargetImage || notifData?.target_image || reportData?.target_image;
  const finalTargetContent = propTargetContent || notifData?.target_content || reportData?.target_content;

  const handleConfirmAndNavigate = async () => {
    setIsConfirming(true);
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      await fetch(`/panti/peringatan/${notification.id}/konfirmasi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken,
        },
      });

      showToast('Peringatan dikonfirmasi. Mengalihkan Anda ke Halaman Profil Panti...', 'success', 'Konfirmasi Berhasil');
      setTimeout(() => {
        router.visit('/panti/dashboard?tab=profil');
      }, 400);
    } catch (e) {
      console.error(e);
      router.visit('/panti/dashboard?tab=profil');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleTabChange = (tab: PantiTabType) => {
    if (tab === 'chat') {
      router.visit(route('panti.chat'));
      return;
    }
    router.visit(`/panti/dashboard?tab=${tab}`);
  };

  return (
    <div className="flex h-screen font-sans bg-white text-[#293681] overflow-hidden">
      <Head title="Detail Peringatan Admin - KawanBerbagi" />

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
        <PantiSidebar activeTab="dashboard" onTabChange={handleTabChange} />
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
              Detail Peringatan
            </span>
          </div>

          <div className="w-9 h-9 rounded-full bg-[#4274D9] flex items-center justify-center font-extrabold text-xs text-white shadow-xs">
            {pantiData?.nama_yayasan ? pantiData.nama_yayasan.charAt(0).toUpperCase() : 'P'}
          </div>
        </div>

        {/* Header Desktop */}
        <div className="hidden lg:block">
          <PantiHeader activeTab="dashboard" orgName={pantiData?.nama_yayasan} />
        </div>

        {/* Area Konten Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Tombol Kembali (Glassmorphism Pill Button) */}
        <div>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md border border-gray-200 rounded-full text-xs font-bold text-[#293681] hover:bg-gray-100 hover:text-[#4274D9] transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Dashboard Panti</span>
          </button>
        </div>

        {/* Hero Card Banner Detail Peringatan */}
        <div className={`rounded-[2.5rem] p-6 sm:p-8 text-white shadow-lg relative overflow-hidden ${
          isWarning ? 'bg-gradient-to-br from-amber-600 via-rose-600 to-rose-700' : 'bg-gradient-to-br from-rose-700 via-rose-800 to-red-950'
        }`}>
          {/* Subtle Background Icon Accent */}
          <ShieldAlert className="absolute -right-6 -bottom-6 w-56 h-56 text-white/10 pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white border border-white/20">
                {isWarning ? '⚠️ Peringatan Resmi Admin' : '🚫 Takedown Konten'}
              </span>
              <span className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
                <Calendar size={14} />
                {new Date(notification.created_at).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              {notification.title}
            </h1>

            <p className="text-sm text-white/90 leading-relaxed font-medium max-w-2xl">
              Catatan resmi ini dikirimkan langsung oleh tim Administrator KawanBerbagi untuk meninjau kecocokan informasi postingan/kebutuhan panti Anda.
            </p>
          </div>
        </div>

        {/* Content Body: Ringkasan & Snapshot */}
        <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
          
          {/* Box Catatan Admin */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-rose-900 flex items-center gap-2">
              <AlertTriangle size={16} className="text-rose-600" />
              Catatan Resmi & Instruksi dari Admin:
            </h3>
            <div className="p-5 bg-rose-50/70 border border-rose-200 rounded-2xl text-sm font-semibold text-rose-950 leading-relaxed whitespace-pre-line shadow-2xs">
              "{notification.body}"
            </div>
          
          {/* Rincian Target Konten yang Dilaporkan */}
          {finalJudulTarget && (
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Konten / Postingan Terkait</span>
              <p className="font-extrabold text-base text-[#293681]">{finalJudulTarget}</p>
            </div>
          )}

          {/* Grid Pratinjau Snapshot Foto & Teks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Snapshot Foto jika ada */}
            {finalTargetImage ? (
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-[#4274D9]" /> Snapshot Foto Posting Dilaporkan:
                </span>
                <div className="w-full h-56 rounded-2xl overflow-hidden border border-gray-200 bg-gray-900 flex items-center justify-center shadow-2xs">
                  <img src={finalTargetImage} alt="Snapshot Foto" className="w-full h-full object-contain" />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon size={14} /> Snapshot Foto:
                </span>
                <div className="p-6 bg-gray-50 border border-gray-200/60 rounded-2xl text-xs text-gray-400 italic text-center">
                  Tidak ada snapshot foto pada pengaduan ini.
                </div>
              </div>
            )}

            {/* Snapshot Teks jika ada */}
            {finalTargetContent ? (
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText size={14} className="text-amber-600" /> Snapshot Teks Deskripsi Dilaporkan:
                </span>
                <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl text-xs font-mono text-gray-800 leading-relaxed whitespace-pre-line h-56 overflow-y-auto shadow-2xs">
                  "{finalTargetContent}"
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText size={14} /> Snapshot Teks Deskripsi:
                </span>
                <div className="p-6 bg-gray-50 border border-gray-200/60 rounded-2xl text-xs text-gray-400 italic text-center">
                  Tidak ada snapshot teks khusus pada pengaduan ini.
                </div>
              </div>
            )}
          </div> </div>

          {/* Tindakan Rekomendasi & Tombol Aksi */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              <span>Perbarui konten Anda untuk memastikan kesesuaian dengan pedoman komunitas.</span>
            </div>

            <button
              onClick={handleConfirmAndNavigate}
              disabled={isConfirming}
              className="w-full sm:w-auto px-6 py-3 bg-[#4274D9] hover:bg-[#293681] text-white rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Edit3 size={15} />
              <span>{isConfirming ? 'Mengonfirmasi...' : 'Kelola Profil Panti'}</span>
              <ChevronRight size={15} />
            </button>
          </div>

          </div>
        </div>
      </div>
    </main>
  </div>
);
}
