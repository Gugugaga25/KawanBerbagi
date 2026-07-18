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
  User,
  Phone,
  MapPin,
  X,
  CheckCircle2
} from "lucide-react";

const COLORS = {
  navy: "#083A4F",
  gold: "#A58D66",
  mist: "#C0D5D6",
  teal: "#407E8C",
  cream: "#E5E1DD",
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
  "w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 border focus:border-[#407E8C]";
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
  const [submitted, setSubmitted] = useState(false);
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
        setSubmitted(true);
        reset('password', 'password_confirmation');
      },
    });
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setSubmitted(false);
      reset();
    }, 300);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
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
                    <Dialog.Title as="h3" className="text-2xl sm:text-3xl font-bold mb-3 pr-8" style={{ color: COLORS.navy }}>
                      {editData ? "Edit Data Panti" : "Daftarkan Panti Baru"}
                    </Dialog.Title>
                    <p className="text-base mb-8" style={{ color: COLORS.navy, opacity: 0.7 }}>
                      {editData ? "Perbarui informasi yayasan yang sudah terdaftar." : "Lengkapi data yayasan untuk mendaftarkan panti baru ke dalam sistem."}
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                      <Field icon={Building2} label="Nama Yayasan / Panti">
                        <input
                          required
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
                        <Field icon={User} label="Nama Penanggung Jawab">
                          <input
                            required
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
                            className={inputBase}
                            style={inputStyle}
                          />
                          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
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
                          {editData && editData.akta_yayasan && !data.aktaDoc && (
                            <a href={`/storage/${editData.akta_yayasan}`} target="_blank" rel="noreferrer" className="text-xs text-[#407E8C] hover:underline mt-1 block">
                              Lihat Akta Saat Ini
                            </a>
                          )}
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
                          {editData && editData.sk_kemenkumham && !data.skDoc && (
                            <a href={`/storage/${editData.sk_kemenkumham}`} target="_blank" rel="noreferrer" className="text-xs text-[#407E8C] hover:underline mt-1 block">
                              Lihat SK Saat Ini
                            </a>
                          )}
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
                          {editData && editData.izin_operasional && !data.izinDoc && (
                            <a href={`/storage/${editData.izin_operasional}`} target="_blank" rel="noreferrer" className="text-xs text-[#407E8C] hover:underline mt-1 block">
                              Lihat Izin Saat Ini
                            </a>
                          )}
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
                          {editData && editData.npwp_yayasan && !data.npwpDoc && (
                            <a href={`/storage/${editData.npwp_yayasan}`} target="_blank" rel="noreferrer" className="text-xs text-[#407E8C] hover:underline mt-1 block">
                              Lihat NPWP Saat Ini
                            </a>
                          )}
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
                        {editData && editData.orgPhotoUrl && !data.orgPhoto && (
                          <a href={editData.orgPhotoUrl} target="_blank" rel="noreferrer" className="text-xs text-[#407E8C] hover:underline mt-1 block">
                            Lihat Foto Saat Ini
                          </a>
                        )}
                      </div>

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
                            className="absolute inset-y-0 right-0 pr-4 flex items-center hover:opacity-70"
                            style={{ color: COLORS.navy, opacity: 0.45 }}
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
                            className="absolute inset-y-0 right-0 pr-4 flex items-center hover:opacity-70"
                            style={{ color: COLORS.navy, opacity: 0.45 }}
                          >
                            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </Field>
                      </div>

                      <div
                        className="flex items-start gap-2.5 rounded-xl p-3.5 mt-2"
                        style={{ backgroundColor: "rgba(165,141,102,0.12)" }}
                      >
                        <ShieldCheck size={18} color={COLORS.gold} className="mt-0.5 shrink-0" />
                        <p className="text-xs leading-relaxed" style={{ color: COLORS.navy, opacity: 0.75 }}>
                          Data panti akan langsung tersimpan dan aktif dalam sistem setelah Anda menambahkan.
                        </p>
                      </div>

                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          required
                          checked={data.agree}
                          onChange={(e) => setData("agree", e.target.checked)}
                          className="mt-0.5 rounded"
                          style={{ accentColor: COLORS.teal }}
                        />
                        <span className="text-sm" style={{ color: COLORS.navy, opacity: 0.7 }}>
                          Saya menyatakan data yang diisi benar dan sesuai dengan dokumen yang ada.
                        </span>
                      </label>

                      <button
                        type="submit"
                        disabled={processing}
                        className="mt-4 w-full inline-flex items-center justify-center gap-2 text-base font-semibold py-3.5 rounded-full text-white hover:brightness-110 transition disabled:opacity-70"
                        style={{ backgroundColor: COLORS.navy }}
                      >
                        {processing ? "Memproses..." : (editData ? "Simpan Perubahan" : "Tambahkan Panti")} <ArrowRight size={18} />
                      </button>
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
