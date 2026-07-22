import React from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { CheckCircle2, XCircle, ArrowLeft, Building2, User, Phone, MapPin, Users, FileText, Image as ImageIcon } from 'lucide-react';

const COLORS = {
  navy: "#293681",
  gold: "#F59E0B",
  mist: "#D0E7E6",
  teal: "#4274D9",
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
  const [isApproveModalOpen, setIsApproveModalOpen] = React.useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = React.useState(false);
  const [catatanPenolakan, setCatatanPenolakan] = React.useState('');

  const handleOpenApproveModal = () => {
    setIsApproveModalOpen(true);
  };

  const handleConfirmApprove = () => {
    router.patch(`/admin/panti/${panti.id}/status`, { status: 'Active' }, {
      onStart: () => setProcessing(true),
      onFinish: () => {
        setProcessing(false);
        setIsApproveModalOpen(false);
      },
    });
  };

  const handleOpenRejectModal = () => {
    setCatatanPenolakan('');
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    router.patch(`/admin/panti/${panti.id}/status`, {
      status: 'Inactive',
      catatan: catatanPenolakan
    }, {
      onStart: () => setProcessing(true),
      onFinish: () => {
        setProcessing(false);
        setIsRejectModalOpen(false);
      },
    });
  };

  const testWaLink = `https://wa.me/6281291819276?text=${encodeURIComponent(`Halo Pengurus ${panti.nama}, kami dari tim KawanBerbagi ingin mengonfirmasi pendaftaran panti Anda.`)}`;

  const DocumentCard = ({ title, file, icon: Icon = FileText }: { title: string, file: string | null, icon?: any }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#4274D9] flex items-center justify-center shrink-0">
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
          className="w-full inline-flex justify-center items-center px-4 py-2 bg-[#4274D9] text-white rounded-lg text-sm font-semibold hover:bg-[#293681] transition-colors"
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

      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard?tab=panti" className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-[#124354] hover:bg-gray-100 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h2 className="text-2xl font-bold text-[#293681]">Tinjau Pendaftaran Panti</h2>
              <p className="text-sm text-gray-500 mt-1">Periksa kelengkapan dokumen sebelum memberikan persetujuan (Notifikasi Mailtrap & WA 081291819276 aktif).</p>
            </div>
          </div>
          <a
            href={testWaLink}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-sm transition-all"
          >
            💬 Kirim WA Manual (081291819276)
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Informasi Profil */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-[#124354] mb-4">Profil Yayasan</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Nama Yayasan</span>
                  <p className="font-bold text-[#293681] text-base">{panti.nama}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Penanggung Jawab</span>
                  <p className="font-semibold text-gray-700">{panti.pimpinan}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Email Terdaftar</span>
                  <p className="font-semibold text-gray-700">{panti.email}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Nomor Telepon</span>
                  <p className="font-semibold text-gray-700">{panti.phone}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Alamat Panti</span>
                  <p className="font-medium text-gray-600">{panti.alamat}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Jumlah Anak Asuh</span>
                  <p className="font-bold text-[#4274D9]">{panti.anak} Anak</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Status Verifikasi</span>
                  <div className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${panti.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                      panti.status === 'Inactive' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                      {panti.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Aksi Verifikasi */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3">
              <h3 className="text-base font-bold text-[#124354]">Aksi Kurasi Admin</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Pemberitahuan hasil kurasi akan dikirimkan otomatis ke Mailtrap SMTP ({panti.email}) dan WhatsApp (081291819276).
              </p>

              <button
                onClick={handleOpenApproveModal}
                disabled={processing}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors shadow-sm disabled:opacity-50"
              >
                <CheckCircle2 size={18} />
                Setujui & Verifikasi Panti
              </button>
              <button
                onClick={handleOpenRejectModal}
                disabled={processing}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold transition-colors disabled:opacity-50"
              >
                <XCircle size={18} />
                Tolak Pendaftaran
              </button>
            </div>
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
                      className="w-full inline-flex justify-center items-center px-4 py-2 bg-[#4274D9] text-white rounded-lg text-sm font-semibold hover:bg-[#293681] transition-colors"
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

      {/* ================= MODAL KONFIRMASI PERSETUJUAN ================= */}
      {isApproveModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[#293681]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-emerald-600 flex items-center gap-2">
                <CheckCircle2 size={22} /> Konfirmasi Persetujuan Panti
              </h3>
              <button
                onClick={() => setIsApproveModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium">
              Apakah Anda yakin ingin <strong>MENYETUJUI</strong> pendaftaran panti asuhan <strong>{panti.nama}</strong>?
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Setelah disetujui, akun panti akan diaktifkan dan notifikasi konfirmasi resmi akan dikirimkan otomatis melalui <strong>Email</strong> dan <strong>WhatsApp</strong>.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsApproveModalOpen(false)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmApprove}
                disabled={processing}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm disabled:opacity-50 flex items-center gap-1.5"
              >
                {processing ? 'Memproses...' : 'Ya, Setujui & Kirim Notifikasi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL ALASAN PENOLAKAN ================= */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[#293681]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-red-600 flex items-center gap-2">
                <XCircle size={22} /> Tolak Pendaftaran Panti
              </h3>
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Silakan tuliskan catatan atau alasan penolakan. Catatan ini akan dicantumkan secara otomatis pada pemberitahuan Email dan WhatsApp ke pengurus panti.
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Alasan / Catatan Penolakan:
                </label>
                <textarea
                  rows={4}
                  required
                  value={catatanPenolakan}
                  onChange={(e) => setCatatanPenolakan(e.target.value)}
                  placeholder="Contoh: Dokumen izin operasional sudah tidak berlaku. Mohon dapat mengunggah berkas terbarunya."
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={processing || !catatanPenolakan.trim()}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm disabled:opacity-50"
                >
                  {processing ? 'Memproses...' : 'Kirim Penolakan & Notifikasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
