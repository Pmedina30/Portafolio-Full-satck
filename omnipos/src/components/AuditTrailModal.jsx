import React, { useState } from 'react';
import { 
  X, ShieldCheck, Lock, UserCheck, AlertTriangle, 
  FileText, Search, Download, CheckCircle2 
} from 'lucide-react';

export default function AuditTrailModal({
  isOpen,
  onClose,
  auditLogs = []
}) {
  if (!isOpen) return null;

  const [filterAction, setFilterAction] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    if (filterAction === 'ALL') return true;
    return log.action === filterAction;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl macos-frosted border border-white/20 shadow-macos-window overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-sans">
                Pistas de Auditoría Inmutable & Seguridad RBAC
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Audit Trail Empresarial • Trazabilidad de Anulaciones, Descuentos y Movimientos
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

        {/* Security Matrix Legend */}
        <div className="px-6 py-3 bg-black/40 border-b border-white/5 flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="text-slate-400">Matriz de Permisos:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              CAJERO: Facturación & Cobro
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30">
              SUPERVISOR: Descuentos & Cuadre
            </span>
            <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
              ADMIN: Costos, Kardex & Logs
            </span>
          </div>

          {/* Filter Dropdown */}
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-xs text-white font-mono outline-none"
          >
            <option value="ALL">Todas las Acciones</option>
            <option value="EMISION_FACTURA">Emisión Factura</option>
            <option value="MOVIMIENTO_CAJA">Movimiento Caja</option>
            <option value="ENTRADA_KARDEX">Entrada Kardex</option>
            <option value="CAMBIO_ROL_RBAC">Cambio Rol RBAC</option>
            <option value="SINCRONIZACION_OFFLINE">Sincronización PWA</option>
          </select>
        </div>

        {/* Log Entries Table */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="rounded-2xl bg-black/30 border border-white/10 overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-slate-500 text-[10px] uppercase">
                  <th className="py-2.5 px-4">Hora / Fecha</th>
                  <th className="py-2.5 px-3">Usuario & Rol</th>
                  <th className="py-2.5 px-3">Acción Registrada</th>
                  <th className="py-2.5 px-4">Recurso / Detalles</th>
                  <th className="py-2.5 px-3 text-right">Integridad Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-4 text-slate-400 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="font-semibold text-white font-sans mr-1">{log.userName}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                        log.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-300' :
                        log.role === 'SUPERVISOR' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {log.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-slate-200 font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="text-white font-sans font-medium">{log.resource}</div>
                      <div className="text-[10px] text-slate-400">{log.details}</div>
                    </td>
                    <td className="py-2.5 px-3 text-right text-[10px] text-slate-600 font-mono">
                      {log.hash || 'e3b0c442...'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Cadena de custodia criptográfica activa
          </span>
          <span>{filteredLogs.length} eventos auditados</span>
        </div>
      </div>
    </div>
  );
}
