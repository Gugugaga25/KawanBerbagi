import React, { useState, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import { useForm, usePage } from '@inertiajs/react';
import PasswordChecklist from '@/Components/Form/PasswordChecklist';
import { sanitizePhoneNumber, validatePasswordRequirements } from '@/Utils/formUtils';
import InlineSpinner from '@/Components/UI/InlineSpinner';
import { useToast } from '@/Components/UI/Toast';

const COLORS = {
  navy: "#293681",
  gold: "#F59E0B",
  mist: "#D0E7E6",
  teal: "#4274D9",
  cream: "#F8FAFC",
};

interface DonaturData {
  id_donor: number;
  nama_lengkap: string;
  no_wa: string | null;
  kota: string | null;
  foto_profil: string | null;
  email: string;
  member_since: string;
}

export default function ProfilSaya({ donaturData }: { donaturData?: DonaturData | null }) {
  const { flash } = usePage().props as any;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(donaturData?.foto_profil ?? null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { showToast } = useToast();

  // ---- Form: Informasi Profil ----
  const profileForm = useForm({
    nama_lengkap: donaturData?.nama_lengkap ?? '',
    no_wa: donaturData?.no_wa ?? '',
    kota: donaturData?.kota ?? '',
    foto_profil: null as File | null,
  });

  // ---- Form: Email ----
  const emailForm = useForm({
    email: donaturData?.email ?? '',
  });

  // ---- Form: Password ----
  const passwordForm = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const handleFotoClick = () => fileInputRef.current?.click();

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      profileForm.setData('foto_profil', file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    profileForm.post(route('donatur.profil.update'), {
      forceFormData: true,
      onSuccess: () => {
        showToast('Informasi profil Anda berhasil diperbarui.', 'success', 'Profil Diperbarui');
      },
      onError: (errors) => {
        const firstError = Object.values(errors)[0];
        showToast(firstError || 'Gagal memperbarui profil. Periksa kembali input Anda.', 'error', 'Pembaruan Gagal');
      }
    });
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    emailForm.patch(route('donatur.profil.updateEmail'), {
      onSuccess: () => {
        showToast('Alamat email Anda berhasil diperbarui.', 'success', 'Email Diperbarui');
      },
      onError: (errors) => {
        const firstError = Object.values(errors)[0];
        showToast(firstError || 'Gagal memperbarui email. Periksa kembali input Anda.', 'error', 'Pembaruan Gagal');
      }
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    passwordForm.patch(route('donatur.profil.updatePassword'), {
      onSuccess: () => {
        passwordForm.reset();
        showToast('Kata sandi Anda berhasil diperbarui.', 'success', 'Keamanan Terjaga');
      },
      onError: (errors) => {
        const firstError = Object.values(errors)[0];
        showToast(firstError || 'Gagal memperbarui kata sandi. Periksa kembali input Anda.', 'error', 'Keamanan Gagal');
      }
    });
  };

  const initials = (donaturData?.nama_lengkap ?? 'D').charAt(0).toUpperCase();

  return (
    <div className="space-y-6 max-w-3xl">

      {/* Flash messages */}
      {flash?.success && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm font-medium">
          <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
          {flash.success}
        </div>
      )}
      {flash?.error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-sm font-medium">
          <AlertCircle size={18} className="text-red-400 shrink-0" />
          {flash.error}
        </div>
      )}

      {/* ===== AVATAR + IDENTITAS SINGKAT ===== */}
      <div
        className="rounded-[1.75rem] p-6 sm:p-8 flex items-center gap-6"
        style={{ backgroundColor: '#ffffff', border: `1px solid ${COLORS.mist}` }}
      >
        <div className="relative shrink-0" onClick={handleFotoClick}>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Foto Profil"
              className="w-20 h-20 rounded-full object-cover border-2 cursor-pointer"
              style={{ borderColor: COLORS.mist }}
            />
          ) : (
            <div
              className="w-20 h-20 rounded-full bg-[#4274D9]/20 flex items-center justify-center text-2xl font-extrabold cursor-pointer select-none"
              style={{ color: COLORS.navy }}
            >
              {initials}
            </div>
          )}
          <button
            type="button"
            onClick={handleFotoClick}
            className="absolute bottom-0 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white transition-transform bg-[#4274D9] hover:bg-[#293681] hover:scale-110"
          >
            <Camera size={13} color={COLORS.cream} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFotoChange}
          />
        </div>
        <div>
          <p className="text-lg font-extrabold" style={{ color: COLORS.navy }}>
            {donaturData?.nama_lengkap ?? 'Donatur'}
          </p>
          <p className="text-sm mt-0.5" style={{ color: COLORS.teal }}>
            {donaturData?.email ?? ''}
          </p>
          <p className="text-xs mt-1" style={{ color: COLORS.navy, opacity: 0.45 }}>
            Donatur sejak {donaturData?.member_since ?? '-'}
          </p>
          {profileForm.errors.foto_profil && (
            <p className="text-red-500 text-xs mt-1.5 font-bold">{profileForm.errors.foto_profil}</p>
          )}
        </div>
      </div>

      {/* ===== FORM 1: INFORMASI PRIBADI ===== */}
      <form onSubmit={handleProfileSubmit}>
        <div
          className="rounded-[1.75rem] p-6 sm:p-8"
          style={{ backgroundColor: '#ffffff', border: `1px solid ${COLORS.mist}` }}
        >
          <h3 className="text-base font-extrabold mb-6" style={{ color: COLORS.navy }}>
            Informasi Pribadi
          </h3>
          <div className="grid sm:grid-cols-2 gap-5">
            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 ml-1" style={{ color: COLORS.navy }}>
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: COLORS.navy, opacity: 0.4 }} />
                <input
                  value={profileForm.data.nama_lengkap}
                  onChange={e => profileForm.setData('nama_lengkap', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none border focus:border-[#407E8C] transition-colors"
                  style={{ backgroundColor: '#FAFAF9', borderColor: COLORS.mist, color: COLORS.navy }}
                  placeholder="Nama lengkap Anda"
                />
              </div>
              {profileForm.errors.nama_lengkap && (
                <p className="text-red-500 text-xs mt-1">{profileForm.errors.nama_lengkap}</p>
              )}
            </div>

            {/* No. WhatsApp */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 ml-1" style={{ color: COLORS.navy }}>
                No. WhatsApp
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: COLORS.navy, opacity: 0.4 }} />
                <input
                  value={profileForm.data.no_wa}
                  onChange={e => profileForm.setData('no_wa', e.target.value)}
                  onBlur={() => profileForm.setData('no_wa', sanitizePhoneNumber(profileForm.data.no_wa))}
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none border focus:border-[#4274D9] focus:ring-2 focus:ring-[#4274D9]/20 transition-colors"
                  style={{ backgroundColor: '#FAFAF9', borderColor: COLORS.mist, color: COLORS.navy }}
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              {profileForm.errors.no_wa && (
                <p className="text-red-500 text-xs mt-1.5 font-semibold">{profileForm.errors.no_wa}</p>
              )}
            </div>

            {/* Kota */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 ml-1" style={{ color: COLORS.navy }}>
                Kota
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: COLORS.navy, opacity: 0.4 }} />
                <input
                  value={profileForm.data.kota}
                  onChange={e => profileForm.setData('kota', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none border focus:border-[#407E8C] transition-colors"
                  style={{ backgroundColor: '#FAFAF9', borderColor: COLORS.mist, color: COLORS.navy }}
                  placeholder="Kota tempat tinggal Anda"
                />
              </div>
              {profileForm.errors.kota && (
                <p className="text-red-500 text-xs mt-1">{profileForm.errors.kota}</p>
              )}
            </div>

            {/* Foto Profil preview info */}
            {profileForm.data.foto_profil && (
              <div className="sm:col-span-2 flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <p className="text-xs font-medium text-emerald-800">
                  Foto baru dipilih: {(profileForm.data.foto_profil as File).name}
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={profileForm.processing || !profileForm.data.nama_lengkap}
            className={`mt-6 inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-full text-white transition-all shadow-md ${
              profileForm.data.nama_lengkap && !profileForm.processing
                ? 'bg-[#4274D9] hover:bg-[#293681] shadow-[#4274D9]/20 cursor-pointer'
                : 'bg-gray-300 text-gray-400 cursor-not-allowed shadow-none'
            }`}
          >
            {profileForm.processing ? <InlineSpinner color="white" size="sm" /> : <CheckCircle2 size={16} />}
            <span>{profileForm.processing ? 'Menyimpan...' : 'Simpan Profil'}</span>
          </button>
        </div>
      </form>

      {/* ===== FORM 2: UBAH EMAIL ===== */}
      <form onSubmit={handleEmailSubmit}>
        <div
          className="rounded-[1.75rem] p-6 sm:p-8"
          style={{ backgroundColor: '#ffffff', border: `1px solid ${COLORS.mist}` }}
        >
          <h3 className="text-base font-extrabold mb-6" style={{ color: COLORS.navy }}>
            Alamat Email
          </h3>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 ml-1" style={{ color: COLORS.navy }}>
              Email Akun
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: COLORS.navy, opacity: 0.4 }} />
              <input
                type="email"
                value={emailForm.data.email}
                onChange={e => emailForm.setData('email', e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none border focus:border-[#407E8C] transition-colors"
                style={{ backgroundColor: '#FAFAF9', borderColor: COLORS.mist, color: COLORS.navy }}
                placeholder="email@contoh.com"
              />
            </div>
            {emailForm.errors.email && (
              <p className="text-red-500 text-xs mt-1">{emailForm.errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={emailForm.processing}
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-full text-white transition-all hover:brightness-110 disabled:opacity-50 bg-[#4274D9] hover:bg-[#293681]"
          >
            <CheckCircle2 size={16} />
            {emailForm.processing ? 'Menyimpan...' : 'Simpan Email'}
          </button>
        </div>
      </form>

      {/* ===== FORM 3: KEAMANAN / GANTI PASSWORD ===== */}
      <form onSubmit={handlePasswordSubmit}>
        <div
          className="rounded-[1.75rem] p-6 sm:p-8"
          style={{ backgroundColor: '#ffffff', border: `1px solid ${COLORS.mist}` }}
        >
          <h3 className="text-base font-extrabold mb-6" style={{ color: COLORS.navy }}>
            Keamanan Akun
          </h3>
          <div className="space-y-4">
            {/* Kata sandi lama */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 ml-1" style={{ color: COLORS.navy }}>
                Kata Sandi Saat Ini
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: COLORS.navy, opacity: 0.4 }} />
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordForm.data.current_password}
                  onChange={e => passwordForm.setData('current_password', e.target.value)}
                  className="w-full pl-11 pr-12 py-3 rounded-xl text-sm outline-none border focus:border-[#407E8C] transition-colors"
                  style={{ backgroundColor: '#FAFAF9', borderColor: COLORS.mist, color: COLORS.navy }}
                  placeholder="Masukkan kata sandi saat ini"
                />
                <button type="button" onClick={() => setShowCurrentPassword(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordForm.errors.current_password && (
                <p className="text-red-500 text-xs mt-1">{passwordForm.errors.current_password}</p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Kata sandi baru */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 ml-1" style={{ color: COLORS.navy }}>
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: COLORS.navy, opacity: 0.4 }} />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.data.password}
                    onChange={e => passwordForm.setData('password', e.target.value)}
                    className="w-full pl-11 pr-12 py-3 rounded-xl text-sm outline-none border focus:border-[#407E8C] transition-colors"
                    style={{ backgroundColor: '#FAFAF9', borderColor: COLORS.mist, color: COLORS.navy }}
                    placeholder="Min. 8 karakter"
                  />
                  <button type="button" onClick={() => setShowNewPassword(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordForm.errors.password && (
                  <p className="text-red-500 text-xs mt-1">{passwordForm.errors.password}</p>
                )}
              </div>

              {/* Konfirmasi kata sandi */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 ml-1" style={{ color: COLORS.navy }}>
                  Konfirmasi Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: COLORS.navy, opacity: 0.4 }} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordForm.data.password_confirmation}
                    onChange={e => passwordForm.setData('password_confirmation', e.target.value)}
                    className="w-full pl-11 pr-12 py-3 rounded-xl text-sm outline-none border focus:border-[#407E8C] transition-colors"
                    style={{ backgroundColor: '#FAFAF9', borderColor: COLORS.mist, color: COLORS.navy }}
                    placeholder="Ulangi kata sandi baru"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordForm.errors.password_confirmation && (
                  <p className="text-red-500 text-xs mt-1.5 font-semibold">{passwordForm.errors.password_confirmation}</p>
                )}
              </div>
            </div>

            <PasswordChecklist password={passwordForm.data.password} confirmation={passwordForm.data.password_confirmation} />
          </div>

          <button
            type="submit"
            disabled={passwordForm.processing}
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-full text-white transition-all bg-[#4274D9] hover:bg-[#293681] disabled:opacity-50"
          >
            <Lock size={16} />
            {passwordForm.processing ? 'Memperbarui...' : 'Perbarui Kata Sandi'}
          </button>
        </div>
      </form>

    </div>
  );
}