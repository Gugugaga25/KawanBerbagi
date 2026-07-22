import React, { useState, useMemo } from "react";
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

// Mock data portofolio panti (ganti dengan data real dari backend jika sudah ada)
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

// Data diambil dinamis dari props panti

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
  ];

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur"
      style={{ backgroundColor: `${COLORS.cream}f2`, borderBottom: `1px solid ${COLORS.teal}33` }}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <img src="/images/logokb2.png" alt="Logo KawanBerbagi" className="w-8 h-8 object-contain" />
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
                className="text-base font-semibold px-5 py-2.5 rounded-full text-white hover:brightness-110 transition shadow-sm"
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
          style={{ backgroundColor: COLORS.cream, borderTop: `1px solid ${COLORS.teal}33` }}
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

// ================= KOMPONEN HALAMAN UTAMA =================
export default function ProfilPanti({ pantis = [] }: { pantis?: Shelter[] }) {
  const { auth } = usePage().props as any; 
  const [search, setSearch] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

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
      alert(`Mengarahkan Anda ke form donasi panti ID: ${shelterId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: COLORS.cream }}>
      
      <Nav />

      {/* ================= HERO SECTION ================= */}
      <section className="py-12 sm:py-16 text-center max-w-4xl mx-auto px-5" id="top">
        <span className="text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-[#4274D9]/20" style={{ color: COLORS.navy }}>
          Arsip Transparansi
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold mt-4 mb-4" style={{ color: COLORS.navy }}>
          Profil & Portofolio Panti Mitra
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: COLORS.navy, opacity: 0.75 }}>
          Telusuri profil panti asuhan yang telah terverifikasi secara resmi oleh tim kami. 
          Anda dapat memantau kuota kebutuhan riil mereka tanpa harus mendaftar terlebih dahulu.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mt-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={18} style={{ color: COLORS.navy, opacity: 0.4 }} />
          <input
            type="text"
            placeholder="Cari nama panti atau lokasi kota..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-sm outline-none border focus:border-[#407E8C] border-[#4274D9]/20 transition-colors shadow-sm"
            style={{ backgroundColor: '#ffffff', color: COLORS.navy }}
          />
        </div>
      </section>

      {/* ================= PORTFOLIO GRID ================= */}
      <main className="flex-1 max-w-7xl mx-auto px-5 sm:px-8 pb-20 w-full">
        {filteredShelters.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {filteredShelters.map((shelter) => (
              
              <Link
                key={shelter.id}
                // Sesuaikan href ini dengan route detail panti di Laravel kamu
                // Contoh jika pakai helper route: href={route('panti.detail', { id: shelter.id })}
                href={`/panti/${shelter.id}`} 
                className="bg-white rounded-[1.8rem] overflow-hidden border hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col md:flex-row h-full cursor-pointer group border-[#4274D9]/20"
              >
                {/* Thumbnail Gambar */}
                <div className="md:w-2/5 h-48 md:h-auto relative shrink-0">
                  <img
                    src={shelter.image}
                    alt={shelter.nama}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {shelter.terverifikasi && (
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <ShieldCheck size={14} color={COLORS.teal} />
                      <span className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: COLORS.navy }}>Terverifikasi</span>
                    </div>
                  )}
                </div>

                {/* Konten Profil */}
                <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between relative z-10 bg-white">
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold flex items-center gap-1.5 mb-1 group-hover:text-[#407E8C] transition-colors" style={{ color: COLORS.navy }}>
                      {shelter.nama}
                    </h3>
                    <p className="text-xs flex items-center gap-1 mb-4" style={{ color: COLORS.navy, opacity: 0.6 }}>
                      <MapPin size={13} style={{ color: COLORS.teal }} /> {shelter.alamat}
                    </p>
                    <p className="text-sm line-clamp-3 mb-5 leading-relaxed" style={{ color: COLORS.navy, opacity: 0.8 }}>
                      {shelter.deskripsi}
                    </p>

                    {/* Kebutuhan Mendesak */}
                    <div className="mb-6">
                      <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: COLORS.gold }}>Kebutuhan Mendesak:</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {shelter.kebutuhan_mendesak.map((item, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2.5 py-1 rounded-md font-semibold"
                            style={{ backgroundColor: 'rgba(165,141,102,0.11)', color: COLORS.navy }}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tombol Interaksi */}
                  <div className="flex items-center gap-3 pt-3 border-t" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                    <div className="flex items-center gap-1 text-xs font-bold" style={{ color: COLORS.navy, opacity: 0.75 }}>
                      <Users size={14} /> {shelter.jumlah_anak} Penerima Manfaat
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.preventDefault(); // Mencegah link pindah halaman saat tombol diklik
                        handleDonationAction(shelter.id);
                      }}
                      className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-full text-white transition-all hover:brightness-110 shadow-sm bg-[#4274D9] hover:bg-[#293681]"
                    >
                      Bantu Penuhi <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State Pencarian */
          <div className="rounded-[2rem] p-16 flex flex-col items-center justify-center text-center bg-white border border-dashed bg-[#4274D9]/20">
            <Building2 size={40} className="mb-4" style={{ color: COLORS.navy, opacity: 0.3 }} />
            <h3 className="text-lg font-bold mb-1" style={{ color: COLORS.navy }}>Panti Tidak Ditemukan</h3>
            <p className="text-sm" style={{ color: COLORS.navy, opacity: 0.55 }}>
              Tidak ada mitra panti di daerah "{search}" yang cocok dalam sistem kami saat ini.
            </p>
          </div>
        )}
      </main>

      {/* ================= RESTRICTED ACCESS MODAL ================= */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowAuthModal(false)} />
          
          <div className="relative bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200 z-10 text-center border border-[#4274D9]/20">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute right-5 top-5 p-1 rounded-full hover:bg-gray-100 transition"
            >
              <X size={20} style={{ color: COLORS.navy }} />
            </button>

            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: 'rgba(165,141,102,0.15)' }}>
              <Lock size={28} style={{ color: COLORS.teal }} />
            </div>

            <h3 className="text-xl font-bold mb-2.5" style={{ color: COLORS.navy }}>
              Aksi Terbatas!
            </h3>
            
            <p className="text-sm leading-relaxed mb-6" style={{ color: COLORS.navy, opacity: 0.75 }}>
              Anda harus masuk sebagai donatur terlebih dahulu untuk dapat mengunci kuota donasi, menginput resi kurir, dan memantau progres barang Anda sampai ke panti ini.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href={route("login")}
                className="w-full py-3 rounded-xl font-bold text-sm text-white transition text-center bg-[#4274D9] hover:bg-[#293681]"
              >
                Masuk ke Akun Saya
              </Link>
              <Link
                href={route("register")}
                className="w-full py-3 rounded-xl font-bold text-sm border border-[#293681] transition text-center text-[#293861] hover:text-white hover:bg-[#293681]"
              >
                Belum Punya Akun? Daftar
              </Link>
            </div>
            
            <button
              onClick={() => setShowAuthModal(false)}
              className="mt-4 text-xs font-semibold hover:underline"
              style={{ color: COLORS.navy, opacity: 0.5 }}
            >
              Nanti Saja, Saya Hanya Ingin Lihat-Lihat
            </button>
          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer style={{ backgroundColor: COLORS.navy }} className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t" style={{ borderColor: "rgba(229,225,221,0.15)" }}>
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