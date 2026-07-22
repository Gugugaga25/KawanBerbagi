import React, { useState, useMemo, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
  MapPin,
  Search,
  ShieldCheck,
  ArrowRight,
  X,
  Users,
  Building2,
  Lock,
  Menu,
} from "lucide-react";

const COLORS = {
  navy: "#293681",
  gold: "#F59E0B",
  mist: "#D0E7E6",
  teal: "#4274D9",
  cream: "#F8FAFC",
};

interface Shelter {
  id: number;
  nama: string;
  alamat: string;
  deskripsi: string;
  jumlah_anak: number;
  image: string;
  kebutuhan_mendesak: string[];
  terverifikasi: boolean;
}

// ================= KOMPONEN NAVIGASI =================
function Nav() {
  const [open, setOpen] = useState(false);
  const { auth } = usePage().props as any;
  const { url } = usePage(); 

  const links = [
    { label: "Cara Kerja", href: "/#cara-kerja" },
    { label: "Untuk Siapa", href: "/#untuk-siapa" },
    { label: "Fitur", href: "/#fitur" },
    { label: "Profil Panti", href: "/profil-panti" },
    { label: "Tentang Kami", href: "/about" },
  ];

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-100/80 transition-all duration-300 shadow-sm"
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
        <a href="/#top" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <img src="/images/logokb2.png" alt="Logo KawanBerbagi" className="w-8 h-8 object-contain" />
          <span className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: COLORS.navy }}>
            KawanBerbagi
            <span className="text-[#4274D9]">.</span>
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
                className={`text-base font-bold transition-all duration-200 relative pb-1 hover:text-[#4274D9] ${
                  isActive ? "" : "text-[#293681]/80"
                }`}
                style={{ color: isActive ? COLORS.teal : undefined }}
              >
                {l.label}
                {isActive && (
                  <span 
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" 
                    style={{ backgroundColor: COLORS.teal }}
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* === TOMBOL AUTH === */}
        <div className="hidden md:flex items-center gap-4">
          {auth?.user ? (
            <>
              <Link
                href={
                  auth.user.id_role_user === 'RL01ADM' ? route('admin.dashboard') :
                  auth.user.id_role_user === 'RL02PAN' ? route('panti.dashboard') :
                  route('donatur.dashboard')
                }
                className="text-sm font-bold text-[#293681] hover:text-[#4274D9] hover:underline transition-all"
              >
                Halo, {auth.user.name}
              </Link>
              <Link
                href={route("logout")}
                method="post"
                as="button"
                className="text-sm font-bold px-5 py-2.5 rounded-full text-white bg-[#293681] shadow-md shadow-[#293681]/10 hover:bg-[#1A2151] hover:shadow-lg transition-all duration-300"
              >
                Keluar
              </Link>
            </>
          ) : (
            <>
              <Link
                href={route("login")}
                className="text-base font-bold text-[#293681] hover:text-[#4274D9] transition-colors"
              >
                Masuk
              </Link>
              <Link
                href={route("register")}
                className="text-sm font-bold px-5 py-2.5 rounded-full text-white bg-[#4274D9] shadow-md shadow-[#4274D9]/20 hover:bg-[#293681] hover:shadow-lg transition-all duration-300"
              >
                Daftar
              </Link>
            </>
          )}
        </div>

        {/* === TOMBOL HAMBURGER MOBILE === */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-slate-100/50 transition-colors"
          style={{ color: COLORS.navy }}
          onClick={() => setOpen((o) => !o)}
          aria-label="Buka menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* === MENU MOBILE === */}
      {open && (
        <div
          className="md:hidden px-5 pb-6 flex flex-col gap-4 absolute w-full shadow-lg border-b border-slate-100 bg-white/95 backdrop-blur-md"
        >
          {links.map((l) => {
            const isActive = url === l.href || url.startsWith(l.href + '/');
            return (
              <a
                key={l.href}
                href={l.href}
                className={`text-base font-bold py-1.5 transition-colors ${
                  isActive ? "text-[#4274D9]" : "text-[#293681]"
                }`}
              >
                {l.label}
              </a>
            );
          })}
          <a
            href="/#mulai"
            className="text-center text-sm font-bold px-5 py-3.5 rounded-full text-white bg-[#4274D9] shadow-md shadow-[#4274D9]/20 hover:bg-[#293681] transition-all duration-300"
          >
            Mulai Donasi
          </a>
        </div>
      )}
    </header>
  );
}

