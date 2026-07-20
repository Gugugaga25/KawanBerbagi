import React, { FormEventHandler, useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import CharCounter from '@/Components/Form/CharCounter';
import PasswordChecklist from '@/Components/Form/PasswordChecklist';
import { sanitizePhoneNumber, validatePasswordRequirements } from '@/Utils/formUtils';
import InlineSpinner from '@/Components/UI/InlineSpinner';
import { useToast } from '@/Components/UI/Toast';

interface DonaturRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: any;
}

export default function DonaturRegistrationModal({ isOpen, onClose, editData }: DonaturRegistrationModalProps) {
  const { showToast } = useToast();
  const { data, setData, post, patch, processing, errors, reset, clearErrors } = useForm({
    name: '',
    email: '',
    phone: '',
    city: '',
    password: '',
    password_confirmation: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setData({
          name: editData.nama || '',
          email: editData.email || '',
          phone: editData.phone || '',
          city: editData.city || '',
          password: '',
          password_confirmation: '',
        });
      } else {
        reset();
      }
      clearErrors();
    }
  }, [isOpen, editData]);

  if (!isOpen) return null;

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    if (editData) {
      patch(route('admin.donatur.update', editData.id), {
        onSuccess: () => {
          showToast(`Data donatur "${data.name}" berhasil diperbarui.`, 'success', 'Pembaruan Sukses');
          reset();
          onClose();
        },
        onError: () => {
          showToast('Gagal memperbarui data donatur. Periksa kembali form.', 'error', 'Pembaruan Gagal');
        }
      });
    } else {
      post(route('admin.donatur.store'), {
        onSuccess: () => {
          showToast(`Donatur baru "${data.name}" berhasil didaftarkan.`, 'success', 'Pendaftaran Sukses');
          reset();
          onClose();
        },
        onError: () => {
          showToast('Gagal mendaftarkan donatur baru. Periksa kembali form.', 'error', 'Pendaftaran Gagal');
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-[#124354]">{editData ? 'Edit Data Donatur' : 'Tambah Donatur Baru'}</h3>
            <p className="text-sm text-[#5A7C85] mt-1">
              {editData ? 'Perbarui informasi donatur' : 'Daftarkan donatur baru ke dalam sistem'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          <form id="donatur-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Nama Lengkap */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-[#124354]">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <CharCounter current={data.name.length} max={50} />
                </div>
                <input
                  type="text"
                  required
                  maxLength={50}
                  value={data.name}
                  onChange={e => setData('name', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#4A828F] focus:ring-2 focus:ring-[#4A828F]/20 transition-all text-sm font-medium"
                  placeholder="Masukkan nama lengkap"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#124354]">
                  Alamat Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={data.email}
                  onChange={e => setData('email', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#4A828F] focus:ring-2 focus:ring-[#4A828F]/20 transition-all text-sm"
                  placeholder="Masukkan email"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Nomor Telepon/WA */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#124354]">
                  Nomor WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={data.phone}
                  onChange={e => setData('phone', e.target.value)}
                  onBlur={() => setData('phone', sanitizePhoneNumber(data.phone))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#4A828F] focus:ring-2 focus:ring-[#4A828F]/20 transition-all text-sm font-medium"
                  placeholder="08123456789 atau +62 812..."
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* Kota */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-[#124354]">
                    Asal Kota <span className="text-red-500">*</span>
                  </label>
                  <CharCounter current={data.city.length} max={50} />
                </div>
                <input
                  type="text"
                  required
                  maxLength={50}
                  value={data.city}
                  onChange={e => setData('city', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#4A828F] focus:ring-2 focus:ring-[#4A828F]/20 transition-all text-sm font-medium"
                  placeholder="Contoh: Jakarta"
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2 md:col-span-2">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#124354]">
                      Password {!editData && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="password"
                      required={!editData}
                      value={data.password}
                      onChange={e => setData('password', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#4A828F] focus:ring-2 focus:ring-[#4A828F]/20 transition-all text-sm"
                      placeholder={editData ? "Kosongkan jika tidak ingin diubah" : "Minimal 8 karakter"}
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#124354]">
                      Konfirmasi Password {!editData && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="password"
                      required={!editData}
                      value={data.password_confirmation}
                      onChange={e => setData('password_confirmation', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#4A828F] focus:ring-2 focus:ring-[#4A828F]/20 transition-all text-sm"
                      placeholder="Ketik ulang password"
                    />
                    {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>}
                  </div>
                </div>

                <PasswordChecklist password={data.password} confirmation={data.password_confirmation} />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Batal
          </button>

          {(() => {
            const hasRequiredFields = Boolean(data.name && data.email && data.phone && data.city);
            const passwordReqs = validatePasswordRequirements(data.password, data.password_confirmation);
            const isPasswordValid = editData ? (!data.password || (passwordReqs.minLength && passwordReqs.hasNumber && passwordReqs.hasUpper && passwordReqs.passwordsMatch)) : (passwordReqs.minLength && passwordReqs.hasNumber && passwordReqs.hasUpper && passwordReqs.passwordsMatch);
            const isFormValid = hasRequiredFields && isPasswordValid;

            return (
              <button
                type="submit"
                form="donatur-form"
                disabled={processing || !isFormValid}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2 ${
                  isFormValid 
                    ? 'bg-[#124354] hover:bg-[#0E3544] text-white cursor-pointer' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                {processing && <InlineSpinner color="white" size="sm" />}
                <span>{processing ? 'Menyimpan...' : 'Simpan Data'}</span>
              </button>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
