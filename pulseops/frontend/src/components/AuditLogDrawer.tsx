'use client';

import React from 'react';
import { X, ShieldAlert, History, Filter, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { AuditLogEntry } from '../types/pulseops';

interface AuditLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AuditLogEntry[];
}

export const AuditLogDrawer: React.FC<AuditLogDrawerProps> = ({ isOpen, onClose, logs }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative h-full w-full max-w-md border-l border-zinc-800 bg-zinc-950 p-6 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <History className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                Audit Trail & Security Logs
              </h2>
              <p className="text-[11px] text-zinc-500">
                Registro inmutable de trazabilidad de operaciones y RBAC
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Counter Summary */}
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 mb-4 text-xs font-mono">
          <span className="text-zinc-400">Eventos registrados:</span>
          <span className="text-emerald-400 font-bold">{logs.length}</span>
        </div>

        {/* Audit Log Entries Scrollable */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900/80 transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                    log.severity === 'danger'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : log.severity === 'warning'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                  }`}
                >
                  {log.action}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>

              <p className="text-zinc-300 text-[11px] leading-relaxed">{log.details}</p>

              <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-800/50">
                <span className="font-mono">Actor: {log.actor}</span>
                <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">
                  {log.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
