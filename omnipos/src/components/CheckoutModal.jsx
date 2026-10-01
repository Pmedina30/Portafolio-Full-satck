import React, { useState } from 'react';
import { 
  X, Banknote, CreditCard, ArrowRightLeft, Split, 
  CheckCircle2, DollarSign, Calculator, AlertCircle, 
  Printer, ShieldCheck 
} from 'lucide-react';

export default function CheckoutModal({
  isOpen,
  onClose,
  totals,
  selectedCustomer,
  invoiceType,
  cart,
  onProcessSale
}) {
  if (!isOpen) return null;

  const { total, subtotal, taxAmount, calculatedDiscount } = totals;

  const [paymentMethod, setPaymentMethod] = useState('EFECTIVO'); // EFECTIVO | TARJETA | TRANSFERENCIA | MIXTO
  const [cashTendered, setCashTendered] = useState(total.toString());
  const [cardAmount, setCardAmount] = useState('0');
  const [cardAuthCode, setCardAuthCode] = useState('');
  const [transferRef, setTransferRef] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Quick denominations
  const quickCashValues = [20, 50, 100, 200, 500, 1000];

  const cashNum = parseFloat(cashTendered) || 0;
  const cardNum = parseFloat(cardAmount) || 0;

  // Change calculation
  let changeDue = 0;
  let isUnderpaid = false;

  if (paymentMethod === 'EFECTIVO') {
    changeDue = Math.max(0, +(cashNum - total).toFixed(2));
    isUnderpaid = cashNum < total;
  } else if (paymentMethod === 'MIXTO') {
    const totalTendered = +(cashNum + cardNum).toFixed(2);
    changeDue = Math.max(0, +(totalTendered - total).toFixed(2));
    isUnderpaid = totalTendered < total;
  }

  const handleSelectQuickCash = (val) => {
    setCashTendered(val.toString());
  };

  const handleExactCash = () => {
    setCashTendered(total.toFixed(2));
  };

  const handleSubmitSale = () => {
    if (isUnderpaid) return;

    setIsProcessing(true);
    setTimeout(() => {
      onProcessSale({
        paymentMethod,
        cashPaid: paymentMethod === 'EFECTIVO' ? cashNum : paymentMethod === 'MIXTO' ? cashNum : 0,
        cardPaid: paymentMethod === 'TARJETA' ? total : paymentMethod === 'MIXTO' ? cardNum : 0,
        transferPaid: paymentMethod === 'TRANSFERENCIA' ? total : 0,
        changeGiven: changeDue,
        cardAuthCode,
        transferRef
      });
      setIsProcessing(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl macos-frosted border border-white/20 shadow-macos-window overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-apple-blue/20 border border-apple-blue/30 text-apple-blue flex items-center justify-center shadow-sm">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-sans">
                Terminal de Cobro & Emisión Fiscal
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Cliente: {selectedCustomer.name} • {invoiceType === 'CREDITO_FISCAL_B01' ? 'Crédito Fiscal (B01)' : 'Consumidor Final (B02)'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Total Payable Display */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-slate-400 block uppercase">Total Factura</span>
              <span className="text-3xl font-bold font-mono text-emerald-400">
                ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="text-right text-xs font-mono text-slate-400">
              <div>Subtotal: ${subtotal.toFixed(2)}</div>
              <div>ITBIS (18%): ${taxAmount.toFixed(2)}</div>
              {calculatedDiscount > 0 && <div className="text-apple-green">Desc: -${calculatedDiscount.toFixed(2)}</div>}
            </div>
          </div>

          {/* Payment Method Selector Pills */}
          <div>
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">
              Forma de Pago:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'EFECTIVO', label: 'Efectivo', icon: Banknote },
                { id: 'TARJETA', label: 'Tarjeta', icon: CreditCard },
                { id: 'TRANSFERENCIA', label: 'Transfer.', icon: ArrowRightLeft },
                { id: 'MIXTO', label: 'Mixto', icon: Split }
              ].map(m => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setPaymentMethod(m.id);
                      if (m.id === 'MIXTO') {
                        setCashTendered((total / 2).toFixed(2));
                        setCardAmount((total / 2).toFixed(2));
                      }
                    }}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-apple-blue text-white border-apple-blue shadow-sm'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-bold font-sans">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Specific Inputs */}
          {paymentMethod === 'EFECTIVO' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  Monto Recibido en Efectivo:
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-lg font-mono text-slate-400">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xl font-mono font-bold text-white outline-none focus:border-apple-blue"
                  />
                </div>
              </div>

              {/* Quick Cash Buttons */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={handleExactCash}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-apple-blue/20 text-apple-blue border border-apple-blue/40 hover:bg-apple-blue/30"
                >
                  Exacto (${total.toFixed(2)})
                </button>
                {quickCashValues.map(v => (
                  <button
                    key={v}
                    onClick={() => handleSelectQuickCash(v)}
                    className="px-3 py-1.5 rounded-xl text-xs font-mono bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10"
                  >
                    ${v}
                  </button>
                ))}
              </div>

              {/* Change calculation badge */}
              <div className={`p-3.5 rounded-2xl flex items-center justify-between border ${
                isUnderpaid
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              }`}>
                <div className="flex items-center gap-2 text-xs font-semibold">
                  {isUnderpaid ? <AlertCircle className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  <span>{isUnderpaid ? 'Monto Recibido Insuficiente' : 'Devuelta / Cambio a Entregar:'}</span>
                </div>
                <span className="text-xl font-bold font-mono">
                  ${changeDue.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {paymentMethod === 'TARJETA' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-slate-300 space-y-2">
                <div className="flex justify-between font-mono">
                  <span>Terminal POS Verifone / Ingenico:</span>
                  <span className="text-emerald-400 font-bold">CONECTADO</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Deslice o aproxime la tarjeta contactless en el datáfono externo.
                </p>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  Código de Autorización Voucher (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ej. AUTH-892401"
                  value={cardAuthCode}
                  onChange={(e) => setCardAuthCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs font-mono text-white outline-none focus:border-apple-blue"
                />
              </div>
            </div>
          )}

          {paymentMethod === 'TRANSFERENCIA' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  Número de Confirmación / Referencia Bancaria:
                </label>
                <input
                  type="text"
                  placeholder="Ej. BHD-TRF-992104"
                  value={transferRef}
                  onChange={(e) => setTransferRef(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs font-mono text-white outline-none focus:border-apple-blue"
                />
              </div>
            </div>
          )}

          {paymentMethod === 'MIXTO' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    Porción en Efectivo:
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-sm font-mono font-bold text-white outline-none focus:border-apple-blue"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    Porción en Tarjeta:
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={cardAmount}
                    onChange={(e) => setCardAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-sm font-mono font-bold text-white outline-none focus:border-apple-blue"
                  />
                </div>
              </div>

              <div className={`p-3 rounded-xl flex items-center justify-between text-xs font-mono border ${
                isUnderpaid ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              }`}>
                <span>Total Combinado: ${(cashNum + cardNum).toFixed(2)}</span>
                <span>{isUnderpaid ? `Falta: $${(total - (cashNum + cardNum)).toFixed(2)}` : `Cambio: $${changeDue.toFixed(2)}`}</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/40 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancelar
          </button>

          <button
            disabled={isUnderpaid || isProcessing}
            onClick={handleSubmitSale}
            className={`px-6 py-2.5 rounded-2xl text-xs font-bold font-sans flex items-center gap-2 shadow-lg transition-all active:scale-95 ${
              isUnderpaid || isProcessing
                ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                Registrando Transacción ACID...
              </span>
            ) : (
              <>
                <Printer className="w-4 h-4" />
                <span>CONFIRMAR & EMITIR FACTURA</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
