import React, { useState, useEffect, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { 
  MapPin, Phone, Mail, Globe, CheckCircle2, 
  Camera, Plus, Edit2, X, UploadCloud,
  Package, Map, Briefcase, BarChart3, ChevronRight,
  FileText, Calendar, Trash2, Image as ImageIcon
} from 'lucide-react';

const COLORS = {
    navy: "#083A4F",
    gold: "#A58D66",
    mist: "#C0D5D6",
    teal: "#407E8C",
    cream: "#E5E1DD",
  };

export default function ProfilPantiDashboard({ pantiData }: { pantiData?: any }) {
  // ================= STATES UNTUK TABS & MODALS =================
  const [activeProfileTab, setActiveProfileTab] = useState('postingan');
  
  // Modals State
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isNeedModalOpen, setIsNeedModalOpen] = useState(false);
  const [isPengurusModalOpen, setIsPengurusModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // States Dummy Data (Agar CRUD UI berfungsi)
  const [pantiInfo, setPantiInfo] = useState({
    nama: pantiData?.nama_yayasan || 'Yayasan Kasih Ibu',
    username: pantiData?.username || 'panti_resmi',
    deskripsi: pantiData?.deskripsi || 'Panti Asuhan berdedikasi memberikan tempat tinggal dan pendidikan bagi anak-anak yatim piatu. Bersama membangun generasi mandiri dan berakhlak mulia untuk menyongsong masa depan yang cerah.',
    alamat: pantiData?.alamat || 'Jl. Kasih Ibu No. 123, Kota Bandung, Jawa Barat',
    telepon: pantiData?.telepon || '0812-3456-7890',
    email: pantiData?.email || 'halo@yayasankasihibu.or.id',
    website: pantiData?.website || 'www.kasihibu.org',
    tahun_berdiri: pantiData?.tahun_berdiri || '2010',
    jumlah_anak: pantiData?.jumlah_anak || 45,
    cover: pantiData?.cover || null,
  });

  const [posts, setPosts] = useState<{ id: number; time: string; content: string; image: string | null }[]>([
    { id: 1, time: '2j', content: 'Alhamdulillah, donasi sembako minggu ini sudah disalurkan ke dapur panti. Terima kasih #OrangBaik atas rezekinya! 🙏✨', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop' },
    { id: 2, time: '5j', content: 'Adik-adik sedang fokus belajar matematika bersama Kak relawan. Terima kasih Kak Budi dan Kak Ani sudah meluangkan waktunya di akhir pekan ini! 📚✏️', image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=800&auto=format&fit=crop' },
  ]);

  const [needs, setNeeds] = useState([
    { id: 1, nama: 'Beras Premium', target: 100, terkumpul: 45, satuan: 'kg' },
    { id: 2, nama: 'Minyak Goreng', target: 50, terkumpul: 10, satuan: 'liter' },
    { id: 3, nama: 'Buku Tulis', target: 200, terkumpul: 150, satuan: 'pcs' },
  ]);

  const [pengurus, setPengurus] = useState([
    { id: 1, nama: "H. Ahmad Fauzi", jabatan: "Ketua Yayasan", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop" },
    { id: 2, nama: "Hj. Siti Aminah", jabatan: "Bendahara & Operasional", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop" },
  ]);

  const [audits, setAudits] = useState([
    { id: 1, judul: "Laporan Transparansi Q3 2026", tanggal: "1 Okt 2026" },
  ]);

  // Form untuk Postingan Baru (Ala Twitter)
  const [newPostContent, setNewPostContent] = useState('');

  // Setup form Inertia untuk Tambah Kebutuhan
  const { data, setData, post, processing, errors, reset } = useForm({
    nama_kebutuhan: '',
    kategori: 'Pangan',
    jumlah: '',
    satuan: '',
    is_mendesak: false,
  });

  // Fungsi menutup modal Kebutuhan
  const handleCloseModal = () => {
    setIsNeedModalOpen(false);
    reset(); // Reset isi form setelah ditutup
  };

  // Fungsi saat form disubmit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Karena saat ini masih pakai data dummy (needs), kita masukkan secara manual
    // Nanti jika sudah pakai database, ganti dengan: post(route('kebutuhan.store'), { onSuccess: () => handleCloseModal() })
    const newNeed = {
      id: Date.now(),
      nama: data.nama_kebutuhan,
      target: Number(data.jumlah),
      terkumpul: 0,
      satuan: data.satuan
    };
    
    setNeeds([...needs, newNeed]);
    handleCloseModal();
  };

  // ================= FUNGSI HELPER & HANDLER =================
  const getInitials = (name: string) => {
    if (!name) return 'YA';
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  // 1. State untuk gambar
const [imageFile, setImageFile] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState<string | null>(null);
const fileInputRef = useRef<HTMLInputElement>(null);

// 2. Fungsi saat gambar dipilih
const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file)); // Membuat URL sementara untuk preview
  }
};

// 3. Fungsi untuk menghapus gambar yang sudah dipilih
const removeImage = () => {
  setImageFile(null);
  setImagePreview(null);
  if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input file
};

// 4. Perbarui fungsi handleCreatePost yang sudah ada menjadi seperti ini:
const handleCreatePost = () => {
  if (!newPostContent.trim() && !imagePreview) return; // Mencegah posting kosong
  
  const newPost = {
    id: Date.now(),
    time: 'Baru saja',
    content: newPostContent,
    image: imagePreview // Menggunakan preview URL agar langsung tampil di timeline
  };
  
  setPosts([newPost, ...posts]);
  setNewPostContent('');
  removeImage(); // Bersihkan gambar setelah posting
};

  const handleDeletePost = (id: number) => {
    if(confirm('Hapus postingan ini?')) setPosts(posts.filter(p => p.id !== id));
  };

  const handleDeleteNeed = (id: number) => {
    if(confirm('Hapus kebutuhan ini?')) setNeeds(needs.filter(n => n.id !== id));
  };

  const profileTabs = [
    { id: 'postingan', label: 'Postingan' },
    { id: 'kebutuhan', label: 'Kebutuhan Barang' },
    { id: 'kontak', label: 'Kontak & Pengurus' },
    { id: 'audit', label: 'Audit Keuangan' },
  ];

  return (
    <div className="w-full bg-white text-[#124354] font-sans pb-20">
      <Head title={`Dashboard Panti - ${pantiInfo.nama}`} />

      {/* ================= BANNER & PROFIL ================= */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-40 md:h-60 w-full relative group overflow-hidden" style={{backgroundColor: COLORS.teal}}>
          
          {/* Gambar hanya akan dirender JIKA pantiInfo.cover memiliki isi/URL */}
          {pantiInfo.cover && (
            <img src={pantiInfo.cover} alt="Cover" className="w-full h-full object-cover" />
          )}
          
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button className="bg-white/90 backdrop-blur px-5 py-2.5 rounded-full text-sm font-bold text-[#124354] flex items-center gap-2 hover:bg-white transition-all shadow-lg">
              <Camera size={16} /> Ubah Cover Panti
            </button>
          </div>
        </div>
        
        <div className="px-5 md:px-8 pb-4">
          <div className="flex justify-between items-start">
            
            {/* Foto Profil */}
            <div className="-mt-14 md:-mt-20 w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center border-4 border-white shadow-sm bg-[#083A4F] text-white font-black text-5xl overflow-hidden relative z-10 group">
              <span>{getInitials(pantiInfo.nama)}</span>
              <button className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white gap-1">
                <Camera size={24} />
                <span className="text-[10px] font-bold">Ubah Foto</span>
              </button>
            </div>

            {/* Tombol Aksi Kanan */}
            <div className="mt-4 mr-1 md:mr-4 flex gap-2 items-center">
              <button 
                onClick={() => setIsEditProfileModalOpen(true)}
                className="px-5 py-2 md:px-4 md:py-2 hover:bg-gray-100 text-white rounded-full font-bold shadow-sm transition-colors flex items-center gap-2 text-[14px]"
                style={{backgroundColor: COLORS.navy}}
              >
                <Edit2 size={16} /> Edit Profil
              </button>
            </div>
          </div>

          <div className="mt-4">
            <h1 className="text-xl md:text-2xl font-black text-[#124354] flex items-center gap-1.5">
              {pantiInfo.nama} 
              <CheckCircle2 size={18} className="text-blue-500 fill-blue-50" />
            </h1>
            <p className="text-gray-500 text-sm">@{pantiInfo.username}</p>
          </div>

          <div className="mt-3 text-[15px] text-gray-700 leading-relaxed max-w-4xl whitespace-pre-line group relative w-fit">
            {pantiInfo.deskripsi}
            <button onClick={() => setIsEditProfileModalOpen(true)} className="absolute -right-8 top-0 p-1.5 text-gray-400 hover:text-[#407E8C] opacity-0 group-hover:opacity-100 transition-opacity rounded-md hover:bg-gray-50">
              <Edit2 size={16} />
            </button>
          </div>

          {/* Dokumen Resmi (Editable) */}
          <div className="mt-4 flex flex-wrap gap-3 mb-2 items-center">
             <button className="flex items-center gap-2 px-3.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-[#407E8C] hover:text-white hover:border-[#407E8C] transition-colors">
                <FileText size={14} /> Akta Pendirian
             </button>
             <button className="flex items-center gap-2 px-3.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-[#407E8C] hover:text-white hover:border-[#407E8C] transition-colors">
                <FileText size={14} /> SK Kemenkumham
             </button>
             <button className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-gray-300 rounded-lg text-xs font-bold text-gray-400 hover:text-[#407E8C] hover:border-[#407E8C] transition-colors">
                <Plus size={14} /> Tambah Dokumen
             </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[14px] font-medium text-gray-500">
            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#407E8C]" /> {pantiInfo.alamat}</span>
            <span className="flex items-center gap-1.5"><Globe size={14} className="text-[#407E8C]" /> {pantiInfo.website}</span>
            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#407E8C]" /> Berdiri {pantiInfo.tahun_berdiri}</span>
          </div>
        </div>
      </div>

      {/* ================= TAB NAVIGATION ================= */}
      <div className="flex overflow-x-auto no-scrollbar border-y border-gray-200 gap-8 md:gap-28 sticky top-0 z-30 bg-white/95 backdrop-blur-md px-5 justify-start sm:justify-center">
        {profileTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveProfileTab(tab.id)}
            className={`relative px-2 md:px-5 py-3.5 text-[13px] md:text-[14px] font-bold whitespace-nowrap transition-colors hover:bg-gray-50 ${
              activeProfileTab === tab.id ? 'text-[#124354]' : 'text-gray-500'
            }`}
          >
            {tab.label}
            {activeProfileTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#407E8C] rounded-t-full" />}
          </button>
        ))}
      </div>

      {/* ================= TAB CONTENT ================= */}
      <div className="min-h-[50vh] bg-white">
        
        {/* TAB 1: POSTINGAN (DENGAN INPUT TWEET) */}
        {activeProfileTab === 'postingan' && (
          <div className="w-full max-w-4xl mx-auto min-h-screen">
            
            {/* Create Post Area */}
            <div className="p-4 md:p-6 border-b border-gray-100 flex gap-3 md:gap-4 bg-gray-50/30">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#083A4F] shrink-0 text-white flex items-center justify-center font-bold text-sm md:text-base">
                {getInitials(pantiInfo.nama)}
            </div>
            <div className="flex-1">
                <textarea 
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full resize-none border-none outline-none focus:ring-0 text-[14px] md:text-base placeholder:text-[15px] md:placeholder:text-[15px] placeholder-gray-400 text-[#124354] pt-2 bg-transparent" 
                placeholder="Apa kegiatan panti hari ini? Bagikan cerita ke donatur..." 
                rows={3}
                />
                
                {/* ===== AREA PREVIEW GAMBAR ===== */}
                {imagePreview && (
                <div className="relative mt-2 mb-3 inline-block">
                    <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-h-48 rounded-xl border border-gray-200 object-cover" 
                    />
                    <button 
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 bg-gray-900/60 hover:bg-gray-900 text-white rounded-full transition-colors backdrop-blur-sm"
                    >
                    <X size={14} />
                    </button>
                </div>
                )}

                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                    
                {/* ===== INPUT FILE TERSEMBUNYI & TOMBOL UPLOAD ===== */}
                <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                />
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[#407E8C] hover:bg-blue-50 p-2 rounded-full transition-colors flex items-center gap-2 text-sm font-bold"
                >
                    <ImageIcon size={20}/> <span className="hidden md:block">Lampirkan Foto</span>
                </button>
                
                <button 
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim() && !imagePreview} // Tombol aktif jika ada teks ATAU ada gambar
                    className="bg-[#083A4F] text-[15px] text-white px-6 py-2 rounded-full font-bold hover:bg-[#124354] transition-colors disabled:opacity-50"
                >
                    Posting
                </button>
                </div>
            </div>
            </div>

            {/* Feed Postingan */}
            <div className="divide-y divide-gray-100">
              {posts.map((post) => (
                <div key={post.id} className="p-4 md:p-6 hover:bg-gray-50 transition relative group">
                  <div className="flex gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#083A4F] shrink-0 text-white flex items-center justify-center font-bold text-sm md:text-base">
                      {getInitials(pantiInfo.nama)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-1.5 flex-wrap pr-2">
                          <span className="font-bold text-sm md:text-base truncate">{pantiInfo.nama}</span>
                          <CheckCircle2 size={14} className="text-blue-500 fill-blue-50 shrink-0" />
                          <span className="text-gray-500 text-xs md:text-sm truncate">@{pantiInfo.username} · {post.time}</span>
                        </div>
                        
                        {/* CRUD Action for Post */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-gray-400 hover:text-[#407E8C] hover:bg-blue-50 rounded-full transition-colors">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDeletePost(post.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm mt-1 text-gray-800 leading-relaxed whitespace-pre-line">
                        {post.content}
                      </p>
                      {post.image && (
                        <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 aspect-video max-w-xl bg-gray-100">
                          <img src={post.image} className="w-full h-full object-cover" alt="Post" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: KEBUTUHAN BARANG (CRUD) */}
        {activeProfileTab === 'kebutuhan' && (
          <div className="p-5 md:p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black flex items-center gap-2 text-[#124354]">
                <Package size={20} className="text-[#407E8C]" /> Kelola Target Kebutuhan
              </h3>
              <button 
                onClick={() => setIsNeedModalOpen(true)}
                className="px-4 py-2 bg-[#083A4F] text-white text-xs md:text-sm font-bold rounded-lg flex items-center gap-2 hover:bg-[#124354] transition-colors"
              >
                <Plus size={16} /> Tambah Kebutuhan
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {needs.map((need, idx) => {
                const sisa = Math.max(need.target - need.terkumpul, 0);
                const progress = need.target > 0 ? Math.min((need.terkumpul / need.target) * 100, 100) : 0;

                return (
                  <div key={idx} className="border border-gray-200 rounded-xl p-5 bg-white hover:border-[#407E8C] transition-all flex flex-col justify-between shadow-sm group">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h4 className="font-extrabold text-[15px] text-[#124354] leading-tight">{need.nama}</h4>
                        {/* CRUD Actions */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1 text-gray-400 hover:text-[#407E8C]"><Edit2 size={14}/></button>
                          <button onClick={() => handleDeleteNeed(need.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                        </div>
                      </div>
                      <span className="text-[10px] bg-orange-50 text-orange-700 border border-orange-200 font-extrabold px-2 py-0.5 rounded shrink-0 inline-block mb-3">
                          Sisa {sisa} {need.satuan}
                      </span>
                      
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                        <div className="h-full bg-[#407E8C] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="flex justify-between text-[11px] text-gray-500 font-medium">
                        <span>Terkumpul: {need.terkumpul}</span>
                        <span>Target: {need.target}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: KONTAK & PENGURUS (CRUD) */}
        {activeProfileTab === 'kontak' && (
          <div className="p-5 md:p-8 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Info Kontak */}
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                   <h3 className="text-lg font-black text-[#124354] flex items-center gap-2">
                     <Map size={20} className="text-[#407E8C]" /> Lokasi & Kontak
                   </h3>
                   <button onClick={() => setIsEditProfileModalOpen(true)} className="text-xs font-bold text-[#407E8C] hover:underline flex items-center gap-1">
                     <Edit2 size={12} /> Edit Detail
                   </button>
                 </div>
                 
                 <div className="aspect-video w-full bg-gray-200 rounded-2xl overflow-hidden border border-gray-200 relative group">
                   <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-60" alt="Map" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <button className="bg-white/90 px-4 py-2 rounded-full text-xs font-bold shadow flex items-center gap-2 hover:bg-white"><MapPin size={14} className="text-red-500" /> Ubah Pin Lokasi Maps</button>
                   </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex gap-3 items-start">
                       <div className="p-2 bg-gray-50 rounded-lg shrink-0 border border-gray-200"><MapPin size={16} className="text-[#124354]" /></div>
                       <div>
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Alamat Lengkap</p>
                          <p className="text-sm font-medium text-[#124354] leading-relaxed">{pantiInfo.alamat}</p>
                       </div>
                    </div>
                    <div className="flex gap-3 items-start">
                       <div className="p-2 bg-gray-50 rounded-lg shrink-0 border border-gray-200"><Phone size={16} className="text-[#124354]" /></div>
                       <div>
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Telepon / WhatsApp</p>
                          <p className="text-sm font-medium text-[#124354]">{pantiInfo.telepon}</p>
                       </div>
                    </div>
                    <div className="flex gap-3 items-start">
                       <div className="p-2 bg-gray-50 rounded-lg shrink-0 border border-gray-200"><Mail size={16} className="text-[#124354]" /></div>
                       <div>
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Email Yayasan</p>
                          <p className="text-sm font-medium text-[#124354]">{pantiInfo.email}</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Pengurus Panti */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 h-fit self-start">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg font-black text-[#124354] flex items-center gap-2">
                      <Briefcase size={18} className="text-[#A58D66]" /> Susunan Pengurus
                  </h3>
                  <button onClick={() => setIsPengurusModalOpen(true)} className="p-1.5 bg-white border border-gray-200 rounded-lg text-[#124354] hover:bg-gray-100">
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    {pengurus.map((p) => (
                        <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-3 text-center shadow-sm hover:border-[#407E8C] transition-colors relative group">
                          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1 bg-white shadow-sm rounded border border-gray-100 text-gray-500 hover:text-[#407E8C]"><Edit2 size={12}/></button>
                            <button onClick={() => setPengurus(pengurus.filter(x => x.id !== p.id))} className="p-1 bg-white shadow-sm rounded border border-gray-100 text-gray-500 hover:text-red-500"><Trash2 size={12}/></button>
                          </div>
                          <div className="w-12 h-12 md:w-16 md:h-16 mx-auto rounded-full overflow-hidden mb-2 border-2 border-gray-100">
                              <img src={p.image} alt={p.nama} className="w-full h-full object-cover" />
                          </div>
                          <h4 className="font-bold text-[12px] md:text-xs text-[#124354] mb-0.5">{p.nama}</h4>
                          <p className="text-[10px] text-gray-500 font-medium">{p.jabatan}</p>
                        </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AUDIT KEUANGAN (CRUD) */}
        {activeProfileTab === 'audit' && (
          <div className="p-5 md:p-8 max-w-4xl mx-auto space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-[#124354]">Riwayat Laporan</h3>
              <button onClick={() => setIsAuditModalOpen(true)} className="px-4 py-2 bg-[#083A4F] text-white text-xs font-bold rounded-lg flex items-center gap-2 hover:bg-[#124354] transition-colors">
                <Plus size={16} /> Unggah Laporan
              </button>
            </div>

            {audits.map((audit) => (
              <div key={audit.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <BarChart3 size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-[#124354]">{audit.judul}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Dipublikasi pada {audit.tanggal}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
                  <button className="w-full sm:w-auto text-xs font-bold text-[#124354] border border-gray-200 bg-gray-50 px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-all">
                    Lihat File
                  </button>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none p-2.5 flex justify-center items-center rounded-lg border border-gray-200 text-gray-500 hover:text-[#407E8C] hover:bg-blue-50 transition-colors"><Edit2 size={16}/></button>
                    <button onClick={() => setAudits(audits.filter(a => a.id !== audit.id))} className="flex-1 sm:flex-none p-2.5 flex justify-center items-center rounded-lg border border-gray-200 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={16}/></button>
                  </div>
                </div>
              </div>
            ))}
            
            <p className="text-xs text-gray-400 mt-6 flex items-center gap-1.5"><CheckCircle2 size={14} /> Berikan transparansi terbaik kepada donatur dengan selalu mengunggah laporan dana per kuartal.</p>
          </div>
        )}

      </div>

      {/* ================= SEMUA MODALS UNTUK CRUD ================= */}
      
      {/* 1. Modal Edit Profil Utama */}
      {isEditProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#124354]/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="sticky top-0 bg-white px-8 py-5 border-b border-gray-100 flex justify-between items-center z-10">
              <h3 className="text-xl font-black text-[#124354]">Edit Profil Panti</h3>
              <button onClick={() => setIsEditProfileModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            </div>
            
            <div className="p-8 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 ml-1">Nama Yayasan/Panti</label>
                  <input type="text" value={pantiInfo.nama} onChange={e => setPantiInfo({...pantiInfo, nama: e.target.value})} className="w-full p-3 text-sm rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#124354]" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 ml-1">Username Publik</label>
                  <input type="text" value={pantiInfo.username} onChange={e => setPantiInfo({...pantiInfo, username: e.target.value})} className="w-full p-3 text-sm rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#124354]" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 ml-1">Deskripsi / Bio Singkat</label>
                <textarea rows={4} value={pantiInfo.deskripsi} onChange={e => setPantiInfo({...pantiInfo, deskripsi: e.target.value})} className="w-full p-3 text-sm rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#124354] resize-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 ml-1">No. Telepon / WA</label>
                  <input type="text" value={pantiInfo.telepon} onChange={e => setPantiInfo({...pantiInfo, telepon: e.target.value})} className="w-full p-3 text-sm rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#124354]" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 ml-1">Email Resmi</label>
                  <input type="email" value={pantiInfo.email} onChange={e => setPantiInfo({...pantiInfo, email: e.target.value})} className="w-full p-3 text-sm rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#124354]" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 ml-1">Website / Linktr.ee</label>
                  <input type="text" value={pantiInfo.website} onChange={e => setPantiInfo({...pantiInfo, website: e.target.value})} className="w-full p-3 text-sm rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#124354]" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 ml-1">Tahun Berdiri</label>
                  <input type="text" value={pantiInfo.tahun_berdiri} onChange={e => setPantiInfo({...pantiInfo, tahun_berdiri: e.target.value})} className="w-full p-3 text-sm rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#124354]" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 ml-1">Alamat Lengkap</label>
                <textarea rows={2} value={pantiInfo.alamat} onChange={e => setPantiInfo({...pantiInfo, alamat: e.target.value})} className="w-full p-3 text-sm rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#124354] resize-none" />
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-white p-5 border-t border-gray-100 flex gap-3 z-10 justify-end">
              <button onClick={() => setIsEditProfileModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all">Batal</button>
              <button onClick={() => setIsEditProfileModalOpen(false)} className="px-8 py-3 bg-[#124354] text-white font-bold rounded-xl hover:bg-[#0E3544] transition-all">Simpan Perubahan</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL FORM TAMBAH KEBUTUHAN ================= */}
      {isNeedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#083A4F]/60 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-[2rem] p-6 md:p-8 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-[#124354]">
                Buat Kebutuhan Baru
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

              {/* Target & Satuan */}
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
                  {processing ? 'Menyimpan...' : 'Terbitkan Kebutuhan'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 3. Modal Tambah Pengurus */}
      {isPengurusModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#083A4F]/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-black text-[#124354]">Tambah Pengurus</h3>
              <button onClick={() => setIsPengurusModalOpen(false)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-full"><X size={20}/></button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:bg-gray-200 cursor-pointer">
                  <Camera size={24} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Nama Lengkap</label>
                <input type="text" className="w-full p-3 text-sm rounded-xl bg-gray-50 border border-gray-200 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Jabatan / Posisi</label>
                <input type="text" className="w-full p-3 text-sm rounded-xl bg-gray-50 border border-gray-200 outline-none" />
              </div>
              <button onClick={() => setIsPengurusModalOpen(false)} className="w-full py-3 mt-4 bg-[#083A4F] text-white font-bold rounded-xl">Simpan Profil Pengurus</button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal Tambah Laporan Audit */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#083A4F]/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-black text-[#124354]">Unggah Laporan Keuangan</h3>
              <button onClick={() => setIsAuditModalOpen(false)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-full"><X size={20}/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Judul Laporan</label>
                <input type="text" className="w-full p-3 text-sm rounded-xl bg-gray-50 border border-gray-200 outline-none" placeholder="Cth: Laporan Keuangan Q1 2026" />
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 cursor-pointer">
                <UploadCloud size={28} className="text-gray-400 mb-2" />
                <p className="text-sm font-bold text-[#124354]">Pilih File PDF/Excel</p>
                <p className="text-xs text-gray-500">Maksimal ukuran file 10MB</p>
              </div>
              <button onClick={() => setIsAuditModalOpen(false)} className="w-full py-3 mt-4 bg-[#083A4F] text-white font-bold rounded-xl">Unggah Dokumen</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}