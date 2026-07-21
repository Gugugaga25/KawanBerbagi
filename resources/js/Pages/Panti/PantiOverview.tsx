import React, { useState } from 'react';
import {
  Camera,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Package,
  Plus,
  Handshake,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  Calendar
} from 'lucide-react';

const ORG_NAME = "Yayasan Kasih Ibu";

const COLORS = {
  navy: "#293681",
  gold: "#F59E0B",
  mist: "#D0E7E6",
  teal: "#4274D9",
  cream: "#F2F5FB", // Disesuaikan menjadi sedikit lebih cool/kebiruan agar pas dengan navy
};

const INCOMING_DELIVERIES = [
  { id: 1, donor: "Budi Santoso", item: "Beras 15kg", method: "JNE", resi: "JX9284710" },
  { id: 2, donor: "Aline Wijaya", item: "Buku Pelajaran SD (12 eks)", method: "Antar Mandiri", resi: "-" },
  { id: 3, donor: "PT Sumber Makmur", item: "Susu Bayi (24 kaleng)", method: "SiCepat", resi: "SC1123890" },
];

const OWN_CAMPAIGNS = [
  { item: "Beras Putih Premium", filled: 36, total: 50, unit: "kg" },
  { item: "Susu Formula Bayi", filled: 18, total: 20, unit: "kaleng" },
  { item: "Selimut & Pakaian", filled: 9, total: 30, unit: "pcs" },
];

const TRANSFER_OFFERS = [
  { org: "Panti Wreda Bahagia", item: "Selimut (12 pcs)", distance: "3.2 km" },
  { org: "Rumah Yatim Cahaya", item: "Buku Tulis (5 lusin)", distance: "6.8 km" },
];

// Data Grafik Bulanan
const CHART_DATA = [
  { month: 'Jan', value: 45 },
  { month: 'Feb', value: 68 },
  { month: 'Mar', value: 110 },
  { month: 'Apr', value: 92 },
  { month: 'Mei', value: 135 },
  { month: 'Jun', value: 148 },
];

