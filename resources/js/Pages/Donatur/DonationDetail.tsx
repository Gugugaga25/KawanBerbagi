import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  ExternalLink, 
  Clock, 
  Truck, 
  CheckCircle2, 
  MapPin, 
  User, 
  Phone, 
  MessageSquare, 
  Camera, 
  X,
  Menu
} from 'lucide-react';

import DonaturSidebar, { DonaturTabType } from '@/Components/Donatur/DonaturSidebar';
import DonaturHeader from '@/Components/Donatur/DonaturHeader';

const COLORS = {
  navy: "#293681",
  gold: "#F59E0B",
  mist: "#D0E7E6",
  teal: "#4274D9",
  cream: "#F8FAFC",
};

function CountdownTimer({ createdAt }: { createdAt: string }) {
  const [timeLeft, setTimeLeft] = useState('');

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const created = new Date(createdAt).getTime();
      const limit = created + 24 * 60 * 60 * 1000;
      const difference = limit - Date.now();

      if (difference <= 0) {
        return 'Waktu Habis';
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return `${hours}j ${minutes}m ${seconds}d lagi`;
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt]);

  return (
    <span className="font-bold text-red-500 text-xs px-2.5 py-1 rounded bg-red-50 border border-red-100 flex items-center gap-1 shrink-0 self-start sm:self-auto">
      {timeLeft}
    </span>
  );
}

interface DonationDetailProps {
  donation: {
    id: string;
    id_raw: number;
    barang: string;
    jumlah: number;
    satuan: string;
    status: string;
    kurir: string;
    resi: string;
    pesan: string;
    tanggal: string;
    bukti_penerimaan: string | null;
    ucapan_terimakasih: string;
    created_at?: string | null;
    panti: {
      nama: string;
      penanggung_jawab: string;
      alamat: string;
      telepon: string;
    };
  };
  auth?: any;
  donaturData?: any;
  stats?: { totalDonasi: number; pantiTerbantu: number };
}

