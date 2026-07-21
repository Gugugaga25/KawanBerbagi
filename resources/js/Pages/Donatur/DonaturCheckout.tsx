import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import {
  ArrowLeft,
  Package,
  MapPin,
  Minus,
  Plus,
  Truck,
  Home,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Phone,
} from 'lucide-react';

const COLORS = {
  navy: "#293681",
  gold: "#F59E0B",
  mist: "#D0E7E6",
  teal: "#4274D9",
  cream: "#F8FAFC",
};

interface CheckoutProps {
  need: {
    id: number;
    org: string;
    address: string;
    phone: string;
    item: string;
    category: string;
    unit: string;
    filled: number;
    total: number;
    remaining: number;
  };
  prefilled: {
    jumlah: number;
    catatan: string;
  };
  donaturData?: any;
}

export default function CheckoutDonasi({ need, prefilled, donaturData }: CheckoutProps) {
  const { data, setData, post, processing, errors } = useForm({
    id_needs: need.id,
    jumlah_donasi: Math.min(prefilled.jumlah || 1, need.remaining),
    metode_pengiriman: '' as 'ekspedisi' | 'mandiri' | 'jemput' | '',
    kurir: 'JNE',
    resi: '',
    pesan: prefilled.catatan || '',
    konfirmasi_langsung: false,
  });

  const adjustAmount = (delta: number) => {
    setData('jumlah_donasi', Math.min(need.remaining, Math.max(1, data.jumlah_donasi + delta)));
  };

  const canSubmit = data.jumlah_donasi > 0 && data.jumlah_donasi <= need.remaining && data.metode_pengiriman !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    post(route('donatur.donasi.store'));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.cream }}>
      {/* Top bar */}
      <div className="sticky top-0 z-10 backdrop-blur" style={{ backgroundColor: `${COLORS.cream}f2`, borderBottom: `1px solid ${COLORS.mist}` }}>
        <div className="max-w-2xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href={route('donatur.cari_panti')}
            className="inline-flex items-center gap-2 text-sm font-semibold"
            style={{ color: COLORS.navy }}
          >
            <ArrowLeft size={17} /> Kembali
          </Link>
          <span className="text-lg font-bold" style={{ color: COLORS.navy }}>
            KawanBerbagi<span style={{ color: COLORS.gold }}>.</span>
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 sm:px-6 py-8 sm:py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.navy }}>
            Donasi Sekarang
          </h1>
          <p className="text-sm" style={{ color: COLORS.navy, opacity: 0.6 }}>
            Kunci kuota barang untuk panti yang membutuhkan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Info campaign */}
          <div className="rounded-2xl p-5 sm:p-6" style={{ backgroundColor: '#ffffff', border: `1px solid ${COLORS.mist}` }}>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: COLORS.mist }}>
                <Package size={22} color={COLORS.teal} />
              </div>
              <div>
                <p className="text-base font-bold" style={{ color: COLORS.navy }}>{need.item}</p>
                <p className="text-xs mt-0.5" style={{ color: COLORS.navy, opacity: 0.55 }}>
                  {need.category} · {need.org}
                </p>
              </div>
            </div>
            <div className="flex justify-between text-xs mb-2 tabular-nums" style={{ color: COLORS.navy, opacity: 0.65 }}>
              <span>Terpenuhi</span>
              <span>{need.filled}/{need.total} {need.unit}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.mist }}>
              <div className="h-full rounded-full" style={{ width: `${(need.filled / need.total) * 100}%`, backgroundColor: COLORS.teal }} />
            </div>
            <p className="text-xs mt-2" style={{ color: COLORS.navy, opacity: 0.5 }}>
              Sisa kuota tersedia: <strong>{need.remaining} {need.unit}</strong>
            </p>
          </div>

          {/* Pilih jumlah */}
          <div className="rounded-2xl p-5 sm:p-6" style={{ backgroundColor: '#ffffff', border: `1px solid ${COLORS.mist}` }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: COLORS.navy }}>
              Berapa banyak yang ingin Anda donasikan?
            </h3>
            <div className="flex items-center justify-center gap-5">
              <button
                type="button"
                onClick={() => adjustAmount(-1)}
                disabled={data.jumlah_donasi <= 1}
                className="w-11 h-11 rounded-full flex items-center justify-center border transition disabled:opacity-30"
                style={{ borderColor: COLORS.mist, color: COLORS.navy }}
              >
                <Minus size={17} />
              </button>
              <div className="text-center min-w-[100px]">
                <p className="text-3xl font-bold tabular-nums" style={{ color: COLORS.navy }}>{data.jumlah_donasi}</p>
                <p className="text-xs" style={{ color: COLORS.navy, opacity: 0.5 }}>{need.unit}</p>
              </div>
              <button
                type="button"
                onClick={() => adjustAmount(1)}
                disabled={data.jumlah_donasi >= need.remaining}
                className="w-11 h-11 rounded-full flex items-center justify-center border transition disabled:opacity-30"
                style={{ borderColor: COLORS.mist, color: COLORS.navy }}
              >
                <Plus size={17} />
              </button>
            </div>
            {errors.jumlah_donasi && (
              <p className="text-xs text-red-500 mt-2 text-center">{errors.jumlah_donasi}</p>
            )}
            {data.jumlah_donasi >= need.remaining && (
              <p className="text-xs text-center mt-3" style={{ color: COLORS.gold }}>
                Anda akan memenuhi sisa kuota kebutuhan ini sepenuhnya. Terima kasih!
              </p>
            )}
          </div>

          {/* Catatan/Pesan tambahan */}
          <div className="rounded-2xl p-5 sm:p-6" style={{ backgroundColor: '#ffffff', border: `1px solid ${COLORS.mist}` }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: COLORS.navy }}>
              Catatan untuk Panti (Opsional)
            </h3>
            <textarea
              value={data.pesan}
              onChange={(e) => setData('pesan', e.target.value)}
              placeholder="Tulis pesan atau info tambahan mengenai barang donasi Anda..."
              className="w-full p-3.5 text-xs rounded-xl border border-gray-200 focus:border-[#407E8C] outline-none h-24 resize-none"
              style={{ color: COLORS.navy }}
            />
            {errors.pesan && (
              <p className="text-xs text-red-500 mt-1">{errors.pesan}</p>
            )}
          </div>

          {/* Metode pengiriman */}
          <div className="rounded-2xl p-5 sm:p-6" style={{ backgroundColor: '#ffffff', border: `1px solid ${COLORS.mist}` }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: COLORS.navy }}>
              Bagaimana barang akan sampai ke panti?
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => {
                  setData(prev => ({
                    ...prev,
                    metode_pengiriman: 'ekspedisi',
                    kurir: 'JNE',
                    resi: '',
                    konfirmasi_langsung: false
                  }));
                }}
                className="text-left p-4 rounded-xl border-2 transition flex flex-col justify-between h-full"
                style={{
                  borderColor: data.metode_pengiriman === 'ekspedisi' ? COLORS.teal : COLORS.mist,
                  backgroundColor: data.metode_pengiriman === 'ekspedisi' ? 'rgba(64,126,140,0.06)' : '#ffffff',
                }}
              >
                <div>
                  <Truck size={20} color={data.metode_pengiriman === 'ekspedisi' ? COLORS.teal : COLORS.navy} className="mb-2" />
                  <p className="text-xs font-bold" style={{ color: COLORS.navy }}>Kirim via Ekspedisi</p>
                  <p className="text-[10px] mt-1 leading-normal" style={{ color: COLORS.navy, opacity: 0.55 }}>
                    Via kurir logistik (JNE, J&T, SiCepat, dll.)
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setData(prev => ({
                    ...prev,
                    metode_pengiriman: 'mandiri',
                    kurir: 'Antar Mandiri',
                    resi: '',
                    konfirmasi_langsung: false
                  }));
                }}
                className="text-left p-4 rounded-xl border-2 transition flex flex-col justify-between h-full"
                style={{
                  borderColor: data.metode_pengiriman === 'mandiri' ? COLORS.teal : COLORS.mist,
                  backgroundColor: data.metode_pengiriman === 'mandiri' ? 'rgba(64,126,140,0.06)' : '#ffffff',
                }}
              >
                <div>
                  <Home size={20} color={data.metode_pengiriman === 'mandiri' ? COLORS.teal : COLORS.navy} className="mb-2" />
                  <p className="text-xs font-bold" style={{ color: COLORS.navy }}>Antar Mandiri</p>
                  <p className="text-[10px] mt-1 leading-normal" style={{ color: COLORS.navy, opacity: 0.55 }}>
                    Anda mengantar barang langsung ke alamat panti
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setData(prev => ({
                    ...prev,
                    metode_pengiriman: 'jemput',
                    kurir: 'Jemput oleh Panti',
                    resi: '',
                    konfirmasi_langsung: false
                  }));
                }}
                className="text-left p-4 rounded-xl border-2 transition flex flex-col justify-between h-full"
                style={{
                  borderColor: data.metode_pengiriman === 'jemput' ? COLORS.teal : COLORS.mist,
                  backgroundColor: data.metode_pengiriman === 'jemput' ? 'rgba(64,126,140,0.06)' : '#ffffff',
                }}
              >
                <div>
                  <Package size={20} color={data.metode_pengiriman === 'jemput' ? COLORS.teal : COLORS.navy} className="mb-2" />
                  <p className="text-xs font-bold" style={{ color: COLORS.navy }}>Jemput oleh Panti</p>
                  <p className="text-[10px] mt-1 leading-normal" style={{ color: COLORS.navy, opacity: 0.55 }}>
                    Pihak panti yang datang menjemput barang
                  </p>
                </div>
              </button>
            </div>

            {/* Form Pengiriman Detil */}
            {data.metode_pengiriman === 'ekspedisi' && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: COLORS.mist }}>
                <div className="flex flex-col sm:flex-row gap-3 mb-3">
                  <select
                    value={data.kurir}
                    onChange={(e) => setData('kurir', e.target.value)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold outline-none border focus:border-[#407E8C]"
                    style={{ backgroundColor: '#ffffff', borderColor: COLORS.mist, color: COLORS.navy }}
                  >
                    <option>JNE</option>
                    <option>SiCepat</option>
                    <option>J&T</option>
                    <option>AnterAja</option>
                    <option>Pos Indonesia</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Nomor resi (bisa dikosongkan dahulu)"
                    value={data.resi}
                    onChange={(e) => setData('resi', e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold outline-none border focus:border-[#407E8C]"
                    style={{ backgroundColor: '#ffffff', borderColor: COLORS.mist, color: COLORS.navy }}
                  />
                </div>
                
                <label className="flex items-center gap-2 cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    checked={data.konfirmasi_langsung}
                    onChange={(e) => setData('konfirmasi_langsung', e.target.checked)}
                    className="rounded border-gray-300 text-[#407E8C] focus:ring-[#407E8C]"
                  />
                  <span className="text-[11px] font-bold" style={{ color: COLORS.navy, opacity: 0.8 }}>
                    Konfirmasi barang sudah diserahkan ke ekspedisi sekarang
                  </span>
                </label>
                
                <p className="text-[10px] mt-3 flex items-center gap-1.5 leading-relaxed" style={{ color: COLORS.navy, opacity: 0.5 }}>
                  <Clock size={12} className="shrink-0" /> Belum punya resinya? Jangan khawatir — Anda memiliki waktu 24 jam untuk melengkapinya dari menu riwayat donasi atau kuota akan dilepas otomatis.
                </p>
              </div>
            )}

            {data.metode_pengiriman === 'mandiri' && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: COLORS.mist }}>
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={data.konfirmasi_langsung}
                    onChange={(e) => setData('konfirmasi_langsung', e.target.checked)}
                    className="rounded border-gray-300 text-[#407E8C] focus:ring-[#407E8C]"
                  />
                  <span className="text-[11px] font-bold" style={{ color: COLORS.navy, opacity: 0.8 }}>
                    Konfirmasi barang sudah mulai saya antar ke lokasi panti sekarang
                  </span>
                </label>
                <p className="text-[10px] mt-2 flex items-center gap-1.5 leading-relaxed" style={{ color: COLORS.navy, opacity: 0.5 }}>
                  <Clock size={12} className="shrink-0" /> Jika Anda belum berangkat sekarang, jangan lupa lakukan konfirmasi jalan dalam waktu 24 jam atau kuota akan otomatis dilepas.
                </p>
              </div>
            )}

            {data.metode_pengiriman === 'jemput' && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: COLORS.mist }}>
                <div className="rounded-xl p-4 bg-amber-50 border border-amber-100 flex items-start gap-2.5">
                  <Clock size={15} className="text-[#A58D66] shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-normal text-amber-800 font-medium">
                    Metode penjemputan memerlukan konfirmasi dari pihak panti asuhan. Pihak panti memiliki waktu 24 jam untuk mengonfirmasi kesediaan menjemput barang ini sebelum booking otomatis batal.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Alamat tujuan */}
          <div className="rounded-2xl p-5 sm:p-6" style={{ backgroundColor: COLORS.mist }}>
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={15} color={COLORS.navy} />
              <span className="text-xs font-bold uppercase tracking-wide" style={{ color: COLORS.navy, opacity: 0.6 }}>
                Alamat Tujuan Panti
              </span>
            </div>
            <p className="text-sm font-semibold mb-1" style={{ color: COLORS.navy }}>{need.org}</p>
            <p className="text-sm leading-relaxed mb-3" style={{ color: COLORS.navy, opacity: 0.75 }}>
              {need.address}
            </p>
            <p className="text-xs flex items-center gap-1.5" style={{ color: COLORS.navy, opacity: 0.6 }}>
              <Phone size={12} /> {need.phone}
            </p>
          </div>

          {/* Ringkasan + submit */}
          <div className="rounded-2xl p-5 sm:p-6" style={{ backgroundColor: COLORS.navy }}>
            <div className="flex justify-between items-center mb-4 text-sm" style={{ color: COLORS.cream }}>
              <span style={{ opacity: 0.7 }}>Anda akan mendonasikan</span>
              <span className="font-bold">{data.jumlah_donasi} {need.unit} {need.item}</span>
            </div>
            <button
              type="submit"
              disabled={!canSubmit || processing}
              className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold py-3.5 rounded-full transition disabled:opacity-40"
              style={{ backgroundColor: canSubmit ? COLORS.gold : 'rgba(229,225,221,0.3)', color: canSubmit ? '#ffffff' : COLORS.cream }}
            >
              <ShieldCheck size={16} /> {processing ? 'Memproses...' : 'Kunci Donasi Ini'}
            </button>
            {!data.metode_pengiriman && (
              <p className="text-[11px] text-center mt-2.5" style={{ color: COLORS.cream, opacity: 0.5 }}>
                Pilih metode pengiriman terlebih dahulu
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}