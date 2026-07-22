import React, { useState, useMemo, useEffect, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
  MapPin,
  PackageCheck,
  ShieldCheck,
  Camera,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Handshake,
  MessageCircle,
  Sparkles,
  Menu,
  X,
  Quote,
  BadgeCheck,
  ClipboardList,
  Truck,
  PartyPopper,
} from "lucide-react";

const COLORS = {
  navy: "#293681",
  gold: "#F59E0B",
  mist: "#D0E7E6",
  teal: "#4274D9",
  cream: "#F8FAFC",
};

/* ---------- Hooks & primitives ---------- */

function AnimatedProgress() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      setProgress(98);
    }, 300);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <div ref={ref}>
      <div
        className="mt-6 h-2 rounded-full overflow-hidden"
        style={{ background: "#D9E6E8" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            background: COLORS.teal,
            transition: "width 3.8s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </div>
    </div>
  );
}

function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
}

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: "opacity 0.7s ease, transform 0.7s ease",
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
      }}
    >
      {children}
    </div>
  );
}

// ================= KOMPONEN NAVIGASI =================
function Nav() {
    const [open, setOpen] = useState(false);
    const { auth } = usePage().props as any;
    const { url } = usePage(); 
    
    // State baru untuk menyimpan posisi hash (#) saat ini
    const [currentHash, setCurrentHash] = useState("");
  
    // Memantau perubahan hash di browser setiap kali diklik
    useEffect(() => {
      // Setel hash awal saat halaman pertama kali dimuat
      setCurrentHash(window.location.hash);
  
      // Fungsi untuk memperbarui state saat hash berubah
      const handleHashChange = () => setCurrentHash(window.location.hash);
      
      // Dengarkan event perubahan hash
      window.addEventListener("hashchange", handleHashChange);
      
      // Bersihkan event listener saat komponen dilepas
      return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);
  
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
              let isActive = false;
  
              // Logika untuk menentukan Tab mana yang aktif
              if (l.href.includes('#')) {
                // Jika link adalah hash (mengandung '#')
                const hashPart = l.href.substring(l.href.indexOf('#')); // Ambil bagian "#fitur"
                // Aktif jika kita di halaman utama (url '/') DAN hash-nya sama persis
                isActive = (url === '/' || url.startsWith('/#')) && currentHash === hashPart;
              } else {
                // Jika link adalah halaman biasa (/profil-panti)
                isActive = url === l.href || url.startsWith(l.href + '/');
              }
              
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
                  className="text-base font-semibold px-5 py-2.5 rounded-full text-white hover:brightness-110 transition bg-[#4274D9] hover:bg-[#293681]">
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
              let isActive = false;
              
              if (l.href.includes('#')) {
                const hashPart = l.href.substring(l.href.indexOf('#'));
                isActive = (url === '/' || url.startsWith('/#')) && currentHash === hashPart;
              } else {
                isActive = url === l.href || url.startsWith(l.href + '/');
              }
  
              return (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`text-lg font-medium py-1 transition-colors ${
                    isActive ? "font-bold" : ""
                  }`}
                  style={{ color: isActive ? COLORS.teal : COLORS.navy }}
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

/* ---------- Hero ---------- */
function Hero() {
  const donated = useCountUp(18000);
  const orphanages = useCountUp(320);
  const donors = useCountUp(5200);

  return (
    <section id="top" className="max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <Reveal>
          <div className="max-w-xl">
            <h1
              className="text-4xl sm:text-6xl leading-[1.08] font-bold"
              style={{ color: COLORS.teal }}
            >
              ARSIP KEBAIKAN.
            </h1>
            <h1
              className="text-4xl sm:text-6xl leading-[1.08] font-bold mb-6"
              style={{ color: COLORS.navy }}
            >
              DONASI TEPAT SASARAN.
            </h1>
            <p
              className="text-lg sm:text-xl leading-relaxed mb-8 max-w-xl font-regular"
              style={{ color: COLORS.navy, opacity: 0.75 }}
            >
              Platform donasi berbasis kebutuhan panti asuhan yang transparan dan terukur.
              Kami mendokumentasikan setiap kebutuhan secara mendetail untuk memastikan amanah
              Anda tersalurkan ke tujuan yang tepat
            </p>

            <div className="flex gap-12 mt-10">
              <div>
                <h3 className="text-3xl font-bold" style={{ color: COLORS.navy }}>
                  {orphanages}+
                </h3>
                <div className="w-10 h-[3px] rounded-full my-2" style={{ background: COLORS.teal }} />
                <p className="text-sm" style={{ color: COLORS.navy, opacity: 0.6 }}>
                  Panti Terdaftar
                </p>
              </div>
              <div>
                <h3 className="text-3xl font-bold" style={{ color: COLORS.navy }}>
                  {(donors / 1000).toFixed(1)}K
                </h3>
                <div className="w-10 h-[3px] rounded-full my-2" style={{ background: COLORS.teal }} />
                <p className="text-sm" style={{ color: COLORS.navy, opacity: 0.6 }}>
                  Donatur Aktif
                </p>
              </div>
              <div>
                <h3 className="text-3xl font-bold" style={{ color: COLORS.navy }}>
                  {Math.floor(donated / 1000)}K+
                </h3>
                <div className="w-10 h-[3px] rounded-full my-2" style={{ background: COLORS.teal }} />
                <p className="text-sm" style={{ color: COLORS.navy, opacity: 0.6 }}>
                  Barang Tersalurkan
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <a
                href="#mulai"
                className="inline-flex items-center justify-center gap-2 text-lg font-medium px-5 py-3 rounded-full text-white hover:brightness-110 transition bg-[#4274D9] hover:bg-[#293681]"
              >
                Cari Panti Terdekat <ArrowRight size={20} />
              </a>
              <a
                href="#daftar-panti"
                className="inline-flex items-center justify-center gap-2 text-lg font-medium px-5 py-3 rounded-full border-2 transition border border-[#293681] text-[#293681] hover:bg-[#293681] hover:text-white"
              >
                Daftarkan Panti Anda
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="relative h-[560px]">
            <div
              className="absolute inset-0 rounded-[50px]"
              style={{ background: "linear-gradient(180deg,#F9F9F9,#EEF6F5)" }}
            />
            <div
              className="absolute left-10 top-10 w-60 h-40 rounded-3xl"
              style={{ background: "white", boxShadow: "0 15px 40px rgba(0,0,0,.08)" }}
            />
            <div
              className="absolute right-6 bottom-10 w-72 h-48 rounded-3xl"
              style={{ background: "white", boxShadow: "0 15px 40px rgba(0,0,0,.08)" }}
            />
            <div
              className="absolute left-40 bottom-32 w-36 h-36 rounded-full"
              style={{ background: COLORS.mist }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Active Needs Showcase ---------- */
const CAMPAIGNS = [
  {
    name: "Yayasan Kasih Ibu",
    location: "Bandung Selatan",
    item: "Beras 50kg",
    unit: "kg",
    filled: 36,
    total: 50,
    urgent: false,
  },
  {
    name: "Panti Asuhan Nurul Iman",
    location: "Jakarta Timur",
    item: "Susu Bayi (kaleng)",
    unit: "kaleng",
    filled: 18,
    total: 20,
    urgent: true,
  },
  {
    name: "Rumah Yatim Cahaya",
    location: "Surabaya",
    item: "Buku Pelajaran SD",
    unit: "eksemplar",
    filled: 42,
    total: 120,
    urgent: false,
  },
  {
    name: "Panti Wreda Bahagia",
    location: "Yogyakarta",
    item: "Selimut & Pakaian Hangat",
    unit: "pcs",
    filled: 9,
    total: 30,
    urgent: true,
  },
];

function CampaignCard({ c, delay }: { c: (typeof CAMPAIGNS)[number]; delay: number }) {
  const pct = Math.round((c.filled / c.total) * 100);
  return (
    <Reveal delay={delay}>
      <div
        className="rounded-2xl p-6 h-full flex flex-col border border-[#4274D9]/20"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#4274D9]/20"
          >
            <PackageCheck size={22} color={COLORS.teal} />
          </div>
          {c.urgent && (
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ backgroundColor: "#FBEAEA", color: "#C0392B" }}
            >
              Mendesak
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold mb-1" style={{ color: COLORS.navy }}>
          {c.item}
        </h3>
        <p className="text-sm flex items-center gap-1 mb-5" style={{ color: COLORS.navy, opacity: 0.6 }}>
          <MapPin size={14} /> {c.name} · {c.location}
        </p>

        <div className="mt-auto">
          <div className="flex justify-between text-sm mb-2 tabular-nums" style={{ color: COLORS.navy, opacity: 0.7 }}>
            <span>Terpenuhi</span>
            <span>
              {c.filled}/{c.total} {c.unit}
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden mb-5 bg-gray-200">
            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: COLORS.teal }} />
          </div>
          <a
            href="#daftar"
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold w-full py-2.5 rounded-full text-white bg-[#4274D9] hover:bg-[#293681] transition"
          >
            Bantu Penuhi Kuota <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </Reveal>
  );
}

function ActiveNeeds() {
  return (
    <section className="py-16 sm:py-24" style={{ backgroundColor: COLORS.navy }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} color={COLORS.gold} />
            <span className="text-sm font-semibold tracking-wide" style={{ color: COLORS.gold }}>
              KEBUTUHAN AKTIF
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-medium mb-4" style={{ color: COLORS.cream }}>
            Barang yang sedang ditunggu, hari ini
          </h2>
          <p className="text-lg mb-14" style={{ color: COLORS.cream, opacity: 0.75 }}>
            Daftar wishlist — kebutuhan nyata dengan kuota pasti dari panti yang
            sudah terverifikasi.
          </p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CAMPAIGNS.map((c, i) => (
            <CampaignCard key={c.item} c={c} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- How it works (interactive: Donatur / Panti) ---------- */
const STEPS_DONATUR = [
  {
    icon: MapPin,
    title: "Cari kebutuhan terdekat",
    body: 'Ketik saja apa yang Anda punya, misalnya "baju anak layak pakai di Bandung". AI mencocokkan Anda dengan panti yang benar-benar membutuhkannya.',
  },
  {
    icon: PackageCheck,
    title: "Kunci kuota & kirim",
    body: "Checkout mengunci kuota barang itu untuk Anda, lalu masukkan nomor resi atau pilih antar sendiri.",
  },
  {
    icon: TrendingUp,
    title: "Pantau perjalanannya",
    body: "Dashboard menunjukkan status barang secara langsung: dipesan, dikirim, tiba, hingga diterima panti.",
  },
  {
    icon: Handshake,
    title: "Terima kabar dampaknya",
    body: "Setelah panti mengonfirmasi dengan foto, Anda mendapat ucapan terima kasih dan cerita dampak donasi Anda.",
  },
];

const STEPS_PANTI = [
  {
    icon: ShieldCheck,
    title: "Daftar & diverifikasi",
    body: "Unggah dokumen legalitas yayasan satu kali. Tim kami memeriksa langsung agar donatur percaya pada panti Anda.",
  },
  {
    icon: ClipboardList,
    title: "Tulis kebutuhan pasti",
    body: 'Buat daftar kebutuhan bulanan lengkap dengan jumlahnya, misalnya "Beras 50kg", supaya tidak ada yang berlebih.',
  },
  {
    icon: Truck,
    title: "Pantau yang datang",
    body: "Lihat status setiap donasi yang menuju panti Anda, lengkap dengan perkiraan waktu tiba.",
  },
  {
    icon: PartyPopper,
    title: "Konfirmasi sekali foto",
    body: "Saat barang tiba, cukup foto sebagai bukti. Sistem akan mengingatkan bila kebutuhan lain mulai menipis.",
  },
];

function HowItWorks() {
  const [role, setRole] = useState<"donatur" | "panti">("donatur");
  const steps = role === "donatur" ? STEPS_DONATUR : STEPS_PANTI;

  return (
    <section id="cara-kerja" className="py-16 sm:py-24" style={{ backgroundColor: COLORS.cream }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl font-medium mb-4" style={{ color: COLORS.navy }}>
            Empat langkah, dari niat hingga dampak
          </h2>
          <p className="text-lg max-w-4xl mb-8" style={{ color: COLORS.navy, opacity: 0.75 }}>
            Tidak perlu telepon satu per satu atau menebak-nebak. Pilih peran Anda untuk melihat alurnya.
          </p>

          <div
            className="inline-flex p-1 rounded-full mb-14 bg-[#4274D9]/15"
            role="tablist"
            aria-label="Pilih alur"
          >
            <button
              role="tab"
              aria-selected={role === "donatur"}
              onClick={() => setRole("donatur")}
              className="text-base font-semibold px-6 py-3 rounded-full transition"
              style={{
                backgroundColor: role === "donatur" ? COLORS.teal : "transparent",
                color: role === "donatur" ? COLORS.cream : COLORS.navy,
              }}
            >
              Sebagai Donatur
            </button>
            <button
              role="tab"
              aria-selected={role === "panti"}
              onClick={() => setRole("panti")}
              className="text-base font-semibold px-6 py-3 rounded-full transition"
              style={{
                backgroundColor: role === "panti" ? COLORS.teal : "transparent",
                color: role === "panti" ? COLORS.cream : COLORS.navy,
              }}
            >
              Sebagai Pengelola Panti
            </button>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <Reveal key={`${role}-${s.title}`} delay={i * 100}>
              <div
                className="rounded-2xl p-6 h-full relative border border-[#4274D9]/20"
                style={{ backgroundColor: "#ffffff", }}
              >
                <div className="text-sm font-bold mb-4 tabular-nums" style={{ color: COLORS.gold }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-[#4274D9]/20"
                >
                  <s.icon size={22} color={COLORS.teal} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.navy }}>
                  {s.title}
                </h3>
                <p className="text-base leading-relaxed" style={{ color: COLORS.navy, opacity: 0.72 }}>
                  {s.body}
                </p>
                {i < steps.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-1/2 -right-3 w-6 h-[2px] bg-[#4274D9]/20"
                  />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Trust / Testimonials ---------- */
const TESTIMONIALS = [
  {
    quote:
      "Dulu kami sering dapat baju yang tidak muat siapa-siapa. Sekarang tinggal tulis kebutuhan, dan yang datang memang yang kami minta.",
    name: "Ibu Sri Wahyuni",
    role: "Pengurus, Panti Asuhan Nurul Iman",
  },
  {
    quote:
      "Saya suka bisa lihat fotonya waktu barang sudah sampai. Jadi tahu donasi saya benar-benar dipakai, bukan cuma transfer lalu hilang kabar.",
    name: "Pak Hartono",
    role: "Donatur sejak 2025",
  },
  {
    quote:
      "Tinggal ketik apa yang aku punya, langsung dikasih rekomendasi panti terdekat. Nggak ribet, langsung checkout.",
    name: "Aline",
    role: "Donatur, Jakarta",
  },
];

function Trust() {
  return (
    <section className="py-16 sm:py-24 bg-[#4274D9]/20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="flex items-center gap-2 mb-3">
            <BadgeCheck size={18} color={COLORS.navy} />
            <span className="text-sm font-semibold tracking-wide" style={{ color: COLORS.navy, opacity: 0.7 }}>
              DIPERCAYA PENGGUNA
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-medium mb-14" style={{ color: COLORS.navy }}>
            Cerita dari yang sudah menjalaninya
          </h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <div className="rounded-2xl p-7 h-full flex flex-col" style={{ backgroundColor: COLORS.cream }}>
                <Quote size={26} color={COLORS.gold} className="mb-4" />
                <p className="text-base leading-relaxed mb-6 flex-1" style={{ color: COLORS.navy, opacity: 0.85 }}>
                  {t.quote}
                </p>
                <div>
                  <p className="text-base font-semibold" style={{ color: COLORS.navy }}>
                    {t.name}
                  </p>
                  <p className="text-sm" style={{ color: COLORS.navy, opacity: 0.6 }}>
                    {t.role}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- For everyone / personas ---------- */
function ForEveryone() {
  const personas = [
    {
      title: "Untuk Pengurus Panti",
      body:
        "Daftarkan yayasan Anda, buat daftar kebutuhan dengan kuota pasti, dan konfirmasi barang datang cukup dengan satu foto.",
      points: ["Verifikasi legalitas terpercaya", "Kuota anti berlebih", "Notifikasi stok akan habis"],
      cta: "Daftarkan Panti",
      href: "#daftar-panti",
    },
    {
      title: "Untuk Donatur",
      body:
        "Temukan panti yang cocok dengan barang Anda, dapat kepastian barang diterima, dan lihat cerita dampaknya.",
      points: ["Chatbot pencari panti", "Resi & pelacakan langsung", "Bukti foto serah terima"],
      cta: "Mulai Donasi",
      href: "#mulai",
    },
  ];
  return (
    <section id="untuk-siapa" className="py-16 sm:py-24" style={{ backgroundColor: COLORS.cream }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl font-medium mb-14" style={{ color: COLORS.navy }}>
            Dibuat untuk semua pihak yang terlibat
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-8">
          {personas.map((p, i) => (
            <Reveal key={p.title} delay={i * 120}>
              <div className="rounded-2xl p-8 h-full flex flex-col bg-[#4274D9]/20">
                <h3 className="text-2xl font-medium mb-3" style={{ color: COLORS.navy }}>
                  {p.title}
                </h3>
                <p className="text-lg leading-relaxed mb-6" style={{ color: COLORS.navy, opacity: 0.78 }}>
                  {p.body}
                </p>
                <ul className="flex flex-col gap-3 mb-8">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-3">
                      <CheckCircle2 size={20} color={COLORS.teal} className="mt-0.5 shrink-0" />
                      <span className="text-base" style={{ color: COLORS.navy }}>
                        {pt}
                      </span>
                    </li>
                  ))}
                </ul>
                <a
                  href={p.href}
                  className="inline-flex items-center justify-center gap-2 text-base font-semibold px-6 py-3 rounded-full text-white hover:brightness-110 transition mt-auto self-start bg-[#4274D9] hover:bg-[#293681]"
                >
                  {p.cta} <ArrowRight size={18} />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Features, grouped by journey stage ---------- */
const FEATURE_GROUPS = [
  {
    label: "Sebelum Kirim",
    features: [
      {
        icon: MessageCircle,
        title: "Chatbot pencocok panti",
        body: "Ceritakan barang dan lokasi Anda dengan bahasa sehari-hari, AI menemukan panti yang tepat dalam hitungan detik.",
      },
      {
        icon: PackageCheck,
        title: "Kuota anti-berlebih",
        body: "Sistem mengunci kuota begitu terisi, jadi tidak ada lagi barang menumpuk melebihi kebutuhan.",
      },
    ],
  },
  {
    label: "Saat Perjalanan",
    features: [
      {
        icon: Camera,
        title: "Cek kelayakan otomatis",
        body: "Foto barang non-pangan diperiksa AI sebelum dikirim, agar hanya barang layak pakai yang sampai ke panti.",
      },
      {
        icon: TrendingUp,
        title: "Pelacakan langsung",
        body: "Status barang terlihat jelas: dipesan, dikirim, transit, hingga diterima — tanpa perlu bertanya.",
      },
    ],
  },
  {
    label: "Setelah Diterima",
    features: [
      {
        icon: Handshake,
        title: "Berbagi antar-panti",
        body: "Panti dengan stok berlebih bisa mengalihkannya ke panti terdekat yang masih membutuhkan.",
      },
      {
        icon: ShieldCheck,
        title: "Legalitas terverifikasi",
        body: "Setiap yayasan diverifikasi dokumennya oleh tim kami sebelum bisa membuka wishlist.",
      },
    ],
  },
];

function Features() {
  return (
    <section id="fitur" className="py-16 sm:py-24" style={{ backgroundColor: COLORS.cream }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl font-medium mb-4" style={{ color: COLORS.navy }}>
            Semua yang dibutuhkan agar donasi tepat guna
          </h2>
          <p className="text-lg max-w-4xl mb-14" style={{ color: COLORS.navy, opacity: 0.75 }}>
            Diurutkan sesuai perjalanan donasi Anda, dari sebelum kirim sampai barang sampai ke
            panti.
          </p>
        </Reveal>

        <div className="flex flex-col gap-12">
          {FEATURE_GROUPS.map((group, gi) => (
            <div key={group.label}>
              <Reveal delay={gi * 80}>
                <div className="flex items-center gap-3 mb-6">
                  <span
                    className="text-sm font-bold tabular-nums w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: COLORS.teal, color: COLORS.cream }}
                  >
                    {gi + 1}
                  </span>
                  <h3 className="text-lg font-semibold" style={{ color: COLORS.navy }}>
                    {group.label}
                  </h3>
                  <div className="flex-1 h-px bg-[#4274D9]/20"/>
                </div>
              </Reveal>
              <div className="grid sm:grid-cols-2 gap-6">
                {group.features.map((f, i) => (
                  <Reveal key={f.title} delay={gi * 80 + i * 100}>
                    <div
                      className="rounded-2xl p-6 h-full flex gap-5 hover:shadow-md transition-shadow border border-[#4274D9]/20"
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-[#4274D9]/20"
                      >
                        <f.icon size={22} color={COLORS.teal} />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2" style={{ color: COLORS.navy }}>
                          {f.title}
                        </h4>
                        <p className="text-base leading-relaxed" style={{ color: COLORS.navy, opacity: 0.72 }}>
                          {f.body}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Final CTA ---------- */
function FinalCTA() {
  return (
    <section id="mulai" className="py-16 sm:py-24" style={{ backgroundColor: COLORS.teal }}>
      <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl font-medium mb-5" style={{ color: "#ffffff" }}>
            Kuota masih terbuka. Mari lengkapi bersama.
          </h2>
          <p className="text-lg mb-9 max-w-xl mx-auto" style={{ color: "#ffffff", opacity: 0.9 }}>
            Baik Anda ingin menyumbang atau mendaftarkan yayasan, prosesnya singkat dan setiap
            langkah bisa dipantau.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href="#top"
              className="inline-flex items-center justify-center gap-2 text-lg font-semibold px-7 py-3 rounded-full hover:brightness-95 transition"
              style={{ backgroundColor: COLORS.cream, color: COLORS.navy }}
            >
              Jadi Donatur <ArrowRight size={20} />
            </a>
            <a
              href="#daftar-panti"
              className="inline-flex items-center justify-center gap-2 text-lg font-semibold px-7 py-3 rounded-full border-2 border-white text-white hover:bg-white/10 transition"
            >
              Daftarkan Yayasan
            </a>
          </div>
          <div
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#ffffff" }}
          >
            <ShieldCheck size={16} /> 320+ panti terverifikasi dokumennya oleh tim kami
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  const columns = [
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
  ];
  return (
    <footer style={{ backgroundColor: COLORS.navy }} className="pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <span className="text-2xl font-bold flex items-center gap-2" style={{ color: COLORS.cream }}>
              <img src="/images/logokb2.png" alt="Logo KawanBerbagi" className="w-8 h-8 object-contain bg-white rounded-full p-0.5 shadow-sm" />
              <span>KawanBerbagi<span style={{ color: COLORS.gold }}>.</span></span>
            </span>
            <p className="text-sm mt-4 max-w-xs leading-relaxed" style={{ color: COLORS.cream, opacity: 0.6 }}>
              Platform donasi demand-driven — mempertemukan barang yang Anda punya dengan
              kebutuhan yang benar-benar ada.
            </p>
          </div>
          {columns.map((col) => (
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
            © 2026 KawanBerbagi. Semua yayasan terverifikasi manual oleh tim kami.
          </p>
          <p className="text-sm" style={{ color: COLORS.cream, opacity: 0.5 }}>
            Donasi yang pas, tanpa mubazir.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Page ---------- */
export default function DonationLanding() {
  return (
    <div style={{ backgroundColor: COLORS.cream }}>
      <Nav />
      <Hero />
      <ActiveNeeds />
      <HowItWorks />
      <Trust />
      <ForEveryone />
      <Features />
      <FinalCTA />
      <Footer />
    </div>
  );
}