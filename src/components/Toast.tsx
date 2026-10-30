import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-3 sm:top-4 right-3 sm:right-6 z-[70] flex flex-col gap-2 pointer-events-none max-w-xs sm:max-w-sm w-auto">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 2800);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const bgStyle = 
    toast.type === 'success' 
      ? 'bg-[#86E3CE] text-slate-950' 
      : toast.type === 'error'
      ? 'bg-[#FF7E67] text-white'
      : 'bg-[#FFE853] text-slate-950';

  return (
    <div className={`pointer-events-auto flex items-center justify-between gap-2.5 p-2.5 px-3.5 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_#18181b] text-xs font-black tracking-tight ${bgStyle} animate-slideLeft`}>
      <div className="flex items-center gap-2 min-w-0">
        {toast.type === 'success' && <CheckCircle2 size={15} className="shrink-0 stroke-[2.5]" />}
        {toast.type === 'error' && <AlertCircle size={15} className="shrink-0 stroke-[2.5]" />}
        {toast.type === 'info' && <Info size={15} className="shrink-0 stroke-[2.5]" />}
        <span className="truncate">{toast.text}</span>
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 hover:bg-black/10 rounded-lg shrink-0 transition-colors ml-1"
        aria-label="Tutup notifikasi"
      >
        <X size={13} className="stroke-[2.5]" />
      </button>
    </div>
  );
};
