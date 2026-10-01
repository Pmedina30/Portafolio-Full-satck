import React, { useState } from 'react';
import { Shield, X, Hash, Link as LinkIcon, Search, CheckCircle2 } from 'lucide-react';
import { AuditLedgerBlock } from '../types/apexlend';

interface AuditLedgerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  ledger: AuditLedgerBlock[];
}

export const AuditLedgerDrawer: React.FC<AuditLedgerDrawerProps> = ({ isOpen, onClose, ledger }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!isOpen) return null;

  const filtered = ledger.filter(
    (b) =>
      b.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.loanId && b.loanId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm transition-all duration-200">
      <div className="w-full max-w-2xl bg-[#ffffff] border-l border-[#d6d6d6] h-full shadow-none flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-6 border-b border-[#d6d6d6] bg-[#f5f5f7] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ffffff] border border-[#d6d6d6] flex items-center justify-center text-[#1d1d1f]">
              <Shield className="w-5 h-5 text-[#0071e3]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[18px] font-semibold tracking-tight-apple text-[#1d1d1f]">
                  Audit Ledger Criptográfico
                </h3>
                <span className="text-[11px] font-medium text-[#28cd41] bg-[#28cd41]/10 border border-[#28cd41]/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  SHA-256 HASH CHAIN
                </span>
              </div>
              <p className="text-[13px] text-[#707070]">
                Registro inmutable de desembolsos, cobros de cuotas y cambios de riesgo.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#ffffff] border border-[#d6d6d6] flex items-center justify-center text-[#707070] hover:text-[#1d1d1f]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[#d6d6d6] bg-[#ffffff]">
          <div className="relative">
            <Search className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por actor, préstamo, acción o detalle..."
              className="w-full h-10 pl-10 pr-4 text-[13px] text-[#1d1d1f] bg-[#f5f5f7] border border-[#86868b] rounded-full outline-none focus:border-[#0071e3]"
            />
          </div>
        </div>

        {/* Entries List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-[#707070] text-[14px]">
              No se encontraron bloques de auditoría que coincidan con la búsqueda.
            </div>
          ) : (
            filtered.map((block) => (
              <div
                key={block.id}
                className="p-5 rounded-[22px] bg-[#f5f5f7] border border-[#d6d6d6] space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#d6d6d6]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[12px] font-semibold text-[#1d1d1f]">
                      {block.id}
                    </span>
                    <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-[#0071e3]/10 text-[#0071e3] border border-[#0071e3]/20">
                      {block.action}
                    </span>
                    {block.loanId && (
                      <span className="text-[11px] font-mono text-[#707070]">
                        {block.loanId}
                      </span>
                    )}
                  </div>
                  <span className="text-[12px] text-[#707070] font-mono">
                    {block.timestamp.replace('T', ' ').slice(0, 19)}
                  </span>
                </div>

                <div className="text-[13px] text-[#1d1d1f]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#707070]">Actor:</span>
                    <span className="font-semibold">{block.actor}</span>
                    <span className="text-[11px] bg-[#ffffff] border border-[#d6d6d6] px-2 py-0.2 rounded-full text-[#707070]">
                      {block.role}
                    </span>
                  </div>
                  <p className="mt-1 text-[#1d1d1f] font-normal leading-relaxed">
                    {block.details}
                  </p>
                </div>

                {/* Hashes */}
                <div className="pt-2 border-t border-[#d6d6d6] space-y-1 text-[11px] font-mono text-[#707070]">
                  <div className="flex items-center gap-1 truncate">
                    <LinkIcon className="w-3 h-3 flex-shrink-0" />
                    <span>Prev: {block.previousHash}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#0071e3] truncate">
                    <Hash className="w-3 h-3 flex-shrink-0" />
                    <span className="font-semibold">SHA-256: {block.hash}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#d6d6d6] bg-[#f5f5f7] flex items-center justify-between text-[13px] text-[#707070]">
          <span>{ledger.length} bloques inmutables firmados</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full text-[12px] font-medium bg-[#ffffff] border border-[#d6d6d6] text-[#1d1d1f] hover:bg-[#e5e5e7]"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

