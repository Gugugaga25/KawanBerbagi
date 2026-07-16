import React, { useState, useRef } from 'react';
import { Search, Filter, Download, X, Package, Wallet, UploadCloud, ImageIcon, CheckCircle2 } from 'lucide-react';
import { useForm } from '@inertiajs/react';

const COLORS = {
  navy: "#083A4F",
  gold: "#A58D66",
  mist: "#C0D5D6",
  teal: "#407E8C",
  cream: "#E5E1DD",
};

export default function DonasiMasuk({ donations = [] }: { donations?: any[] }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('Semua');
  const [selectedTx, setSelectedTx] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // useForm Hook
  const { data, setData, post, processing, errors, reset } = useForm({
    bukti_penerimaan: null as File | null,
    ucapan_terimakasih: '',
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Diterima': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Dikirim': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Akan Dijemput': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Menunggu Konfirmasi Jemput': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Diproses': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'Batal': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  // Logika Pencarian dan Filter
  const filteredData = donations.filter((row) => {
    const matchSearch = row.name.toLowerCase().includes(search.toLowerCase()) || row.id.toLowerCase().includes(search.toLowerCase());
    let matchType = true;
    if (typeFilter === 'Dana') matchType = row.type === 'Dana';
    if (typeFilter === 'Barang') matchType = row.type === 'Barang';
    return matchSearch && matchType;
  });

  const handleBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setData('bukti_penerimaan', e.target.files[0]);
    }
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.bukti_penerimaan) {
      alert("Silakan unggah foto bukti penerimaan terlebih dahulu!");
      return;
    }

    post(route('panti.donasi.konfirmasi', selectedTx.id_raw), {
      onSuccess: () => {
        setSelectedTx(null);
        reset();
      }
    });
  };

  return (
    <div className="space-y-6 pb-20 text-sm relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <h1 className="text-3xl font-extrabold text-[#124354] tracking-tight">Donasi Masuk</h1>
          <p className="text-gray-500 mt-1">Riwayat lengkap penerimaan donasi dana maupun barang.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-gray-200 text-[#124354] text-sm font-semibold hover:bg-gray-50 transition-all shrink-0 shadow-sm">
          <Download size={16} /> Unduh Laporan
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-2.5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:max-w-md flex items-center px-3 bg-gray-50 rounded-xl">
          <Search className="text-gray-400 shrink-0" size={16} />
          <input 
            type="text" 
            placeholder="Cari nama donatur atau ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2.5 pl-3 text-sm bg-transparent border-0 focus:ring-0 outline-none text-[#124354] placeholder-gray-400"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar w-full sm:w-auto">
          <button 
            onClick={() => setTypeFilter('Semua')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${typeFilter === 'Semua' ? 'bg-[#083A4F] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Semua
          </button>
          <button 
            onClick={() => setTypeFilter('Dana')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${typeFilter === 'Dana' ? 'bg-[#083A4F] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Dana
          </button>
          <button 
            onClick={() => setTypeFilter('Barang')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${typeFilter === 'Barang' ? 'bg-[#083A4F] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Barang
          </button>
          <div className="w-px h-6 bg-gray-200 mx-1 shrink-0" />
          <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors shrink-0"><Filter size={18} /></button>
        </div>
      </div>

      {/* Table Data */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-white uppercase tracking-wider" style={{background: COLORS.navy}}>
                <th className="px-6 py-4 font-bold">Tanggal</th>
                <th className="px-6 py-4 font-bold">Donatur</th>
                <th className="px-6 py-4 font-bold">Jenis</th>
                <th className="px-6 py-4 font-bold">Nominal / Barang</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Bukti Terima</th>
                <th className="px-6 py-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-[#124354]">
              {filteredData.length > 0 ? (
                filteredData.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500">{row.date}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold">{row.name}</p>
                      <p className="text-xs text-gray-400">{row.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
                        {row.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-sm">{row.val}</td>
                    <td className="px-6 py-4">
                      <span className={`border text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${getStatusBadge(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {row.bukti ? (
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200">
                          <img src={row.bukti} alt="Bukti" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Belum ada</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {(row.status === 'Dikirim' || row.status === 'Menunggu Konfirmasi Jemput' || row.status === 'Akan Dijemput') ? (
                        <button 
                          onClick={() => { reset(); setSelectedTx(row); }}
                          className="relative inline-flex items-center justify-center px-4 py-2 bg-[#407E8C] text-white hover:bg-[#083A4F] rounded-xl text-xs font-bold transition-all shadow-sm"
                        >
                          Tinjau
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
                          </span>
                        </button>
                      ) : (
                        <button 
                          onClick={() => { reset(); setSelectedTx(row); }}
                          className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-200 text-[#124354] hover:bg-gray-50 rounded-xl text-xs font-bold transition-all shadow-sm"
                        >
                          Detail
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 font-medium">
                    Tidak ada data donasi masuk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL DETAIL & KONFIRMASI ================= */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#083A4F]/60 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-[2rem] p-6 md:p-8 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto hide-scrollbar">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-[#124354]">Detail Donasi</h3>
              <button onClick={() => setSelectedTx(null)} className="p-2 text-gray-400 hover:text-[#124354] hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Info Header */}
              <div className="flex items-center justify-between p-4 bg-[#F4F3EF] rounded-2xl border border-gray-200/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#407E8C] shadow-sm">
                    {selectedTx.type === 'Dana' ? <Wallet size={24} /> : <Package size={24} />}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold mb-0.5 uppercase tracking-wider">Donasi {selectedTx.type}</p>
                    <p className="text-xl font-black text-[#124354] leading-none">{selectedTx.val}</p>
                  </div>
                </div>
                <span className={`border text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg ${getStatusBadge(selectedTx.status)}`}>
                  {selectedTx.status}
                </span>
              </div>

              {/* Rincian Logistik & ID */}
              <div className="grid grid-cols-2 gap-4 px-1">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">ID Transaksi</p>
                  <p className="text-sm font-bold text-[#124354]">{selectedTx.id}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Donatur</p>
                  <p className="text-sm font-bold text-[#124354]">{selectedTx.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Layanan Logistik</p>
                  <p className="text-sm font-bold text-[#124354]">{selectedTx.detail.kurir}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nomor Resi</p>
                  <p className="text-sm font-bold text-[#407E8C]">{selectedTx.detail.resi}</p>
                </div>
                <div className="col-span-2 mt-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pesan Donatur</p>
                  <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100 italic">"{selectedTx.detail.msg}"</p>
                </div>
              </div>

              {/* Area Bukti Terima & Aksi */}
              <div className="pt-4 border-t border-gray-100">
                
                {/* 1. Kondisi Jika Status "Dikirim" atau "Akan Dijemput" (Butuh Konfirmasi Penerimaan) */}
                {(selectedTx.status === 'Dikirim' || selectedTx.status === 'Akan Dijemput') && (
                  <form onSubmit={handleConfirmSubmit} className="space-y-4">
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-4">
                      <p className="text-xs text-amber-800 font-medium leading-normal">
                        {selectedTx.status === 'Akan Dijemput' 
                          ? 'Barang akan dijemput panti. Mohon unggah foto barang setelah tiba di panti sebagai bukti penerimaan.' 
                          : 'Barang sedang dalam pengiriman. Mohon unggah foto barang saat tiba sebagai bukti penerimaan.'}
                      </p>
                    </div>
                    
                    {/* Kotak Upload Foto */}
                    {data.bukti_penerimaan ? (
                      <div className="border border-emerald-100 bg-emerald-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                        <CheckCircle2 className="text-emerald-500 mb-2" size={32} />
                        <p className="text-sm font-bold text-[#124354]">{data.bukti_penerimaan.name}</p>
                        <button 
                          type="button" 
                          onClick={() => setData('bukti_penerimaan', null)} 
                          className="text-xs text-red-500 mt-2 hover:underline font-bold"
                        >
                          Ganti File Foto
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={handleBoxClick}
                        className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group"
                      >
                        <div className="w-12 h-12 bg-[#F4F3EF] text-[#407E8C] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <UploadCloud size={24} />
                        </div>
                        <p className="text-sm font-bold text-[#124354]">Pilih atau tarik foto ke sini</p>
                        <p className="text-xs text-gray-500 mt-1">Maksimal ukuran file 5MB (JPG/PNG)</p>
                      </div>
                    )}
                    
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept="image/*"
                      className="hidden" 
                    />
                    {errors.bukti_penerimaan && <p className="text-red-500 text-xs mt-1">{errors.bukti_penerimaan}</p>}

                    <div>
                      <label className="block text-xs font-bold text-[#124354] uppercase tracking-wider mb-1.5 ml-1">
                        Pesan Ucapan Terima Kasih (Opsional)
                      </label>
                      <textarea 
                        value={data.ucapan_terimakasih}
                        onChange={e => setData('ucapan_terimakasih', e.target.value)}
                        className="w-full p-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#124354] focus:bg-white transition-colors text-[#124354] font-medium resize-none h-20" 
                        placeholder="Tulis pesan ucapan terima kasih kepada donatur..."
                      />
                      {errors.ucapan_terimakasih && <p className="text-red-500 text-xs mt-1">{errors.ucapan_terimakasih}</p>}
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={() => setSelectedTx(null)} className="px-6 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all">
                        Kembali
                      </button>
                      <button 
                        type="submit"
                        disabled={processing}
                        className="flex-1 py-3 bg-[#407E8C] text-white font-bold rounded-xl hover:bg-[#083A4F] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                      >
                        <CheckCircle2 size={18} /> {processing ? 'Memproses...' : 'Konfirmasi Terima Barang'}
                      </button>
                    </div>
                  </form>
                )}

                {/* 1b. Kondisi Jika Status "Menunggu Konfirmasi Jemput" (Butuh Konfirmasi Jemput) */}
                {selectedTx.status === 'Menunggu Konfirmasi Jemput' && (
                  <div className="space-y-4">
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                      <p className="text-xs text-amber-800 font-semibold leading-relaxed">
                        Donatur meminta barang donasi ini untuk dijemput oleh pihak panti. Silakan konfirmasi penjemputan di bawah ini. Anda memiliki waktu 24 jam sejak donasi dibuat agar tidak batal otomatis.
                      </p>
                    </div>
                    
                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={() => setSelectedTx(null)} className="px-6 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all">
                        Kembali
                      </button>
                      <button
                        type="button"
                        disabled={processing}
                        onClick={() => {
                          post(route('panti.donasi.konfirmasi_jemput', selectedTx.id_raw), {
                            onSuccess: () => {
                              setSelectedTx(null);
                            }
                          });
                        }}
                        className="flex-1 py-3 bg-[#083A4F] text-white font-bold rounded-xl hover:bg-[#124354] transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                      >
                        Konfirmasi Penjemputan
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. Kondisi Jika Status "Diterima" atau "Sukses" (Lihat Bukti) */}
                {(selectedTx.status === 'Diterima' || selectedTx.status === 'Sukses') && (
                  <div className="space-y-4">
                    {selectedTx.status !== 'Sukses' && (
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Foto Bukti Penerimaan</p>
                        {selectedTx.bukti ? (
                          <div className="w-full h-40 rounded-xl overflow-hidden border border-gray-200">
                            <img src={selectedTx.bukti} alt="Bukti Penerimaan" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-full h-24 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 gap-2">
                            <ImageIcon size={20} /> <span className="text-sm font-medium">Tidak ada foto</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {selectedTx.detail && selectedTx.detail.thanks_msg && (
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Ucapan Terima Kasih Anda</p>
                        <p className="text-xs text-emerald-800 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100/50 italic leading-relaxed">
                          "{selectedTx.detail.thanks_msg}"
                        </p>
                      </div>
                    )}
                    
                    <button onClick={() => setSelectedTx(null)} className="w-full py-3 bg-[#124354] text-white font-bold rounded-xl transition-all hover:bg-[#083A4F]">
                      Tutup
                    </button>
                  </div>
                )}

                {/* 3. Kondisi Jika Status "Diproses" atau "Pending" */}
                {(selectedTx.status === 'Diproses' || selectedTx.status === 'Pending') && (
                  <button onClick={() => setSelectedTx(null)} className="w-full py-3 bg-[#124354] text-white font-bold rounded-xl transition-all hover:bg-[#083A4F]">
                    Tutup
                  </button>
                )}

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}