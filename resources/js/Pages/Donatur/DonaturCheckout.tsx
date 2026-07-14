import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
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
  navy: "#083A4F",
  gold: "#A58D66",
  mist: "#C0D5D6",
  teal: "#407E8C",
  cream: "#E5E1DD",
};

// ====== Data dummy — ganti dengan data campaign asli dari backend (berdasarkan param URL) ======
const CAMPAIGN = {
  org: "Yayasan Kasih Ibu",
  address: "Jl. Melati No. 12, Kec. Buah Batu, Bandung Selatan, Jawa Barat 40286",
  phone: "022-1234567",
  item: "Beras 50kg",
  category: "Pangan",
  unit: "kg",
  filled: 36,
  total: 50,
};

type ShippingMethod = 'ekspedisi' | 'mandiri' | null;

export default function CheckoutDonasi() {
  const remaining = CAMPAIGN.total - CAMPAIGN.filled;

  const [amount, setAmount] = useState(Math.min(5, remaining));
  const [method, setMethod] = useState<ShippingMethod>(null);
  const [courier, setCourier] = useState('JNE');
  const [resi, setResi] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const adjustAmount = (delta: number) => {
    setAmount((prev) => Math.min(remaining, Math.max(1, prev + delta)));
  };

  const canSubmit = amount > 0 && amount <= remaining && method !== null;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: COLORS.cream }}>
        <div className="w-full max-w-md text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: COLORS.mist }}
          >
            <CheckCircle2 size={30} color={COLORS.teal} />
          </div>
          <h1 className="text-2xl font-bold mb-3" style={{ color: COLORS.navy }}>
            Donasi Terkunci!
          </h1>
          <p className="text-sm leading-relaxed mb-8" style={{ color: COLORS.navy, opacity: 0.7 }}>
            Kuota <strong>{amount} {CAMPAIGN.unit} {CAMPAIGN.item}</strong> untuk{' '}
            <strong>{CAMPAIGN.org}</strong> sudah dikunci atas nama Anda.
          </p>

          <div className="rounded-2xl p-5 text-left mb-8" style={{ backgroundColor: '#ffffff', border: `1px solid ${COLORS.mist}` }}>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={14} color={COLORS.gold} />
              <span className="text-xs font-bold uppercase tracking-wide" style={{ color: COLORS.gold }}>
                Jangan Lupa
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: COLORS.navy, opacity: 0.75 }}>
              {method === 'ekspedisi' && resi
                ? 'Nomor resi Anda sudah tersimpan. Anda bisa memantau statusnya dari halaman Donasi Saya.'
                : 'Input nomor resi (atau konfirmasi antar mandiri) dalam 24–48 jam, atau kuota ini akan otomatis dilepas kembali.'}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/donasi"
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold py-3.5 rounded-full text-white hover:brightness-110 transition"
              style={{ backgroundColor: COLORS.teal }}
            >
              Lihat Donasi Saya
            </Link>
            <Link
              href="/cari-panti"
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold py-3.5 rounded-full border transition hover:opacity-80"
              style={{ borderColor: COLORS.mist, color: COLORS.navy }}
            >
              Cari Kebutuhan Lain
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.cream }}>
      {/* Top bar */}
      <div className="sticky top-0 z-10 backdrop-blur" style={{ backgroundColor: `${COLORS.cream}f2`, borderBottom: `1px solid ${COLORS.mist}` }}>
        <div className="max-w-2xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/cari-panti"
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

        {/* Info campaign */}
        <div className="rounded-2xl p-5 sm:p-6" style={{ backgroundColor: '#ffffff', border: `1px solid ${COLORS.mist}` }}>
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: COLORS.mist }}>
              <Package size={22} color={COLORS.teal} />
            </div>
            <div>
              <p className="text-base font-bold" style={{ color: COLORS.navy }}>{CAMPAIGN.item}</p>
              <p className="text-xs mt-0.5" style={{ color: COLORS.navy, opacity: 0.55 }}>
                {CAMPAIGN.category} · {CAMPAIGN.org}
              </p>
            </div>
          </div>
          <div className="flex justify-between text-xs mb-2 tabular-nums" style={{ color: COLORS.navy, opacity: 0.65 }}>
            <span>Terpenuhi</span>
            <span>{CAMPAIGN.filled}/{CAMPAIGN.total} {CAMPAIGN.unit}</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.mist }}>
            <div className="h-full rounded-full" style={{ width: `${(CAMPAIGN.filled / CAMPAIGN.total) * 100}%`, backgroundColor: COLORS.teal }} />
          </div>
          <p className="text-xs mt-2" style={{ color: COLORS.navy, opacity: 0.5 }}>
            Sisa kuota: <strong>{remaining} {CAMPAIGN.unit}</strong>
          </p>
        </div>

        {/* Pilih jumlah */}
        <div className="rounded-2xl p-5 sm:p-6" style={{ backgroundColor: '#ffffff', border: `1px solid ${COLORS.mist}` }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: COLORS.navy }}>
            Berapa banyak yang ingin Anda donasikan?
          </h3>
          <div className="flex items-center justify-center gap-5">
            <button
              onClick={() => adjustAmount(-1)}
              disabled={amount <= 1}
              className="w-11 h-11 rounded-full flex items-center justify-center border transition disabled:opacity-30"
              style={{ borderColor: COLORS.mist, color: COLORS.navy }}
            >
              <Minus size={17} />
            </button>
            <div className="text-center min-w-[100px]">
              <p className="text-3xl font-bold tabular-nums" style={{ color: COLORS.navy }}>{amount}</p>
              <p className="text-xs" style={{ color: COLORS.navy, opacity: 0.5 }}>{CAMPAIGN.unit}</p>
            </div>
            <button
              onClick={() => adjustAmount(1)}
              disabled={amount >= remaining}
              className="w-11 h-11 rounded-full flex items-center justify-center border transition disabled:opacity-30"
              style={{ borderColor: COLORS.mist, color: COLORS.navy }}
            >
              <Plus size={17} />
            </button>
          </div>
          {amount >= remaining && (
            <p className="text-xs text-center mt-3" style={{ color: COLORS.gold }}>
              Anda akan memenuhi sisa kuota kebutuhan ini sepenuhnya. Terima kasih!
            </p>
          )}
        </div>

        {/* Metode pengiriman */}
        <div className="rounded-2xl p-5 sm:p-6" style={{ backgroundColor: '#ffffff', border: `1px solid ${COLORS.mist}` }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: COLORS.navy }}>
            Bagaimana barang akan sampai ke panti?
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <button
              onClick={() => setMethod('ekspedisi')}
              className="text-left p-4 rounded-xl border-2 transition"
              style={{
                borderColor: method === 'ekspedisi' ? COLORS.teal : COLORS.mist,
                backgroundColor: method === 'ekspedisi' ? 'rgba(64,126,140,0.06)' : '#ffffff',
              }}
            >
              <Truck size={20} color={method === 'ekspedisi' ? COLORS.teal : COLORS.navy} className="mb-2" />
              <p className="text-sm font-semibold" style={{ color: COLORS.navy }}>Kirim via Ekspedisi</p>
              <p className="text-xs mt-1" style={{ color: COLORS.navy, opacity: 0.55 }}>
                JNE, SiCepat, J&T, dan lainnya
              </p>
            </button>
            <button
              onClick={() => setMethod('mandiri')}
              className="text-left p-4 rounded-xl border-2 transition"
              style={{
                borderColor: method === 'mandiri' ? COLORS.teal : COLORS.mist,
                backgroundColor: method === 'mandiri' ? 'rgba(64,126,140,0.06)' : '#ffffff',
              }}
            >
              <Home size={20} color={method === 'mandiri' ? COLORS.teal : COLORS.navy} className="mb-2" />
              <p className="text-sm font-semibold" style={{ color: COLORS.navy }}>Antar Mandiri</p>
              <p className="text-xs mt-1" style={{ color: COLORS.navy, opacity: 0.55 }}>
                Anda mengantar langsung ke lokasi panti
              </p>
            </button>
          </div>

          {method === 'ekspedisi' && (
            <div className="mt-4 pt-4 flex flex-col sm:flex-row gap-3" style={{ borderTop: `1px solid ${COLORS.mist}` }}>
              <select
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
                className="px-4 py-2.5 rounded-xl text-sm outline-none border focus:border-[#407E8C]"
                style={{ backgroundColor: '#ffffff', borderColor: COLORS.mist, color: COLORS.navy }}
              >
                <option>JNE</option>
                <option>SiCepat</option>
                <option>J&T</option>
                <option>Anter Aja</option>
              </select>
              <input
                type="text"
                placeholder="Nomor resi (bisa diisi nanti)"
                value={resi}
                onChange={(e) => setResi(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none border focus:border-[#407E8C]"
                style={{ backgroundColor: '#ffffff', borderColor: COLORS.mist, color: COLORS.navy }}
              />
            </div>
          )}
          <p className="text-[11px] mt-3 flex items-center gap-1.5" style={{ color: COLORS.navy, opacity: 0.5 }}>
            <Clock size={12} /> Belum tahu resinya? Tidak apa — Anda punya waktu 24–48 jam untuk melengkapinya.
          </p>
        </div>

        {/* Alamat tujuan */}
        <div className="rounded-2xl p-5 sm:p-6" style={{ backgroundColor: COLORS.mist }}>
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={15} color={COLORS.navy} />
            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: COLORS.navy, opacity: 0.6 }}>
              Alamat Tujuan
            </span>
          </div>
          <p className="text-sm font-semibold mb-1" style={{ color: COLORS.navy }}>{CAMPAIGN.org}</p>
          <p className="text-sm leading-relaxed mb-3" style={{ color: COLORS.navy, opacity: 0.75 }}>
            {CAMPAIGN.address}
          </p>
          <p className="text-xs flex items-center gap-1.5" style={{ color: COLORS.navy, opacity: 0.6 }}>
            <Phone size={12} /> {CAMPAIGN.phone}
          </p>
        </div>

        {/* Ringkasan + submit */}
        <div className="rounded-2xl p-5 sm:p-6" style={{ backgroundColor: COLORS.navy }}>
          <div className="flex justify-between items-center mb-4 text-sm" style={{ color: COLORS.cream }}>
            <span style={{ opacity: 0.7 }}>Anda akan mendonasikan</span>
            <span className="font-bold">{amount} {CAMPAIGN.unit} {CAMPAIGN.item}</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold py-3.5 rounded-full transition disabled:opacity-40"
            style={{ backgroundColor: canSubmit ? COLORS.gold : 'rgba(229,225,221,0.3)', color: canSubmit ? '#ffffff' : COLORS.cream }}
          >
            <ShieldCheck size={16} /> Kunci Donasi Ini
          </button>
          {!method && (
            <p className="text-[11px] text-center mt-2.5" style={{ color: COLORS.cream, opacity: 0.5 }}>
              Pilih metode pengiriman terlebih dahulu
            </p>
          )}
        </div>
      </div>
    </div>
  );
}