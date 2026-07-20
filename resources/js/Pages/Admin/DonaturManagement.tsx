import React, { useState } from 'react';
import { Search, Filter, Plus, Mail, Award, MoreVertical, Edit, Trash2, MessageSquare, UserCheck } from 'lucide-react';
import { useForm, router } from '@inertiajs/react';
import InlineSpinner from '@/Components/UI/InlineSpinner';
import { useToast } from '@/Components/UI/Toast';
import CriticalErrorModal from '@/Components/UI/CriticalErrorModal';
import EmptyState from '@/Components/UI/EmptyState';
import DonaturRegistrationModal from '@/Components/DonaturRegistrationModal';
import Dropdown from '@/Components/Dropdown';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

const COLORS = {
  navy: "#293681",
  gold: "#F59E0B",
  mist: "#D0E7E6",
  teal: "#4274D9",
  cream: "#F8FAFC",
};

export default function DonaturManagement({ donaturs = [] }: { donaturs?: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteData, setDeleteData] = useState<any>(null);
  const { delete: destroy, processing: isDeleting } = useForm();
  const [localDonaturs, setLocalDonaturs] = useState<any[]>(donaturs || []);

  React.useEffect(() => {
    setLocalDonaturs(donaturs || []);
  }, [donaturs]);

  const { showToast } = useToast();
  const [criticalError, setCriticalError] = useState<{ isOpen: boolean; retryAction?: () => void }>({ isOpen: false });

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('semua');

  const filteredDonaturs = localDonaturs.filter((donor: any) => {
    const matchesSearch = (donor.nama || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (donor.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'semua' || donor.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  const openAddModal = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const openEditModal = (donor: any) => {
    setEditData(donor);
    setIsModalOpen(true);
  };

  const confirmDelete = (donor: any) => {
    setDeleteData(donor);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = () => {
    if (deleteData) {
      const donorToDelete = deleteData;
      // Optimistic UI: remove item locally immediately
      setLocalDonaturs(prev => prev.filter(d => d.id !== donorToDelete.id));
      setIsDeleteModalOpen(false);
      setDeleteData(null);
      showToast(`Data donatur "${donorToDelete.nama}" berhasil dihapus.`, 'success', 'Penghapusan Sukses');

      destroy(`/admin/donatur/${donorToDelete.id}`, {
        onError: () => {
          // Automatic rollback on failure
          setLocalDonaturs(prev => [...prev, donorToDelete]);
          setCriticalError({
            isOpen: true,
            retryAction: () => executeDelete()
          });
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h3 className="text-2xl font-extrabold text-[#293681]">Data Donatur</h3>
          <p className="text-sm text-[#5A7C85] mt-1">Kelola data donatur dan riwayat donasinya</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari nama/email donatur..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#124354] focus:outline-none focus:ring-2 focus:ring-[#407E8C]/20 focus:border-[#407E8C] transition-all"
            />
          </div>

          {/* Tier Filter */}
          <select
            value={tierFilter}
            onChange={e => setTierFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#124354] focus:outline-none focus:ring-2 focus:ring-[#407E8C]/20 transition-all cursor-pointer"
          >
            <option value="semua">Semua Tier</option>
            <option value="Sultan">Sultan</option>
            <option value="Setia">Setia</option>
            <option value="Dermawan">Dermawan</option>
            <option value="Baru">Baru</option>
          </select>

          <button 
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#4274D9] text-white rounded-xl text-xs font-bold hover:bg-[#293681] transition-colors shadow-sm cursor-pointer"
          >
            <Plus size={16} /> Tambah Donatur
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-visible">
        <div className="overflow-visible">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="text-white text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider rounded-tl-2xl" style={{background: COLORS.teal}}>Informasi Donatur</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider" style={{background: COLORS.teal}}>Total Donasi</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center" style={{background: COLORS.teal}}>Tier</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider" style={{background: COLORS.teal}}>Terakhir Donasi</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right rounded-tr-2xl" style={{background: COLORS.teal}}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonaturs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-0 border-b border-gray-100">
                    <EmptyState
                      mode={searchQuery || tierFilter !== 'semua' ? 'search' : 'empty'}
                      icon={UserCheck}
                      title={searchQuery || tierFilter !== 'semua' ? 'Donatur Tidak Ditemukan' : 'Belum Ada Donatur Terdaftar'}
                      description="Mulai tambahkan donatur baru untuk mengelola riwayat donasi dan peringkat tier."
                      searchQuery={searchQuery}
                      onResetSearch={() => {
                        setSearchQuery('');
                        setTierFilter('semua');
                      }}
                      onAction={openAddModal}
                      actionLabel="Tambah Donatur Pertama"
                    />
                  </td>
                </tr>
              ) : (
                filteredDonaturs.map((donor) => (
                  <tr key={donor.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#124354]/10 flex items-center justify-center font-bold text-[#124354]">
                          {donor.nama.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-[#124354]">{donor.nama}</p>
                          <div className="flex items-center gap-1.5 text-xs text-[#5A7C85] mt-0.5">
                            <Mail size={12} /> {donor.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <p className="font-semibold text-[#124354]">{donor.total}</p>
                      <p className="text-xs text-[#5A7C85] mt-0.5">{donor.frekuensi} kali berdonasi</p>
                    </td>
                    <td className="px-6 py-4 text-center border-b border-gray-100">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                        ${donor.tier === 'Platinum' ? 'bg-purple-100 text-purple-700' : 
                          donor.tier === 'Gold' ? 'bg-yellow-100 text-yellow-700' : 
                          donor.tier === 'Silver' ? 'bg-gray-100 text-gray-700' : 
                          'bg-orange-100 text-orange-700'}`}
                      >
                        <Award size={14} /> {donor.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-[#5A7C85] border-b border-gray-100">
                      {donor.terakhir}
                    </td>
                    <td className="px-6 py-4 text-right border-b border-gray-100">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => router.visit(route('admin.chat.init_donatur', { id_donatur: donor.id }))}
                          className="p-2 text-[#5A7C85] hover:text-[#407E8C] hover:bg-[#407E8C]/10 rounded-lg transition-colors mr-1"
                          title="Hubungi Donatur"
                        >
                          <MessageSquare size={18} />
                        </button>
                        <Dropdown>
                          <Dropdown.Trigger>
                            <button className="p-2 text-gray-400 hover:text-[#124354] hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreVertical size={18} />
                            </button>
                          </Dropdown.Trigger>

                        <Dropdown.Content align="right" width="48" contentClasses="py-1 bg-white border border-gray-100 shadow-xl rounded-xl">
                          <button 
                            onClick={() => openEditModal(donor)}
                            className="flex items-center gap-2 text-[#124354] hover:bg-[#F4F3EF] block w-full px-4 py-2 text-start text-sm leading-5 transition duration-150 ease-in-out"
                          >
                            <Edit size={16} /> Edit
                          </button>
                          
                          <button 
                            onClick={() => confirmDelete(donor)}
                            className="flex items-center gap-2 text-red-600 hover:bg-red-50 block w-full px-4 py-2 text-start text-sm leading-5 transition duration-150 ease-in-out"
                          >
                            <Trash2 size={16} /> Hapus
                          </button>
                        </Dropdown.Content>
                      </Dropdown>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DonaturRegistrationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editData={editData}
      />

      <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900">
            Apakah Anda yakin ingin menghapus data donatur ini?
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Data donatur <strong>{deleteData?.nama}</strong> dan akun penggunanya akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="mt-6 flex justify-end items-center gap-3">
            <SecondaryButton onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>Batal</SecondaryButton>
            <DangerButton onClick={executeDelete} disabled={isDeleting} className="flex items-center gap-2">
              {isDeleting && <InlineSpinner color="white" size="sm" />}
              <span>{isDeleting ? 'Menghapus...' : 'Hapus Data'}</span>
            </DangerButton>
          </div>
        </div>
      </Modal>

      <CriticalErrorModal 
        isOpen={criticalError.isOpen}
        title="Gagal Menghapus Data Donatur"
        message="Server mengalami gangguan saat memproses penghapusan data donatur. Data donatur telah dikembalikan seperti semula."
        onRetry={criticalError.retryAction}
        onClose={() => setCriticalError({ isOpen: false })}
      />
    </div>
  );
}