import React, { useState } from 'react';
import { Search, Filter, Plus, Building2, MoreVertical, Edit, Trash2, MessageSquare, RotateCcw, CheckCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import PantiRegistrationModal from '@/Components/PantiRegistrationModal';
import Dropdown from '@/Components/Dropdown';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import { useForm, router } from '@inertiajs/react';
import InlineSpinner from '@/Components/UI/InlineSpinner';
import { useToast } from '@/Components/UI/Toast';
import CriticalErrorModal from '@/Components/UI/CriticalErrorModal';
import EmptyState from '@/Components/UI/EmptyState';

const COLORS = {
  navy: '#293681',
  gold: '#F59E0B',
  mist: '#D0E7E6',
  teal: '#4274D9',
};

export default function PantiManagement({ pantis = [] }: { pantis?: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteData, setDeleteData] = useState<any>(null);
  const { delete: destroy, processing: isDeleting } = useForm();
  const [localPantis, setLocalPantis] = useState<any[]>(pantis || []);

  React.useEffect(() => {
    setLocalPantis(pantis || []);
  }, [pantis]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('semua');

  const filteredPantis = localPantis.filter(panti => {
    const matchesSearch = (panti.nama || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (panti.pimpinan || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (panti.alamat || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'semua' || panti.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const displayData = filteredPantis;

  const { showToast } = useToast();
  const [criticalError, setCriticalError] = useState<{ isOpen: boolean; retryAction?: () => void }>({ isOpen: false });

  const openAddModal = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const openEditModal = (panti: any) => {
    setEditData(panti);
    setIsModalOpen(true);
  };

  const confirmDelete = (panti: any) => {
    setDeleteData(panti);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = () => {
    if (deleteData) {
      const pantiToDelete = deleteData;
      // Optimistic UI: remove item locally immediately
      setLocalPantis(prev => prev.filter(p => p.id !== pantiToDelete.id));
      setIsDeleteModalOpen(false);
      setDeleteData(null);
      showToast(`Data panti "${pantiToDelete.nama}" berhasil dihapus.`, 'success', 'Penghapusan Sukses');

      destroy(`/admin/panti/${pantiToDelete.id}`, {
        onError: () => {
          // Automatic rollback on failure
          setLocalPantis(prev => [...prev, pantiToDelete]);
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#293681]">Manajemen Panti Asuhan</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Kelola verifikasi dan data panti yang terdaftar di sistem.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari nama panti/lokasi..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#124354] focus:outline-none focus:ring-2 focus:ring-[#4274D9]/20 focus:border-[#4274D9] transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#124354] focus:outline-none focus:ring-2 focus:ring-[#4274D9]/20 transition-all cursor-pointer"
          >
            <option value="semua">Semua Status</option>
            <option value="Terverifikasi">Terverifikasi</option>
            <option value="Pending">Pending</option>
          </select>

          <button 
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4274D9] text-white rounded-xl text-xs font-bold hover:bg-[#293681] transition-colors shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Plus size={16} /> Daftarkan Panti
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto w-full no-scrollbar">
          <table className="w-full text-left border-separate border-spacing-0 min-w-[760px]">
            <thead className="text-white text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold rounded-tl-2xl" style={{background: COLORS.teal}}>Nama Panti</th>
                <th className="px-6 py-4 font-bold" style={{background: COLORS.teal}}>Pimpinan</th>
                <th className="px-6 py-4 font-bold" style={{background: COLORS.teal}}>Lokasi</th>
                <th className="px-6 py-4 font-bold" style={{background: COLORS.teal}}>Jumlah Binaan</th>
                <th className="px-6 py-4 font-bold" style={{background: COLORS.teal}}>Status</th>
                <th className="px-6 py-4 font-bold text-right rounded-tr-2xl" style={{background: COLORS.teal}}>Aksi</th>
              </tr>
            </thead>
            <tbody className="text-[#124354] text-sm">
              {displayData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-0 border-b border-gray-100">
                    <EmptyState
                      mode={searchQuery || statusFilter !== 'semua' ? 'search' : 'empty'}
                      icon={Building2}
                      title={searchQuery || statusFilter !== 'semua' ? 'Panti Asuhan Tidak Ditemukan' : 'Belum Ada Panti Terdaftar'}
                      description="Silakan daftarkan panti asuhan baru untuk mulai mengelola data verifikasi."
                      searchQuery={searchQuery}
                      onResetSearch={() => {
                        setSearchQuery('');
                        setStatusFilter('semua');
                      }}
                      onAction={openAddModal}
                      actionLabel="Daftarkan Panti Pertama"
                    />
                  </td>
                </tr>
              ) : (
                displayData.map((panti) => (
                  <tr key={panti.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#EAE8E3] text-[#124354] flex items-center justify-center font-bold">
                          <Building2 size={18} />
                        </div>
                        <span className="font-bold">{panti.nama}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium border-b border-gray-100">{panti.pimpinan}</td>
                    <td className="px-6 py-4 text-gray-500 border-b border-gray-100">{panti.alamat}</td>
                    <td className="px-6 py-4 font-semibold border-b border-gray-100">{panti.anak} Orang</td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        panti.status === 'Active' 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : panti.status === 'Inactive'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {panti.status === 'Active' ? <CheckCircle size={12} /> : panti.status === 'Inactive' ? <XCircle size={12} /> : <Clock size={12} />}
                        {panti.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right border-b border-gray-100">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => router.visit(route('admin.chat.init_panti', { id_panti: panti.id }))}
                          className="p-2 text-[#5A7C85] hover:text-[#407E8C] hover:bg-[#407E8C]/10 rounded-lg transition-colors mr-1"
                          title="Hubungi Panti"
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
                            onClick={() => openEditModal(panti)}
                            className="flex items-center gap-2 text-[#124354] hover:bg-[#F4F3EF] block w-full px-4 py-2 text-start text-sm leading-5 transition duration-150 ease-in-out"
                          >
                            <Edit size={16} /> Edit
                          </button>
                          
                          {(panti.status === 'Pending' || panti.status === 'menunggu') && (
                          <Dropdown.Link href={`/admin/panti/${panti.id}/verification`} className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 w-full text-left">
                            <CheckCircle2 size={16} /> Tinjau
                          </Dropdown.Link>
                        )}
  
                          <button 
                            onClick={() => confirmDelete(panti)}
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

      <PantiRegistrationModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} editData={editData} />

      <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900">
            Apakah Anda yakin ingin menghapus data panti ini?
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Data panti <strong>{deleteData?.nama}</strong> dan akun penggunanya akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
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
        title="Gagal Menghapus Data Panti"
        message="Server mengalami gangguan saat memproses penghapusan data panti. Data panti telah dikembalikan seperti semula."
        onRetry={criticalError.retryAction}
        onClose={() => setCriticalError({ isOpen: false })}
      />
    </div>
  );
}