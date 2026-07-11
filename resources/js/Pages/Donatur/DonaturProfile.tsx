import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Bell,
  Camera,
  CheckCircle2,
} from 'lucide-react';

const COLORS = {
  navy: "#083A4F",
  gold: "#A58D66",
  mist: "#C0D5D6",
  teal: "#407E8C",
  cream: "#E5E1DD",
};

export default function ProfilSaya() {
  const [profile, setProfile] = useState({
    name: 'Budi Santoso',
    email: 'budi.santoso@email.com',
    phone: '081234567890',
    city: 'Bandung',
  });

  const [notifications, setNotifications] = useState({
    reminderResi: true,
    kebutuhanMendesak: true,
    ceritaDampak: true,
    promo: false,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      type="button"
      onClick={onChange}
      className="w-11 h-6 rounded-full relative transition-colors shrink-0"
      style={{ backgroundColor: checked ? COLORS.teal : COLORS.mist }}
    >
      <span
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow-sm"
        style={{ left: checked ? '22px' : '2px' }}
      />
    </button>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Avatar + identitas singkat */}
      <div className="rounded-2xl p-6 sm:p-7 flex items-center gap-5" style={{ backgroundColor: '#ffffff', border: `1px solid ${COLORS.mist}` }}>
        <div className="relative shrink-0">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{ backgroundColor: COLORS.mist, color: COLORS.navy }}
          >
            {profile.name.charAt(0)}
          </div>
          <button
            className="absolute bottom-2 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white"
            style={{ backgroundColor: COLORS.navy }}
          >
            <Camera size={13} color={COLORS.cream} />
          </button>
        </div>
        <div>
          <p className="text-lg font-bold" style={{ color: COLORS.navy }}>{profile.name}</p>
          <p className="text-sm" style={{ color: COLORS.navy, opacity: 0.55 }}>Donatur sejak Jan 2025</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Informasi pribadi */}
        <div className="rounded-2xl p-6 sm:p-7" style={{ backgroundColor: '#ffffff', border: `1px solid ${COLORS.mist}` }}>
          <h3 className="text-base font-semibold mb-5" style={{ color: COLORS.navy }}>
            Informasi Pribadi
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: COLORS.navy }}>Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: COLORS.navy, opacity: 0.4 }} />
                <input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm outline-none border focus:border-[#407E8C]"
                  style={{ backgroundColor: '#ffffff', borderColor: COLORS.mist, color: COLORS.navy }}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: COLORS.navy }}>Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: COLORS.navy, opacity: 0.4 }} />
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm outline-none border focus:border-[#407E8C]"
                  style={{ backgroundColor: '#ffffff', borderColor: COLORS.mist, color: COLORS.navy }}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: COLORS.navy }}>No. WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: COLORS.navy, opacity: 0.4 }} />
                <input
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm outline-none border focus:border-[#407E8C]"
                  style={{ backgroundColor: '#ffffff', borderColor: COLORS.mist, color: COLORS.navy }}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: COLORS.navy }}>Kota</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: COLORS.navy, opacity: 0.4 }} />
                <input
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm outline-none border focus:border-[#407E8C]"
                  style={{ backgroundColor: '#ffffff', borderColor: COLORS.mist, color: COLORS.navy }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Keamanan */}
        <div className="rounded-2xl p-6 sm:p-7" style={{ backgroundColor: '#ffffff', border: `1px solid ${COLORS.mist}` }}>
          <h3 className="text-base font-semibold mb-5" style={{ color: COLORS.navy }}>
            Keamanan Akun
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: COLORS.navy }}>Kata Sandi Baru</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: COLORS.navy, opacity: 0.4 }} />
                <input
                  type="password"
                  placeholder="Kosongkan jika tidak diubah"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm outline-none border focus:border-[#407E8C]"
                  style={{ backgroundColor: '#ffffff', borderColor: COLORS.mist, color: COLORS.navy }}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: COLORS.navy }}>Konfirmasi Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: COLORS.navy, opacity: 0.4 }} />
                <input
                  type="password"
                  placeholder="Ulangi kata sandi baru"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm outline-none border focus:border-[#407E8C]"
                  style={{ backgroundColor: '#ffffff', borderColor: COLORS.mist, color: COLORS.navy }}
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-full text-white hover:brightness-110 transition"
          style={{ backgroundColor: saved ? COLORS.teal : COLORS.navy }}
        >
          <CheckCircle2 size={16} /> {saved ? 'Perubahan Disimpan' : 'Simpan Perubahan'}
        </button>
      </form>
    </div>
  );
}