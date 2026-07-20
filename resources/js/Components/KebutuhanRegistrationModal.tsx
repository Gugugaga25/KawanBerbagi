import React, { FormEventHandler } from 'react';
import { X, Building2, ChevronDown, Search, Check } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import CharCounter from '@/Components/Form/CharCounter';
import InlineSpinner from '@/Components/UI/InlineSpinner';
import { useToast } from '@/Components/UI/Toast';

interface KebutuhanRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeShelters?: any[];
  editData?: any;
}

export default function KebutuhanRegistrationModal({ isOpen, onClose, activeShelters = [], editData = null }: KebutuhanRegistrationModalProps) {
  const { showToast } = useToast();
  const { data, setData, post, patch, processing, errors, reset, clearErrors } = useForm({
    id_shelter: '',
    nama_kebutuhan: '',
    jumlah: '',
    satuan: '',
    is_mendesak: false,
  });

  const [shelterSearch, setShelterSearch] = React.useState('');
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (editData && isOpen) {
      // Cari ID panti berdasarkan nama yayasan jika tidak ada id
      const shelter = activeShelters.find(s => s.nama === editData.panti);
      const shelterId = shelter?.id || '';
      
      setData({
        id_shelter: shelterId.toString(),
        nama_kebutuhan: editData.barang,
        jumlah: editData.target,
        satuan: editData.satuan,
        is_mendesak: editData.mendesak,
      });
      if (shelter) setShelterSearch(shelter.nama);
    } else {
      reset();
      setShelterSearch('');
    }
  }, [editData, isOpen]);

  React.useEffect(() => {
    if (data.id_shelter) {
      const selected = activeShelters.find(s => s.id.toString() === data.id_shelter.toString());
      if (selected) setShelterSearch(selected.nama);
    }
  }, [data.id_shelter, activeShelters]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredShelters = activeShelters.filter(shelter =>
    shelter.nama.toLowerCase().includes(shelterSearch.toLowerCase())
  );

  if (!isOpen) return null;

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    if (editData) {
      patch(route('admin.kebutuhan.update', editData.id), {
        onSuccess: () => {
          showToast(`Kebutuhan barang "${data.nama_kebutuhan}" berhasil diperbarui.`, 'success', 'Pembaruan Sukses');
          reset();
          clearErrors();
          onClose();
        },
        onError: () => {
          showToast('Gagal memperbarui kebutuhan barang. Periksa kembali form.', 'error', 'Pembaruan Gagal');
        }
      });
    } else {
      post(route('admin.kebutuhan.store'), {
        onSuccess: () => {
          showToast(`Kebutuhan barang "${data.nama_kebutuhan}" berhasil ditambahkan.`, 'success', 'Penambahan Sukses');
          reset();
          clearErrors();
          onClose();
        },
        onError: () => {
          showToast('Gagal menambahkan kebutuhan barang baru. Periksa kembali form.', 'error', 'Penambahan Gagal');
        }
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
            
            {/* Panti Asuhan Searchable Dropdown */}
            <div className="space-y-2 relative" ref={dropdownRef}>
              <label className="text-sm font-semibold text-[#124354]">
                Pilih Panti Asuhan <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Building2 size={18} className="text-[#124354]/60" />
                </div>
                <input
                  type="text"
                  required={!data.id_shelter}
                  value={shelterSearch}
                  onFocus={() => setIsDropdownOpen(true)}
                  onChange={(e) => {
                    setShelterSearch(e.target.value);
                    setIsDropdownOpen(true);
                    const match = activeShelters.find(s => s.nama.toLowerCase() === e.target.value.toLowerCase());
                    if (match) {
                      setData('id_shelter', match.id.toString());
                    } else {
                      setData('id_shelter', '');
                    }
                  }}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-[#4A828F] focus:ring-2 focus:ring-[#4A828F]/20 transition-all text-sm font-semibold text-[#124354] bg-white placeholder:text-gray-400"
                  placeholder="Cari atau pilih nama Panti Asuhan..."
                />
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#124354] transition-colors"
                  title="Tampilkan daftar panti"
                >
                  <ChevronDown size={18} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-[#124354]' : ''}`} />
                </button>
              </div>

              {/* Floating Dropdown List */}
              {isDropdownOpen && (
                <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl max-h-44 overflow-y-auto py-1 space-y-0.5 border border-gray-100">
                  {filteredShelters.length > 0 ? (
                    filteredShelters.map((shelter) => {
                      const isSelected = data.id_shelter.toString() === shelter.id.toString();
                      return (
                        <button
                          key={shelter.id}
                          type="button"
                          onClick={() => {
                            setData('id_shelter', shelter.id.toString());
                            setShelterSearch(shelter.nama);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                            isSelected 
                              ? 'bg-[#124354]/10 text-[#124354] font-bold' 
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Building2 size={14} className={isSelected ? 'text-[#124354]' : 'text-gray-400'} />
                            <span className="truncate">{shelter.nama}</span>
                          </div>
                          {isSelected && <Check size={14} className="text-[#124354] shrink-0" />}
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-4 py-3 text-xs text-gray-400 text-center flex items-center justify-center gap-1.5">
                      <Search size={14} /> Panti asuhan tidak ditemukan
                    </div>
                  )}
                </div>
              )}
              {errors.id_shelter && <p className="text-red-500 text-xs mt-1">{errors.id_shelter}</p>}
            </div>

            {/* Nama Barang */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-[#124354]">
                  Nama Barang <span className="text-red-500">*</span>
                </label>
                <CharCounter current={data.nama_kebutuhan.length} max={60} />
              </div>
              <input
                type="text"
                required
                maxLength={60}
                value={data.nama_kebutuhan}
                onChange={e => setData('nama_kebutuhan', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#4A828F] focus:ring-2 focus:ring-[#4A828F]/20 transition-all text-sm font-medium"
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
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-[#124354]">
                    Satuan <span className="text-red-500">*</span>
                  </label>
                  <CharCounter current={data.satuan.length} max={20} />
                </div>
                <input
                  type="text"
                  required
                  maxLength={20}
                  value={data.satuan}
                  onChange={e => setData('satuan', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#4A828F] focus:ring-2 focus:ring-[#4A828F]/20 transition-all text-sm font-medium"
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
          {(() => {
            const isFormValid = Boolean(data.id_shelter && data.nama_kebutuhan && data.jumlah && data.satuan);
            return (
              <button
                type="submit"
                form="kebutuhan-form"
                disabled={processing || !isFormValid}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm flex items-center gap-2 ${
                  isFormValid 
                    ? 'bg-[#124354] hover:bg-[#0E3544] text-white cursor-pointer' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                {processing && <InlineSpinner color="white" size="sm" />}
                <span>{processing ? 'Menyimpan...' : (editData ? 'Simpan Perubahan' : 'Simpan Kebutuhan')}</span>
              </button>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
