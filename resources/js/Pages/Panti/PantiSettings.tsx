import React from 'react';
import { useForm } from '@inertiajs/react';
import { User, Lock, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export default function PantiSettings({ auth }: { auth: any }) {
  // Form Info Profil
  const { 
    data: profileData, 
    setData: setProfileData, 
    patch: patchProfile, 
    processing: profileProcessing, 
    errors: profileErrors, 
    recentlySuccessful: profileSuccessful 
  } = useForm({
    name: auth.user.name,
    email: auth.user.email,
  });

  // Form Ubah Password
  const { 
    data: passwordData, 
    setData: setPasswordData, 
    put: putPassword, 
    processing: passwordProcessing, 
    errors: passwordErrors, 
    reset: resetPassword, 
    recentlySuccessful: passwordSuccessful 
  } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    patchProfile(route('profile.update'));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    putPassword(route('password.update'), {
      onSuccess: () => resetPassword(),
    });
  };

  return (
    <div className="space-y-8 pb-20 text-sm">
      
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#124354] tracking-tight">Pengaturan Akun</h1>
        <p className="text-gray-500 mt-1">Kelola data profil pengguna Anda dan ubah pengaturan keamanan sandi.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ================= FORM INFORMASI PROFIL ================= */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#124354] text-white flex items-center justify-center">
                <User size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#124354]">Informasi Pengguna</h3>
                <p className="text-xs text-gray-400">Perbarui nama tampilan dan alamat email akun Anda.</p>
              </div>
            </div>

            {profileSuccessful && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl flex items-center gap-2">
                <CheckCircle2 size={18} className="shrink-0" />
                <span className="font-semibold text-xs">Informasi akun Anda berhasil diperbarui.</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#124354] uppercase tracking-wider pl-1">Nama Tampilan</label>
                <input 
                  type="text" 
                  required
                  value={profileData.name}
                  onChange={e => setProfileData('name', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#124354] focus:outline-none focus:ring-2 focus:ring-[#407E8C]/30 focus:border-[#407E8C] transition-all"
                  placeholder="Nama Pengurus Panti..."
                />
                {profileErrors.name && <p className="text-red-500 text-xs mt-1">{profileErrors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#124354] uppercase tracking-wider pl-1">Alamat Email</label>
                <input 
                  type="email" 
                  required
                  value={profileData.email}
                  onChange={e => setProfileData('email', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#124354] focus:outline-none focus:ring-2 focus:ring-[#407E8C]/30 focus:border-[#407E8C] transition-all"
                  placeholder="email@domain.com"
                />
                {profileErrors.email && <p className="text-red-500 text-xs mt-1">{profileErrors.email}</p>}
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button 
                  type="submit" 
                  disabled={profileProcessing}
                  className="px-6 py-3 bg-[#124354] hover:bg-[#0E3544] text-white font-bold rounded-xl transition-all shadow-md disabled:opacity-50"
                >
                  {profileProcessing ? 'Menyimpan...' : 'Simpan Profil'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ================= FORM UBAH PASSWORD ================= */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#124354] text-white flex items-center justify-center">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#124354]">Keamanan Kata Sandi</h3>
                <p className="text-xs text-gray-400">Pastikan akun Anda menggunakan kata sandi yang kuat dan aman.</p>
              </div>
            </div>

            {passwordSuccessful && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl flex items-center gap-2">
                <CheckCircle2 size={18} className="shrink-0" />
                <span className="font-semibold text-xs">Kata sandi Anda berhasil diperbarui.</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#124354] uppercase tracking-wider pl-1">Kata Sandi Saat Ini</label>
                <div className="relative flex items-center">
                  <input 
                    type={showCurrentPassword ? "text" : "password"} 
                    required
                    value={passwordData.current_password}
                    onChange={e => setPasswordData('current_password', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-12 py-3 text-[#124354] focus:outline-none focus:ring-2 focus:ring-[#407E8C]/30 focus:border-[#407E8C] transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 text-gray-400 hover:text-[#124354] transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordErrors.current_password && <p className="text-red-500 text-xs mt-1">{passwordErrors.current_password}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#124354] uppercase tracking-wider pl-1">Kata Sandi Baru</label>
                <div className="relative flex items-center">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={passwordData.password}
                    onChange={e => setPasswordData('password', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-12 py-3 text-[#124354] focus:outline-none focus:ring-2 focus:ring-[#407E8C]/30 focus:border-[#407E8C] transition-all"
                    placeholder="Minimal 8 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-gray-400 hover:text-[#124354] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordErrors.password && <p className="text-red-500 text-xs mt-1">{passwordErrors.password}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#124354] uppercase tracking-wider pl-1">Konfirmasi Kata Sandi Baru</label>
                <div className="relative flex items-center">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    required
                    value={passwordData.password_confirmation}
                    onChange={e => setPasswordData('password_confirmation', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-12 py-3 text-[#124354] focus:outline-none focus:ring-2 focus:ring-[#407E8C]/30 focus:border-[#407E8C] transition-all"
                    placeholder="Ketik ulang kata sandi baru"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 text-gray-400 hover:text-[#124354] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordErrors.password_confirmation && <p className="text-red-500 text-xs mt-1">{passwordErrors.password_confirmation}</p>}
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button 
                  type="submit" 
                  disabled={passwordProcessing}
                  className="px-6 py-3 bg-[#124354] hover:bg-[#0E3544] text-white font-bold rounded-xl transition-all shadow-md disabled:opacity-50"
                >
                  {passwordProcessing ? 'Menyimpan...' : 'Perbarui Sandi'}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}
