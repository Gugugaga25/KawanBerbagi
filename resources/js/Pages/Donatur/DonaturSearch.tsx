import React, { useState, useMemo } from 'react';
import { Search, MapPin, Package, SlidersHorizontal, X, Building2, UserCheck, Truck, MapPinOff } from 'lucide-react';
import { useForm, Link } from '@inertiajs/react';

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

interface Panti {
  id: number;
  nama: string;
  lokasi: string;
  deskripsi: string;
  jumlah_anak: number;
}

const CATEGORIES = ["Semua", "Pangan", "Sandang", "Pendidikan", "Kesehatan"];

export default function CariPanti({ 
  needs = [], 
  pantis = [], 
  userCity = "" // Prop baru untuk menangkap kota asal donatur
}: { 
  needs?: any[], 
  pantis?: any[], 
  userCity?: string 
}) {
  // === STATE PEMILIHAN MODE ===
  const urlParams = new URLSearchParams(window.location.search);
const initialMode = urlParams.get('mode') === 'panti' ? 'panti' : 'kebutuhan';

// 2. Gunakan sebagai default state
const [searchMode, setSearchMode] = useState(initialMode);

  // === STATE PENCARIAN & FILTER ===
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  
  // Set default state menggunakan userCity (jika ada), kalau kosong default ke "Semua"
  const [selectedLocation, setSelectedLocation] = useState(userCity || "Semua");
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  // === STATE MODAL BARANG ===
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

  // Ekstrak lokasi unik
  const locations = useMemo(() => {
    const list = new Set<string>();
    const sourceData = searchMode === 'kebutuhan' ? needs : pantis;
    
    sourceData.forEach((item: any) => {
      const locString = searchMode === 'kebutuhan' ? item.location : item.lokasi;
      if (locString) {
        const parts = locString.split(',');
        const city = parts[parts.length - 1]?.trim() || locString;
        if (city) list.add(city);
      }
    });

    // Pastikan kota user tetap ada di dropdown meskipun belum ada campaign di kota tsb
    if (userCity && userCity !== "Semua") {
      list.add(userCity);
    }

    return ["Semua", ...Array.from(list)];
  }, [needs, pantis, searchMode, userCity]);

  // Form untuk Donasi Barang
  const formBarang = useForm({
    id_needs: '',
    jumlah_donasi: '',
    metode_pengiriman: 'antar_sendiri',
    pesan: '',
  });

  // Filter Data
  const filteredNeeds = useMemo(() => {
    return (needs as Campaign[]).filter((c) => {
      const matchCategory = category === "Semua" || c.category === category;
      const parts = c.location.split(',');
      const city = parts[parts.length - 1]?.trim() || c.location;
      
      // Logika pencocokan lokasi (cek apakah string lokasi mengandung kata yang dicari)
      const matchLocation = selectedLocation === "Semua" || city.toLowerCase().includes(selectedLocation.toLowerCase());
      
      const matchQuery = query.trim() === "" || c.item.toLowerCase().includes(query.toLowerCase()) || c.org.toLowerCase().includes(query.toLowerCase()) || c.location.toLowerCase().includes(query.toLowerCase());
      
      return matchCategory && matchLocation && matchQuery;
    });
  }, [needs, query, category, selectedLocation]);

  const filteredPantis = useMemo(() => {
    return (pantis as Panti[]).filter((p) => {
      const parts = p.lokasi.split(',');
      const city = parts[parts.length - 1]?.trim() || p.lokasi;
      
      const matchLocation = selectedLocation === "Semua" || city.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchQuery = query.trim() === "" || p.nama.toLowerCase().includes(query.toLowerCase()) || p.lokasi.toLowerCase().includes(query.toLowerCase());
      
      return matchLocation && matchQuery;
    });
  }, [pantis, query, selectedLocation]);

  // === HANDLER MODAL BARANG ===
  const handleOpenModalBarang = (campaign: any) => {
    formBarang.clearErrors();
    setSelectedCampaign(campaign);
    formBarang.setData({ id_needs: campaign.id.toString(), jumlah_donasi: '', pesan: '' });
  };

  const handleCloseModalBarang = () => {
    setSelectedCampaign(null);
    formBarang.reset();
    formBarang.clearErrors();
  };

  const handleSubmitBarang = (e: React.FormEvent) => {
    e.preventDefault();
    formBarang.post(route('donatur.donasi.store'), {
      onSuccess: () => handleCloseModalBarang()
    });
  };

  return (
    <div className="space-y-6">

      {/* TABS PEMILIH MODE */}
      <div className="flex p-1.5 rounded-2xl w-max border shadow-sm" style={{ backgroundColor: '#ffffff', borderColor: COLORS.mist }}>
        <button
          onClick={() => { setSearchMode('kebutuhan'); setQuery(''); setSelectedLocation(userCity || 'Semua'); }}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${searchMode === 'kebutuhan' ? 'shadow-sm' : 'hover:bg-gray-50'}`}
          style={{ backgroundColor: searchMode === 'kebutuhan' ? COLORS.navy : 'transparent', color: searchMode === 'kebutuhan' ? '#fff' : COLORS.navy }}
        >
          <Package size={16} /> Kebutuhan Barang
        </button>
        <button
          onClick={() => { setSearchMode('panti'); setQuery(''); setSelectedLocation(userCity || 'Semua'); }}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${searchMode === 'panti' ? 'shadow-sm' : 'hover:bg-gray-50'}`}
          style={{ backgroundColor: searchMode === 'panti' ? COLORS.navy : 'transparent', color: searchMode === 'panti' ? '#fff' : COLORS.navy }}
        >
          <Building2 size={16} /> Profil Panti
        </button>
      </div>

      {/* SEARCH & FILTER AREA */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: COLORS.navy, opacity: 0.4 }} />
          <input
            type="text"
            placeholder={searchMode === 'kebutuhan' ? "Cari barang, nama panti..." : "Cari nama panti asuhan..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none border focus:border-[#407E8C]"
            style={{ backgroundColor: '#ffffff', borderColor: COLORS.mist, color: COLORS.navy }}
          />
        </div>
        
        {/* DROPDOWN FILTER LOKASI */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-3 rounded-xl border shrink-0 hover:bg-gray-50 transition"
            style={{ 
              borderColor: selectedLocation === userCity && userCity ? COLORS.teal : COLORS.mist, 
              color: selectedLocation === userCity && userCity ? COLORS.teal : COLORS.navy, 
              backgroundColor: selectedLocation === userCity && userCity ? '#F2F8F9' : '#ffffff' 
            }}
          >
            <SlidersHorizontal size={15} /> 
            {selectedLocation === "Semua" ? "Semua Lokasi" : `Lokasi: ${selectedLocation}`}
          </button>
          
          {isLocationDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsLocationDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white border z-20 py-1 max-h-60 overflow-y-auto animate-in fade-in" style={{ borderColor: COLORS.mist }}>
                {locations.map((loc) => {
                  const isUserCity = userCity && loc.toLowerCase() === userCity.toLowerCase();
                  return (
                    <button 
                      key={loc} 
                      onClick={() => { setSelectedLocation(loc); setIsLocationDropdownOpen(false); }} 
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${loc === selectedLocation ? 'font-bold' : 'font-medium'}`} 
                      style={{ color: isUserCity ? COLORS.teal : COLORS.navy }}
                    >
                      <span className="flex items-center gap-2">
                        {isUserCity && <MapPin size={14} />} 
                        {loc} {isUserCity ? "(Kota Anda)" : ""}
                      </span>
                      {selectedLocation === loc && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.teal }} />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* CATEGORY CHIPS */}
      {searchMode === 'kebutuhan' && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)} className="text-sm font-semibold border px-4 py-2 rounded-full transition shrink-0" style={{ backgroundColor: category === cat ? COLORS.navy : "#fff", color: category === cat ? COLORS.cream : COLORS.navy, borderColor: COLORS.mist }}>
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* ================= RENDER KONTEN BERDASARKAN MODE ================= */}
      
      {/* MODE 1: GRID KEBUTUHAN BARANG */}
      {searchMode === 'kebutuhan' && (
        filteredNeeds.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNeeds.map((c) => {
              const pct = Math.round((c.filled / c.total) * 100);
              const remaining = c.total - c.filled;
              return (
                <div key={c.id} className="rounded-2xl p-5 flex flex-col justify-between" style={{ backgroundColor: '#ffffff', border: `1px solid ${COLORS.mist}` }}>
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: COLORS.mist }}>
                        <Package size={18} color={COLORS.teal} />
                      </div>
                      {c.urgent && <span className="text-[11px] font-bold px-2.5 py-1 rounded-full animate-pulse" style={{ backgroundColor: '#FBEAEA', color: '#C0392B' }}>Mendesak</span>}
                    </div>
                    <p className="text-base font-semibold mb-1" style={{ color: COLORS.navy }}>{c.item}</p>
                    <p className="text-xs flex items-center gap-1 mb-5" style={{ color: COLORS.navy, opacity: 0.55 }}>
                      <MapPin size={12} /> {c.org} · {c.location}
                    </p>
                  </div>
                  <div className="mt-auto">
                    <div className="flex justify-between text-xs mb-2 tabular-nums" style={{ color: COLORS.navy, opacity: 0.65 }}>
                      <span>Terpenuhi</span><span>{c.filled}/{c.total} {c.unit}</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden mb-4" style={{ backgroundColor: COLORS.mist }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: COLORS.teal }} />
                    </div>
                    {remaining > 0 ? (
                      <button onClick={() => handleOpenModalBarang(c)} className="text-sm font-semibold w-full py-2.5 rounded-full text-white hover:brightness-110 transition shadow-sm" style={{ backgroundColor: COLORS.navy }}>Donasi Barang</button>
                    ) : (
                      <button disabled className="text-sm font-semibold w-full py-2.5 rounded-full text-gray-400 bg-gray-100 cursor-not-allowed">Terpenuhi</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : <EmptyState message={`Tidak ada kebutuhan barang di ${selectedLocation}`} />
      )}

      {/* MODE 2: GRID PROFIL PANTI */}
      {searchMode === 'panti' && (
        filteredPantis.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPantis.map((p) => (
              <Link 
                href={route('donatur.panti.show', p.id)} 
                key={p.id} 
                className="rounded-2xl p-5 flex flex-col justify-between hover:shadow-lg transition-all cursor-pointer group" 
                style={{ backgroundColor: '#ffffff', border: `1px solid ${COLORS.mist}` }}
              >
                <div>
                  <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center border-2 group-hover:scale-105 transition-transform" style={{ borderColor: COLORS.teal, backgroundColor: COLORS.mist }}>
                    <Building2 size={20} color={COLORS.navy} />
                  </div>
                  <p className="text-lg font-bold mb-1" style={{ color: COLORS.navy }}>{p.nama}</p>
                  <p className="text-xs flex items-center gap-1 mb-3" style={{ color: COLORS.navy, opacity: 0.55 }}>
                    <MapPin size={12} /> {p.lokasi}
                  </p>
                  <p className="text-sm line-clamp-3 mb-5" style={{ color: COLORS.navy, opacity: 0.75 }}>
                    {p.deskripsi || "Yayasan panti asuhan yang berdedikasi untuk membantu anak-anak."}
                  </p>
                </div>
                <div className="text-sm text-center text-white font-semibold w-full py-2.5 rounded-full transition shadow-sm" style={{backgroundColor: COLORS.navy}}>
                  Lihat Profil
                </div>
              </Link>
            ))}
          </div>
        ) : <EmptyState message={`Tidak ada panti asuhan di ${selectedLocation}`} />
      )}

      {/* ================= MODAL BOOKING BARANG ================= */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#083A4F]/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-[2rem] p-6 md:p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95">
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-black text-[#124354] flex items-center gap-2">
                <Package size={20} className="text-[#407E8C]" /> Donasi Barang
              </h3>
              <button onClick={handleCloseModalBarang} className="p-2 text-gray-400 hover:text-[#124354] bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            {/* Info Box */}
            <div className="bg-[#F4F3EF] p-4 rounded-2xl mb-6 border border-gray-200">
              <h4 className="text-base font-extrabold text-[#124354]">{selectedCampaign.org}</h4>
              <p className="text-xs text-gray-500 mt-1">{selectedCampaign.location}</p>
              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center text-xs text-[#124354]">
                <span>Kebutuhan: <strong>{selectedCampaign.item}</strong></span>
                <span>Tersisa: <strong>{selectedCampaign.total - selectedCampaign.filled} {selectedCampaign.unit}</strong></span>
              </div>
            </div>

            <form onSubmit={handleSubmitBarang} className="space-y-5">
              {/* Input Jumlah */}
              <div>
                <label className="block text-[10px] font-bold text-[#124354] uppercase tracking-wider mb-2">Jumlah Donasi ({selectedCampaign.unit})</label>
                <input 
                  type="number" 
                  min="1" 
                  max={selectedCampaign.total - selectedCampaign.filled} 
                  required 
                  value={formBarang.data.jumlah_donasi} 
                  onChange={e => formBarang.setData('jumlah_donasi', e.target.value)} 
                  className="w-full p-3.5 text-sm rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#124354]" 
                  placeholder={`Max: ${selectedCampaign.total - selectedCampaign.filled}`} 
                />
              </div>

              {/* Metode Pengiriman */}
              <div>
                <label className="block text-[10px] font-bold text-[#124354] uppercase tracking-wider mb-2">Metode Pengiriman</label>
                <div className="flex gap-3">
                  <label className={`flex-1 p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${formBarang.data.metode_pengiriman === 'antar_sendiri' ? 'border-[#083A4F] bg-[#083A4F]/5 text-[#083A4F]' : 'border-gray-100 bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>
                    <input type="radio" name="metode" value="antar_sendiri" className="hidden" checked={formBarang.data.metode_pengiriman === 'antar_sendiri'} onChange={(e) => formBarang.setData('metode_pengiriman', e.target.value)} />
                    <UserCheck size={18} />
                    <span className="font-bold text-xs text-center">Antar Sendiri</span>
                  </label>
                  
                  <label className={`flex-1 p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${formBarang.data.metode_pengiriman === 'jasa_logistik' ? 'border-[#083A4F] bg-[#083A4F]/5 text-[#083A4F]' : 'border-gray-100 bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>
                    <input type="radio" name="metode" value="jasa_logistik" className="hidden" checked={formBarang.data.metode_pengiriman === 'jasa_logistik'} onChange={(e) => formBarang.setData('metode_pengiriman', e.target.value)} />
                    <Truck size={18} />
                    <span className="font-bold text-xs text-center">Jasa Logistik<br/><span className="text-[9px] font-normal opacity-70">(GoSend, dll)</span></span>
                  </label>
                </div>
              </div>

              {/* Catatan / Pesan */}
              <div>
                <label className="block text-[10px] font-bold text-[#124354] uppercase tracking-wider mb-2">Pesan (Opsional)</label>
                <textarea 
                  value={formBarang.data.pesan} 
                  onChange={e => formBarang.setData('pesan', e.target.value)} 
                  className="w-full p-3.5 text-sm rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#124354] h-20 resize-none" 
                  placeholder="Pesan dukungan atau info pengiriman..." 
                />
              </div>

              {/* Buttons */}
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={handleCloseModalBarang} className="px-6 py-3.5 rounded-xl text-sm font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors w-full md:w-auto">
                  Batal
                </button>
                <button type="submit" disabled={formBarang.processing} className="flex-1 py-3.5 bg-[#124354] text-white text-sm font-bold rounded-xl hover:bg-[#0E3544] shadow-sm disabled:opacity-50 transition-colors">
                  {formBarang.processing ? 'Memproses...' : 'Booking Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

const EmptyState = ({ message }: { message: string }) => (
  <div className="rounded-2xl p-14 flex flex-col items-center justify-center text-center" style={{ backgroundColor: '#ffffff', border: `1px dashed ${COLORS.mist}` }}>
    <MapPinOff size={26} color={COLORS.navy} style={{ opacity: 0.3 }} className="mb-3" />
    <p className="text-sm font-semibold" style={{ color: COLORS.navy }}>{message}</p>
  </div>
);