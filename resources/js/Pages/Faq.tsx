import React, { useState, useMemo } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
  Search,
  ChevronDown,
  HelpCircle,
  ShieldCheck,
  PackageCheck,
  Building2,
  Heart,
  MessageCircle,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const COLORS = {
  navy: "#293681",
  gold: "#F59E0B",
  mist: "#D0E7E6",
  teal: "#4274D9",
  cream: "#F8FAFC",
};

/* ---------- Navigasi Header ---------- */
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
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-100/80 transition-all duration-300 shadow-sm">
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
        <a href="/#top" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <img src="/images/logokb2.png" alt="Logo KawanBerbagi" className="w-8 h-8 object-contain" />
          <span className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: COLORS.navy }}>
            KawanBerbagi
            <span className="text-[#4274D9]">.</span>
          </span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => {
            const isActive = url === l.href || url.startsWith(l.href + "/");
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

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {auth?.user ? (
            <Link
              href="/dashboard"
              className="text-sm font-bold px-5 py-2.5 rounded-full text-white bg-[#4274D9] shadow-md shadow-[#4274D9]/20 hover:bg-[#293681] hover:shadow-lg transition-all duration-300"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-base font-bold text-[#293681] hover:text-[#4274D9] transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="text-sm font-bold px-5 py-2.5 rounded-full text-white bg-[#4274D9] shadow-md shadow-[#4274D9]/20 hover:bg-[#293681] hover:shadow-lg transition-all duration-300"
              >
                Daftar
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-xl text-[#293681] hover:bg-slate-100"
          aria-label="Toggle Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden border-b border-slate-100 bg-white px-5 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm font-bold text-[#293681] py-2 hover:text-[#4274D9]"
            >
              {l.label}
            </a>
          ))}
          <div className="pt-3 border-t flex flex-col gap-2">
            {auth?.user ? (
              <Link
                href="/dashboard"
                className="w-full text-center text-sm font-bold py-3 rounded-full text-white bg-[#4274D9]"
              >
                Ke Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="w-full text-center text-sm font-bold py-2.5 rounded-full text-[#293681] border border-[#293681]"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="w-full text-center text-sm font-bold py-2.5 rounded-full text-white bg-[#4274D9]"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------- Interface & Data FAQ ---------- */
interface StepItem {
  text: string;
  subitems?: string[];
}

interface FaqItem {
  id: string;
  category: "umum" | "donatur" | "panti" | "keamanan";
  question: string;
  intro?: string;
  answer?: string;
  steps?: StepItem[];
  note?: string;
  icon: React.ElementType;
}

const FAQ_DATA: FaqItem[] = [
  // UMUM
  {
    id: "u1",
    category: "umum",
    question: "Apa itu KawanBerbagi?",
    answer:
      "KawanBerbagi adalah platform donasi berbasis kebutuhan riil (demand-driven) yang menghubungkan donatur secara langsung dengan panti asuhan terverifikasi. Kami memastikan setiap barang donasi disalurkan sesuai jumlah kuota terkunci tanpa risiko surplus atau mubazir.",
    icon: HelpCircle,
  },
  {
    id: "u2",
    category: "umum",
    question: "Mengapa KawanBerbagi berfokus pada donasi barang?",
    answer:
      "Donasi barang (seperti sembako, alat tulis, pakaian, dan perlengkapan mandi) lebih transparan dan tepat guna. Panti asuhan sering kali menerima uang tanpa kepastian pasokan logistik bulanan, atau menerima satu jenis barang berlebihan sementara barang vital lainnya kosong.",
    icon: PackageCheck,
  },
  {
    id: "u3",
    category: "umum",
    question: "Apakah ada biaya administrasi untuk donatur atau panti?",
    answer:
      "Tidak ada. Layanan platform KawanBerbagi 100% gratis untuk donatur maupun yayasan/panti asuhan yang terdaftar.",
    icon: Heart,
  },

  // DONATUR
  {
    id: "d1",
    category: "donatur",
    question: "Bagaimana cara menyalurkan donasi barang di KawanBerbagi?",
    intro: "Berikut 5 langkah praktis untuk menyalurkan donasi barang Anda:",
    steps: [
      { text: "Cari panti asuhan terdekat." },
      { text: "Pilih wishlist kebutuhan barang yang ingin Anda sumbangkan." },
      { text: "Tentukan jumlah kuota barang dan lakukan checkout donasi." },
      { text: "Kirim barang melalui kurir/ekspedisi (masukkan nomor resi) atau antar langsung secara mandiri." },
      { text: "Pantau foto bukti penerimaan barang secara transparan di dashboard Anda." },
    ],
    icon: Heart,
  },
  {
    id: "d2",
    category: "donatur",
    question: "Apa yang dimaksud dengan Sistem Kuota Terkunci?",
    answer:
      "Ketika Anda melakukan checkout untuk memenuhi kuota barang (misalnya 10 kg beras dari kebutuhan 50 kg), sistem akan secara otomatis mengunci kuota tersebut selama periode waktu pengiriman agar donatur lain tidak mengirim barang yang sama melebihi batas kuota.",
    icon: ShieldCheck,
  },
  {
    id: "d3",
    category: "donatur",
    question: "Bagaimana jika saya ingin mengantar barang donasi sendiri?",
    answer:
      "Saat proses checkout donasi, Anda dapat memilih metode pengiriman 'Antar Mandiri'. Anda akan mendapatkan alamat lengkap beserta nomor kontak pengurus panti untuk melakukan serah terima langsung.",
    icon: PackageCheck,
  },
  {
    id: "d4",
    category: "donatur",
    question: "Bagaimana saya bisa tahu barang donasi saya sudah sampai?",
    answer:
      "Begitu barang tiba di lokasi panti asuhan, pengurus panti wajib mengunggah foto bukti serah terima barang di aplikasi. Anda akan mendapatkan notifikasi real-time dan dapat melihat foto bukti penerimaan di halaman riwayat donasi Anda.",
    icon: CheckCircle2,
  },

  // PANTI ASUHAN
  {
    id: "p1",
    category: "panti",
    question: "Bagaimana cara mendaftarkan panti asuhan / yayasan kami?",
    intro: "Proses pendaftaran yayasan/panti asuhan dilakukan dalam 4 langkah berikut:",
    steps: [
      { text: "Klik tombol 'Daftar' di pojok kanan atas, lalu pilih pendaftaran 'Sebagai Yayasan'." },
      { text: "Isi formulir identitas resmi yayasan dan data kontak pengurus." },
      {
        text: "Unggah dokumen legalitas resmi yayasan berikut:",
        subitems: [
          "SK Kemenkumham",
          "Izin Operasional Dinas Sosial (Dinsos)",
          "Akta Pendirian Yayasan",
          "NPWP Yayasan",
        ],
      },
      { text: "Tim KawanBerbagi akan melakukan verifikasi manual dalam 1–3 hari kerja." },
    ],
    icon: Building2,
  },
  {
    id: "p2",
    category: "panti",
    question: "Bagaimana pengurus panti membuat daftar kebutuhan (Wishlist)?",
    intro: "Pengurus panti dapat membuat wishlist kebutuhan riil dengan langkah mudah:",
    steps: [
      { text: "Setelah akun yayasan disetujui, masuk ke Dashboard Panti." },
      { text: "Buka menu 'Kelola Wishlist'." },
      { text: "Pilih jenis barang yang dibutuhkan (misal: Seragam Sekolah, Beras, Susu Bayi)." },
      { text: "Tentukan jumlah kuota pasokan barang serta tingkat kegentingannya (Mendesak / Biasa)." },
    ],
    icon: PackageCheck,
  },
  {
    id: "p3",
    category: "panti",
    question: "Apa syarat utama agar panti asuhan dapat terverifikasi?",
    answer:
      "Yayasan wajib memiliki izin legalitas hukum yang masih berlaku (SK Kemenkumham atau izin operasional Dinas Sosial lokal), alamat panti fisik yang jelas, serta nomor kontak pengurus aktif.",
    icon: ShieldCheck,
  },

  // KEAMANAN & LEGALITAS
  {
    id: "k1",
    category: "keamanan",
    question: "Bagaimana KawanBerbagi menjamin panti asuhan itu asli & valid?",
    intro: "Setiap panti asuhan melalui proses verifikasi 3 tahap yang ketat:",
    steps: [
      { text: "Pemindaian & Verifikasi Dokumen Legalitas Resmi (SK Kemenkumham & Dinsos)." },
      { text: "Konfirmasi Kontak & Pengurus Yayasan secara langsung." },
      { text: "Verifikasi Peta Lokasi Fisik Panti Asuhan." },
    ],
    note: "Panti yang telah lolos verifikasi akan mendapatkan lencana terverifikasi (Verified Badge) di profilnya.",
    icon: ShieldCheck,
  },
  {
    id: "k2",
    category: "keamanan",
    question: "Apakah data pribadi donatur terjamin keamanannya?",
    answer:
      "Ya, KawanBerbagi menjamin kerahasiaan data donatur. Alamat pribadi dan nomor telepon donatur dikodekan secara aman dan hanya digunakan untuk keperluan konfirmasi resi pengiriman barang.",
    icon: ShieldCheck,
  },
];

const CATEGORIES = [
  { id: "semua", label: "Semua Pertanyaan", icon: HelpCircle },
  { id: "umum", label: "Umum", icon: Sparkles },
  { id: "donatur", label: "Untuk Donatur", icon: Heart },
  { id: "panti", label: "Untuk Panti Asuhan", icon: Building2 },
  { id: "keamanan", label: "Keamanan & Legalitas", icon: ShieldCheck },
];

/* ---------- Halaman FAQ Utama ---------- */
export default function FaqPage() {
  const { auth } = usePage<any>().props;
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("semua");
  const [openFaqId, setOpenFaqId] = useState<string | null>("d1"); // Default open first step-by-step FAQ

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((faq) => {
      const matchesCategory =
        activeCategory === "semua" || faq.category === activeCategory;

      const fullText = (
        faq.question +
        " " +
        (faq.answer || "") +
        " " +
        (faq.intro || "") +
        " " +
        (faq.steps ? faq.steps.map((s) => s.text + " " + (s.subitems ? s.subitems.join(" ") : "")).join(" ") : "")
      ).toLowerCase();

      const matchesSearch = fullText.includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div style={{ backgroundColor: COLORS.cream }} className="min-h-screen flex flex-col font-sans">
      <Nav />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-white to-[#F8FAFC] border-b border-slate-100">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#4274D9]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#F59E0B]/5 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full bg-[#4274D9]/10 text-[#4274D9] mb-6">
            <HelpCircle size={16} /> Pusat Bantuan & Pertanyaan Umum
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#293681] tracking-tight mb-4 leading-tight">
            Ada yang Bisa Kami Bantu?
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 font-medium">
            Temukan jawaban lengkap seputar penyaluran donasi barang, sistem kuota terkunci, hingga panduan pendaftaran panti asuhan.
          </p>

          {/* SEARCH BAR */}
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#4274D9]">
              <Search size={22} />
            </div>
            <input
              type="text"
              placeholder="Cari pertanyaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-12 py-4 rounded-2xl bg-white border border-slate-200/80 shadow-lg shadow-slate-200/50 text-slate-800 text-base placeholder-slate-400 focus:outline-none focus:border-[#4274D9] focus:ring-4 focus:ring-[#4274D9]/10 transition-all duration-200 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* FAQ CONTENT SECTION */}
      <section className="py-16 max-w-5xl mx-auto px-5 sm:px-8 w-full flex-1">
        {/* CATEGORY TABS */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-10 no-scrollbar justify-start sm:justify-center">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 text-sm font-bold px-5 py-3 rounded-xl transition-all duration-300 shrink-0 border cursor-pointer ${isActive
                  ? "bg-[#293681] text-white border-[#293681] shadow-md shadow-[#293681]/20 scale-[1.02]"
                  : "bg-white text-slate-600 border-slate-200 hover:border-[#4274D9] hover:text-[#4274D9]"
                  }`}
              >
                <Icon size={16} className={isActive ? "text-[#F59E0B]" : "text-[#4274D9]"} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* ACCORDION LIST */}
        {filteredFaqs.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              const Icon = faq.icon;

              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden bg-white ${isOpen
                    ? "border-[#4274D9] shadow-lg shadow-[#4274D9]/10 ring-2 ring-[#4274D9]/10"
                    : "border-slate-200/80 hover:border-slate-300 shadow-sm"
                    }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer select-none group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isOpen
                          ? "bg-[#4274D9] text-white"
                          : "bg-[#4274D9]/10 text-[#4274D9] group-hover:bg-[#4274D9] group-hover:text-white"
                          }`}
                      >
                        <Icon size={20} />
                      </div>
                      <span className="text-base sm:text-lg font-bold text-[#293681] group-hover:text-[#4274D9] transition-colors leading-snug">
                        {faq.question}
                      </span>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 bg-slate-100 text-[#4274D9]" : "text-slate-400"
                        }`}
                    >
                      <ChevronDown size={20} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-3 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 font-medium">
                      <div className="pl-0 sm:pl-14">
                        {faq.intro && (
                          <p className="mb-4 font-semibold text-[#293681]">{faq.intro}</p>
                        )}

                        {faq.answer && (
                          <p className="mb-3 leading-relaxed text-slate-700">{faq.answer}</p>
                        )}

                        {faq.steps && faq.steps.length > 0 && (
                          <div className="flex flex-col gap-3 my-3">
                            {faq.steps.map((step, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-3 bg-slate-50/90 p-3.5 sm:p-4 rounded-xl border border-slate-200/70 hover:border-[#4274D9]/30 transition-colors"
                              >
                                <span className="w-7 h-7 rounded-full bg-[#4274D9] text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                                  {idx + 1}
                                </span>
                                <div className="flex-1">
                                  <p className="font-semibold text-slate-800 text-sm sm:text-base leading-snug">
                                    {step.text}
                                  </p>
                                  {step.subitems && step.subitems.length > 0 && (
                                    <ul className="mt-3 grid sm:grid-cols-2 gap-2">
                                      {step.subitems.map((sub, sidx) => (
                                        <li
                                          key={sidx}
                                          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#293681] bg-white px-3 py-2 rounded-lg border border-slate-200/80 shadow-xs"
                                        >
                                          <CheckCircle2 size={15} className="text-[#4274D9] shrink-0" />
                                          <span>{sub}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {faq.note && (
                          <div className="mt-4 p-3.5 rounded-xl bg-amber-50/90 border border-amber-200/90 text-amber-900 text-xs sm:text-sm flex items-start gap-2.5 font-semibold">
                            <Sparkles size={18} className="text-[#F59E0B] shrink-0 mt-0.5" />
                            <span>{faq.note}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#293681] mb-2">
              Tidak Ada Pertanyaan Ditemukan
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              Tidak menemukan jawaban untuk kata kunci "{searchQuery}". Coba kata kunci lain atau hubungi tim bantuan kami.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("semua");
              }}
              className="inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-full bg-[#4274D9] text-white hover:bg-[#293681] transition-colors cursor-pointer"
            >
              Tampilkan Semua FAQ
            </button>
          </div>
        )}

        {/* BOTTOM CONTACT CTA */}
        <div className="mt-16 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-2xl" style={{ background: "linear-gradient(135deg, #18224B 0%, #4274D9 100%)" }}>
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#F59E0B]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <h3 className="text-2xl font-extrabold mb-2 text-white">
                Masih Punya Pertanyaan Lain?
              </h3>
              <p className="text-sm text-white/80 max-w-lg font-medium">
                Tim layanan bantuan KawanBerbagi siap memberikan respon cepat dan memandu penyaluran donasi Anda.
              </p>
            </div>
            <Link
              href={auth?.user ? "/dashboard" : "/login"}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white text-[#293681] font-bold text-sm hover:shadow-xl hover:bg-slate-50 transition-all duration-300 shrink-0"
            >
              <MessageCircle size={18} className="text-[#4274D9]" /> Hubungi Tim Bantuan <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: COLORS.navy }} className="pt-16 pb-8 border-t border-slate-800">
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

            <div>
              <h5 className="text-xs font-semibold tracking-wide mb-4 text-[#4274D9] uppercase">
                Untuk Donatur
              </h5>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link href={auth?.user ? "/dashboard" : "/login"} className="text-sm hover:opacity-100 transition-opacity text-slate-300 opacity-75">
                    Cari Panti
                  </Link>
                </li>
                <li>
                  <Link href={auth?.user ? "/dashboard" : "/login"} className="text-sm hover:opacity-100 transition-opacity text-slate-300 opacity-75">
                    Lacak Donasi
                  </Link>
                </li>
                <li>
                  <Link href={auth?.user ? "/dashboard" : "/login"} className="text-sm hover:opacity-100 transition-opacity text-slate-300 opacity-75">
                    Riwayat Dampak
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-semibold tracking-wide mb-4 text-[#4274D9] uppercase">
                Untuk Panti
              </h5>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link href="/register?role=yayasan" className="text-sm hover:opacity-100 transition-opacity text-slate-300 opacity-75">
                    Daftarkan Yayasan
                  </Link>
                </li>
                <li>
                  <Link href={auth?.user ? "/dashboard" : "/register?role=yayasan"} className="text-sm hover:opacity-100 transition-opacity text-slate-300 opacity-75">
                    Buat Wishlist
                  </Link>
                </li>
                <li>
                  <Link href="/register?role=yayasan" className="text-sm hover:opacity-100 transition-opacity text-slate-300 opacity-75">
                    Panduan Verifikasi
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-semibold tracking-wide mb-4 text-[#4274D9] uppercase">
                Kepercayaan & Bantuan
              </h5>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link href="/faq" className="text-sm hover:opacity-100 font-bold text-[#F59E0B]">
                    Pusat Bantuan (FAQ)
                  </Link>
                </li>
                <li>
                  <Link href="/#fitur" className="text-sm hover:opacity-100 transition-opacity text-slate-300 opacity-75">
                    Dokumen Legalitas
                  </Link>
                </li>
                <li>
                  <Link href="/#fitur" className="text-sm hover:opacity-100 transition-opacity text-slate-300 opacity-75">
                    Keamanan Data
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
            style={{ borderTop: `1px solid rgba(229,225,221,0.15)` }}
          >
            <p className="text-sm text-center sm:text-left text-slate-400 opacity-60">
              © 2026 KawanBerbagi. Semua yayasan terverifikasi manual oleh tim kami.
            </p>
            <p className="text-sm text-slate-400 opacity-60">
              Donasi yang pas, tanpa mubazir.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
