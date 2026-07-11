import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  Package,
  MoreVertical,
  X
} from 'lucide-react';

// ====== Data Dummy Awal ======
const INITIAL_DATA = [
  { id: 1, title: "Beras Putih Premium", category: "Pangan", target: 50, current: 36, unit: "kg", status: "aktif", daysLeft: 5 },
  { id: 2, title: "Susu Formula Bayi (6-12 bln)", category: "Balita", target: 20, current: 18, unit: "kaleng", status: "aktif", daysLeft: 2 },
  { id: 3, title: "Selimut & Pakaian Hangat", category: "Sandang", target: 30, current: 9, unit: "pcs", status: "aktif", daysLeft: 14 },
  { id: 4, title: "Minyak Goreng & Bumbu Dapur", category: "Pangan", target: 20, current: 5, unit: "liter", status: "aktif", daysLeft: 21 },
  { id: 5, title: "Buku Tulis & Alat Sekolah", category: "Pendidikan", target: 100, current: 100, unit: "paket", status: "selesai", daysLeft: 0 },
];

export default function PantiKebutuhan() {
  // State Utama
  const [dataKebutuhan, setDataKebutuhan] = useState(INITIAL_DATA);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Semua');
  
  // State Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Pangan',
    target: '',
    unit: 'kg',
    daysLeft: ''
  });

  // Logika Pencarian dan Filter
  const filteredData = dataKebutuhan.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    let matchFilter = true;
    
    if (filter === 'Aktif') matchFilter = item.status === 'aktif';
    if (filter === 'Mendesak') matchFilter = item.status === 'aktif' && item.daysLeft <= 3;
    if (filter === 'Terpenuhi') matchFilter = item.status === 'selesai';

    return matchSearch && matchFilter;
  });

  // Handler Submit Form Baru
  const handleSumbitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.target || !formData.daysLeft) return;

    const newItem = {
      id: Date.now(),
      title: formData.title,
      category: formData.category,
      target: Number(formData.target),
      current: 0, // Awal mula current 0
      unit: formData.unit,
      status: "aktif",
      daysLeft: Number(formData.daysLeft)
    };

    setDataKebutuhan([newItem, ...dataKebutuhan]);
    setIsModalOpen(false);
    
    // Reset Form
    setFormData({ title: '', category: 'Pangan', target: '', unit: 'kg', daysLeft: '' });
  };

  // Kalkulasi Angka Statistik secara Dinamis
  const statAktif = dataKebutuhan.filter(d => d.status === 'aktif').length;
  const statTerpenuhi = dataKebutuhan.filter(d => d.status === 'selesai').length;
  const statMendesak = dataKebutuhan.filter(d => d.status === 'aktif' && d.daysLeft <= 3).length;

  return (
    <div className="space-y-8 pb-20 text-sm relative">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <h1 className="text-3xl font-extrabold text-[#124354] tracking-tight">Kebutuhan Panti</h1>
          <p className="text-gray-500 mt-1">Pantau dan kelola daftar logistik yang sedang dibutuhkan saat ini.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#124354] text-white text-sm font-semibold hover:bg-[#0E3544] hover:shadow-lg hover:shadow-[#124354]/20 transition-all shrink-0"
        >
          <Plus size={18} /> Buat Baru
        </button>
      </div>

      {/* ================= QUICK STATS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {[
          { label: 'Aktif Dicari', value: statAktif, icon: TrendingUp },
          { label: 'Terpenuhi', value: statTerpenuhi, icon: CheckCircle2 },
          { label: 'Segera Habis', value: statMendesak, icon: Clock },
          { label: 'Partisipan', value: '128', icon: Package }, // Angka dummy untuk partisipan
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 md:px-5 md:py-4 border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-gray-200 transition-colors">
            {/* BACKGROUND ICON DIUBAH MENJADI NAVY PERMANEN */}
            <div className="w-12 h-12 rounded-xl bg-[#124354] flex items-center justify-center text-white shrink-0 shadow-sm">
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-[#124354] leading-none">{stat.value}</p>
              <p className="text-xs font-medium text-gray-400 mt-1.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ================= FILTER & SEARCH ================= */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-white p-2.5 rounded-2xl border border-gray-100 shadow-sm">
        
        <div className="relative w-full lg:max-w-md flex items-center px-3 bg-gray-50 rounded-xl border border-transparent focus-within:bg-white focus-within:border-gray-200 transition-colors">
          <Search className="text-gray-400 shrink-0" size={16} />
          <input 
            type="text" 
            placeholder="Ketik nama barang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2.5 pl-3 text-sm bg-transparent outline-none border-0 focus:ring-0 focus:outline-none text-[#124354] placeholder-gray-400"
          />
        </div>
        
        <div className="flex items-center w-full lg:w-auto overflow-x-auto hide-scrollbar gap-1">
          {['Semua', 'Aktif', 'Mendesak', 'Terpenuhi'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                filter === tab 
                  ? 'bg-[#124354] text-white shadow-md shadow-[#124354]/10' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
          <div className="w-px h-6 bg-gray-200 mx-2 hidden sm:block" />
          <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors shrink-0 tooltip" title="Filter Tambahan">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* ================= GRID KEBUTUHAN ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {filteredData.length > 0 ? (
          filteredData.map((item) => {
            const percent = Math.min(Math.round((item.current / item.target) * 100), 100);
            const isDone = item.status === 'selesai';

            return (
              <div 
                key={item.id} 
                className="flex flex-col bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                {/* Header: Kategori & Opsi */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {item.category}
                  </span>
                  <button className="text-gray-300 hover:text-[#124354] transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </div>

                {/* Judul Barang */}
                <h3 className="text-lg font-bold text-[#124354] mb-8 leading-snug line-clamp-2">
                  {item.title}
                </h3>

                {/* Angka & Progress Bar */}
                <div className="mt-auto">
                  <div className="flex justify-between items-baseline mb-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-[#124354]">{item.current}</span>
                      <span className="text-sm font-medium text-gray-400">/ {item.target} {item.unit}</span>
                    </div>
                    <span className="text-sm font-bold text-[#124354]">{percent}%</span>
                  </div>
                  
                  {/* Progress Bar (Hijau kalau selesai, Navy kalau belum) */}
                  <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        isDone ? 'bg-[#10B981]' : 'bg-[#124354]' 
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  {/* Footer Informasi & Aksi */}
                  <div className="flex items-center justify-between pt-5 mt-5 border-t border-dashed border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                      {isDone ? (
                        <CheckCircle2 size={15} className="text-[#10B981]" /> 
                      ) : (
                        <Clock size={15} className={item.daysLeft <= 3 ? "text-red-500" : ""} />
                      )}
                      <span className={item.daysLeft <= 3 && !isDone ? "text-red-500 font-bold" : ""}>
                        {isDone ? 'Terpenuhi' : `Sisa ${item.daysLeft} hari`}
                      </span>
                    </div>
                    
                    <button className="text-xs font-bold text-[#124354] hover:text-[#0E3544] underline decoration-transparent hover:decoration-[#124354] underline-offset-4 transition-all">
                      {isDone ? 'Lihat Riwayat' : 'Edit Kebutuhan'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center bg-gray-50 rounded-[1.5rem] border border-dashed border-gray-200">
            <Search className="text-gray-300 mb-3" size={32} />
            <p className="text-gray-500 font-medium">Tidak ada kebutuhan yang sesuai pencarian atau filter.</p>
          </div>
        )}

        {/* Card Buat Baru (Hanya muncul jika filter bukan "Terpenuhi") */}
        {filter !== 'Terpenuhi' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col items-center justify-center gap-3 bg-transparent rounded-[1.5rem] p-6 border-2 border-dashed border-gray-200 min-h-[250px] hover:border-[#124354] hover:bg-[#124354]/5 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-[#124354] group-hover:scale-110 transition-all shadow-sm">
              <Plus size={20} />
            </div>
            <span className="text-sm font-bold text-[#124354] mt-2">Tambah Kebutuhan</span>
            <span className="text-xs text-gray-400 text-center max-w-[180px]">
              Masukan item baru yang sedang diperlukan oleh panti.
            </span>
          </button>
        )}

      </div>

      {/* ================= MODAL FORM TAMBAH KEBUTUHAN ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#083A4F]/60 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-[2rem] p-6 md:p-8 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-[#124354]">Buat Kebutuhan Baru</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 text-gray-400 hover:text-[#124354] hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSumbitNew} className="space-y-4">
              
              {/* Nama Barang */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nama Barang</label>
                <input 
                  type="text" required
                  placeholder="Cth: Beras Premium, Susu Formula..."
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#124354] focus:outline-none focus:ring-2 focus:ring-[#407E8C]/30 focus:border-[#407E8C] transition-all"
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Kategori</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#124354] focus:outline-none focus:ring-2 focus:ring-[#407E8C]/30 focus:border-[#407E8C] transition-all"
                >
                  <option value="Pangan">Pangan (Sembako, Minuman)</option>
                  <option value="Sandang">Sandang (Pakaian, Selimut)</option>
                  <option value="Pendidikan">Pendidikan (Buku, Alat Tulis)</option>
                  <option value="Balita">Kebutuhan Balita (Susu, Popok)</option>
                  <option value="Kesehatan">Kesehatan (Obat, P3K)</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              {/* Target & Satuan (Sebaris) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Target Jumlah</label>
                  <input 
                    type="number" min="1" required
                    placeholder="0"
                    value={formData.target}
                    onChange={(e) => setFormData({...formData, target: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#124354] focus:outline-none focus:ring-2 focus:ring-[#407E8C]/30 focus:border-[#407E8C] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Satuan</label>
                  <select 
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#124354] focus:outline-none focus:ring-2 focus:ring-[#407E8C]/30 focus:border-[#407E8C] transition-all"
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="liter">Liter (L)</option>
                    <option value="pcs">Pcs / Buah</option>
                    <option value="kaleng">Kaleng</option>
                    <option value="paket">Paket / Dus</option>
                  </select>
                </div>
              </div>

              {/* Tenggat Waktu */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Estimasi Terpenuhi (Hari)</label>
                <input 
                  type="number" min="1" required
                  placeholder="Cth: 14"
                  value={formData.daysLeft}
                  onChange={(e) => setFormData({...formData, daysLeft: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#124354] focus:outline-none focus:ring-2 focus:ring-[#407E8C]/30 focus:border-[#407E8C] transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 mt-2 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-[#124354] text-white font-bold rounded-xl hover:bg-[#0E3544] transition-all shadow-md"
                >
                  Terbitkan Kebutuhan
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}