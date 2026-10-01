import React from 'react';
import { Shield, Eye, EyeOff, KeyRound, Lock, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../types/apexlend';

interface AppleHeaderProps {
  role: UserRole;
  onRoleChange: (newRole: UserRole) => void;
  isMasked: boolean;
  onToggleMask: () => void;
  onOpenLedger: () => void;
  ledgerCount: number;
}

export const AppleHeader: React.FC<AppleHeaderProps> = ({
  role,
  onRoleChange,
  isMasked,
  onToggleMask,
  onOpenLedger,
  ledgerCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#ffffff]/90 backdrop-blur-md border-b border-[#d6d6d6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Product Name */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1d1d1f] flex items-center justify-center text-white font-semibold text-sm">
            
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[17px] text-[#1d1d1f] tracking-sub-apple">
                ApexLend
              </span>
              <span className="text-[11px] font-medium text-[#707070] bg-[#f5f5f7] border border-[#d6d6d6] px-2 py-0.5 rounded-full">
                White Gallery Edition
              </span>
            </div>
          </div>
        </div>

        {/* Center: RBAC Role Selector Pills */}
        <div className="hidden md:flex items-center bg-[#f5f5f7] border border-[#d6d6d6] rounded-full p-0.5">
          {(['Oficial de Crédito', 'Comité de Riesgos', 'Auditor'] as UserRole[]).map((r) => {
            const isSelected = role === r;
            return (
              <button
                key={r}
                onClick={() => onRoleChange(r)}
                className={`px-3.5 py-1 text-[12px] font-medium rounded-full transition-all duration-150 ${
                  isSelected
                    ? 'bg-[#ffffff] text-[#1d1d1f] border border-[#d6d6d6]'
                    : 'text-[#707070] hover:text-[#1d1d1f]'
                }`}
              >
                {r}
              </button>
            );
          })}
        </div>

        {/* Right Actions: Masking & Audit Ledger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role selector dropdown for mobile */}
          <div className="md:hidden">
            <select
              value={role}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="text-[12px] bg-[#f5f5f7] border border-[#d6d6d6] rounded-full px-2.5 py-1 text-[#1d1d1f] outline-none"
            >
              <option value="Oficial de Crédito">Oficial de Crédito</option>
              <option value="Comité de Riesgos">Comité de Riesgos</option>
              <option value="Auditor">Auditor</option>
            </select>
          </div>

          {/* PII Masking Toggle */}
          <button
            onClick={onToggleMask}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
              isMasked
                ? 'bg-[#f5f5f7] border-[#d6d6d6] text-[#1d1d1f] hover:bg-[#e5e5e7]'
                : 'bg-[#0071e3]/10 border-[#0071e3]/30 text-[#0071e3]'
            }`}
            title={isMasked ? 'PII Enmascarada: Ocultando DNI y Cuentas' : 'PII en Claro Visible'}
          >
            {isMasked ? <EyeOff className="w-3.5 h-3.5 text-[#707070]" /> : <Eye className="w-3.5 h-3.5 text-[#0071e3]" />}
            <span>{isMasked ? 'PII Protegida' : 'PII Visible'}</span>
          </button>

          {/* Audit Ledger */}
          <button
            onClick={onOpenLedger}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium bg-[#f5f5f7] hover:bg-[#e5e5e7] border border-[#d6d6d6] text-[#1d1d1f] transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-[#707070]" />
            <span className="hidden sm:inline">Ledger SHA-256</span>
            <span className="bg-[#1d1d1f] text-white text-[10px] font-mono px-1.5 py-0.2 rounded-full">
              {ledgerCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

