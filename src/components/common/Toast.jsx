import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-teal-500 shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-emerald-200 bg-emerald-50/90 text-emerald-950';
      case 'error':
        return 'border-rose-200 bg-rose-50/90 text-rose-950';
      case 'warning':
        return 'border-amber-200 bg-amber-50/90 text-amber-950';
      case 'info':
      default:
        return 'border-teal-200 bg-teal-50/90 text-teal-950';
    }
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-sm transition-all duration-300 animate-slide-in ${getBorderColor()}`}
      role="alert"
    >
      {getIcon()}
      <div className="flex-1 text-xs sm:text-sm">
        {toast.title && <p className="font-semibold text-slate-900">{toast.title}</p>}
        <p className="text-slate-600 mt-0.5 leading-snug">{toast.message}</p>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
