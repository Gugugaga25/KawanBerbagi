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
  Ban,
  HelpCircle,
  EyeOff,
} from "lucide-react";

const COLORS = {
  navy: "#293681",
  gold: "#F59E0B",
  mist: "#D0E7E6",
  teal: "#4274D9",
  cream: "#F8FAFC",
};

/* ---------- Interactive Particles Live Background ---------- */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

function InteractiveParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: Particle[] = [];
    const particleCount = Math.min(60, Math.floor((width * height) / 15000));
    const maxDistance = 120;
    const mouse = { x: -1000, y: -1000, radius: 150 };

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1.5,
        color: i % 2 === 0 ? "rgba(66, 116, 217, 0.2)" : "rgba(41, 54, 129, 0.12)",
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);
    
    // Bind to the parent container of the canvas for hover tracking
    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener("mousemove", handleMouseMove);
      parent.addEventListener("mouseleave", handleMouseLeave);
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Update & Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        if (mouse.x > -1000) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            p.x += Math.cos(angle) * force * 1.5;
            p.y += Math.sin(angle) * force * 1.5;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      // Draw lines between particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(66, 116, 217, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (parent) {
        parent.removeEventListener("mousemove", handleMouseMove);
        parent.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block pointer-events-none" />;
}

/* ---------- Before After Drag Slider ---------- */
function BeforeAfterSlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onClick={(e) => handleMove(e.clientX)}
      className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 select-none cursor-ew-resize bg-gray-100"
    >
      {/* BACKGROUND / BEFORE SECTION */}
      <div className="absolute inset-0 bg-[#FFF5F5] p-6 sm:p-8 flex flex-col justify-between">
        <div>
          <span className="inline-block bg-red-100 text-red-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Sebelum KawanBerbagi (Mubazir & Tidak Terarah)
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-red-950 mt-3 leading-snug">
            Barang Menumpuk, Kebutuhan Kritis Kosong
          </h3>
          <p className="text-red-900/80 mt-1.5 text-xs sm:text-sm max-w-md">
            Donasi dikirim acak tanpa info kebutuhan riil panti.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 max-w-lg">
          <div className="bg-white/95 backdrop-blur p-3.5 rounded-2xl border border-red-200 shadow-sm">
            <h4 className="font-bold text-red-950 text-xs sm:text-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              Oversupply Barang
            </h4>
            <p className="text-[11px] text-red-900/75 mt-1 leading-normal">Pakaian bekas & mie instan menumpuk hingga kadaluarsa, tapi beras kosong.</p>
          </div>
          <div className="bg-white/95 backdrop-blur p-3.5 rounded-2xl border border-red-200 shadow-sm">
            <h4 className="font-bold text-red-950 text-xs sm:text-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              Buta Informasi
            </h4>
            <p className="text-[11px] text-red-900/75 mt-1 leading-normal">Donatur tidak pernah mendapat kepastian penerimaan atau pemanfaatan barang.</p>
          </div>
        </div>

        <div className="text-[10px] text-red-900/60 mt-3 italic">
          *Mengakibatkan beban logistik berlebih di gudang panti asuhan.
        </div>
      </div>

      {/* FOREGROUND / AFTER SECTION (CLIPPED) */}
      <div
        className="absolute inset-0 bg-[#F4F9F9] p-6 sm:p-8 flex flex-col justify-between"
        style={{
          clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)`,
        }}
      >
        <div className="flex flex-col items-end text-right w-full">
          <span className="inline-block bg-[#4274D9]/10 text-[#4274D9] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Sesudah KawanBerbagi (Demand-Driven)
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-[#293681] mt-3 leading-snug max-w-md ml-auto">
            Kuota Terpenuhi Pas Sesuai Kebutuhan
          </h3>
          <p className="text-[#293681]/80 mt-1.5 text-xs sm:text-sm max-w-md ml-auto">
            Panti merilis wishlist spesifik, donatur mengisi kuota secara presisi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 ml-auto max-w-lg w-full">
          <div className="bg-white/95 backdrop-blur p-3.5 rounded-2xl border border-[#4274D9]/20 shadow-sm flex flex-col items-end text-right">
            <h4 className="font-bold text-[#293681] text-xs sm:text-sm flex items-center gap-1.5 justify-end">
              Penyaluran Tepat Sasaran
              <span className="w-1.5 h-1.5 rounded-full bg-[#4274D9]"></span>
            </h4>
            <p className="text-[11px] text-gray-500 mt-1 leading-normal">Kuota membatasi donasi berlebih dan dialihkan ke panti terdekat yang kosong.</p>
          </div>
          <div className="bg-white/95 backdrop-blur p-3.5 rounded-2xl border border-[#4274D9]/20 shadow-sm flex flex-col items-end text-right">
            <h4 className="font-bold text-[#293681] text-xs sm:text-sm flex items-center gap-1.5 justify-end">
              Transparansi Terlacak
              <span className="w-1.5 h-1.5 rounded-full bg-[#4274D9]"></span>
            </h4>
            <p className="text-[11px] text-gray-500 mt-1 leading-normal">Status terupdate real-time lengkap dengan bukti foto serah terima pengurus.</p>
          </div>
        </div>

        <div className="text-[10px] text-[#4274D9] mt-3 text-right font-medium">
          *Platform KawanBerbagi menjamin penyaluran efisien tanpa mubazir.
        </div>
      </div>

      {/* SLIDER BAR & HANDLE */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center pointer-events-none"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="w-10 h-10 bg-[#293681] text-white rounded-full shadow-xl border-2 border-white flex items-center justify-center font-bold select-none text-base pointer-events-auto transition-transform hover:scale-105">
          ↔
        </div>
      </div>
    </div>
  );
}


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
}// ================= KOMPONEN NAVIGASI =================
function Nav() {
    const [open, setOpen] = useState(false);
    const { auth } = usePage().props as any;
    const { url } = usePage(); 
    
    const [currentHash, setCurrentHash] = useState("");
  
    useEffect(() => {
      setCurrentHash(window.location.hash);
      const handleHashChange = () => setCurrentHash(window.location.hash);
      window.addEventListener("hashchange", handleHashChange);
      return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);
  
    const links = [
      { label: "Cara Kerja", href: "/#cara-kerja" },
      { label: "Untuk Siapa", href: "/#untuk-siapa" },
      { label: "Fitur", href: "/#fitur" },
      { label: "Profil Panti", href: "/profil-panti" },
      { label: "Tentang Kami", href: "/about" },
      { label: "FAQ", href: "/faq" },
    ];

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      // Jika link mengarah ke hash anchor dan kita berada di halaman utama
      if (href.includes("#") && (url === "/" || url.startsWith("/#"))) {
        const hashPart = href.substring(href.indexOf("#") + 1);
        const element = document.getElementById(hashPart);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", href);
          setCurrentHash(`#${hashPart}`);
          setOpen(false);
        }
      }
    };
  
    return (
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100/80 transition-all duration-300 shadow-sm"
      >
        <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
          <a 
            href="/#top" 
            onClick={(e) => handleNavClick(e, "/#top")}
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
          >
            <img src="/images/logokb2.png" alt="Logo KawanBerbagi" className="w-8 h-8 object-contain" />
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: COLORS.navy }}>
              KawanBerbagi
              <span className="text-[#4274D9]">.</span>
            </span>
          </a>
          
          {/* === MENU DEKSTOP === */}
          <div className="hidden md:flex items-center gap-8">
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
                  onClick={(e) => handleNavClick(e, l.href)}
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
            className="md:hidden px-5 pb-6 pt-2 flex flex-col gap-4 absolute left-0 right-0 w-full shadow-lg border-b border-slate-100 bg-white/95 backdrop-blur-md z-50"
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
                  onClick={(e) => handleNavClick(e, l.href)}
                  className={`text-base font-bold py-1.5 transition-colors ${
                    isActive ? "text-[#4274D9]" : "text-[#293681]"
                  }`}
                >
                  {l.label}
                </a>
              );
            })}

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-3">
              {auth?.user ? (
                <>
                  <Link
                    href={
                      auth.user.id_role_user === 'RL01ADM' ? route('admin.dashboard') :
                      auth.user.id_role_user === 'RL02PAN' ? route('panti.dashboard') :
                      route('donatur.dashboard')
                    }
                    className="w-full text-center text-sm font-bold py-3 rounded-full text-white bg-[#4274D9] shadow-md shadow-[#4274D9]/20"
                  >
                    Dashboard ({auth.user.name})
                  </Link>
                  <Link
                    href={route("logout")}
                    method="post"
                    as="button"
                    className="w-full text-center text-sm font-bold py-2.5 rounded-full text-[#293681] border border-[#293681]/30 hover:bg-slate-50"
                  >
                    Keluar
                  </Link>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <Link
                    href={route("login")}
                    className="w-full text-center text-sm font-bold py-3 rounded-full text-[#293681] border-2 border-[#293681] hover:bg-[#293681] hover:text-white transition-all"
                  >
                    Masuk
                  </Link>
                  <Link
                    href={route("register")}
                    className="w-full text-center text-sm font-bold py-3 rounded-full text-white bg-[#4274D9] shadow-md shadow-[#4274D9]/20 hover:bg-[#293681] transition-all"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    );
}

