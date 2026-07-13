import React, { useState } from 'react';
import { MoreVertical, Filter, Plus, Building2, CheckCircle, Clock, Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import PantiRegistrationModal from '@/Components/PantiRegistrationModal';
import Dropdown from '@/Components/Dropdown';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import { useForm } from '@inertiajs/react';

const DATA_PANTI = [
  { id: 1, nama: "Yayasan Kasih Ibu", alamat: "Bandung, Jawa Barat", status: "Terverifikasi", pimpinan: "H. Ahmad", anak: 45 },
  { id: 2, nama: "Panti Nurul Iman", alamat: "Jakarta Timur", status: "Pending", pimpinan: "Siti Aminah", anak: 32 },
  { id: 3, nama: "Rumah Yatim Cahaya", alamat: "Surabaya, Jawa Timur", status: "Terverifikasi", pimpinan: "Budi Santoso", anak: 60 },
  { id: 4, nama: "Panti Wreda Bahagia", alamat: "Yogyakarta", status: "Terverifikasi", pimpinan: "Lestari", anak: 28 },
];

const COLORS = {
  navy: '#083A4F',
  gold: '#A58D66',
  mist: '#C0D5D6',
  teal: '#407E8C',
};

export default function PantiManagement({ pantis = [] }: { pantis?: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteData, setDeleteData] = useState<any>(null);
  const { delete: destroy } = useForm();

  // Hapus fallback DATA_PANTI, langsung gunakan properti pantis
  const displayData = pantis || [];

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
      destroy(`/admin/panti/${deleteData.id}`, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setDeleteData(null);
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h3 className="text-2xl font-bold text-[#124354]">Manajemen Panti Asuhan</h3>
          <p className="text-sm text-gray-500 mt-1">Kelola verifikasi dan data panti yang terdaftar di sistem.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-[#5A7C85] rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
            <Filter size={16} /> Filter Status
          </button>
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#124354] text-white rounded-xl text-sm font-medium hover:bg-[#0E3544] transition-colors shadow-sm"
          >
            <Plus size={16} /> Daftarkan Panti
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-visible">
        <div className="overflow-visible">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="text-white text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold rounded-tl-2xl" style={{background: COLORS.navy}}>Nama Panti</th>
                <th className="px-6 py-4 font-bold" style={{background: COLORS.navy}}>Pimpinan</th>
                <th className="px-6 py-4 font-bold" style={{background: COLORS.navy}}>Lokasi</th>
                <th className="px-6 py-4 font-bold" style={{background: COLORS.navy}}>Jml. Anak</th>
                <th className="px-6 py-4 font-bold" style={{background: COLORS.navy}}>Status</th>
                <th className="px-6 py-4 font-bold text-right rounded-tr-2xl" style={{background: COLORS.navy}}>Aksi</th>
              </tr>
            </thead>
            <tbody className="text-[#124354] text-sm">
              {displayData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 border-b border-gray-100">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Building2 size={32} className="text-gray-300" />
                      <p className="font-medium">Tidak ada data panti</p>
                      <p className="text-xs text-gray-400">Silakan daftarkan panti baru untuk mulai mengelola.</p>
                    </div>
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
                    <td className="px-6 py-4 font-semibold border-b border-gray-100">{panti.anak} Anak</td>
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
          <div className="mt-6 flex justify-end">
            <SecondaryButton onClick={() => setIsDeleteModalOpen(false)}>Batal</SecondaryButton>
            <DangerButton className="ml-3" onClick={executeDelete}>
              Hapus Data
            </DangerButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}