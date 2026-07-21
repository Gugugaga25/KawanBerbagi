import React, { useState, useEffect } from 'react';
import {
  Package,
  Clock,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  TrendingUp,
  Award,
  Truck,
  Activity,
  CheckCircle2,
  Box,
  Wallet,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Link, router } from '@inertiajs/react';

const COLORS = {
  navy: "#293681",
  gold: "#F59E0B",
  mist: "#D0E7E6",
  teal: "#4274D9",
  cream: "#F9F8F6",
};

const STAGES = ["Diproses", "Dikirim", "Diterima"];

// Fallback jika database pesan terima kasih panti masih kosong
const DEFAULT_IMPACT_STORIES = [
  {
    id: 0,
    quote: "Terima kasih atas bantuan Anda. Setiap donasi yang tersalurkan sangat berarti bagi anak-anak di panti kami.",
    author: "Pengurus Panti",
    panti: "Panti Asuhan Mitra"
  }
];

export interface ImpactStory {
  id: number;
  quote: string;
  author: string;
  panti: string;
}

interface OverviewProps {
  donaturData?: {
    nama_lengkap: string;
    kota: string | null;
  } | null;
  recentDonations?: any[];
  urgentNeeds?: any[];
  stats?: { totalDonasi: number; pantiTerbantu: number };
  needsResi?: any[];
  impactStories?: ImpactStory[]; // Props baru untuk Kisah Dampak Real
}

