import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Package,
  CheckCircle2,
  Clock,
  X,
  ChevronRight,
  Inbox,
} from 'lucide-react';

const COLORS = {
  navy: '#083A4F',
  teal: '#407E8C',
  mist: '#C0D5D6',
  gold: '#A58D66',
};

interface Notif {
  id: number;
  type: string;    // status_update | thank_you | resi_reminder
  title: string;
  body: string;
  data: { id_donation?: number } | null;
  is_read: boolean;
  created_at: string;
}

function NotifIcon({ type }: { type: string }) {
  if (type === 'thank_you') return <CheckCircle2 size={16} className="text-emerald-500" />;
  if (type === 'resi_reminder') return <Clock size={16} className="text-amber-500" />;
  return <Package size={16} className="text-blue-500" />;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notif[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Fetch notifikasi dari API
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/donatur/notifications', {
        headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      });
      const data = await res.json();
      setNotifications(data.notifications ?? []);
      setUnread(data.unread ?? 0);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  // Tandai satu notifikasi sudah dibaca
  const markRead = async (notif: Notif) => {
    if (notif.is_read) {
      if (notif.data?.id_donation) {
        window.location.href = `/donasi/${notif.data.id_donation}`;
      }
      return;
    }

    try {
      const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '';
      await fetch(`/donatur/notifications/${notif.id}/read`, {
        method: 'PATCH',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      // Update state lokal
      setNotifications(prev =>
        prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n)
      );
      setUnread(prev => Math.max(0, prev - 1));
    } catch {
      // ignore
    }

    if (notif.data?.id_donation) {
      window.location.href = `/donasi/${notif.data.id_donation}`;
    }
  };

  // Fetch saat pertama mount + polling setiap 30 detik
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch saat dropdown dibuka
  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-xl transition-colors hover:bg-gray-50"
        style={{ color: unread > 0 ? COLORS.navy : '#9CA3AF' }}
      >
        <Bell size={20} />
        {unread > 0 && (
          <span
            className="absolute top-1.5 right-1.5 min-w-[16px] h-4 rounded-full flex items-center justify-center text-[9px] font-extrabold text-white shadow-sm px-0.5"
            style={{ backgroundColor: '#EF4444' }}
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          className="absolute right-0 top-[calc(100%+8px)] w-80 rounded-2xl shadow-2xl border bg-white overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
          style={{ borderColor: COLORS.mist }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: `${COLORS.mist}80` }}>
            <div className="flex items-center gap-2">
              <Bell size={15} style={{ color: COLORS.navy }} />
              <h3 className="text-sm font-extrabold" style={{ color: COLORS.navy }}>
                Notifikasi
              </h3>
              {unread > 0 && (
                <span
                  className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: COLORS.teal }}
                >
                  {unread} baru
                </span>
              )}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
            >
              <X size={14} />
            </button>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {loading && notifications.length === 0 ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-5 h-5 border-2 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                <Inbox size={32} className="mb-2 opacity-20" style={{ color: COLORS.navy }} />
                <p className="text-xs font-semibold opacity-40" style={{ color: COLORS.navy }}>
                  Belum ada notifikasi
                </p>
              </div>
            ) : (
              notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => markRead(n)}
                  className={`w-full text-left flex items-start gap-3 px-4 py-3.5 transition-colors ${
                    n.is_read ? 'bg-white hover:bg-gray-50/60' : 'bg-blue-50/40 hover:bg-blue-50'
                  }`}
                >
                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    n.type === 'thank_you'    ? 'bg-emerald-100' :
                    n.type === 'resi_reminder' ? 'bg-amber-100' : 'bg-blue-100'
                  }`}>
                    <NotifIcon type={n.type} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-xs leading-snug ${n.is_read ? 'font-semibold text-gray-600' : 'font-extrabold text-[#083A4F]'}`}>
                        {n.title}
                      </p>
                      {!n.is_read && (
                        <div className="w-2 h-2 rounded-full shrink-0 mt-1" style={{ backgroundColor: COLORS.teal }} />
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {n.body}
                    </p>
                    <p className="text-[10px] mt-1 font-medium" style={{ color: COLORS.teal, opacity: 0.7 }}>
                      {n.created_at}
                    </p>
                  </div>

                  {n.data?.id_donation && (
                    <ChevronRight size={13} className="shrink-0 mt-1 text-gray-300" />
                  )}
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t text-center" style={{ borderColor: `${COLORS.mist}80` }}>
              <p className="text-[10px] font-semibold text-gray-400">
                Menampilkan {notifications.length} notifikasi terbaru
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
