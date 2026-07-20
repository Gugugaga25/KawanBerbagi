import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Heart, 
  Package, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  RefreshCw,
  FileSearch,
  Zap,
  Building2, 
  Users, 
  Flag, 
  ChevronRight
} from 'lucide-react';
import InlineSpinner from '@/Components/UI/InlineSpinner';
import EmptyState from '@/Components/UI/EmptyState';

const COLORS = {
  navy: "#083A4F",
  gold: "#A58D66",
  mist: "#C0D5D6",
  teal: "#407E8C",
  cream: "#E5E1DD",
};

// Data dummy antrean verifikasi
const INITIAL_QUEUE = [
  { id: 1, name: "Yayasan Amanah Bunda", info: "120 Penerima • Bandung", docs: ["Akta Notaris", "Foto Lokasi", "KTP Pengurus"] },
  { id: 2, name: "Panti Asuhan Kasih Harapan", info: "45 Penerima • Jakarta", docs: ["KTP Pengurus", "Foto Lokasi"] },
  { id: 3, name: "Rumah Yatim Cahaya", info: "80 Penerima • Surabaya", docs: ["Akta Notaris"] },
  { id: 4, name: "Panti Asuhan Budi Mulia", info: "60 Penerima • Yogyakarta", docs: ["Akta Notaris", "Foto Lokasi", "KTP Pengurus", "Surat Domisili"] },
];

