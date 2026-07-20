import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, title?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success', title?: string) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5);
    const newToast: ToastMessage = { id, type, title, message };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss after 3.5s
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast Floating Container Top-Right */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastItem({ toast, onClose }: { toast: ToastMessage; onClose: () => void }) {
  const variantStyles = {
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      icon: <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />,
      bar: 'bg-emerald-500',
    },
    info: {
      bg: 'bg-blue-50 border-blue-200 text-blue-900',
      icon: <Info size={18} className="text-blue-600 shrink-0" />,
      bar: 'bg-blue-500',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: <AlertTriangle size={18} className="text-amber-600 shrink-0" />,
      bar: 'bg-amber-500',
    },
    error: {
      bg: 'bg-red-50 border-red-200 text-red-900',
      icon: <XCircle size={18} className="text-red-600 shrink-0" />,
      bar: 'bg-red-500',
    },
  };

  const style = variantStyles[toast.type];

  return (
    <div className={`pointer-events-auto relative overflow-hidden rounded-2xl p-4 border shadow-lg backdrop-blur-md transition-all duration-300 ${style.bg}`}>
      <div className="flex items-start gap-3">
        {style.icon}
        <div className="flex-1 min-w-0">
          {toast.title && <h5 className="text-xs font-extrabold uppercase tracking-wide mb-0.5">{toast.title}</h5>}
          <p className="text-xs font-semibold leading-relaxed">{toast.message}</p>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-0.5 rounded-lg transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Progress Countdown Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5">
        <div className={`h-full ${style.bar} transition-all`} style={{ animation: 'shrink 3.5s linear forwards' }} />
      </div>
    </div>
  );
}
