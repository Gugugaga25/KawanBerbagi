import React, { useState } from 'react';
import { 
  MapPin, Phone, Mail, Globe, ShieldCheck, 
  Camera, Plus, Edit2, X, UploadCloud
} from 'lucide-react';

// ====== Data Dummy Galeri ======
const DUMMY_GALLERY = [
  { id: 1, category: 'Pendidikan', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=400&auto=format&fit=crop&sig=1' },
  { id: 2, category: 'Sosial', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=400&auto=format&fit=crop&sig=2' },
  { id: 3, category: 'Religi', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=400&auto=format&fit=crop&sig=3' },
  { id: 4, category: 'Pendidikan', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=400&auto=format&fit=crop&sig=4' },
  { id: 5, category: 'Sosial', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=400&auto=format&fit=crop&sig=5' },
];

export default function ProfilPanti() {
  // States untuk kontrol UI
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [activeGallery, setActiveGallery] = useState('Semua');

  const galleryCategories = ['Semua', 'Pendidikan', 'Sosial', 'Religi'];

  // Logic filter gambar berdasarkan kategori aktif
  const filteredGallery = activeGallery === 'Semua' 
    ? DUMMY_GALLERY 
    : DUMMY_GALLERY.filter(img => img.category === activeGallery);

  return (
    <div className="space-y-6 pb-20 text-sm">
      
      {/* ================= HEADER / BRANDING BANNER ================= */}
      <div className="bg-white rounded-3xl p-2 border border-gray-100 shadow-sm">
        {/* Cover Image */}
        <div className="relative h-48 md:h-64 rounded-2xl bg-gray-100 overflow-hidden group">
          <img 
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop" 
            alt="Cover Panti" 
            className="w-full h-full object-cover opacity-80"
          />
          <button className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-xs font-bold text-[#124354] flex items-center gap-2 hover:bg-white transition-all shadow-sm">
            <Camera size={14} /> Ubah Cover
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6 pt-4 flex flex-col md:flex-row md:items-end justify-between gap-4 relative">
          <div className="flex flex-col md:flex-row gap-5 md:items-end">
            {/* Logo/Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center text-3xl font-black text-[#124354] -mt-16 relative z-10 overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=Panti+Kasih+Ibu&background=124354&color=fff&size=200" alt="Logo" />
              <button className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white">
                <Camera size={20} />
              </button>
            </div>
            
            <div className="mb-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-black text-[#124354] tracking-tight">Panti Asuhan Kasih Ibu</h1>
                <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                  <ShieldCheck size={12} /> Terverifikasi
                </span>
              </div>
              <p className="text-gray-500 text-xs">Berdiri sejak 2010 • Menampung 45 Anak Asuh</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gray-50 text-[#124354] text-xs font-bold hover:bg-gray-100 border border-gray-200 transition-all"
          >
            <Edit2 size={14} /> Edit Profil
          </button>
        </div>
      </div>

      {/* ================= CONTENT GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* === Kolom Kiri: Tentang & Galeri === */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tentang Kami */}
          <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-[#124354] mb-3">Tentang Yayasan</h2>
            <p className="text-gray-500 leading-relaxed">
              Panti Asuhan Kasih Ibu adalah lembaga kesejahteraan sosial yang berdedikasi untuk memberikan tempat tinggal, pendidikan, dan kasih sayang bagi anak-anak yatim piatu dan telantar. Visi kami adalah menciptakan generasi mandiri yang memiliki nilai moral tinggi dan siap menghadapi masa depan.
            </p>
          </div>

          {/* Galeri Kegiatan */}
          <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-lg font-bold text-[#124354]">Galeri Kegiatan</h2>
              
              {/* Filter Buttons */}
              <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                {galleryCategories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveGallery(cat)}
                    className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-colors whitespace-nowrap ${
                      activeGallery === cat 
                        ? 'bg-[#124354] text-white shadow-md shadow-[#124354]/20' 
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {filteredGallery.map((img) => (
                <div key={img.id} className="aspect-square rounded-xl bg-gray-100 relative group overflow-hidden border border-gray-100">
                  <img src={img.url} alt={`Kegiatan ${img.category}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-[9px] font-bold uppercase rounded-md">
                    {img.category}
                  </span>
                  <button className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500">
                    <X size={14} />
                  </button>
                </div>
              ))}
              
              {/* Tombol Tambah Foto */}
              <button 
                onClick={() => setIsPhotoModalOpen(true)}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-[#124354] hover:bg-gray-50 hover:border-[#124354] transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                  <Plus size={20} />
                </div>
                <span className="text-xs font-bold mt-1">Tambah Foto</span>
              </button>
            </div>
          </div>
        </div>

        {/* === Kolom Kanan: Info Kontak & Legalitas === */}
        <div className="space-y-6">
          <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm">
            <h2 className="text-sm font-bold text-[#124354] mb-4 uppercase tracking-wider">Kontak & Lokasi</h2>
            <div className="space-y-4 text-gray-600">
              <div className="flex gap-3">
                <MapPin size={18} className="text-gray-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">Jl. Melati Putih No. 45, Kecamatan Sukasari, Kota Bandung, Jawa Barat 40154</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-gray-400 shrink-0" />
                <span>+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gray-400 shrink-0" />
                <span>halo@kasihibu.org</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe size={18} className="text-gray-400 shrink-0" />
                <span>www.kasihibu.org</span>
              </div>
            </div>
          </div>

          <div className="bg-[#124354] rounded-[1.5rem] p-6 text-white shadow-sm relative overflow-hidden">
            <ShieldCheck size={100} className="absolute -right-6 -bottom-6 text-white/5" />
            <h2 className="text-sm font-bold mb-4 uppercase tracking-wider relative z-10">Legalitas Yayasan</h2>
            <div className="space-y-3 text-xs text-gray-300 relative z-10">
              <div>
                <p className="text-white font-semibold mb-0.5">Akta Pendirian</p>
                <p>No. 12 / 04 Agustus 2010</p>
              </div>
              <div>
                <p className="text-white font-semibold mb-0.5">SK Kemenkumham</p>
                <p>AHU-12345.AH.01.04.Tahun 2010</p>
              </div>
              <button className="mt-2 text-white font-bold underline decoration-white/30 underline-offset-4 hover:decoration-white transition-colors">
                Lihat Dokumen Resmi
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ================= MODAL EDIT PROFIL ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#124354]/40 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-[2rem] p-6 md:p-8 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-[#124354]">Edit Profil Yayasan</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 text-gray-400 hover:text-[#124354] hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsEditModalOpen(false); }}>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 ml-1">Nama Panti</label>
                <input type="text" className="w-full p-3.5 text-sm rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#124354] focus:bg-white transition-colors text-[#124354] font-medium" defaultValue="Panti Asuhan Kasih Ibu" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 ml-1">Telepon</label>
                  <input type="text" className="w-full p-3.5 text-sm rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#124354] focus:bg-white transition-colors text-[#124354] font-medium" defaultValue="+62 812-3456-7890" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 ml-1">Website</label>
                  <input type="text" className="w-full p-3.5 text-sm rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#124354] focus:bg-white transition-colors text-[#124354] font-medium" defaultValue="www.kasihibu.org" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 ml-1">Alamat Lengkap</label>
                <textarea className="w-full p-3.5 text-sm rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#124354] focus:bg-white transition-colors text-[#124354] font-medium resize-none h-20" defaultValue="Jl. Melati Putih No. 45, Kecamatan Sukasari, Kota Bandung, Jawa Barat 40154" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 ml-1">Tentang Yayasan</label>
                <textarea className="w-full p-3.5 text-sm rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#124354] focus:bg-white transition-colors text-[#124354] font-medium resize-none h-28" defaultValue="Panti Asuhan Kasih Ibu adalah lembaga kesejahteraan sosial yang berdedikasi..." />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-3.5 rounded-xl font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 transition-all w-full md:w-auto">
                  Batal
                </button>
                <button type="submit" className="flex-1 py-3.5 bg-[#124354] text-white font-bold rounded-xl hover:bg-[#0E3544] hover:shadow-lg hover:shadow-[#124354]/20 transition-all">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL TAMBAH FOTO ================= */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#124354]/40 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-[2rem] p-6 md:p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-[#124354]">Tambah Foto Baru</h3>
              <button onClick={() => setIsPhotoModalOpen(false)} className="p-2 text-gray-400 hover:text-[#124354] hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setIsPhotoModalOpen(false); }}>
              
              {/* Drag & Drop Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 hover:border-[#124354] transition-colors cursor-pointer group">
                <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-[#124354] mb-4">
                  <UploadCloud size={28} />
                </div>
                <p className="text-sm font-bold text-[#124354] mb-1">Klik atau Tarik gambar ke sini</p>
                <p className="text-xs text-gray-500">Maksimal ukuran file 5MB (JPG, PNG)</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 ml-1">Kategori Kegiatan</label>
                <select className="w-full p-3.5 text-sm rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#124354] focus:bg-white text-[#124354] font-medium appearance-none">
                  <option value="" disabled selected>Pilih Kategori...</option>
                  <option value="Pendidikan">Pendidikan</option>
                  <option value="Sosial">Sosial</option>
                  <option value="Religi">Religi</option>
                </select>
              </div>

              <button type="submit" className="w-full py-3.5 bg-[#124354] text-white font-bold rounded-xl hover:bg-[#0E3544] hover:shadow-lg hover:shadow-[#124354]/20 transition-all mt-4">
                Unggah Foto
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}