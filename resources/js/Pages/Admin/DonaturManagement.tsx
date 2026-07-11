import React, { useState } from 'react';
import { Filter, Plus, Mail, Award, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import DonaturRegistrationModal from '@/Components/DonaturRegistrationModal';
import Dropdown from '@/Components/Dropdown';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

const COLORS = {
  navy: "#083A4F",
  gold: "#A58D66",
  mist: "#C0D5D6",
  teal: "#407E8C",
  cream: "#E5E1DD",
};

export default function DonaturManagement({ donaturs = [] }: { donaturs?: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteData, setDeleteData] = useState<any>(null);
  const { delete: destroy } = useForm();

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
      destroy(`/admin/donatur/${deleteData.id}`, {
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
        <h3 className="text-2xl font-bold text-[#124354]">Data Donatur</h3>
          <p className="text-sm text-[#5A7C85] mt-1">Kelola data donatur dan riwayat donasinya</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-[#5A7C85] rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
            <Filter size={16} /> Filter Tier
          </button>
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#124354] text-white rounded-xl text-sm font-medium hover:bg-[#0E3544] transition-colors shadow-sm"
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
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider rounded-tl-2xl" style={{background: COLORS.navy}}>Informasi Donatur</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider" style={{background: COLORS.navy}}>Total Donasi</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center" style={{background: COLORS.navy}}>Tier</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider" style={{background: COLORS.navy}}>Terakhir Donasi</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right rounded-tr-2xl" style={{background: COLORS.navy}}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {donaturs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 border-b border-gray-100">Belum ada data donatur.</td>
                </tr>
              ) : (
                donaturs.map((donor) => (
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