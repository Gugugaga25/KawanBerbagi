import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SuccessPulseProps {
  show: boolean;
  message?: string;
  onFinish?: () => void;
}

export default function SuccessPulse({ show, message, onFinish }: SuccessPulseProps) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onFinish) onFinish();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [show, onFinish]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-2xs pointer-events-none">
      <div className="bg-white rounded-3xl p-6 shadow-2xl border border-emerald-100 flex flex-col items-center gap-3 text-center max-w-xs">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
          <CheckCircle2 size={32} />
        </div>
        {message && <p className="text-xs font-extrabold text-[#124354]">{message}</p>}
      </div>
    </div>
  );
}
