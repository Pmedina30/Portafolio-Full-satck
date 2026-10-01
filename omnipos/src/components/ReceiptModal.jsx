import React, { useState } from 'react';
import { 
  X, Printer, Download, CheckCircle2, QrCode, 
  FileText, ArrowRight, Share2, ShieldCheck, Barcode 
} from 'lucide-react';

export default function ReceiptModal({
  isOpen,
  onClose,
  invoice,
  onNewSale
}) {
  if (!isOpen || !invoice) return null;

  const [receiptFormat, setReceiptFormat] = useState('80mm'); // 80mm | a4

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl macos-frosted border border-white/20 shadow-macos-window overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-sans">
                Factura Emitida Exitosamente
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                NCF #{invoice.invoiceNumber}
              </p>
            </div>
          </div>

          {/* Format Toggle Pill */}
          <div className="flex rounded-xl bg-black/40 p-1 border border-white/10">
            <button
              onClick={() => setReceiptFormat('80mm')}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                receiptFormat === '80mm' ? 'bg-apple-blue text-white font-bold' : 'text-slate-400'
              }`}
            >
              Ticket 80mm
            </button>
            <button
              onClick={() => setReceiptFormat('a4')}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                receiptFormat === 'a4' ? 'bg-apple-blue text-white font-bold' : 'text-slate-400'
              }`}
            >
              Factura A4
            </button>
          </div>
        </div>

        {/* Scrollable Receipt Preview */}
        <div className="flex-1 p-6 overflow-y-auto flex justify-center bg-black/40">
          
          {/* 80mm Thermal Receipt Simulation */}
          {receiptFormat === '80mm' ? (
            <div 
              id="printable-receipt"
              className="w-[300px] bg-white text-black p-5 shadow-2xl font-mono text-xs space-y-3 rounded-md"
            >
              {/* Receipt Header */}
              <div className="text-center space-y-0.5 border-b border-dashed border-gray-400 pb-3">
                <div className="font-bold text-base tracking-wider">OMNIPOS TECH RETAIL</div>
                <div className="text-[10px] text-gray-700">Av. Winston Churchill #1099, Santo Domingo</div>
                <div className="text-[10px] text-gray-700">RNC: 131-89241-1 • Tel: 809-555-0192</div>
                <div className="text-[10px] font-bold mt-1 text-black">
                  {invoice.invoiceType === 'CREDITO_FISCAL_B01' ? 'FACTURA DE CRÉDITO FISCAL (B01)' : 'FACTURA DE CONSUMO (B02)'}
                </div>
                <div className="text-[11px] font-bold text-black mt-0.5">NCF: {invoice.invoiceNumber}</div>
              </div>

              {/* Meta details */}
              <div className="text-[10px] space-y-0.5 border-b border-dashed border-gray-400 pb-2">
                <div>Fecha: {new Date(invoice.createdAt).toLocaleString()}</div>
                <div>Cajero: {invoice.cashierName || 'Sofia Rodriguez'}</div>
                <div>Cliente: {invoice.customerName || 'Consumidor Final'}</div>
                {invoice.customerTaxId && <div>RNC/Cédula: {invoice.customerTaxId}</div>}
              </div>

              {/* Itemized Table */}
              <div className="border-b border-dashed border-gray-400 pb-2">
                <div className="flex justify-between font-bold text-[10px] border-b border-gray-300 pb-1 mb-1">
                  <span>Cant • Descripción</span>
                  <span>Total</span>
                </div>
                {invoice.items.map((it, idx) => (
                  <div key={idx} className="mb-2 text-[10px]">
                    <div className="flex justify-between">
                      <span className="font-semibold">{it.quantity}x {it.name}</span>
                      <span>${it.lineTotal.toFixed(2)}</span>
                    </div>
                    {it.serialNumber && (
                      <div className="text-[9px] text-gray-600 font-mono">
                        IMEI/Serie: {it.serialNumber} (Garantía: 365d)
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="text-[10px] space-y-1 border-b border-dashed border-gray-400 pb-2">
                <div className="flex justify-between">
                  <span>Subtotal Gravado:</span>
                  <span>${invoice.subtotal.toFixed(2)}</span>
                </div>
                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Descuento:</span>
                    <span>-${invoice.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>ITBIS (18%):</span>
                  <span>${invoice.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-xs pt-1 border-t border-gray-300">
                  <span>TOTAL:</span>
                  <span>${invoice.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment tender */}
              <div className="text-[10px] space-y-0.5 border-b border-dashed border-gray-400 pb-2">
                <div className="flex justify-between">
                  <span>Método de Pago:</span>
                  <span className="font-bold">{invoice.paymentMethod}</span>
                </div>
                {invoice.cashPaid > 0 && (
                  <div className="flex justify-between">
                    <span>Efectivo Recibido:</span>
                    <span>${invoice.cashPaid.toFixed(2)}</span>
                  </div>
                )}
                {invoice.changeGiven > 0 && (
                  <div className="flex justify-between font-bold">
                    <span>Cambio Entregado:</span>
                    <span>${invoice.changeGiven.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* QR & Barcode Simulation */}
              <div className="text-center pt-2 space-y-1">
                <div className="inline-block p-1 bg-gray-100 border border-gray-300 rounded">
                  <QrCode className="w-14 h-14 mx-auto text-black" />
                </div>
                <div className="text-[9px] text-gray-500">
                  Valide su comprobante fiscal electrónico en dgii.gov.do
                </div>
                <div className="text-[8px] text-gray-500 pt-1">
                  ¡Gracias por su compra en OmniPOS! Conserve este comprobante para reclamos de garantía.
                </div>
              </div>
            </div>
          ) : (
            /* Formal A4 Format Simulation */
            <div className="w-[420px] bg-white text-black p-6 shadow-2xl font-sans text-xs space-y-4 rounded-md">
              <div className="flex justify-between items-start border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">OMNIPOS CLOUD RETAIL</h2>
                  <p className="text-[11px] text-gray-600">Soluciones de Tecnología e Inventario S.R.L.</p>
                  <p className="text-[10px] text-gray-500">RNC: 131-89241-1 • Santo Domingo, D.N.</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                    FACTURA OFICIAL
                  </span>
                  <p className="text-xs font-mono font-bold text-gray-900 mt-1">{invoice.invoiceNumber}</p>
                  <p className="text-[10px] text-gray-500">{new Date(invoice.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg text-[11px]">
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase">Facturado a:</span>
                  <span className="font-bold text-gray-800">{invoice.customerName}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase">Cajero Operativo:</span>
                  <span className="font-medium text-gray-800">{invoice.cashierName}</span>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 text-[10px] uppercase">
                    <th className="py-1.5">Descripción</th>
                    <th className="py-1.5 text-center">Cant</th>
                    <th className="py-1.5 text-right">Precio</th>
                    <th className="py-1.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoice.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-1.5">
                        <div className="font-medium text-gray-900">{it.name}</div>
                        {it.serialNumber && <div className="text-[9px] text-gray-500 font-mono">IMEI: {it.serialNumber}</div>}
                      </td>
                      <td className="py-1.5 text-center text-gray-700">{it.quantity}</td>
                      <td className="py-1.5 text-right text-gray-700 font-mono">${it.unitPrice.toFixed(2)}</td>
                      <td className="py-1.5 text-right font-bold text-gray-900 font-mono">${it.lineTotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t border-gray-200 pt-3 flex justify-between font-mono text-xs">
                <span className="font-bold text-sm">TOTAL A PAGAR:</span>
                <span className="font-bold text-base text-emerald-600">${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/40 flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white flex items-center gap-2 border border-white/15 transition-all"
          >
            <Printer className="w-4 h-4 text-apple-blue" />
            <span>Imprimir Ticket (80mm)</span>
          </button>

          <button
            onClick={() => {
              onNewSale();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-apple-blue hover:bg-blue-600 text-white flex items-center gap-1.5 shadow-md transition-all"
          >
            <span>Nueva Venta</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
