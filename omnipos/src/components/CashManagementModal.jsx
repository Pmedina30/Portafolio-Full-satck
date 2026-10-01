import React, { useState } from 'react';
import { 
  X, DollarSign, ArrowDownRight, ArrowUpRight, Lock, 
  Unlock, AlertCircle, CheckCircle2, FileSpreadsheet, 
  ShieldCheck, Calculator, Clock 
} from 'lucide-react';

export default function CashManagementModal({
  isOpen,
  onClose,
  cashRegister,
  onCashMovement,
  onCloseShift
}) {
  if (!isOpen || !cashRegister) return null;

  const [activeTab, setActiveTab] = useState('summary'); // summary | movement | close-corte-z
  
  // Movement form state
  const [movementType, setMovementType] = useState('ENTRADA_AJUSTE'); // ENTRADA_AJUSTE | RETIRO_JUSTIFICADO
  const [movementAmount, setMovementAmount] = useState('');
  const [justification, setJustification] = useState('');

  // Corte Z state
  const [countedCash, setCountedCash] = useState('');
  const [closureNotes, setClosureNotes] = useState('');
  const [supervisorPin, setSupervisorPin] = useState('');

  // Calculate Expected Cash
  const openingFloat = cashRegister.openingFloat || 250;
  
  const cashSalesTotal = cashRegister.transactions
    .filter(t => t.type === 'VENTA_EFECTIVO')
    .reduce((sum, t) => sum + t.amount, 0);

  const cashInTotal = cashRegister.transactions
    .filter(t => t.type === 'ENTRADA_AJUSTE')
    .reduce((sum, t) => sum + t.amount, 0);

  const cashOutTotal = cashRegister.transactions
    .filter(t => t.type === 'RETIRO_JUSTIFICADO')
    .reduce((sum, t) => sum + t.amount, 0);

  const expectedCash = +(openingFloat + cashSalesTotal + cashInTotal - cashOutTotal).toFixed(2);

  // Discrepancy in Corte Z
  const countedNum = parseFloat(countedCash) || 0;
  const discrepancy = +(countedNum - expectedCash).toFixed(2);

  const handleSaveMovement = (e) => {
    e.preventDefault();
    const amt = parseFloat(movementAmount) || 0;
    if (amt <= 0 || !justification.trim()) return;

    onCashMovement({
      type: movementType,
      amount: amt,
      justification
    });

    setMovementAmount('');
    setJustification('');
    setActiveTab('summary');
  };

  const handleExecuteCorteZ = (e) => {
    e.preventDefault();
    if (!countedCash) return;

    onCloseShift({
      expectedCash,
      actualCash: countedNum,
      discrepancy,
      closureNotes,
      supervisorPin
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl macos-frosted border border-white/20 shadow-macos-window overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-sm">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-sans">
                Control y Cuadre de Caja Registradora
              </h3>
              <p className="text-xs font-mono text-slate-400">
                {cashRegister.terminalName} • Turno Abierto a las {new Date(cashRegister.openedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-black/40 p-1 border border-white/10">
              <button
                onClick={() => setActiveTab('summary')}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                  activeTab === 'summary' ? 'bg-apple-blue text-white font-bold' : 'text-slate-400'
                }`}
              >
                Corte X (En Vivo)
              </button>
              <button
                onClick={() => setActiveTab('movement')}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                  activeTab === 'movement' ? 'bg-apple-blue text-white font-bold' : 'text-slate-400'
                }`}
              >
                Entrada / Retiro
              </button>
              <button
                onClick={() => setActiveTab('close-corte-z')}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                  activeTab === 'close-corte-z' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400'
                }`}
              >
                Cierre (Corte Z)
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto">
          
          {/* Tab 1: Corte X Summary */}
          {activeTab === 'summary' && (
            <div className="space-y-5">
              
              {/* Main Cash In Drawer Metric Box */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                    Dinero Esperado en Gaveta (Corte X)
                  </span>
                  <span className="text-3xl font-bold font-mono text-emerald-400 mt-1 block">
                    ${expectedCash.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-xs flex items-center gap-1.5">
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Caja Abierta y Activa</span>
                </div>
              </div>

              {/* Breakdown Cards */}
              <div className="grid grid-cols-4 gap-2.5 text-xs font-mono">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-slate-400 block text-[10px]">Fondo Inicial</span>
                  <span className="text-sm font-bold text-white mt-0.5 block">${openingFloat.toFixed(2)}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-slate-400 block text-[10px]">Ventas Efectivo</span>
                  <span className="text-sm font-bold text-apple-green mt-0.5 block">+${cashSalesTotal.toFixed(2)}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-slate-400 block text-[10px]">Entradas Extra</span>
                  <span className="text-sm font-bold text-apple-blue mt-0.5 block">+${cashInTotal.toFixed(2)}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-slate-400 block text-[10px]">Retiros / Gastos</span>
                  <span className="text-sm font-bold text-rose-400 mt-0.5 block">-${cashOutTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Transactions Log Table */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Registro de Movimientos del Turno
                </h4>
                <div className="rounded-2xl bg-black/30 border border-white/10 overflow-hidden divide-y divide-white/5 font-mono text-xs">
                  {cashRegister.transactions.map((tx) => (
                    <div key={tx.id} className="p-3 flex items-center justify-between hover:bg-white/[0.02]">
                      <div className="flex items-center gap-2.5">
                        {tx.type === 'RETIRO_JUSTIFICADO' ? (
                          <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                            <ArrowUpRight className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <ArrowDownRight className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <div className="text-white font-medium font-sans">{tx.justification}</div>
                          <div className="text-[10px] text-slate-500">{tx.timestamp} • {tx.type}</div>
                        </div>
                      </div>
                      <span className={`font-bold ${
                        tx.type === 'RETIRO_JUSTIFICADO' ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        {tx.type === 'RETIRO_JUSTIFICADO' ? '-' : '+'}${tx.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Quick Cash Movement */}
          {activeTab === 'movement' && (
            <form onSubmit={handleSaveMovement} className="max-w-md mx-auto space-y-4">
              <div className="flex rounded-xl bg-black/40 p-1 border border-white/10">
                <button
                  type="button"
                  onClick={() => setMovementType('ENTRADA_AJUSTE')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    movementType === 'ENTRADA_AJUSTE' ? 'bg-apple-blue text-white shadow-sm' : 'text-slate-400'
                  }`}
                >
                  <ArrowDownRight className="w-4 h-4" />
                  <span>Entrada de Efectivo (+)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMovementType('RETIRO_JUSTIFICADO')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    movementType === 'RETIRO_JUSTIFICADO' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-400'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Retiro Justificado (-)</span>
                </button>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Monto en Efectivo ($):</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={movementAmount}
                  onChange={(e) => setMovementAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-lg font-mono font-bold text-white outline-none focus:border-apple-blue"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Justificación o Motivo Obligatorio:</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ej. Cambio de billetes en banco, pago de delivery de insumos, etc."
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/50 border border-white/15 text-xs font-sans text-white outline-none focus:border-apple-blue"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-xs font-bold bg-apple-blue hover:bg-blue-600 text-white shadow-md transition-all"
              >
                Confirmar Movimiento en Cajón
              </button>
            </form>
          )}

          {/* Tab 3: Corte Z Shift Closure */}
          {activeTab === 'close-corte-z' && (
            <form onSubmit={handleExecuteCorteZ} className="max-w-md mx-auto space-y-4">
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200">
                <strong>Arqueo y Cierre Definitivo (Corte Z):</strong> Este proceso consolida las ventas del turno, calcula discrepancias y bloquea la emisión de ventas hasta la próxima apertura.
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Total Esperado por Sistema:</span>
                <span className="font-bold text-white text-sm">${expectedCash.toFixed(2)}</span>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  Efectivo Físico Contado en Gaveta ($):
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={countedCash}
                  onChange={(e) => setCountedCash(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-lg font-mono font-bold text-white outline-none focus:border-rose-500"
                />
              </div>

              {countedCash && (
                <div className={`p-3 rounded-xl flex items-center justify-between text-xs font-mono border ${
                  discrepancy === 0 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' :
                  discrepancy > 0 ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' :
                  'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}>
                  <span className="font-semibold">
                    {discrepancy === 0 ? 'Cuadre Perfecto (Sin discrepancias)' : discrepancy > 0 ? 'Sobrante de Caja:' : 'Faltante de Caja:'}
                  </span>
                  <span className="text-base font-bold">
                    {discrepancy > 0 ? `+$${discrepancy.toFixed(2)}` : `$${discrepancy.toFixed(2)}`}
                  </span>
                </div>
              )}

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Notas u Observaciones del Cierre:</label>
                <textarea
                  rows={2}
                  value={closureNotes}
                  onChange={(e) => setClosureNotes(e.target.value)}
                  placeholder="Observaciones para contabilidad o supervisor..."
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">PIN del Supervisor (Requerido para autorizar):</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  placeholder="****"
                  value={supervisorPin}
                  onChange={(e) => setSupervisorPin(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-black/50 border border-white/15 text-sm font-mono text-white text-center tracking-widest outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Lock className="w-4 h-4" />
                <span>EJECUTAR CORTE Z & CERRAR TURNO</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
