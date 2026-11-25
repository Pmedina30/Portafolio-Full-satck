import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

interface ToastProps {
  message: { id: string; text: string; type: 'success' | 'info' | 'warning' } | null;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  const getIcon = () => {
    switch (message.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-600 shrink-0" />;
    }
  };

  const getBorder = () => {
    switch (message.type) {
      case 'success':
        return 'border-emerald-200 bg-white text-slate-800 shadow-lg shadow-emerald-500/10';
      case 'warning':
        return 'border-amber-200 bg-white text-slate-800 shadow-lg shadow-amber-500/10';
      default:
        return 'border-blue-200 bg-white text-slate-800 shadow-lg shadow-blue-500/10';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-70 animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div
        className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-xs font-semibold ${getBorder()}`}
      >
        {getIcon()}
        <span>{message.text}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
