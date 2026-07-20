import React from 'react';
import { useForm } from '@inertiajs/react';
import { User, Lock, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import InlineSpinner from '@/Components/UI/InlineSpinner';
import PasswordChecklist from '@/Components/Form/PasswordChecklist';
import CharCounter from '@/Components/Form/CharCounter';
import { validatePasswordRequirements } from '@/Utils/formUtils';
import { useToast } from '@/Components/UI/Toast';
import InlineError from '@/Components/UI/InlineError';

export default function AdminSettings({ auth }: { auth: any }) {
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

  const { showToast } = useToast();

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    patchProfile(route('profile.update'), {
      onSuccess: () => {
        showToast('Informasi profil Anda berhasil diperbarui.', 'success', 'Profil Diperbarui');
      }
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    putPassword(route('password.update'), {
      onSuccess: () => {
        resetPassword();
        showToast('Kata sandi Anda berhasil diperbarui.', 'success', 'Keamanan Terjaga');
      },
    });
  };

  return (
    <div className="space-y-8 pb-20 text-sm">
      
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#293681] tracking-tight">Pengaturan Akun</h1>
        <p className="text-gray-500 mt-1">Kelola data profil pengguna Anda dan ubah pengaturan keamanan sandi.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ================= FORM INFORMASI PROFIL ================= */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#293681] text-white flex items-center justify-center">
                <User size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#293681]">Informasi Pengguna</h3>
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
                <div className="flex justify-between items-center pl-1">
                  <label className="text-xs font-bold text-[#293681] uppercase tracking-wider">Nama Tampilan</label>
                  <CharCounter current={profileData.name.length} max={50} />
                </div>
                <input 
                  type="text" 
                  required
                  maxLength={50}
                  value={profileData.name}
                  onChange={e => setProfileData('name', e.target.value)}
                  className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-[#293681] focus:outline-none focus:ring-2 focus:ring-[#4274D9]/30 transition-all font-semibold ${
                    profileErrors.name ? 'border-red-400 bg-red-50/20' : 'border-gray-200 focus:border-[#4274D9]'
                  }`}
                  placeholder="Nama Admin..."
                />
                <InlineError message={profileErrors.name} />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center pl-1">
                  <label className="text-xs font-bold text-[#293681] uppercase tracking-wider">Alamat Email</label>
                  <CharCounter current={profileData.email.length} max={80} />
                </div>
                <input 
                  type="email" 
                  required
                  maxLength={80}
                  value={profileData.email}
                  onChange={e => setProfileData('email', e.target.value)}
                  className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-[#293681] focus:outline-none focus:ring-2 focus:ring-[#4274D9]/30 transition-all font-semibold ${
                    profileErrors.email ? 'border-red-400 bg-red-50/20' : 'border-gray-200 focus:border-[#4274D9]'
                  }`}
                  placeholder="Email Admin..."
                />
                <InlineError message={profileErrors.email} />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={profileProcessing}
                  className="px-6 py-3 bg-[#4274D9] hover:bg-[#293681] text-white font-bold rounded-xl transition duration-150 shadow-md shadow-[#4274D9]/10 disabled:opacity-50 flex items-center gap-2"
                >
                  {profileProcessing && <InlineSpinner color="white" size="sm" />}
                  <span>{profileProcessing ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ================= FORM UBAH SANDI ================= */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#4274D9] text-white flex items-center justify-center">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#293681]">Keamanan Sandi</h3>
                <p className="text-xs text-gray-400">Pastikan akun Anda menggunakan kata sandi yang kuat.</p>
              </div>
            </div>

            {passwordSuccessful && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl flex items-center gap-2">
                <CheckCircle2 size={18} className="shrink-0" />
                <span className="font-semibold text-xs">Kata sandi Anda berhasil diperbarui.</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#293681] uppercase tracking-wider pl-1">Kata Sandi Saat Ini</label>
                <div className="relative">
                  <input 
                    type={showCurrentPassword ? 'text' : 'password'} 
                    required
                    value={passwordData.current_password}
                    onChange={e => setPasswordData('current_password', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-12 py-3 text-[#293681] focus:outline-none focus:ring-2 focus:ring-[#4274D9]/30 focus:border-[#4274D9] transition-all font-semibold"
                    placeholder="Masukkan sandi saat ini..."
                  />
                  <button 
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordErrors.current_password && <p className="text-red-500 text-xs mt-1">{passwordErrors.current_password}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#293681] uppercase tracking-wider pl-1">Kata Sandi Baru</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required
                    value={passwordData.password}
                    onChange={e => setPasswordData('password', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-12 py-3 text-[#293681] focus:outline-none focus:ring-2 focus:ring-[#4274D9]/30 focus:border-[#4274D9] transition-all font-semibold"
                    placeholder="Masukkan sandi baru..."
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordErrors.password && <p className="text-red-500 text-xs mt-1">{passwordErrors.password}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#293681] uppercase tracking-wider pl-1">Konfirmasi Kata Sandi Baru</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    required
                    value={passwordData.password_confirmation}
                    onChange={e => setPasswordData('password_confirmation', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-12 py-3 text-[#293681] focus:outline-none focus:ring-2 focus:ring-[#4274D9]/30 focus:border-[#4274D9] transition-all font-semibold"
                    placeholder="Ulangi sandi baru..."
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordErrors.password_confirmation && <p className="text-red-500 text-xs mt-1">{passwordErrors.password_confirmation}</p>}
              </div>

              {/* Password Requirements Checklist */}
              <PasswordChecklist 
                password={passwordData.password} 
                confirmation={passwordData.password_confirmation} 
              />

              <div className="pt-4">
                {(() => {
                  const reqs = validatePasswordRequirements(passwordData.password, passwordData.password_confirmation);
                  const isFormValid = Boolean(passwordData.current_password && reqs.minLength && reqs.hasNumber && reqs.hasUpper && reqs.passwordsMatch);

                  return (
                    <button
                      type="submit"
                      disabled={passwordProcessing || !isFormValid}
                      className={`px-6 py-3 font-bold rounded-xl transition duration-150 shadow-md flex items-center gap-2 ${
                        isFormValid 
                          ? 'bg-[#4274D9] hover:bg-[#293681] text-white shadow-[#4274D9]/10' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                      }`}
                    >
                      {passwordProcessing && <InlineSpinner color="white" size="sm" />}
                      <span>{passwordProcessing ? 'Menyimpan...' : 'Perbarui Sandi'}</span>
                    </button>
                  );
                })()}
              </div>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}
