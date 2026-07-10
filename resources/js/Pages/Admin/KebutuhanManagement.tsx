import React, { useState } from 'react';
import { Plus, Filter, Package, AlertCircle, CheckCircle2, Trash2, Info, Edit } from 'lucide-react';
import KebutuhanRegistrationModal from '@/Components/KebutuhanRegistrationModal';
import KebutuhanDetailModal from '@/Components/KebutuhanDetailModal';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import { useForm } from '@inertiajs/react';

export default function KebutuhanManagement({ needs = [], activeShelters = [] }: { needs?: any[], activeShelters?: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteData, setDeleteData] = useState<any>(null);
  const { delete: destroy } = useForm();

  const openAddModal = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditData(item);
    setIsModalOpen(true);
  };

  const openDetailModal = (item: any) => {
    setDetailData(item);
    setIsDetailModalOpen(true);
  };

  const confirmDelete = (item: any) => {
    setDeleteData(item);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = () => {
    if (deleteData) {
      destroy(`/admin/kebutuhan/${deleteData.id}`, {
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
          <h3 className="text-2xl font-bold text-[#124354]">Manajemen Kebutuhan</h3>
          <p className="text-sm text-gray-500 mt-1">Verifikasi dan pantau progres pengumpulan barang kebutuhan panti.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#F4F3EF] text-[#124354] rounded-xl text-sm font-medium hover:bg-[#EAE8E3] transition-colors">
            <Filter size={16} /> Filter Kategori
          </button>
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#124354] text-white rounded-xl text-sm font-medium hover:bg-[#0E3544] transition-colors shadow-sm"
          >
            <Plus size={16} /> Tambah Kebutuhan
          </button>
        </div>
      </div>

      {/* Grid Kebutuhan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {needs.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500">
            Belum ada data kebutuhan.
          </div>
        ) : (
          needs.map((item) => {
            const persentase = item.target > 0 ? Math.min(Math.round((item.terkumpul / item.target) * 100), 100) : 0;
            const isSelesai = item.status === "Terpenuhi";

            return (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden">
                {/* Top Bar Status */}
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F4F3EF] text-[#124354] flex items-center justify-center">
                    <Package size={20} />
                  </div>
                  <div className="flex gap-1.5">
                    {item.mendesak && !isSelesai && (
                      <span className="bg-red-50 text-red-600 border border-red-100 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <AlertCircle size={12} /> Mendesak
                      </span>
                    )}
                    {isSelesai && (
                      <span className="bg-green-50 text-green-700 border border-green-200 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={12} /> Terpenuhi
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-[#124354] mb-1">{item.barang}</h4>
                  <p className="text-xs text-gray-500 font-medium">{item.panti}</p>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#124354] mb-2">
                    <span>Progres ({persentase}%)</span>
                    <span>{item.terkumpul} / {item.target} {item.satuan}</span>
                  </div>
                  <div className="w-full bg-[#F4F3EF] rounded-full h-2.5 mb-6 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isSelesai ? 'bg-green-600' : 'bg-[#124354]'}`}
                      style={{ width: `${persentase}%` }}
                    ></div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => openEditModal(item)}
                      className="flex-1 flex justify-center items-center gap-1.5 bg-[#F4F3EF] hover:bg-[#EAE8E3] text-[#124354] py-2 rounded-xl text-xs font-bold transition-colors"
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button 
                      onClick={() => openDetailModal(item)}
                      className="flex-1 flex justify-center items-center gap-1.5 bg-[#124354] hover:bg-[#0E3544] text-white py-2 rounded-xl text-xs font-bold transition-colors"
                    >
                      <Info size={14} /> Detail
                    </button>
                    <button 
                      onClick={() => confirmDelete(item)}
                      className="flex-1 flex justify-center items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-xl text-xs font-bold transition-colors"
                    >
                      <Trash2 size={14} /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <KebutuhanRegistrationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeShelters={activeShelters}
        editData={editData}
      />

      <KebutuhanDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        data={detailData}
      />

      <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900">
            Apakah Anda yakin ingin menghapus data kebutuhan ini?
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Data kebutuhan <strong>{deleteData?.barang}</strong> akan dihapus secara permanen beserta data riwayat donasinya. Tindakan ini tidak dapat dibatalkan.
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