export default function DashboardOverview() {
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const currentItem = queue[currentIndex];

  // Fungsi buat pindah ke antrean berikutnya
  const handleSkip = () => {
    setCurrentIndex((prev) => (prev + 1) % queue.length);
  };

  // Fungsi simulasi pas tombol "Review Verifikasi" dipencet
  const handleReview = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newQueue = queue.filter((_, index) => index !== currentIndex);
      setQueue(newQueue);
      if (currentIndex >= newQueue.length) {
        setCurrentIndex(0);
      }
      setIsProcessing(false);
    }, 400);
  };

  return (
    // FIX: Menggunakan space-y-6, menghapus double padding (px-6/pt-6) dan max-w yang bikin sempit
    <div className="space-y-6 w-full">
      
      {/* ================= HEADER & STATS ================= */}
      {/* FIX: rounded disamakan jadi [2rem], padding disesuaikan agar tidak terlalu memakan space */}
      <div className="relative bg-[#083A4F] rounded-[2rem] p-8 md:p-10 overflow-hidden shadow-sm">
        {/* Dekorasi abstrak */}
        <div className="absolute -top-32 -right-32 w-[30rem] h-[30rem] bg-[#407E8C] rounded-full mix-blend-screen filter blur-[100px] opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#A58D66] rounded-full mix-blend-screen filter blur-[80px] opacity-20 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4 bg-white/10 border border-white/20 backdrop-blur-sm">
            <Zap size={12} className="text-[#A58D66]" />
            <span className="text-[10px] font-bold tracking-wider uppercase text-white">
              Pusat Kendali Admin
            </span>
          </div>
          
          {/* FIX: Mengurangi margin bottom dari mb-10 ke mb-6 agar lebih padat */}
          <h1 className="text-2xl md:text-3xl font-extrabold leading-tight mb-6 max-w-3xl text-white">
            Halo, Admin. Hari ini ada <span className="text-[#A58D66]">{queue.length} Yayasan</span> yang menunggu proses verifikasi Anda.
          </h1>

          {/* Stats Section */}
          {/* FIX: pt-6 menyesuaikan ritme padding baru */}
          <div className="flex flex-wrap gap-6 items-center border-t border-white/10 pt-6">
            {[
              { icon: ShieldCheck, label: "Yayasan Aktif", value: "324" },
              { icon: Heart, label: "Donatur Aktif", value: "5.2K" },
              { icon: Package, label: "Barang Tersalurkan", value: "18.4K" },
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-4 flex-1 min-w-[180px]">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white/10 border border-white/10 backdrop-blur-sm">
                  <stat.icon size={20} className="text-[#C0D5D6]" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#C0D5D6] opacity-80">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      {/* FIX: Mengubah gap-8 menjadi gap-6 agar konsisten dengan layout utama */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        
        {/* Kiri: Tumpukan Panti Butuh Review */}
        <div className="lg:w-1/2 flex flex-col">
          {queue.length === 0 ? (
            <EmptyState
              mode="accomplishment"
              title="Semua Beres! 🎉"
              description="Seluruh antrean berkas verifikasi panti asuhan telah selesai Anda periksa."
              className="h-full"
            />
          ) : (
            <div className="relative h-full">
              {/* Efek tumpukan kertas */}
              {queue.length > 1 && (
                <div className="absolute inset-0 bg-white rounded-[2rem] border opacity-50 transform rotate-2 translate-y-2" style={{ borderColor: COLORS.mist }}></div>
              )}
              {queue.length > 2 && (
                <div className="absolute inset-0 bg-white rounded-[2rem] border opacity-70 transform -rotate-2 translate-y-1" style={{ borderColor: COLORS.mist }}></div>
              )}
              
              {/* Card Utama */}
              <div className="relative h-full bg-white rounded-[2rem] p-6 md:p-8 border shadow-sm flex flex-col justify-between" style={{ borderColor: COLORS.mist }}>
                {/* Header Card */}
                <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: COLORS.navy }}>Antrean Review</h2>
                    <p className="text-xs font-semibold opacity-70 mt-0.5" style={{ color: COLORS.navy }}>
                      Antrean {currentIndex + 1} dari {queue.length}
                    </p>
                  </div>
                  <button className="text-xs font-bold flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: COLORS.teal }}>
                    Lihat Semua <ArrowUpRight size={14} />
                  </button>
                </div>

                {/* Info Yayasan */}
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
                  {currentItem.docs.map((doc, i) => (
                    <span key={i} className="text-xs px-2.5 py-1.5 rounded-lg bg-gray-50 border font-semibold flex items-center gap-1.5" style={{ borderColor: COLORS.mist, color: COLORS.navy }}>
                      <CheckCircle2 size={12} color={COLORS.teal} /> {doc}
                    </span>
                  ))}
                </div>

                {/* Tombol Aksi */}
                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                  <button 
                    onClick={handleReview}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white transition-transform hover:scale-[1.01] disabled:opacity-60" 
                    style={{ backgroundColor: COLORS.navy }}
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
          {/* FIX: rounded disamakan jadi [2rem] */}
          <div className="bg-white rounded-[2rem] p-6 md:p-8 border shadow-sm h-full flex flex-col" style={{ borderColor: COLORS.mist }}>
            
            {/* Header Card */}
            {/* FIX: mb-6 disamakan dengan card sebelah */}
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-lg font-bold" style={{ color: COLORS.navy }}>Radar Aktivitas</h2>
              <button className="text-sm font-bold flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: COLORS.teal }}>
                Lihat Semua <ArrowUpRight size={14} />
              </button>
            </div>

            {/* Timeline Items */}
            <div className="relative pl-6 border-l-2 space-y-6 flex-grow" style={{ borderColor: `${COLORS.mist}80` }}>
              {/* Timeline Item 1 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-4 bg-white" style={{ borderColor: COLORS.teal }}></div>
                <p className="text-xs font-bold" style={{ color: COLORS.navy }}>Donasi Sukses Terkirim</p>
                <p className="text-xs mt-1 leading-relaxed opacity-80" style={{ color: COLORS.navy }}>
                  Kawan <span className="font-semibold">Budi</span> baru saja menyelesaikan pengiriman 50 buku ke Panti Harapan.
                </p>
                <div className="flex items-center gap-1 mt-1.5 text-[10px] font-semibold opacity-60" style={{ color: COLORS.navy }}>
                  <Clock size={10} /> 10 menit yang lalu
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-4 bg-white" style={{ borderColor: COLORS.gold }}></div>
                <p className="text-xs font-bold" style={{ color: COLORS.navy }}>Request Kebutuhan Baru</p>
                <p className="text-xs mt-1 leading-relaxed opacity-80" style={{ color: COLORS.navy }}>
                  Panti Kasih Ibu membuat *wishlist* baru: Pakaian Layak Pakai & Alat Tulis.
                </p>
                <div className="flex items-center gap-1 mt-1.5 text-[10px] font-semibold opacity-60" style={{ color: COLORS.navy }}>
                  <Clock size={10} /> 1 jam yang lalu
                </div>
              </div>

              {/* Timeline Item 3 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-4 bg-white" style={{ borderColor: COLORS.navy }}></div>
                <p className="text-xs font-bold" style={{ color: COLORS.navy }}>Pendaftaran Yayasan</p>
                <p className="text-xs mt-1 leading-relaxed opacity-80" style={{ color: COLORS.navy }}>
                  Yayasan Tunas Bangsa membuat akun dan sedang menunggu proses review.
                </p>
                <div className="flex items-center gap-1 mt-1.5 text-[10px] font-semibold opacity-60" style={{ color: COLORS.navy }}>
                  <Clock size={10} /> 3 jam yang lalu
                </div>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}