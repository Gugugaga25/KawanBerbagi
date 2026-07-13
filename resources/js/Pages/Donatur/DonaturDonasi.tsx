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
} from 'lucide-react';
import { Link, router } from '@inertiajs/react';

const COLORS = {
  navy: "#083A4F",
  gold: "#A58D66",
  mist: "#C0D5D6",
  teal: "#407E8C",
  cream: "#E5E1DD",
};

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
  const [resiInput, setResiInput] = useState({ courier: 'JNE', number: '' });

  const donationsList = useMemo(() => {
    return myDonations.map((d: any) => {
      let stage: Stage = 0;
      if (d.status === 'Dikirim') stage = 1;
      else if (d.status === 'Diterima') stage = 2;

      let method = '';
      if (d.kurir && d.kurir !== '-') {
        method = d.kurir;
        if (d.resi && d.resi !== '-') {
          method += ` • ${d.resi}`;
        }
      }

      return {
        id: d.id_raw,
        trx_id: d.id,
        item: `${d.barang} (${d.jumlah} ${d.satuan})`,
        org: d.panti,
        date: d.tanggal,
        stage: stage,
        method: method || undefined
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
        setResiInput({ courier: 'JNE', number: '' });
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
              <div key={d.id} className="bg-white rounded-[1.5rem] border overflow-hidden transition-shadow hover:shadow-sm" style={{ borderColor: COLORS.mist }}>

                <div className="p-5 md:p-6 flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8">

                  {/* Info barang & panti */}
                  <div className="flex items-start gap-4 lg:w-[280px] shrink-0">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: COLORS.mist }}
                    >
                      <Package size={20} color={COLORS.teal} />
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
                    <Stepper stage={d.stage} />
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
                    <Link
                        href={`/donasi/${d.id}`}
                        className="flex items-center justify-center text-white gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold border transition-colors hover:bg-black/[0.02] group shrink-0"
                        style={{ backgroundColor: COLORS.navy }}
                        >
                        Detail
                    </Link>
                  </div>
                </div>

                {/* Input resi — hanya stage 0 */}
                {d.stage === 0 && (
                  <div className="px-5 py-4 md:px-6 md:py-5" style={{ backgroundColor: 'rgba(165,141,102,0.08)', borderTop: `1px solid ${COLORS.mist}` }}>
                    {editingId === d.id ? (
                      <div className="flex flex-col md:flex-row gap-3">
                        <select
                          value={resiInput.courier}
                          onChange={(e) => setResiInput({ ...resiInput, courier: e.target.value })}
                          className="px-4 py-3 rounded-xl text-xs font-bold outline-none border focus:border-[#407E8C] bg-white"
                          style={{ borderColor: COLORS.mist, color: COLORS.navy }}
                        >
                          <option>JNE</option>
                          <option>SiCepat</option>
                          <option>J&T</option>
                          <option>Antar Mandiri</option>
                        </select>
                        {resiInput.courier !== 'Antar Mandiri' && (
                          <input
                            type="text"
                            placeholder="Masukkan nomor resi..."
                            value={resiInput.number}
                            onChange={(e) => setResiInput({ ...resiInput, number: e.target.value })}
                            className="flex-1 px-4 py-3 rounded-xl text-xs font-bold outline-none border focus:border-[#407E8C] bg-white"
                            style={{ borderColor: COLORS.mist, color: COLORS.navy }}
                          />
                        )}
                        <button
                          onClick={() => handleSubmitResi(d.id)}
                          className="text-xs font-bold px-6 py-3 rounded-xl text-white hover:brightness-110 transition shrink-0"
                          style={{ backgroundColor: COLORS.navy }}
                        >
                          Simpan Resi
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <p className="text-[13px] font-semibold flex items-center gap-1.5" style={{ color: COLORS.navy, opacity: 0.7 }}>
                          <Clock size={13} style={{ color: COLORS.gold }} />
                          Input resi atau pilih kurir mandiri sebelum kuota otomatis dilepas.
                        </p>
                        <button
                          onClick={() => setEditingId(d.id)}
                          className="w-full md:w-auto flex items-center justify-center gap-2 text-xs font-bold px-6 py-2.5 rounded-xl text-white hover:brightness-110 transition shrink-0"
                          style={{ backgroundColor: COLORS.teal }}
                        >
                          <Truck size={14} /> Input Data Pengiriman
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty state */
        <div className="rounded-[2rem] p-16 flex flex-col items-center justify-center text-center bg-white border border-dashed" style={{ borderColor: COLORS.mist }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: COLORS.mist }}>
            <Package size={28} color={COLORS.navy} style={{ opacity: 0.4 }} />
          </div>
          <h3 className="text-base font-bold mb-1.5" style={{ color: COLORS.navy }}>
            {query ? 'Tidak ditemukan' : 'Belum ada donasi'}
          </h3>
          <p className="text-sm" style={{ color: COLORS.navy, opacity: 0.55 }}>
            {query
              ? `Tidak ada donasi yang cocok dengan "${query}".`
              : 'Data donasi untuk kategori ini masih kosong.'}
          </p>
        </div>
      )}
    </div>
  );
}