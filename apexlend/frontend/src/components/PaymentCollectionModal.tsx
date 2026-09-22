import React, { useState } from 'react';
import { X, CheckCircle2, DollarSign, CreditCard, ShieldCheck } from 'lucide-react';
import { ReceivableInstallment, UserRole } from '../types/apexlend';
import { formatCurrency, maskBankAccount, maskNationalId } from '../utils/finance';

interface PaymentCollectionModalProps {
  installment: ReceivableInstallment | null;
  isOpen: boolean;
  onClose: () => void;
  isMasked: boolean;
  role: UserRole;
  onConfirmPayment: (installmentId: string, method: string, waivedPenalty: boolean) => void;
}

export const PaymentCollectionModal: React.FC<PaymentCollectionModalProps> = ({
  installment,
  isOpen,
  onClose,
  isMasked,
  role,
  onConfirmPayment,
}) => {
  if (!isOpen || !installment) return null;

  const [paymentMethod, setPaymentMethod] = useState<string>('Transferencia ACH');
  const [waivePenalty, setWaivePenalty] = useState<boolean>(false);

  const isRiskCommittee = role === 'Comité de Riesgos';
  const finalAmount =
    installment.totalAmount - (waivePenalty ? installment.penaltyFee : 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmPayment(installment.id, paymentMethod, waivePenalty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      {/* Canonical Apple 28px Radius Card, Zero Shadows */}
      <div className="relative w-full max-w-lg bg-[#ffffff] border border-[#d6d6d6] rounded-[28px] p-6 sm:p-8 shadow-none text-left overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[#f5f5f7] border border-[#d6d6d6] flex items-center justify-center text-[#707070] hover:text-[#1d1d1f] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Eyebrow & Title */}
        <div>
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#0071e3] bg-[#0071e3]/10 px-2.5 py-0.5 rounded-full border border-[#0071e3]/20">
            Registro de Amortización
          </span>
          <h3 className="text-2xl font-semibold tracking-tight-apple text-[#1d1d1f] mt-2">
            Registrar Pago de Cuota
          </h3>
          <p className="text-[14px] text-[#707070] mt-0.5 tracking-sub-apple">
            {installment.id} • Préstamo {installment.loanId} (Cuota {installment.installmentNumber})
          </p>
        </div>

        {/* Client & Debt Info */}
        <div className="mt-6 p-4 rounded-[20px] bg-[#f5f5f7] border border-[#d6d6d6] space-y-2 text-[13px]">
          <div className="flex justify-between">
            <span className="text-[#707070]">Titular:</span>
            <span className="font-semibold text-[#1d1d1f]">{installment.clientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#707070]">Identificación:</span>
            <span className="font-medium text-[#1d1d1f]">{maskNationalId(installment.nationalId, isMasked)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#707070]">Cuenta de Débito:</span>
            <span className="font-medium text-[#1d1d1f]">{maskBankAccount(installment.bankAccount, isMasked)}</span>
          </div>
          <div className="pt-2 border-t border-[#d6d6d6] flex justify-between text-[14px] font-semibold">
            <span className="text-[#1d1d1f]">Monto a Recaudar:</span>
            <span className="text-[#0071e3]">{formatCurrency(finalAmount)}</span>
          </div>
        </div>

        {/* Form Controls */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-[#707070] uppercase tracking-sub-apple mb-1.5">
              Canal de Pago / Recaudación
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full h-11 px-4 text-[14px] font-medium text-[#1d1d1f] bg-[#f5f5f7] border border-[#86868b] rounded-full outline-none focus:border-[#0071e3]"
            >
              <option value="Transferencia ACH">Transferencia Bancaria ACH</option>
              <option value="Débito Automático en Cuenta">Débito Automático en Cuenta</option>
              <option value="Ventanilla / Depósito Directo">Ventanilla / Depósito Directo</option>
              <option value="Tarjeta de Débito Visa/Mastercard">Tarjeta de Débito</option>
            </select>
          </div>

          {/* Conditional Penalty Waive (Only for Risk Committee) */}
          {installment.penaltyFee > 0 && (
            <div className="p-3.5 rounded-[18px] bg-[#f5f5f7] border border-[#d6d6d6] flex items-center justify-between">
              <div>
                <span className="text-[13px] font-medium text-[#1d1d1f] block">
                  Condonar Recargo por Mora ({formatCurrency(installment.penaltyFee)})
                </span>
                <span className="text-[11px] text-[#707070]">
                  {isRiskCommittee
                    ? 'Autorizado por Comité de Riesgos'
                    : 'Requiere facultades del Comité de Riesgos'}
                </span>
              </div>
              <input
                type="checkbox"
                disabled={!isRiskCommittee}
                checked={waivePenalty}
                onChange={(e) => setWaivePenalty(e.target.checked)}
                className="w-4 h-4 accent-[#0071e3] rounded cursor-pointer disabled:opacity-30"
              />
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-[13px] font-medium text-[#707070] hover:text-[#1d1d1f] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-[12px] font-semibold bg-[#0071e3] hover:bg-[#0077ed] text-[#ffffff] transition-all flex items-center gap-1.5 shadow-none"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirmar y Amortizar Saldo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
