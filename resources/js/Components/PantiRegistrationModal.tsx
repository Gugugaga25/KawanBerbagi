import React, { useState, Fragment } from "react";
import { useForm } from "@inertiajs/react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  Users,
  FileText,
  ImagePlus,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  User,
  Phone,
  MapPin,
  X,
  CheckCircle2
} from "lucide-react";
import CharCounter from "@/Components/Form/CharCounter";
import PasswordChecklist from "@/Components/Form/PasswordChecklist";
import { sanitizePhoneNumber, validatePasswordRequirements } from "@/Utils/formUtils";
import InlineSpinner from "@/Components/UI/InlineSpinner";
import { useToast } from "@/Components/UI/Toast";

const COLORS = {
  navy: "#293681",
  gold: "#F59E0B",
  mist: "#D0E7E6",
  teal: "#4274D9",
  cream: "#F8FAFC",
};

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
  "w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-150 border focus:border-[#4274D9] focus:ring-2 focus:ring-[#4274D9]/20 font-semibold";
const inputStyle = { backgroundColor: "#ffffff", borderColor: COLORS.mist, color: COLORS.navy };

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

export default function PantiRegistrationModal({
  isOpen,
  setIsOpen,
  editData = null,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  editData?: any | null;
}) {
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    role: "yayasan",
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
    status: "Pending",
    aktaDoc: null as File | null,
    skDoc: null as File | null,
    izinDoc: null as File | null,
    npwpDoc: null as File | null,
    orgPhoto: null as File | null,
    _method: 'post',
  });

  React.useEffect(() => {
    if (editData && isOpen) {
      setData({
        role: "yayasan",
        name: editData.nama || "",
        email: editData.email || "", // Assuming email is passed, if not might need to adjust
        phone: editData.phone || "",
        city: "",
        password: "",
        password_confirmation: "",
        agree: true,
        orgName: editData.nama || "",
        picName: editData.pimpinan || "",
        address: editData.alamat || "",
        beneficiaries: editData.anak?.toString() || "",
        status: editData.status || "Pending",
        aktaDoc: null,
        skDoc: null,
        izinDoc: null,
        npwpDoc: null,
        orgPhoto: null,
        _method: 'patch',
      });
    } else if (!editData && isOpen) {
      reset();
      setData('_method', 'post');
    }
  }, [editData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = editData ? `/admin/panti/${editData.id}` : '/admin/panti';
    
    post(url, {
      preserveScroll: true,
      onSuccess: () => {
        showToast(editData ? `Data panti "${data.orgName}" berhasil diperbarui.` : `Panti "${data.orgName}" berhasil didaftarkan.`, 'success', editData ? 'Pembaruan Sukses' : 'Pendaftaran Sukses');
        setSubmitted(true);
        reset('password', 'password_confirmation');
      },
      onError: () => {
        showToast('Gagal memproses pendaftaran panti. Silakan periksa form.', 'error', 'Pendaftaran Gagal');
      }
    });
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setSubmitted(false);
      setCurrentStep(1);
      reset();
    }, 300);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-150"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white p-6 sm:p-10 text-left align-middle shadow-xl transition-all relative">
                <button
                  type="button"
                  onClick={closeModal}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                >
                  <X size={20} style={{ color: COLORS.navy }} />
                </button>

                {submitted ? (
                  <div className="py-10 text-center">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                      style={{ backgroundColor: COLORS.mist }}
                    >
                      <CheckCircle2 size={32} color={COLORS.teal} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: COLORS.navy }}>
                      {editData ? "Pembaruan Berhasil!" : "Pendaftaran Berhasil!"}
                    </h2>
                    <p className="text-base leading-relaxed mb-8 max-w-md mx-auto" style={{ color: COLORS.navy, opacity: 0.75 }}>
                      Panti <strong>{data.orgName || "baru"}</strong> berhasil {editData ? "diperbarui" : "ditambahkan ke dalam sistem"}.
                    </p>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-white hover:brightness-110 transition font-semibold"
                      style={{ backgroundColor: COLORS.navy }}
                    >
                      Tutup
                    </button>
                  </div>
                ) : (
                  <>
                    <Dialog.Title as="h3" className="text-2xl font-extrabold mb-1 pr-8 text-[#293681]">
                      {editData ? "Edit Data Panti" : "Daftarkan Panti Baru"}
                    </Dialog.Title>
                    <p className="text-xs text-gray-500 mb-6">
                      Lengkapi 3 langkah informasi di bawah ini untuk mendaftarkan panti baru ke dalam sistem.
                    </p>

                    {/* Stepper Progress Bar */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                      {[
                        { num: 1, title: "Profil & Kontak", icon: Building2 },
                        { num: 2, title: "Legalitas & Berkas", icon: FileText },
                        { num: 3, title: "Keamanan Akun", icon: Lock },
                      ].map((s) => {
                        const StepIcon = s.icon;
                        const isCompleted = currentStep > s.num;
                        const isActive = currentStep === s.num;
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
                                currentStep > s.num ? 'bg-[#4274D9]' : 'bg-gray-200'
                              }`} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col">
                      
                      {/* ================= LANGKAH 1: PROFIL & KONTAK ================= */}
                      {currentStep === 1 && (
                        <div className="space-y-4 animate-fade-in">
                          <Field icon={Building2} label="Nama Yayasan / Panti" action={<CharCounter current={data.orgName.length} max={60} />}>
                            <input
                              required
                              maxLength={60}
                              placeholder="Yayasan Kasih Ibu"
                              value={data.orgName}
                              onChange={(e) => setData("orgName", e.target.value)}
                              className={inputBase}
                              style={inputStyle}
                            />
                            {errors.orgName && <p className="text-red-500 text-xs mt-1">{errors.orgName}</p>}
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
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                          </Field>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field icon={User} label="Nama Penanggung Jawab" action={<CharCounter current={data.picName.length} max={50} />}>
                              <input
                                required
                                maxLength={50}
                                placeholder="Nama pengurus"
                                value={data.picName}
                                onChange={(e) => setData("picName", e.target.value)}
                                className={inputBase}
                                style={inputStyle}
                              />
                              {errors.picName && <p className="text-red-500 text-xs mt-1">{errors.picName}</p>}
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
                              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </Field>
                          </div>

                          <Field icon={MapPin} label="Alamat Lengkap Panti" action={<CharCounter current={data.address.length} max={120} />}>
                            <input
                              required
                              maxLength={120}
                              placeholder="Jl. Contoh No. 12, Kecamatan, Kota"
                              value={data.address}
                              onChange={(e) => setData("address", e.target.value)}
                              className={inputBase}
                              style={inputStyle}
                            />
                            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
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
                            {errors.beneficiaries && <p className="text-red-500 text-xs mt-1">{errors.beneficiaries}</p>}
                          </Field>

                          {editData && (
                            <Field icon={CheckCircle2} label="Status Panti">
                              <select
                                required
                                value={data.status}
                                onChange={(e) => setData("status", e.target.value)}
                                className={inputBase}
                                style={{ ...inputStyle, appearance: "auto" }}
                              >
                                <option value="Active">Active (Aktif)</option>
                                <option value="Pending">Pending (Menunggu)</option>
                                <option value="Inactive">Inactive (Tidak Aktif)</option>
                              </select>
                              {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                            </Field>
                          )}
                        </div>
                      )}

                      {/* ================= LANGKAH 2: LEGALITAS & BERKAS ================= */}
                      {currentStep === 2 && (
                        <div className="space-y-4 animate-fade-in">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <FileField
                                icon={FileText}
                                label="Akta Pendirian Yayasan (opsional)"
                                hint={editData ? "Unggah baru jika ada perubahan" : "PDF/JPG"}
                                file={data.aktaDoc}
                                onChange={(f) => setData("aktaDoc", f)}
                              />
                              {errors.aktaDoc && <p className="text-red-500 text-xs mt-1">{errors.aktaDoc}</p>}
                            </div>

                            <div>
                              <FileField
                                icon={FileText}
                                label="SK Kemenkumham / Kemensos"
                                hint={editData ? "Unggah baru jika ada perubahan" : "PDF/JPG"}
                                required={!editData}
                                file={data.skDoc}
                                onChange={(f) => setData("skDoc", f)}
                              />
                              {errors.skDoc && <p className="text-red-500 text-xs mt-1">{errors.skDoc}</p>}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <FileField
                                icon={FileText}
                                label="TDY / Izin Operasional"
                                hint={editData ? "Unggah baru jika ada perubahan" : "PDF/JPG"}
                                required={!editData}
                                file={data.izinDoc}
                                onChange={(f) => setData("izinDoc", f)}
                              />
                              {errors.izinDoc && <p className="text-red-500 text-xs mt-1">{errors.izinDoc}</p>}
                            </div>

                            <div>
                              <FileField
                                icon={FileText}
                                label="NIB / NPWP Yayasan (opsional)"
                                hint={editData ? "Unggah baru jika ada perubahan" : "PDF/JPG"}
                                file={data.npwpDoc}
                                onChange={(f) => setData("npwpDoc", f)}
                              />
                              {errors.npwpDoc && <p className="text-red-500 text-xs mt-1">{errors.npwpDoc}</p>}
                            </div>
                          </div>

                          <div>
                            <FileField
                              icon={ImagePlus}
                              label="Foto Panti (opsional)"
                              hint="Membantu verifikasi"
                              file={data.orgPhoto}
                              onChange={(f) => setData("orgPhoto", f)}
                            />
                            {errors.orgPhoto && <p className="text-red-500 text-xs mt-1">{errors.orgPhoto}</p>}
                          </div>
                        </div>
                      )}

                      {/* ================= LANGKAH 3: KEAMANAN AKUN ================= */}
                      {currentStep === 3 && (
                        <div className="space-y-4 animate-fade-in">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field icon={Lock} label={editData ? "Kata Sandi Baru (Opsional)" : "Kata Sandi"}>
                              <input
                                type={showPassword ? "text" : "password"}
                                required={!editData}
                                placeholder={editData ? "Kosongkan jika tidak diubah" : "Minimal 8 karakter"}
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                className={inputBase.replace("pr-4", "pr-12")}
                                style={inputStyle}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center hover:opacity-70 text-gray-400"
                              >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </Field>

                            <Field icon={Lock} label="Konfirmasi Sandi">
                              <input
                                type={showConfirm ? "text" : "password"}
                                required={!editData && !!data.password}
                                placeholder="Ulangi kata sandi"
                                value={data.password_confirmation}
                                onChange={(e) => setData("password_confirmation", e.target.value)}
                                className={inputBase.replace("pr-4", "pr-12")}
                                style={inputStyle}
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center hover:opacity-70 text-gray-400"
                              >
                                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </Field>
                          </div>

                          <PasswordChecklist password={data.password} confirmation={data.password_confirmation} />

                          <label className="flex items-start gap-2.5 cursor-pointer pt-2">
                            <input
                              type="checkbox"
                              required
                              checked={data.agree}
                              onChange={(e) => setData("agree", e.target.checked)}
                              className="mt-0.5 rounded text-[#083A4F] focus:ring-[#083A4F]"
                            />
                            <span className="text-xs text-gray-600">
                              Saya menyatakan data yang diisi benar dan sesuai dengan dokumen yang ada.
                            </span>
                          </label>
                        </div>
                      )}

                      {/* ================= STICKY MOBILE BOTTOM ACTION BAR ================= */}
                      {(() => {
                        const isStep1Valid = Boolean(data.orgName && data.email && data.picName && data.phone && data.address && data.beneficiaries);
                        const isStep2Valid = editData ? true : Boolean(data.skDoc && data.izinDoc);
                        const pReqs = validatePasswordRequirements(data.password, data.password_confirmation);
                        const isPassValid = editData ? (!data.password || (pReqs.minLength && pReqs.hasNumber && pReqs.hasUpper && pReqs.passwordsMatch)) : (pReqs.minLength && pReqs.hasNumber && pReqs.hasUpper && pReqs.passwordsMatch);
                        const isFormValid = isStep1Valid && isStep2Valid && isPassValid && data.agree;

                        return (
                          <div className="sm:static sticky bottom-0 z-30 bg-white/95 backdrop-blur-md pt-4 pb-2 mt-6 border-t border-gray-100 flex items-center justify-between gap-3">
                            {currentStep > 1 ? (
                              <button
                                type="button"
                                onClick={() => setCurrentStep(prev => prev - 1)}
                                className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#293681] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                              >
                                <ArrowLeft size={16} /> Kembali
                              </button>
                            ) : <div />}

                            {currentStep < 3 ? (
                              <button
                                type="button"
                                onClick={() => {
                                  if (currentStep === 1 && isStep1Valid) setCurrentStep(2);
                                  else if (currentStep === 2 && isStep2Valid) setCurrentStep(3);
                                }}
                                disabled={(currentStep === 1 && !isStep1Valid) || (currentStep === 2 && !isStep2Valid)}
                                className={`px-6 py-3 rounded-xl text-xs font-bold text-white transition flex items-center gap-1.5 ${
                                  (currentStep === 1 && isStep1Valid) || (currentStep === 2 && isStep2Valid)
                                    ? 'bg-[#4274D9] hover:bg-[#293681] shadow-md shadow-[#4274D9]/20 cursor-pointer'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                                }`}
                              >
                                <span>Lanjut ke Langkah {currentStep + 1}</span> <ArrowRight size={16} />
                              </button>
                            ) : (
                              <button
                                type="submit"
                                disabled={processing || !isFormValid}
                                className={`px-6 py-3 rounded-xl text-xs font-bold text-white transition flex items-center gap-1.5 ${
                                  isFormValid ? 'bg-[#4274D9] hover:bg-[#293681] shadow-md shadow-[#4274D9]/20 cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                                }`}
                              >
                                {processing ? <InlineSpinner color="white" size="sm" /> : <ShieldCheck size={16} />}
                                <span>{processing ? "Memproses..." : (editData ? "Simpan Perubahan" : "Tambahkan Panti")}</span>
                              </button>
                            )}
                          </div>
                        );
                      })()}

                    </form>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