export default function YayasanOverview() {
  const [deliveries, setDeliveries] = useState(INCOMING_DELIVERIES);

  const handleConfirm = (id: number) => {
    setDeliveries((prev) => prev.filter((d) => d.id !== id));
  };

  // --- Perhitungan Matematis Grafik SVG ---
  const MAX_VAL = 150;
  const SVG_W = 600;
  const SVG_H = 240; 
  const PAD_T = 20;
  const PAD_B = 30;
  const PAD_L = 40;
  const PAD_R = 20;
  
  const G_W = SVG_W - PAD_L - PAD_R;
  const G_H = SVG_H - PAD_T - PAD_B;

  const getX = (index: number) => PAD_L + (index * (G_W / (CHART_DATA.length - 1)));
  const getY = (val: number) => PAD_T + G_H - ((val / MAX_VAL) * G_H);
  
  const pathD = `M ${CHART_DATA.map((d, i) => `${getX(i)} ${getY(d.value)}`).join(' L ')}`;

  return (
    <div className="space-y-6 w-full">
      
      {/* ================= HEADER SECTION (Card Navy) ================= */}
      <div className="bg-[#4274D9] rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider bg-white/10 px-3 py-1.5 rounded-md border border-white/5">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Selamat Datang, <span className="text-[#F59E0B]">{ORG_NAME}</span>
          </h1>
          <p className="text-sm text-[#D0E7E6] mt-3 max-w-1xl leading-relaxed">
            Akun aktif terverifikasi. Monitor laju logistik, sisa stok harian, dan distribusi kebutuhan panti Anda dengan mudah dari satu tempat.
          </p>
        </div>
      </div>

      {/* ================= DATA GRID ROW 1: Statistik & Grafik Garis ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Total Donasi Masuk */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-200/80 shadow-sm flex flex-col h-full">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-bold uppercase tracking-widest text-[#5E6C9E]">Ringkasan Logistik</span>
              <span className="text-xs font-bold bg-[#F2F5FB] px-3 py-1.5 rounded-md text-[#293681]">Bulan Ini</span>
            </div>
            
            <h3 className="text-5xl font-black text-[#4274D9] tracking-tight">
              148 <span className="text-2xl text-[#5E6C9E] font-bold">Paket</span>
            </h3>
            <p className="text-sm text-[#5E6C9E] mt-2.5 leading-relaxed">
              Total donasi sukses mendarat di gudang.
            </p>
          </div>

          {/* Rincian Kategori Logistik */}
          <div className="mt-auto pt-8 space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-[#293681]">Sembako & Pangan</span>
                <span className="text-[#4274D9]">82 Pkt</span>
              </div>
              <div className="h-2.5 rounded-full bg-[#F2F5FB] overflow-hidden">
                <div className="h-full rounded-full bg-[#4274D9]" style={{ width: '55%' }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-[#293681]">Pakaian & Selimut</span>
                <span className="text-[#F59E0B]">40 Pkt</span>
              </div>
              <div className="h-2.5 rounded-full bg-[#F2F5FB] overflow-hidden">
                <div className="h-full rounded-full bg-[#F59E0B]" style={{ width: '27%' }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-[#293681]">Buku & Lain-lain</span>
                <span className="text-[#5E6C9E]">26 Pkt</span>
              </div>
              <div className="h-2.5 rounded-full bg-[#F2F5FB] overflow-hidden">
                <div className="h-full rounded-full bg-[#5E6C9E]" style={{ width: '18%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 & 3: Grafik Garis / Line Chart */}
        <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-[2rem] border border-gray-200/80 shadow-sm flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <TrendingUp size={20} className="text-[#4274D9]" />
              <h4 className="text-sm font-bold text-[#293681] uppercase tracking-wider">Tren Volume Donasi</h4>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-md">+15% Bulan Ini</span>
          </div>

          <div className="relative w-full pt-4 flex-1">
            <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-full overflow-visible">
              
              {/* Garis Grid Horizontal & Label Sumbu Y */}
              {[0, 50, 100, 150].map((val) => {
                const y = getY(val);
                return (
                  <g key={`y-${val}`}>
                    <text x={PAD_L - 10} y={y + 5} textAnchor="end" fontSize="13" fill="#5E6C9E" fontWeight="600">
                      {val}
                    </text>
                    <line x1={PAD_L} y1={y} x2={SVG_W - PAD_R} y2={y} stroke="#F2F5FB" strokeWidth="1.5" strokeDasharray="4" />
                  </g>
                );
              })}
              
              {/* Garis Grafik Utama */}
              <path
                d={pathD}
                fill="none"
                stroke="#4274D9"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Label Sumbu X & Interaksi Titik (Hover) */}
              {CHART_DATA.map((d, i) => {
                const x = getX(i);
                const y = getY(d.value);
                const isLast = i === CHART_DATA.length - 1;
                
                return (
                  <g key={`pt-${i}`} className="group cursor-pointer">
                    <text x={x} y={SVG_H - 2} textAnchor="middle" fontSize="13" fill="#293681" fontWeight="bold">
                      {d.month}
                    </text>
                    <circle cx={x} cy={y} r="20" fill="transparent" />
                    <circle 
                      cx={x} 
                      cy={y} 
                      r={isLast ? "6" : "5"} 
                      fill={isLast ? "#F59E0B" : "#4274D9"} 
                      className={isLast ? "stroke-white stroke-2" : "group-hover:r-[7px] group-hover:fill-[#F59E0B] transition-all"} 
                    />
                    <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <rect x={x - 26} y={y - 40} width="52" height="28" rx="6" fill="#293681" className="shadow-lg" />
                      <path d={`M ${x-6} ${y-12} L ${x} ${y-6} L ${x+6} ${y-12} Z`} fill="#293681" />
                      <text x={x} y={y - 21} textAnchor="middle" fontSize="13" fill="white" fontWeight="bold">
                        {d.value}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

      </div>

      {/* ================= DATA GRID ROW 2: Aksi & AI Insight ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kolom Kiri: Konfirmasi Penerimaan */}
        <div className="lg:col-span-7 bg-white rounded-[2rem] p-6 md:p-8 border border-gray-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <span className="text-sm font-bold uppercase tracking-widest text-[#F59E0B]">Konfirmasi Paket</span>
              </div>
              <h3 className="text-xl font-extrabold text-[#293681]">Konfirmasi Penerimaan</h3>
            </div>
            {deliveries.length > 0 && (
              <span className="text-sm font-bold px-3 py-1.5 rounded-md bg-red-50 text-red-600 border border-red-100">
                {deliveries.length} Menunggu
              </span>
            )}
          </div>

          {deliveries.length > 0 ? (
            <div className="flex flex-col space-y-4">
              {deliveries.map((d) => (
                <div 
                  key={d.id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#F2F5FB] border border-transparent hover:border-gray-200/80 transition-all"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white text-[#4274D9] shadow-sm">
                      <Package size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-[#293681] truncate">{d.item}</p>
                      <p className="text-sm text-[#5E6C9E] mt-1 truncate">
                        Kurir: <span className="font-semibold text-gray-700">{d.method}</span> • Pengirim: {d.donor}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 pt-3 sm:pt-0 border-t sm:border-0 border-gray-200/40 mt-1 sm:mt-0">
                    <button
                      onClick={() => handleConfirm(d.id)}
                      className="inline-flex items-center justify-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl bg-[#4274D9] text-white hover:bg-[#1E2866] transition shadow-sm w-full sm:w-auto"
                    >
                      <Camera size={14} /> Selesai
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <CheckCircle2 size={32} className="text-emerald-500 mb-3" />
              <p className="text-base font-bold text-[#293681]">Semua donasi aman</p>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Wishlist Kebutuhan (Tema Navy) */}
        <div className="lg:col-span-5 bg-[#4274D9] rounded-[2rem] p-6 md:p-8 text-white flex flex-col justify-between shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded bg-white/10 border border-white/10">
              <Package className="text-[#fff]" size={14} />
              <span className="text-xs font-bold uppercase tracking-widest text-white">Prioritas Panti</span>
            </div>
            <h3 className="text-xl font-extrabold text-white mb-1.5">Wishlist Kebutuhan</h3>
            <p className="text-sm text-[#D0E7E6] mb-6 leading-relaxed">
              Target pengumpulan donasi barang operasional yayasan.
            </p>
            
            <div className="space-y-5">
              {OWN_CAMPAIGNS.map((c) => {
                const pct = Math.round((c.filled / c.total) * 100);
                return (
                  <div key={c.item} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-white truncate max-w-[200px]">{c.item}</span>
                      <span className="font-semibold text-white">{c.filled}/{c.total} {c.unit}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ width: `${pct}%`, backgroundColor: pct > 80 ? '#10B981' : '#F59E0B' }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button className="mt-8 w-full py-3 rounded-xl bg-white text-[#293681] text-sm font-bold hover:bg-[#293681] hover:text-white transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Plus size={16} /> Buat Item Baru
          </button>
        </div>
      </div>
    </div>
  );
}