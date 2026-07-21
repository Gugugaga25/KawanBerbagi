import React, { useState, useRef } from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { 
  MapPin, Users, ArrowLeft, Wallet, Package, Menu, Globe, 
  Calendar, FileText, CheckCircle2, MessageCircle, 
  Repeat2, Heart, Share, BarChart3, Users2, ExternalLink,
  Clock, CalendarDays, ChevronRight, Phone, Mail, Map, Briefcase, User, Send,
  X, Minus, Plus, Truck, Home, ShieldCheck, Flag, Trash2, AlertTriangle
} from 'lucide-react';

import DonaturSidebar, { DonaturTabType } from '@/Components/Donatur/DonaturSidebar';
import DonaturHeader from '@/Components/Donatur/DonaturHeader';

const COLORS = {
  navy: "#293681",
  gold: "#F59E0B",
  mist: "#D0E7E6",
  teal: "#4274D9",
  cream: "#F8FAFC",
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
                className="text-base font-semibold px-5 py-2.5 rounded-full text-white hover:brightness-110 transition shadow-sm"
                style={{ backgroundColor: COLORS.teal }}>
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

  // Hak Akses
  const isPantiOwner = !!auth?.user && auth?.user?.id_role_user === 'RL02PAN';
  
  // States untuk Modals Barang
  const [selectedNeed, setSelectedNeed] = useState<any>(null);
  const [isNeedModalOpen, setIsNeedModalOpen] = useState(false);

  // States untuk Modal Pelaporan
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ id: string | number, type: 'panti' | 'postingan' | 'keuangan', title: string } | null>(null);

  // Formulir Barang
  const formBarang = useForm({
    id_needs: '',
    jumlah_donasi: 1,
    metode_pengiriman: '' as 'ekspedisi' | 'mandiri' | 'jemput' | '',
    kurir: 'JNE',
    resi: '',
    pesan: '',
    konfirmasi_langsung: false,
  });

  // Formulir Laporan
  const formReport = useForm({
    tipe_laporan: '',
    id_target: '',
    judul_target: '',
    alasan: '',
    catatan_tambahan: ''
  });

  const adjustAmount = (delta: number) => {
    if (!selectedNeed) return;
    const maxVal = selectedNeed.remaining !== undefined ? selectedNeed.remaining : Math.max(0, selectedNeed.jumlah - selectedNeed.terkumpul);
    formBarang.setData('jumlah_donasi', Math.min(maxVal, Math.max(1, formBarang.data.jumlah_donasi + delta)));
  };

  const submitBookingBarang = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBarang.data.metode_pengiriman) return;
    formBarang.post(route('donatur.donasi.store'), {
      onSuccess: () => {
        setIsNeedModalOpen(false);
        formBarang.reset();
      }
    });
  };

  const submitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTarget) return;

    formReport.post(route('laporan.store'), {
      preserveScroll: true,
      onSuccess: () => {
        alert('Laporan berhasil dikirim dan akan direview oleh Admin.');
        setIsReportModalOpen(false);
        formReport.reset();
      }
    });
  };

  const openReportModal = (type: 'panti' | 'postingan' | 'keuangan', id: string | number, title: string) => {
    if (!auth?.user) {
      window.location.href = '/login';
      return;
    }
    setReportTarget({ type, id, title });
    formReport.setData({
      ...formReport.data,
      tipe_laporan: type,
      id_target: id.toString(),
      judul_target: title
    });
    setIsReportModalOpen(true);
  };

  // Fungsi Hapus Foto
  const handleDeleteCover = () => {
    if(confirm('Apakah Anda yakin ingin menghapus foto sampul?')) {
      alert('Foto sampul berhasil dihapus (Simulasi router.delete)');
    }
  };

  const handleDeleteProfilePhoto = () => {
    if(confirm('Apakah Anda yakin ingin menghapus foto profil?')) {
      alert('Foto profil berhasil dihapus (Simulasi router.delete)');
    }
  };

  const handleTabChange = (tab: DonaturTabType) => {
    setIsMobileMenuOpen(false);
    router.visit(tab === 'dashboard' ? route('donatur.dashboard') : `${route('donatur.dashboard')}?tab=${tab}`);
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getInitials = (name: string) => name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'Y';

  const profileTabs = [
    { id: 'postingan', label: 'Postingan' },
    { id: 'kebutuhan', label: 'Kebutuhan Barang' },
    { id: 'kontak', label: 'Kontak & Pengurus' },
    { id: 'audit', label: 'Audit Keuangan' },
  ];

  const [posts, setPosts] = useState<any[]>([]);

  React.useEffect(() => {
    if (panti?.posts) {
      setPosts(panti.posts.map((p: any) => ({...p, isLiked: false, likes: p.likes || 0})));
    }
  }, [panti]);

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

  const pengurusList = panti?.pengurus || [];
  const auditList = panti?.laporan_audits || [];

  return (
    <div className="font-sans bg-[#F4F3EF] text-[#124354] min-h-screen flex flex-col">
      
      {/* TAMPILKAN HEADER NAV */}
      <Nav />

      {/* LAYER PEMBUNGKUS UTAMA */}
      <div className="flex-1 flex flex-col relative w-full">
        

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
                {!isPantiOwner && (
                  <button 
                      onClick={() => openReportModal('panti', panti?.id_shelter || 1, panti?.nama_yayasan || panti?.nama)} 
                      className="p-1.5 ml-1 rounded-full hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors border border-white"
                      title="Laporkan Akun Panti Ini"
                  >
                      <Flag size={16} />
                  </button>
                )}
            </div>

            <div className="max-w-7xl mx-auto bg-white min-h-screen shadow-sm">
              
              <div className="relative">
                {/* Cover Image */}
                <div className="h-40 md:h-60 w-full relative overflow-hidden group" style={{backgroundColor: COLORS.teal}}>
                
                  {/* Gambar Cover dengan Opsi Hapus (Jika Panti Owner) */}
                  {(panti?.foto_banner || panti?.cover) && (
                      <>
                        <img src={panti.foto_banner ? '/storage/' + panti.foto_banner : panti.cover} alt="Cover" className="w-full h-full object-cover transition-all group-hover:brightness-90" />
                        {isPantiOwner && (
                          <button 
                            onClick={handleDeleteCover}
                            className="absolute top-4 right-4 bg-red-600/90 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700"
                            title="Hapus Foto Sampul"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </>
                  )}
                
                </div>
                
                <div className="px-5 md:px-8 pb-4">
                  <div className="flex justify-between items-start">
                    {/* Profil Image dengan Opsi Hapus */}
                    <div className="-mt-14 md:-mt-20 w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center border-4 border-white shadow-sm bg-[#083A4F] text-white font-black text-5xl overflow-hidden relative z-10 group">
                      {panti?.logo_url || panti?.foto || panti?.foto_profil ? (
                        <>
                          <img src={panti.foto_profil ? '/storage/' + panti.foto_profil : (panti.logo_url || panti.foto)} alt="Logo" className="w-full h-full object-cover transition-all group-hover:brightness-75" />
                          {isPantiOwner && (
                            <button 
                              onClick={handleDeleteProfilePhoto}
                              className="absolute inset-0 m-auto w-10 h-10 bg-red-600 text-white flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:scale-105"
                              title="Hapus Foto Profil"
                            >
                              <Trash2 size={20} />
                            </button>
                          )}
                        </>
                      ) : (
                        <span>{getInitials(panti?.nama_yayasan || panti?.nama || 'Yayasan')}</span>
                      )}
                    </div>

                    {/* BUTTON DONASI UANG & CHAT */}
                    <div className="mt-4 mr-1 md:mr-4 flex gap-2 items-center">
                    {(!auth?.user || auth?.user?.id_role_user === 'RL03DON') && (
                      <Link 
                      href={route('donatur.chat.init', panti?.id_shelter)} 
                      className="px-5 py-2 md:px-6 md:py-2.5 text-white rounded-full font-bold shadow-md transition-all flex items-center gap-2 text-sm md:text-base"
                      style={{ backgroundColor: '#407E8C' }}
                      >
                      <MessageCircle size={18} /> Hubungi Panti
                      </Link>
                    )}
                    <Link 
                    href={`/donatur/donasi-uang/${panti?.id_shelter}`} 
                    className="px-5 py-2 md:px-6 md:py-2.5 hover:bg-[#2b5660] text-white rounded-full font-bold shadow-md transition-colors flex items-center gap-2 text-sm md:text-base"
                    style={{ backgroundColor: '#083A4F' }}
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
                    <p className="text-gray-500 text-sm">@{panti?.username || panti?.user?.name || 'panti_resmi'}</p>
                  </div>

                  <div className="mt-3 text-[15px] text-gray-700 leading-relaxed max-w-4xl whitespace-pre-line">
                    {panti?.deskripsi || 'Panti asuhan ini belum menambahkan deskripsi profil mereka.'}
                  </div>

                  {/* DOKUMEN RESMI (BADGES) */}
                  <div className="mt-3 flex flex-wrap gap-3 mb-2">
                     {panti?.akta_yayasan && (
                     <div 
                       className="flex items-center gap-2 px-3.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 cursor-default"
                     >
                        <FileText size={14} /> Akta Pendirian
                     </div>
                     )}
                     {panti?.sk_kemenkumham && (
                     <div 
                       className="flex items-center gap-2 px-3.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 cursor-default"
                     >
                        <FileText size={14} /> SK Kemenkumham
                     </div>
                     )}
                     {panti?.izin_operasional && (
                     <div 
                       className="flex items-center gap-2 px-3.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 cursor-default"
                     >
                        <FileText size={14} /> Tanda Daftar Yayasan
                     </div>
                     )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[14px] font-medium text-gray-500">
                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#407E8C]" /> {panti?.alamat || 'Alamat belum diatur'}</span>
                    {panti?.website && (
                      <span className="flex items-center gap-1.5"><Globe size={14} className="text-[#407E8C]" /> <a href={panti.website.startsWith('http') ? panti.website : `https://${panti.website}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{panti.website}</a></span>
                    )}
                    {panti?.tahun_berdiri && (
                      <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#407E8C]" /> Berdiri {panti.tahun_berdiri}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* TAB NAVIGATION */}
              <div className="flex overflow-x-auto no-scrollbar border-y border-gray-200 gap-28 sticky top-16 z-30 bg-white/95 backdrop-blur-md px-2 justify-start sm:justify-center">
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
                    {posts.length > 0 ? posts.map((post) => (
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
                                <span className="text-gray-500 text-xs md:text-sm truncate">@{panti?.user?.name || 'panti_resmi'} · {new Date(post.time || Date.now()).toLocaleDateString()}</span>
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
                                {!isPantiOwner && (
                                  <button 
                                    onClick={() => openReportModal('postingan', panti?.id_shelter || 1, `Postingan #${post.id}`)}
                                    className="p-1.5 ml-1 text-red-500 bg-red-50 hover:bg-red-100 rounded-full transition-colors border border-red-200"
                                    title="Laporkan Postingan"
                                  >
                                    <Flag size={14} />
                                  </button>
                                )}
                              </div>
                            </div>
                            <p className="text-sm mt-1 text-gray-800 leading-relaxed whitespace-pre-line">
                              {post.content}
                            </p>
                            {post.image && (
                              <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 aspect-video max-w-xl bg-gray-100">
                                <img src={'/storage/' + post.image} className="w-full h-full object-cover" alt="Post" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500 text-sm m-4">
                        Belum ada aktivitas postingan dari panti ini.
                      </div>
                    )}
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
                                  formBarang.setData({
                                    id_needs: need.id_needs.toString(),
                                    jumlah_donasi: 1,
                                    metode_pengiriman: 'ekspedisi',
                                    kurir: 'JNE',
                                    resi: '',
                                    pesan: '',
                                    konfirmasi_langsung: false,
                                  });
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
                                  <p className="text-sm font-medium text-[#124354] leading-relaxed">{panti?.alamat || '-'}</p>
                               </div>
                            </div>
                            <div className="flex gap-3 items-start">
                               <div className="p-2 bg-gray-50 rounded-lg shrink-0 border border-gray-200"><Phone size={16} className="text-[#124354]" /></div>
                               <div>
                                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Telepon / WhatsApp</p>
                                  <p className="text-sm font-medium text-[#124354]">{panti?.no_telepon || '-'}</p>
                               </div>
                            </div>
                            <div className="flex gap-3 items-start">
                               <div className="p-2 bg-gray-50 rounded-lg shrink-0 border border-gray-200"><Mail size={16} className="text-[#124354]" /></div>
                               <div>
                                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Email Yayasan</p>
                                  <p className="text-sm font-medium text-[#124354]">{panti?.user?.email || '-'}</p>
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* Info Pengurus Panti */}
                      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 h-fit self-start">
                        <h3 className="text-lg font-black text-[#124354] mb-4 flex items-center gap-2">
                            <Briefcase size={18} className="text-[#A58D66]" /> Susunan Pengurus
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {pengurusList.length > 0 ? pengurusList.map((p: any) => (
                                <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-3 text-center shadow-sm hover:border-[#407E8C] transition-colors">
                                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto rounded-full overflow-hidden mb-2 border-2 border-gray-100 bg-gray-50">
                                    {p.image ? (
                                      <img src={'/storage/' + p.image} alt={p.nama} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-400"><Briefcase size={20}/></div>
                                    )}
                                </div>
                                <h4 className="font-bold text-[12px] md:text-xs text-[#124354] mb-0.5">{p.nama}</h4>
                                <p className="text-[10px] text-gray-500 font-medium">{p.jabatan}</p>
                                </div>
                            )) : (
                                <div className="col-span-2 text-center text-sm text-gray-500 py-4">Belum ada data pengurus.</div>
                            )}
                        </div>
                        </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: AUDIT KEUANGAN */}
                {activeProfileTab === 'audit' && (
                  <div className="p-5 md:p-8 max-w-4xl mx-auto">
                    {auditList.length > 0 ? auditList.map((audit: any) => (
                      <div key={audit.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
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
                          <a href={'/storage/' + audit.file_pdf} target="_blank" rel="noreferrer" className="w-full sm:w-auto text-xs font-bold text-[#124354] border border-gray-200 bg-gray-50 px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-1.5">
                            Lihat Dokumen <ChevronRight size={14} />
                          </a>
                          {/* TOMBOL REPORT LAPORAN KEUANGAN */}
                          {!isPantiOwner && (
                            <button 
                              onClick={() => openReportModal('keuangan', panti?.id_shelter || 1, audit.judul)}
                              className="w-full sm:w-auto text-xs font-bold text-red-500 border border-red-100 bg-red-50 px-4 py-2.5 rounded-lg hover:bg-red-100 transition-all flex items-center justify-center gap-1.5"
                            >
                              <Flag size={14} /> Laporkan
                            </button>
                          )}
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500 text-sm">
                        Belum ada laporan audit keuangan.
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-4 flex items-center gap-1.5"><CheckCircle2 size={14} /> Sistem Transparansi: Audit diperbarui oleh panti secara berkala untuk transparansi donasi.</p>
                  </div>
                )}

              </div>
            </div>
          </div>

        {/* ================= MODAL REPORT / LAPORAN (BARU) ================= */}
        {isReportModalOpen && reportTarget && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[#083A4F]/60 backdrop-blur-xs transition-opacity">
            <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl flex flex-col">
              {/* Header Modal */}
              <div className="flex justify-between items-center mb-5 shrink-0">
                <h3 className="text-lg font-black text-red-600 flex items-center gap-2">
                  <AlertTriangle size={20} /> Laporkan {reportTarget.type === 'panti' ? 'Panti' : reportTarget.type === 'postingan' ? 'Postingan' : 'Dokumen Keuangan'}
                </h3>
                <button onClick={() => setIsReportModalOpen(false)} className="p-2 text-gray-400 hover:text-[#124354] bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={submitReport} className="space-y-4">
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm font-medium text-red-800">
                  Anda akan melaporkan: <br/>
                  <strong>{reportTarget.title}</strong>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Alasan Laporan</label>
                  <select
                    required
                    value={formReport.data.alasan}
                    onChange={(e) => formReport.setData('alasan', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-sm font-medium outline-none border border-gray-200 focus:border-red-500 text-[#083A4F]"
                  >
                    <option value="">-- Pilih Alasan Utama --</option>
                    <option value="spam">Spam atau Iklan Tidak Relevan</option>
                    <option value="penipuan">Indikasi Penipuan / Fiktif</option>
                    <option value="konten_tidak_pantas">Konten Tidak Pantas / Kekerasan</option>
                    <option value="informasi_palsu">Informasi Palsu / Bukti Palsu</option>
                    <option value="lainnya">Lainnya...</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Catatan Tambahan (Opsional)</label>
                  <textarea
                    value={formReport.data.catatan_tambahan}
                    onChange={(e) => formReport.setData('catatan_tambahan', e.target.value)}
                    placeholder="Jelaskan secara singkat kronologi atau kecurigaan Anda..."
                    className="w-full p-3 text-sm rounded-xl border border-gray-200 focus:border-red-500 outline-none h-24 resize-none text-[#083A4F] font-medium"
                  />
                </div>

                <div className="pt-3 flex gap-3 mt-4 border-t border-gray-50">
                  <button 
                    type="button" 
                    onClick={() => setIsReportModalOpen(false)} 
                    className="px-5 py-2.5 bg-white border border-gray-200 text-gray-500 text-xs font-extrabold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    disabled={!formReport.data.alasan}
                    className="flex-1 py-2.5 bg-red-600 text-white text-xs font-extrabold rounded-xl hover:bg-red-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    <Flag size={14} /> Kirim Aduan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= MODAL BOOKING BARANG ================= */}
        {isNeedModalOpen && selectedNeed && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#083A4F]/60 backdrop-blur-xs transition-opacity">
            <div className="bg-white rounded-[2rem] p-6 md:p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center mb-5 shrink-0">
                <h3 className="text-lg font-black text-[#124354] flex items-center gap-2">
                  <Package size={20} className="text-[#407E8C]" /> Donasi Sekarang
                </h3>
                <button onClick={() => setIsNeedModalOpen(false)} className="p-2 text-gray-400 hover:text-[#124354] bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={submitBookingBarang} className="space-y-5 flex-1">
                {/* Info Campaign */}
                <div className="rounded-2xl p-4 bg-[#F4F3EF] border border-gray-200">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[#C0D5D6]">
                      <Package size={20} color="#407E8C" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#124354]">{selectedNeed.nama_barang || selectedNeed.nama || 'Item'}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {selectedNeed.kategori} · {panti.nama_yayasan}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs mb-2 font-semibold text-[#124354]/70">
                    <span>Terpenuhi</span>
                    <span>{selectedNeed.terkumpul}/{selectedNeed.jumlah} {selectedNeed.satuan}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden bg-[#C0D5D6]">
                    <div 
                      className="h-full rounded-full bg-[#407E8C]" 
                      style={{ width: `${(selectedNeed.terkumpul / selectedNeed.jumlah) * 100}%` }} 
                    />
                  </div>
                  <p className="text-[11px] mt-2 text-[#124354]/60 font-semibold">
                    Sisa kuota tersedia: <strong>{selectedNeed.remaining !== undefined ? selectedNeed.remaining : (selectedNeed.jumlah - selectedNeed.terkumpul)} {selectedNeed.satuan}</strong>
                  </p>
                </div>

                {/* Jumlah Donasi */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                    Berapa banyak yang ingin Anda donasikan?
                  </h4>
                  <div className="flex items-center justify-center gap-5 py-2">
                    <button
                      type="button"
                      onClick={() => adjustAmount(-1)}
                      disabled={formBarang.data.jumlah_donasi <= 1}
                      className="w-10 h-10 rounded-full flex items-center justify-center border transition disabled:opacity-30 border-[#C0D5D6] text-[#083A4F]"
                    >
                      <Minus size={16} />
                    </button>
                    <div className="text-center min-w-[80px]">
                      <p className="text-2xl font-bold tabular-nums text-[#083A4F]">{formBarang.data.jumlah_donasi}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{selectedNeed.satuan}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => adjustAmount(1)}
                      disabled={formBarang.data.jumlah_donasi >= (selectedNeed.remaining !== undefined ? selectedNeed.remaining : (selectedNeed.jumlah - selectedNeed.terkumpul))}
                      className="w-10 h-10 rounded-full flex items-center justify-center border transition disabled:opacity-30 border-[#C0D5D6] text-[#083A4F]"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  {formBarang.errors.jumlah_donasi && (
                    <p className="text-xs text-red-500 mt-1 text-center">{formBarang.errors.jumlah_donasi}</p>
                  )}
                </div>

                {/* Catatan / Pesan */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Catatan untuk Panti (Opsional)
                  </h4>
                  <textarea
                    value={formBarang.data.pesan}
                    onChange={(e) => formBarang.setData('pesan', e.target.value)}
                    placeholder="Tulis pesan atau info tambahan mengenai barang donasi Anda..."
                    className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:border-[#407E8C] outline-none h-20 resize-none text-[#083A4F] font-semibold"
                  />
                  {formBarang.errors.pesan && (
                    <p className="text-xs text-red-500 mt-1">{formBarang.errors.pesan}</p>
                  )}
                </div>

                {/* Metode Pengiriman */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                    Metode Pengiriman
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        formBarang.setData(prev => ({
                          ...prev,
                          metode_pengiriman: 'ekspedisi',
                          kurir: 'JNE',
                          resi: '',
                          konfirmasi_langsung: false
                        }));
                      }}
                      className="text-left p-3 rounded-xl border-2 transition flex flex-col justify-between h-full"
                      style={{
                        borderColor: formBarang.data.metode_pengiriman === 'ekspedisi' ? '#407E8C' : '#C0D5D6',
                        backgroundColor: formBarang.data.metode_pengiriman === 'ekspedisi' ? 'rgba(64,126,140,0.06)' : '#ffffff',
                      }}
                    >
                      <Truck size={18} color={formBarang.data.metode_pengiriman === 'ekspedisi' ? '#407E8C' : '#083A4F'} className="mb-2" />
                      <p className="text-[10px] font-extrabold text-[#083A4F]">Kirim Ekspedisi</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        formBarang.setData(prev => ({
                          ...prev,
                          metode_pengiriman: 'mandiri',
                          kurir: 'Antar Mandiri',
                          resi: '',
                          konfirmasi_langsung: false
                        }));
                      }}
                      className="text-left p-3 rounded-xl border-2 transition flex flex-col justify-between h-full"
                      style={{
                        borderColor: formBarang.data.metode_pengiriman === 'mandiri' ? '#407E8C' : '#C0D5D6',
                        backgroundColor: formBarang.data.metode_pengiriman === 'mandiri' ? 'rgba(64,126,140,0.06)' : '#ffffff',
                      }}
                    >
                      <Home size={18} color={formBarang.data.metode_pengiriman === 'mandiri' ? '#407E8C' : '#083A4F'} className="mb-2" />
                      <p className="text-[10px] font-extrabold text-[#083A4F]">Antar Mandiri</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        formBarang.setData(prev => ({
                          ...prev,
                          metode_pengiriman: 'jemput',
                          kurir: 'Jemput oleh Panti',
                          resi: '',
                          konfirmasi_langsung: false
                        }));
                      }}
                      className="text-left p-3 rounded-xl border-2 transition flex flex-col justify-between h-full"
                      style={{
                        borderColor: formBarang.data.metode_pengiriman === 'jemput' ? '#407E8C' : '#C0D5D6',
                        backgroundColor: formBarang.data.metode_pengiriman === 'jemput' ? 'rgba(64,126,140,0.06)' : '#ffffff',
                      }}
                    >
                      <Package size={18} color={formBarang.data.metode_pengiriman === 'jemput' ? '#407E8C' : '#083A4F'} className="mb-2" />
                      <p className="text-[10px] font-extrabold text-[#083A4F]">Jemput Panti</p>
                    </button>
                  </div>

                  {/* Sub-form Pengiriman */}
                  {formBarang.data.metode_pengiriman === 'ekspedisi' && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="flex gap-2 mb-2">
                        <select
                          value={formBarang.data.kurir}
                          onChange={(e) => formBarang.setData('kurir', e.target.value)}
                          className="px-3 py-2 rounded-lg text-xs font-bold outline-none border focus:border-[#407E8C] bg-white text-[#083A4F]"
                          style={{ borderColor: '#C0D5D6' }}
                        >
                          <option>JNE</option>
                          <option>SiCepat</option>
                          <option>J&T</option>
                          <option>AnterAja</option>
                          <option>Pos Indonesia</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Nomor resi (bisa dikosongkan dahulu)"
                          value={formBarang.data.resi}
                          onChange={(e) => formBarang.setData('resi', e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg text-xs font-bold outline-none border focus:border-[#407E8C] text-[#083A4F]"
                          style={{ borderColor: '#C0D5D6' }}
                        />
                      </div>
                      
                      <label className="flex items-center gap-2 cursor-pointer mt-1">
                        <input
                          type="checkbox"
                          checked={formBarang.data.konfirmasi_langsung}
                          onChange={(e) => formBarang.setData('konfirmasi_langsung', e.target.checked)}
                          className="rounded border-gray-300 text-[#407E8C] focus:ring-[#407E8C]"
                        />
                        <span className="text-[10px] font-extrabold text-[#083A4F]/85">
                          Barang sudah diserahkan ke ekspedisi sekarang
                        </span>
                      </label>
                      
                      <p className="text-[9px] mt-2 flex items-start gap-1 text-gray-400 font-semibold">
                        <Clock size={11} className="shrink-0 mt-0.5" /> 
                        Belum punya resinya? Jangan khawatir - Anda punya waktu 24 jam untuk melengkapinya dari menu Riwayat Donasi agar tidak batal otomatis.
                      </p>
                    </div>
                  )}

                  {formBarang.data.metode_pengiriman === 'mandiri' && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formBarang.data.konfirmasi_langsung}
                          onChange={(e) => formBarang.setData('konfirmasi_langsung', e.target.checked)}
                          className="rounded border-gray-300 text-[#407E8C] focus:ring-[#407E8C]"
                        />
                        <span className="text-[10px] font-extrabold text-[#083A4F]/85">
                          Barang sudah mulai saya antar ke lokasi panti sekarang
                        </span>
                      </label>
                      <p className="text-[9px] mt-2 flex items-start gap-1 text-gray-400 font-semibold">
                        <Clock size={11} className="shrink-0 mt-0.5" /> 
                        Jika Anda belum berangkat sekarang, lakukan konfirmasi jalan dalam waktu 24 jam atau kuota akan otomatis dilepas.
                      </p>
                    </div>
                  )}

                  {formBarang.data.metode_pengiriman === 'jemput' && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="rounded-xl p-3 bg-amber-50 border border-amber-100 flex items-start gap-2">
                        <Clock size={13} className="text-[#A58D66] shrink-0 mt-0.5" />
                        <p className="text-[9px] leading-normal text-amber-800 font-semibold">
                          Penjemputan memerlukan konfirmasi pihak panti. Panti memiliki waktu 24 jam untuk menyetujui request penjemputan ini sebelum booking otomatis dibatalkan.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Alamat Tujuan */}
                <div className="rounded-2xl p-4 bg-[#C0D5D6] text-[#083A4F]">
                  <div className="flex items-center gap-1.5 mb-2">
                    <MapPin size={14} color="#083A4F" />
                    <span className="text-[10px] font-black uppercase tracking-wider opacity-75">
                      Alamat Penerima
                    </span>
                  </div>
                  <p className="text-xs font-extrabold mb-1">{panti.nama_yayasan || panti.nama}</p>
                  <p className="text-[11px] leading-relaxed mb-2 opacity-85 font-medium">
                    {panti.alamat}
                  </p>
                  <p className="text-[10px] flex items-center gap-1 opacity-75 font-semibold">
                    <Phone size={10} /> {panti.no_telepon || panti.telepon || '-'}
                  </p>
                </div>

                {/* Ringkasan & Submit */}
                <div className="pt-3 flex gap-3 sticky bottom-0 bg-white py-2 border-t border-gray-50">
                  <button 
                    type="button" 
                    onClick={() => setIsNeedModalOpen(false)} 
                    className="px-5 py-3.5 bg-white border border-gray-200 text-gray-500 text-xs font-extrabold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    disabled={!formBarang.data.metode_pengiriman || formBarang.processing} 
                    className="flex-1 py-3.5 bg-[#083A4F] text-white text-xs font-extrabold rounded-xl hover:bg-[#124354] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck size={14} /> {formBarang.processing ? 'Memproses...' : 'Kunci Donasi Ini'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}