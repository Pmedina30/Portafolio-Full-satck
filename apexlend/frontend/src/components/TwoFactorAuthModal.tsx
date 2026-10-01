import React, { useState } from 'react';
import { KeyRound, ShieldAlert, X, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../utils/finance';

interface TwoFactorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  disbursementData: {
    clientName: string;
    amount: number;
    term: number;
  } | null;
}

const DEMO_OTP = '882194';

export const TwoFactorAuthModal: React.FC<TwoFactorAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  disbursementData,
}) => {
  const [otp, setOtp] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !disbursementData) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === DEMO_OTP) {
      onSuccess();
      setOtp('');
      setError(null);
      onClose();
    } else {
      setError('Código OTP inválido. Usa el código de prueba demo: 882194');
    }
  };

  const handleUseDemo = () => {
    setOtp(DEMO_OTP);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#ffffff] border border-[#d6d6d6] rounded-[28px] p-6 sm:p-8 shadow-none text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[#f5f5f7] border border-[#d6d6d6] flex items-center justify-center text-[#707070] hover:text-[#1d1d1f]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 border border-[#0071e3]/20 flex items-center justify-center text-[#0071e3]">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold tracking-tight-apple text-[#1d1d1f]">
              Verificación 2FA Requerida
            </h3>
            <span className="text-[11px] text-[#707070]">
              Desembolso de Alta Cuantía (&gt; $15,000 USD)
            </span>
          </div>
        </div>

        {/* Operation Info */}
        <div className="mt-5 p-4 rounded-[20px] bg-[#f5f5f7] border border-[#d6d6d6] text-[13px] space-y-1.5">
          <div className="flex justify-between">
            <span className="text-[#707070]">Beneficiario:</span>
            <span className="font-semibold text-[#1d1d1f]">{disbursementData.clientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#707070]">Monto a Desembolsar:</span>
            <span className="font-semibold text-[#0071e3]">{formatCurrency(disbursementData.amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#707070]">Plazo:</span>
            <span className="text-[#1d1d1f]">{disbursementData.term} Meses</span>
          </div>
        </div>

        {/* OTP Input Form */}
        <form onSubmit={handleVerify} className="mt-5 space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-[#707070] uppercase tracking-sub-apple mb-1.5">
              Código de Seguridad (6 dígitos)
            </label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="882194"
              className="w-full h-12 text-center tracking-[8px] font-mono text-xl font-semibold text-[#1d1d1f] bg-[#f5f5f7] border border-[#86868b] rounded-full outline-none focus:border-[#0071e3]"
            />
          </div>

          {error && (
            <p className="text-[12px] text-[#ff3b30] text-center font-medium">
              {error}
            </p>
          )}

          {/* Quick Demo Button */}
          <button
            type="button"
            onClick={handleUseDemo}
            className="w-full py-2 rounded-full text-[12px] font-medium bg-[#f5f5f7] hover:bg-[#e5e5e7] border border-[#d6d6d6] text-[#0071e3] transition-colors"
          >
            Usar Código Demo ({DEMO_OTP})
          </button>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-[13px] font-medium text-[#707070] hover:text-[#1d1d1f]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={otp.length !== 6}
              className="px-6 py-2.5 rounded-full text-[12px] font-semibold bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-40 text-white transition-all shadow-none"
            >
              Autorizar Desembolso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