/* ---------- Hero ---------- */
function Hero() {
  const { auth } = usePage<any>().props;
  const donated = useCountUp(18000);
  const orphanages = useCountUp(320);
  const donors = useCountUp(5200);

  return (
    <section id="top" className="relative w-full max-w-full overflow-hidden pt-24 sm:pt-28 pb-16 sm:pb-24" style={{ backgroundColor: COLORS.cream }}>
      {/* Dynamic particles live background */}
      <InteractiveParticles />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <Reveal>
            <div className="max-w-xl">
              <h1
                className="text-2xl min-[380px]:text-3xl sm:text-5xl lg:text-6xl leading-[1.1] font-extrabold tracking-tight"
                style={{ color: COLORS.teal }}
              >
                ARSIP KEBAIKAN.
              </h1>
              <h1
                className="text-2xl min-[380px]:text-3xl sm:text-5xl lg:text-6xl leading-[1.1] font-extrabold tracking-tight mb-5"
                style={{ color: COLORS.navy }}
              >
                DONASI TEPAT SASARAN.
              </h1>
              <p
                className="text-sm sm:text-lg leading-relaxed mb-6 max-w-xl font-medium"
                style={{ color: COLORS.navy, opacity: 0.8 }}
              >
                Platform donasi berbasis kebutuhan panti asuhan yang transparan dan terukur.
                Kami mendokumentasikan setiap kebutuhan secara mendetail untuk memastikan amanah
                Anda tersalurkan ke tujuan yang tepat.
              </p>

              <div className="grid grid-cols-3 gap-2 sm:gap-8 mt-8">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold" style={{ color: COLORS.navy }}>
                    {orphanages}+
                  </h3>
                  <div className="w-8 sm:w-10 h-[3px] rounded-full my-1.5" style={{ background: COLORS.teal }} />
                  <p className="text-xs sm:text-sm font-semibold leading-tight" style={{ color: COLORS.navy, opacity: 0.6 }}>
                    Panti Terdaftar
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold" style={{ color: COLORS.navy }}>
                    {(donors / 1000).toFixed(1)}K
                  </h3>
                  <div className="w-8 sm:w-10 h-[3px] rounded-full my-1.5" style={{ background: COLORS.teal }} />
                  <p className="text-xs sm:text-sm font-semibold leading-tight" style={{ color: COLORS.navy, opacity: 0.6 }}>
                    Donatur Aktif
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold" style={{ color: COLORS.navy }}>
                    {Math.floor(donated / 1000)}K+
                  </h3>
                  <div className="w-8 sm:w-10 h-[3px] rounded-full my-1.5" style={{ background: COLORS.teal }} />
                  <p className="text-xs sm:text-sm font-semibold leading-tight" style={{ color: COLORS.navy, opacity: 0.6 }}>
                    Barang Tersalurkan
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3.5 mt-8 w-full">
                <Link
                  href={auth?.user ? "/dashboard" : "/login"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm sm:text-base font-bold px-6 py-3.5 rounded-full text-white hover:brightness-110 shadow-lg shadow-[#4274D9]/30 transition bg-[#4274D9] hover:bg-[#293681]"
                >
                  Cari Panti Terdekat <ArrowRight size={18} />
                </Link>
                <Link
                  href="/register?role=yayasan"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm sm:text-base font-bold px-6 py-3.5 rounded-full border-2 transition border-[#293681] text-[#293681] hover:bg-[#293681] hover:text-white"
                >
                  Daftarkan Panti Anda
                </Link>
              </div>
            </div>
          </Reveal>

          {/* MOBILE ILLUSTRATION (Compact Stack) */}
          <div className="lg:hidden mt-8 w-full max-w-md mx-auto">
            <Reveal delay={150}>
              <div className="flex flex-col gap-3.5">
                {/* Mockup Card 1: GPS Radar */}
                <div className="p-4 rounded-2xl bg-white/95 border border-gray-100 shadow-lg flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#4274D9]/10 flex items-center justify-center text-[#4274D9] shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#293681]">Panti Terdekat</h4>
                      <p className="text-[11px] text-[#4274D9] font-bold">Panti Asuhan Nurul Iman (1.2 km)</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-[#4274D9]/10 text-[#4274D9] px-2.5 py-1 rounded-full font-bold shrink-0">GPS Active</span>
                </div>

                {/* Mockup Card 2: Transactional Quota Lock */}
                <div className="p-4 rounded-2xl bg-[#293681] text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] bg-[#4274D9] text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Quota Locked</span>
                    <span className="text-[10px] text-gray-300">TRX-742</span>
                  </div>
                  <h4 className="font-bold text-sm leading-snug">Donasi 20 Box Susu Bayi</h4>
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <p className="text-[#F59E0B] font-bold flex items-center gap-1.5 text-[11px]">
                      <Truck size={13} /> Sedang Dikirim
                    </p>
                    <span className="text-white/80 font-bold text-[11px]">100% Terpenuhi</span>
                  </div>
                </div>

                {/* Mockup Card 3: Verification Badge */}
                <div className="p-3.5 rounded-2xl bg-white/95 border border-gray-100 shadow-md flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <ShieldCheck size={18} />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 font-medium">Sistem Platform KawanBerbagi</p>
                      <p className="text-xs font-extrabold text-emerald-700">100% Terverifikasi Resmi</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* DESKTOP ILLUSTRATION (3D Floating Cards) */}
          <div className="hidden lg:block">
            <Reveal delay={150}>
              <div className="relative h-[560px] flex items-center justify-center">
                {/* Background circular decorations with blur */}
                <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-[#4274D9]/10 blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full bg-[#F59E0B]/5 blur-3xl" />
                
                {/* Mockup Card 1: GPS Radar Illustration */}
                <div className="absolute left-10 top-10 w-64 p-5 rounded-3xl bg-white/95 border border-gray-100 shadow-2xl float-slow z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#4274D9]/10 flex items-center justify-center text-[#4274D9]">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#293681]">Panti Terdekat</h4>
                      <p className="text-[11px] text-[#4274D9] font-bold">Mencari via GPS...</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs p-2.5 rounded-2xl bg-gray-50 border border-gray-100">
                      <span className="font-semibold text-gray-700">Panti Asuhan Nurul Iman</span>
                      <span className="text-[10px] bg-[#4274D9]/10 text-[#4274D9] px-2 py-0.5 rounded-full font-bold">1.2 km</span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2.5 rounded-2xl bg-gray-50/50">
                      <span className="font-medium text-gray-400">Yayasan Kasih Ibu</span>
                      <span className="text-[10px] text-gray-400 px-2 py-0.5 font-semibold">3.8 km</span>
                    </div>
                  </div>
                </div>

                {/* Mockup Card 2: Transactional Quota Lock */}
                <div className="absolute right-6 bottom-10 w-72 p-5 rounded-3xl bg-[#293681] text-white shadow-2xl float-medium z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] bg-[#4274D9] text-[#ffffff] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Quota Locked</span>
                    <span className="text-xs text-gray-300">TRX-742</span>
                  </div>
                  <h4 className="font-bold text-base leading-snug">Donasi 20 Box Susu Bayi</h4>
                  <p className="text-[11px] text-gray-300 mt-1">Untuk Panti Asuhan Sayap Kasih</p>
                  
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Status Pengiriman</p>
                      <p className="text-xs font-bold text-[#F59E0B] flex items-center gap-1 mt-0.5">
                        <Truck size={14} /> Sedang Dikirim
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center font-bold text-xs text-white">
                      100%
                    </div>
                  </div>
                </div>

                {/* Mockup Card 3: Verification Badge / Impact Stats */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 p-4 rounded-2xl bg-white/95 border border-gray-100 shadow-xl float-fast flex items-center gap-3 z-10">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">Sistem Donasi</p>
                    <p className="text-xs font-extrabold text-emerald-700">100% Terverifikasi</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Problem Section ---------- */
function ProblemSection() {
  const problems = [
    {
      icon: Ban,
      title: "Penumpukan Barang (Oversupply)",
      body: "Panti kebanjiran barang tertentu secara berlebihan hingga mubazir dan kedaluwarsa.",
    },
    {
      icon: HelpCircle,
      title: "Kebutuhan Kritis Kosong",
      body: "Bahan pangan pokok dan susu harian sering kali kosong karena donatur tidak tahu kebutuhan riil.",
    },
    {
      icon: EyeOff,
      title: "Kurang Transparansi",
      body: "Donatur mengirim barang secara acak tanpa bukti serah terima atau kabar kelanjutan yang jelas.",
    },
  ];

  return (
    <section id="masalah" className="py-16 sm:py-24" style={{ backgroundColor: "#ffffff" }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold tracking-wide uppercase px-3 py-1 rounded-full bg-red-100 text-red-700">
                  Tantangan Donasi
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 leading-tight text-[#293681]">
                Mengapa Donasi Konvensional Sering Mubazir?
              </h2>
              <p className="text-base sm:text-lg mb-8 leading-relaxed text-gray-600">
                Niat baik Anda berisiko menjadi beban logistik bagi panti asuhan alih-alih menjadi bantuan yang tepat guna jika disalurkan tanpa data kebutuhan nyata.
              </p>
            </Reveal>

            <div className="flex flex-col gap-6">
              {problems.map((p, i) => (
                <Reveal key={p.title} delay={i * 100}>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-red-50 border border-red-100 text-red-600">
                      <p.icon size={20} />
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold mb-1 text-[#293681]">
                        {p.title}
                      </h4>
                      <p className="text-sm leading-relaxed text-gray-500">
                        {p.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={150}>
              <div className="text-center mb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Geser pemisah di bawah ini untuk melihat simulasi
                </p>
              </div>
              <BeforeAfterSlider />
            </Reveal>
          </div>
        </div>
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
  const { auth } = usePage<any>().props;
  const pct = Math.round((c.filled / c.total) * 100);
  return (
    <Reveal delay={delay}>
      <div
        className="rounded-3xl p-6 h-[340px] flex flex-col justify-between border border-white/20 bg-white/95 shadow-xl hover:shadow-2xl hover:shadow-[#4274D9]/25 hover:-translate-y-1.5 transition-all duration-300 group"
      >
        <div>
          <div className="flex items-center justify-between mb-4 h-10">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[#4274D9]/10 text-[#4274D9] group-hover:scale-110 transition-transform duration-300"
            >
              <PackageCheck size={20} />
            </div>
            {c.urgent ? (
              <span className="text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider bg-red-50 text-red-600 border border-red-100 animate-pulse">
                Mendesak
              </span>
            ) : (
              <span className="text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider bg-slate-100/80 text-slate-500 border border-slate-200/60">
                Biasa
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-extrabold mb-1 text-[#293681] group-hover:text-[#4274D9] transition-colors truncate">
            {c.item}
          </h3>
          <p className="text-xs flex items-center gap-1 text-gray-500 font-medium truncate">
            <MapPin size={13} className="text-[#4274D9] shrink-0" /> <span className="truncate">{c.name} · {c.location}</span>
          </p>
        </div>

        <div className="mt-auto pt-4">
          <div className="flex justify-between text-xs mb-2 font-bold text-gray-500 tabular-nums">
            <span>Terpenuhi</span>
            <span>
              {c.filled}/{c.total} {c.unit} ({pct}%)
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden mb-5 bg-gray-100">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#4274D9] to-[#293681]" 
              style={{ width: `${pct}%`, transition: "width 1s ease-out" }} 
            />
          </div>
          <Link
            href={auth?.user ? "/dashboard" : "/login"}
            className="inline-flex items-center justify-center gap-2 text-sm font-bold w-full py-3 rounded-full text-white bg-[#4274D9] shadow-md shadow-[#4274D9]/25 hover:bg-[#293681] hover:shadow-lg transition-all duration-300"
          >
            Penuhi Kuota <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

function ActiveNeeds() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollRef.current && window.innerWidth < 1024) {
        scrollRef.current.scrollTo({ left: 80, behavior: "smooth" });
        setTimeout(() => {
          scrollRef.current?.scrollTo({ left: 0, behavior: "smooth" });
        }, 800);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative overflow-hidden py-16 sm:py-24" style={{ background: "linear-gradient(180deg, #18224B 0%, #293681 100%)" }}>
      {/* Background radial glowing circles */}
      <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#4274D9]/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-90 h-90 rounded-full bg-[#F59E0B]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <Reveal>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} color={COLORS.gold} />
            <span className="text-xs font-bold tracking-wider uppercase text-[#F59E0B]">
              KEBUTUHAN AKTIF PANTI
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-[#F8FAFC]">
            Barang yang Ditunggu Hari Ini
          </h2>
          <p className="text-base sm:text-lg mb-10 max-w-2xl text-gray-300 leading-relaxed">
            Daftar wishlist kebutuhan riil dengan kuota transaksi terkunci aman. Salurkan sumbangan Anda ke panti terverifikasi.
          </p>
        </Reveal>

        <div
          ref={scrollRef}
          className="flex lg:grid lg:grid-cols-4 gap-5 sm:gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0 scroll-smooth"
        >
          {CAMPAIGNS.map((c, i) => (
            <div key={c.item} className="w-[280px] sm:w-[320px] lg:w-auto shrink-0 snap-start">
              <CampaignCard c={c} delay={i * 100} />
            </div>
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
    <section id="cara-kerja" className="relative overflow-hidden py-16 sm:py-24 bg-[#F8FAFC]">
      {/* Subtle backdrop mesh */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#4274D9]/5 blur-3xl pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-[#293681] tracking-tight">
              Empat Langkah Menuju Dampak Nyata
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">
              Mulai berbagi secara transparan tanpa tebak-tebak. Pilih peran Anda untuk melihat alurnya.
            </p>

            <div
              className="inline-flex p-1.5 rounded-full bg-[#4274D9]/10 border border-[#4274D9]/5 shadow-inner"
              role="tablist"
              aria-label="Pilih alur"
            >
              <button
                role="tab"
                aria-selected={role === "donatur"}
                onClick={() => setRole("donatur")}
                className="text-sm font-bold px-6 py-3 rounded-full transition-all duration-300 shadow-sm"
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
                className="text-sm font-bold px-6 py-3 rounded-full transition-all duration-300 shadow-sm"
                style={{
                  backgroundColor: role === "panti" ? COLORS.teal : "transparent",
                  color: role === "panti" ? COLORS.cream : COLORS.navy,
                }}
              >
                Sebagai Pengelola Panti
              </button>
            </div>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <Reveal key={`${role}-${s.title}`} delay={i * 100}>
              <div
                className="rounded-3xl p-6 h-full relative border border-slate-100 bg-white shadow-xl hover:shadow-2xl hover:shadow-[#4274D9]/10 hover:-translate-y-1.5 transition-all duration-300 group"
              >
                <div className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] inline-block uppercase tracking-wider mb-4">
                  Langkah {String(i + 1).padStart(2, "0")}
                </div>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-[#4274D9]/10 text-[#4274D9] group-hover:scale-110 transition-transform duration-300"
                >
                  <s.icon size={22} />
                </div>
                <h3 className="text-lg font-extrabold mb-2.5 text-[#293681] group-hover:text-[#4274D9] transition-colors">
                  {s.title}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-500 font-medium">
                  {s.body}
                </p>
                {i < steps.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-1/2 -right-3.5 w-7 h-[2px] bg-slate-100 group-hover:bg-[#4274D9]/25 transition-colors z-20"
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
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollRef.current && window.innerWidth < 1024) {
        scrollRef.current.scrollTo({ left: 80, behavior: "smooth" });
        setTimeout(() => {
          scrollRef.current?.scrollTo({ left: 0, behavior: "smooth" });
        }, 800);
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-[#F8FAFC]">
      {/* Background decoration blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#4274D9]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="flex items-center justify-center gap-2 mb-3">
              <BadgeCheck size={18} className="text-[#4274D9]" />
              <span className="text-xs font-bold tracking-wider uppercase text-gray-400">
                DIPERCAYA PENGGUNA
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#293681] tracking-tight">
              Cerita Sukses Bersama KawanBerbagi
            </h2>
          </div>
        </Reveal>

        <div
          ref={scrollRef}
          className="flex lg:grid lg:grid-cols-3 gap-5 sm:gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0 scroll-smooth"
        >
          {TESTIMONIALS.map((t, i) => {
            const initials = t.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase();

            return (
              <div key={t.name} className="w-[285px] sm:w-[340px] lg:w-auto shrink-0 snap-start">
                <Reveal delay={i * 100}>
                  <div className="rounded-3xl p-8 h-full flex flex-col border border-slate-100 bg-white shadow-xl hover:shadow-2xl hover:shadow-[#4274D9]/15 hover:-translate-y-1.5 transition-all duration-300 relative">
                    <Quote size={28} className="text-[#F59E0B]/20 mb-4 self-start" />
                    <p className="text-xs sm:text-sm leading-relaxed mb-6 flex-1 text-gray-500 font-medium italic">
                      "{t.quote}"
                    </p>

                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                      <div className="w-10 h-10 rounded-full bg-[#4274D9]/10 text-[#4274D9] flex items-center justify-center font-extrabold text-xs shrink-0">
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-[#293681] leading-tight">
                          {t.name}
                        </p>
                        <p className="text-xs text-gray-400 font-semibold mt-0.5 leading-none">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            );
          })}
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
      body: "Daftarkan yayasan, buat wishlist kuota kebutuhan riil, dan konfirmasi barang tiba cukup dengan sekali foto.",
      points: ["Verifikasi legalitas terpercaya", "Kuota anti-mubazir", "Notifikasi stok menipis otomatis"],
      cta: "Daftarkan Panti",
      href: "/register?role=yayasan",
    },
    {
      title: "Untuk Donatur",
      body: "Temukan panti terdekat via GPS, dapatkan kepastian kuota terkunci, dan lacak status donasi secara transparan.",
      points: ["Pencarian panti terdekat via GPS", "Pelacakan resi real-time", "Bukti foto serah terima langsung"],
      cta: "Mulai Donasi",
      href: "/register?role=donatur",
    },
  ];
  return (
    <section id="untuk-siapa" className="relative overflow-hidden py-16 sm:py-24 bg-white">
      {/* Subtle decoration gradient */}
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#F59E0B]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#293681] tracking-tight">
              Dibuat untuk Semua Pihak yang Terlibat
            </h2>
            <p className="text-base text-gray-500 mt-4 leading-relaxed font-medium">
              KawanBerbagi menghubungkan kebaikan donatur dengan kebutuhan nyata panti asuhan secara adil dan teratur.
            </p>
          </div>
        </Reveal>
        
        <div className="grid md:grid-cols-2 gap-8">
          {personas.map((p, i) => (
            <Reveal key={p.title} delay={i * 120}>
              <div 
                className="rounded-3xl p-8 h-full flex flex-col border border-slate-100 bg-white shadow-xl hover:shadow-2xl hover:shadow-[#4274D9]/15 hover:-translate-y-1 transition-all duration-300 group"
              >
                <h3 className="text-2xl font-extrabold mb-3 text-[#293681] group-hover:text-[#4274D9] transition-colors">
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500 mb-6 font-medium">
                  {p.body}
                </p>
                <ul className="flex flex-col gap-3.5 mb-8">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-[#4274D9] mt-0.5 shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-gray-600">
                        {pt}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.href}
                  className="inline-flex items-center justify-center gap-2 text-sm font-bold px-6 py-3 rounded-full text-white bg-[#4274D9] shadow-md shadow-[#4274D9]/25 hover:bg-[#293681] hover:shadow-lg transition-all duration-300 mt-auto self-start"
                >
                  {p.cta} <ArrowRight size={16} />
                </Link>
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
        icon: MapPin,
        title: "Pencarian Radius Terdekat",
        body: "Temukan daftar kebutuhan panti asuhan di radius terdekat dari lokasi GPS Anda secara real-time.",
      },
      {
        icon: PackageCheck,
        title: "Sistem Kunci Kuota",
        body: "Sistem mengunci kuota barang setelah checkout untuk mencegah kelebihan pasokan di panti.",
      },
    ],
  },
  {
    label: "Saat Perjalanan",
    features: [
      {
        icon: Truck,
        title: "Pilihan Ekspedisi / Mandiri",
        body: "Kirim barang menggunakan kurir pilihan Anda (dengan nomor resi) atau antar sendiri langsung ke lokasi.",
      },
      {
        icon: TrendingUp,
        title: "Pelacakan Status Transparan",
        body: "Pantau status pengiriman barang dari dipesan, dikirim, transit, hingga diterima langsung di dashboard Anda.",
      },
    ],
  },
  {
    label: "Setelah Diterima",
    features: [
      {
        icon: Camera,
        title: "Bukti Foto Serah Terima",
        body: "Pengurus panti mengunggah foto dokumentasi serah terima barang begitu donasi tiba sebagai konfirmasi sah.",
      },
      {
        icon: ShieldCheck,
        title: "Dokumen Legal Terverifikasi",
        body: "Setiap panti asuhan diperiksa berkas legalitas hukumnya oleh Admin demi menjamin kepercayaan donatur.",
      },
    ],
  },
];

function Features() {
  return (
    <section id="fitur" className="relative overflow-hidden py-16 sm:py-24 bg-[#F8FAFC]">
      {/* Subtle backdrop circle decoration */}
      <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#4274D9]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#293681] tracking-tight">
              Fitur Lengkap untuk Penyaluran Tepat
            </h2>
            <p className="text-base text-gray-500 mt-4 leading-relaxed font-medium">
              Didukung oleh sistem pintar untuk menjamin setiap barang donasi Anda sampai ke penerima yang tepat tanpa sia-sia.
            </p>
          </div>
        </Reveal>

        <div className="flex flex-col gap-12">
          {FEATURE_GROUPS.map((group, gi) => (
            <div key={group.label}>
              <Reveal delay={gi * 80}>
                <div className="flex items-center gap-3.5 mb-6">
                  <span
                    className="text-xs font-extrabold w-7 h-7 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: COLORS.teal }}
                  >
                    {gi + 1}
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#293681]">
                    {group.label}
                  </h3>
                  <div className="flex-1 h-px bg-slate-200/80"/>
                </div>
              </Reveal>
              <div className="grid sm:grid-cols-2 gap-6">
                {group.features.map((f, i) => (
                  <Reveal key={f.title} delay={gi * 80 + i * 100}>
                    <div
                      className="rounded-3xl p-6 h-full flex gap-5 border border-slate-100 bg-white shadow-xl hover:shadow-2xl hover:shadow-[#4274D9]/10 hover:-translate-y-1 transition-all duration-300 group"
                    >
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-[#4274D9]/10 text-[#4274D9] group-hover:scale-110 transition-transform duration-300"
                      >
                        <f.icon size={22} />
                      </div>
                      <div>
                        <h4 className="text-lg font-extrabold mb-2 text-[#293681] group-hover:text-[#4274D9] transition-colors">
                          {f.title}
                        </h4>
                        <p className="text-xs sm:text-sm leading-relaxed text-gray-500 font-medium">
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
    <section id="mulai" className="relative overflow-hidden py-16 sm:py-24" style={{ background: "linear-gradient(135deg, #18224B 0%, #4274D9 100%)" }}>
      {/* Glow decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[#F59E0B]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center relative z-10">
        <Reveal>
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-5 tracking-tight text-white leading-tight">
            Kuota Masih Terbuka.<br />Mari Lengkapi Bersama.
          </h2>
          <p className="text-base sm:text-lg mb-10 max-w-xl mx-auto text-white/80 leading-relaxed font-semibold">
            Baik Anda ingin menyumbang barang atau mendaftarkan panti asuhan, prosesnya singkat dan setiap langkah terpantau transparan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link
              href="/register?role=donatur"
              className="inline-flex items-center justify-center gap-2 text-base font-bold px-8 py-4 rounded-full text-[#293681] bg-white shadow-xl hover:shadow-2xl hover:shadow-white/20 hover:-translate-y-0.5 transition-all duration-300"
            >
              Jadi Donatur <ArrowRight size={20} />
            </Link>
            <Link
              href="/register?role=yayasan"
              className="inline-flex items-center justify-center gap-2 text-base font-bold px-8 py-4 rounded-full border-2 border-white/60 text-white hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300"
            >
              Daftarkan Yayasan
            </Link>
          </div>
          <div
            className="inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-full border border-white/10"
            style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "#ffffff" }}
          >
            <ShieldCheck size={16} className="text-[#F59E0B]" /> 320+ Panti asuhan telah terverifikasi secara hukum oleh tim kami
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  const { auth } = usePage<any>().props;
  const columns = [
    {
      title: "Untuk Donatur",
      links: [
        { name: "Cari Panti", href: auth?.user ? "/dashboard" : "/login" },
        { name: "Lacak Donasi", href: auth?.user ? "/dashboard" : "/login" },
        { name: "Riwayat Dampak", href: auth?.user ? "/dashboard" : "/login" },
      ],
    },
    {
      title: "Untuk Panti",
      links: [
        { name: "Daftarkan Yayasan", href: "/register?role=yayasan" },
        { name: "Buat Wishlist", href: auth?.user ? "/dashboard" : "/register?role=yayasan" },
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
  ];
  return (
    <footer style={{ backgroundColor: COLORS.navy }} className="pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <span className="text-2xl font-bold flex items-center gap-2" style={{ color: COLORS.cream }}>
              <img src="/images/logokb2_white.png" alt="Logo KawanBerbagi" className="w-8 h-8 object-contain" />
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
  );
}

/* ---------- Page ---------- */
export default function DonationLanding() {
  return (
    <div style={{ backgroundColor: COLORS.cream }} className="w-full max-w-full overflow-x-hidden font-sans">
      <Nav />
      <Hero />
      <ProblemSection />
      <ActiveNeeds />
      <HowItWorks />
      <ForEveryone />
      <Features />
      <Trust />
      <FinalCTA />
      <Footer />
    </div>
  );
}