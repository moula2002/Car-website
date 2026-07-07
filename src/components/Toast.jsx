import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-8 right-8 z-[1000] flex flex-col gap-3">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  let icon = <Info size={18} className="text-blue-500" />;
  let borderClass = "border-l-4 border-blue-500";

  if (toast.type === "success") {
    icon = <CheckCircle2 size={18} className="text-emerald-500" />;
    borderClass = "border-l-4 border-emerald-500";
  } else if (toast.type === "error") {
    icon = <AlertCircle size={18} className="text-red-500" />;
    borderClass = "border-l-4 border-red-500";
  }

  return (
    <div className={`flex items-center gap-3 bg-white p-4 rounded-lg shadow-lg border border-slate-200 animate-slide-in-right min-w-[280px] max-w-sm ${borderClass}`}>
      {icon}
      <div className="text-sm font-medium text-slate-800">{toast.message}</div>
      <button
        onClick={onClose}
        className="ml-auto text-slate-400 hover:text-slate-600 cursor-pointer"
      >
        <X size={14} />
      </button>
    </div>
  );
}