export default function DonationDetail({ 
  donation,
  auth,
  donaturData = null,
  stats = { totalDonasi: 0, pantiTerbantu: 0 }
}: DonationDetailProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeTab: DonaturTabType = 'donasi';

  const [copied, setCopied] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Status index mapping
  let currentStageIndex = 0;
  if (donation.status === 'Dikirim' || donation.status === 'Akan Dijemput') currentStageIndex = 1;
  else if (donation.status === 'Diterima') currentStageIndex = 2;

  const stages = [
    { 
      title: donation.status === 'Menunggu Konfirmasi Jemput' ? 'Menunggu Konfirmasi' : 'Diproses', 
      desc: donation.status === 'Menunggu Konfirmasi Jemput' ? 'Menunggu pihak panti menyetujui penjemputan' : 'Donasi sedang dipersiapkan oleh Donatur', 
      icon: Clock 
    },
    { 
      title: donation.status === 'Akan Dijemput' ? 'Akan Dijemput' : 'Dikirim', 
      desc: donation.status === 'Akan Dijemput' ? 'Panti telah mengonfirmasi akan menjemput barang' : (donation.kurir !== '-' ? `${donation.kurir} (${donation.resi})` : 'Dalam perjalanan kurir'), 
      icon: Truck 
    },
    { 
      title: 'Diterima', 
      desc: 'Barang donasi telah diterima dan diverifikasi oleh Panti', 
      icon: CheckCircle2 
    },
  ];

  const handleCopyResi = () => {
    if (donation.resi && donation.resi !== '-') {
      navigator.clipboard.writeText(donation.resi);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getWhatsAppLink = (phone: string) => {
    if (!phone || phone === '-') return '#';
    const cleanNumber = phone.replace(/[^0-9]/g, '');
    const formattedNumber = cleanNumber.startsWith('0') 
      ? '62' + cleanNumber.slice(1) 
      : cleanNumber;
    return `https://wa.me/${formattedNumber}?text=Halo%20Pengurus%20${encodeURIComponent(donation.panti.nama)}%2C%20saya%20ingin%20menanyakan%20perihal%20donasi%20${encodeURIComponent(donation.barang)}%20(${donation.jumlah}%20${donation.satuan})%20dengan%20ID%20${donation.id}.`;
  };

  const handleTabChange = (tab: DonaturTabType) => {
    setIsMobileMenuOpen(false);
    const destinationUrl = tab === 'dashboard'
      ? route('donatur.dashboard')
      : `${route('donatur.dashboard')}?tab=${tab}`;
    router.visit(destinationUrl);
  };

  return (
    <div className="flex h-screen font-sans bg-[#F8FAFC] text-[#293681] overflow-hidden">
      
      {/* ================= OVERLAY MOBILE ================= */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <div className={`fixed inset-y-0 left-0 z-50 h-full transform transition-transform duration-300 ease-in-out w-64 lg:w-64 lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <DonaturSidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
          donaturData={donaturData} 
          stats={stats} 
        />
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Header Mobile */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-[#293681] z-30 shadow-md">
          <div className="flex items-center gap-3 text-white">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <Menu size={20} />
            </button>
            <span className="font-extrabold tracking-wide uppercase text-sm">Rincian Donasi</span>
          </div>
        </div>

        {/* Header Desktop */}
        <div className="hidden lg:block bg-white border-b border-slate-100">
          <DonaturHeader activeTab={activeTab} donaturData={donaturData} />
        </div>

        {/* Area Scroll Konten */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative">
          <div className="max-w-7xl mx-auto space-y-6">
            <Head title={`Rincian Donasi - ${donation.id}`} />

            {/* BUTTON KEMBALI & BADGE ID */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <Link 
                href={route('donatur.dashboard') + '?tab=donasi'} 
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-sm font-bold text-slate-600 hover:text-[#293681] rounded-xl shadow-sm transition-all group w-fit"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> 
                Kembali ke Riwayat
              </Link>
              
              <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-black tracking-wide uppercase text-slate-500 shadow-sm self-start sm:self-auto">
                ID Transaksi: <span className="text-[#4274D9]">{donation.id}</span>
              </div>
            </div>

            {/* BANNER STATUS KHUSUS */}
            {donation.status === 'Diproses' && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-[#293681] flex items-center gap-2">
                    <Clock size={16} className="text-[#F59E0B]" />
                    Lengkapi Informasi Pengiriman
                  </h4>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    Kuota donasi Anda sudah dikunci. Silakan masukkan nomor resi kurir (atau konfirmasi jalan untuk Antar Mandiri) sebelum waktu habis agar slot tidak dibatalkan otomatis.
                  </p>
                </div>
                {donation.created_at && <CountdownTimer createdAt={donation.created_at} />}
              </div>
            )}

            {donation.status === 'Menunggu Konfirmasi Jemput' && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-[#293681] flex items-center gap-2">
                    <Clock size={16} className="text-[#F59E0B]" />
                    Menunggu Konfirmasi Panti
                  </h4>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    Pihak panti sedang dihubungi untuk mengonfirmasi penjemputan barang ini. Batas waktu bagi panti untuk mengonfirmasi:
                  </p>
                </div>
                {donation.created_at && <CountdownTimer createdAt={donation.created_at} />}
              </div>
            )}

            {donation.status === 'Batal' && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3 shadow-sm">
                <X size={20} className="text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-extrabold text-red-700">Donasi Dibatalkan Otomatis</h4>
                  <p className="text-xs text-red-600 font-semibold leading-relaxed">
                    Donasi ini telah dibatalkan otomatis oleh sistem karena batas waktu konfirmasi / kelengkapan data pengiriman 24 jam telah habis. Kuota barang telah dilepas kembali untuk donatur lain.
                  </p>
                </div>
              </div>
            )}

            {/* ================= SUSUNAN LAYOUT GRID ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* KOLOM KIRI (Spesifikasi Barang & Timeline) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* 1. Item Details Card */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Rincian Barang Donasi
                  </div>
                  <h1 className="text-2xl font-black mb-1 text-[#293681]">
                    {donation.barang}
                  </h1>
                  <p className="text-lg font-bold mb-6 text-[#4274D9]">
                    Jumlah: {donation.jumlah} {donation.satuan}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Tanggal Kirim Form</p>
                      <p className="text-sm font-bold text-[#293681]">{donation.tanggal}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Metode Pengiriman</p>
                      <p className="text-sm font-bold text-[#293681]">
                        {donation.kurir !== '-' ? donation.kurir : 'Belum diisi'}
                      </p>
                    </div>
                  </div>

                  {donation.pesan && donation.pesan !== '-' && (
                    <div className="mt-6 p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-start gap-3">
                      <MessageSquare size={16} className="text-[#4274D9] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#4274D9] mb-1">Pesan Dukungan Anda</p>
                        <p className="text-sm italic font-medium leading-relaxed text-[#293681]">
                          "{donation.pesan}"
                        </p>
                      </div>
                    </div>
                  )}

                  {donation.ucapan_terimakasih && donation.ucapan_terimakasih !== '-' && (
                    <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 mb-1">Ucapan Terima Kasih Panti</p>
                        <p className="text-sm italic font-medium leading-relaxed text-emerald-800">
                          "{donation.ucapan_terimakasih}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Timeline Card */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm">
                  <h3 className="text-base font-extrabold mb-6 text-[#293681]">
                    Status Pengiriman & Penerimaan
                  </h3>

                  {donation.status === 'Batal' ? (
                    <div className="rounded-xl p-5 border border-dashed border-red-200 bg-red-50/50 text-center flex flex-col items-center justify-center">
                      <X size={28} className="text-red-500 mb-2" />
                      <p className="text-sm font-extrabold text-red-700">Donasi Dibatalkan</p>
                      <p className="text-xs text-red-600 mt-1 font-semibold leading-normal">
                        Masa tenggang 24 jam terlampaui tanpa kelengkapan data pengiriman / konfirmasi panti.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {stages.map((stage, idx) => {
                        const Icon = stage.icon;
                        const isCompleted = idx <= currentStageIndex;
                        const isCurrent = idx === currentStageIndex;
                        const isLast = idx === stages.length - 1;

                        return (
                          <div key={stage.title} className="relative pl-12">
                            {!isLast && (
                              <div 
                                className="absolute left-4 top-8 bottom-0 w-0.5 -ml-[1px]" 
                                style={{ backgroundColor: isCompleted ? COLORS.teal : COLORS.mist }}
                              />
                            )}

                            <span 
                              className={`absolute left-0 top-0 rounded-full w-8 h-8 flex items-center justify-center border-2 transition-all ${
                                isCompleted 
                                  ? 'text-white border-transparent' 
                                  : 'bg-white border-slate-200 text-slate-400'
                              }`}
                              style={{
                                backgroundColor: isCompleted ? COLORS.teal : undefined,
                                borderColor: isCompleted ? COLORS.teal : undefined
                              }}
                            >
                              {isCompleted && idx < currentStageIndex ? (
                                <Check size={14} strokeWidth={3} />
                              ) : (
                                <Icon size={14} />
                              )}
                            </span>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 
                                  className={`text-sm font-extrabold uppercase tracking-wider ${
                                    isCurrent ? 'text-[#4274D9]' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                                  }`}
                                >
                                  {stage.title}
                                </h4>
                                {isCurrent && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#4274D9]/10 text-[#4274D9] border border-[#F59E0B]/20">
                                    Status Terkini
                                  </span>
                                )}
                              </div>
                              <p className="text-xs font-semibold leading-relaxed text-slate-500">
                                {stage.desc}
                              </p>

                              {stage.title === 'Dikirim' && isCompleted && donation.resi && donation.resi !== '-' && (
                                <div className="mt-3 inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2 pr-3">
                                  <span className="text-xs font-mono font-bold text-slate-600">{donation.resi}</span>
                                  <button
                                    onClick={handleCopyResi}
                                    className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1"
                                    title="Salin Resi"
                                    type="button"
                                  >
                                    {copied ? (
                                      <>
                                        <Check size={12} className="text-emerald-600" />
                                        <span className="text-[10px] font-bold text-emerald-600">Salin!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy size={12} />
                                        <span className="text-[10px] font-bold">Salin</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>

              {/* KOLOM KANAN (Info Panti & Bukti Penerimaan) */}
              <div className="space-y-6">
                
                {/* 3. Panti Details Card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
                  <h3 className="text-base font-extrabold mb-5 flex items-center gap-2 text-[#293681] border-b border-slate-50 pb-3">
                    <MapPin size={18} className="text-[#4274D9]" /> Panti Penerima
                  </h3>

                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Nama Yayasan</p>
                    <p className="text-sm font-extrabold text-[#293681]">{donation.panti.nama}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Penanggung Jawab</p>
                    <p className="text-sm font-bold flex items-center gap-1.5 text-[#293681]">
                      <User size={13} className="text-[#4274D9]" /> {donation.panti.penanggung_jawab}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Alamat Penerima</p>
                    <p className="text-xs font-semibold leading-relaxed text-slate-600">
                      {donation.panti.alamat}
                    </p>
                  </div>

                  {donation.panti.telepon && donation.panti.telepon !== '-' && (
                    <div className="pt-3">
                      <a
                        href={getWhatsAppLink(donation.panti.telepon)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 text-xs font-bold text-white bg-[#4274D9] hover:bg-[#293681] shadow-sm transition-all py-3 rounded-xl"
                      >
                        <Phone size={14} /> Hubungi via WhatsApp
                      </a>
                    </div>
                  )}
                </div>

                {/* 4. Bukti Penerimaan Card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <h3 className="text-base font-extrabold mb-4 flex items-center gap-2 text-[#293681]">
                    <Camera size={18} className="text-[#4274D9]" /> Bukti Barang
                  </h3>

                  {donation.status === 'Diterima' ? (
                    donation.bukti_penerimaan ? (
                      <div className="space-y-3">
                        <div 
                          onClick={() => setIsLightboxOpen(true)}
                          className="group relative cursor-zoom-in rounded-xl overflow-hidden aspect-video border border-slate-200 bg-slate-50 transition-shadow hover:shadow-md"
                        >
                          <img 
                            src={donation.bukti_penerimaan} 
                            alt="Bukti Penerimaan"
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=600';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all">
                            <span className="opacity-0 group-hover:opacity-100 text-white font-bold text-xs bg-black/60 px-3 py-1.5 rounded-full transition-all flex items-center gap-1">
                              <ExternalLink size={12} /> Perbesar
                            </span>
                          </div>
                        </div>
                        <p className="text-[10px] font-bold text-center text-slate-400 italic">
                          Klik foto untuk memperbesar
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-xl p-6 border border-dashed border-slate-200 bg-slate-50 text-center flex flex-col items-center justify-center">
                        <Camera size={24} className="text-slate-300 mb-2" />
                        <p className="text-xs font-semibold text-slate-500">
                          Foto belum diunggah Panti.
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="rounded-xl p-6 border border-dashed border-slate-200 bg-slate-50 text-center flex flex-col items-center justify-center">
                      <Clock size={24} className="text-slate-300 mb-2" />
                      <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                        Bukti akan tersedia setelah barang diterima Panti.
                      </p>
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        </div>
      </main>

      {/* ================= LIGHTBOX MODAL FOR IMAGE ZOOM ================= */}
      {isLightboxOpen && donation.bukti_penerimaan && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 text-white hover:text-red-500 rounded-full transition duration-150"
            title="Tutup Preview"
          >
            <X size={24} />
          </button>

          <div className="max-w-4xl max-h-[85vh] w-full flex items-center justify-center p-2 rounded-2xl overflow-hidden bg-black/40">
            <img 
              src={donation.bukti_penerimaan} 
              alt="Bukti Penerimaan Fullscreen" 
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-200"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1200';
              }}
            />
          </div>

          <div className="mt-4 text-center max-w-lg">
            <h4 className="text-white font-extrabold text-sm">{donation.panti.nama}</h4>
            <p className="text-slate-400 text-xs mt-1">Bukti untuk: {donation.barang} ({donation.jumlah} {donation.satuan})</p>
          </div>
        </div>
      )}
    </div>
  );
}