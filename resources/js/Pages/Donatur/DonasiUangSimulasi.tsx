import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
  ArrowLeft, CheckCircle2, ShieldCheck, 
  Smartphone, Building2, Copy, Check, Info, AlertTriangle
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

// Helper format Rupiah
const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(angka);
};

export default function DonasiUangSimulasi({ auth, donation, panti }: { auth: any, donation: any, panti: any }) {
  const [copied, setCopied] = useState(false);
  const [processing, setProcessing] = useState(false);

  const nominalValue = parseInt(donation.nominal) || 0;
  const tipValue = donation.developer_tip ? 2000 : 0;
  const totalPembayaran = nominalValue + tipValue;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePay = () => {
    setProcessing(true);
    router.post(`/donatur/donasi-uang/bayar/${donation.id_cash_donation}`, {}, {
      onFinish: () => setProcessing(false)
    });
  };

  const getPaymentDetails = () => {
    switch (donation.metode_pembayaran) {
      case 'gopay':
        return {
          title: 'Pembayaran Via GoPay',
          icon: <Smartphone size={24} className="text-[#407E8C]" />,
          instruction: 'Pindai kode QR di bawah ini menggunakan aplikasi GoPay Anda.',
          showQr: true,
          value: '000102120206930219'
        };
      case 'qris':
        return {
          title: 'Pembayaran Via QRIS',
          icon: <Smartphone size={24} className="text-[#407E8C]" />,
          instruction: 'Pindai kode QRIS di bawah ini dengan aplikasi e-wallet pilihan Anda (OVO, Dana, LinkAja, BCA, dll).',
          showQr: true,
          value: '000102120206930219'
        };
      case 'bca':
        return {
          title: 'Transfer BCA Virtual Account',
          icon: <Building2 size={24} className="text-[#407E8C]" />,
          instruction: 'Silakan transfer ke nomor virtual account di bawah ini melalui ATM, KlikBCA, atau m-BCA.',
          showQr: false,
          value: '80012026' + String(donation.id_cash_donation).padStart(4, '0')
        };
      case 'mandiri':
        return {
          title: 'Transfer Mandiri Virtual Account',
          icon: <Building2 size={24} className="text-[#407E8C]" />,
          instruction: 'Silakan transfer ke nomor virtual account di bawah ini melalui Livin by Mandiri atau ATM Mandiri.',
          showQr: false,
          value: '89022026' + String(donation.id_cash_donation).padStart(4, '0')
        };
      default:
        return {
          title: 'Metode Pembayaran',
          icon: <Building2 size={24} className="text-[#407E8C]" />,
          instruction: 'Lakukan pembayaran sesuai petunjuk.',
          showQr: false,
          value: '1234567890'
        };
    }
  };

  const details = getPaymentDetails();

  return (
    <div className="flex h-screen font-sans bg-white text-[#124354] overflow-hidden">
      <Head title="Simulasi Pembayaran Donasi" />

      <div className="hidden lg:block w-64 h-full shrink-0">
        <DonaturSidebar
          activeTab="cari"
          onTabChange={() => {}} 
          donaturData={auth?.user}
          stats={{ totalDonasi: 0, pantiTerbantu: 0 }}
        />
      </div>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#F4F3EF]">
        <div className="hidden lg:block">
          <DonaturHeader activeTab="cari" donaturData={auth?.user} />
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Header info */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
              <Link 
                href="/donatur/dashboard?tab=donasi" 
                className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none"
                style={{ color: COLORS.navy }}
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h2 className="font-bold text-lg leading-tight" style={{ color: COLORS.navy }}>Simulasi Instan Pembayaran</h2>
                <p className="text-xs text-gray-500">Selesaikan transaksi donasi tunai Anda di halaman simulasi ini</p>
              </div>
            </div>

            {/* Main content card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
              
              {/* Payment Type Header */}
              <div className="flex items-center gap-3 border-b pb-4">
                <div className="p-2.5 rounded-xl bg-blue-50/80 text-[#407E8C]">
                  {details.icon}
                </div>
                <div>
                  <h3 className="font-bold text-base" style={{ color: COLORS.navy }}>{details.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Metode Pembayaran Resmi KawanBerbagi</p>
                </div>
              </div>

              {/* Total Billing */}
              <div className="bg-[#F2F8F9] rounded-xl p-4 flex justify-between items-center border border-[#C0D5D6]/30">
                <div>
                  <p className="text-xs font-semibold text-gray-500">TOTAL TAGIHAN</p>
                  <p className="font-black text-2xl mt-1" style={{ color: COLORS.teal }}>{formatRupiah(totalPembayaran)}</p>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p>Donasi: {formatRupiah(nominalValue)}</p>
                  {donation.developer_tip && <p>Tip: Rp 2.000</p>}
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-4">
                <p className="text-sm font-medium text-gray-600 leading-relaxed">
                  {details.instruction}
                </p>

                {details.showQr ? (
                  /* QR Code Dummy UI */
                  <div className="flex flex-col items-center justify-center p-6 border border-gray-100 rounded-2xl bg-gray-50/50 w-72 mx-auto">
                    {/* QR Code Placeholder with premium styling */}
                    <div className="w-48 h-48 bg-white border-4 border-white rounded-xl shadow-md p-2 flex flex-col justify-between items-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-gray-900/5 to-transparent pointer-events-none" />
                      {/* Grid QR Simulation pattern */}
                      <div className="w-full h-full flex flex-wrap gap-1 content-between justify-between">
                        {Array.from({ length: 9 }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-12 h-12 border-4 border-black shrink-0 ${
                              i === 0 || i === 2 || i === 6 ? 'bg-black' : 'bg-transparent border-dashed border-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      {/* Brand indicator */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white border-2 border-[#083A4F] rounded-lg shadow flex items-center justify-center">
                        <span className="font-black text-[10px] text-[#083A4F]">KB</span>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-4">Kode QR Sementara KawanBerbagi</span>
                  </div>
                ) : (
                  /* Virtual Account Number UI */
                  <div className="p-4 border rounded-xl border-gray-100 flex items-center justify-between bg-gray-50">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nomor Virtual Account</p>
                      <p className="font-black text-xl tracking-wider mt-1 text-gray-700">{details.value}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(details.value)}
                      className="p-2.5 rounded-lg border bg-white hover:bg-gray-50 text-gray-500 transition-colors flex items-center gap-1.5 text-xs font-bold shadow-xs focus:outline-none"
                    >
                      {copied ? (
                        <>
                          <Check size={14} className="text-emerald-500" />
                          <span className="text-emerald-600">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Warning/Alert box */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200/50 flex gap-3 text-xs text-amber-800">
                <AlertTriangle size={18} className="shrink-0 text-amber-500" />
                <div>
                  <p className="font-bold">Mode Simulasi Pembayaran</p>
                  <p className="mt-0.5 opacity-90 leading-relaxed">
                    Halaman ini merupakan simulasi transaksi. Cukup tekan tombol **"Bayar Sekarang"** di bawah untuk memproses dan menandai donasi Anda sebagai sukses.
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <button
                  onClick={handlePay}
                  disabled={processing}
                  className="flex-1 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                  style={{ backgroundColor: COLORS.navy }}
                >
                  {processing ? 'Memproses...' : 'Bayar Sekarang (Simulasi)'}
                  {!processing && <ShieldCheck size={20} />}
                </button>
                <Link
                  href="/donatur/dashboard"
                  className="px-6 py-3.5 border rounded-xl font-bold text-gray-500 hover:bg-gray-50 text-center transition-colors focus:outline-none text-sm"
                  style={{ borderColor: '#e5e7eb' }}
                >
                  Batalkan & Kembali
                </Link>
              </div>

            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
