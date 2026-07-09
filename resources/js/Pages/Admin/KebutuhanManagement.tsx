import React from 'react';
import { Plus, Filter, Package, AlertCircle, CheckCircle2 } from 'lucide-react';

const DATA_KEBUTUHAN = [
  { id: 1, barang: "Beras 50Kg", panti: "Yayasan Kasih Ibu", terkumpul: 36, target: 50, satuan: "kg", mendesak: false, status: "Berjalan" },
  { id: 2, barang: "Susu Bayi (kaleng)", panti: "Panti Nurul Iman", terkumpul: 18, target: 20, satuan: "kaleng", mendesak: true, status: "Berjalan" },
  { id: 3, barang: "Buku Pelajaran SD", panti: "Rumah Yatim Cahaya", terkumpul: 120, target: 120, satuan: "eksemplar", mendesak: false, status: "Terpenuhi" },
  { id: 4, barang: "Selimut & Pakaian", panti: "Panti Wreda Bahagia", terkumpul: 9, target: 30, satuan: "pcs", mendesak: true, status: "Berjalan" },
  { id: 5, barang: "Minyak Goreng 2L", panti: "Yayasan Kasih Ibu", terkumpul: 15, target: 40, satuan: "pouch", mendesak: false, status: "Berjalan" },
];

export default function KebutuhanManagement() {
  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h3 className="text-2xl font-bold text-[#124354]">Manajemen Kebutuhan</h3>
          <p className="text-sm text-gray-500 mt-1">Verifikasi dan pantau progres pengumpulan barang kebutuhan panti.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#F4F3EF] text-[#124354] rounded-xl text-sm font-medium hover:bg-[#EAE8E3] transition-colors">
            <Filter size={16} /> Filter Kategori
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#124354] text-white rounded-xl text-sm font-medium hover:bg-[#0E3544] transition-colors shadow-sm">
            <Plus size={16} /> Tambah Kebutuhan
          </button>
        </div>
      </div>

      {/* Grid Kebutuhan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DATA_KEBUTUHAN.map((item) => {
          const persentase = Math.min(Math.round((item.terkumpul / item.target) * 100), 100);
          const isSelesai = item.status === "Terpenuhi";

          return (
            <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden">
              {/* Top Bar Status */}
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#F4F3EF] text-[#124354] flex items-center justify-center">
                  <Package size={20} />
                </div>
                <div className="flex gap-1.5">
                  {item.mendesak && !isSelesai && (
                    <span className="bg-red-50 text-red-600 border border-red-100 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <AlertCircle size={12} /> Mendesak
                    </span>
                  )}
                  {isSelesai && (
                    <span className="bg-green-50 text-green-700 border border-green-200 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={12} /> Terpenuhi
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-[#124354] mb-1">{item.barang}</h4>
                <p className="text-xs text-gray-500 font-medium">{item.panti}</p>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-xs font-bold text-[#124354] mb-2">
                  <span>Progres ({persentase}%)</span>
                  <span>{item.terkumpul} / {item.target} {item.satuan}</span>
                </div>
                <div className="w-full bg-[#F4F3EF] rounded-full h-2.5 mb-6 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${isSelesai ? 'bg-green-600' : 'bg-[#124354]'}`}
                    style={{ width: `${persentase}%` }}
                  ></div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-[#F4F3EF] hover:bg-[#EAE8E3] text-[#124354] py-2 rounded-xl text-xs font-bold transition-colors">
                    Edit
                  </button>
                  <button className="flex-1 bg-[#124354] hover:bg-[#0E3544] text-white py-2 rounded-xl text-xs font-bold transition-colors">
                    Distribusi
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}