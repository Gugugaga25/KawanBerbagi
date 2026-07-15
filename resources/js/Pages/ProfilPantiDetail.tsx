import React, { useState, useRef } from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { 
  MapPin, Users, ArrowLeft, Wallet, Package, Menu, Globe, 
  Calendar, FileText, CheckCircle2, MessageCircle, 
  Repeat2, Heart, Share, BarChart3, Users2, ExternalLink,
  Clock, CalendarDays, ChevronRight, Phone, Mail, Map, Briefcase, User, Send,
  X,
  Flag
} from 'lucide-react';

const COLORS = {
  navy: "#083A4F",
  gold: "#A58D66",
  mist: "#C0D5D6",
  teal: "#407E8C",
  cream: "#E5E1DD",
};

// ================= KOMPONEN NAVIGASI (GUEST / LUAR LUAR) =================
function Nav() {
  const [open, setOpen] = useState(false);
  const { auth } = usePage().props as any;
  const { url } = usePage(); 

  const links = [
    { label: "Cara Kerja", href: "/#cara-kerja" },
    { label: "Untuk Siapa", href: "/#untuk-siapa" },
    { label: "Fitur", href: "/#fitur" },
    { label: "Profil Panti", href: "/profil-panti" },
  ];

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur"
      style={{ backgroundColor: `${COLORS.cream}f2`, borderBottom: `1px solid ${COLORS.mist}` }}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl font-bold" style={{ color: COLORS.navy }}>
            KawanBerbagi
            <span style={{ color: COLORS.teal }}>.</span>
          </span>
        </a>
        
        {/* === MENU DEKSTOP === */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => {
            const isActive = url === l.href || url.startsWith(l.href + '/');
            return (
              <a
                key={l.href}
                href={l.href}
                className={`text-base font-bold transition-all ${
                  isActive ? "border-b-2 pb-1" : "hover:opacity-70"
                }`}
                style={{ 
                  color: isActive ? COLORS.teal : COLORS.navy,
                  borderColor: isActive ? COLORS.teal : "transparent" 
                }}
              >
                {l.label}
              </a>
            );
          })}
        </div>

        {/* === TOMBOL AUTH === */}
        <div className="hidden md:flex items-center gap-3">
          {auth?.user ? (
            <>
              <Link
                href={
                  auth.user.id_role_user === 'RL01ADM' ? route('admin.dashboard') :
                  auth.user.id_role_user === 'RL02PAN' ? route('panti.dashboard') :
                  route('donatur.dashboard')
                }
                className="text-sm font-bold mr-2 hover:underline transition-all"
                style={{ color: COLORS.navy }}
              >
                Halo, {auth.user.name}
              </Link>
              <Link
                href={route("logout")}
                method="post"
                as="button"
                className="text-base font-semibold px-5 py-2.5 rounded-full text-white hover:brightness-110 transition"
                style={{ backgroundColor: COLORS.navy }}>
                Keluar
              </Link>
            </>
          ) : (
            <>
              <Link
                href={route("login")}
                className="text-base font-medium px-4 py-2 rounded-full hover:opacity-80 transition-opacity"
                style={{ color: COLORS.navy }}>
                Masuk
              </Link>
              <Link
                href={route("register")}
                className="text-base font-semibold px-5 py-2.5 rounded-full text-white hover:brightness-110 transition"
                style={{ backgroundColor: COLORS.teal }}>
                Daftar
              </Link>
            </>
          )}
        </div>

        {/* === TOMBOL HAMBURGER MOBILE === */}
        <button
          className="md:hidden p-2 rounded-lg"
          style={{ color: COLORS.navy }}
          onClick={() => setOpen((o) => !o)}
          aria-label="Buka menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* === MENU MOBILE === */}
      {open && (
        <div
          className="md:hidden px-5 pb-5 flex flex-col gap-4 absolute w-full shadow-md"
          style={{ backgroundColor: COLORS.cream, borderTop: `1px solid ${COLORS.mist}` }}
        >
          {links.map((l) => {
            const isActive = url === l.href || url.startsWith(l.href + '/');
            return (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`text-lg font-medium py-1 transition-colors ${
                  isActive ? "font-bold" : ""
                }`}
                style={{ 
                  color: isActive ? COLORS.teal : COLORS.navy,
                }}
              >
                {l.label}
              </a>
            );
          })}
          <a
            href="#mulai"
            onClick={() => setOpen(false)}
            className="text-lg font-semibold text-center px-5 py-3 rounded-full text-white mt-2"
            style={{ backgroundColor: COLORS.teal }}
          >
            Mulai Donasi
          </a>
        </div>
      )}
    </header>
  );
}

