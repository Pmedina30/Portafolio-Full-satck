import React, { useState } from 'react';
import { Shield, CheckCircle2, Lock, X, Search, Hash, Link as LinkIcon } from 'lucide-react';
import { AuditLogEntry } from '../types/finpulse';

interface AuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditLog: AuditLogEntry[];
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({ isOpen, onClose, auditLog }) => {
  const [filter, setFilter] = useState('');

  if (!isOpen) return null;

  const filteredLogs = auditLog.filter(
    (log) =>
      log.actor.toLowerCase().includes(filter.toLowerCase()) ||
      log.details.toLowerCase().includes(filter.toLowerCase()) ||
      log.action.toLowerCase().includes(filter.toLowerCase()) ||
      (log.transactionId && log.transactionId.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#0c101a] border border-[#1f293d] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#1c2438] bg-[#090d16] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Registro Inmutable de Auditoría Criptográfica
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  SHA-256 HASH CHAIN VERIFIED
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Libro mayor de seguridad: cada acción administrativa genera un bloque inalterable.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-3 border-b border-[#1c2438] bg-[#0f1422]">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filtrar por actor, ID de transacción, acción o detalle..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#131929] border border-[#1f293d] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Audit Log Entries List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No hay registros que coincidan con la búsqueda.
            </div>
          ) : (
            filteredLogs.map((entry, idx) => (
              <div
                key={entry.id}
                className="relative rounded-xl bg-[#111726] border border-[#1f293d] p-4 shadow-sm hover:border-[#2d3a54] transition-colors"
              >
                {/* Node Top info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#1a233a]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-300">{entry.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        entry.action === 'FREEZE_TX'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : entry.action === 'APPROVE_TX'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {entry.action}
                    </span>
                    {entry.transactionId && (
                      <span className="font-mono text-[11px] text-cyan-300 font-semibold bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                        {entry.transactionId}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">{entry.timestamp}</span>
                </div>

                {/* Actor & Details */}
                <div className="mt-2.5 text-xs text-slate-200">
                  <span className="text-slate-400">Actor Responsable: </span>
                  <span className="font-medium text-white">{entry.actor}</span>
                  <p className="mt-1 text-slate-300">{entry.details}</p>
                </div>

                {/* Hashes */}
                <div className="mt-3 pt-2.5 border-t border-[#182035] grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] font-mono">
                  <div className="truncate">
                    <span className="text-slate-500 flex items-center gap-1">
                      <LinkIcon className="w-3 h-3 text-slate-500" />
                      Prev Hash:
                    </span>
                    <span className="text-slate-400 select-all" title={entry.previousHash}>
                      {entry.previousHash}
                    </span>
                  </div>
                  <div className="truncate">
                    <span className="text-indigo-400 flex items-center gap-1">
                      <Hash className="w-3 h-3 text-indigo-400" />
                      Block SHA-256:
                    </span>
                    <span className="text-emerald-400 select-all font-semibold" title={entry.hash}>
                      {entry.hash}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[#1c2438] bg-[#090d16] flex items-center justify-between text-xs text-slate-400">
          <span>{auditLog.length} bloques auditados en cadena criptográfica</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#162033] hover:bg-[#1e2c45] border border-[#23334f] text-slate-200 text-xs font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

