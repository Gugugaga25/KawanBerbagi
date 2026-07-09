import React from 'react';
import { Filter, Download, Mail, Award, ArrowUpRight } from 'lucide-react';

const DATA_DONATUR = [
  { id: 1, nama: "Rizky Ramadhan", email: "rizky.r@email.com", total: "Rp 4.500.000", frekuensi: 12, tier: "Gold", terakhir: "08 Jul 2026" },
  { id: 2, nama: "Dewi Sartika", email: "dewi.s@email.com", total: "Rp 750.000", frekuensi: 3, tier: "Silver", terakhir: "05 Jul 2026" },
  { id: 3, nama: "Bambang Pamungkas", email: "bepe20@email.com", total: "Rp 15.000.000", frekuensi: 45, tier: "Platinum", terakhir: "09 Jul 2026" },
  { id: 4, nama: "Anisa Rahma", email: "anisa.r@email.com", total: "Rp 300.000", frekuensi: 1, tier: "Bronze", terakhir: "01 Jul 2026" },
];

export default function DonaturManagement() {
  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h3 className="text-2xl font-bold text-[#124354]">Data Donatur</h3>
          <p className="text-sm text-gray-500 mt-1">Pantau aktivitas dan riwayat kontribusi dari para donatur.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#F4F3EF] text-[#124354] rounded-xl text-sm font-medium hover:bg-[#EAE8E3] transition-colors">
            <Filter size={16} /> Filter Tier
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#124354] text-white rounded-xl text-sm font-medium hover:bg-[#0E3544] transition-colors shadow-sm">
            <Download size={16} /> Ekspor Data
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F4F3EF] text-[#5A7C85] text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">Donatur</th>
                <th className="px-6 py-4 font-bold">Tier</th>
                <th className="px-6 py-4 font-bold">Total Donasi</th>
                <th className="px-6 py-4 font-bold">Frekuensi</th>
                <th className="px-6 py-4 font-bold">Donasi Terakhir</th>
                <th className="px-6 py-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[#124354] text-sm">
              {DATA_DONATUR.map((don) => (
                <tr key={don.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#124354] text-white flex items-center justify-center font-bold text-xs shadow-inner">
                        {don.nama.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold">{don.nama}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Mail size={10} /> {don.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-[#EAE8E3] text-[#124354]">
                      <Award size={12} className="text-[#4A828F]" /> {don.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-extrabold text-[#124354]">{don.total}</td>
                  <td className="px-6 py-4 font-medium">{don.frekuensi} kali</td>
                  <td className="px-6 py-4 text-gray-500 text-xs font-medium">{don.terakhir}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex items-center gap-1 text-xs font-bold text-[#4A828F] hover:text-[#124354] hover:underline">
                      Detail <ArrowUpRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}