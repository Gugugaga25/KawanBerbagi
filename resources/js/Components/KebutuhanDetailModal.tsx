import React from 'react';
import { X, Calendar, Clock, User, Building2, Package, CheckCircle, Info } from 'lucide-react';
import Modal from '@/Components/Modal';

interface KebutuhanDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export default function KebutuhanDetailModal({ isOpen, onClose, data }: KebutuhanDetailModalProps) {
  if (!isOpen || !data) return null;

  const persentase = data.target > 0 ? Math.round((data.terkumpul / data.target) * 100) : 0;
  
  // Pisahkan string tanggal dari API (contoh: "10 Jul 2026, 14:30")
  const createdDate = data.created_at ? data.created_at.split(',')[0] : '-';
  const createdTime = data.created_at && data.created_at.includes(',') ? data.created_at.split(',')[1].trim() : '-';

  return (
    <Modal show={isOpen} onClose={onClose} maxWidth="xl">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#F4F3EF]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#124354]/10 flex items-center justify-center text-[#124354]">
              <Info size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#124354]">Detail Campaign</h3>
              <p className="text-sm text-[#5A7C85] mt-1">{data.barang}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Card Info Publisher */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            <h4 className="text-sm font-bold text-[#124354] mb-4">Informasi Publisher</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Building2 size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Panti Asuhan</p>
                  <p className="text-sm font-semibold text-[#124354]">{data.panti}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Tanggal Posting</p>
                  <p className="text-sm font-semibold text-[#124354]">{createdDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Jam Posting</p>
                  <p className="text-sm font-semibold text-[#124354]">{createdTime}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Target Kebutuhan</p>
                  <p className="text-sm font-semibold text-[#124354]">{data.target} {data.satuan}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Pemenuhan */}
          <div>
            <h4 className="text-sm font-bold text-[#124354] mb-3">Progress Pemenuhan</h4>
            <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
              <div className="flex justify-between text-xs font-bold text-[#124354] mb-2">
                <span>Terkumpul: {data.terkumpul} {data.satuan}</span>
                <span>{persentase}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className={`h-2.5 rounded-full transition-all duration-500 ${persentase >= 100 ? 'bg-green-500' : 'bg-[#124354]'}`}
                  style={{ width: `${Math.min(persentase, 100)}%` }}
                ></div>
              </div>
              {persentase >= 100 && (
                <div className="mt-3 flex items-center gap-2 text-green-600 text-xs font-bold bg-green-50 px-3 py-2 rounded-lg">
                  <CheckCircle size={14} /> Campaign Terpenuhi
                </div>
              )}
            </div>
          </div>

          {/* Riwayat Donasi */}
          <div>
            <h4 className="text-sm font-bold text-[#124354] mb-3">Riwayat Donasi</h4>
            {data.donations && data.donations.length > 0 ? (
              <div className="space-y-3">
                {data.donations.map((donasi: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#124354]/10 flex items-center justify-center text-[#124354]">
                        <User size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#124354]">{donasi.donor_name}</p>
                        <p className="text-xs text-gray-500">{donasi.tanggal}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#4A828F]">+{donasi.jumlah} {data.satuan}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        donasi.status === 'Sukses' ? 'bg-green-100 text-green-700' :
                        donasi.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {donasi.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                <p className="text-sm text-gray-500">Belum ada percobaan donasi untuk kebutuhan ini.</p>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
}
