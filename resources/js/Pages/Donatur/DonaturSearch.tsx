import React, { useState, useMemo } from 'react';
import { 
  Search, MapPin, Package, SlidersHorizontal, X, Building2, 
  UserCheck, Truck, MapPinOff, Minus, Plus, Home, 
  ShieldCheck, Clock, Phone, Filter 
} from 'lucide-react';
import { useForm, Link, router } from '@inertiajs/react';
import EmptyState from '@/Components/UI/EmptyState';

const COLORS = {
  navy: "#293681",
  gold: "#F59E0B",
  mist: "#D0E7E6",
  teal: "#4274D9",
  cream: "#F8FAFC",
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
  logo?: string; 
  banner?: string; 
}

const CATEGORIES = ["Semua", "Pangan", "Sandang", "Pendidikan", "Kesehatan"];

// === FUNGSI UNTUK MENDAPATKAN 2 HURUF INISIAL ===
const getInitials = (name: string) => {
  if (!name) return 'PA';
  
  // Pisahkan nama berdasarkan spasi
  const words = name.trim().split(/\s+/);
  
  // Jika lebih dari 1 kata, ambil huruf pertama dari kata ke-1 dan ke-2
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  
  // Jika hanya 1 kata, ambil 2 huruf pertama dari kata tersebut
  return name.substring(0, 2).toUpperCase();
};

