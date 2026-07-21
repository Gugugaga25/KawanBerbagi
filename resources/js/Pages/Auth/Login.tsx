import React, { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import InlineSpinner from "@/Components/UI/InlineSpinner";

const COLORS = {
  navy: "#293681",
  gold: "#F59E0B",
  mist: "#D0E7E6",
  teal: "#4274D9",
  cream: "#F8FAFC",
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const isFormValid = Boolean(data.email && data.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(e.target.name as any, e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/login', {
      onFinish: () => reset('password'),
    });
  };

  return (
    <div style={{ backgroundColor: COLORS.cream }}>
      {/* ======================= MOBILE / TABLET (< lg) — card layout ======================= */}
      <div
        className="lg:hidden min-h-screen flex flex-col items-center justify-center font-sans relative overflow-hidden p-4 sm:p-6"
        style={{ backgroundColor: COLORS.cream }}
      >
        {/* Dekorasi Background */}
        <div
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-30 blur-3xl pointer-events-none"
          style={{ backgroundColor: COLORS.mist }}
        />
        <div
          className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ backgroundColor: COLORS.teal }}
        />

        {/* Tombol Kembali */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20">
          {/* @ts-ignore */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full backdrop-blur-md transition-all duration-200 border hover:opacity-80 shadow-sm"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              borderColor: "rgba(192, 213, 214, 0.5)",
              color: COLORS.navy,
            }}
          >
            <ArrowLeft size={16} /> Kembali
          </Link>
        </div>

        {/* Container Utama Form */}
        <div className="w-full max-w-md z-10 flex flex-col gap-6 mt-12 sm:mt-0">
          {/* Logo Brand */}
          <div className="text-center flex justify-center w-full">
            <div className="inline-flex flex-col items-center justify-center gap-1 text-center">
              <img src="images/logokb1.png" alt="Logo KawanBerbagi" className="w-16 h-16 object-contain" />
              <span className="text-3xl font-bold tracking-tight" style={{ color: COLORS.navy }}>
                KawanBerbagi
                <span style={{ color: COLORS.teal }}>.</span>
              </span>
              <p className="text-sm mb-2" style={{ color: COLORS.navy }}>
                Arsip Kebaikan. Donasi Tepat Sasaran.
              </p>
            </div>
          </div>

          {/* Card Putih */}
          <div
            className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border"
            style={{ borderColor: "rgba(192, 213, 214, 0.3)" }}
          >
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: COLORS.navy }}>
                Selamat Datang
              </h1>
              <p className="text-sm" style={{ color: COLORS.navy, opacity: 0.65 }}>
                Silakan masuk untuk mengelola aktivitas kebaikan Anda.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Error Message */}
              {errors.email && (
                <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-semibold text-center border border-red-200">
                  Email atau password tidak sesuai
                </div>
              )}

              {/* Input Email */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.navy }}>
                  Alamat Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} style={{ color: COLORS.navy, opacity: 0.4 }} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="nama@email.com"
                    value={data.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 border focus:border-[#4274D9] focus:ring-2 focus:ring-[#4274D9]/20 font-semibold"
                    style={{
                      backgroundColor: "#f9fafb",
                      borderColor: COLORS.mist,
                      color: COLORS.navy,
                    }}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.email}</p>}
              </div>

              {/* Input Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold" style={{ color: COLORS.navy }}>
                    Kata Sandi
                  </label>
                  {/* @ts-ignore */}
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold hover:opacity-80 transition-opacity"
                    style={{ color: COLORS.teal }}
                  >
                    Lupa sandi?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} style={{ color: COLORS.navy, opacity: 0.4 }} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="••••••••"
                    value={data.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-12 py-3 rounded-xl text-sm outline-none transition-all duration-200 border focus:border-[#4274D9] focus:ring-2 focus:ring-[#4274D9]/20 font-semibold"
                    style={{
                      backgroundColor: "#f9fafb",
                      borderColor: COLORS.mist,
                      color: COLORS.navy,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:opacity-70 transition-opacity"
                    style={{ color: COLORS.navy, opacity: 0.4 }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.password}</p>}
              </div>

              {/* Tombol Submit */}
              <button
                type="submit"
                disabled={processing || !isFormValid}
                className={`mt-2 w-full inline-flex items-center justify-center gap-2 text-base font-bold py-3 rounded-xl text-white transition shadow-md ${
                  isFormValid 
                    ? 'bg-[#4274D9] hover:bg-[#293681] shadow-[#4274D9]/20 cursor-pointer' 
                    : 'bg-gray-300 text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                {processing ? <InlineSpinner color="white" size="sm" /> : null}
                <span>{processing ? "Memeriksa Kredensial..." : "Masuk ke Akun"}</span>
                {!processing && <ArrowRight size={18} />}
              </button>
            </form>

            {/* Navigasi Daftar */}
            <div className="mt-8 pt-6 text-center border-t border-gray-100">
              <p className="text-sm" style={{ color: COLORS.navy, opacity: 0.75 }}>
                Belum punya akun?{" "}
                {/* @ts-ignore */}
                <Link
                  href="/register"
                  className="font-bold hover:underline"
                  style={{ color: COLORS.teal }}
                >
                  Daftar sekarang
                </Link>
              </p>
            </div>
          </div>

          {/* Footer Kecil */}
          <p className="text-center text-xs" style={{ color: COLORS.navy, opacity: 0.4 }}>
            &copy; {new Date().getFullYear()} KawanBerbagi. All rights reserved.
          </p>
        </div>
      </div>

      {/* ======================= DESKTOP (lg+) — split panel layout ======================= */}
      <div className="hidden lg:flex min-h-screen font-sans">
        {/* Kiri: Sisi Form */}
        <div className="w-1/2 flex flex-col justify-center px-24 xl:px-32 relative z-10">
          <div className="absolute top-8 left-8">
            {/* @ts-ignore */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full backdrop-blur-md transition-all duration-200 border hover:opacity-80 shadow-sm"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                borderColor: "rgba(192, 213, 214, 0.5)",
                color: COLORS.navy,
              }}
            >
              <ArrowLeft size={16} /> Kembali
            </Link>
          </div>

          <div className="max-w-md w-full">
            <h1 className="text-5xl font-bold mb-3" style={{ color: COLORS.navy }}>
              Masuk
            </h1>
            <p className="text-base mb-10" style={{ color: COLORS.navy, opacity: 0.75 }}>
              Lanjutkan akses ke dashboard Anda untuk mengelola aktivitas dengan aman dan transparan.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Error Message */}
              {errors.email && (
                <div className="bg-red-50 text-red-500 p-3.5 rounded-xl text-sm font-semibold text-center border border-red-200">
                  Email atau password tidak sesuai
                </div>
              )}

              {/* Input Email */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.navy }}>
                  Alamat Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} style={{ color: COLORS.navy, opacity: 0.5 }} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="nama@email.com"
                    value={data.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-base outline-none transition-all duration-200 border focus:border-[#4274D9] focus:ring-2 focus:ring-[#4274D9]/20 font-semibold"
                    style={{
                      backgroundColor: "#ffffff",
                      borderColor: COLORS.mist,
                      color: COLORS.navy,
                    }}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.email}</p>}
              </div>

              {/* Input Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold" style={{ color: COLORS.navy }}>
                    Kata Sandi
                  </label>
                  {/* @ts-ignore */}
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium hover:opacity-80 transition-opacity"
                    style={{ color: COLORS.teal }}
                  >
                    Lupa sandi?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} style={{ color: COLORS.navy, opacity: 0.5 }} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="••••••••"
                    value={data.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl text-base outline-none transition-all duration-200 border focus:border-[#4274D9] focus:ring-2 focus:ring-[#4274D9]/20 font-semibold"
                    style={{
                      backgroundColor: "#ffffff",
                      borderColor: COLORS.mist,
                      color: COLORS.navy,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:opacity-70 transition-opacity"
                    style={{ color: COLORS.navy, opacity: 0.5 }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.password}</p>}
              </div>

              {/* Tombol Submit */}
              <button
                type="submit"
                disabled={processing || !isFormValid}
                className={`mt-4 w-full inline-flex items-center justify-center gap-2 text-base font-bold py-3.5 rounded-full text-white transition shadow-md ${
                  isFormValid 
                    ? 'bg-[#4274D9] hover:bg-[#293681] shadow-[#4274D9]/20 cursor-pointer' 
                    : 'bg-gray-300 text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                {processing ? <InlineSpinner color="white" size="sm" /> : null}
                <span>{processing ? "Memeriksa Kredensial..." : "Masuk Sekarang"}</span>
                {!processing && <ArrowRight size={20} />}
              </button>
            </form>

            {/* Navigasi Daftar */}
            <div className="mt-8 text-center">
              <p className="text-base" style={{ color: COLORS.navy, opacity: 0.75 }}>
                Belum punya akun?{" "}
                {/* @ts-ignore */}
                <Link
                  href="/register"
                  className="font-bold hover:underline"
                  style={{ color: COLORS.navy }}
                >
                  Daftar di sini
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Kanan: Visual / Ilustrasi */}
        <div
          className="w-1/2 relative overflow-hidden flex items-center justify-center p-12"
          style={{ backgroundColor: COLORS.navy }}
        >
          {/* Logo pojok kanan atas */}
          <div className="absolute top-10 right-10 xl:right-14">
            {/* @ts-ignore */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold" style={{ color: COLORS.cream }}>
                KawanBerbagi
                <span style={{ color: COLORS.gold }}>.</span>
              </span>
            </Link>
          </div>

          {/* Dekorasi Background */}
          <div
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20"
            style={{ backgroundColor: COLORS.teal }}
          />
          <div
            className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-10"
            style={{ backgroundColor: COLORS.mist }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full opacity-5"
            style={{ border: `2px solid ${COLORS.gold}` }}
          />

          {/* Konten Kanan */}
          <div className="relative z-10 max-w-lg w-full">
            <h2 className="text-3xl xl:text-4xl font-medium mb-6 leading-tight" style={{ color: COLORS.cream }}>
              Selamat Datang Kembali
            </h2>

            <p className="text-lg leading-relaxed mb-10" style={{ color: COLORS.mist }}>
              Pantau perjalanan donasi Anda hingga tiba di panti, atau kelola pembaruan kebutuhan yayasan Anda secara real-time melalui dashboard.
            </p>

            <div
              className="p-6 rounded-2xl backdrop-blur-sm"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", border: `1px solid rgba(192, 213, 214, 0.15)` }}
            >
              <div className="flex items-center gap-6 sm:gap-10">
                <div>
                  <p className="text-2xl font-bold" style={{ color: COLORS.cream }}>320+</p>
                  <p className="text-xs font-medium mt-1 uppercase tracking-wide" style={{ color: COLORS.mist }}>Yayasan</p>
                </div>
                <div className="w-px h-10" style={{ backgroundColor: "rgba(192, 213, 214, 0.2)" }}></div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: COLORS.cream }}>5.2K</p>
                  <p className="text-xs font-medium mt-1 uppercase tracking-wide" style={{ color: COLORS.mist }}>Donatur</p>
                </div>
                <div className="w-px h-10" style={{ backgroundColor: "rgba(192, 213, 214, 0.2)" }}></div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: COLORS.cream }}>18K+</p>
                  <p className="text-xs font-medium mt-1 uppercase tracking-wide" style={{ color: COLORS.mist }}>Tersalurkan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}