import React, { useState } from 'react';
import { Lock, Unlock, KeyRound, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { DEMO_PIN } from '../utils/cryptoSecurity';

interface SecurityPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SecurityPinModal: React.FC<SecurityPinModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setError(null);
      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  const verifyPin = (enteredPin: string) => {
    if (enteredPin === DEMO_PIN) {
      onSuccess();
      setPin('');
      setError(null);
      onClose();
    } else {
      setError('PIN de autorización incorrecto. Intenta con el PIN Demo: 4492');
      setPin('');
    }
  };

  const handleUseDemo = () => {
    setPin(DEMO_PIN);
    verifyPin(DEMO_PIN);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm rounded-2xl bg-[#0c101a] border border-[#1f293d] p-6 shadow-2xl text-center">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
          <KeyRound className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-white tracking-tight">
          Autenticación Criptográfica
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Ingresa el PIN de auditoría para desencriptar montos confidenciales y números de cuenta.
        </p>

        {/* PIN Indicators */}
        <div className="my-5 flex justify-center gap-3">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-3.5 h-3.5 rounded-full border transition-all ${
                pin.length > index
                  ? 'bg-amber-400 border-amber-300 scale-110 shadow-lg shadow-amber-500/40'
                  : 'bg-slate-800 border-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-center gap-1.5 animate-shake">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleDigit(num)}
              className="py-3 rounded-xl bg-[#131929] hover:bg-[#1c2438] border border-[#1f293d] font-mono text-base font-semibold text-slate-200 active:scale-95 transition-all"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => setPin('')}
            className="py-3 rounded-xl bg-[#131929] hover:bg-[#1c2438] border border-[#1f293d] text-xs text-slate-400 active:scale-95 transition-all"
          >
            Limpiar
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="py-3 rounded-xl bg-[#131929] hover:bg-[#1c2438] border border-[#1f293d] font-mono text-base font-semibold text-slate-200 active:scale-95 transition-all"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="py-3 rounded-xl bg-[#131929] hover:bg-[#1c2438] border border-[#1f293d] text-xs text-slate-400 active:scale-95 transition-all"
          >
            Borrar
          </button>
        </div>

        {/* 1-Click Demo Shortcut */}
        <div className="mt-5 pt-4 border-t border-[#1c2438]">
          <button
            onClick={handleUseDemo}
            className="w-full py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Usar PIN Demo de Auditor ({DEMO_PIN})</span>
          </button>
        </div>
      </div>
    </div>
  );
};

