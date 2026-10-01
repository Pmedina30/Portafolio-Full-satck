import React, { useState } from 'react';
import { 
  X, Package, PlusCircle, AlertTriangle, ArrowUpDown, 
  TrendingUp, Barcode, CheckCircle2, DollarSign, Calculator 
} from 'lucide-react';

export default function InventoryModal({
  isOpen,
  onClose,
  products,
  onStockIntake
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('list'); // list | intake
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [quantityReceived, setQuantityReceived] = useState('5');
  const [unitCostPaid, setUnitCostPaid] = useState('850');
  const [newSalePrice, setNewSalePrice] = useState('');
  const [serialsInput, setSerialsInput] = useState('');

  // Flatten all variants for the table
  const allVariants = products.flatMap(p => 
    p.variants.map(v => ({
      ...v,
      productName: p.name,
      brand: p.brand,
      hasSerial: p.hasSerial,
      productId: p.id
    }))
  );

  const selectedVariant = allVariants.find(v => v.id === selectedVariantId) || allVariants[0];

  // Dynamic Costo Promedio Ponderado (CPP) calculation
  const currentStock = selectedVariant ? selectedVariant.stock : 0;
  const currentCost = selectedVariant ? selectedVariant.cost : 0;
  const currentPrice = selectedVariant ? selectedVariant.price : 0;

  const qty = parseInt(quantityReceived, 10) || 0;
  const cost = parseFloat(unitCostPaid) || 0;
  const price = parseFloat(newSalePrice) || currentPrice;

  const totalStockAfter = currentStock + qty;
  const newWeightedAvgCost = totalStockAfter > 0
    ? +(((currentStock * currentCost) + (qty * cost)) / totalStockAfter).toFixed(2)
    : cost;
  
  const projectedMargin = price > 0
    ? +(((price - newWeightedAvgCost) / price) * 100).toFixed(1)
    : 0;

  const handleExecuteIntake = (e) => {
    e.preventDefault();
    if (!selectedVariant || qty <= 0) return;

    const serialsList = serialsInput
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    onStockIntake({
      variantId: selectedVariant.id,
      quantityReceived: qty,
      unitCostPaid: cost,
      newWeightedAvgCost,
      newSalePrice: price,
      serials: serialsList
    });

    setActiveTab('list');
    setSerialsInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl macos-frosted border border-white/20 shadow-macos-window overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-apple-orange/20 border border-apple-orange/30 text-apple-orange flex items-center justify-center shadow-sm">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-sans">
                Gestión de Inventario & Kardex Operativo
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Control de Existencias por Variante • Costo Promedio Ponderado (CPP) • Trazabilidad IMEI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-black/40 p-1 border border-white/10">
              <button
                onClick={() => setActiveTab('list')}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                  activeTab === 'list' ? 'bg-apple-blue text-white font-bold' : 'text-slate-400'
                }`}
              >
                Catálogo de Stock
              </button>
              <button
                onClick={() => {
                  setSelectedVariantId(allVariants[0]?.id || '');
                  setActiveTab('intake');
                }}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg flex items-center gap-1 transition-all ${
                  activeTab === 'intake' ? 'bg-apple-blue text-white font-bold' : 'text-slate-400'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Entrada de Mercancía</span>
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

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'list' ? (
            <div className="space-y-4">
              <div className="rounded-2xl bg-black/30 border border-white/10 overflow-hidden">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-mono text-[10px] uppercase">
                      <th className="py-3 px-4">Equipo / Variante</th>
                      <th className="py-3 px-3">Condición</th>
                      <th className="py-3 px-3 text-center">Stock Físico</th>
                      <th className="py-3 px-3 text-right">Costo CPP</th>
                      <th className="py-3 px-3 text-right">Precio Venta</th>
                      <th className="py-3 px-3 text-right">Margen Bruto</th>
                      <th className="py-3 px-4 text-center">Trazabilidad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {allVariants.map((v) => {
                      const margin = +(((v.price - v.cost) / v.price) * 100).toFixed(1);
                      const isLowStock = v.stock <= 2 && v.stock > 0;
                      const isOut = v.stock === 0;

                      return (
                        <tr key={v.id} className="hover:bg-white/[0.03] transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-white font-sans">{v.productName}</div>
                            <div className="text-[10px] text-slate-400">{v.name} ({v.skuVariant})</div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded text-[9px] bg-white/10 text-slate-300">
                              {v.condition}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isOut ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                              isLowStock ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse' :
                              'bg-emerald-500/20 text-emerald-400'
                            }`}>
                              {v.stock} uds
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right text-slate-300">
                            ${v.cost.toFixed(2)}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-white">
                            ${v.price.toFixed(2)}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <span className="text-apple-green font-bold">
                              {margin}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {v.hasSerial ? (
                              <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center justify-center gap-1">
                                <Barcode className="w-3 h-3" />
                                {v.serials?.length || 0} IMEIs
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500">Sin Serie</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Stock Intake Form */
            <form onSubmit={handleExecuteIntake} className="max-w-2xl mx-auto space-y-5">
              <div className="p-4 rounded-2xl bg-apple-blue/10 border border-apple-blue/20 text-xs text-blue-200">
                <strong>Reabastecimiento con Costo Promedio Ponderado (CPP):</strong> Registra las entradas de mercancía de proveedores. El sistema recalcula automáticamente la valoración del inventario y el margen de ganancia comercial.
              </div>

              {/* Variant Selector */}
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  Variante a Recibir:
                </label>
                <select
                  value={selectedVariantId}
                  onChange={(e) => {
                    setSelectedVariantId(e.target.value);
                    const sel = allVariants.find(v => v.id === e.target.value);
                    if (sel) {
                      setUnitCostPaid(sel.cost.toString());
                      setNewSalePrice(sel.price.toString());
                    }
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white font-sans outline-none focus:border-apple-blue"
                >
                  {allVariants.map(v => (
                    <option key={v.id} value={v.id} className="bg-space-950">
                      {v.productName} — {v.name} (Stock actual: {v.stock})
                    </option>
                  ))}
                </select>
              </div>

              {/* Numerical Inputs Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    Cantidad Recibida:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantityReceived}
                    onChange={(e) => setQuantityReceived(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-sm font-mono text-white text-center outline-none focus:border-apple-blue"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    Costo Compra Unitario ($):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={unitCostPaid}
                    onChange={(e) => setUnitCostPaid(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-sm font-mono text-white text-center outline-none focus:border-apple-blue"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    Precio Venta Público ($):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder={currentPrice.toString()}
                    value={newSalePrice}
                    onChange={(e) => setNewSalePrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-sm font-mono text-white text-center outline-none focus:border-apple-blue"
                  />
                </div>
              </div>

              {/* Dynamic Live Calculations Card */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 grid grid-cols-3 gap-3 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">STOCK FINAL:</span>
                  <span className="text-base font-bold text-white">{totalStockAfter} uds</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">NUEVO COSTO CPP:</span>
                  <span className="text-base font-bold text-apple-blue">${newWeightedAvgCost.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">MARGEN COMERCIAL:</span>
                  <span className="text-base font-bold text-apple-green">{projectedMargin}%</span>
                </div>
              </div>

              {/* Serial/IMEI input if applicable */}
              {selectedVariant?.hasSerial && (
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1 flex items-center justify-between">
                    <span>Números de Serie / IMEI a Registrar (Uno por línea):</span>
                    <span className="text-[10px] text-purple-400">Requerido: {qty} seriales</span>
                  </label>
                  <textarea
                    rows={4}
                    value={serialsInput}
                    onChange={(e) => setSerialsInput(e.target.value)}
                    placeholder="Ejemplo:&#10;354892110485916&#10;354892110485917&#10;354892110485918"
                    className="w-full p-3 rounded-xl bg-black/50 border border-white/15 text-xs font-mono text-white outline-none focus:border-apple-blue"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-xs font-bold bg-apple-blue hover:bg-blue-600 text-white shadow-md flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Guardar Entrada en Kardex</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
