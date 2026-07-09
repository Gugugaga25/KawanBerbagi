import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Building2,
  Users,
  FileText,
  ImagePlus,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Heart,
} from "lucide-react";

const COLORS = {
  navy: "#083A4F",
  gold: "#A58D66",
  mist: "#C0D5D6",
  teal: "#407E8C",
  cream: "#E5E1DD",
};

type Role = "donatur" | "yayasan";

/* ---------- Small reusable field wrapper ---------- */
function Field({
  icon: Icon,
  label,
  action,
  children,
}: {
  icon: React.ElementType;
  label: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-semibold" style={{ color: COLORS.navy }}>
          {label}
        </label>
        {action}
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon size={18} style={{ color: COLORS.navy, opacity: 0.45 }} />
        </div>
        {children}
      </div>
    </div>
  );
}

const inputBase =
  "w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 border focus:border-[#407E8C]";
const inputStyle = { backgroundColor: "#ffffff", borderColor: COLORS.mist, color: COLORS.navy };

/* ---------- File upload field ---------- */
function FileField({
  icon: Icon,
  label,
  hint,
  required,
  file,
  onChange,
}: {
  icon: React.ElementType;
  label: string;
  hint?: string;
  required?: boolean;
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.navy }}>
        {label} {required && <span style={{ color: COLORS.gold }}>*</span>}
      </label>
      <label
        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-dashed cursor-pointer transition hover:opacity-80"
        style={{ borderColor: COLORS.mist, backgroundColor: "#f9fafb" }}
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: COLORS.mist }}
        >
          <Icon size={16} color={COLORS.teal} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: COLORS.navy }}>
            {file ? file.name : "Klik untuk unggah file"}
          </p>
          {hint && (
            <p className="text-xs" style={{ color: COLORS.navy, opacity: 0.5 }}>
              {hint}
            </p>
          )}
        </div>
        <input
          type="file"
          className="hidden"
          required={required}
          accept="image/*,.pdf"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </label>
    </div>
  );
}

