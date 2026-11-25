import React, { useState } from 'react';
import { SANTO_DOMINGO_ZONES } from '../data/mockData';
import { SectorZone } from '../types';
import {
  Sliders,
  X,
  TrendingUp,
  MapPin,
  CheckCircle,
  Percent,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface ZonesAndRatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type: 'success' | 'info') => void;
  initialZones?: SectorZone[];
  cityName?: string;
}

export const ZonesAndRatesModal: React.FC<ZonesAndRatesModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  initialZones,
  cityName = 'Santo Domingo',
}) => {
  const [zones, setZones] = useState<SectorZone[]>(initialZones || SANTO_DOMINGO_ZONES);
  const isPuntaCana = cityName.toLowerCase().includes('punta');
  const [baseFare, setBaseFare] = useState<number>(isPuntaCana ? 150 : 60);
  const [minFare, setMinFare] = useState<number>(isPuntaCana ? 400 : 150);
  const [kmRate, setKmRate] = useState<number>(isPuntaCana ? 38 : 22);
  const [minRate, setMinRate] = useState<number>(isPuntaCana ? 8 : 5);
  const [commissionPct, setCommissionPct] = useState<number>(20);

  // Sync zones when initialZones changes
  React.useEffect(() => {
    if (initialZones && initialZones.length > 0) {
      setZones(initialZones);
      if (isPuntaCana) {
        setBaseFare(150);
        setMinFare(400);
        setKmRate(38);
        setMinRate(8);
      } else {
        setBaseFare(60);
        setMinFare(150);
        setKmRate(22);
        setMinRate(5);
      }
    }
  }, [initialZones, cityName, isPuntaCana]);

  if (!isOpen) return null;

  const handleSurgeChange = (zoneId: string, delta: number) => {
    setZones((prev) =>
      prev.map((z) => {
        if (z.id === zoneId) {
          const next = Math.max(1.0, Math.min(2.5, +(z.surgeMultiplier + delta).toFixed(1)));
          return {
            ...z,
            surgeMultiplier: next,
            demandLevel: next >= 1.3 ? 'Alta' : next > 1.0 ? 'Media' : 'Baja',
          };
        }
        return z;
      })
    );
  };

  const handleSave = () => {
    onShowToast('Tarifas y zonas actualizadas en el algoritmo de despacho.', 'success');
    onClose();
  };

  return (
    <div
      id="zones-and-rates-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 px-6 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Tarifas y Zonas Dinámicas
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {cityName} · Zona Operativa
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Reglas de cálculo automático de precio, multiplicadores por demanda y retención de plataforma
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Base Fare Formula Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Estructura Tarifaria Base (RD$)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <label className="text-[11px] font-semibold text-slate-500">
                  Tarifa Mínima
                </label>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xs font-mono font-bold text-slate-400">RD$</span>
                  <input
                    type="number"
                    value={minFare}
                    onChange={(e) => setMinFare(+e.target.value)}
                    className="w-full text-lg font-black text-slate-900 bg-transparent focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Cubre primeros 2km</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <label className="text-[11px] font-semibold text-slate-500">
                  Arranque Base
                </label>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xs font-mono font-bold text-slate-400">RD$</span>
                  <input
                    type="number"
                    value={baseFare}
                    onChange={(e) => setBaseFare(+e.target.value)}
                    className="w-full text-lg font-black text-slate-900 bg-transparent focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Banderazo inicial</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <label className="text-[11px] font-semibold text-slate-500">
                  Por Kilómetro
                </label>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xs font-mono font-bold text-slate-400">RD$</span>
                  <input
                    type="number"
                    value={kmRate}
                    onChange={(e) => setKmRate(+e.target.value)}
                    className="w-full text-lg font-black text-slate-900 bg-transparent focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Cálculo GPS PostGIS</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <label className="text-[11px] font-semibold text-slate-500">
                  Por Minuto
                </label>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xs font-mono font-bold text-slate-400">RD$</span>
                  <input
                    type="number"
                    value={minRate}
                    onChange={(e) => setMinRate(+e.target.value)}
                    className="w-full text-lg font-black text-slate-900 bg-transparent focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Tráfico Santo Domingo</p>
              </div>

              <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200">
                <label className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1">
                  <Percent className="w-3 h-3 text-emerald-600" /> Comisión Taxi
                </label>
                <div className="flex items-baseline gap-1 mt-1">
                  <input
                    type="number"
                    value={commissionPct}
                    onChange={(e) => setCommissionPct(+e.target.value)}
                    className="w-full text-lg font-black text-emerald-700 bg-transparent focus:outline-none"
                  />
                  <span className="text-sm font-bold text-emerald-700">%</span>
                </div>
                <p className="text-[10px] text-emerald-600 mt-1">Regla fija automática</p>
              </div>
            </div>
          </div>

          {/* Zones Surge Pricing Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Multiplicador Dinámico por Sector (Surge Pricing)
              </h3>
              <span className="text-xs text-slate-400">
                Ajuste automático según balance de conductores vs solicitudes
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
              {zones.map((zone) => (
                <div
                  key={zone.id}
                  className="p-3.5 px-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-tight">
                        {zone.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {zone.activeDrivers} conductores en cuadrante
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        zone.demandLevel === 'Alta'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      Demanda {zone.demandLevel}
                    </span>

                    {/* Multiplier adjuster buttons */}
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                      <button
                        onClick={() => handleSurgeChange(zone.id, -0.1)}
                        className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center transition-colors shadow-2xs"
                      >
                        -
                      </button>
                      <span className="font-mono font-extrabold text-xs text-slate-900 px-2 min-w-[42px] text-center">
                        {zone.surgeMultiplier.toFixed(1)}x
                      </span>
                      <button
                        onClick={() => handleSurgeChange(zone.id, 0.1)}
                        className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center transition-colors shadow-2xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              setZones(initialZones || SANTO_DOMINGO_ZONES);
              setBaseFare(isPuntaCana ? 150 : 60);
              setMinFare(isPuntaCana ? 400 : 150);
              setKmRate(isPuntaCana ? 38 : 22);
              setMinRate(isPuntaCana ? 8 : 5);
              setCommissionPct(20);
            }}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Restaurar valores predeterminados
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              Guardar y Aplicar Reglas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
