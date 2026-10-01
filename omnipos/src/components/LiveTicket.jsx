import React, { useState } from 'react';
import { 
  Trash2, Plus, Minus, User, Receipt, Percent, 
  Tag, Shield, Barcode, ChevronRight, CreditCard, 
  DollarSign, Delete, ArrowRight, CheckCircle2 
} from 'lucide-react';
import { INITIAL_CUSTOMERS } from '../data/initialData';

export default function LiveTicket({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  selectedCustomer,
  setSelectedCustomer,
  invoiceType,
  setInvoiceType,
  discount,
  setDiscount,
  onOpenCheckout,
  onAssignSerial
}) {
  const [showKeypad, setShowKeypad] = useState(false);
  const [keypadValue, setKeypadValue] = useState('');
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discountInput, setDiscountInput] = useState('0');
  const [discountType, setDiscountType] = useState('percent'); // percent | fixed

  // Calculate Totals
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  let calculatedDiscount = 0;
  if (discount.type === 'percent') {
    calculatedDiscount = subtotal * (discount.value / 100);
  } else {
    calculatedDiscount = Math.min(subtotal, discount.value);
  }

  const taxableBase = Math.max(0, subtotal - calculatedDiscount);
  const taxRate = 0.18; // 18% ITBIS
  const taxAmount = +(taxableBase * taxRate).toFixed(2);
  const total = +(taxableBase + taxAmount).toFixed(2);

  const handleKeypadPress = (val) => {
    if (val === 'C') {
      setKeypadValue('');
    } else if (val === 'DEL') {
      setKeypadValue(prev => prev.slice(0, -1));
    } else {
      setKeypadValue(prev => prev + val);
    }
  };

  const handleApplyDiscount = () => {
    const val = parseFloat(discountInput) || 0;
    setDiscount({ type: discountType, value: val });
    setIsDiscountModalOpen(false);
  };

  return (
    <aside className="w-full lg:w-[440px] xl:w-[480px] h-full flex flex-col bg-[#1A1A1E] border-l border-white/10 select-none">
      
      {/* Header: Customer & Invoice Fiscal Type Selector */}
      <div className="p-3.5 border-b border-white/10 bg-[#161619] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-apple-blue" />
            <h2 className="text-xs font-bold font-sans tracking-wide text-white uppercase">
              Ticket de Venta en Vivo
            </h2>
          </div>

          {cart.length > 0 && (
            <button
              onClick={onClearCart}
              className="text-[11px] font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Vaciar</span>
            </button>
          )}
        </div>

        {/* Customer Selector & Fiscal Type */}
        <div className="grid grid-cols-2 gap-2">
          {/* Customer Dropdown */}
          <div className="relative">
            <select
              value={selectedCustomer.id}
              onChange={(e) => {
                const found = INITIAL_CUSTOMERS.find(c => c.id === e.target.value);
                if (found) setSelectedCustomer(found);
              }}
              className="w-full px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-sans outline-none focus:border-apple-blue appearance-none pr-8 cursor-pointer"
            >
              {INITIAL_CUSTOMERS.map(c => (
                <option key={c.id} value={c.id} className="bg-space-950 text-white">
                  {c.name}
                </option>
              ))}
            </select>
            <User className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Invoice Type Dropdown */}
          <div className="relative">
            <select
              value={invoiceType}
              onChange={(e) => setInvoiceType(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono outline-none focus:border-apple-blue appearance-none pr-8 cursor-pointer"
            >
              <option value="TICKET_CONSUMIDOR_FINAL" className="bg-space-950 text-white">Consumidor Final (B02)</option>
              <option value="CREDITO_FISCAL_B01" className="bg-space-950 text-white">Crédito Fiscal (B01)</option>
              <option value="FACTURA_GUBERNAMENTAL" className="bg-space-950 text-white">Gubernamental (B15)</option>
            </select>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none rotate-90" />
          </div>
        </div>

        {selectedCustomer.isWholesale && (
          <div className="text-[10px] font-mono text-apple-teal flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-apple-teal animate-pulse" />
            RNC: {selectedCustomer.taxId} • Régimen Fiscal Mayorista
          </div>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-2">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3 p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
              <Receipt className="w-7 h-7 stroke-[1.5]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">El ticket de venta está vacío</p>
              <p className="text-[11px] text-slate-500 mt-1">Selecciona productos del catálogo izquierdo o escanea un código de barras.</p>
            </div>
          </div>
        ) : (
          cart.map((item, index) => (
            <div
              key={`${item.variantId}-${index}`}
              className="p-3 rounded-2xl bg-black/30 border border-white/5 space-y-2 group hover:border-white/15 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white font-sans truncate">
                    {item.productName}
                  </h4>
                  <p className="text-[11px] font-mono text-slate-400 truncate">
                    {item.variantName}
                  </p>
                </div>
                
                <div className="text-right shrink-0">
                  <div className="text-xs font-bold font-mono text-white">
                    ${(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    ${item.price.toFixed(2)} c/u
                  </div>
                </div>
              </div>

              {/* Mandatory Serial / IMEI Selector for Tech Items */}
              {item.hasSerial && (
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 font-mono text-purple-300">
                    <Barcode className="w-3.5 h-3.5 text-purple-400" />
                    <span>IMEI/Serie:</span>
                  </div>

                  {item.availableSerials && item.availableSerials.length > 0 ? (
                    <select
                      value={item.selectedSerial || item.availableSerials[0]}
                      onChange={(e) => onAssignSerial(item.variantId, e.target.value)}
                      className="px-2 py-0.5 rounded-lg bg-black/60 border border-purple-500/30 text-[10px] font-mono text-white outline-none"
                    >
                      {item.availableSerials.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-rose-400 font-mono text-[10px] font-bold">
                      Sin seriales libres
                    </span>
                  )}
                </div>
              )}

              {/* Quantity Stepper & Actions */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateQuantity(item.variantId, item.quantity - 1)}
                    className="w-7 h-7 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center border border-white/5 active:scale-95 transition-all"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-mono text-xs font-bold text-white">
                    {item.quantity}
                  </span>
                  <button
                    disabled={item.quantity >= item.stock}
                    onClick={() => onUpdateQuantity(item.variantId, item.quantity + 1)}
                    className="w-7 h-7 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center border border-white/5 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => onRemoveItem(item.variantId)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Eliminar del ticket"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tax & Discount Summary Card */}
      <div className="p-3.5 bg-[#161619] border-t border-white/10 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between text-slate-400">
          <span>Subtotal Gravado</span>
          <span className="text-white">${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>

        {/* Discount Trigger Row */}
        <div className="flex items-center justify-between text-slate-400">
          <button
            onClick={() => setIsDiscountModalOpen(true)}
            className="flex items-center gap-1.5 text-apple-blue hover:underline"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Descuento {discount.value > 0 ? `(${discount.type === 'percent' ? `${discount.value}%` : `$${discount.value}`})` : ''}</span>
          </button>
          <span className="text-apple-green font-bold">
            -${calculatedDiscount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-400">
          <span>ITBIS / IVA (18%)</span>
          <span className="text-white">${taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>

        <div className="pt-2 border-t border-white/10 flex items-baseline justify-between">
          <span className="text-sm font-bold font-sans text-white uppercase tracking-wider">Total a Pagar</span>
          <span className="text-2xl font-bold font-mono text-emerald-400">
            ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Checkout Action Button */}
        <button
          disabled={cart.length === 0}
          onClick={() => onOpenCheckout({ subtotal, calculatedDiscount, taxAmount, total })}
          className={`w-full py-3.5 px-4 rounded-2xl text-sm font-bold font-sans flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
            cart.length === 0
              ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
              : 'bg-gradient-to-r from-apple-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-blue-500/25'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>COBRAR FACTURA (${total.toFixed(2)})</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* Quick Discount Modal */}
      {isDiscountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-80 rounded-3xl macos-frosted p-5 border border-white/20 shadow-macos-popover space-y-4">
            <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <Tag className="w-4 h-4 text-apple-blue" />
              Aplicar Descuento Comercial
            </h3>

            {/* Selector: Porcentaje o Fijo */}
            <div className="flex rounded-xl bg-black/40 p-1 border border-white/10">
              <button
                onClick={() => setDiscountType('percent')}
                className={`flex-1 py-1 text-xs font-mono rounded-lg transition-all ${
                  discountType === 'percent' ? 'bg-apple-blue text-white font-bold' : 'text-slate-400'
                }`}
              >
                Porcentaje (%)
              </button>
              <button
                onClick={() => setDiscountType('fixed')}
                className={`flex-1 py-1 text-xs font-mono rounded-lg transition-all ${
                  discountType === 'fixed' ? 'bg-apple-blue text-white font-bold' : 'text-slate-400'
                }`}
              >
                Monto Fijo ($)
              </button>
            </div>

            {/* Input Value */}
            <input
              type="number"
              min="0"
              max={discountType === 'percent' ? 100 : subtotal}
              value={discountInput}
              onChange={(e) => setDiscountInput(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/15 text-lg font-mono font-bold text-white text-center outline-none focus:border-apple-blue"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setIsDiscountModalOpen(false)}
                className="flex-1 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5"
              >
                Cancelar
              </button>
              <button
                onClick={handleApplyDiscount}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-apple-blue text-white hover:bg-blue-600"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