export default function Register() {
  const [role, setRole] = useState<Role>("donatur");
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [donaturData, setDonaturData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    password: "",
    confirm: "",
    agree: false,
  });

  const [yayasanData, setYayasanData] = useState({
    orgName: "",
    email: "",
    phone: "",
    picName: "",
    address: "",
    beneficiaries: "",
    password: "",
    confirm: "",
    agree: false,
  });
  const [legalDoc, setLegalDoc] = useState<File | null>(null);
  const [orgPhoto, setOrgPhoto] = useState<File | null>(null);

  const switchRole = () => {
    setRole((r) => (r === "donatur" ? "yayasan" : "donatur"));
    setSubmitted(false);
    
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit register", role === "donatur" ? donaturData : { ...yayasanData, legalDoc, orgPhoto });
    setSubmitted(true);
  };

  const formOnRight = role === "yayasan";

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row font-sans"
      style={{ backgroundColor: COLORS.cream }}
    >
      {/* ======================= FORM PANEL (scrolls independently) ======================= */}
      <div
        className={`w-full lg:w-1/2 relative ${
          formOnRight ? "lg:order-2" : "lg:order-1"
        }`}
      >
        <div className="px-6 sm:px-10 lg:px-20 xl:px-28 pt-10 sm:pt-12 lg:pt-16 pb-14">
          <div className="mb-8 sm:mb-10">
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

          <div className="max-w-md w-full mx-auto">
          {submitted ? (
            role === "yayasan" ? (
              /* ---------- YAYASAN: pending verification ---------- */
              <div>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: COLORS.mist }}
                >
                  <CheckCircle2 size={28} color={COLORS.teal} />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: COLORS.navy }}>
                  Pendaftaran Berhasil!
                </h1>
                <p className="text-base leading-relaxed mb-8" style={{ color: COLORS.navy, opacity: 0.75 }}>
                  Terima kasih telah mendaftarkan <strong>{yayasanData.orgName || "yayasan Anda"}</strong>.
                  Tim kami akan meninjau dokumen legalitas yang Anda unggah dalam{" "}
                  <strong>1–3 hari kerja</strong>.
                </p>

                {/* mini status timeline */}
                <div
                  className="rounded-2xl p-6 mb-6"
                  style={{ backgroundColor: "#ffffff", border: `1px solid ${COLORS.mist}` }}
                >
                  <div className="flex items-center justify-between relative">
                    <div
                      className="absolute top-[18px] left-[18px] right-[18px] h-[2px]"
                      style={{ backgroundColor: COLORS.mist }}
                    />
                    <div className="flex flex-col items-center gap-2 relative z-10 text-center flex-1">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: COLORS.teal }}
                      >
                        <CheckCircle2 size={18} color="#fff" />
                      </div>
                      <span className="text-xs font-semibold" style={{ color: COLORS.navy }}>
                        Diterima
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-2 relative z-10 text-center flex-1">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center animate-pulse"
                        style={{ backgroundColor: COLORS.gold }}
                      >
                        <Clock size={18} color="#fff" />
                      </div>
                      <span className="text-xs font-semibold" style={{ color: COLORS.navy }}>
                        Ditinjau Admin
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-2 relative z-10 text-center flex-1">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center border-2"
                        style={{ borderColor: COLORS.mist, backgroundColor: "#fff" }}
                      >
                        <ShieldCheck size={18} color={COLORS.mist} />
                      </div>
                      <span className="text-xs font-semibold" style={{ color: COLORS.navy, opacity: 0.5 }}>
                        Terverifikasi
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm mb-8" style={{ color: COLORS.navy, opacity: 0.6 }}>
                  Status verifikasi akan kami kirim ke{" "}
                  <strong style={{ opacity: 1 }}>{yayasanData.email || "email Anda"}</strong>, dan juga bisa
                  Anda cek kembali di halaman ini kapan saja.
                </p>

                {/* @ts-ignore */}
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 w-full text-base font-semibold py-3.5 rounded-full text-white hover:brightness-110 transition"
                  style={{ backgroundColor: COLORS.navy }}
                >
                  Kembali ke Beranda
                </Link>
              </div>
            ) : (
              /* ---------- DONATUR: instant success ---------- */
              <div>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: COLORS.mist }}
                >
                  <CheckCircle2 size={28} color={COLORS.teal} />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: COLORS.navy }}>
                  Akun Berhasil Dibuat!
                </h1>
                <p className="text-base leading-relaxed mb-8" style={{ color: COLORS.navy, opacity: 0.75 }}>
                  Selamat datang, {donaturData.name || "Kawan"}. Anda sudah bisa mulai mencari panti yang
                  membutuhkan barang Anda.
                </p>
                {/* @ts-ignore */}
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 w-full text-base font-semibold py-3.5 rounded-full text-white hover:brightness-110 transition"
                  style={{ backgroundColor: COLORS.teal }}
                >
                  Mulai Cari Panti <ArrowRight size={18} />
                </Link>
              </div>
            )
          ) : (
            <>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: COLORS.navy }}>
                {role === "donatur" ? "Daftar Sebagai Donatur" : "Daftar & Verifikasi Yayasan"}
              </h1>
              <p className="text-base mb-8" style={{ color: COLORS.navy, opacity: 0.7 }}>
                {role === "donatur"
                  ? "Buat akun untuk mulai menyalurkan barang tepat sasaran."
                  : "Lengkapi data yayasan Anda untuk mengajukan verifikasi."}
              </p>

              {role === "donatur" ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <Field icon={User} label="Nama Lengkap">
                    <input
                      required
                      placeholder="Nama Anda"
                      value={donaturData.name}
                      onChange={(e) => setDonaturData({ ...donaturData, name: e.target.value })}
                      className={inputBase}
                      style={inputStyle}
                    />
                  </Field>

                  <Field icon={Mail} label="Alamat Email">
                    <input
                      type="email"
                      required
                      placeholder="nama@email.com"
                      value={donaturData.email}
                      onChange={(e) => setDonaturData({ ...donaturData, email: e.target.value })}
                      className={inputBase}
                      style={inputStyle}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field icon={Phone} label="No. WhatsApp">
                      <input
                        required
                        placeholder="08xxxxxxxxxx"
                        value={donaturData.phone}
                        onChange={(e) => setDonaturData({ ...donaturData, phone: e.target.value })}
                        className={inputBase}
                        style={inputStyle}
                      />
                    </Field>
                    <Field icon={MapPin} label="Kota">
                      <input
                        required
                        placeholder="Bandung"
                        value={donaturData.city}
                        onChange={(e) => setDonaturData({ ...donaturData, city: e.target.value })}
                        className={inputBase}
                        style={inputStyle}
                      />
                    </Field>
                  </div>

                  <Field icon={Lock} label="Kata Sandi">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Minimal 8 karakter"
                      value={donaturData.password}
                      onChange={(e) => setDonaturData({ ...donaturData, password: e.target.value })}
                      className={inputBase.replace("pr-4", "pr-12")}
                      style={inputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:opacity-70"
                      style={{ color: COLORS.navy, opacity: 0.45 }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </Field>

                  <Field icon={Lock} label="Konfirmasi Kata Sandi">
                    <input
                      type={showConfirm ? "text" : "password"}
                      required
                      placeholder="Ulangi kata sandi"
                      value={donaturData.confirm}
                      onChange={(e) => setDonaturData({ ...donaturData, confirm: e.target.value })}
                      className={inputBase.replace("pr-4", "pr-12")}
                      style={inputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:opacity-70"
                      style={{ color: COLORS.navy, opacity: 0.45 }}
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </Field>

                  <label className="flex items-start gap-2.5 cursor-pointer mt-1">
                    <input
                      type="checkbox"
                      required
                      checked={donaturData.agree}
                      onChange={(e) => setDonaturData({ ...donaturData, agree: e.target.checked })}
                      className="mt-0.5 rounded"
                      style={{ accentColor: COLORS.teal }}
                    />
                    <span className="text-sm" style={{ color: COLORS.navy, opacity: 0.7 }}>
                      Saya menyetujui Syarat & Ketentuan serta Kebijakan Privasi KawanBerbagi.
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="mt-2 w-full inline-flex items-center justify-center gap-2 text-base font-semibold py-3.5 rounded-full text-white hover:brightness-110 transition"
                    style={{ backgroundColor: COLORS.teal }}
                  >
                    Daftar sebagai Donatur <ArrowRight size={18} />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <Field icon={Building2} label="Nama Yayasan / Panti">
                    <input
                      required
                      placeholder="Yayasan Kasih Ibu"
                      value={yayasanData.orgName}
                      onChange={(e) => setYayasanData({ ...yayasanData, orgName: e.target.value })}
                      className={inputBase}
                      style={inputStyle}
                    />
                  </Field>

                  <Field icon={Mail} label="Email Resmi Yayasan">
                    <input
                      type="email"
                      required
                      placeholder="kontak@yayasan.org"
                      value={yayasanData.email}
                      onChange={(e) => setYayasanData({ ...yayasanData, email: e.target.value })}
                      className={inputBase}
                      style={inputStyle}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field icon={User} label="Nama Penanggung Jawab">
                      <input
                        required
                        placeholder="Nama pengurus"
                        value={yayasanData.picName}
                        onChange={(e) => setYayasanData({ ...yayasanData, picName: e.target.value })}
                        className={inputBase}
                        style={inputStyle}
                      />
                    </Field>
                    <Field icon={Phone} label="No. Telepon PIC">
                      <input
                        required
                        placeholder="08xxxxxxxxxx"
                        value={yayasanData.phone}
                        onChange={(e) => setYayasanData({ ...yayasanData, phone: e.target.value })}
                        className={inputBase}
                        style={inputStyle}
                      />
                    </Field>
                  </div>

                  <Field icon={MapPin} label="Alamat Lengkap Panti">
                    <input
                      required
                      placeholder="Jl. Contoh No. 12, Kecamatan, Kota"
                      value={yayasanData.address}
                      onChange={(e) => setYayasanData({ ...yayasanData, address: e.target.value })}
                      className={inputBase}
                      style={inputStyle}
                    />
                  </Field>

                  <Field icon={Users} label="Jumlah Penerima Manfaat">
                    <input
                      type="number"
                      min={1}
                      required
                      placeholder="Misal: 25"
                      value={yayasanData.beneficiaries}
                      onChange={(e) => setYayasanData({ ...yayasanData, beneficiaries: e.target.value })}
                      className={inputBase}
                      style={inputStyle}
                    />
                  </Field>

                  <FileField
                    icon={FileText}
                    label="Dokumen Legalitas"
                    hint="Akta Notaris / SK Kemensos / Tanda Daftar Yayasan (PDF/JPG)"
                    required
                    file={legalDoc}
                    onChange={setLegalDoc}
                  />

                  <FileField
                    icon={ImagePlus}
                    label="Foto Panti (opsional)"
                    hint="Membantu proses verifikasi lebih cepat"
                    file={orgPhoto}
                    onChange={setOrgPhoto}
                  />

                  <Field icon={Lock} label="Kata Sandi">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Minimal 8 karakter"
                      value={yayasanData.password}
                      onChange={(e) => setYayasanData({ ...yayasanData, password: e.target.value })}
                      className={inputBase.replace("pr-4", "pr-12")}
                      style={inputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:opacity-70"
                      style={{ color: COLORS.navy, opacity: 0.45 }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </Field>

                  <Field icon={Lock} label="Konfirmasi Kata Sandi">
                    <input
                      type={showConfirm ? "text" : "password"}
                      required
                      placeholder="Ulangi kata sandi"
                      value={yayasanData.confirm}
                      onChange={(e) => setYayasanData({ ...yayasanData, confirm: e.target.value })}
                      className={inputBase.replace("pr-4", "pr-12")}
                      style={inputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:opacity-70"
                      style={{ color: COLORS.navy, opacity: 0.45 }}
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </Field>

                  <div
                    className="flex items-start gap-2.5 rounded-xl p-3.5"
                    style={{ backgroundColor: "rgba(165,141,102,0.12)" }}
                  >
                    <ShieldCheck size={18} color={COLORS.gold} className="mt-0.5 shrink-0" />
                    <p className="text-xs leading-relaxed" style={{ color: COLORS.navy, opacity: 0.75 }}>
                      Data dan dokumen yang Anda unggah akan ditinjau tim kami sebelum akun yayasan aktif,
                      demi menjaga kepercayaan donatur.
                    </p>
                  </div>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={yayasanData.agree}
                      onChange={(e) => setYayasanData({ ...yayasanData, agree: e.target.checked })}
                      className="mt-0.5 rounded"
                      style={{ accentColor: COLORS.teal }}
                    />
                    <span className="text-sm" style={{ color: COLORS.navy, opacity: 0.7 }}>
                      Saya menyatakan data yang diisi benar dan menyetujui Syarat & Ketentuan.
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="mt-2 w-full inline-flex items-center justify-center gap-2 text-base font-semibold py-3.5 rounded-full text-white hover:brightness-110 transition"
                    style={{ backgroundColor: COLORS.navy }}
                  >
                    Daftar & Ajukan Verifikasi <ArrowRight size={18} />
                  </button>
                </form>
              )}

              <div className="mt-8 text-center">
                <p className="text-sm" style={{ color: COLORS.navy, opacity: 0.75 }}>
                  Sudah punya akun?{" "}
                  {/* @ts-ignore */}
                  <Link href="/login" className="font-bold hover:underline" style={{ color: COLORS.navy }}>
                    Masuk di sini
                  </Link>
                </p>
              </div>
            </>
          )}
          </div>
        </div>
      </div>

      {/* ======================= EXPLANATION PANEL (scrolls independently) ======================= */}
      <div
        className={`w-full lg:w-1/2 relative overflow-hidden ${
          formOnRight ? "lg:order-1" : "lg:order-2"
        }`}
        style={{ backgroundColor: COLORS.navy }}
      >
        {/* Decorations — stay fixed, don't scroll with content */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 pointer-events-none"
          style={{ backgroundColor: COLORS.teal }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-10 pointer-events-none"
          style={{ backgroundColor: COLORS.mist }}
        />

        {/* Scrollable content */}
        <div className="relative z-10 px-6 sm:px-10 lg:px-16 pt-10 sm:pt-12 lg:pt-16 pb-16">
          {/* Logo */}
          <div className="mb-10 lg:mb-12">
            {/* @ts-ignore */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold" style={{ color: COLORS.cream }}>
                KawanBerbagi
                <span style={{ color: COLORS.gold }}>.</span>
              </span>
            </Link>
          </div>

          <div className="max-w-md w-full">
          {role === "donatur" ? (
            <>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-7"
                style={{ backgroundColor: COLORS.teal }}
              >
                <Heart size={26} color={COLORS.cream} />
              </div>
              <h2 className="text-3xl xl:text-4xl font-medium mb-5 leading-tight" style={{ color: COLORS.cream }}>
                Jadi Donatur, Bantu Tepat Sasaran
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: COLORS.mist }}>
                Sumbangkan barang yang benar-benar dibutuhkan panti terdekat, dan pantau
                perjalanannya sampai diterima.
              </p>
              <ul className="flex flex-col gap-4 mb-10">
                {[
                  "Cari panti sesuai barang & lokasi Anda",
                  "Checkout & lacak status pengiriman langsung",
                  "Dapatkan cerita dampak dari donasi Anda",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <CheckCircle2 size={20} color={COLORS.gold} className="mt-0.5 shrink-0" />
                    <span className="text-sm" style={{ color: COLORS.cream, opacity: 0.9 }}>
                      {t}
                    </span>
                  </li>
                ))}
              </ul>
              <div
                className="rounded-2xl p-5 mb-8"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid rgba(192,213,214,0.15)` }}
              >
                <p className="text-sm" style={{ color: COLORS.cream, opacity: 0.75 }}>
                  Tidak perlu verifikasi dokumen — akun Anda langsung aktif setelah mendaftar.
                </p>
              </div>

              <div className="pt-6" style={{ borderTop: `1px solid rgba(192,213,214,0.15)` }}>
                <p className="text-sm mb-3" style={{ color: COLORS.cream, opacity: 0.7 }}>
                  Anda pengurus panti atau yayasan?
                </p>
                <button
                  type="button"
                  onClick={switchRole}
                  className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full border transition hover:bg-white/10"
                  style={{ borderColor: "rgba(229,225,221,0.4)", color: COLORS.cream }}
                >
                  Daftar sebagai Yayasan <ArrowRight size={16} />
                </button>
              </div>
            </>
          ) : (
            <>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-7"
                style={{ backgroundColor: COLORS.gold }}
              >
                <Building2 size={26} color={COLORS.navy} />
              </div>
              <h2 className="text-3xl xl:text-4xl font-medium mb-5 leading-tight" style={{ color: COLORS.cream }}>
                Jadi Yayasan Terverifikasi
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: COLORS.mist }}>
                Tuliskan kebutuhan panti Anda dengan kuota pasti, dan biarkan donatur yang tepat
                menemukan Anda.
              </p>
              <ul className="flex flex-col gap-4 mb-10">
                {[
                  "Buat wishlist kebutuhan dengan kuota pasti",
                  "Pantau donasi yang masuk secara real-time",
                  "Dapat notifikasi sebelum stok kebutuhan habis",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <CheckCircle2 size={20} color={COLORS.gold} className="mt-0.5 shrink-0" />
                    <span className="text-sm" style={{ color: COLORS.cream, opacity: 0.9 }}>
                      {t}
                    </span>
                  </li>
                ))}
              </ul>
              <div
                className="flex items-start gap-3 rounded-2xl p-5 mb-8"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid rgba(192,213,214,0.15)` }}
              >
                <ShieldCheck size={18} color={COLORS.gold} className="mt-0.5 shrink-0" />
                <p className="text-sm" style={{ color: COLORS.cream, opacity: 0.8 }}>
                  Pendaftaran yayasan memerlukan verifikasi dokumen legalitas oleh tim kami
                  (1–3 hari kerja) demi menjaga kepercayaan donatur.
                </p>
              </div>

              <div className="pt-6" style={{ borderTop: `1px solid rgba(192,213,214,0.15)` }}>
                <p className="text-sm mb-3" style={{ color: COLORS.cream, opacity: 0.7 }}>
                  Hanya ingin menyumbangkan barang?
                </p>
                <button
                  type="button"
                  onClick={switchRole}
                  className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full border transition hover:bg-white/10"
                  style={{ borderColor: "rgba(229,225,221,0.4)", color: COLORS.cream }}
                >
                  Daftar sebagai Donatur <ArrowRight size={16} />
                </button>
              </div>
            </>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}