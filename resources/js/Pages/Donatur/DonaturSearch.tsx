import React, { useState, useMemo } from 'react';
import { Search, MapPin, Package, SlidersHorizontal, X } from 'lucide-react';
import { useForm } from '@inertiajs/react';

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

const CATEGORIES = ["Semua", "Pangan", "Sandang", "Pendidikan", "Kesehatan"];

export default function CariPanti({ needs = [] }: { needs?: any[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState("Semua");
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  // Extract unique locations from needs
  const locations = useMemo(() => {
    const list = new Set<string>();
    needs.forEach((c) => {
      const parts = c.location.split(',');
      const city = parts[parts.length - 1]?.trim() || c.location;
      if (city) list.add(city);
    });
    return ["Semua", ...Array.from(list)];
  }, [needs]);

  // useForm Hook
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    id_needs: '',
    jumlah_donasi: '',
    pesan: '',
  });

  const filtered = useMemo(() => {
    return (needs as Campaign[]).filter((c) => {
      const matchCategory = category === "Semua" || c.category === category;

      const parts = c.location.split(',');
      const city = parts[parts.length - 1]?.trim() || c.location;
      const matchLocation = selectedLocation === "Semua" || city === selectedLocation;

      const matchQuery =
        query.trim() === "" ||
        c.item.toLowerCase().includes(query.toLowerCase()) ||
        c.org.toLowerCase().includes(query.toLowerCase()) ||
        c.location.toLowerCase().includes(query.toLowerCase());
      return matchCategory && matchLocation && matchQuery;
    });
  }, [needs, query, category, selectedLocation]);

  const handleOpenDonationModal = (campaign: any) => {
    clearErrors();
    setSelectedCampaign(campaign);
    setData({
      id_needs: campaign.id.toString(),
      jumlah_donasi: '',
      pesan: '',
    });
  };

  const handleCloseModal = () => {
    setSelectedCampaign(null);
    reset();
    clearErrors();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('donatur.donasi.store'), {
      onSuccess: () => {
        handleCloseModal();
      }
    });
  };

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
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-3 rounded-xl border shrink-0 hover:bg-gray-50 transition"
            style={{ borderColor: COLORS.mist, color: COLORS.navy, backgroundColor: '#ffffff' }}
          >
            <SlidersHorizontal size={15} /> {selectedLocation === "Semua" ? "Filter Lokasi" : `Lokasi: ${selectedLocation}`}
          </button>

          {isLocationDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsLocationDropdownOpen(false)} />
              <div
                className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white border z-20 py-1 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150"
                style={{ borderColor: COLORS.mist }}
              >
                {locations.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      setSelectedLocation(loc);
                      setIsLocationDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between"
                    style={{ color: COLORS.navy }}
                  >
                    <span>{loc}</span>
                    {selectedLocation === loc && (
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.teal }} />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
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
            const remaining = c.total - c.filled;
            return (
              <div
                key={c.id}
                className="rounded-2xl p-5 flex flex-col justify-between"
                style={{ backgroundColor: '#ffffff', border: `1px solid ${COLORS.mist}` }}
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: COLORS.mist }}>
                      <Package size={18} color={COLORS.teal} />
                    </div>
                    {c.urgent && (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full animate-pulse" style={{ backgroundColor: '#FBEAEA', color: '#C0392B' }}>
                        Mendesak
                      </span>
                    )}
                  </div>

                  <p className="text-base font-semibold mb-1" style={{ color: COLORS.navy }}>{c.item}</p>
                  <p className="text-xs flex items-center gap-1 mb-5" style={{ color: COLORS.navy, opacity: 0.55 }}>
                    <MapPin size={12} /> {c.org} · {c.location}
                  </p>
                </div>

                <div className="mt-auto">
                  <div className="flex justify-between text-xs mb-2 tabular-nums" style={{ color: COLORS.navy, opacity: 0.65 }}>
                    <span>Terpenuhi</span>
                    <span>{c.filled}/{c.total} {c.unit}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden mb-4" style={{ backgroundColor: COLORS.mist }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: COLORS.teal }} />
                  </div>
                  {remaining > 0 ? (
                    <button
                      onClick={() => handleOpenDonationModal(c)}
                      className="text-sm font-semibold w-full py-2.5 rounded-full text-white hover:brightness-110 transition shadow-sm"
                      style={{ backgroundColor: COLORS.navy }}
                    >
                      Donasi Sekarang
                    </button>
                  ) : (
                    <button
                      disabled
                      className="text-sm font-semibold w-full py-2.5 rounded-full text-gray-400 bg-gray-100 cursor-not-allowed"
                    >
                      Terpenuhi
                    </button>
                  )}
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

      {/* ================= MODAL DONASI SEKARANG ================= */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#083A4F]/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-[2rem] p-6 md:p-8 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-[#124354] flex items-center gap-2">
                Form Donasi Barang
              </h3>
              <button onClick={handleCloseModal} className="p-2 text-gray-400 hover:text-[#124354] hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="bg-[#F4F3EF] p-4 rounded-2xl mb-5 border border-gray-200/50">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Target Panti Asuhan</p>
              <h4 className="text-base font-extrabold text-[#124354]">{selectedCampaign.org}</h4>
              <p className="text-xs text-gray-500 mt-1">{selectedCampaign.location}</p>
              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center text-xs text-[#124354]">
                <span>Kebutuhan: <strong>{selectedCampaign.item}</strong></span>
                <span>Tersisa: <strong>{selectedCampaign.total - selectedCampaign.filled} {selectedCampaign.unit}</strong></span>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#124354] uppercase tracking-wider mb-1.5 ml-1">Jumlah Donasi ({selectedCampaign.unit})</label>
                <input
                  type="number"
                  min="1"
                  max={selectedCampaign.total - selectedCampaign.filled}
                  required
                  value={data.jumlah_donasi}
                  onChange={e => setData('jumlah_donasi', e.target.value)}
                  className="w-full p-3.5 text-sm rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#124354] focus:bg-white transition-colors text-[#124354] font-medium"
                  placeholder={`Contoh: ${selectedCampaign.total - selectedCampaign.filled}`}
                />
                {errors.jumlah_donasi && <p className="text-red-500 text-xs mt-1">{errors.jumlah_donasi}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#124354] uppercase tracking-wider mb-1.5 ml-1">Pesan untuk Panti (Opsional)</label>
                <textarea
                  value={data.pesan}
                  onChange={e => setData('pesan', e.target.value)}
                  className="w-full p-3.5 text-sm rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#124354] focus:bg-white transition-colors text-[#124354] font-medium resize-none h-24"
                  placeholder="Kirim pesan dukungan atau info pengemasan..."
                />
                {errors.pesan && <p className="text-red-500 text-xs mt-1">{errors.pesan}</p>}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3.5 rounded-xl font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 transition-all w-full md:w-auto"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 py-3.5 bg-[#124354] text-white font-bold rounded-xl hover:bg-[#0E3544] hover:shadow-lg hover:shadow-[#124354]/20 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {processing ? 'Mengirim...' : 'Kirim Donasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}