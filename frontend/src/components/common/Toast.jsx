import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    danger: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-white text-slate-800',
    danger: 'border-rose-200 bg-white text-slate-800',
    warning: 'border-amber-200 bg-white text-slate-800',
    info: 'border-blue-200 bg-white text-slate-800',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-in max-w-sm w-full">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl ${borders[toast.type] || borders.info}`}
      >
        {icons[toast.type] || icons.info}
        <div className="flex-1 text-xs font-medium leading-relaxed">{toast.message}</div>
      </div>
    </div>
  );
};

export default Toast;