export default function ProfilPantiDetail({ 
  panti, 
  needs, 
  auth,
  donaturData = null,
  stats = { totalDonasi: 0, pantiTerbantu: 0 }
}: { 
  panti: any; 
  needs: any[]; 
  auth: any;
  donaturData?: any;
  stats?: { totalDonasi: number; pantiTerbantu: number };
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [activeProfileTab, setActiveProfileTab] = useState('postingan');

  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // States untuk Modals
  const [selectedNeed, setSelectedNeed] = useState<any>(null);
  const [isNeedModalOpen, setIsNeedModalOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<any>(null);
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);

  // Formulir
  const formUang = useForm({
    id_panti: panti?.id_shelter || panti?.id,
    nominal_donasi: '',
    pesan: '',
    donasi_developer: 0, 
  });

  const formBarang = useForm({
    id_need: '', jumlah_donasi: '', metode_pengiriman: 'antar_sendiri', catatan: '',
  });

  const formVolunteer = useForm({
    id_activity: '', nama: '', telepon: '', motivasi: ''
  });

  const submitDonasiUang = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Terima kasih! Simulasi Lanjut ke Pembayaran.");
  };

  const submitBookingBarang = (e: React.FormEvent) => {
    e.preventDefault();
    setIsNeedModalOpen(false);
    alert("Slot donasi barang berhasil dibooking! Silakan kirimkan barang Anda.");
  };

  const submitVolunteer = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVolunteerModalOpen(false);
    alert("Pendaftaran relawan berhasil dikirim ke panti!");
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'YA';
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const nominalDonasi = parseInt(formUang.data.nominal_donasi) || 0;
  const totalPembayaran = nominalDonasi + formUang.data.donasi_developer;

  const profileTabs = [
    { id: 'postingan', label: 'Postingan' },
    { id: 'kebutuhan', label: 'Kebutuhan Barang' },
    // { id: 'volunteer', label: 'Volunteer' },
    { id: 'kontak', label: 'Kontak & Pengurus' },
    { id: 'audit', label: 'Audit Keuangan' },
  ];

  // --- DATA DUMMY (Diubah jadi State agar bisa di-like) ---
  const [posts, setPosts] = useState([
    {
      id: 1, time: '2j', likes: 148, isLiked: false,
      content: 'Alhamdulillah, donasi sembako minggu ini sudah disalurkan ke dapur panti. Terima kasih #OrangBaik atas rezekinya! Anak-anak sangat senang hari ini bisa makan enak. 🙏✨',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 2, time: '5j', likes: 89, isLiked: false,
      content: 'Adik-adik sedang fokus belajar matematika bersama Kak relawan. Terima kasih Kak Budi dan Kak Ani sudah meluangkan waktunya di akhir pekan ini! Kalau ada yang mau gabung mengajar, cek tab Volunteer ya 📚✏️',
      image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 3, time: '1h', likes: 56, isLiked: false,
      content: 'Pengingat: Kami masih membuka donasi untuk perbaikan atap asrama putra yang bocor. Bantuan bisa disalurkan melalui tab Donasi Uang. Berapapun nominalnya, sangat berarti bagi kami. Semoga menjadi amal jariyah.',
      image: null,
    },
    {
      id: 4, time: '2h', likes: 210, isLiked: false,
      content: 'Keceriaan sore ini di halaman panti. Bermain bola bersama setelah sholat Ashar. Sehat-sehat terus ya nak! ⚽🏃‍♂️',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 5, time: '1h', likes: 120, isLiked: false,
      content: 'Terima kasih kepada rombongan mahasiswa yang telah membagikan 50 paket alat tulis untuk anak-anak panti. Semoga studinya dilancarkan! 🎓✨',
      image: null,
    }
  ]);

  // Fungsi untuk Like Postingan
  const toggleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { 
          ...post, 
          isLiked: !post.isLiked, 
          likes: post.isLiked ? post.likes - 1 : post.likes + 1 
        };
      }
      return post;
    }));
  };

  const volunteerActivities = [
    { id: 1, title: "Kelas Inspirasi & Belajar Matematika Dasar", date: "Sabtu, 18 Jul 2026", time: "15:00 - 17:00", quota: 5, filled: 3, status: "open", desc: "Mengajarkan dasar matematika untuk anak SD kelas 1-3." },
    { id: 2, title: "Kerja Bakti Bersih-Bersih Area Asrama", date: "Minggu, 19 Jul 2026", time: "08:00 - 11:00", quota: 10, filled: 10, status: "full", desc: "Membersihkan halaman, mengecat ulang pagar, dan merapikan gudang." },
    { id: 3, title: "Workshop Melukis & Kerajinan Tangan", date: "Sabtu, 25 Jul 2026", time: "10:00 - 12:00", quota: 3, filled: 1, status: "open", desc: "Mengajak anak-anak berkreasi dengan cat air dan barang bekas." },
  ];

  const dummyPengurus = [
    { id: 1, nama: "H. Ahmad Fauzi", jabatan: "Ketua Yayasan", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop" },
    { id: 2, nama: "Hj. Siti Aminah", jabatan: "Bendahara & Operasional", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop" },
    { id: 3, nama: "Budi Santoso, S.Pd", jabatan: "Koordinator Pendidikan", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" },
    { id: 4, nama: "Rini Wulandari", jabatan: "Humas & Kemitraan", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" },
  ];

  // Cek status apakah user sudah login atau belum
  const isLoggedIn = !!auth?.user;

  return (
    <div className={`font-sans bg-[#F4F3EF] text-[#124354] ${isLoggedIn ? "flex h-screen overflow-hidden" : "flex flex-col h-screen overflow-hidden"}`}>
      

      {/* LAYER PEMBUNGKUS UTAMA */}
      <div className={`flex flex-1 min-w-0 overflow-hidden relative ${!isLoggedIn ? "flex-col" : ""}`}>

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-white">

        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto relative bg-gray-50/30 scroll-smooth">
            <Head title={`Profil Panti - ${panti?.nama_yayasan || panti?.nama}`} />

                <div className="sticky top-0 z-30 bg-[#083A4F] text-white px-4 h-16 flex items-center gap-4 shadow-md">
                    <Link 
                        href={route('profil-panti')}  
                        className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                        >
                        <ArrowLeft size={18} className="text-white" />
                    </Link>
                    <div onClick={scrollToTop} className="cursor-pointer flex-1 py-1">
                        <h2 className="font-bold text-[16px] leading-tight">{panti?.nama_yayasan || panti?.nama || 'Yayasan Kasih Ibu'}</h2>
                        <p className="text-[12px] text-[#C0D5D6]">{posts.length} Postingan • {panti?.jumlah_anak || 45} Anak Asuh</p>
                    </div>
                    <button 
                        onClick={() => alert('Laporkan Akun Panti Ini')} 
                        className="p-1.5 ml-1 rounded-full transition-colors border border-white"
                    >
                        <Flag size={16} />
                    </button>
                </div>

            <div className="max-w-7xl mx-auto bg-white min-h-screen shadow-sm">
              
              <div className="relative">
                {/* Cover Image */}
                <div className="h-40 md:h-60 w-full relative overflow-hidden" style={{backgroundColor: COLORS.teal}}>
                  
                  {/* Gambar hanya akan dirender JIKA panti memiliki foto_banner atau cover dari database */}
                  {(panti?.foto_banner || panti?.cover) && (
                    <img src={panti.foto_banner || panti.cover} alt="Cover" className="w-full h-full object-cover" />
                  )}
                  
                </div>
                
                <div className="px-5 md:px-8 pb-4">
                  <div className="flex justify-between items-start">
                    <div className="-mt-14 md:-mt-20 w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center border-4 border-white shadow-sm bg-[#083A4F] text-white font-black text-5xl overflow-hidden relative z-10">
                      {panti?.logo_url || panti?.foto ? (
                        <img src={panti.logo_url || panti.foto} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <span>{getInitials(panti?.nama_yayasan || panti?.nama || 'Yayasan')}</span>
                      )}
                    </div>
                    {/* BUTTON DONASI UANG */}
                    <div className="mt-4 mr-1 md:mr-4 flex gap-2 items-center">
                      <Link 
                        href={`/donasi/${panti?.id_shelter || panti?.id || 1}`} 
                        className="px-5 py-2 md:px-6 md:py-2.5 hover:bg-[#2b5660] text-white rounded-full font-bold shadow-md transition-colors flex items-center gap-2 text-sm md:text-base"
                        style={{backgroundColor: COLORS.navy}}
                      >
                        <Wallet size={18} /> Donasi Tunai
                      </Link>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h1 className="text-xl md:text-2xl font-black text-[#124354] flex items-center gap-1.5">
                      {panti?.nama_yayasan || panti?.nama || 'Yayasan Kasih Ibu'} 
                      <CheckCircle2 size={18} className="text-blue-500 fill-blue-50" />
                    </h1>
                    <p className="text-gray-500 text-sm">@{panti?.username || 'panti_resmi'}</p>
                  </div>

                  <div className="mt-3 text-[15px] text-gray-700 leading-relaxed max-w-4xl whitespace-pre-line">
                    {panti?.deskripsi || `Panti Asuhan berdedikasi memberikan tempat tinggal dan pendidikan bagi anak-anak yatim piatu. Bersama membangun generasi mandiri dan berakhlak mulia untuk menyongsong masa depan yang cerah.`}
                  </div>

                  {/* DOKUMEN RESMI (BADGES) */}
                  <div className="mt-3 flex flex-wrap gap-3 mb-2">
                     <button 
                       onClick={() => alert(`Membuka PDF Akta Pendirian: ${panti?.no_akta || 'No. 12 / 04 Agustus 2010'}`)} 
                       className="flex items-center gap-2 px-3.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-[#407E8C] hover:text-white hover:border-[#407E8C] transition-colors"
                     >
                        <FileText size={14} /> Akta Pendirian
                     </button>
                     <button 
                       onClick={() => alert(`Membuka PDF SK Kemenkumham: ${panti?.no_sk || 'AHU-12345.AH.01.04.Tahun 2010'}`)} 
                       className="flex items-center gap-2 px-3.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-[#407E8C] hover:text-white hover:border-[#407E8C] transition-colors"
                     >
                        <FileText size={14} /> SK Kemenkumham
                     </button>
                     <button 
                       onClick={() => alert('Membuka PDF Tanda Daftar (TDY)')} 
                       className="flex items-center gap-2 px-3.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-[#407E8C] hover:text-white hover:border-[#407E8C] transition-colors"
                     >
                        <FileText size={14} /> Tanda Daftar Yayasan
                     </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[14px] font-medium text-gray-500">
                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#407E8C]" /> {panti?.alamat || panti?.lokasi || 'Kota Bandung, Jawa Barat'}</span>
                    <span className="flex items-center gap-1.5"><Globe size={14} className="text-[#407E8C]" /> <a href="#" className="text-blue-500 hover:underline">{panti?.website || 'linktr.ee/panti'}</a></span>
                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#407E8C]" /> Berdiri {panti?.tahun_berdiri || '2010'}</span>
                  </div>
                </div>
              </div>

              {/* TAB NAVIGATION */}
              <div className="flex overflow-x-auto no-scrollbar border-y border-gray-200 gap-36 sticky top-16 z-30 bg-white/95 backdrop-blur-md px-2 justify-start sm:justify-center">
                {profileTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveProfileTab(tab.id)}
                    className={`relative px-4 md:px-5 py-3.5 text-[13px] md:text-[14px] font-bold whitespace-nowrap transition-colors hover:bg-gray-50 ${
                      activeProfileTab === tab.id ? 'text-[#124354]' : 'text-gray-500'
                    }`}
                  >
                    {tab.label}
                    {activeProfileTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#407E8C] rounded-t-full" />}
                  </button>
                ))}
              </div>

              <div className="min-h-[50vh] bg-white pb-20">
                
                {/* TAB 1: POSTINGAN */}
                {activeProfileTab === 'postingan' && (
                  <div className="divide-y divide-gray-100 w-full">
                    {posts.map((post) => (
                      <div key={post.id} className="p-4 md:p-6 hover:bg-gray-50 transition cursor-default">
                        <div className="max-w-4xl mx-auto flex gap-3 md:gap-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#083A4F] shrink-0 text-white flex items-center justify-center font-bold text-sm md:text-base">
                            {getInitials(panti?.nama_yayasan || panti?.nama || 'Yayasan')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <div className="flex items-center gap-1.5 flex-wrap pr-2">
                                <span className="font-bold text-sm md:text-base truncate">{panti?.nama_yayasan || panti?.nama || 'Yayasan Kasih Ibu'}</span>
                                <CheckCircle2 size={14} className="text-blue-500 fill-blue-50 shrink-0" />
                                <span className="text-gray-500 text-xs md:text-sm truncate">@panti_resmi · {post.time}</span>
                              </div>
                              
                              {/* TOMBOL LIKE DAN REPORT POSTINGAN */}
                              <div className="flex items-center gap-1 shrink-0">
                                <button 
                                  onClick={() => toggleLike(post.id)}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all shadow-sm ${
                                    post.isLiked 
                                      ? 'bg-red-50 border-red-200 text-red-500' 
                                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-red-500 hover:border-red-200'
                                  }`}
                                >
                                  <Heart size={14} className={post.isLiked ? 'fill-red-500' : ''} />
                                  {post.likes}
                                </button>
                                <button 
                                  onClick={() => alert(`Laporkan Postingan #${post.id}`)}
                                  className="p-1.5 ml-1 text-red-500 bg-red-50 rounded-full transition-colors border border-red-200"
                                  title="Laporkan Postingan"
                                >
                                  <Flag size={14} />
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
                )}

                {/* TAB 2: KEBUTUHAN BARANG */}
                {activeProfileTab === 'kebutuhan' && (
                  <div className="p-5 md:p-8 max-w-6xl mx-auto">
                    <h3 className="text-lg font-black mb-5 flex items-center gap-2 text-[#124354]"><Package size={20} className="text-[#407E8C]" /> Target Kebutuhan Barang</h3>
                    {needs && needs.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {needs.map((need, idx) => {
                          const target = need.jumlah || 0;
                          const terkumpul = need.terkumpul || 0;
                          const sisa = Math.max(target - terkumpul, 0);
                          const progress = target > 0 ? Math.min((terkumpul / target) * 100, 100) : 0;

                          return (
                            <div key={idx} className="border border-gray-200 rounded-xl p-5 bg-white hover:border-[#407E8C] transition-all flex flex-col justify-between shadow-sm">
                              <div>
                                <div className="flex justify-between items-start gap-2 mb-2">
                                  <h4 className="font-extrabold text-[15px] text-[#124354] leading-tight">
                                    {need.nama_barang || need.nama_kebutuhan || need.barang || need.item || need.nama || 'Item Kebutuhan'}
                                  </h4>
                                  <span className="text-[10px] bg-orange-50 text-orange-700 border border-orange-200 font-extrabold px-2 py-0.5 rounded shrink-0">
                                    Sisa {sisa} {need.satuan || 'pcs'}
                                  </span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-4 mb-1.5">
                                  <div className="h-full bg-[#407E8C] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                                </div>
                                <div className="flex justify-between text-[11px] text-gray-500 font-medium">
                                  <span>Terkumpul: {terkumpul}</span>
                                  <span>Target: {target}</span>
                                </div>
                              </div>
                              <button 
                                type="button" 
                                onClick={() => {
                                  setSelectedNeed(need);
                                  formBarang.setData({ id_need: need.id, jumlah_donasi: '', metode_pengiriman: 'antar_sendiri', catatan: '' });
                                  setIsNeedModalOpen(true);
                                }}
                                className="w-full mt-5 py-2.5 bg-gray-50 hover:bg-[#407E8C] text-[#407E8C] hover:text-white border border-gray-200 hover:border-[#407E8C] rounded-lg text-xs font-bold transition-all"
                              >
                                Donasi Barang Ini
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500 text-sm">
                        Belum ada daftar kebutuhan barang mendesak saat ini.
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: VOLUNTEER (Dikomenn/Disembunyikan Sementara) */}
                {/* {activeProfileTab === 'volunteer' && (
                  ...
                )} */}

                {/* TAB 4: KONTAK & PENGURUS (Digabung) */}
                {activeProfileTab === 'kontak' && (
                  <div className="p-5 md:p-8 max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Info Kontak & Map */}
                      <div className="space-y-6">
                         <h3 className="text-lg font-black text-[#124354] flex items-center gap-2">
                           <Map size={20} className="text-[#407E8C]" /> Lokasi & Kontak
                         </h3>
                         
                         <div className="aspect-video w-full bg-gray-200 rounded-2xl overflow-hidden border border-gray-200 relative">
                           <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-60" alt="Map" />
                           <div className="absolute inset-0 flex items-center justify-center">
                              <span className="bg-white/90 px-4 py-2 rounded-full text-xs font-bold shadow flex items-center gap-2"><MapPin size={14} className="text-red-500" /> Lihat di Google Maps</span>
                           </div>
                         </div>

                         <div className="space-y-4">
                            <div className="flex gap-3 items-start">
                               <div className="p-2 bg-gray-50 rounded-lg shrink-0 border border-gray-200"><MapPin size={16} className="text-[#124354]" /></div>
                               <div>
                                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Alamat Lengkap</p>
                                  <p className="text-sm font-medium text-[#124354] leading-relaxed">{panti?.alamat || 'Jl. Kasih Ibu No. 123, Kel. Sukaasih, Kec. Bojongloa Kaler, Kota Bandung, Jawa Barat 40231'}</p>
                               </div>
                            </div>
                            <div className="flex gap-3 items-start">
                               <div className="p-2 bg-gray-50 rounded-lg shrink-0 border border-gray-200"><Phone size={16} className="text-[#124354]" /></div>
                               <div>
                                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Telepon / WhatsApp</p>
                                  <p className="text-sm font-medium text-[#124354]">0812-3456-7890</p>
                               </div>
                            </div>
                            <div className="flex gap-3 items-start">
                               <div className="p-2 bg-gray-50 rounded-lg shrink-0 border border-gray-200"><Mail size={16} className="text-[#124354]" /></div>
                               <div>
                                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Email Yayasan</p>
                                  <p className="text-sm font-medium text-[#124354]">halo@yayasankasihibu.or.id</p>
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* Info Pengurus Panti (Menggantikan Form Kirim Pesan) */}
                      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 h-fit self-start">
                        <h3 className="text-lg font-black text-[#124354] mb-4 flex items-center gap-2">
                            <Briefcase size={18} className="text-[#A58D66]" /> Susunan Pengurus
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {dummyPengurus.map((p) => (
                                <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-3 text-center shadow-sm hover:border-[#407E8C] transition-colors">
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

                {/* TAB 5: AUDIT KEUANGAN */}
                {activeProfileTab === 'audit' && (
                  <div className="p-5 md:p-8 max-w-4xl mx-auto">
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                          <BarChart3 size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-base text-[#124354]">Laporan Transparansi Q3 2026</h4>
                          <p className="text-xs text-gray-500 mt-0.5">Dipublikasi otomatis pada 1 Okt 2026</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
                        <button className="w-full sm:w-auto text-xs font-bold text-[#124354] border border-gray-200 bg-gray-50 px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-1.5">
                          Lihat Rincian Data <ChevronRight size={14} />
                        </button>
                        {/* TOMBOL REPORT LAPORAN KEUANGAN */}
                        <button 
                          onClick={() => alert('Laporkan Laporan Keuangan ini jika Anda menemukan kejanggalan.')}
                          className="w-full sm:w-auto text-xs font-bold text-red-500 border border-red-100 bg-red-50 px-4 py-2.5 rounded-lg hover:bg-red-100 transition-all flex items-center justify-center gap-1.5"
                        >
                          <Flag size={14} /> Laporkan
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-4 flex items-center gap-1.5"><CheckCircle2 size={14} /> Sistem Transparansi: Audit diperbarui secara otomatis dari sistem keuangan KawanBerbagi setiap pergantian kuartal.</p>
                  </div>
                )}

              </div>
            </div>
          </div>
        </main>

        {/* ================= MODAL BOOKING BARANG ================= */}
        {isNeedModalOpen && selectedNeed && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#083A4F]/60 backdrop-blur-sm transition-opacity">
              <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-lg font-black text-[#124354] flex items-center gap-2"><Package size={20} className="text-[#407E8C]" /> Konfirmasi Donasi Barang</h3>
                    <button onClick={() => setIsNeedModalOpen(false)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-full">✕</button>
                </div>
                <div className="mb-5 p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl">
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Item yang dipilih</p>
                   <p className="text-sm font-black text-[#124354]">{selectedNeed.nama_barang || selectedNeed.nama || 'Item'}</p>
                </div>
                <form onSubmit={submitBookingBarang} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Berapa yang ingin didonasikan?</label>
                      <div className="flex items-center gap-3">
                         <input type="number" min="1" required value={formBarang.data.jumlah_donasi} onChange={e => formBarang.setData('jumlah_donasi', e.target.value)} className="flex-1 p-3 text-base font-bold rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#124354]" placeholder="Contoh: 10" />
                         <span className="text-sm font-bold text-gray-500 bg-gray-100 px-4 py-3 rounded-xl border border-gray-200">{selectedNeed.satuan || 'pcs'}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Catatan Tambahan (Opsional)</label>
                      <input type="text" value={formBarang.data.catatan} onChange={e => formBarang.setData('catatan', e.target.value)} className="w-full p-3 text-sm rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#124354]" placeholder="Contoh: Barang akan dikirim besok siang..." />
                    </div>
                    <div className="pt-3 flex gap-3">
                      <button type="button" onClick={() => setIsNeedModalOpen(false)} className="px-5 py-3 bg-white border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors">Batal</button>
                      <button type="submit" disabled={formBarang.processing} className="flex-1 py-3 bg-[#083A4F] text-white text-sm font-bold rounded-xl hover:bg-[#124354] transition-colors shadow-sm">Booking Slot Sekarang</button>
                    </div>
                </form>
              </div>
          </div>
        )}

      </div>
    </div>
  );
}