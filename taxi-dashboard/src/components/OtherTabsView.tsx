import React from 'react';
import { NavTab } from './Sidebar';
import {
  Users,
  AlertCircle,
  Settings,
  Database,
  Radio,
  Shield,
  CreditCard,
  MapPin,
  CheckCircle,
  FileCheck,
} from 'lucide-react';

interface OtherTabsViewProps {
  currentTab: NavTab;
  onOpenApprovalModal: () => void;
  onOpenZonesModal: () => void;
  onShowToast: (msg: string, type: 'success' | 'info') => void;
}

export const OtherTabsView: React.FC<OtherTabsViewProps> = ({
  currentTab,
  onOpenApprovalModal,
  onOpenZonesModal,
  onShowToast,
}) => {
  if (currentTab === 'pasajeros') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Directorio de Pasajeros · Santo Domingo
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Gestión de usuarios registrados, frecuencia de viajes y métodos de pago
            </p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              18,490 Pasajeros Activos
            </span>
          </div>
        </div>

        {/* Riders Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3.5 pl-5">Pasajero</th>
                <th className="p-3.5">Teléfono</th>
                <th className="p-3.5">Viajes Realizados</th>
                <th className="p-3.5">Gasto Total</th>
                <th className="p-3.5">Método de Pago</th>
                <th className="p-3.5 pr-5">Calificación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {[
                { name: 'María Gómez', phone: '+1 (809) 441-9921', trips: 42, spent: 'RD$ 16,840', pay: 'Visa terminada en •••• 4912', rate: '4.98' },
                { name: 'Alejandro Morales', phone: '+1 (829) 712-4091', trips: 28, spent: 'RD$ 11,200', pay: 'Mastercard •••• 8812', rate: '4.92' },
                { name: 'Sofía Polanco', phone: '+1 (849) 302-8812', trips: 65, spent: 'RD$ 27,950', pay: 'Apple Pay (Banreservas)', rate: '5.00' },
                { name: 'David Jiménez', phone: '+1 (809) 555-1200', trips: 19, spent: 'RD$ 8,420', pay: 'Efectivo', rate: '4.85' },
                { name: 'Laura Castillo', phone: '+1 (829) 682-9901', trips: 34, spent: 'RD$ 14,580', pay: 'Tarjeta Banco BHD', rate: '4.95' },
              ].map((rider, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 pl-5 font-bold text-slate-900">{rider.name}</td>
                  <td className="p-3.5 text-slate-500 font-mono">{rider.phone}</td>
                  <td className="p-3.5 font-semibold">{rider.trips} viajes</td>
                  <td className="p-3.5 font-mono font-bold text-emerald-700">{rider.spent}</td>
                  <td className="p-3.5">{rider.pay}</td>
                  <td className="p-3.5 pr-5 text-amber-500 font-bold">★ {rider.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (currentTab === 'reclamaciones') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Centro de Reclamaciones & Soporte en Línea
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tickets abiertos por pasajeros y conductores con tiempo de respuesta promedio &lt; 5 min
            </p>
          </div>
          <span className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            2 Tickets Pendientes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                Objeto Olvidado
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Hace 18m</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              iPhone 15 Pro olvidado en asiento trasero
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pasajero <strong>Sofía Polanco</strong> reporta haber dejado su teléfono en el vehículo Kia K5 de <strong>Carlos Batista</strong> tras el viaje en Naco.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Conductor ya notificado</span>
              <button
                onClick={() => onShowToast('Notificación enviada al conductor para coordinar entrega.', 'success')}
                className="px-3 py-1 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800"
              >
                Coordinar Entrega
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                Ajuste de Tarifa
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Hace 45m</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Ruta recalculada por desvío en Av. 27 de Febrero
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Conductor <strong>Rafael Peña</strong> solicita ajuste por cierre imprevisto de carril y desvío de 3.2 km adicionales.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Monto sugerido: +RD$ 95</span>
              <button
                onClick={() => onShowToast('Ajuste de RD$ 95 aprobado y acreditado a Rafael Peña.', 'success')}
                className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700"
              >
                Aprobar Ajuste
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentTab === 'configuracion') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Configuración del Sistema taxi. Operaciones
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Parámetros de conexión a base de datos PostgreSQL/PostGIS, WebSockets y credenciales INTRANT
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* PostgreSQL / PostGIS Settings */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Base de Datos Espacial (PostGIS)
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Conexión para indexado geoespacial de polígonos de sectores y despacho por proximidad en Santo Domingo.
            </p>
            <div className="space-y-2 text-xs">
              <div>
                <label className="text-slate-500">Host PostGIS:</label>
                <input
                  type="text"
                  readOnly
                  value="postgres://taxi_ops@db.taxi.do:5432/santodomingo_geodb"
                  className="w-full mt-1 p-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-slate-700"
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> PostGIS 3.4 Conectado
                </span>
                <button
                  onClick={() => onShowToast('Conexión con PostGIS verificada con éxito (Latencia 3ms).', 'success')}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium"
                >
                  Probar Conexión
                </button>
              </div>
            </div>
          </div>

          {/* WebSockets Gateway */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Gateway de Telemetría en Vivo
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Canal de transmisión bidireccional para coordenadas GPS de vehículos y cambios de estado.
            </p>
            <div className="space-y-2 text-xs">
              <div>
                <label className="text-slate-500">WebSocket Endpoint:</label>
                <input
                  type="text"
                  readOnly
                  value="wss://stream.taxi.do/v1/telemetry/santo-domingo"
                  className="w-full mt-1 p-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-slate-700"
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Socket.IO / WebSocket Activo
                </span>
                <button
                  onClick={() => onShowToast('Gateway de telemetría sincronizado.', 'success')}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium"
                >
                  Ping Gateway
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
