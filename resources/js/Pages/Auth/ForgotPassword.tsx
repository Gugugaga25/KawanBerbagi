import React, { useEffect } from 'react';
import { Link, Head, useForm } from '@inertiajs/react';
import { Mail, ArrowLeft } from 'lucide-react';
import InlineSpinner from '@/Components/UI/InlineSpinner';
import { useToast } from '@/Components/UI/Toast';

const COLORS = {
  navy: "#293681",
  gold: "#F59E0B",
  mist: "#D0E7E6",
  teal: "#4274D9",
  cream: "#F8FAFC",
};

export default function ForgotPassword({ status }: { status?: string }) {
  const { showToast } = useToast();
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });

  useEffect(() => {
    if (status) {
      showToast(status, 'success', 'Tautan Dikirim');
    }
  }, [status]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('password.email'), {
      onError: (errors) => {
        if (errors.email) {
          showToast(errors.email, 'error', 'Gagal Mengirim');
        } else {
          showToast('Terjadi kesalahan saat memproses permintaan Anda.', 'error', 'Gagal Mengirim');
        }
      }
    });
  };

  const isFormValid = Boolean(data.email);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center font-sans relative overflow-hidden p-4 sm:p-6"
      style={{ backgroundColor: COLORS.cream }}
    >
      <Head title="Lupa Kata Sandi" />

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
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full backdrop-blur-md transition-all duration-200 border hover:opacity-80 shadow-sm"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            borderColor: "rgba(192, 213, 214, 0.5)",
            color: COLORS.navy,
          }}
        >
          <ArrowLeft size={16} /> Kembali ke Login
        </Link>
      </div>

      <div className="w-full max-w-md z-10 flex flex-col gap-6">
        {/* Logo Brand */}
        <div className="text-center flex justify-center w-full">
          <div className="inline-flex flex-col items-center justify-center gap-1 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#293681] p-3 flex items-center justify-center shadow-md mb-1">
              <img src="/images/logokb2_white.png" alt="Logo KawanBerbagi" className="w-full h-full object-contain" />
            </div>
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
              Lupa Kata Sandi?
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: COLORS.navy, opacity: 0.65 }}>
              Masukkan alamat email Anda yang terdaftar. Kami akan mengirimkan tautan reset kata sandi agar Anda dapat memperbaruinya.
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
              <span>{processing ? "Mengirim Tautan..." : "Kirim Tautan Reset Sandi"}</span>
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
