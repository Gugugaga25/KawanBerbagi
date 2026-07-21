import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Heart, 
  Package, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  FileSearch,
  Zap,
  ChevronRight
} from 'lucide-react';
import { router } from '@inertiajs/react';
import InlineSpinner from '@/Components/UI/InlineSpinner';
import EmptyState from '@/Components/UI/EmptyState';

const COLORS = {
  navy: "#293681",
  gold: "#F59E0B",
  mist: "#D0E7E6",
  teal: "#4274D9",
};

interface PantiItem {
  id: number;
  nama: string;
  alamat: string;
  status: string;
  anak: number;
  akta_yayasan?: string;
  sk_kemenkumham?: string;
  izin_operasional?: string;
  npwp_yayasan?: string;
}

interface DashboardOverviewProps {
  pantis?: any[];
  donaturs?: any[];
  needs?: any[];     
  laporans?: any[];
}

export default function DashboardOverview({ 
  pantis = [], 
  donaturs = [],
  needs = [],       
  laporans = []     
}: DashboardOverviewProps) {

  // 1. Filter panti yang statusnya 'Pending'
  const pendingQueue = pantis
    .filter((panti) => panti.status === 'Pending')
    .map((panti) => {
      const docs: string[] = [];
      if (panti.akta_yayasan) docs.push('Akta Notaris');
      if (panti.sk_kemenkumham) docs.push('SK Kemenkumham');
      if (panti.izin_operasional) docs.push('Izin Operasional');
      if (panti.npwp_yayasan) docs.push('NPWP');

      return {
        id: panti.id,
        name: panti.nama,
        info: `${panti.anak || 0} Penerima • ${panti.alamat}`,
        docs: docs.length > 0 ? docs : ['Berkas Pendaftaran'],
      };
    });

  // 2. Hitung statistik
  const stats = {
    yayasanAktif: pantis.filter((p) => p.status === 'Active').length,
    donaturAktif: donaturs.length,
    barangTersalurkan: 0, 
  };

  const [queue, setQueue] = useState(pendingQueue);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setQueue(pendingQueue);
    setCurrentIndex(0);
  }, [pantis]);

  const currentItem = queue[currentIndex];

  const handleSkip = () => {
    if (queue.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % queue.length);
    }
  };

  const handleReview = () => {
    if (!currentItem) return;
    setIsProcessing(true);
    
    router.visit(`/admin/panti/${currentItem.id}/verification`, {
      onFinish: () => setIsProcessing(false)
    });
  };

  // 3. FUNGSI UNTUK MENGHASILKAN DATA RADAR AKTIVITAS
  const generateActivities = () => {
    let acts: any[] = [];
    
    // a. Pendaftaran Panti Baru (Ambil 2 teratas)
    const pendingPantis = pantis.filter(p => p.status === 'Pending').slice(0, 2);
    pendingPantis.forEach(p => acts.push({
        id: `panti-${p.id}`,
        color: COLORS.navy,
        title: 'Pendaftaran Yayasan',
        desc: `${p.nama} membuat akun dan menunggu proses verifikasi admin.`,
        time: 'Menunggu Review'
    }));

    // b. Laporan Masuk Terkini
    laporans.slice(0, 2).forEach(l => acts.push({
        id: `laporan-${l.id}`,
        color: COLORS.gold,
        title: `Laporan ${l.tipe_laporan || 'Baru'}`,
        desc: `${l.pelapor || 'Seseorang'} melaporkan: "${l.alasan || 'Tidak ada alasan spesifik'}".`,
        time: l.tanggal || 'Baru saja'
    }));

    // c. Kebutuhan Panti Terbaru
    needs.slice(0, 2).forEach(n => acts.push({
        id: `need-${n.id}`,
        color: COLORS.teal,
        title: 'Request Kebutuhan',
        desc: `${n.panti || 'Panti'} mempublikasikan kebutuhan ${n.target || ''} ${n.satuan || ''} ${n.barang || ''}.`,
        time: n.created_at || 'Baru saja'
    }));

    // Acak sedikit atau biarkan berurutan, di sini kita potong jadi 5 aktivitas maksimal
    return acts.slice(0, 3);
  };

  const activities = generateActivities();

  return (
    <div className="space-y-6 w-full">
      
      {/* ================= HEADER & STATS ================= */}
      <div className="relative bg-[#4274D9] rounded-[2rem] p-8 md:p-10 overflow-hidden shadow-lg shadow-[#4274D9]/20">
        <div className="absolute -top-32 -right-32 w-[30rem] h-[30rem] bg-white rounded-full mix-blend-overlay filter blur-[90px] opacity-25"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#293681] rounded-full mix-blend-multiply filter blur-[80px] opacity-30 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4 bg-white/15 border border-white/25 backdrop-blur-sm">
            <Zap size={12} className="text-[#F59E0B]" />
            <span className="text-[10px] font-bold tracking-wider uppercase text-white">
              Pusat Kendali Admin
            </span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-extrabold leading-tight mb-6 max-w-3xl text-white">
            Halo, Admin. Hari ini ada <span className="text-[#F59E0B] font-extrabold underline decoration-[#F59E0B]/40">{queue.length} Yayasan</span> yang menunggu proses verifikasi Anda.
          </h1>

          <div className="flex flex-wrap gap-6 items-center border-t border-white/20 pt-6">
            {[
              { icon: ShieldCheck, label: "Yayasan Aktif", value: stats.yayasanAktif },
              { icon: Heart, label: "Donatur Aktif", value: stats.donaturAktif },
              { icon: Package, label: "Barang Tersalurkan", value: stats.barangTersalurkan },
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-4 flex-1 min-w-[180px]">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white/15 border border-white/20 backdrop-blur-sm">
                  <stat.icon size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white">{stat.value.toLocaleString('id-ID')}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/80">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        
        {/* Kiri: Antrean Panti */}
        <div className="lg:w-1/2 flex flex-col">
          {queue.length === 0 ? (
            <EmptyState
              mode="accomplishment"
              title="Semua Beres!"
              description="Seluruh antrean berkas verifikasi panti asuhan telah selesai Anda periksa."
              className="h-full"
            />
          ) : (
            <div className="relative h-full">
              {queue.length > 1 && (
                <div className="absolute inset-0 bg-white rounded-[2rem] border opacity-50 transform rotate-2 translate-y-2" style={{ borderColor: COLORS.mist }}></div>
              )}
              {queue.length > 2 && (
                <div className="absolute inset-0 bg-white rounded-[2rem] border opacity-70 transform -rotate-2 translate-y-1" style={{ borderColor: COLORS.mist }}></div>
              )}
              
              <div className="relative h-full bg-white rounded-[2rem] p-6 md:p-8 border shadow-sm flex flex-col justify-between" style={{ borderColor: COLORS.mist }}>
                <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: COLORS.navy }}>Antrean Review</h2>
                    <p className="text-xs font-semibold opacity-70 mt-0.5" style={{ color: COLORS.navy }}>
                      Antrean {currentIndex + 1} dari {queue.length}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-extrabold" style={{ color: COLORS.navy }}>{currentItem.name}</h3>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: COLORS.gold }}>{currentItem.info}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700">
                    Menunggu
                  </span>
                </div>
                
                <p className="text-[10px] font-bold uppercase mb-2 opacity-60" style={{ color: COLORS.navy }}>Dokumen Terlampir:</p>
                <div className="flex flex-wrap gap-2 mb-6 flex-grow">
                  {currentItem.docs?.map((doc, i) => (
                    <span key={i} className="text-xs px-2.5 py-1.5 rounded-lg bg-gray-50 border font-semibold flex items-center gap-1.5" style={{ borderColor: COLORS.mist, color: COLORS.navy }}>
                      <CheckCircle2 size={12} color={COLORS.teal} /> {doc}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                  <button 
                    onClick={handleReview}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white transition-all hover:scale-[1.01] bg-[#4274D9] hover:bg-[#293681]" 
                  >
                    {isProcessing ? <InlineSpinner color="white" size="sm" /> : <FileSearch size={16} />}
                    <span>{isProcessing ? 'Memproses...' : 'Review Verifikasi'}</span>
                  </button>
                  
                  {queue.length > 1 && (
                    <button 
                      onClick={handleSkip}
                      disabled={isProcessing}
                      className="sm:w-1/3 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold border transition-colors hover:bg-gray-50 disabled:opacity-60" 
                      style={{ borderColor: COLORS.mist, color: COLORS.navy }}
                    >
                      Skip <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Kanan: Radar Aktivitas */}
        <div className="lg:w-1/2 flex flex-col">
          <div className="bg-white rounded-[2rem] p-6 md:p-8 border shadow-sm h-full flex flex-col" style={{ borderColor: COLORS.mist }}>
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-lg font-bold" style={{ color: COLORS.navy }}>Radar Aktivitas</h2>
            </div>

            {/* 4. RENDER DATA DINAMIS DI SINI */}
            <div className="relative pl-6 border-l-2 space-y-6 flex-grow" style={{ borderColor: `${COLORS.mist}80` }}>
              {activities.length > 0 ? (
                activities.map((act) => (
                  <div key={act.id} className="relative">
                    <div 
                      className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-4 bg-white" 
                      style={{ borderColor: act.color }}
                    ></div>
                    <p className="text-xs font-bold" style={{ color: COLORS.navy }}>{act.title}</p>
                    <p className="text-xs mt-1 leading-relaxed opacity-80" style={{ color: COLORS.navy }}>
                      {act.desc}
                    </p>
                    <div className="flex items-center gap-1 mt-1.5 text-[10px] font-semibold opacity-60" style={{ color: COLORS.navy }}>
                      <Clock size={10} /> {act.time}
                    </div>
                  </div>
                ))
              ) : (
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-4 bg-white" style={{ borderColor: COLORS.teal }}></div>
                  <p className="text-xs font-bold" style={{ color: COLORS.navy }}>Sistem Aktif</p>
                  <p className="text-xs mt-1 leading-relaxed opacity-80" style={{ color: COLORS.navy }}>
                    Belum ada aktivitas pendaftaran, laporan, atau kebutuhan terbaru.
                  </p>
                  <div className="flex items-center gap-1 mt-1.5 text-[10px] font-semibold opacity-60" style={{ color: COLORS.navy }}>
                    <Clock size={10} /> Real-time
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}