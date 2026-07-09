import React from 'react';

export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-4xl font-extrabold text-[#124354] mb-2">320+</h3>
          <p className="text-[#124354] font-bold">Panti Terdaftar</p>
          <p className="text-xs text-gray-500 mt-1">Terverifikasi dalam sistem</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-4xl font-extrabold text-[#124354] mb-2">5.2K</h3>
          <p className="text-[#124354] font-bold">Donatur Aktif</p>
          <p className="text-xs text-gray-500 mt-1">Melakukan donasi bulan ini</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-4xl font-extrabold text-[#124354] mb-2">18K+</h3>
          <p className="text-[#124354] font-bold">Barang Tersalurkan</p>
          <p className="text-xs text-gray-500 mt-1">Total distribusi tercatat</p>
        </div>
      </div>

      <div className="bg-[#124354] rounded-3xl p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="bg-[#4A828F]/30 text-[#EAE8E3] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block mb-4 border border-[#4A828F]/40">
            ✨ Sistem Transparan & Terukur
          </span>
          <h2 className="text-3xl font-extrabold mb-3">Selamat Datang di Panel Admin KawanBerbagi.</h2>
          <p className="text-[#8BABB5] text-sm leading-relaxed">
            Gunakan navigasi di sebelah kiri atau parameter URL untuk mengelola data panti asuhan, memeriksa aktivitas donatur, dan memvalidasi kebutuhan barang secara *real-time*.
          </p>
        </div>
        {/* Dekorasi background */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#4A828F]/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>
    </div>
  );
}
