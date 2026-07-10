import React, { FormEventHandler } from 'react';
import { X, Building2 } from 'lucide-react';
import { useForm } from '@inertiajs/react';

interface KebutuhanRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeShelters?: any[];
  editData?: any;
}

export default function KebutuhanRegistrationModal({ isOpen, onClose, activeShelters = [], editData = null }: KebutuhanRegistrationModalProps) {
  const { data, setData, post, patch, processing, errors, reset, clearErrors } = useForm({
    id_shelter: '',
    nama_kebutuhan: '',
    jumlah: '',
    satuan: '',
    is_mendesak: false,
  });

  React.useEffect(() => {
    if (editData && isOpen) {
      // Cari ID panti berdasarkan nama yayasan jika tidak ada id
      const shelterId = activeShelters.find(s => s.nama === editData.panti)?.id || '';
      
      setData({
        id_shelter: shelterId.toString(),
        nama_kebutuhan: editData.barang,
        jumlah: editData.target,
        satuan: editData.satuan,
        is_mendesak: editData.mendesak,
      });
    } else {
      reset();
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    if (editData) {
      patch(route('admin.kebutuhan.update', editData.id), {
        onSuccess: () => {
          reset();
          clearErrors();
          onClose();
        },
      });
    } else {
      post(route('admin.kebutuhan.store'), {
        onSuccess: () => {
          reset();
          clearErrors();
          onClose();
        },
      });
    }
  };

  const handleClose = () => {
    reset();
    clearErrors();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-[#124354]">
              {editData ? 'Edit Kebutuhan' : 'Tambah Kebutuhan'}
            </h3>
            <p className="text-sm text-[#5A7C85] mt-1">
              {editData ? 'Ubah informasi data target kebutuhan barang' : 'Daftarkan target kebutuhan barang untuk panti asuhan'}
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          <form id="kebutuhan-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Panti Asuhan */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#124354]">
                Pilih Panti Asuhan <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Building2 size={18} />
                </div>
                <select
                  required
                  value={data.id_shelter}
                  onChange={e => setData('id_shelter', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#4A828F] focus:ring-2 focus:ring-[#4A828F]/20 transition-all text-sm appearance-none bg-white"
                >
                  <option value="" disabled>-- Pilih Panti --</option>
                  {activeShelters.map((shelter) => (
                    <option key={shelter.id} value={shelter.id}>
                      {shelter.nama}
                    </option>
                  ))}
                </select>
              </div>
              {errors.id_shelter && <p className="text-red-500 text-xs mt-1">{errors.id_shelter}</p>}
            </div>

            {/* Nama Barang */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#124354]">
                Nama Barang <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={data.nama_kebutuhan}
                onChange={e => setData('nama_kebutuhan', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#4A828F] focus:ring-2 focus:ring-[#4A828F]/20 transition-all text-sm"
                placeholder="Contoh: Beras, Susu Bayi, Selimut"
              />
              {errors.nama_kebutuhan && <p className="text-red-500 text-xs mt-1">{errors.nama_kebutuhan}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Jumlah */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#124354]">
                  Jumlah Target <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={data.jumlah}
                  onChange={e => setData('jumlah', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#4A828F] focus:ring-2 focus:ring-[#4A828F]/20 transition-all text-sm"
                  placeholder="Contoh: 50"
                />
                {errors.jumlah && <p className="text-red-500 text-xs mt-1">{errors.jumlah}</p>}
              </div>

              {/* Satuan */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#124354]">
                  Satuan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={data.satuan}
                  onChange={e => setData('satuan', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#4A828F] focus:ring-2 focus:ring-[#4A828F]/20 transition-all text-sm"
                  placeholder="Contoh: kg, kaleng, dus"
                />
                {errors.satuan && <p className="text-red-500 text-xs mt-1">{errors.satuan}</p>}
              </div>
            </div>

            {/* Mendesak Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200">
              <div>
                <label className="text-sm font-bold text-[#124354] block">Tandai Mendesak</label>
                <p className="text-xs text-gray-500 mt-0.5">Kebutuhan ini akan diprioritaskan</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={data.is_mendesak}
                  onChange={e => setData('is_mendesak', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4A828F]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            form="kebutuhan-form"
            disabled={processing}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#124354] hover:bg-[#0E3544] transition-colors shadow-sm disabled:opacity-50"
          >
            {processing ? 'Menyimpan...' : (editData ? 'Simpan Perubahan' : 'Simpan Kebutuhan')}
          </button>
        </div>
      </div>
    </div>
  );
}
