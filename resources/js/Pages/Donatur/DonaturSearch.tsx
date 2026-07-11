import React, { useState, useMemo } from 'react';
import { Search, MapPin, Package, SlidersHorizontal } from 'lucide-react';

const COLORS = {
  navy: "#083A4F",
  gold: "#A58D66",
  mist: "#C0D5D6",
  teal: "#407E8C",
  cream: "#E5E1DD",
};

interface Campaign {
  id: number;
  org: string;
  location: string;
  item: string;
  category: string;
  unit: string;
  filled: number;
  total: number;
  urgent: boolean;
}

const CAMPAIGNS: Campaign[] = [
  { id: 1, org: "Yayasan Kasih Ibu", location: "Bandung Selatan", item: "Beras 50kg", category: "Pangan", unit: "kg", filled: 36, total: 50, urgent: false },
  { id: 2, org: "Panti Asuhan Nurul Iman", location: "Jakarta Timur", item: "Susu Bayi (kaleng)", category: "Pangan", unit: "kaleng", filled: 18, total: 20, urgent: true },
  { id: 3, org: "Rumah Yatim Cahaya", location: "Surabaya", item: "Buku Pelajaran SD", category: "Pendidikan", unit: "eksemplar", filled: 42, total: 120, urgent: false },
  { id: 4, org: "Panti Wreda Bahagia", location: "Yogyakarta", item: "Selimut & Pakaian Hangat", category: "Sandang", unit: "pcs", filled: 9, total: 30, urgent: true },
  { id: 5, org: "Yayasan Tunas Bangsa", location: "Semarang", item: "Alat Tulis Sekolah", category: "Pendidikan", unit: "paket", filled: 14, total: 40, urgent: false },
  { id: 6, org: "Panti Asuhan Budi Mulia", location: "Yogyakarta", item: "Obat-obatan Umum", category: "Kesehatan", unit: "paket", filled: 8, total: 25, urgent: true },
];

const CATEGORIES = ["Semua", "Pangan", "Sandang", "Pendidikan", "Kesehatan"];

export default function CariPanti() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");

  const filtered = useMemo(() => {
    return CAMPAIGNS.filter((c) => {
      const matchCategory = category === "Semua" || c.category === category;
      const matchQuery =
        query.trim() === "" ||
        c.item.toLowerCase().includes(query.toLowerCase()) ||
        c.org.toLowerCase().includes(query.toLowerCase()) ||
        c.location.toLowerCase().includes(query.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [query, category]);

  return (
    <div className="space-y-6">
      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: COLORS.navy, opacity: 0.4 }} />
          <input
            type="text"
            placeholder="Cari barang, panti, atau kota..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none border focus:border-[#407E8C]"
            style={{ backgroundColor: '#ffffff', borderColor: COLORS.mist, color: COLORS.navy }}
          />
        </div>
        <button
          className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-3 rounded-xl border shrink-0"
          style={{ borderColor: COLORS.mist, color: COLORS.navy, backgroundColor: '#ffffff' }}
        >
          <SlidersHorizontal size={15} /> Filter Lokasi
        </button>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className="text-sm font-semibold border px-4 py-2 rounded-full transition shrink-0"
            style={{
              backgroundColor: category === cat ? COLORS.navy : "#fff",
              color: category === cat ? COLORS.cream : COLORS.navy,
              borderColor: COLORS.mist
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="text-sm" style={{ color: COLORS.navy, opacity: 0.55 }}>
        Menampilkan {filtered.length} kebutuhan aktif
      </p>

      {/* Results grid */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => {
            const pct = Math.round((c.filled / c.total) * 100);
            return (
              <div
                key={c.id}
                className="rounded-2xl p-5 flex flex-col"
                style={{ backgroundColor: '#ffffff', border: `1px solid ${COLORS.mist}` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: COLORS.mist }}>
                    <Package size={18} color={COLORS.teal} />
                  </div>
                  {c.urgent && (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#FBEAEA', color: '#C0392B' }}>
                      Mendesak
                    </span>
                  )}
                </div>

                <p className="text-base font-semibold mb-1" style={{ color: COLORS.navy }}>{c.item}</p>
                <p className="text-xs flex items-center gap-1 mb-5" style={{ color: COLORS.navy, opacity: 0.55 }}>
                  <MapPin size={12} /> {c.org} · {c.location}
                </p>

                <div className="mt-auto">
                  <div className="flex justify-between text-xs mb-2 tabular-nums" style={{ color: COLORS.navy, opacity: 0.65 }}>
                    <span>Terpenuhi</span>
                    <span>{c.filled}/{c.total} {c.unit}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden mb-4" style={{ backgroundColor: COLORS.mist }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: COLORS.teal }} />
                  </div>
                  <button
                    className="text-sm font-semibold w-full py-2.5 rounded-full text-white hover:brightness-110 transition"
                    style={{ backgroundColor: COLORS.navy }}
                  >
                    Donasi Sekarang
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="rounded-2xl p-14 flex flex-col items-center justify-center text-center"
          style={{ backgroundColor: '#ffffff', border: `1px dashed ${COLORS.mist}` }}
        >
          <Search size={26} color={COLORS.navy} style={{ opacity: 0.3 }} className="mb-3" />
          <p className="text-sm font-semibold" style={{ color: COLORS.navy }}>
            Tidak ada kebutuhan yang cocok dengan pencarian Anda
          </p>
        </div>
      )}
    </div>
  );
}