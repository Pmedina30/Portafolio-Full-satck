import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShieldCheck, CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemoveItem,
  onClearCart
}) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  if (!isOpen) return null;

  const basePrice = 499;
  const subtotal = items.reduce((acc, item) => acc + (item.price || basePrice) * item.quantity, 0);
  const shipping = 0; // Free global express
  const total = subtotal + shipping;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
    }, 1200);
  };

  const handleFinishOrder = () => {
    setOrderComplete(false);
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-fadeIn"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0b0f19] border-l border-slate-800 shadow-2xl p-6 sm:p-8 flex flex-col justify-between text-white relative z-10">
          
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-cyan-400" />
                <h3 className="font-mono text-lg font-black tracking-wider uppercase">Your Gear Cart</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Order Complete Screen */}
            {orderComplete ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-cyan-950 border border-cyan-500 text-cyan-400 flex items-center justify-center mx-auto shadow-xl shadow-cyan-500/20 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-black font-mono tracking-tight">Order Confirmed!</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Thank you for securing your <strong>NEXUS-01</strong> Flagship. Your allocated serial number is <strong>#NX-2026-8941</strong>. Tracking confirmation dispatched to your email.
                </p>
                <button
                  onClick={handleFinishOrder}
                  className="mt-4 px-6 py-3 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-cyan-300 transition"
                >
                  Return to Store
                </button>
              </div>
            ) : (
              /* Item List */
              <div className="py-6 space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                {items.length === 0 ? (
                  <div className="text-center py-16 text-slate-500 space-y-2">
                    <ShoppingBag className="w-10 h-10 mx-auto stroke-1 opacity-50" />
                    <p className="text-sm font-mono">Your cart is currently empty.</p>
                  </div>
                ) : (
                  items.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="font-mono text-sm font-bold text-white">
                          NEXUS-01 Headset
                        </div>
                        <div className="text-xs font-mono text-cyan-400 capitalize">
                          Finish: {item.color}
                        </div>
                        <div className="text-xs font-mono text-slate-400">
                          ${item.price || basePrice} each
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-1">
                          <button
                            onClick={() => onUpdateQuantity(idx, Math.max(1, item.quantity - 1))}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-bold px-2">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="p-2 text-slate-500 hover:text-rose-400 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Cart Footer / Checkout */}
          {!orderComplete && items.length > 0 && (
            <div className="pt-6 border-t border-slate-800 space-y-4">
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Insured Express Shipping</span>
                  <span className="text-cyan-400 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                  <span>Total Amount</span>
                  <span className="text-cyan-400 font-mono text-base">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Encrypted 256-Bit Checkout • 60-Day Trial Included</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-4 rounded-2xl font-black text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-white text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-cyan-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isCheckingOut ? (
                  <span>Securing Allocation...</span>
                ) : (
                  <>
                    <span>Proceed to Instant Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

