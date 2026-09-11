import React, { useState, useEffect } from "react";
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  DollarSign, 
  CreditCard, 
  Smartphone, 
  CheckCircle2, 
  X, 
  Printer, 
  Store,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { dataService } from "../services/dataService";
import { CATEGORIES } from "../data/initialData";
import { useAuth } from "../contexts/AuthContext";

export default function Sales() {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("Cliente Mostrador");
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");
  const [cashTendered, setCashTendered] = useState("");
  const [lastSaleReceipt, setLastSaleReceipt] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const list = await dataService.getProducts();
    setProducts(list);
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === "Todos" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.code?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Cart operations
  const addToCart = (product) => {
    if (product.stock <= 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) return prev; // Don't exceed current inventory
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            const originalProd = products.find((p) => p.id === id);
            if (newQty > (originalProd?.stock || 99)) return item;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  // Totals
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cashNum = parseFloat(cashTendered) || 0;
  const changeDue = Math.max(0, cashNum - total);

  // Complete Sale
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);

    const salePayload = {
      customer: customerName || "Cliente Mostrador",
      cashierName: currentUser?.displayName || "Pablo Medina",
      paymentMethod,
      total,
      items: cart.map((i) => ({
        id: i.id,
        name: i.name,
        qty: i.qty,
        price: i.price,
        cost: i.cost,
        subtotal: i.price * i.qty
      }))
    };

    const finishedSale = await dataService.registerSale(salePayload);
    setLastSaleReceipt(finishedSale);
    clearCart();
    setCashTendered("");
    await loadProducts(); // Refresh stocks
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT: Product Catalog (7 Cols) */}
      <div className="lg:col-span-7 space-y-4">
        {/* Search & Category Header */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Buscar producto por nombre o código (ej. Arroz, Canilla, Presidente)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          {/* Categories Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {filteredProducts.map((p) => {
            const isOutOfStock = p.stock <= 0;
            const inCart = cart.find((c) => c.id === p.id);

            return (
              <div
                key={p.id}
                onClick={() => !isOutOfStock && addToCart(p)}
                className={`bg-white rounded-2xl p-4 border transition flex flex-col justify-between relative group ${
                  isOutOfStock 
                    ? "opacity-50 cursor-not-allowed border-slate-200" 
                    : "cursor-pointer hover:border-emerald-500 hover:shadow-md border-slate-200/80 active:scale-98"
                }`}
              >
                {inCart && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-emerald-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
                    {inCart.qty}
                  </span>
                )}

                <div>
                  <div className="text-3xl mb-2 text-center py-2 bg-slate-50 rounded-xl">
                    {p.image || "📦"}
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-800 line-clamp-2 leading-snug">
                    {p.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    {p.category}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-black text-slate-900">
                    RD$ {p.price.toFixed(0)}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    isOutOfStock 
                      ? "bg-red-50 text-red-600" 
                      : p.stock <= p.minStock 
                        ? "bg-amber-50 text-amber-600" 
                        : "bg-slate-100 text-slate-500"
                  }`}>
                    {isOutOfStock ? "Agotado" : `${p.stock} disp.`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Cart & Checkout Panel (5 Cols) */}
      <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 sm:p-6 flex flex-col h-full sticky top-20">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-base">Orden Actual</h3>
              <p className="text-xs text-slate-400">{cart.length} productos agregados</p>
            </div>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-red-500 hover:text-red-700"
            >
              Vaciar
            </button>
          )}
        </div>

        {/* Customer & Cashier Info */}
        <div className="py-3 border-b border-slate-100 grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase">Cliente</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 text-xs focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase">Atendido Por</label>
            <p className="mt-1 px-2.5 py-1.5 bg-slate-100 rounded-lg text-slate-700 font-semibold truncate">
              {currentUser?.displayName || "Pablo Medina"}
            </p>
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto max-h-[300px] divide-y divide-slate-100 my-2 pr-1">
          {cart.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <ShoppingCart className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-medium">El carrito está vacío</p>
              <p className="text-[11px] text-slate-400">Toca cualquier producto a la izquierda para agregarlo.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                  <p className="text-[11px] text-slate-400">RD$ {item.price.toFixed(2)} c/u</p>
                </div>

                {/* Qty Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="p-1 hover:bg-slate-200 text-slate-600 transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-7 text-center font-bold text-xs text-slate-800">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="p-1 hover:bg-slate-200 text-slate-600 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-xs font-extrabold text-slate-900 w-16 text-right">
                    RD$ {(item.price * item.qty).toFixed(0)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 text-slate-300 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Payment Method Selector */}
        <div className="pt-3 border-t border-slate-100">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Método de Pago
          </label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { id: "Efectivo", icon: DollarSign },
              { id: "Tarjeta", icon: CreditCard },
              { id: "Transferencia", icon: Smartphone }
            ].map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition ${
                    paymentMethod === m.id
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{m.id}</span>
                </button>
              );
            })}
          </div>

          {/* Cash Change Calculator */}
          {paymentMethod === "Efectivo" && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 mb-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">Efectivo Recibido:</span>
                <div className="flex items-center gap-1 w-32">
                  <span className="text-slate-400 font-bold">RD$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-right focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
              {cashNum > 0 && (
                <div className="flex items-center justify-between text-xs font-bold pt-1 border-t border-slate-200 text-emerald-700">
                  <span>Devuelta / Cambio:</span>
                  <span>RD$ {changeDue.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

          {/* Summary Total */}
          <div className="space-y-1 py-3 border-t border-slate-100">
            <div className="flex justify-between items-center text-base sm:text-lg font-black text-slate-900">
              <span>Total a Cobrar</span>
              <span className="text-emerald-600">RD$ {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Complete Button */}
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || loading}
            className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-98 ${
              cart.length === 0 || loading
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30"
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{loading ? "Procesando Cobro..." : `Cobrar RD$ ${total.toFixed(2)}`}</span>
          </button>
        </div>
      </div>

      {/* Sale Receipt Confirmation Modal */}
      {lastSaleReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-2">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-slate-900">¡Venta Completada!</h3>
              <p className="text-xs text-slate-500">Factura {lastSaleReceipt.id}</p>
            </div>

            {/* Receipt Stub */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 font-mono text-xs space-y-2">
              <div className="text-center pb-2 border-b border-dashed border-slate-300">
                <p className="font-bold text-slate-900">COLMADO SAN RAFAEL</p>
                <p className="text-[10px] text-slate-500">RNC: 1-01-84920-3</p>
                <p className="text-[10px] text-slate-500">
                  {new Date(lastSaleReceipt.date).toLocaleString()}
                </p>
              </div>

              <div className="space-y-1 max-h-36 overflow-y-auto">
                {lastSaleReceipt.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-[11px]">
                    <span>{it.qty}x {it.name.slice(0, 18)}</span>
                    <span className="font-bold">RD$ {it.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-dashed border-slate-300 flex justify-between font-bold text-slate-900 text-sm">
                <span>TOTAL:</span>
                <span>RD$ {lastSaleReceipt.total.toFixed(2)}</span>
              </div>
              <div className="text-[10px] text-slate-500 flex justify-between">
                <span>Pago: {lastSaleReceipt.paymentMethod}</span>
                <span>Atendido: {lastSaleReceipt.cashierName?.split(" ")[0]}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir</span>
              </button>
              <button
                onClick={() => setLastSaleReceipt(null)}
                className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition"
              >
                Listo / Siguiente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

