import React from 'react';
import {
  Camera,
  CheckCircle2,
  Package,
  Plus,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  ExternalLink,
} from 'lucide-react';
import { Link, router } from '@inertiajs/react';

interface PantiOverviewProps {
  pantiData?: any;
  needs?: any[];
  donations?: any[];
  notifications?: any[];
}

export default function PantiOverview({ pantiData, needs = [], donations = [], notifications = [] }: PantiOverviewProps) {
  const orgName = pantiData?.nama_yayasan || "Panti Asuhan";

  // --- 1. Perhitungan Donasi & Rincian Logistik ---
  const totalDonations = donations.length;

  const sembakoCount = donations.filter((d: any) => {
    const txt = ((d.barang || '') + ' ' + (d.val || '') + ' ' + (d.type || '')).toLowerCase();
    return txt.includes('beras') || txt.includes('minyak') || txt.includes('makanan') || txt.includes('susu') || txt.includes('sembako') || txt.includes('gula') || txt.includes('mie') || txt.includes('pangan');
  }).length;

  const pakaianCount = donations.filter((d: any) => {
    const txt = ((d.barang || '') + ' ' + (d.val || '') + ' ' + (d.type || '')).toLowerCase();
    return txt.includes('pakaian') || txt.includes('baju') || txt.includes('selimut') || txt.includes('celana') || txt.includes('jaket') || txt.includes('handuk');
  }).length;

  const bukuCount = Math.max(0, totalDonations - sembakoCount - pakaianCount);

  const sembakoPct = totalDonations > 0 ? Math.round((sembakoCount / totalDonations) * 100) : 0;
  const pakaianPct = totalDonations > 0 ? Math.round((pakaianCount / totalDonations) * 100) : 0;
  const bukuPct = totalDonations > 0 ? Math.max(0, 100 - sembakoPct - pakaianPct) : 0;

  // --- 2. Data Grafik Garis (Past 6 Months Dynamic) ---
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const currentMonthIdx = new Date().getMonth();
  const last6Months: { month: string; monthIdx: number; year: number; value: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const dateObj = new Date();
    dateObj.setMonth(currentMonthIdx - i);
    last6Months.push({
      month: monthNames[dateObj.getMonth()],
      monthIdx: dateObj.getMonth(),
      year: dateObj.getFullYear(),
      value: 0
    });
  }

  donations.forEach((d: any) => {
    if (!d.created_at_raw) return;
    const dDate = new Date(d.created_at_raw);
    const itemMonth = dDate.getMonth();
    const itemYear = dDate.getFullYear();

    const targetIndex = last6Months.findIndex(m => m.monthIdx === itemMonth && m.year === itemYear);
    if (targetIndex !== -1) {
      last6Months[targetIndex].value += 1;
    }
  });

  const chartData = last6Months.map(x => ({ month: x.month, value: x.value }));
  const maxVal = Math.max(10, ...chartData.map(c => c.value));

  // --- SVG Math ---
  const SVG_W = 600;
  const SVG_H = 240;
  const PAD_T = 20;
  const PAD_B = 30;
  const PAD_L = 40;
  const PAD_R = 20;
  const G_W = SVG_W - PAD_L - PAD_R;
  const G_H = SVG_H - PAD_T - PAD_B;

  const getX = (index: number) => PAD_L + (index * (G_W / (chartData.length - 1)));
  const getY = (val: number) => PAD_T + G_H - ((val / maxVal) * G_H);
  const pathD = `M ${chartData.map((d, i) => `${getX(i)} ${getY(d.value)}`).join(' L ')}`;

  const handleNavDonasi = () => {
    router.visit('/panti/dashboard?tab=donasi');
  };

  const handleNavKebutuhan = () => {
    router.visit('/panti/dashboard?tab=kebutuhan');
  };

  // --- 3. Paket Menunggu Konfirmasi ---
  const incomingDeliveries = donations.filter((d: any) => d.status === 'Dikirim' || d.status === 'Proses' || d.status === 'Pending');

  // --- 4. Priority Wishlist Needs ---
  const priorityNeeds = needs.filter((n: any) => n.status === 'aktif' || (n.target && n.terkumpul < n.target)).slice(0, 3);

  return (
    <div className="space-y-6 w-full">
      
      {/* ================= HERO SECTION (Card Navy) ================= */}
      <div className="bg-[#4274D9] rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider bg-white/10 px-3 py-1.5 rounded-md border border-white/5">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Selamat Datang, <span className="text-[#F59E0B]">{orgName}</span>
          </h1>
          <p className="text-sm text-[#D0E7E6] mt-3 max-w-1xl leading-relaxed">
            Akun aktif terverifikasi. Monitor laju logistik, sisa stok harian, dan distribusi kebutuhan panti Anda dengan mudah dari satu tempat.
          </p>
        </div>
      </div>

      {/* ================= BANNER PERINGATAN RESMI DARI ADMIN (DI BAWAH HERO SECTION) ================= */}
      {notifications && notifications.filter((n: any) => (!n.is_read) && (n.type === 'admin_warning' || n.type === 'admin_takedown')).length > 0 && (
        <div className="space-y-3">
          {notifications.filter((n: any) => (!n.is_read) && (n.type === 'admin_warning' || n.type === 'admin_takedown')).map((notif: any) => (
            <div key={notif.id} className="bg-rose-50 border-2 border-rose-300 rounded-[2rem] p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 font-bold shadow-sm">
                  <AlertTriangle size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                    <h4 className="font-extrabold text-sm md:text-base text-rose-900 uppercase tracking-wide flex items-center gap-2">
                      <span>{notif.title}</span>
                      <span className="text-[10px] bg-rose-200 text-rose-900 px-2.5 py-0.5 rounded-full font-black uppercase">
                        {notif.type === 'admin_warning' ? 'PERINGATAN RESMI' : 'TAKEDOWN KONTEN'}
                      </span>
                    </h4>
                    <span className="text-xs font-semibold text-rose-500">
                      {new Date(notif.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-rose-800 font-bold leading-relaxed bg-white/70 p-3 rounded-xl border border-rose-200 mt-2 truncate">
                    Catatan Admin: "{notif.body}"
                  </p>
                </div>
              </div>

              {/* Tombol Lihat Detail Peringatan Halaman Baru */}
              <div className="w-full md:w-auto shrink-0 pt-2 md:pt-0">
                <Link
                  href={`/panti/peringatan/${notif.id}`}
                  className="w-full md:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Lihat Detail Peringatan</span>
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= DATA GRID ROW 1: Statistik & Grafik Garis ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Total Donasi Masuk */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-200/80 shadow-sm flex flex-col h-full">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-bold uppercase tracking-widest text-[#5E6C9E]">Ringkasan Logistik</span>
              <span className="text-xs font-bold bg-[#F2F5FB] px-3 py-1.5 rounded-md text-[#293681]">Semua Data</span>
            </div>
            
            <h3 className="text-5xl font-black text-[#4274D9] tracking-tight">
              {totalDonations} <span className="text-2xl text-[#5E6C9E] font-bold">Paket</span>
            </h3>
            <p className="text-sm text-[#5E6C9E] mt-2.5 leading-relaxed">
              Total donasi tercatat di database panti.
            </p>
          </div>

          {/* Rincian Kategori Logistik */}
          <div className="mt-auto pt-8 space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-[#293681]">Sembako & Pangan</span>
                <span className="text-[#4274D9]">{sembakoCount} Pkt</span>
              </div>
              <div className="h-2.5 rounded-full bg-[#F2F5FB] overflow-hidden">
                <div className="h-full rounded-full bg-[#4274D9] transition-all" style={{ width: `${sembakoPct}%` }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-[#293681]">Pakaian & Selimut</span>
                <span className="text-[#F59E0B]">{pakaianCount} Pkt</span>
              </div>
              <div className="h-2.5 rounded-full bg-[#F2F5FB] overflow-hidden">
                <div className="h-full rounded-full bg-[#F59E0B] transition-all" style={{ width: `${pakaianPct}%` }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-[#293681]">Buku & Lain-lain</span>
                <span className="text-[#5E6C9E]">{bukuCount} Pkt</span>
              </div>
              <div className="h-2.5 rounded-full bg-[#F2F5FB] overflow-hidden">
                <div className="h-full rounded-full bg-[#5E6C9E] transition-all" style={{ width: `${bukuPct}%` }} />
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
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-md">Realtime Database</span>
          </div>

          <div className="relative w-full pt-4 flex-1">
            <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-full overflow-visible">
              
              {/* Garis Grid Horizontal & Label Sumbu Y */}
              {[0, Math.round(maxVal / 2), maxVal].map((val) => {
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
              {chartData.map((d, i) => {
                const x = getX(i);
                const y = getY(d.value);
                const isLast = i === chartData.length - 1;
                
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

      {/* ================= DATA GRID ROW 2: Aksi & Dynamic List ================= */}
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
            {incomingDeliveries.length > 0 && (
              <span className="text-sm font-bold px-3 py-1.5 rounded-md bg-red-50 text-red-600 border border-red-100">
                {incomingDeliveries.length} Menunggu
              </span>
            )}
          </div>

          {incomingDeliveries.length > 0 ? (
            <div className="flex flex-col space-y-4">
              {incomingDeliveries.map((d: any) => (
                <div 
                  key={d.id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#F2F5FB] border border-transparent hover:border-gray-200/80 transition-all"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white text-[#4274D9] shadow-sm">
                      <Package size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-[#293681] truncate">{d.val || d.barang || 'Donasi Logistik'}</p>
                      <p className="text-sm text-[#5E6C9E] mt-1 truncate">
                        Kurir: <span className="font-semibold text-gray-700">{d.detail?.kurir || '-'}</span> • Pengirim: {d.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 pt-3 sm:pt-0 border-t sm:border-0 border-gray-200/40 mt-1 sm:mt-0">
                    <button
                      onClick={handleNavDonasi}
                      className="inline-flex items-center justify-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl bg-[#4274D9] text-white hover:bg-[#293681] transition shadow-sm w-full sm:w-auto"
                    >
                      <Camera size={14} /> Selesai / Bukti
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <CheckCircle2 size={32} className="text-emerald-500 mb-3" />
              <p className="text-base font-bold text-[#293681]">Semua donasi aman & terkonfirmasi</p>
              <p className="text-xs text-gray-500 mt-1">Belum ada paket yang menunggu konfirmasi saat ini.</p>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Wishlist Kebutuhan (Real Database Needs) */}
        <div className="lg:col-span-5 bg-[#4274D9] rounded-[2rem] p-6 md:p-8 text-white flex flex-col h-fit self-start shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded bg-white/10 border border-white/10">
              <Package className="text-[#fff]" size={14} />
              <span className="text-xs font-bold uppercase tracking-widest text-white">Prioritas Panti</span>
            </div>
            <h3 className="text-xl font-extrabold text-white mb-1.5">Wishlist Kebutuhan</h3>
            <p className="text-sm text-[#D0E7E6] mb-6 leading-relaxed">
              Target pengumpulan donasi barang operasional yayasan dari database.
            </p>
            
            {priorityNeeds.length > 0 ? (
              <div className="space-y-4">
                {priorityNeeds.map((c: any) => {
                  const pct = Math.min(100, Math.round(((c.terkumpul || 0) / (c.target || 1)) * 100));
                  return (
                    <div key={c.id || c.barang} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-white truncate max-w-[200px]">{c.barang}</span>
                        <span className="font-semibold text-white">{c.terkumpul || 0}/{c.target} {c.satuan || 'Pcs'}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500" 
                          style={{ width: `${pct}%`, backgroundColor: pct >= 100 ? '#10B981' : '#F59E0B' }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-white/80 border border-dashed border-white/20 rounded-xl">
                Belum ada kebutuhan aktif terdaftar.
              </div>
            )}
          </div>

          <button 
            onClick={handleNavKebutuhan}
            className="mt-6 w-full py-3 rounded-xl bg-white text-[#293681] text-sm font-extrabold hover:bg-[#293681] hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus size={16} /> Buat Item Baru
          </button>
        </div>
      </div>
    </div>
  );
}