export default function DonaturOverview({
  donaturData = null,
  recentDonations = [],
  urgentNeeds = [],
  stats = { totalDonasi: 0, pantiTerbantu: 0 },
  needsResi = [],
  impactStories = [],
}: OverviewProps) {

  const firstName = donaturData?.nama_lengkap?.split(' ')[0] ?? 'Donatur';
  const activeDonations = recentDonations.filter(d => d.stage < 2);

  // Gunakan data real jika ada, jika tidak pakai fallback
  const storiesToDisplay = impactStories.length > 0 ? impactStories : DEFAULT_IMPACT_STORIES;

  const goToDonasi = () => {
    router.visit(window.location.pathname + '?tab=donasi');
  };

  const goToCari = () => {
    router.visit(window.location.pathname + '?tab=cari');
  };

  const [activeStory, setActiveStory] = useState(0);

  useEffect(() => {
    if (storiesToDisplay.length <= 1) return;
    const timer = setInterval(() => {
      setActiveStory((prev) => (prev + 1) % storiesToDisplay.length);
    }, 6000); 
    return () => clearInterval(timer);
  }, [storiesToDisplay.length]);

  const nextStory = () => {
    if (storiesToDisplay.length === 0) return;
    setActiveStory((prev) => (prev + 1) % storiesToDisplay.length);
  };

  const prevStory = () => {
    if (storiesToDisplay.length === 0) return;
    setActiveStory((prev) => (prev - 1 + storiesToDisplay.length) % storiesToDisplay.length);
  };

  return (
    <div className="space-y-6 w-full font-sans">
      
      {/* ================= HERO SECTION ================= */}
      <div className="relative bg-[#4274D9] rounded-[2rem] p-8 md:p-10 overflow-hidden shadow-lg shadow-[#4274D9]/20">
        <div className="absolute -top-32 -right-32 w-[30rem] h-[30rem] bg-white rounded-full mix-blend-overlay filter blur-[90px] opacity-25"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#293681] rounded-full mix-blend-multiply filter blur-[80px] opacity-30 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-3xl">
            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight mb-2 text-white">
              Halo, {firstName}.
            </h1>
            <p className="text-sm font-semibold opacity-90 text-white max-w-xl">
              {activeDonations.length > 0 ? (
                <>Kebaikan Anda sedang dalam perjalanan. Saat ini ada <strong style={{ color: COLORS.gold }}>{activeDonations.length} donasi</strong> yang diproses.</>
              ) : stats.totalDonasi > 0 ? (
                <>Semua donasi Anda telah berhasil diterima. Terima kasih atas kebaikan Anda!</>
              ) : (
                <>Selamat datang! Mulai donasi pertama Anda dan bantu panti asuhan di sekitar Anda.</>
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-6 items-center shrink-0 mt-2 lg:mt-0 lg:ml-auto">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white/10 border border-white/10 backdrop-blur-sm">
                <Package size={20} style={{ color: COLORS.mist }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">{stats.totalDonasi}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-80" style={{ color: COLORS.mist }}>Total Donasi</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white/10 border border-white/10 backdrop-blur-sm">
                <Activity size={20} style={{ color: COLORS.mist }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">{stats.pantiTerbantu}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-80" style={{ color: COLORS.mist }}>Panti Terbantu</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CONDITIONAL ACTION BANNER ================= */}
      {needsResi.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-[1.5rem] p-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-sm font-extrabold text-red-900">Perlu Tindakan: Input Resi Pengiriman</p>
              <p className="text-xs font-semibold text-red-700 opacity-80 mt-0.5">
                Donasi <strong>{needsResi[0]?.item}</strong> menunggu nomor resi pengiriman.
              </p>
            </div>
          </div>
          <button
            onClick={goToDonasi}
            className="whitespace-nowrap text-xs border border-red-200 font-bold flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl text-red-500 transition-transform hover:scale-[1.02] shrink-0"
          >
            Input Resi <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* ================= ROW 2: Lacak (Kiri) & Dampak (Kanan) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Lacak Donasi (Span 7) */}
        <div className="lg:col-span-7 bg-white rounded-[2rem] p-6 md:p-8 border shadow-sm flex flex-col justify-between" style={{ borderColor: COLORS.mist }}>
          <div>
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-[#293681]/">
              <div>
                <h2 className="text-lg font-bold" style={{ color: COLORS.navy }}>Lacak Donasi Anda</h2>
                <p className="text-xs font-semibold opacity-70 mt-0.5" style={{ color: COLORS.navy }}>
                  3 donasi terbaru
                </p>
              </div>
              <button
                onClick={goToDonasi}
                className="text-xs font-bold flex items-center gap-1 hover:opacity-70 transition-opacity"
                style={{ color: COLORS.teal }}
              >
                Lihat Semua <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="space-y-4">
              {recentDonations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Box size={32} className="mb-3 opacity-20" style={{ color: COLORS.navy }} />
                  <p className="text-sm font-semibold opacity-40" style={{ color: COLORS.navy }}>
                    Belum ada donasi. Mulai berdonasi sekarang!
                  </p>
                  <button
                    onClick={goToCari}
                    className="mt-4 text-xs font-bold px-5 py-2 rounded-full text-white"
                    style={{ backgroundColor: COLORS.teal }}
                  >
                    Cari Panti
                  </button>
                </div>
              ) : (
                recentDonations.map((d: any) => (
                  <div key={d.id_raw} className="p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30 hover:bg-white transition-colors" style={{ borderColor: COLORS.mist }}>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border bg-white flex items-center justify-center shadow-sm shrink-0 border-[#4274D9]/50" style={{ color: COLORS.teal }}>
                        {d.type === 'Dana' ? <Wallet size={18} /> : <Box size={18} />}
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold" style={{ color: COLORS.navy }}>{d.item}</h4>
                        <p className="text-[11px] font-semibold opacity-70" style={{ color: COLORS.navy }}>{d.org}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-start sm:items-end shrink-0 w-full sm:w-auto mt-3 sm:mt-0">
                      <div className="flex items-center gap-3 mb-3">
                        <span 
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border
                            ${d.stage === 0 ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                              d.stage === 1 ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                              'bg-emerald-50 text-emerald-600 border-emerald-200'}`}
                        >
                          {d.stage === 0 && <Clock size={12} />}
                          {d.stage === 1 && <Truck size={12} />}
                          {d.stage === 2 && <CheckCircle2 size={12} />}
                          {STAGES[d.stage]}
                        </span>
                        
                        {d.type === 'Dana' ? (
                          d.status === 'Pending' ? (
                            <Link
                              href={`/donatur/donasi-uang/bayar/${d.id_raw}`}
                              className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"
                            >
                              Bayar
                            </Link>
                          ) : (
                            <span className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full">
                              Selesai
                            </span>
                          )
                        ) : (
                          <Link
                            href={`/donasi/${d.id_raw}`}
                            className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border hover:bg-gray-50 transition-colors border border-[#4274D9]/20 hover:bg-[#4274D9] hover:text-white"
                          >
                            Detail
                          </Link>
                        )}
                      </div>
                      
                      <div className="w-full sm:w-48 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000" 
                          style={{ 
                            width: `${(d.stage / (STAGES.length - 1)) * 100}%`, 
                            backgroundColor: d.stage === 2 ? '#10B981' : COLORS.teal 
                        }} 
                        />
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ================= KOLOM KANAN: KISAH DAMPAK FULL HEIGHT ================= */}
        <div className="lg:col-span-5 relative flex flex-col min-h-[320px] lg:min-h-0 w-full mt-6 lg:mt-0">
          
          <div className="absolute inset-0 w-full h-full">
            {storiesToDisplay.map((story, index) => {
              let diff = index - activeStory;
              if (diff < 0) diff += storiesToDisplay.length;

              if (diff > 2) return null;

              return (
                <div
                  key={story.id || index}
                  className="absolute inset-0 w-full h-full rounded-[2rem] p-8 md:p-10 overflow-hidden flex flex-col justify-between transition-all duration-500 ease-in-out border"
                  style={{
                    backgroundColor: COLORS.teal,
                    borderColor: diff === 0 ? 'rgba(255,255,255,0.08)' : 'transparent',
                    zIndex: 30 - diff * 10,
                    transform: `scale(${1 - diff * 0.04}) translateY(${diff * -8}px)`,
                    opacity: diff === 0 ? 1 : diff === 1 ? 0.4 : 0.15,
                    boxShadow: diff === 0 ? '0 20px 25px -5px rgba(8, 58, 79, 0.2)' : 'none'
                  }}
                >
                  <div className="absolute -bottom-6 -right-4 opacity-5 pointer-events-none text-white select-none">
                    <span className="text-[12rem] font-serif leading-none">“</span>
                  </div>
                  
                  <div className="flex items-center justify-between z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 border border-white/20 backdrop-blur-sm">
                      <Award size={12} style={{ color: '#fff' }} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                        Kisah Dampak
                      </span>
                    </div>

                    {storiesToDisplay.length > 1 && (
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); prevStory(); }}
                          className="w-7 h-7 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); nextStory(); }}
                          className="w-7 h-7 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow flex items-center my-6 z-10">
                    <p className="text-sm md:text-base font-medium leading-relaxed italic text-white/90">
                      "{story.quote}"
                    </p>
                  </div>
                  
                  <div className="flex items-end justify-between z-10 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-0.5 h-8 rounded-full" style={{ backgroundColor: COLORS.gold }}></div>
                      <div>
                        <p className="text-xs font-bold text-white">{story.author}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">{story.panti}</p>
                      </div>
                    </div>

                    {storiesToDisplay.length > 1 && (
                      <div className="flex gap-1 mb-1">
                        {storiesToDisplay.map((_, i) => (
                          <div 
                            key={i} 
                            className={`h-1 rounded-full transition-all duration-300 ${activeStory === i ? 'w-4 bg-white' : 'w-1 bg-white/30'}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* ================= ROW 3: Kebutuhan Mendesak ================= */}
      <div className="bg-white rounded-[2rem] p-6 md:p-8 border shadow-sm mt-8" style={{ borderColor: COLORS.mist }}>
        <div className="flex justify-between items-start mb-6 pb-4 border-b border-[#D0E7E6]">
          <div>
            <h2 className="text-lg font-bold" style={{ color: COLORS.navy }}>Kebutuhan Mendesak</h2>
            <p className="text-xs font-semibold opacity-70 mt-0.5" style={{ color: COLORS.navy }}>
              Panti yang membutuhkan bantuan segera
            </p>
          </div>
          <button
            onClick={goToCari}
            className="text-xs font-bold flex items-center gap-1 hover:opacity-70 transition-opacity"
            style={{ color: COLORS.teal }}
          >
            Lihat Semua <ArrowUpRight size={14} />
          </button>
        </div>

        {urgentNeeds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 size={28} className="mb-2 text-emerald-400" />
            <p className="text-sm font-semibold opacity-50" style={{ color: COLORS.navy }}>
              Tidak ada kebutuhan mendesak saat ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {urgentNeeds.map((c: any) => {
              const pct = c.total > 0 ? Math.round((c.filled / c.total) * 100) : 0;
              return (
                <div key={c.id} className="flex flex-col p-4 rounded-2xl border bg-gray-50/30 hover:bg-white transition-colors" style={{ borderColor: COLORS.mist }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-100 uppercase tracking-widest flex items-center gap-1 shrink-0">
                       <TrendingUp size={10} /> Mendesak
                    </span>
                  </div>
                  
                  <h4 className="text-sm font-extrabold truncate mb-1" style={{ color: COLORS.navy }}>
                    {c.item}
                  </h4>
                  <p className="text-[11px] font-semibold opacity-70 flex items-center gap-1 mb-5" style={{ color: COLORS.navy }}>
                    <MapPin size={10} style={{ color: COLORS.teal }} /> {c.org}
                  </p>

                  <div className="mt-auto">
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="text-[10px] font-bold opacity-60 uppercase" style={{ color: COLORS.navy }}>Progres</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs font-extrabold" style={{ color: COLORS.navy }}>{c.filled}</span>
                        <span className="text-[10px] font-bold opacity-60" style={{ color: COLORS.navy }}>/ {c.total} {c.unit}</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden mb-4">
                      <div 
                        className="h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${pct}%`, backgroundColor: COLORS.teal }} 
                      />
                    </div>
                    <button
                      onClick={goToCari}
                      className="w-full py-2.5 bg-[#4274D9] hover:bg-[#293681] text-xs font-bold rounded-xl border transition-colors text-white"
                    >
                      Bantu Sekarang
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}