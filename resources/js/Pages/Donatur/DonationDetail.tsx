import React, { useState } from 'react';
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
  X 
} from 'lucide-react';
import { Link } from '@inertiajs/react';

const COLORS = {
  navy: "#083A4F",
  gold: "#A58D66",
  mist: "#C0D5D6",
  teal: "#407E8C",
  cream: "#F4F3EF",
  white: "#FFFFFF",
};

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
    panti: {
      nama: string;
      penanggung_jawab: string;
      alamat: string;
      telepon: string;
    };
  };
}

export default function DonationDetail({ donation }: DonationDetailProps) {
  const [copied, setCopied] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Status index mapping
  let currentStageIndex = 0;
  if (donation.status === 'Dikirim') currentStageIndex = 1;
  else if (donation.status === 'Diterima') currentStageIndex = 2;

  const stages = [
    { title: 'Diproses', desc: 'Donasi sedang dipersiapkan oleh Donatur', icon: Clock },
    { title: 'Dikirim', desc: donation.kurir !== '-' ? `${donation.kurir} (${donation.resi})` : 'Dalam perjalanan kurir', icon: Truck },
    { title: 'Diterima', desc: 'Barang donasi telah diterima dan diverifikasi oleh Panti', icon: CheckCircle2 },
  ];

  const handleCopyResi = () => {
    if (donation.resi && donation.resi !== '-') {
      navigator.clipboard.writeText(donation.resi);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Normalize phone number to WhatsApp format (e.g. 0812 -> 62812)
  const getWhatsAppLink = (phone: string) => {
    if (!phone || phone === '-') return '#';
    const cleanNumber = phone.replace(/[^0-9]/g, '');
    const formattedNumber = cleanNumber.startsWith('0') 
      ? '62' + cleanNumber.slice(1) 
      : cleanNumber;
    return `https://wa.me/${formattedNumber}?text=Halo%20Pengurus%20${encodeURIComponent(donation.panti.nama)}%2C%20saya%20ingin%20menanyakan%20perihal%20donasi%20${encodeURIComponent(donation.barang)}%20(${donation.jumlah}%20${donation.satuan})%20dengan%20ID%20${donation.id}.`;
  };

  return (
    <div className="min-h-screen bg-[#F4F3EF] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* ================= BACK BUTTON & HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/donatur/dashboard?tab=donasi"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#083A4F] hover:opacity-80 transition"
          >
            <ArrowLeft size={16} /> Kembali ke Rincian Donasi
          </Link>
          
          <div className="bg-white px-4 py-2 rounded-full border text-xs font-black tracking-wide uppercase text-slate-500 shadow-sm self-start sm:self-auto" style={{ borderColor: COLORS.mist }}>
            ID Transaksi: <span style={{ color: COLORS.teal }}>{donation.id}</span>
          </div>
        </div>

        {/* ================= MAIN TWO-COLUMN CONTENT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT: DONATION & TIMELINE DETAILS (2 Columns on Desktop) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Item Details Card */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 border shadow-sm" style={{ borderColor: COLORS.mist }}>
              <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-wider text-slate-400">
                Rincian Barang Donasi
              </div>
              <h1 className="text-2xl font-black mb-1" style={{ color: COLORS.navy }}>
                {donation.barang}
              </h1>
              <p className="text-lg font-bold mb-6" style={{ color: COLORS.teal }}>
                Jumlah: {donation.jumlah} {donation.satuan}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-6" style={{ borderColor: '#EBEAE6' }}>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Tanggal Kirim Form</p>
                  <p className="text-sm font-bold" style={{ color: COLORS.navy }}>{donation.tanggal}</p>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Metode Pengiriman</p>
                  <p className="text-sm font-bold" style={{ color: COLORS.navy }}>
                    {donation.kurir !== '-' ? donation.kurir : 'Belum diisi'}
                  </p>
                </div>
              </div>

              {donation.pesan && donation.pesan !== '-' && (
                <div className="mt-6 p-4 rounded-2xl bg-[#F9F8F6] border flex items-start gap-3">
                  <MessageSquare size={16} className="text-[#A58D66] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#A58D66] mb-1">Pesan Dukungan Anda</p>
                    <p className="text-sm italic font-medium leading-relaxed" style={{ color: COLORS.navy }}>
                      "{donation.pesan}"
                    </p>
                  </div>
                </div>
              )}

              {donation.ucapan_terimakasih && donation.ucapan_terimakasih !== '-' && (
                <div className="mt-4 p-4 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-[#2E7D32] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#2E7D32] mb-1">Ucapan Terima Kasih Panti</p>
                    <p className="text-sm italic font-medium leading-relaxed text-[#1B5E20]">
                      "{donation.ucapan_terimakasih}"
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Timeline Card */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 border shadow-sm" style={{ borderColor: COLORS.mist }}>
              <h3 className="text-base font-extrabold mb-6" style={{ color: COLORS.navy }}>
                Status Pengiriman & Penerimaan
              </h3>

              {/* Vertical Timeline */}
              <div className="space-y-8">
                {stages.map((stage, idx) => {
                  const Icon = stage.icon;
                  const isCompleted = idx <= currentStageIndex;
                  const isCurrent = idx === currentStageIndex;
                  const isLast = idx === stages.length - 1;

                  return (
                    <div key={stage.title} className="relative pl-12">
                      {/* Vertical Line */}
                      {!isLast && (
                        <div 
                          className="absolute left-4 top-8 bottom-0 w-0.5 -ml-[1px]" 
                          style={{ backgroundColor: isCompleted ? COLORS.teal : COLORS.mist }}
                        />
                      )}

                      {/* Timeline marker */}
                      <span 
                        className={`absolute left-0 top-0 rounded-full w-8 h-8 flex items-center justify-center border-2 transition-all ${
                          isCompleted 
                            ? 'text-white border-transparent' 
                            : 'bg-white border-slate-300 text-slate-400'
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
                              isCurrent ? 'text-[#A58D66]' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                            }`}
                          >
                            {stage.title}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#A58D66]/10 text-[#A58D66]">
                              Status Terkini
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold leading-relaxed text-slate-500">
                          {stage.desc}
                        </p>

                        {/* Extra Actions for Tracking Number */}
                        {stage.title === 'Dikirim' && isCompleted && donation.resi && donation.resi !== '-' && (
                          <div className="mt-3 inline-flex items-center gap-2 bg-gray-50 border rounded-xl p-2 pr-3">
                            <span className="text-xs font-mono font-bold text-slate-600">{donation.resi}</span>
                            <button
                              onClick={handleCopyResi}
                              className="p-1.5 hover:bg-gray-200/50 rounded-lg text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1"
                              title="Salin Resi"
                              type="button"
                            >
                              {copied ? (
                                <>
                                  <Check size={12} className="text-green-600" />
                                  <span className="text-[10px] font-bold text-green-600">Salin!</span>
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
            </div>

          </div>

          {/* RIGHT: PANTI DETAILS & BUKTI PENERIMAAN (1 Column on Desktop) */}
          <div className="space-y-6">
            
            {/* 3. Panti Details Card */}
            <div className="bg-white rounded-[2rem] p-6 border shadow-sm" style={{ borderColor: COLORS.mist }}>
              <h3 className="text-base font-extrabold mb-5 flex items-center gap-2" style={{ color: COLORS.navy }}>
                <MapPin size={18} className="text-[#407E8C]" /> Panti Asuhan Penerima
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Nama Yayasan</p>
                  <p className="text-sm font-extrabold" style={{ color: COLORS.navy }}>{donation.panti.nama}</p>
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Penanggung Jawab</p>
                  <p className="text-sm font-bold flex items-center gap-1.5" style={{ color: COLORS.navy }}>
                    <User size={13} className="text-slate-400" /> {donation.panti.penanggung_jawab}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Alamat Penerima</p>
                  <p className="text-xs font-semibold leading-relaxed text-slate-600">
                    {donation.panti.alamat}
                  </p>
                </div>

                {donation.panti.telepon && donation.panti.telepon !== '-' && (
                  <div className="pt-2">
                    <a
                      href={getWhatsAppLink(donation.panti.telepon)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 hover:shadow-md transition-all py-3 rounded-xl"
                    >
                      <Phone size={14} /> Hubungi via WhatsApp
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Bukti Penerimaan Card */}
            <div className="bg-white rounded-[2rem] p-6 border shadow-sm" style={{ borderColor: COLORS.mist }}>
              <h3 className="text-base font-extrabold mb-4 flex items-center gap-2" style={{ color: COLORS.navy }}>
                <Camera size={18} className="text-[#407E8C]" /> Bukti Penerimaan Barang
              </h3>

              {donation.status === 'Diterima' ? (
                donation.bukti_penerimaan ? (
                  <div className="space-y-3">
                    <div 
                      onClick={() => setIsLightboxOpen(true)}
                      className="group relative cursor-zoom-in rounded-2xl overflow-hidden aspect-video border bg-slate-50 transition-shadow hover:shadow-md"
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
                          <ExternalLink size={12} /> Perbesar Foto
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] font-bold text-center text-slate-400 italic">
                      Klik foto untuk memperbesar tampilan bukti
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl p-6 border border-dashed border-[#C0D5D6] bg-slate-50 text-center flex flex-col items-center justify-center">
                    <Camera size={24} className="text-slate-300 mb-2" />
                    <p className="text-xs font-semibold text-slate-500">
                      Foto bukti belum diunggah oleh Panti.
                    </p>
                  </div>
                )
              ) : (
                <div className="rounded-2xl p-6 border border-dashed border-[#C0D5D6] bg-slate-50 text-center flex flex-col items-center justify-center">
                  <Clock size={24} className="text-slate-300 mb-2" />
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                    Bukti penerimaan akan tersedia setelah barang donasi dinyatakan diterima oleh pihak Panti.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* ================= LIGHTBOX MODAL FOR IMAGE ZOOM ================= */}
      {isLightboxOpen && donation.bukti_penerimaan && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          
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
            <p className="text-slate-400 text-xs mt-1">Bukti Penerimaan untuk: {donation.barang} ({donation.jumlah} {donation.satuan})</p>
          </div>
        </div>
      )}
    </div>
  );
}
