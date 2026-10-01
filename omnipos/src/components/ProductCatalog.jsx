import React, { useState } from 'react';
import { 
  Search, LayoutGrid, Smartphone, Laptop, Headphones, 
  Gamepad2, Cable, Tag, AlertTriangle, Check, Plus, 
  ShieldCheck, Sparkles, Barcode 
} from 'lucide-react';
import { INITIAL_CATEGORIES } from '../data/initialData';

const CATEGORY_ICONS = {
  all: LayoutGrid,
  apple: Sparkles,
  smartphones: Smartphone,
  laptops: Laptop,
  audio: Headphones,
  gaming: Gamepad2,
  accessories: Cable
};

export default function ProductCatalog({ 
  products, 
  onAddToCart,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory
}) {
  const [selectedVariants, setSelectedVariants] = useState({});

  // Filter products by category and search query
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory || (selectedCategory === 'apple' && product.brand === 'Apple');
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesName = product.name.toLowerCase().includes(q);
    const matchesSku = product.sku.toLowerCase().includes(q);
    const matchesBrand = product.brand.toLowerCase().includes(q);
    const matchesVariant = product.variants.some(v => 
      v.name.toLowerCase().includes(q) || 
      v.skuVariant.toLowerCase().includes(q) ||
      (v.serials && v.serials.some(s => s.toLowerCase().includes(q)))
    );

    return matchesCategory && (matchesName || matchesSku || matchesBrand || matchesVariant);
  });

  const getActiveVariant = (product) => {
    const variantId = selectedVariants[product.id];
    if (variantId) {
      const found = product.variants.find(v => v.id === variantId);
      if (found) return found;
    }
    return product.variants[0];
  };

  const handleSelectVariant = (productId, variantId) => {
    setSelectedVariants(prev => ({ ...prev, [productId]: variantId }));
  };

  return (
    <section className="flex-1 flex flex-col h-full bg-[#161619] border-r border-white/10 overflow-hidden">
      
      {/* Top Search & Filter Bar */}
      <div className="p-3.5 border-b border-white/10 bg-[#1A1A1E]/80 backdrop-blur-md space-y-3">
        {/* Spotlight-styled Search Field */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por equipo, modelo, SKU o IMEI / Número de Serie..."
            className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-apple-blue focus:ring-1 focus:ring-apple-blue text-xs text-white placeholder-slate-500 font-sans outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-slate-300 hover:text-white"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {INITIAL_CATEGORIES.map(cat => {
            const Icon = CATEGORY_ICONS[cat.id] || LayoutGrid;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-apple-blue text-white shadow-sm font-semibold'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {filteredProducts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3 p-8">
            <Search className="w-12 h-12 stroke-[1.2] text-slate-600" />
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-400">No se encontraron productos coincidentes</p>
              <p className="text-xs text-slate-500 mt-1">Prueba con otro término de búsqueda o cambia la categoría activa.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {filteredProducts.map(product => {
              const activeVar = getActiveVariant(product);
              const isLowStock = activeVar.stock <= 2 && activeVar.stock > 0;
              const isOutOfStock = activeVar.stock === 0;

              return (
                <article
                  key={product.id}
                  className="apple-card rounded-2xl p-3.5 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Card Header & Brand */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-white/10 text-slate-300 font-semibold border border-white/5">
                        {product.brand}
                      </span>

                      {/* Stock Badge */}
                      {isOutOfStock ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold flex items-center gap-1">
                          Agotado
                        </span>
                      ) : isLowStock ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1 animate-pulse">
                          <AlertTriangle className="w-3 h-3" /> Quedan {activeVar.stock}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-bold">
                          {activeVar.stock} en stock
                        </span>
                      )}
                    </div>

                    {/* Product Title & Spec details */}
                    <h3 className="text-sm font-bold text-white tracking-tight font-sans line-clamp-1 group-hover:text-apple-blue transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      SKU: {activeVar.skuVariant}
                    </p>

                    {/* Serial/IMEI & Warranty Indicator */}
                    <div className="flex items-center gap-2 mt-2">
                      {product.hasSerial && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-apple-purple/15 text-purple-300 border border-purple-500/25 flex items-center gap-1">
                          <Barcode className="w-3 h-3" />
                          IMEI / Serie Req.
                        </span>
                      )}
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/5 text-slate-400 border border-white/5">
                        Garantía: {product.warrantyDays}d
                      </span>
                    </div>

                    {/* Variant Selector Pills */}
                    {product.variants.length > 1 && (
                      <div className="mt-3 pt-2.5 border-t border-white/5">
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                          Variante / Capacidad:
                        </label>
                        <div className="flex flex-wrap gap-1">
                          {product.variants.map(v => (
                            <button
                              key={v.id}
                              onClick={() => handleSelectVariant(product.id, v.id)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-mono transition-all ${
                                activeVar.id === v.id
                                  ? 'bg-apple-blue text-white font-bold shadow-sm'
                                  : 'bg-black/30 hover:bg-white/10 text-slate-300 border border-white/5'
                              }`}
                            >
                              {v.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom: Price & Quick Add Button */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400">Precio Venta (con ITBIS)</div>
                      <div className="text-base font-bold font-mono text-white">
                        ${activeVar.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    <button
                      disabled={isOutOfStock}
                      onClick={() => onAddToCart(product, activeVar)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
                        isOutOfStock
                          ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                          : 'bg-apple-blue hover:bg-blue-600 text-white shadow-sm'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Agregar</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
