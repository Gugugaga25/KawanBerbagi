import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
  ShieldCheck,
  ArrowRight,
  X,
  Menu,
  Heart,
  Eye,
  Users,
} from "lucide-react";

const COLORS = {
  navy: "#293681",
  gold: "#F59E0B",
  mist: "#D0E7E6",
  teal: "#4274D9",
  cream: "#F8FAFC",
};

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
    { label: "FAQ", href: "/faq" },
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
                className={`text-base font-bold transition-all duration-200 relative pb-1 hover:text-[#4274D9] ${isActive ? "" : "text-[#293681]/80"
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
                className={`text-base font-bold py-1.5 transition-colors ${isActive ? "text-[#4274D9]" : "text-[#293681]"
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

// ================= HALAMAN ABOUT =================
export default function About() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8FAFC]">
      <Nav />

      {/* Background decorations */}
      <div className="absolute top-48 left-0 -translate-x-1/2 w-96 h-96 rounded-full bg-[#4274D9]/5 blur-3xl pointer-events-none" />
      <div className="absolute top-96 right-0 translate-x-1/2 w-96 h-96 rounded-full bg-[#F59E0B]/5 blur-3xl pointer-events-none" />

      {/* ================= HERO SECTION ================= */}
      <section className="relative py-16 sm:py-24 text-center max-w-4xl mx-auto px-5 z-10">
        <span className="text-xs font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full bg-[#4274D9]/10 text-[#4274D9]">
          Tentang KawanBerbagi
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold mt-4 mb-4 text-[#293681] tracking-tight leading-tight">
          Menghubungkan Kebaikan Dengan<br />Transparansi Penuh
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mx-auto text-gray-500 font-medium leading-relaxed mt-6">
          KawanBerbagi adalah platform jembatan sosial berbasis web yang mempertemukan kepedulian para donatur dengan kebutuhan riil panti asuhan secara terukur, adil, dan transparan.
        </p>
      </section>

      {/* ================= SEJARAH & LATAR BELAKANG ================= */}
      <section className="py-16 sm:py-20 bg-white relative z-10 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold tracking-wider text-[#4274D9] uppercase">Latar Belakang</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#293681] mt-2 mb-5">
                Mengatasi Masalah Klasik Penyaluran Donasi
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-gray-500 font-medium mb-4">
                Penyaluran donasi barang sering kali menghadapi masalah ketimpangan distribusi. Ada panti asuhan yang menerima pasokan pakaian layak pakai atau beras secara berlebih hingga mubazir, sementara panti di pelosok lainnya masih kekurangan buku sekolah atau kebutuhan mendasar lain.
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-gray-500 font-medium">
                Melihat kenyataan ini, kami menginisiasi **KawanBerbagi** sebagai solusi *demand-driven*—dimana donasi disalurkan berdasarkan data kebutuhan aktual panti, bukan sekadar perkiraan acak.
              </p>
            </div>
            <div className="bg-[#F8FAFC] rounded-3xl p-8 border border-slate-100 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#4274D9]/5 blur-2xl" />
              <h3 className="text-lg font-extrabold text-[#293681] mb-4">
                Platform yang Solutif
              </h3>
              <ul className="flex flex-col gap-4">
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#4274D9]/10 text-[#4274D9] flex items-center justify-center shrink-0 font-bold text-xs">✓</span>
                  <p className="text-xs sm:text-sm text-gray-500 font-semibold leading-relaxed">
                    <strong>Peta Lokasi GPS:</strong> Memudahkan donatur mencari panti di radius terdekat demi efisiensi ongkos kirim.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#4274D9]/10 text-[#4274D9] flex items-center justify-center shrink-0 font-bold text-xs">✓</span>
                  <p className="text-xs sm:text-sm text-gray-500 font-semibold leading-relaxed">
                    <strong>Sistem Kunci Kuota:</strong> Menghentikan pengiriman suatu jenis barang jika kebutuhan panti sudah terpenuhi.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#4274D9]/10 text-[#4274D9] flex items-center justify-center shrink-0 font-bold text-xs">✓</span>
                  <p className="text-xs sm:text-sm text-gray-500 font-semibold leading-relaxed">
                    <strong>Pelacakan Resi & Foto:</strong> Memberi kepastian bahwa donasi benar-benar sampai ke tangan penerima manfaat.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VISI & MISI ================= */}
      <section className="py-16 sm:py-24 relative z-10">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#4274D9]/10 text-[#4274D9] flex items-center justify-center mb-6">
                <Eye size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-[#293681] mb-3">Visi Kami</h3>
              <p className="text-sm sm:text-base leading-relaxed text-gray-500 font-medium">
                Menjadi ekosistem digital penyaluran donasi non-tunai paling terpercaya, transparan, dan berdampak merata untuk seluruh yayasan sosial di Indonesia.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center mb-6">
                <Heart size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-[#293681] mb-3">Misi Kami</h3>
              <ul className="flex flex-col gap-3 text-xs sm:text-sm text-gray-500 font-medium">
                <li className="flex gap-2">
                  <span className="text-[#F59E0B] font-bold">•</span>
                  <span>Menyediakan basis data kebutuhan panti asuhan secara real-time dan transparan.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#F59E0B] font-bold">•</span>
                  <span>Meningkatkan kepercayaan publik melalui pelacakan status logistik yang akurat.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#F59E0B] font-bold">•</span>
                  <span>Mengoptimalkan distribusi donasi merata demi meminimalisasi pemborosan di satu tempat.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= NILAI-NILAI UTAMA ================= */}
      <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-100 relative z-10">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-wider text-[#4274D9] uppercase">Nilai Kami</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#293681] mt-2">
              Prinsip yang Selalu Kami Pegang
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 text-center hover:-translate-y-1 transition-all duration-300 shadow-sm">
              <span className="text-2xl font-extrabold text-[#4274D9]">01</span>
              <h4 className="text-base font-extrabold text-[#293681] mt-3 mb-2">Transparansi</h4>
              <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
                Setiap donatur berhak tahu status dan bukti serah terima foto paket mereka tanpa ada yang ditutupi.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-slate-100 text-center hover:-translate-y-1 transition-all duration-300 shadow-sm">
              <span className="text-2xl font-extrabold text-[#4274D9]">02</span>
              <h4 className="text-base font-extrabold text-[#293681] mt-3 mb-2">Tepat Sasaran</h4>
              <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
                Kami fokus mencocokkan apa yang benar-benar kurang dan dibutuhkan di panti saat ini secara aktual.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-slate-100 text-center hover:-translate-y-1 transition-all duration-300 shadow-sm">
              <span className="text-2xl font-extrabold text-[#4274D9]">03</span>
              <h4 className="text-base font-extrabold text-[#293681] mt-3 mb-2">Kolaboratif</h4>
              <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
                Membangun ekosistem inklusif bagi donatur, mitra panti, dan admin pengawas demi gotong royong yang sehat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer style={{ backgroundColor: COLORS.navy }} className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <span className="text-2xl font-bold flex items-center gap-2" style={{ color: COLORS.cream }}>
                <img src="/images/logokb2_white.png" alt="Logo KawanBerbagi" className="w-8 h-8 object-contain" />
                <span>KawanBerbagi<span style={{ color: COLORS.gold }}>.</span></span>
              </span>
              <p className="text-sm mt-4 max-w-xs leading-relaxed" style={{ color: COLORS.cream, opacity: 0.6 }}>
                Platform donasi demand-driven — mempertemukan barang yang Anda punya dengan kebutuhan yang benar-benar ada.
              </p>
            </div>
            {[
              {
                title: "Untuk Donatur",
                links: [
                  { name: "Cari Panti", href: "/#top" },
                  { name: "Lacak Donasi", href: "/login" },
                  { name: "Riwayat Dampak", href: "/login" },
                ],
              },
              {
                title: "Untuk Panti",
                links: [
                  { name: "Daftarkan Yayasan", href: "/register?role=yayasan" },
                  { name: "Buat Wishlist", href: "/register?role=yayasan" },
                  { name: "Panduan Verifikasi", href: "/register?role=yayasan" },
                ],
              },
              {
                title: "Kepercayaan & Bantuan",
                links: [
                  { name: "Pusat Bantuan (FAQ)", href: "/faq" },
                  { name: "Dokumen Legalitas", href: "/#fitur" },
                  { name: "Keamanan Data", href: "/#fitur" },
                ],
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
                    <li key={l.name}>
                      <Link
                        href={l.href}
                        className="text-sm hover:opacity-100 transition-opacity"
                        style={{ color: COLORS.cream, opacity: 0.75 }}
                      >
                        {l.name}
                      </Link>
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
              © 2026 KawanBerbagi. Semua yayasan terverifikasi manual oleh tim kami.
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
