"use client";

// ==============================================================================
// TIENDARD — CART & CHECKOUT DRAWER
// Features:
// - Dynamic US-to-RD Shipping Selector (Marítimo, Express Aéreo, Priority)
// - DGA $200 Exemption Badge / Calculation (Decree 402-05)
// - Dominican Address & Courier Form (Provincias, Sectores, Courier Locker ID)
// - Real-time breakdown in USD and DOP
// - High-conversion CTA ("Proceder al Pago Seguro")
// ==============================================================================

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trash,
  Plus,
  Minus,
  Plane,
  Ship,
  Zap,
  ShieldCheck,
  Scale,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Building2,
  MapPin,
  Clock,
  Lock,
} from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { ShippingMethod, CourierProvider } from "@/types";
import {
  SHIPPING_OPTIONS,
  DR_PROVINCES,
  COURIER_PROVIDERS,
} from "@/lib/logistics";

interface CartDrawerProps {
  onCheckoutSuccess?: (newOrderNumber: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckoutSuccess }) => {
  const {
    items,
    shippingMethod,
    isCartDrawerOpen,
    removeItem,
    updateQuantity,
    setShippingMethod,
    setCartDrawerOpen,
    clearCart,
    getItemCount,
    getTotalWeightLbs,
    getQuote,
    formatMoney,
  } = useCartStore();

  const { user } = useAuthStore();

  // Dominican Address Form State
  const [recipientName, setRecipientName] = useState(user?.name || "Pedro Medina");
  const [phone, setPhone] = useState("809-555-8842");
  const [province, setProvince] = useState<string>("Distrito Nacional");
  const [sector, setSector] = useState("Piantini");
  const [street, setStreet] = useState("Calle Federico Geraldino #42");
  const [selectedCourier, setSelectedCourier] = useState<CourierProvider>("EPS");
  const [courierLockerId, setCourierLockerId] = useState("EPS-SDQ-8842");

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const itemCount = getItemCount();
  const quote = getQuote();

  const handleSimulateCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      const generatedOrder = `TRD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setIsCheckingOut(false);
      clearCart();
      setCartDrawerOpen(false);
      if (onCheckoutSuccess) {
        onCheckoutSuccess(generatedOrder);
      }
    }, 1200);
  };

  if (!isCartDrawerOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden font-sans">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCartDrawerOpen(false)}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        />

        {/* Sliding drawer panel */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between"
          >
            {/* ------------------------------------------------------------- */}
            {/* DRAWER HEADER                                                 */}
            {/* ------------------------------------------------------------- */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Tu Carrito ({itemCount} {itemCount === 1 ? "artículo" : "artículos"})
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setCartDrawerOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* DRAWER SCROLLABLE CONTENT                                     */}
            {/* ------------------------------------------------------------- */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {items.length === 0 ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                    <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Tu carrito está vacío
                    </h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Explora nuestro catálogo de tecnología de USA y aprovéchate de la exención aduanal DGA &lt; $200 USD.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCartDrawerOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Ver Productos
                  </button>
                </div>
              ) : (
                <>
                  {/* DGA Customs Notice Banner */}
                  {quote.isDgaExempt ? (
                    <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <div className="font-bold text-emerald-900 dark:text-emerald-200">
                          ✓ Pedido Exento de Impuestos DGA (&lt; $200 USD)
                        </div>
                        <div className="text-emerald-700 dark:text-emerald-400 mt-0.5 text-[11px]">
                          Decreto 402-05: 0% Arancel de Aduana y 0% ITBIS aplicados.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <div className="font-bold text-amber-900 dark:text-amber-200">
                          Sujeto a Impuestos DGA (&ge; $200 USD)
                        </div>
                        <div className="text-amber-700 dark:text-amber-400 mt-0.5 text-[11px]">
                          Subtotal supera los $200 USD. Incluye gravamen arancelario e ITBIS (18%).
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Items List */}
                  <div className="space-y-3">
                    {items.map(({ product, quantity }) => (
                      <div
                        key={product.id}
                        className="flex gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800"
                      >
                        <div className="relative w-16 h-16 rounded-xl bg-white dark:bg-slate-900 p-1.5 shrink-0 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-contain p-1"
                          />
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                              {product.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeItem(product.id)}
                              className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                              title="Eliminar"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-xs pt-2">
                            <div className="font-bold text-slate-900 dark:text-white font-mono">
                              {formatMoney(product.priceUSD * quantity)}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-0.5">
                              <button
                                type="button"
                                onClick={() => updateQuantity(product.id, quantity - 1)}
                                className="text-slate-500 hover:text-slate-900 dark:hover:text-white"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold w-4 text-center">
                                {quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(product.id, quantity + 1)}
                                className="text-slate-500 hover:text-slate-900 dark:hover:text-white"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Dynamic US-to-RD Shipping Selector */}
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span>Modalidad de Envío US &rarr; RD:</span>
                      <span className="font-mono text-slate-400 font-normal text-[11px]">
                        {quote.totalWeightLbs} lbs facturables
                      </span>
                    </label>

                    <div className="grid grid-cols-3 gap-2">
                      {(Object.keys(SHIPPING_OPTIONS) as ShippingMethod[]).map((methodKey) => {
                        const opt = SHIPPING_OPTIONS[methodKey];
                        const isSelected = shippingMethod === methodKey;
                        return (
                          <button
                            key={methodKey}
                            type="button"
                            onClick={() => setShippingMethod(methodKey)}
                            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                              isSelected
                                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                                : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                            }`}
                          >
                            {opt.icon === "Ship" && <Ship className="w-4 h-4 mx-auto mb-1" />}
                            {opt.icon === "Plane" && <Plane className="w-4 h-4 mx-auto mb-1" />}
                            {opt.icon === "Zap" && <Zap className="w-4 h-4 mx-auto mb-1" />}
                            <div className="text-[11px] font-bold leading-tight truncate">
                              {opt.label.split(" ")[0]}
                            </div>
                            <div className="text-[10px] opacity-80 font-mono mt-0.5">
                              ${opt.ratePerLb}/lb
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dominican Republic Address & Courier Support Toggle */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 space-y-3 bg-slate-50/50 dark:bg-slate-800/30">
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className="w-full flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>Destino en RD &amp; Casillero Courier</span>
                      </div>
                      <span className="text-blue-600 text-xs">
                        {showAddressForm ? "Ocultar" : "Modificar"}
                      </span>
                    </button>

                    {!showAddressForm ? (
                      <div className="text-xs text-slate-500 leading-tight space-y-1">
                        <div>
                          <strong>{recipientName}</strong> ({phone})
                        </div>
                        <div>
                          {sector}, {province} • Courier: <strong>{selectedCourier}</strong> ({courierLockerId})
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 pt-2 text-xs">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            Provincia de Destino:
                          </label>
                          <select
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                            className="w-full py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-blue-500"
                          >
                            {DR_PROVINCES.map((prov) => (
                              <option key={prov} value={prov}>
                                {prov}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                              Sector / Barrio:
                            </label>
                            <input
                              type="text"
                              value={sector}
                              onChange={(e) => setSector(e.target.value)}
                              className="w-full py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                              Courier Local:
                            </label>
                            <select
                              value={selectedCourier}
                              onChange={(e) => setSelectedCourier(e.target.value as CourierProvider)}
                              className="w-full py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-blue-500"
                            >
                              {COURIER_PROVIDERS.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            No. Casillero o Locker ID:
                          </label>
                          <input
                            type="text"
                            value={courierLockerId}
                            onChange={(e) => setCourierLockerId(e.target.value)}
                            className="w-full py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* ------------------------------------------------------------- */}
            {/* DRAWER FOOTER: TOTALS & HIGH-CONVERSION CTA                   */}
            {/* ------------------------------------------------------------- */}
            {items.length > 0 && (
              <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-4">
                {/* Cost Breakdown */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal Artículos:</span>
                    <span className="font-mono text-slate-900 dark:text-white font-bold">
                      {formatMoney(quote.subtotalUSD)}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-500">
                    <span>Flete Internacional ({quote.shippingMethod.split("_")[0]}):</span>
                    <span className="font-mono text-slate-900 dark:text-white">
                      {formatMoney(quote.shippingCostUSD)}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-500">
                    <span>Seguro de Carga:</span>
                    <span className="font-mono text-slate-900 dark:text-white">
                      {formatMoney(quote.insuranceUSD)}
                    </span>
                  </div>

                  {quote.taxesUSD > 0 && (
                    <div className="flex justify-between text-amber-700 dark:text-amber-400">
                      <span>Aduana DGA (Arancel + ITBIS 18%):</span>
                      <span className="font-mono font-bold">
                        {formatMoney(quote.taxesUSD)}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-baseline justify-between">
                    <div>
                      <div className="text-xs text-slate-500">Total a Pagar:</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        RD$ {quote.totalDOP.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="text-xl font-black text-slate-950 dark:text-white font-mono">
                      US$ {quote.totalUSD.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* High-Conversion CTA Button (Vibrant Amber-Orange #F59E0B) */}
                <button
                  type="button"
                  onClick={handleSimulateCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 font-black text-sm tracking-tight uppercase flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/25 cursor-pointer disabled:opacity-75"
                >
                  {isCheckingOut ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full" />
                      <span>Validando con Almacén Miami...</span>
                    </span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 stroke-[2.5]" />
                      <span>Proceder al Pago Seguro</span>
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Pagos encriptados con Stripe y cálculo DGA garantizado</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
