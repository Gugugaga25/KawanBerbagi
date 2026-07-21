import React, { useState, useMemo } from 'react';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Check,
  ChevronRight,
  MapPin,
  Calendar,
  Search,
  X,
  Wallet
} from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import EmptyState from '@/Components/UI/EmptyState';

const COLORS = {
  navy: "#293681",
  gold: "#F59E0B",
  mist: "#D0E7E6",
  teal: "#4274D9",
  cream: "#F8FAFC",
};

function CountdownTimer({ createdAt }: { createdAt: string }) {
  const [timeLeft, setTimeLeft] = React.useState('');

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const created = new Date(createdAt).getTime();
      const limit = created + 24 * 60 * 60 * 1000;
      const difference = limit - Date.now();

      if (difference <= 0) {
        return 'Waktu Habis';
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return `${hours}j ${minutes}m ${seconds}d lagi`;
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt]);

  return (
    <span className="font-bold text-red-500 text-xs px-2 py-0.5 rounded bg-red-50 border border-red-100 flex items-center gap-1 self-start sm:self-auto shrink-0">
      {timeLeft}
    </span>
  );
}

// 3 tahap: Diproses -> Dikirim -> Diterima
type Stage = 0 | 1 | 2;
const STEPS: { label: string; icon: any }[] = [
  { label: "Diproses", icon: Clock },
  { label: "Dikirim", icon: Truck },
  { label: "Diterima", icon: CheckCircle2 },
];

interface Donation {
  id: number;
  item: string;
  org: string;
  date: string;
  stage: Stage;
  method?: string;
}

const DONATIONS: Donation[] = [
  { id: 1, item: "Beras Premium 15kg", org: "Yayasan Kasih Ibu", date: "8 Jul 2026", stage: 2, method: "JNE • JX9284710" },
  { id: 2, item: "Susu Bayi (12 kaleng)", org: "Panti Asuhan Nurul Iman", date: "6 Jul 2026", stage: 1, method: "SiCepat • SC1123890" },
  { id: 3, item: "Buku Pelajaran (10 eks)", org: "Rumah Yatim Cahaya", date: "9 Jul 2026", stage: 0 },
  { id: 4, item: "Pakaian Anak (5 pcs)", org: "Panti Wreda Bahagia", date: "28 Jun 2026", stage: 2, method: "Antar Mandiri" },
  { id: 5, item: "Alat Tulis (2 paket)", org: "Yayasan Tunas Bangsa", date: "20 Jun 2026", stage: 2, method: "JNE • JX8817234" },
];

const FILTERS = [
  { id: 'semua', label: 'Semua Donasi' },
  { id: 'resi', label: 'Perlu Tindakan' },
  { id: 'jalan', label: 'Dalam Perjalanan' },
  { id: 'diterima', label: 'Selesai' },
] as const;

type FilterId = typeof FILTERS[number]['id'];

const STAGE_BADGE: Record<Stage, { bg: string; text: string }> = {
  0: { bg: 'rgba(165,141,102,0.15)', text: COLORS.gold },
  1: { bg: 'rgba(64,126,140,0.12)', text: COLORS.teal },
  2: { bg: 'rgba(8,58,79,0.08)', text: COLORS.navy },
};

