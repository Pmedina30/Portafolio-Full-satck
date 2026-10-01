import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, X, Package, User, Barcode, DollarSign, 
  BarChart3, ShieldCheck, ArrowRight, CornerDownLeft 
} from 'lucide-react';

export default function SpotlightSearch({
  isOpen,
  onClose,
  products,
  customers,
  onSelectProduct,
  onSelectCustomer,
  onOpenInventory,
  onOpenCash,
  onOpenAnalytics
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Search Products & Variants
  const matchedProducts = products.flatMap(p => 
    p.variants
      .filter(v => 
        p.name.toLowerCase().includes(q) || 
        v.name.toLowerCase().includes(q) || 
        v.skuVariant.toLowerCase().includes(q) ||
        (v.serials && v.serials.some(s => s.toLowerCase().includes(q)))
      )
      .map(v => ({ product: p, variant: v }))
  ).slice(0, 5);

  // Search Customers
  const matchedCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(q) || 
    c.taxId.includes(q)
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/75 backdrop-blur-2xl animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-3xl macos-frosted border border-white/20 shadow-macos-window overflow-hidden flex flex-col">
        
        {/* Spotlight Search Input */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-apple-blue shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar productos, variantes, clientes, IMEI o atajos de comando..."
            className="flex-1 bg-transparent text-base font-sans text-white placeholder-slate-500 outline-none"
          />
          <button
            onClick={onClose}
            className="px-2 py-1 rounded-md text-[10px] font-mono bg-white/10 text-slate-400 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-4">
          
          {/* Quick Actions Shortcuts */}
          {!q && (
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider px-3 mb-1 block">
                Comandos & Módulos Rápidos
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => { onClose(); onOpenInventory(); }}
                  className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/10 border border-white/5 flex items-center gap-2.5 text-xs text-white text-left transition-colors"
                >
                  <Package className="w-4 h-4 text-apple-orange" />
                  <span>Kardex / Stock</span>
                </button>
                <button
                  onClick={() => { onClose(); onOpenCash(); }}
                  className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/10 border border-white/5 flex items-center gap-2.5 text-xs text-white text-left transition-colors"
                >
                  <DollarSign className="w-4 h-4 text-apple-green" />
                  <span>Corte de Caja</span>
                </button>
                <button
                  onClick={() => { onClose(); onOpenAnalytics(); }}
                  className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/10 border border-white/5 flex items-center gap-2.5 text-xs text-white text-left transition-colors"
                >
                  <BarChart3 className="w-4 h-4 text-apple-purple" />
                  <span>Reportes NIIF</span>
                </button>
              </div>
            </div>
          )}

          {/* Matched Products */}
          {matchedProducts.length > 0 && (
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider px-3 mb-1 block">
                Equipos y Dispositivos ({matchedProducts.length})
              </span>
              <div className="space-y-1">
                {matchedProducts.map(({ product, variant }) => (
                  <button
                    key={variant.id}
                    onClick={() => {
                      onSelectProduct(product, variant);
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-apple-blue/15 text-left flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-apple-blue">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white font-sans">{product.name}</div>
                        <div className="text-[11px] font-mono text-slate-400">{variant.name} • Stock: {variant.stock} uds</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-white">${variant.price.toFixed(2)}</span>
                      <span className="text-[10px] font-mono text-apple-blue opacity-0 group-hover:opacity-100 flex items-center gap-1">
                        Añadir <CornerDownLeft className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Customers */}
          {matchedCustomers.length > 0 && (
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider px-3 mb-1 block">
                Clientes Registrados ({matchedCustomers.length})
              </span>
              <div className="space-y-1">
                {matchedCustomers.map(cust => (
                  <button
                    key={cust.id}
                    onClick={() => {
                      onSelectCustomer(cust);
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-white/10 text-left flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white font-sans">{cust.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">RNC/Cédula: {cust.taxId}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-apple-blue opacity-0 group-hover:opacity-100 flex items-center gap-1">
                      Asignar <CornerDownLeft className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-white/10 bg-black/30 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Navega con flechas y presiona Enter para seleccionar</span>
          <span>OmniPOS Spotlight Command</span>
        </div>
      </div>
    </div>
  );
}