// ================= KOMPONEN HALAMAN UTAMA =================
export default function ProfilPanti({ pantis = [] }: { pantis?: Shelter[] }) {
  const { auth } = usePage().props as any; 
  const [search, setSearch] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Filter data berdasarkan input pencarian
  const filteredShelters = useMemo(() => {
    return pantis.filter(
      (s) =>
        s.nama.toLowerCase().includes(search.toLowerCase()) ||
        (s.alamat && s.alamat.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, pantis]);

  // Handler aksi donasi / interaksi
  const handleDonationAction = (shelterId: number) => {
    if (!auth?.user) {
      setShowAuthModal(true);
    } else {
      // Mengarahkan langsung ke halaman detail panti agar donatur bisa berdonasi
      window.location.href = `/panti/${shelterId}`;
    }
  };

  const totalPages = Math.ceil(filteredShelters.length / itemsPerPage);

  const currentShelters = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredShelters.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredShelters, currentPage]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8FAFC]">
      
      <Nav />

      {/* Background decorations */}
      <div className="absolute top-48 left-0 -translate-x-1/2 w-96 h-96 rounded-full bg-[#4274D9]/5 blur-3xl pointer-events-none" />
      <div className="absolute top-96 right-0 translate-x-1/2 w-96 h-96 rounded-full bg-[#F59E0B]/5 blur-3xl pointer-events-none" />

      {/* ================= HERO SECTION ================= */}
      <section className="relative py-16 sm:py-20 text-center max-w-4xl mx-auto px-5 z-10" id="top">
        <span className="text-xs font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full bg-[#4274D9]/10 text-[#4274D9]">
          Arsip Transparansi
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold mt-4 mb-4 text-[#293681] tracking-tight">
          Profil & Portofolio Panti Mitra
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mx-auto text-gray-500 font-medium leading-relaxed">
          Telusuri profil panti asuhan yang telah terverifikasi secara resmi oleh tim kami. 
          Anda dapat memantau kuota kebutuhan riil mereka secara langsung.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mt-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#293681]/40" size={18} />
          <input
            type="text"
            placeholder="Cari nama panti atau lokasi kota..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl text-sm outline-none border border-slate-100 bg-white shadow-xl focus:border-[#4274D9] focus:shadow-2xl focus:shadow-[#4274D9]/10 transition-all duration-300"
            style={{ color: COLORS.navy }}
          />
        </div>
      </section>

      {/* ================= PORTFOLIO GRID ================= */}
      <main className="flex-1 max-w-7xl mx-auto px-5 sm:px-8 pb-24 w-full relative z-10">
        {filteredShelters.length > 0 ? (
          <div>
            <div className="grid md:grid-cols-2 gap-8">
              {currentShelters.map((shelter) => (
                <Link
                  key={shelter.id}
                  href={`/panti/${shelter.id}`} 
                  className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-xl hover:shadow-2xl hover:shadow-[#4274D9]/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col md:flex-row h-full cursor-pointer group relative"
                >
                  {/* Thumbnail Gambar */}
                  <div className="md:w-2/5 h-48 md:h-auto relative shrink-0 overflow-hidden bg-slate-100">
                    <img
                      src={shelter.image}
                      alt={shelter.nama}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {shelter.terverifikasi && (
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm border border-slate-100/50">
                        <ShieldCheck size={14} className="text-[#4274D9]" />
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#4274D9]">Terverifikasi</span>
                      </div>
                    )}
                  </div>

                  {/* Konten Profil */}
                  <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between bg-white">
                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold flex items-center gap-1.5 mb-1 text-[#293681] group-hover:text-[#4274D9] transition-colors">
                        {shelter.nama}
                      </h3>
                      <p className="text-xs font-semibold text-gray-400 flex items-center gap-1 mb-4">
                        <MapPin size={13} className="text-[#4274D9]" /> {shelter.alamat}
                      </p>
                      <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed font-medium line-clamp-3 mb-4">
                        {shelter.deskripsi}
                      </p>
 
                      {/* Kebutuhan Mendesak */}
                      <div className="mb-6">
                        <h4 className="text-[10px] font-extrabold uppercase tracking-wider mb-2 text-[#F59E0B]">Kebutuhan Mendesak:</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {shelter.kebutuhan_mendesak && shelter.kebutuhan_mendesak.length > 0 ? (
                            shelter.kebutuhan_mendesak.map((item, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] sm:text-xs px-2.5 py-1 rounded-lg font-bold bg-[#F59E0B]/10 text-[#F59E0B]"
                              >
                                {item}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] font-bold text-gray-400 italic">Tidak ada kebutuhan mendesak</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Tombol Interaksi */}
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                        <Users size={14} /> {shelter.jumlah_anak} Penerima Manfaat
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.preventDefault(); 
                          handleDonationAction(shelter.id);
                        }}
                        className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold px-5 py-2.5 rounded-full text-white bg-[#4274D9] shadow-md shadow-[#4274D9]/20 hover:bg-[#293681] hover:shadow-lg transition-all duration-300"
                      >
                        Bantu Penuhi <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* ================= PAGINATION CONTROL ================= */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white font-bold text-xs text-[#293681] hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Sebelumnya
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-xl font-bold text-xs transition-all duration-200 ${
                      currentPage === page
                        ? "bg-[#4274D9] text-white shadow-md shadow-[#4274D9]/20"
                        : "border border-slate-200 bg-white text-[#293681] hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white font-bold text-xs text-[#293681] hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Selanjutnya
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Empty State Pencarian */
          <div className="rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center bg-white border border-dashed border-slate-200 shadow-xl">
            <Building2 size={40} className="mb-4 text-[#293681]/30" />
            <h3 className="text-lg font-extrabold mb-1 text-[#293681]">Panti Tidak Ditemukan</h3>
            <p className="text-sm font-semibold text-gray-400">
              Tidak ada mitra panti di daerah "{search}" yang cocok dalam sistem kami saat ini.
            </p>
          </div>
        )}
      </main>

      {/* ================= RESTRICTED ACCESS MODAL ================= */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAuthModal(false)} />
          
          <div className="relative bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200 z-10 text-center border border-slate-100">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute right-5 top-5 p-1.5 rounded-full hover:bg-slate-50 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={20} />
            </button>

            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 bg-[#4274D9]/10 text-[#4274D9]">
              <Lock size={28} />
            </div>

            <h3 className="text-xl font-extrabold text-[#293681] mb-2.5">
              Aksi Terbatas!
            </h3>
            
            <p className="text-xs sm:text-sm leading-relaxed text-gray-500 font-medium mb-6">
              Anda harus masuk sebagai donatur terlebih dahulu untuk dapat mengunci kuota donasi, menginput resi kurir, dan memantau progres barang Anda sampai ke panti ini.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href={route("login")}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-[#4274D9] hover:bg-[#293681] transition-all shadow-md shadow-[#4274D9]/20 text-center"
              >
                Masuk ke Akun Saya
              </Link>
              <Link
                href={route("register")}
                className="w-full py-3.5 rounded-xl font-bold text-sm border-2 border-slate-100 hover:border-slate-200 transition-all text-[#293681] hover:bg-slate-50 text-center"
              >
                Belum Punya Akun? Daftar
              </Link>
            </div>
            
            <button
              onClick={() => setShowAuthModal(false)}
              className="mt-4 text-xs font-bold text-gray-400 hover:underline"
            >
              Nanti Saja, Saya Hanya Ingin Lihat-Lihat
            </button>
          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer style={{ backgroundColor: COLORS.navy }} className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <span className="text-2xl font-bold flex items-center gap-2" style={{ color: COLORS.cream }}>
                <img src="/images/logokb2.png" alt="Logo KawanBerbagi" className="w-8 h-8 object-contain bg-white rounded-full p-0.5 shadow-sm" />
                <span>KawanBerbagi<span style={{ color: COLORS.gold }}>.</span></span>
              </span>
              <p className="text-sm mt-4 max-w-xs leading-relaxed" style={{ color: COLORS.cream, opacity: 0.6 }}>
                Platform donasi demand-driven — mempertemukan barang yang Anda punya dengan kebutuhan yang benar-benar ada.
              </p>
            </div>
            {[
              {
                title: "Untuk Donatur",
                links: ["Cari Panti", "Lacak Donasi", "Riwayat Dampak"],
              },
              {
                title: "Untuk Panti",
                links: ["Daftarkan Yayasan", "Buat Wishlist", "Panduan Verifikasi"],
              },
              {
                title: "Kepercayaan",
                links: ["Dokumen Legalitas", "Keamanan Data", "Pusat Bantuan"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h5
                  className="text-xs font-semibold tracking-wide mb-4"
                  style={{ color: COLORS.teal, textTransform: "uppercase" }}
                >
                  {col.title}
                </h5>
                <ul className="flex flex-col gap-3">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-sm hover:opacity-100 transition-opacity"
                        style={{ color: COLORS.cream, opacity: 0.75 }}
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
            style={{ borderTop: `1px solid rgba(229,225,221,0.15)` }}
          >
            <p className="text-sm text-center sm:text-left" style={{ color: COLORS.cream, opacity: 0.5 }}>
              © 2026 KawanBerbagi. Semua data portofolio panti adalah milik mitra resmi yang sah.
            </p>
            <p className="text-sm" style={{ color: COLORS.cream, opacity: 0.5 }}>
              Donasi yang pas, tanpa mubazir.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}