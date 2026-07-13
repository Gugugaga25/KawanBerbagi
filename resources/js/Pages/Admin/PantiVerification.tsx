import React from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { CheckCircle2, XCircle, ArrowLeft, Building2, User, Phone, MapPin, Users, FileText, Image as ImageIcon } from 'lucide-react';

const COLORS = {
  navy: '#083A4F',
  gold: '#A58D66',
  mist: '#C0D5D6',
  teal: '#407E8C',
};

interface PantiProps {
  panti: {
    id: number;
    nama: string;
    alamat: string;
    status: string;
    pimpinan: string;
    email: string;
    phone: string;
    anak: number;
    akta_yayasan: string | null;
    sk_kemenkumham: string | null;
    izin_operasional: string | null;
    npwp_yayasan: string | null;
    orgPhotoUrl: string | null;
    created_at: string;
  };
}

export default function PantiVerification({ panti }: PantiProps) {
  const [processing, setProcessing] = React.useState(false);

  const handleVerify = () => {
    router.patch(`/admin/panti/${panti.id}/status`, { status: 'Active' }, {
      onStart: () => setProcessing(true),
      onFinish: () => setProcessing(false),
    });
  };

  const handleReject = () => {
    router.patch(`/admin/panti/${panti.id}/status`, { status: 'Inactive' }, {
      onStart: () => setProcessing(true),
      onFinish: () => setProcessing(false),
    });
  };

  const DocumentCard = ({ title, file, icon: Icon = FileText }: { title: string, file: string | null, icon?: any }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#407E8C] flex items-center justify-center shrink-0">
          <Icon size={24} />
        </div>
        <div>
          <h4 className="font-bold text-[#124354]">{title}</h4>
          <p className="text-xs text-gray-500 mt-1">
            {file ? "Dokumen tersedia" : "Tidak diunggah"}
          </p>
        </div>
      </div>
      {file ? (
        <a
          href={`/storage/${file}`}
          target="_blank"
          rel="noreferrer"
          className="w-full inline-flex justify-center items-center px-4 py-2 bg-[#EAE8E3] text-[#124354] rounded-lg text-sm font-semibold hover:bg-[#D4D2CD] transition-colors"
        >
          Lihat Dokumen
        </a>
      ) : (
        <button disabled className="w-full px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed">
          Tidak Tersedia
        </button>
      )}
    </div>
  );

  return (
    <AdminLayout activeTab="panti">
      <Head title={`Verifikasi - ${panti.nama}`} />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard?tab=panti" className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-[#124354] hover:bg-gray-100 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h2 className="text-2xl font-bold text-[#124354]">Tinjau Pendaftaran Panti</h2>
              <p className="text-sm text-gray-500 mt-1">Periksa kelengkapan dokumen sebelum memberikan persetujuan.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Informasi Profil */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-[#083A4F] p-6 text-white text-center flex flex-col items-center">
                <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-4 border border-white/20 backdrop-blur-sm shadow-inner">
                  <Building2 size={36} className="text-[#C0D5D6]" />
                </div>
                <h3 className="text-xl font-bold">{panti.nama}</h3>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mt-3 ${panti.status === 'Active'
                  ? 'bg-green-500/20 text-green-200 border border-green-500/30'
                  : panti.status === 'Inactive'
                    ? 'bg-red-500/20 text-red-200 border border-red-500/30'
                    : 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                  }`}>
                  Status: {panti.status}
                </span>
              </div>

              <div className="p-6 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-50 rounded-xl text-gray-400">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Pimpinan</p>
                    <p className="font-medium text-[#124354]">{panti.pimpinan}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-50 rounded-xl text-gray-400">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Kontak</p>
                    <p className="font-medium text-[#124354]">{panti.phone}</p>
                    <p className="text-sm text-gray-500">{panti.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-50 rounded-xl text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Alamat Lengkap</p>
                    <p className="font-medium text-[#124354] leading-relaxed">{panti.alamat}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-50 rounded-xl text-gray-400">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Jumlah Anak Asuh</p>
                    <p className="font-medium text-[#124354]">{panti.anak} Anak</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Aksi Verifikasi */}
            {(panti.status === 'Pending' || panti.status === 'menunggu') && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-[#124354] mb-2 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-[#A58D66]" /> Keputusan Verifikasi
                </h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  Pastikan seluruh data dan dokumen legalitas telah sesuai dengan persyaratan sebelum menyetujui pendaftaran ini.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={handleVerify}
                    disabled={processing}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all shadow-sm shadow-green-600/20 disabled:opacity-50"
                  >
                    <CheckCircle2 size={18} />
                    Setujui & Verifikasi
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={processing}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold transition-colors disabled:opacity-50"
                  >
                    <XCircle size={18} />
                    Tolak Pendaftaran
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dokumen Legalitas */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-[#124354] mb-1">Dokumen Kelengkapan Panti</h3>
              <p className="text-sm text-gray-500 mb-6">Berkas legalitas yang diunggah oleh pendaftar sebagai syarat verifikasi.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DocumentCard title="Akta Pendirian Yayasan" file={panti.akta_yayasan} />
                <DocumentCard title="SK Kemenkumham / Kemensos" file={panti.sk_kemenkumham} />
                <DocumentCard title="TDY / Izin Operasional" file={panti.izin_operasional} />
                <DocumentCard title="NIB / NPWP Yayasan" file={panti.npwp_yayasan} />

                {/* Special case for photo which uses full url instead of storage path */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#407E8C] flex items-center justify-center shrink-0">
                      <ImageIcon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#124354]">Foto Dokumentasi Panti</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {panti.orgPhotoUrl ? "Dokumen tersedia" : "Tidak diunggah"}
                      </p>
                    </div>
                  </div>
                  {panti.orgPhotoUrl ? (
                    <a
                      href={panti.orgPhotoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full inline-flex justify-center items-center px-4 py-2 bg-[#EAE8E3] text-[#124354] rounded-lg text-sm font-semibold hover:bg-[#D4D2CD] transition-colors"
                    >
                      Lihat Foto
                    </a>
                  ) : (
                    <button disabled className="w-full px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed">
                      Tidak Tersedia
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