/* ---------- Stepper ---------- */
function Stepper({ stage }: { stage: Stage }) {
  return (
    <div className="flex items-start w-full max-w-[400px] mx-auto">
      {STEPS.map((s, i) => {
        const done = i < stage;
        const current = i === stage;
        const active = done || current;
        const isLast = i === STEPS.length - 1;
        return (
          <React.Fragment key={s.label}>
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all"
                style={{
                  backgroundColor: active ? COLORS.teal : '#ffffff',
                  borderColor: active ? COLORS.teal : COLORS.mist,
                }}
              >
                {done ? (
                  <Check size={15} color="#ffffff" strokeWidth={3} />
                ) : (
                  <s.icon size={14} color={current ? '#ffffff' : COLORS.mist} />
                )}
              </div>
              <span
                className="text-[11px] font-semibold whitespace-nowrap"
                style={{ color: COLORS.navy, opacity: active ? 1 : 0.4 }}
              >
                {s.label}
              </span>
            </div>
            {!isLast && (
              <div
                className="flex-1 h-[2px] mt-4 mx-1"
                style={{ backgroundColor: i < stage ? COLORS.teal : COLORS.mist }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function DonasiSaya({ myDonations = [] }: { myDonations?: any[] }) {
  const [filter, setFilter] = useState<FilterId>('semua');
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [resiInput, setResiInput] = useState({ courier: 'Antar Mandiri', number: '' }); // Set default sesuai kebutuhan

  const donationsList = useMemo(() => {
    return myDonations.map((d: any) => {
      let stage: Stage = 0;
      if (d.status === 'Dikirim' || d.status === 'Akan Dijemput') stage = 1;
      else if (d.status === 'Diterima' || d.status === 'Sukses') stage = 2;

      let method = '';
      if (d.kurir && d.kurir !== '-') {
        method = d.kurir;
        if (d.resi && d.resi !== '-') {
          method += ` • ${d.resi}`;
        }
      }

      const item = d.type === 'Dana' 
        ? `Donasi Tunai ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(d.jumlah)}` 
        : `${d.barang} (${d.jumlah} ${d.satuan})`;

      return {
        id: d.id_raw,
        trx_id: d.id,
        item: item,
        org: d.panti,
        date: d.tanggal,
        created_at: d.created_at,
        status: d.status,
        kurir: d.kurir,
        resi: d.resi,
        stage: stage,
        method: method || undefined,
        type: d.type
      };
    });
  }, [myDonations]);

  const filtered = useMemo(() => {
    return donationsList.filter((d) => {
      const matchFilter =
        filter === 'semua' ? true :
        filter === 'resi' ? d.stage === 0 :
        filter === 'jalan' ? d.stage === 1 :
        d.stage === 2;

      const matchQuery =
        query.trim() === '' ||
        d.item.toLowerCase().includes(query.toLowerCase()) ||
        d.org.toLowerCase().includes(query.toLowerCase());

      return matchFilter && matchQuery;
    });
  }, [donationsList, filter, query]);

  const handleSubmitResi = (id: number) => {
    router.patch(route('donatur.donasi.updateResi', id), {
      kurir: resiInput.courier,
      resi: resiInput.courier === 'Antar Mandiri' ? '' : resiInput.number
    }, {
      onSuccess: () => {
        setEditingId(null);
        setResiInput({ courier: 'Antar Mandiri', number: '' });
      }
    });
  };

  return (
    <div className="space-y-5 font-sans w-full max-w-5xl mx-auto">

      {/* ================= SEARCH + FILTER ================= */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: COLORS.navy, opacity: 0.4 }} />
          <input
            type="text"
            placeholder="Cari nama barang atau panti..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none border focus:border-[#407E8C] transition-colors"
            style={{ backgroundColor: '#ffffff', borderColor: COLORS.mist, color: COLORS.navy }}
          />
        </div>

        <div className="flex overflow-x-auto pb-1 sm:pb-0">
          <div className="inline-flex p-1 rounded-2xl border gap-1 shrink-0" style={{ borderColor: COLORS.mist, backgroundColor: "#fff" }}>
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="text-xs font-bold px-4 py-2.5 rounded-xl transition-all whitespace-nowrap"
                style={{
                  backgroundColor: filter === f.id ? COLORS.navy : 'transparent',
                  color: filter === f.id ? '#ffffff' : COLORS.navy,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm px-1" style={{ color: COLORS.navy, opacity: 0.5 }}>
        Menampilkan {filtered.length} dari {donationsList.length} donasi
      </p>

      {/* ================= LIST DONASI ================= */}
      {filtered.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filtered.map((d) => {
            const badge = STAGE_BADGE[d.stage];
            return (
              <div key={d.id} className={`bg-white rounded-[1.5rem] border overflow-hidden transition-shadow hover:shadow-sm ${(d.stage === 2 || d.status === 'Batal') ? 'opacity-50' : ''}`} style={{ borderColor: COLORS.mist }}>

                <div className="p-5 md:p-6 flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8">
                  <div className="flex items-start gap-4 lg:w-[280px] shrink-0">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: COLORS.mist }}
                    >
                      {d.type === 'Dana' ? <Wallet size={20} color={COLORS.teal} /> : <Package size={20} color={COLORS.teal} />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold mb-1 truncate" style={{ color: COLORS.navy }}>{d.item}</h4>
                      <div className="flex flex-col gap-1 text-xs" style={{ color: COLORS.navy, opacity: 0.6 }}>
                        <span className="flex items-center gap-1.5 truncate">
                          <MapPin size={12} className="shrink-0" style={{ color: COLORS.teal }} /> {d.org}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} className="shrink-0" /> {d.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stepper (Tengah di mobile) */}
                  <div className="flex-1 w-full flex justify-center py-2 lg:py-0">
                    {d.status === 'Batal' ? (
                      <span className="text-red-500 font-extrabold uppercase tracking-wider text-[10px] bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 shadow-xs">
                        Donasi Batal (Expired)
                      </span>
                    ) : d.type === 'Dana' ? (
                      <div className="flex items-center gap-2">
                        <span className={`px-4 py-2 rounded-full text-xs font-bold border ${
                          d.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        }`}>
                          {d.status === 'Pending' ? 'Menunggu Pembayaran' : 'Pembayaran Sukses'}
                        </span>
                      </div>
                    ) : (
                      <Stepper stage={d.stage} />
                    )}
                  </div>

                  {/* Resi & Detail - Disetel justify-between di mobile */}
                  <div className="shrink-0 flex items-center justify-between w-full lg:w-auto lg:justify-end gap-5 lg:mt-0">
                    <div className="flex items-center">
                      {d.method && (
                        <span className="text-[13px] font-semibold" style={{ color: COLORS.navy, opacity: 0.45 }}>
                          {d.method}
                        </span>
                      )}
                    </div>
                    {d.type === 'Dana' ? (
                      d.status === 'Pending' ? (
                        <Link
                          href={`/donatur/donasi-uang/bayar/${d.id}`}
                          className="flex items-center justify-center text-white gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold border transition-all shrink-0 bg-[#A58D66]"
                        >
                          Bayar
                        </Link>
                      ) : (
                        <span className="text-[13px] font-bold text-emerald-600">
                          Selesai
                        </span>
                      )
                    ) : (
                      <Link
                        href={`/donasi/${d.id}`}
                        className="flex items-center justify-center text-white gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold border transition-colors hover:bg-black/[0.02] group shrink-0"
                        style={{ backgroundColor: COLORS.navy }}
                      >
                        Detail
                      </Link>
                    )}
                  </div>
                </div>

                {/* Status-specific footer blocks */}
                {d.status === 'Diproses' && (
                  <div className="px-5 py-4 md:px-6 md:py-5" style={{ backgroundColor: 'rgba(165,141,102,0.08)', borderTop: `1px solid ${COLORS.mist}` }}>
                    {editingId === d.id ? (
                      <div className="flex flex-col md:flex-row gap-3 w-full">
                        <select
                          value={resiInput.courier}
                          onChange={(e) => setResiInput({ ...resiInput, courier: e.target.value })}
                          className="px-4 py-3 rounded-xl text-xs font-bold outline-none border focus:border-[#407E8C] bg-white w-full md:w-auto min-w-[160px]"
                          style={{ borderColor: COLORS.mist, color: COLORS.navy }}
                        >
                          <optgroup label="Kurir Instan & Mandiri">
                            <option value="Antar Mandiri">Antar Mandiri</option>
                            <option value="GoSend (Instant)">GoSend (Instant)</option>
                            <option value="GrabExpress (Instant)">GrabExpress (Instant)</option>
                            <option value="Maxim Delivery">Maxim Delivery</option>
                            <option value="Lalamove">Lalamove</option>
                          </optgroup>
                          <optgroup label="Ekspedisi Reguler">
                            <option value="JNE">JNE</option>
                            <option value="J&T Express">J&T Express</option>
                            <option value="SiCepat">SiCepat</option>
                            <option value="AnterAja">AnterAja</option>
                            <option value="Pos Indonesia">Pos Indonesia</option>
                            <option value="Ninja Xpress">Ninja Xpress</option>
                            <option value="Paxel">Paxel</option>
                            <option value="Wahana">Wahana</option>
                          </optgroup>
                        </select>
                        
                        {resiInput.courier !== 'Antar Mandiri' ? (
                          <input
                            type="text"
                            placeholder="Masukkan nomor resi, url lacak, atau nama driver..."
                            value={resiInput.number}
                            onChange={(e) => setResiInput({ ...resiInput, number: e.target.value })}
                            className="flex-1 px-4 py-3 rounded-xl text-xs font-bold outline-none border focus:border-[#407E8C] bg-white w-full"
                            style={{ borderColor: COLORS.mist, color: COLORS.navy }}
                          />
                        ) : (
                          // Spacer kosong agar saat mode desktop, tombol tetap terdorong ke kanan
                          <div className="hidden md:block flex-1"></div>
                        )}
                        
                        <button
                          onClick={() => handleSubmitResi(d.id)}
                          className="text-xs font-bold px-6 py-3 rounded-xl text-white hover:brightness-110 transition shrink-0 md:ml-auto w-full md:w-auto"
                          style={{ backgroundColor: COLORS.navy }}
                        >
                          Simpan
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="text-[13px] font-semibold flex flex-col sm:flex-row sm:items-center gap-1.5" style={{ color: COLORS.navy, opacity: 0.7 }}>
                          <span className="flex items-center gap-1.5">
                            <Clock size={13} style={{ color: COLORS.gold }} />
                            {d.kurir === 'Antar Mandiri'
                              ? 'Konfirmasi keberangkatan Anda sebelum kuota otomatis dilepas:'
                              : 'Input resi atau pilih kurir mandiri sebelum kuota otomatis dilepas:'}
                          </span>
                          {d.created_at && <CountdownTimer createdAt={d.created_at} />}
                        </div>
                        <button
                          onClick={() => setEditingId(d.id)}
                          className="w-full md:w-auto flex items-center justify-center gap-2 text-xs font-bold px-6 py-2.5 rounded-xl text-white hover:brightness-110 transition shrink-0"
                          style={{ backgroundColor: COLORS.teal }}
                        >
                          <Truck size={14} /> {d.kurir === 'Antar Mandiri' ? 'Konfirmasi Kirim' : 'Input Data Pengiriman'}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {d.status === 'Menunggu Konfirmasi Jemput' && (
                  <div className="px-5 py-4 md:px-6 md:py-5" style={{ backgroundColor: 'rgba(165,141,102,0.08)', borderTop: `1px solid ${COLORS.mist}` }}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="text-[13px] font-semibold flex flex-col sm:flex-row sm:items-center gap-1.5" style={{ color: COLORS.navy, opacity: 0.7 }}>
                        <span className="flex items-center gap-1.5">
                          <Clock size={13} style={{ color: COLORS.gold }} />
                          Menunggu pihak panti mengonfirmasi penjemputan barang:
                        </span>
                        {d.created_at && <CountdownTimer createdAt={d.created_at} />}
                      </div>
                    </div>
                  </div>
                )}

                {d.status === 'Akan Dijemput' && (
                  <div className="px-5 py-4 md:px-6 md:py-5" style={{ backgroundColor: 'rgba(64,126,140,0.08)', borderTop: `1px solid ${COLORS.mist}` }}>
                    <p className="text-[13px] font-semibold flex items-center gap-1.5 text-emerald-700">
                      <Truck size={13} />
                      Pihak panti telah mengonfirmasi penjemputan. Silakan tunggu panti mengambil barang di lokasi Anda.
                    </p>
                  </div>
                )}

                {d.status === 'Batal' && (
                  <div className="px-5 py-4 md:px-6 md:py-5" style={{ backgroundColor: 'rgba(239,68,68,0.08)', borderTop: `1px solid ${COLORS.mist}` }}>
                    <p className="text-[13px] font-semibold flex items-center gap-1.5 text-red-600">
                      <X size={13} />
                      Donasi dibatalkan otomatis karena batas waktu 24 jam telah terlampaui.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Rich Empty state */
        <EmptyState
          mode={query ? 'search' : 'accomplishment'}
          icon={Package}
          title={query ? 'Donasi Tidak Ditemukan' : 'Belum Ada Riwayat Donasi'}
          description={query ? `Tidak ada donasi yang cocok dengan pencarian "${query}".` : 'Anda belum memiliki riwayat donasi pada kategori ini. Mari mulai kebaikan pertama Anda!'}
          searchQuery={query}
          onResetSearch={() => { setQuery(''); setFilter('semua'); }}
          onAction={!query ? () => router.visit(window.location.pathname + '?tab=cari') : undefined}
          actionLabel="Cari Panti & Salurkan Donasi"
        />
      )}
    </div>
  );
}