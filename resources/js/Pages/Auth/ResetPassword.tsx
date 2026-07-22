import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import InlineSpinner from '@/Components/UI/InlineSpinner';
import { useToast } from '@/Components/UI/Toast';

const COLORS = {
  navy: "#293681",
  gold: "#F59E0B",
  mist: "#D0E7E6",
  teal: "#4274D9",
  cream: "#F8FAFC",
};

export default function ResetPassword({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    token: token,
    email: email || '',
    password: '',
    password_confirmation: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    post(route('password.store'), {
      onFinish: () => reset('password', 'password_confirmation'),
      onError: (errors) => {
        if (errors.email) {
          showToast(errors.email, 'error', 'Reset Sandi Gagal');
        } else if (errors.password) {
          showToast(errors.password, 'error', 'Reset Sandi Gagal');
        } else {
          showToast('Terjadi kesalahan saat mereset kata sandi Anda.', 'error', 'Reset Sandi Gagal');
        }
      },
    });
  };

  const isFormValid = Boolean(data.email && data.password && data.password_confirmation);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center font-sans relative overflow-hidden p-4 sm:p-6"
      style={{ backgroundColor: COLORS.cream }}
    >
      <Head title="Reset Kata Sandi" />

      {/* Dekorasi Background */}
      <div
        className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ backgroundColor: COLORS.mist }}
      />
      <div
        className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ backgroundColor: COLORS.teal }}
      />

      <div className="w-full max-w-md z-10 flex flex-col gap-6">
        {/* Logo Brand */}
        <div className="text-center flex justify-center w-full">
          <div className="inline-flex flex-col items-center justify-center gap-1 text-center">
            <img src="/images/logokb2.png" alt="Logo KawanBerbagi" className="w-16 h-16 object-contain" />
            <span className="text-3xl font-bold tracking-tight" style={{ color: COLORS.navy }}>
              KawanBerbagi
              <span style={{ color: COLORS.teal }}>.</span>
            </span>
            <p className="text-sm" style={{ color: COLORS.navy }}>
              Arsip Kebaikan. Donasi Tepat Sasaran.
            </p>
          </div>
        </div>

        {/* Card Putih */}
        <div
          className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border"
          style={{ borderColor: "rgba(192, 213, 214, 0.3)" }}
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2" style={{ color: COLORS.navy }}>
              Atur Ulang Kata Sandi
            </h1>
            <p className="text-sm" style={{ color: COLORS.navy, opacity: 0.65 }}>
              Silakan masukkan email Anda dan tentukan kata sandi baru untuk akun Anda.
            </p>
          </div>

          <form onSubmit={submit} className="flex flex-col gap-5">
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
                  onChange={(e) => setData('email', e.target.value)}
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

            {/* Input Password Baru */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.navy }}>
                Kata Sandi Baru
              </label>
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
                  onChange={(e) => setData('password', e.target.value)}
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

            {/* Input Konfirmasi Password */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.navy }}>
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} style={{ color: COLORS.navy, opacity: 0.4 }} />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirmation"
                  required
                  placeholder="••••••••"
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  className="w-full pl-11 pr-12 py-3 rounded-xl text-sm outline-none transition-all duration-200 border focus:border-[#4274D9] focus:ring-2 focus:ring-[#4274D9]/20 font-semibold"
                  style={{
                    backgroundColor: "#f9fafb",
                    borderColor: COLORS.mist,
                    color: COLORS.navy,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:opacity-70 transition-opacity"
                  style={{ color: COLORS.navy, opacity: 0.4 }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.password_confirmation}</p>
              )}
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
              <span>{processing ? "Menyimpan Sandi..." : "Reset Kata Sandi"}</span>
              {!processing && <ArrowRight size={18} />}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs" style={{ color: COLORS.navy, opacity: 0.4 }}>
          &copy; {new Date().getFullYear()} KawanBerbagi. All rights reserved.
        </p>
      </div>
    </div>
  );
}
