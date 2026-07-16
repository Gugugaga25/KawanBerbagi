import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
  ArrowLeft, Wallet, Heart, CreditCard, 
  Smartphone, CheckCircle2, MessageSquare, 
  Building2, ShieldCheck, Menu, ChevronDown, Coffee,
  Info, Users, Sparkles
} from 'lucide-react';

import DonaturSidebar from '@/Components/Donatur/DonaturSidebar';
import DonaturHeader from '@/Components/Donatur/DonaturHeader';

const COLORS = {
  navy: "#083A4F",
  gold: "#A58D66",
  mist: "#C0D5D6",
  teal: "#407E8C",
  cream: "#E5E1DD",
};

// Helper untuk format Rupiah
const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(angka);
};



export default function DonasiUang({ auth, panti, recentDonors = [] }: { auth: any, panti: any, recentDonors?: any[] }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, setData, post, processing, errors } = useForm({
    id_shelter: panti?.id || 1,
    nominal: '',
    metode_pembayaran: '',
    pesan: '',
    is_anonim: false,
    developer_tip: false,
  });

  const presetNominals = [
    { value: 10000, label: 'Rp 10.000' },
    { value: 50000, label: 'Rp 50.000' },
    { value: 100000, label: 'Rp 100.000' },
    { value: 500000, label: 'Rp 500.000' },
  ];

  const paymentMethods = [
    { id: 'gopay', name: 'GoPay', icon: <Smartphone size={20} />, type: 'E-Wallet' },
    { id: 'qris', name: 'QRIS', icon: <Smartphone size={20} />, type: 'E-Wallet' },
    { id: 'bca', name: 'BCA Virtual Account', icon: <Building2 size={20} />, type: 'Bank Transfer' },
    { id: 'mandiri', name: 'Mandiri Virtual Account', icon: <Building2 size={20} />, type: 'Bank Transfer' },
  ];

  const nominalValue = parseInt(data.nominal) || 0;
  const tipValue = data.developer_tip ? 2000 : 0;
  const totalPembayaran = nominalValue + tipValue;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPaymentDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNominalClick = (value: number) => {
    setData('nominal', value.toString());
  };

  const handlePaymentSelect = (id: string) => {
    setData('metode_pembayaran', id);
    setIsPaymentDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('donasi.store'));
  };

  const selectedPayment = paymentMethods.find(m => m.id === data.metode_pembayaran);

  return (
    <div className="flex h-screen font-sans bg-white text-[#124354] overflow-hidden">
      <Head title={`Donasi - ${panti?.nama_yayasan || 'Panti'}`} />

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-50 h-full transform transition-transform duration-300 ease-in-out w-64 lg:w-64 lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <DonaturSidebar
          activeTab="cari"
          onTabChange={() => {}} 
          donaturData={auth?.user}
          stats={{ totalDonasi: 0, pantiTerbantu: 0 }}
        />
      </div>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#F4F3EF]">
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-[#083A4F] z-30">
          <div className="flex items-center gap-3 text-white">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors focus:outline-none"
            >
              <Menu size={20} />
            </button>
            <span className="font-extrabold tracking-wide uppercase text-sm">Donasi Uang</span>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block">
          <DonaturHeader activeTab="cari" donaturData={auth?.user} />
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          
          {/* MAX WIDTH DIBESARKAN UNTUK 2 KOLOM */}
          <div className="max-w-6xl mx-auto">
            
            {/* KEMBALI & HEADER INFO (Full Width) */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6">
              <div className="flex items-center gap-4">
                <Link 
                  href={`/donatur/panti/${panti?.id}`} 
                  className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none"
                  style={{ color: COLORS.navy }}
                >
                  <ArrowLeft size={20} />
                </Link>
                <div>
                  <h2 className="font-bold text-lg leading-tight" style={{ color: COLORS.navy }}>Formulir Donasi Tunai</h2>
                  <p className="text-xs text-gray-500">Isi detail donasi Anda dengan aman dan transparan</p>
                </div>
              </div>
            </div>

            {/* GRID LAYOUT: KIRI FORM, KANAN INFO */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              
              {/* KOLOM KIRI (FORM) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* INFO PANTI */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm" style={{ backgroundColor: COLORS.navy }}>
                    <Heart size={24} className="fill-current" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: COLORS.teal }}>Tujuan Donasi</p>
                    <h3 className="font-black text-lg flex items-center gap-1.5" style={{ color: COLORS.navy }}>
                      {panti?.nama_yayasan || 'Yayasan Kasih Ibu'}
                      <CheckCircle2 size={16} className="text-blue-500 fill-blue-50" />
                    </h3>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* NOMINAL */}
                  <section className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100">
                    <h4 className="font-bold mb-4 flex items-center gap-2" style={{ color: COLORS.navy }}>
                      <Wallet size={18} style={{ color: COLORS.teal }} /> Pilih Nominal Donasi
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {presetNominals.map((preset) => {
                        const isSelected = data.nominal === preset.value.toString();
                        return (
                          <button
                            key={preset.value}
                            type="button"
                            onClick={() => handleNominalClick(preset.value)}
                            className="py-3 rounded-xl font-bold text-sm border transition-all focus:outline-none"
                            style={{
                              borderColor: isSelected ? COLORS.teal : '#e5e7eb',
                              backgroundColor: isSelected ? '#F2F8F9' : '#ffffff',
                              color: isSelected ? COLORS.navy : '#6b7280'
                            }}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="relative mt-2">
                      <div 
                        className="flex items-center border rounded-xl overflow-hidden transition-all focus-within:ring-1 focus-within:border-transparent"
                        style={{
                          borderColor: '#e5e7eb',
                          backgroundColor: '#f9fafb',
                          boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)'
                        }}
                      >
                        <span className="pl-4 pr-2 font-bold text-gray-500">Rp</span>
                        <input
                          type="number"
                          placeholder="Nominal Lainnya (Min. 10.000)"
                          className="flex-1 py-3.5 pr-4 bg-transparent outline-none focus:ring-0 font-bold border-none"
                          style={{ color: COLORS.navy }}
                          value={data.nominal} // Langsung terhubung dengan data.nominal
                          onChange={(e) => setData('nominal', e.target.value)}
                        />
                      </div>
                      {errors.nominal && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.nominal}</p>}
                    </div>
                  </section>

                  {/* DROPDOWN METODE PEMBAYARAN */}
                  <section className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100">
                    <h4 className="font-bold mb-4 flex items-center gap-2" style={{ color: COLORS.navy }}>
                      <CreditCard size={18} style={{ color: COLORS.teal }} /> Metode Pembayaran
                    </h4>
                    
                    <div className="relative" ref={dropdownRef}>
                      <button
                        type="button"
                        onClick={() => setIsPaymentDropdownOpen(!isPaymentDropdownOpen)}
                        className="w-full flex items-center justify-between p-4 rounded-xl border transition-all focus:outline-none hover:bg-gray-50"
                        style={{
                          borderColor: isPaymentDropdownOpen ? COLORS.teal : '#e5e7eb',
                          backgroundColor: '#ffffff'
                        }}
                      >
                        {selectedPayment ? (
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-50" style={{ color: COLORS.teal }}>
                              {selectedPayment.icon}
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-sm leading-tight" style={{ color: COLORS.navy }}>{selectedPayment.name}</p>
                              <p className="text-xs font-medium mt-0.5" style={{ color: COLORS.teal, opacity: 0.8 }}>{selectedPayment.type}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="font-semibold text-gray-400 pl-2 text-sm">Pilih metode pembayaran...</span>
                        )}
                        <ChevronDown size={20} className={`transition-transform duration-200 ${isPaymentDropdownOpen ? 'rotate-180' : ''}`} style={{ color: COLORS.teal }} />
                      </button>

                      {isPaymentDropdownOpen && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-lg z-10 overflow-hidden">
                          {paymentMethods.map((method) => (
                            <button
                              key={method.id}
                              type="button"
                              onClick={() => handlePaymentSelect(method.id)}
                              className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0 focus:outline-none"
                              style={{ borderColor: '#f3f4f6' }}
                            >
                              <div className="p-2 rounded-lg bg-gray-100 text-gray-500">
                                {method.icon}
                              </div>
                              <div className="text-left">
                                <p className="font-bold text-sm" style={{ color: COLORS.navy }}>{method.name}</p>
                                <p className="text-xs font-medium" style={{ color: COLORS.teal, opacity: 0.8 }}>{method.type}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.metode_pembayaran && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.metode_pembayaran}</p>}
                  </section>

                  {/* PESAN & DUKUNGAN */}
                  <section className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100">
                     <h4 className="font-bold mb-4 flex items-center gap-2" style={{ color: COLORS.navy }}>
                      <MessageSquare size={18} style={{ color: COLORS.teal }} /> Pesan & Dukungan
                    </h4>

                    <div className="space-y-3 mb-5">
                      <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-all border-gray-200">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-gray-300 focus:ring-0"
                          style={{ color: COLORS.teal }}
                          checked={data.is_anonim}
                          onChange={(e) => setData('is_anonim', e.target.checked)}
                        />
                        <div>
                          <p className="font-bold text-sm" style={{ color: COLORS.navy }}>Donasi sebagai Anonim</p>
                          <p className="text-xs text-gray-500 mt-0.5">Nama Anda akan disembunyikan dari publik</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all border-gray-200" 
                        style={{ backgroundColor: data.developer_tip ? '#F2F8F9' : '#ffffff' }}>
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-gray-300 focus:ring-0"
                          style={{ color: COLORS.teal }}
                          checked={data.developer_tip}
                          onChange={(e) => setData('developer_tip', e.target.checked)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-sm flex items-center gap-2" style={{ color: COLORS.navy }}>
                              Dukung Platform KawanBerbagi
                            </p>
                            <span className="text-xs font-bold px-2 py-1 bg-white rounded-md border border-gray-100 shadow-sm" style={{ color: COLORS.teal }}>+ Rp 2.000</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">Bantu biaya operasional dan pengembangan sistem</p>
                        </div>
                      </label>
                    </div>

                    <div>
                      <textarea
                        placeholder="Tulis doa untuk panti asuhan (Opsional)"
                        rows={3}
                        className="w-full p-4 border rounded-xl text-sm resize-none focus:outline-none focus:ring-1 transition-colors border-gray-200"
                        style={{ color: COLORS.navy, backgroundColor: '#f9fafb' }}
                        value={data.pesan}
                        onChange={(e) => setData('pesan', e.target.value)}
                      />
                    </div>
                  </section>

                  {/* SUBMIT BUTTON (MOBILE ONLY - di Desktop muncul di kanan) */}
                  <div className="lg:hidden pt-2 pb-10">
                     <button
                        type="submit"
                        disabled={processing || nominalValue < 10000 || !data.metode_pembayaran}
                        className="w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: COLORS.navy }}
                      >
                        {processing ? 'Memproses...' : `Bayar ${formatRupiah(totalPembayaran)}`}
                        {!processing && <ShieldCheck size={20} />}
                      </button>
                  </div>
                </form>
              </div>

              {/* KOLOM KANAN (INFO & SUMMARY) */}
              <div className="space-y-6 hidden lg:block">
                
                {/* RINGKASAN & TOMBOL BAYAR (Sticky) */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <h4 className="font-bold text-sm uppercase tracking-wider mb-4 border-b pb-3" style={{ color: COLORS.teal }}>Ringkasan Donasi</h4>
                  
                  <div className="space-y-3 mb-5 text-sm text-gray-600">
                    <div className="flex justify-between items-center">
                      <span>Donasi Tunai</span>
                      <span className="font-semibold" style={{ color: COLORS.navy }}>{formatRupiah(nominalValue)}</span>
                    </div>
                    {data.developer_tip && (
                      <div className="flex justify-between items-center">
                        <span>Dukungan Platform</span>
                        <span className="font-semibold" style={{ color: COLORS.navy }}>{formatRupiah(2000)}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-3 mb-5 flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <span className="font-bold text-sm" style={{ color: COLORS.navy }}>Total</span>
                    <span className="font-black text-lg" style={{ color: COLORS.teal }}>{formatRupiah(totalPembayaran)}</span>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={processing || nominalValue < 10000 || !data.metode_pembayaran}
                    className="w-full text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                    style={{ backgroundColor: COLORS.navy }}
                  >
                    {processing ? 'Memproses...' : 'Lanjutkan Pembayaran'}
                  </button>
                  <p className="text-center text-xs mt-3 flex justify-center items-center gap-1 text-gray-400">
                    <ShieldCheck size={14} /> Keamanan transaksi terjamin
                  </p>
                </div>

                {/* CARD INFO PENGGUNAAN DANA */}
                <div className="bg-gradient-to-br from-[#083A4F] to-[#12546e] text-white rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Info size={18} className="text-[#C0D5D6]" />
                    <h4 className="font-bold text-sm">Transparansi Dana</h4>
                  </div>
                  <p className="text-xs text-blue-100 leading-relaxed mb-4">
                    Setiap rupiah yang Anda donasikan ke <span className="font-semibold text-white">{panti?.nama_yayasan || 'panti ini'}</span> akan digunakan untuk:
                  </p>
                  <ul className="text-xs space-y-2">
                    <li className="flex gap-2 items-start">
                      <Sparkles size={14} className="text-[#A58D66] shrink-0 mt-0.5" />
                      <span>Biaya pendidikan & sekolah anak asuh.</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <Sparkles size={14} className="text-[#A58D66] shrink-0 mt-0.5" />
                      <span>Pemenuhan kebutuhan gizi harian.</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <Sparkles size={14} className="text-[#A58D66] shrink-0 mt-0.5" />
                      <span>Operasional & perawatan fasilitas panti.</span>
                    </li>
                  </ul>
                </div>

                {/* CARD DONATUR TERBARU */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-4 border-b pb-3">
                    <Users size={18} style={{ color: COLORS.teal }} />
                    <h4 className="font-bold text-sm" style={{ color: COLORS.navy }}>Orang Baik Terkini</h4>
                  </div>
                  
                  <div className="space-y-4">
                    {recentDonors.length === 0 ? (
                      <p className="text-xs text-gray-400 italic text-center py-4">Belum ada donatur terbaru</p>
                    ) : (
                      recentDonors.map((donor) => (
                        <div key={donor.id} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-xs font-bold shrink-0" style={{ color: COLORS.teal }}>
                            {donor.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate" style={{ color: COLORS.navy }}>{donor.name}</p>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="font-semibold text-gray-600">
                                Berdonasi {typeof donor.amount === 'number' ? formatRupiah(donor.amount) : donor.amount}
                              </span>
                              <span className="text-gray-300">•</span>
                              <span className="text-gray-400">{donor.time}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
              
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}