export default function CariPanti({ 
  needs = [], 
  pantis = [], 
  userCity = "" 
}: { 
  needs?: any[], 
  pantis?: any[], 
  userCity?: string 
}) {
  // === STATE PEMILIHAN MODE ===
  const urlParams = new URLSearchParams(window.location.search);
  const initialMode = urlParams.get('mode') === 'panti' ? 'panti' : 'kebutuhan';

  const [searchMode, setSearchMode] = useState(initialMode);

  // === STATE PENCARIAN & FILTER ===
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
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

    if (userCity && userCity !== "Semua") {
      list.add(userCity);
    }

    return ["Semua", ...Array.from(list)];
  }, [needs, pantis, searchMode, userCity]);

  // Form untuk Donasi Barang
  const formBarang = useForm({
    id_needs: '',
    jumlah_donasi: 1,
    metode_pengiriman: '' as 'ekspedisi' | 'mandiri' | 'jemput' | '',
    kurir: 'JNE',
    resi: '',
    pesan: '',
    konfirmasi_langsung: false,
  });

  // Filter Data
  const filteredNeeds = useMemo(() => {
    return (needs as Campaign[]).filter((c) => {
      const matchCategory = category === "Semua" || c.category === category;
      const parts = c.location.split(',');
      const city = parts[parts.length - 1]?.trim() || c.location;
      
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
    formBarang.setData({
      id_needs: campaign.id.toString(),
      jumlah_donasi: 1,
      metode_pengiriman: 'ekspedisi',
      kurir: 'JNE',
      resi: '',
      pesan: '',
      konfirmasi_langsung: false,
    });
  };

  const handleCloseModalBarang = () => {
    setSelectedCampaign(null);
    formBarang.reset();
    formBarang.clearErrors();
  };

  const adjustAmount = (delta: number) => {
    if (!selectedCampaign) return;
    const maxVal = selectedCampaign.remaining !== undefined ? selectedCampaign.remaining : Math.max(0, selectedCampaign.total - selectedCampaign.filled);
    formBarang.setData('jumlah_donasi', Math.min(maxVal, Math.max(1, formBarang.data.jumlah_donasi + delta)));
  };

  const handleSubmitBarang = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBarang.data.metode_pengiriman) return;
    formBarang.post(route('donatur.donasi.store'), {
      onSuccess: () => {
        handleCloseModalBarang();
      }
    });
  };

  return (
    <div className="space-y-6">

      {/* TABS PEMILIH MODE */}
      <div className="flex p-1.5 rounded-2xl w-max border shadow-sm" style={{ backgroundColor: '#ffffff', borderColor: COLORS.mist }}>
        <button
          onClick={() => { setSearchMode('kebutuhan'); setQuery(''); setSelectedLocation(userCity || 'Semua'); setCategory('Semua'); }}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${searchMode === 'kebutuhan' ? 'shadow-sm' : 'hover:bg-gray-50'}`}
          style={{ backgroundColor: searchMode === 'kebutuhan' ? COLORS.teal : 'transparent', color: searchMode === 'kebutuhan' ? '#fff' : COLORS.navy }}
        >
          <Package size={16} /> Kebutuhan Barang
        </button>
        <button
          onClick={() => { setSearchMode('panti'); setQuery(''); setSelectedLocation(userCity || 'Semua'); }}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${searchMode === 'panti' ? 'shadow-sm' : 'hover:bg-gray-50'}`}
          style={{ backgroundColor: searchMode === 'panti' ? COLORS.teal : 'transparent', color: searchMode === 'panti' ? '#fff' : COLORS.navy }}
        >
          <Building2 size={16} /> Profil Panti
        </button>
      </div>

      {/* SEARCH & FILTER AREA */}
      <div className="flex flex-row items-center gap-2 w-full">
        
        {/* 1. PENCARIAN (Fleksibel mengisi ruang) */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{ color: COLORS.navy, opacity: 0.4 }} />
          <input
            type="text"
            placeholder={searchMode === 'kebutuhan' ? "Cari barang, panti..." : "Cari nama panti..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl text-sm outline-none border focus:border-[#407E8C] transition-all"
            style={{ backgroundColor: '#ffffff', borderColor: COLORS.mist, color: COLORS.navy }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* 2. DROPDOWN LOKASI */}
        <div className="relative shrink-0 max-w-[110px] sm:max-w-[160px]">
          <button
            type="button"
            onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
            className="flex items-center justify-between gap-1 text-xs sm:text-sm font-semibold px-2.5 sm:px-4 py-2.5 rounded-xl border transition-all w-full truncate shadow-sm"
            style={{ 
              borderColor: selectedLocation === userCity && userCity ? COLORS.teal : COLORS.mist, 
              color: selectedLocation === userCity && userCity ? COLORS.teal : COLORS.navy, 
              backgroundColor: selectedLocation === userCity && userCity ? '#F2F8F9' : '#ffffff' 
            }}
          >
            <div className="flex items-center gap-1.5 truncate">
              <MapPin size={14} className="shrink-0" />
              <span className="truncate">{selectedLocation === "Semua" ? "Lokasi" : selectedLocation}</span>
            </div>
          </button>
          
          {isLocationDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsLocationDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 sm:w-56 rounded-xl shadow-lg bg-white border z-20 py-1 max-h-60 overflow-y-auto animate-in fade-in" style={{ borderColor: COLORS.mist }}>
                {locations.map((loc) => {
                  const isUserCity = userCity && loc.toLowerCase() === userCity.toLowerCase();
                  return (
                    <button 
                      key={loc} 
                      onClick={() => { setSelectedLocation(loc); setIsLocationDropdownOpen(false); }} 
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${loc === selectedLocation ? 'font-bold' : 'font-medium'}`} 
                      style={{ color: isUserCity ? COLORS.teal : COLORS.navy }}
                    >
                      <span className="flex items-center gap-2 truncate">
                        {isUserCity && <MapPin size={14} className="shrink-0" />} 
                        <span className="truncate">{loc} {isUserCity ? "(Kota Anda)" : ""}</span>
                      </span>
                      {selectedLocation === loc && <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS.teal }} />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* 3. DROPDOWN FILTER KATEGORI (Hanya di mode Kebutuhan, Icon saja di HP) */}
        {searchMode === 'kebutuhan' && (
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className="flex items-center justify-center gap-2 text-sm font-semibold p-2.5 sm:px-4 sm:py-2.5 rounded-xl border transition-all shadow-sm"
              title="Filter Kategori"
              style={{ 
                borderColor: category !== "Semua" ? COLORS.teal : COLORS.mist, 
                color: category !== "Semua" ? COLORS.teal : COLORS.navy, 
                backgroundColor: category !== "Semua" ? '#F2F8F9' : '#ffffff' 
              }}
            >
              <Filter size={16} /> 
              <span className="hidden sm:inline">{category === "Semua" ? "Kategori" : category}</span>
            </button>
            
            {isCategoryDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsCategoryDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white border z-20 py-1 animate-in fade-in" style={{ borderColor: COLORS.mist }}>
                  {CATEGORIES.map((cat) => (
                    <button 
                      key={cat} 
                      onClick={() => { setCategory(cat); setIsCategoryDropdownOpen(false); }} 
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${cat === category ? 'font-bold' : 'font-medium'}`} 
                      style={{ color: cat === category ? COLORS.teal : COLORS.navy }}
                    >
                      <span>{cat}</span>
                      {category === cat && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.teal }} />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ================= RENDER KONTEN BERDASARKAN MODE ================= */}
      
      {/* MODE 1: GRID KEBUTUHAN BARANG */}
      {searchMode === 'kebutuhan' && (
        filteredNeeds.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
            {filteredNeeds.map((c) => {
              const pct = Math.round((c.filled / c.total) * 100);
              const remaining = c.total - c.filled;
              return (
                <div key={c.id} className="rounded-2xl p-5 flex flex-col justify-between" style={{ backgroundColor: '#ffffff', border: `1px solid ${COLORS.mist}` }}>
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#4274D9]/50">
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
                    <div className="h-2 rounded-full overflow-hidden mb-4 bg-gray-200">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: COLORS.teal }} />
                    </div>
                    {remaining > 0 ? (
                      <button onClick={() => handleOpenModalBarang(c)} className="text-sm font-semibold w-full py-2.5 rounded-full text-white bg-[#4274D9] hover:bg-[#293681] transition shadow-sm">Donasi Barang</button>
                    ) : (
                      <button disabled className="text-sm font-semibold w-full py-2.5 rounded-full text-gray-400 bg-gray-100 cursor-not-allowed">Terpenuhi</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : <SearchEmptyState message="Tidak ada kebutuhan barang untuk filter saat ini" />
      )}

      {/* MODE 2: GRID PROFIL PANTI */}
      {searchMode === 'panti' && (
        filteredPantis.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
            {filteredPantis.map((p) => (
              <div 
                key={p.id} 
                className="rounded-2xl flex flex-col hover:shadow-lg transition-all group overflow-hidden relative h-full" 
                style={{ backgroundColor: '#ffffff', border: `1px solid ${COLORS.mist}` }}
              >
                {/* --- Banner Area --- */}
                <div 
                  className="h-28 w-full bg-cover bg-center relative"
                  style={{
                    backgroundImage: p.banner ? `url(${p.banner})` : 'none',
                    backgroundColor: p.banner ? 'transparent' : COLORS.teal
                  }}
                >
                  {!p.banner && (
                    <div 
                      className="absolute inset-0 opacity-20" 
                      style={{ 
                        backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)', 
                        backgroundSize: '12px 12px' 
                      }} 
                    />
                  )}
                </div>

                {/* --- Konten Bawah Banner --- */}
                <div className="p-5 flex flex-col flex-1 relative">
                  
                  {/* Foto Profil (Logo) / Inisial 2 Huruf */}
                  <div className="absolute -top-10 left-5">
                    {p.logo ? (
                      <img 
                        src={p.logo} 
                        alt={`Logo ${p.nama}`} 
                        className="w-16 h-16 rounded-full border-4 object-cover group-hover:scale-105 transition-transform bg-white"
                        style={{ borderColor: '#ffffff' }}
                      />
                    ) : (
                      <div 
                        className="w-16 h-16 rounded-full border-4 flex items-center justify-center text-lg font-bold group-hover:scale-105 transition-transform tracking-wider"
                        style={{ 
                          borderColor: '#ffffff', 
                          backgroundColor: COLORS.teal,
                          color: '#ffffff'
                        }}
                      >
                        {getInitials(p.nama)}
                      </div>
                    )}
                  </div>

                  {/* Spacer */}
                  <div className="h-3"></div>

                  <div className="flex-1">
                    <p className="text-lg font-bold mb-1" style={{ color: COLORS.navy }}>{p.nama}</p>
                    <p className="text-xs flex items-center gap-1 mb-3" style={{ color: COLORS.navy, opacity: 0.55 }}>
                      <MapPin size={12} /> {p.lokasi}
                    </p>
                    <p className="text-sm line-clamp-2 mb-5" style={{ color: COLORS.navy, opacity: 0.75 }}>
                      {p.deskripsi || "Yayasan panti asuhan yang berdedikasi untuk membantu anak-anak."}
                    </p>
                  </div>
                  
                  {/* Tombol Lihat Profil */}
                  <div className="mt-auto">
                    <Link 
                      href={route('donatur.panti.show', p.id)}
                      className="block text-sm text-center text-white font-semibold w-full py-2.5 rounded-full transition shadow-sm hover:brightness-110" 
                      style={{backgroundColor: COLORS.teal}}
                    >
                      Lihat Profil
                    </Link>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : <SearchEmptyState message={`Tidak ada panti asuhan di ${selectedLocation}`} />
      )}

      {/* ================= MODAL BOOKING BARANG ================= */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#083A4F]/60 backdrop-blur-xs transition-opacity">
          <div className="bg-white rounded-[2rem] p-6 md:p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-5 shrink-0">
              <h3 className="text-lg font-black text-[#293681] flex items-center gap-2">
                <Package size={20} className="text-[#293681]" /> Donasi Sekarang
              </h3>
              <button onClick={handleCloseModalBarang} className="p-2 text-gray-400 hover:text-[#124354] bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitBarang} className="space-y-5 flex-1">
              {/* Info Campaign */}
              <div className="rounded-2xl p-4 bg-[#4274D9]/10 border border-gray-200">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-[#4274D9]/80">
                    <Package size={20} color="#293681" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#293681]">{selectedCampaign.item}</p>
                    <p className="text-xs text-[#293691]/70 mt-0.5">
                      {selectedCampaign.category} · {selectedCampaign.org}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between text-xs mb-2 font-semibold text-[#293681]/70">
                  <span>Terpenuhi</span>
                  <span>{selectedCampaign.filled}/{selectedCampaign.total} {selectedCampaign.unit}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden bg-[#4274D9]/20">
                  <div 
                    className="h-full rounded-full bg-[#4274D9]" 
                    style={{ width: `${(selectedCampaign.filled / selectedCampaign.total) * 100}%` }} 
                  />
                </div>
                <p className="text-[11px] mt-2 text-[#293681]/60 font-semibold">
                  Sisa kuota tersedia: <strong>{selectedCampaign.remaining !== undefined ? selectedCampaign.remaining : (selectedCampaign.total - selectedCampaign.filled)} {selectedCampaign.unit}</strong>
                </p>
              </div>

              {/* Jumlah Donasi */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                  Berapa banyak yang ingin Anda donasikan?
                </h4>
                <div className="flex items-center justify-center gap-5 py-2">
                  <button
                    type="button"
                    onClick={() => adjustAmount(-1)}
                    disabled={formBarang.data.jumlah_donasi <= 1}
                    className="w-10 h-10 rounded-full flex items-center justify-center border transition disabled:opacity-30 border-[#4274D9]/40 text-[#083A4F]"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="text-center min-w-[80px]">
                    <p className="text-2xl font-bold tabular-nums text-[#083A4F]">{formBarang.data.jumlah_donasi}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{selectedCampaign.unit}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => adjustAmount(1)}
                    disabled={formBarang.data.jumlah_donasi >= (selectedCampaign.remaining !== undefined ? selectedCampaign.remaining : (selectedCampaign.total - selectedCampaign.filled))}
                    className="w-10 h-10 rounded-full flex items-center justify-center border transition disabled:opacity-30 border-[#4274D9]/40 text-[#083A4F]"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                {formBarang.errors.jumlah_donasi && (
                  <p className="text-xs text-red-500 mt-1 text-center">{formBarang.errors.jumlah_donasi}</p>
                )}
              </div>

              {/* Catatan / Pesan */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  Catatan untuk Panti (Opsional)
                </h4>
                <textarea
                  value={formBarang.data.pesan}
                  onChange={(e) => formBarang.setData('pesan', e.target.value)}
                  placeholder="Tulis pesan atau info tambahan mengenai barang donasi Anda..."
                  className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:border-[#407E8C] outline-none h-20 resize-none text-[#083A4F] font-semibold"
                />
                {formBarang.errors.pesan && (
                  <p className="text-xs text-red-500 mt-1">{formBarang.errors.pesan}</p>
                )}
              </div>

              {/* Metode Pengiriman */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                  Metode Pengiriman
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      formBarang.setData(prev => ({
                        ...prev,
                        metode_pengiriman: 'ekspedisi',
                        kurir: 'JNE',
                        resi: '',
                        konfirmasi_langsung: false
                      }));
                    }}
                    className="text-left p-3 rounded-xl border-2 transition flex flex-col justify-between h-full"
                    style={{
                      borderColor: formBarang.data.metode_pengiriman === 'ekspedisi' ? '#4274D9' : '#C1D6FF',
                      backgroundColor: formBarang.data.metode_pengiriman === 'ekspedisi' ? 'rgba(64,126,140,0.06)' : '#ffffff',
                    }}
                  >
                    <Truck size={18} color={formBarang.data.metode_pengiriman === 'ekspedisi' ? '#4274D9' : '#C1D6FF'} className="mb-2" />
                    <p className="text-[10px] font-extrabold text-[#293681]">Kirim Ekspedisi</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      formBarang.setData(prev => ({
                        ...prev,
                        metode_pengiriman: 'mandiri',
                        kurir: 'Antar Mandiri',
                        resi: '',
                        konfirmasi_langsung: false
                      }));
                    }}
                    className="text-left p-3 rounded-xl border-2 transition flex flex-col justify-between h-full"
                    style={{
                      borderColor: formBarang.data.metode_pengiriman === 'mandiri' ? '#4274D9' : '#C1D6FF',
                      backgroundColor: formBarang.data.metode_pengiriman === 'mandiri' ? 'rgba(64,126,140,0.06)' : '#ffffff',
                    }}
                  >
                    <Home size={18} color={formBarang.data.metode_pengiriman === 'mandiri' ? '#4274D9' : '#C1D6FF'} className="mb-2" />
                    <p className="text-[10px] font-extrabold text-[#293681]">Antar Mandiri</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      formBarang.setData(prev => ({
                        ...prev,
                        metode_pengiriman: 'jemput',
                        kurir: 'Jemput oleh Panti',
                        resi: '',
                        konfirmasi_langsung: false
                      }));
                    }}
                    className="text-left p-3 rounded-xl border-2 transition flex flex-col justify-between h-full"
                    style={{
                      borderColor: formBarang.data.metode_pengiriman === 'jemput' ? '#4274D9' : '#C1D6FF',
                      backgroundColor: formBarang.data.metode_pengiriman === 'jemput' ? 'rgba(64,126,140,0.06)' : '#ffffff',
                    }}
                  >
                    <Package size={18} color={formBarang.data.metode_pengiriman === 'jemput' ? '#4274D9' : '#C1D6FF'} className="mb-2" />
                    <p className="text-[10px] font-extrabold text-[#293681]">Jemput Panti</p>
                  </button>
                </div>

                {/* Sub-form Pengiriman */}
                {formBarang.data.metode_pengiriman === 'ekspedisi' && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex gap-2 mb-2">
                      <select
                        value={formBarang.data.kurir}
                        onChange={(e) => formBarang.setData('kurir', e.target.value)}
                        className="px-3 py-2 rounded-lg text-xs font-bold outline-none border focus:border-[#407E8C] bg-white text-[#083A4F]"
                        style={{ borderColor: '#C0D5D6' }}
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
                        value={formBarang.data.resi}
                        onChange={(e) => formBarang.setData('resi', e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg text-xs font-bold outline-none border focus:border-[#407E8C] text-[#083A4F]"
                        style={{ borderColor: '#C0D5D6' }}
                      />
                    </div>
                    
                    <label className="flex items-center gap-2 cursor-pointer mt-1">
                      <input
                        type="checkbox"
                        checked={formBarang.data.konfirmasi_langsung}
                        onChange={(e) => formBarang.setData('konfirmasi_langsung', e.target.checked)}
                        className="rounded border-gray-300 text-[#407E8C] focus:ring-[#407E8C]"
                      />
                      <span className="text-[12px] font-extrabold text-[#083A4F]/85">
                        Barang sudah diserahkan ke ekspedisi sekarang
                      </span>
                    </label>
                    
                    <p className="text-[11px] mt-2 flex items-start gap-1 text-gray-400 font-semibold">
                      <Clock size={11} className="shrink-0 mt-0.5" /> 
                      Belum punya resinya? Jangan khawatir - Anda punya waktu 24 jam untuk melengkapinya dari menu Riwayat Donasi agar tidak batal otomatis.
                    </p>
                  </div>
                )}

                {formBarang.data.metode_pengiriman === 'mandiri' && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formBarang.data.konfirmasi_langsung}
                        onChange={(e) => formBarang.setData('konfirmasi_langsung', e.target.checked)}
                        className="rounded border-gray-300 text-[#407E8C] focus:ring-[#407E8C]"
                      />
                      <span className="text-[10px] font-extrabold text-[#083A4F]/85">
                        Barang sudah mulai saya antar ke lokasi panti sekarang
                      </span>
                    </label>
                    <p className="text-[9px] mt-2 flex items-start gap-1 text-gray-400 font-semibold">
                      <Clock size={11} className="shrink-0 mt-0.5" /> 
                      Jika Anda belum berangkat sekarang, lakukan konfirmasi jalan dalam waktu 24 jam atau kuota akan otomatis dilepas.
                    </p>
                  </div>
                )}

                {formBarang.data.metode_pengiriman === 'jemput' && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="rounded-xl p-3 bg-amber-50 border border-amber-100 flex items-start gap-2">
                      <Clock size={13} className="text-[#A58D66] shrink-0 mt-0.5" />
                      <p className="text-[9px] leading-normal text-amber-800 font-semibold">
                        Penjemputan memerlukan konfirmasi pihak panti. Panti memiliki waktu 24 jam untuk menyetujui request penjemputan ini sebelum booking otomatis dibatalkan.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Alamat Tujuan */}
              <div className="rounded-2xl p-4 bg-[#4274D9]/10 border border-gray-200 text-[#083A4F]">
                <div className="flex items-center gap-1.5 mb-2">
                  <MapPin size={14} color="#4274D9" />
                  <span className="text-[10px] font-black text-[#4274D9] uppercase tracking-wider">
                    Alamat Penerima
                  </span>
                </div>
                <p className="text-xs font-extrabold mb-1">{selectedCampaign.org}</p>
                <p className="text-[11px] leading-relaxed mb-2 opacity-85 font-medium">
                  {selectedCampaign.address || selectedCampaign.location}
                </p>
                <p className="text-[10px] flex items-center gap-1 opacity-75 font-semibold">
                  <Phone size={10} /> {selectedCampaign.phone || '-'}
                </p>
              </div>

              {/* Ringkasan & Submit */}
              <div className="pt-3 flex gap-3 sticky bottom-0 bg-white py-2 border-t border-gray-50">
                <button 
                  type="button" 
                  onClick={handleCloseModalBarang} 
                  className="px-5 py-3.5 bg-white border border-gray-200 text-gray-500 text-xs font-extrabold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={!formBarang.data.metode_pengiriman || formBarang.processing} 
                  className="flex-1 py-3.5 bg-[#4274D9] text-white text-xs font-extrabold rounded-xl hover:bg-[#293681] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck size={14} /> {formBarang.processing ? 'Memproses...' : 'Kunci Donasi Ini'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

const SearchEmptyState = ({ message }: { message: string }) => (
  <EmptyState
    mode="search"
    icon={MapPinOff}
    title="Tidak Ditemukan"
    description={message}
  />
);