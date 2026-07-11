import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  Package,
  X,
  AlertCircle
} from 'lucide-react';
import { useForm } from '@inertiajs/react';

export default function PantiKebutuhan({ needs = [] }: { needs?: any[] }) {
  // State Utama
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Semua');
  
  // State Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  // State Modal Hapus
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteData, setDeleteData] = useState<any>(null);

  // useForm Hook
  const { data, setData, post, patch, delete: destroy, processing, errors, reset, clearErrors } = useForm({
    nama_kebutuhan: '',
    jumlah: '',
    satuan: 'kg',
    is_mendesak: false,
    kategori: 'Pangan',
    target_date: '',
  });

  // Helper untuk menghitung sisa hari secara dinamis
  const calculateDaysLeft = (targetDateStr: string | null) => {
    if (!targetDateStr) return 0;
    const target = new Date(targetDateStr);
    const today = new Date();
    target.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Logika Pencarian dan Filter
  const filteredData = needs.filter((item) => {
    const matchSearch = item.barang.toLowerCase().includes(search.toLowerCase());
    let matchFilter = true;
    
    if (filter === 'Aktif') matchFilter = item.status === 'aktif';
    if (filter === 'Mendesak') matchFilter = item.status === 'aktif' && (item.mendesak || calculateDaysLeft(item.target_date) <= 3);
    if (filter === 'Terpenuhi') matchFilter = item.status === 'selesai';

    return matchSearch && matchFilter;
  });

  // Handler Modal Form
  const openAddModal = () => {
    setEditData(null);
    reset();
    clearErrors();
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditData(item);
    setData({
      nama_kebutuhan: item.barang,
      jumlah: item.target.toString(),
      satuan: item.satuan,
      is_mendesak: !!item.mendesak,
      kategori: item.kategori || 'Pangan',
      target_date: item.target_date || '',
    });
    clearErrors();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
    clearErrors();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editData) {
      patch(route('panti.kebutuhan.update', editData.id), {
        onSuccess: () => {
          setIsModalOpen(false);
          reset();
        }
      });
    } else {
      post(route('panti.kebutuhan.store'), {
        onSuccess: () => {
          setIsModalOpen(false);
          reset();
        }
      });
    }
  };

  // Handler Hapus
  const confirmDelete = (item: any) => {
    setDeleteData(item);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = () => {
    if (deleteData) {
      destroy(route('panti.kebutuhan.destroy', deleteData.id), {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setDeleteData(null);
        }
      });
    }
  };

  // Kalkulasi Angka Statistik secara Dinamis
  const statAktif = needs.filter(d => d.status === 'aktif').length;
  const statTerpenuhi = needs.filter(d => d.status === 'selesai').length;
  const statMendesak = needs.filter(d => d.status === 'aktif' && (d.mendesak || calculateDaysLeft(d.target_date) <= 3)).length;

  return (
    <div className="space-y-8 pb-20 text-sm relative">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <h1 className="text-3xl font-extrabold text-[#124354] tracking-tight">Kebutuhan Panti</h1>
          <p className="text-gray-500 mt-1">Pantau dan kelola daftar logistik yang sedang dibutuhkan saat ini.</p>
        </div>
        <button 
          onClick={openAddModal}
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
            const percent = item.target > 0 ? Math.min(Math.round((item.terkumpul / item.target) * 100), 100) : 0;
            const isDone = item.status === 'selesai';
            const daysLeft = calculateDaysLeft(item.target_date);

            return (
              <div 
                key={item.id} 
                className="flex flex-col bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                {/* Header: Kategori & Opsi */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {item.kategori}
                  </span>
                  {item.mendesak && !isDone && (
                    <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <AlertCircle size={12} /> Mendesak
                    </span>
                  )}
                </div>

                {/* Judul Barang */}
                <h3 className="text-lg font-bold text-[#124354] mb-8 leading-snug line-clamp-2">
                  {item.barang}
                </h3>

                {/* Angka & Progress Bar */}
                <div className="mt-auto">
                  <div className="flex justify-between items-baseline mb-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-[#124354]">{item.terkumpul}</span>
                      <span className="text-sm font-medium text-gray-400">/ {item.target} {item.satuan}</span>
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
                        <Clock size={15} className={daysLeft <= 3 ? "text-red-500" : ""} />
                      )}
                      <span className={daysLeft <= 3 && !isDone ? "text-red-500 font-bold" : ""}>
                        {isDone ? 'Terpenuhi' : daysLeft > 0 ? `Sisa ${daysLeft} hari` : 'Tenggat Waktu Lewat'}
                      </span>
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={() => openEditModal(item)}
                        className="text-xs font-bold text-[#124354] hover:text-[#0E3544] underline decoration-transparent hover:decoration-[#124354] underline-offset-4 transition-all"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => confirmDelete(item)}
                        className="text-xs font-bold text-red-500 hover:text-red-700 underline decoration-transparent hover:decoration-red-500 underline-offset-4 transition-all"
                      >
                        Hapus
                      </button>
                    </div>
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
            onClick={openAddModal}
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

      {/* ================= MODAL FORM TAMBAH/EDIT KEBUTUHAN ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#083A4F]/60 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-[2rem] p-6 md:p-8 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-[#124354]">
                {editData ? 'Ubah Kebutuhan' : 'Buat Kebutuhan Baru'}
              </h3>
              <button 
                onClick={handleCloseModal} 
                className="p-2 text-gray-400 hover:text-[#124354] hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Nama Barang */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nama Barang</label>
                <input 
                  type="text" required
                  placeholder="Cth: Beras Premium, Susu Formula..."
                  value={data.nama_kebutuhan}
                  onChange={(e) => setData('nama_kebutuhan', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#124354] focus:outline-none focus:ring-2 focus:ring-[#407E8C]/30 focus:border-[#407E8C] transition-all"
                />
                {errors.nama_kebutuhan && <p className="text-red-500 text-xs mt-1">{errors.nama_kebutuhan}</p>}
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Kategori</label>
                <select 
                  value={data.kategori}
                  onChange={(e) => setData('kategori', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#124354] focus:outline-none focus:ring-2 focus:ring-[#407E8C]/30 focus:border-[#407E8C] transition-all"
                >
                  <option value="Pangan">Pangan (Sembako, Minuman)</option>
                  <option value="Sandang">Sandang (Pakaian, Selimut)</option>
                  <option value="Pendidikan">Pendidikan (Buku, Alat Tulis)</option>
                  <option value="Balita">Kebutuhan Balita (Susu, Popok)</option>
                  <option value="Kesehatan">Kesehatan (Obat, P3K)</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
                {errors.kategori && <p className="text-red-500 text-xs mt-1">{errors.kategori}</p>}
              </div>

              {/* Target & Satuan (Sebaris) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Target Jumlah</label>
                  <input 
                    type="number" min="1" required
                    placeholder="0"
                    value={data.jumlah}
                    onChange={(e) => setData('jumlah', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#124354] focus:outline-none focus:ring-2 focus:ring-[#407E8C]/30 focus:border-[#407E8C] transition-all"
                  />
                  {errors.jumlah && <p className="text-red-500 text-xs mt-1">{errors.jumlah}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Satuan</label>
                  <input 
                    type="text" required
                    placeholder="Cth: kg, L, pcs"
                    value={data.satuan}
                    onChange={(e) => setData('satuan', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#124354] focus:outline-none focus:ring-2 focus:ring-[#407E8C]/30 focus:border-[#407E8C] transition-all"
                  />
                  {errors.satuan && <p className="text-red-500 text-xs mt-1">{errors.satuan}</p>}
                </div>
              </div>

              {/* Tenggat Waktu (Date Picker) */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tenggat Waktu Kebutuhan</label>
                <input 
                  type="date" required
                  value={data.target_date}
                  onChange={(e) => setData('target_date', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#124354] focus:outline-none focus:ring-2 focus:ring-[#407E8C]/30 focus:border-[#407E8C] transition-all"
                />
                {errors.target_date && <p className="text-red-500 text-xs mt-1">{errors.target_date}</p>}
              </div>

              {/* Mendesak Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50">
                <div>
                  <label className="text-sm font-bold text-[#124354] block">Tandai Mendesak</label>
                  <p className="text-xs text-gray-500 mt-0.5">Kebutuhan ini akan diprioritaskan</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={data.is_mendesak}
                    onChange={e => setData('is_mendesak', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#407E8C]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 mt-2 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-6 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={processing}
                  className="flex-1 py-3 bg-[#124354] text-white font-bold rounded-xl hover:bg-[#0E3544] transition-all shadow-md disabled:opacity-50"
                >
                  {processing ? 'Menyimpan...' : editData ? 'Simpan Perubahan' : 'Terbitkan Kebutuhan'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL KONFIRMASI HAPUS ================= */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#083A4F]/60 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-[2rem] p-6 md:p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-[#124354] mb-3">Hapus Kebutuhan</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Apakah Anda yakin ingin menghapus kebutuhan <strong>{deleteData?.barang}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteData(null);
                }}
                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all text-xs"
              >
                Batal
              </button>
              <button 
                onClick={executeDelete}
                disabled={processing}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all text-xs shadow-md disabled:opacity-50"
              >
                {processing ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}