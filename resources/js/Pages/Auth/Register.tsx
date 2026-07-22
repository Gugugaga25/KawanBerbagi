import React, { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
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
import PasswordChecklist from "@/Components/Form/PasswordChecklist";
import { validatePasswordRequirements, sanitizePhoneNumber } from "@/Utils/formUtils";
import InlineSpinner from "@/Components/UI/InlineSpinner";

const COLORS = {
  navy: "#293681",
  gold: "#F59E0B",
  mist: "#D0E7E6",
  teal: "#4274D9",
  cream: "#F8FAFC",
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
  const [currentYayasanStep, setCurrentYayasanStep] = useState<number>(1);

  const { data, setData, post, processing, errors, reset } = useForm({
    role: "donatur",
    name: "",
    email: "",
    phone: "",
    city: "",
    password: "",
    password_confirmation: "",
    agree: false,
    
    orgName: "",
    picName: "",
    address: "",
    beneficiaries: "",
    aktaDoc: null as File | null,
    skDoc: null as File | null,
    izinDoc: null as File | null,
    npwpDoc: null as File | null,
    orgPhoto: null as File | null,
  });

  const switchRole = (targetRole?: Role) => {
    const nextRole = targetRole ?? (role === "donatur" ? "yayasan" : "donatur");
    if (nextRole === role) return;

    setRole(nextRole);
    setData("role", nextRole);
    setSubmitted(false);
    setCurrentYayasanStep(1);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/register', {
      preserveScroll: true,
      onSuccess: () => {
        setSubmitted(true);
        reset('password', 'password_confirmation');
      },
    });
  };

  const formOnRight = role === "yayasan";

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row font-sans overflow-hidden relative"
      style={{ backgroundColor: COLORS.cream }}
    >
      {/* ======================= FORM PANEL (scrolls independently) ======================= */}
      <div
        className={`w-full lg:w-1/2 relative transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
          formOnRight ? "lg:translate-x-full" : "lg:translate-x-0"
        }`}
      >
        <div className="px-6 sm:px-10 lg:px-20 xl:px-28 pt-10 sm:pt-12 lg:pt-16 pb-14">
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

          <div className="w-full mx-auto pt-8">
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
                  Terima kasih telah mendaftarkan <strong>{data.orgName || "yayasan Anda"}</strong>.
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
                  <strong style={{ opacity: 1 }}>{data.email || "email Anda"}</strong>, dan juga bisa
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
              <div className="pt-32">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-[#4274D9]/20"
                >
                  <CheckCircle2 size={28} color={COLORS.teal} />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: COLORS.navy }}>
                  Akun Berhasil Dibuat!
                </h1>
                <p className="text-base leading-relaxed mb-8" style={{ color: COLORS.navy, opacity: 0.75 }}>
                  Selamat datang, {data.name || "Kawan"}. Anda sudah bisa mulai mencari panti yang
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
            <div key={role} className="transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
              {/* Single Toggle Role Switcher Button */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold text-[#4274D9] uppercase tracking-wider bg-[#4274D9]/20 px-3 py-1.5 rounded-lg border border-[#D0E7E6]">
                  {role === "donatur" ? "Pendaftaran Donatur" : "Pendaftaran Yayasan"}
                </span>
                <button
                  type="button"
                  onClick={() => switchRole()}
                  className="inline-flex items-center gap-2 text-xs font-extrabold px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-[#293681] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  {role === "donatur" ? (
                    <>
                      <Building2 size={15} className="text-[#4274D9]" />
                      <span>Daftar sebagai Yayasan</span>
                      <ArrowRight size={14} className="text-[#4274D9] group-hover:translate-x-0.5 transition-transform" />
                    </>
                  ) : (
                    <>
                      <Heart size={15} className="text-[#4274D9] fill-[#4274D9]/20" />
                      <span>Daftar sebagai Donatur</span>
                      <ArrowRight size={14} className="text-[#4274D9] group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: COLORS.navy }}>
                {role === "donatur" ? "Daftar Sebagai Donatur" : "Daftar & Verifikasi Yayasan"}
              </h1>
              <p className="text-base mb-8" style={{ color: COLORS.navy, opacity: 0.7 }}>
                {role === "donatur"
                  ? "Buat akun untuk mulai menyalurkan barang tepat sasaran."
                  : "Lengkapi data yayasan Anda untuk mengajukan verifikasi."}
              </p>

              {(() => {
                const passReqs = validatePasswordRequirements(data.password, data.password_confirmation);
                const isDonaturValid = Boolean(
                  data.name &&
                  data.email &&
                  data.phone &&
                  data.city &&
                  passReqs.minLength &&
                  passReqs.hasUpper &&
                  passReqs.hasNumber &&
                  passReqs.passwordsMatch &&
                  data.agree
                );

                const isStep1Valid = Boolean(data.orgName && data.email && data.picName && data.phone && data.address && data.beneficiaries);
                const isStep2Valid = Boolean(data.skDoc && data.izinDoc);
                const isStep3Valid = passReqs.minLength && passReqs.hasUpper && passReqs.hasNumber && passReqs.passwordsMatch && data.agree;

                return role === "donatur" ? (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <Field icon={User} label="Nama Lengkap">
                      <input
                        required
                        placeholder="Nama Anda"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className={inputBase}
                        style={inputStyle}
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.name}</p>}
                    </Field>

                    <Field icon={Mail} label="Alamat Email">
                      <input
                        type="email"
                        required
                        placeholder="nama@email.com"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        className={inputBase}
                        style={inputStyle}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.email}</p>}
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                      <Field icon={Phone} label="No. WhatsApp">
                        <input
                          required
                          placeholder="08xxxxxxxxxx"
                          value={data.phone}
                          onChange={(e) => setData("phone", e.target.value)}
                          onBlur={() => setData("phone", sanitizePhoneNumber(data.phone))}
                          className={inputBase}
                          style={inputStyle}
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.phone}</p>}
                      </Field>
                      <Field icon={MapPin} label="Kota">
                        <input
                          required
                          placeholder="Bandung"
                          value={data.city}
                          onChange={(e) => setData("city", e.target.value)}
                          className={inputBase}
                          style={inputStyle}
                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.city}</p>}
                      </Field>
                    </div>

                    <Field icon={Lock} label="Kata Sandi">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Minimal 8 karakter"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
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
                      {errors.password && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.password}</p>}
                    </Field>

                    <Field icon={Lock} label="Konfirmasi Kata Sandi">
                      <input
                        type={showConfirm ? "text" : "password"}
                        required
                        placeholder="Ulangi kata sandi"
                        value={data.password_confirmation}
                        onChange={(e) => setData("password_confirmation", e.target.value)}
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

                    <PasswordChecklist password={data.password} confirmation={data.password_confirmation} />

                    <label className="flex items-start gap-2.5 cursor-pointer mt-1">
                      <input
                        type="checkbox"
                        required
                        checked={data.agree}
                        onChange={(e) => setData("agree", e.target.checked)}
                        className="mt-0.5 rounded cursor-pointer"
                        style={{ accentColor: COLORS.teal }}
                      />
                      <span className="text-sm font-medium" style={{ color: COLORS.navy, opacity: 0.8 }}>
                        Saya menyetujui Syarat & Ketentuan serta Kebijakan Privasi KawanBerbagi.
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={processing || !isDonaturValid}
                      className={`mt-2 w-full inline-flex items-center justify-center gap-2 text-base font-bold py-3.5 rounded-full text-white transition ${
                        isDonaturValid
                          ? 'bg-[#4274D9] hover:bg-[#293681] shadow-md shadow-[#4274D9]/20 cursor-pointer'
                          : 'bg-gray-300 text-gray-400 cursor-not-allowed shadow-none'
                      }`}
                    >
                      {processing ? <InlineSpinner color="white" size="sm" /> : null}
                      <span>{processing ? "Mendaftarkan Akun..." : "Daftar sebagai Donatur"}</span>
                      {!processing && <ArrowRight size={18} />}
                    </button>
                  </form>
                ) : (
                  /* ================= YAYASAN MULTI-STEP FORM ================= */
                  <div className="flex flex-col gap-6">
                    {/* Stepper Progress Indicator */}
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                      {[
                        { num: 1, title: "Profil & Kontak", icon: Building2 },
                        { num: 2, title: "Berkas Legalitas", icon: FileText },
                        { num: 3, title: "Keamanan Akun", icon: Lock },
                      ].map((s) => {
                        const isCompleted = currentYayasanStep > s.num;
                        const isActive = currentYayasanStep === s.num;
                        return (
                          <React.Fragment key={s.num}>
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                isCompleted
                                  ? 'bg-[#4274D9] text-white'
                                  : isActive
                                    ? 'bg-[#4274D9] text-white ring-4 ring-[#4274D9]/20'
                                    : 'bg-gray-100 text-gray-400'
                              }`}>
                                {isCompleted ? <CheckCircle2 size={16} /> : s.num}
                              </div>
                              <span className={`text-xs font-semibold hidden sm:inline ${
                                isActive ? 'text-[#293681] font-bold' : 'text-gray-400'
                              }`}>
                                {s.title}
                              </span>
                            </div>
                            {s.num < 3 && (
                              <div className={`flex-1 h-0.5 mx-2 transition-colors ${
                                currentYayasanStep > s.num ? 'bg-[#4274D9]' : 'bg-gray-200'
                              }`} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                      {/* LANGKAH 1: IDENTITAS & KONTAK */}
                      {currentYayasanStep === 1 && (
                        <div className="flex flex-col gap-5">
                          <Field icon={Building2} label="Nama Yayasan / Panti">
                            <input
                              required
                              placeholder="Yayasan Kasih Ibu"
                              value={data.orgName}
                              onChange={(e) => setData("orgName", e.target.value)}
                              className={inputBase}
                              style={inputStyle}
                            />
                            {errors.orgName && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.orgName}</p>}
                          </Field>

                          <Field icon={Mail} label="Email Resmi Yayasan">
                            <input
                              type="email"
                              required
                              placeholder="kontak@yayasan.org"
                              value={data.email}
                              onChange={(e) => setData("email", e.target.value)}
                              className={inputBase}
                              style={inputStyle}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.email}</p>}
                          </Field>

                          <div className="grid grid-cols-2 gap-4">
                            <Field icon={User} label="Nama Penanggung Jawab">
                              <input
                                required
                                placeholder="Nama pengurus"
                                value={data.picName}
                                onChange={(e) => setData("picName", e.target.value)}
                                className={inputBase}
                                style={inputStyle}
                              />
                              {errors.picName && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.picName}</p>}
                            </Field>
                            <Field icon={Phone} label="No. Telepon PIC">
                              <input
                                required
                                placeholder="08xxxxxxxxxx"
                                value={data.phone}
                                onChange={(e) => setData("phone", e.target.value)}
                                onBlur={() => setData("phone", sanitizePhoneNumber(data.phone))}
                                className={inputBase}
                                style={inputStyle}
                              />
                              {errors.phone && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.phone}</p>}
                            </Field>
                          </div>

                          <Field icon={MapPin} label="Alamat Lengkap Panti">
                            <input
                              required
                              placeholder="Jl. Contoh No. 12, Kecamatan, Kota"
                              value={data.address}
                              onChange={(e) => setData("address", e.target.value)}
                              className={inputBase}
                              style={inputStyle}
                            />
                            {errors.address && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.address}</p>}
                          </Field>

                          <Field icon={Users} label="Jumlah Penerima Manfaat">
                            <input
                              type="number"
                              min={1}
                              required
                              placeholder="Misal: 25"
                              value={data.beneficiaries}
                              onChange={(e) => setData("beneficiaries", e.target.value)}
                              className={inputBase}
                              style={inputStyle}
                            />
                            {errors.beneficiaries && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.beneficiaries}</p>}
                          </Field>

                          <button
                            type="button"
                            onClick={() => isStep1Valid && setCurrentYayasanStep(2)}
                            disabled={!isStep1Valid}
                            className={`mt-2 w-full inline-flex items-center justify-center gap-2 text-base font-bold py-3.5 rounded-full text-white transition ${
                              isStep1Valid
                                ? 'bg-[#4274D9] hover:bg-[#293681] shadow-md shadow-[#4274D9]/20 cursor-pointer'
                                : 'bg-gray-300 text-gray-400 cursor-not-allowed shadow-none'
                            }`}
                          >
                            <span>Lanjut ke Langkah 2 (Legalitas)</span> <ArrowRight size={18} />
                          </button>
                        </div>
                      )}

                      {/* LANGKAH 2: BERKAS LEGALITAS */}
                      {currentYayasanStep === 2 && (
                        <div className="flex flex-col gap-5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <FileField
                                icon={FileText}
                                label="Akta Pendirian (opsional)"
                                hint="PDF/JPG (Maks 5MB)"
                                file={data.aktaDoc}
                                onChange={(f) => setData("aktaDoc", f)}
                              />
                              {errors.aktaDoc && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.aktaDoc}</p>}
                            </div>
                            <div>
                              <FileField
                                icon={FileText}
                                label="SK Kemenkumham / Kemensos"
                                hint="PDF/JPG (Maks 5MB)"
                                required
                                file={data.skDoc}
                                onChange={(f) => setData("skDoc", f)}
                              />
                              {errors.skDoc && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.skDoc}</p>}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <FileField
                                icon={FileText}
                                label="TDY / Izin Operasional"
                                hint="PDF/JPG (Maks 5MB)"
                                required
                                file={data.izinDoc}
                                onChange={(f) => setData("izinDoc", f)}
                              />
                              {errors.izinDoc && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.izinDoc}</p>}
                            </div>
                            <div>
                              <FileField
                                icon={FileText}
                                label="NIB / NPWP (opsional)"
                                hint="PDF/JPG (Maks 5MB)"
                                file={data.npwpDoc}
                                onChange={(f) => setData("npwpDoc", f)}
                              />
                              {errors.npwpDoc && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.npwpDoc}</p>}
                            </div>
                          </div>

                          <div>
                            <FileField
                              icon={ImagePlus}
                              label="Foto Panti (opsional)"
                              hint="Membantu proses verifikasi lebih cepat"
                              file={data.orgPhoto}
                              onChange={(f) => setData("orgPhoto", f)}
                            />
                            {errors.orgPhoto && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.orgPhoto}</p>}
                          </div>

                          <div className="flex gap-3 mt-2">
                            <button
                              type="button"
                              onClick={() => setCurrentYayasanStep(1)}
                              className="w-1/3 py-3.5 rounded-full bg-gray-100 hover:bg-gray-200 text-[#293681] text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <ArrowLeft size={16} /> Kembali
                            </button>

                            <button
                              type="button"
                              onClick={() => isStep2Valid && setCurrentYayasanStep(3)}
                              disabled={!isStep2Valid}
                              className={`w-2/3 inline-flex items-center justify-center gap-2 text-base font-bold py-3.5 rounded-full text-white transition ${
                                isStep2Valid
                                  ? 'bg-[#4274D9] hover:bg-[#293681] shadow-md shadow-[#4274D9]/20 cursor-pointer'
                                  : 'bg-gray-300 text-gray-400 cursor-not-allowed shadow-none'
                              }`}
                            >
                              <span>Lanjut ke Langkah 3</span> <ArrowRight size={18} />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* LANGKAH 3: KEAMANAN AKUN & PERSETUJUAN */}
                      {currentYayasanStep === 3 && (
                        <div className="flex flex-col gap-5">
                          <Field icon={Lock} label="Kata Sandi">
                            <input
                              type={showPassword ? "text" : "password"}
                              required
                              placeholder="Minimal 8 karakter"
                              value={data.password}
                              onChange={(e) => setData("password", e.target.value)}
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
                            {errors.password && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.password}</p>}
                          </Field>

                          <Field icon={Lock} label="Konfirmasi Kata Sandi">
                            <input
                              type={showConfirm ? "text" : "password"}
                              required
                              placeholder="Ulangi kata sandi"
                              value={data.password_confirmation}
                              onChange={(e) => setData("password_confirmation", e.target.value)}
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

                          <PasswordChecklist password={data.password} confirmation={data.password_confirmation} />

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
                              checked={data.agree}
                              onChange={(e) => setData("agree", e.target.checked)}
                              className="mt-0.5 rounded cursor-pointer"
                              style={{ accentColor: COLORS.teal }}
                            />
                            <span className="text-sm font-medium" style={{ color: COLORS.navy, opacity: 0.8 }}>
                              Saya menyatakan data yang diisi benar dan menyetujui Syarat & Ketentuan.
                            </span>
                          </label>

                          <div className="flex gap-3 mt-2">
                            <button
                              type="button"
                              onClick={() => setCurrentYayasanStep(2)}
                              className="w-1/3 py-3.5 rounded-full bg-gray-100 hover:bg-gray-200 text-[#293681] text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <ArrowLeft size={16} /> Kembali
                            </button>

                            <button
                              type="submit"
                              disabled={processing || !isStep3Valid}
                              className={`w-2/3 inline-flex items-center justify-center gap-2 text-base font-bold py-3.5 rounded-full text-white transition ${
                                isStep3Valid
                                  ? 'bg-[#4274D9] hover:bg-[#293681] shadow-md shadow-[#4274D9]/20 cursor-pointer'
                                  : 'bg-gray-300 text-gray-400 cursor-not-allowed shadow-none'
                              }`}
                            >
                              {processing ? <InlineSpinner color="white" size="sm" /> : null}
                              <span>{processing ? "Memproses..." : "Daftar & Ajukan Verifikasi"}</span>
                              {!processing && <ArrowRight size={18} />}
                            </button>
                          </div>
                        </div>
                      )}
                    </form>
                  </div>
                );
              })()}

              <div className="mt-8 text-center">
                <p className="text-sm" style={{ color: COLORS.navy, opacity: 0.75 }}>
                  Sudah punya akun?{" "}
                  {/* @ts-ignore */}
                  <Link href="/login" className="font-bold hover:underline" style={{ color: COLORS.navy }}>
                    Masuk di sini
                  </Link>
                </p>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* ======================= EXPLANATION PANEL (scrolls independently) ======================= */}
      <div
        className={`w-full lg:w-1/2 relative overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
          formOnRight ? "lg:-translate-x-full" : "lg:translate-x-0"
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
        <div className="relative z-10 px-6 sm:px-10 lg:px-20 pt-10 sm:pt-12 lg:pt-16 pb-16">
          {/* Logo */}
          <div className="mb-10 lg:mb-12">
            {/* @ts-ignore */}
            <Link href="/" className="flex items-center gap-2">
              <img src="/images/logokb2.png" alt="Logo KawanBerbagi" className="w-8 h-8 object-contain bg-white rounded-full p-0.5 shadow-sm" />
              <span className="text-2xl font-bold" style={{ color: COLORS.cream }}>
                KawanBerbagi
                <span style={{ color: COLORS.gold }}>.</span>
              </span>
            </Link>
          </div>

          <div key={role} className="w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
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
                className="rounded-2xl p-5 mb-2"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid rgba(192,213,214,0.15)` }}
              >
                <p className="text-sm" style={{ color: COLORS.cream, opacity: 0.75 }}>
                  Tidak perlu verifikasi dokumen — akun Anda langsung aktif setelah mendaftar.
                </p>
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
                className="flex items-start gap-3 rounded-2xl p-5 mb-2"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid rgba(192,213,214,0.15)` }}
              >
                <ShieldCheck size={18} color={COLORS.gold} className="mt-0.5 shrink-0" />
                <p className="text-sm" style={{ color: COLORS.cream, opacity: 0.8 }}>
                  Pendaftaran yayasan memerlukan verifikasi dokumen legalitas oleh tim kami
                  (1–3 hari kerja) demi menjaga kepercayaan donatur.
                </p>
              </div>
            </>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}