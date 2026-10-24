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
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
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
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const bgStyle = 
    toast.type === 'success' 
      ? 'bg-[#86E3CE] text-slate-950' 
      : toast.type === 'error'
      ? 'bg-[#FF7E67] text-white'
      : 'bg-[#FFE853] text-slate-950';

  return (
    <div className={`pointer-events-auto flex items-center justify-between gap-3 p-3 px-4 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_#18181b] text-xs font-black uppercase tracking-tight ${bgStyle} animate-slideLeft`}>
      <div className="flex items-center gap-2.5 min-w-0">
        {toast.type === 'success' && <CheckCircle2 size={16} className="shrink-0 stroke-[2.5]" />}
        {toast.type === 'error' && <AlertCircle size={16} className="shrink-0 stroke-[2.5]" />}
        {toast.type === 'info' && <Info size={16} className="shrink-0 stroke-[2.5]" />}
        <span className="truncate">{toast.text}</span>
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 hover:bg-black/10 rounded-lg shrink-0 transition-colors"
      >
        <X size={14} className="stroke-[2.5]" />
      </button>
    </div>
  );
};
