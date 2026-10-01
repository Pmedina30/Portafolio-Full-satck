import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, ArrowDownRight, ArrowUpRight, Wifi, WifiOff, RefreshCw, X, ShieldAlert } from 'lucide-react';

export default function DynamicIsland({ notification, onDismiss }) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsExpanded(true);
      const timer = setTimeout(() => {
        setIsExpanded(false);
        setTimeout(() => {
          if (onDismiss) onDismiss();
        }, 300);
      }, notification.duration || 4500);
      return () => clearTimeout(timer);
    } else {
      setIsExpanded(false);
    }
  }, [notification]);

  if (!notification && !isExpanded) {
    return (
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto">
        <div className="h-7 px-4 rounded-full dynamic-island-pill flex items-center gap-2 text-[11px] font-mono text-slate-400 hover:text-white transition-all cursor-default shadow-dynamic-island">
          <span className="w-2 h-2 rounded-full bg-apple-green animate-pulse" />
          <span>OmniPOS Command • Online</span>
        </div>
      </div>
    );
  }

  const { type = 'success', title, message, amount } = notification || {};

  return (
    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto transition-all duration-300 ease-out">
      <div 
        className={`rounded-[26px] dynamic-island-pill px-5 py-3 transition-all duration-300 shadow-dynamic-island border border-white/20 flex items-center gap-4 ${
          isExpanded ? 'min-w-[340px] max-w-[460px] scale-100 opacity-100' : 'w-24 h-7 scale-95 opacity-0'
        }`}
      >
        {/* Dynamic Icon */}
        <div className="shrink-0">
          {type === 'success' && (
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          )}
          {type === 'warning' && (
            <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
          )}
          {type === 'cash-in' && (
            <div className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          )}
          {type === 'cash-out' && (
            <div className="w-9 h-9 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          )}
          {type === 'offline' && (
            <div className="w-9 h-9 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center animate-pulse">
              <WifiOff className="w-5 h-5" />
            </div>
          )}
          {type === 'sync' && (
            <div className="w-9 h-9 rounded-full bg-apple-blue/20 border border-apple-blue/40 text-apple-blue flex items-center justify-center animate-spin duration-1000">
              <RefreshCw className="w-5 h-5" />
            </div>
          )}
          {type === 'security' && (
            <div className="w-9 h-9 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs font-bold text-white tracking-wide truncate font-sans">
              {title}
            </h4>
            {amount && (
              <span className="text-xs font-mono font-bold text-emerald-400 shrink-0">
                {amount}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-300 font-mono mt-0.5 truncate">
            {message}
          </p>
        </div>

        {/* Quick Close Button */}
        <button
          onClick={() => {
            setIsExpanded(false);
            if (onDismiss) onDismiss();
          }}
          className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
