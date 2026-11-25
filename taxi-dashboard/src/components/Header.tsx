import React, { useState } from 'react';
import { CityId } from '../types';
import {
  Calendar,
  MapPin,
  Wifi,
  WifiOff,
  Zap,
  Play,
  Pause,
  UserCheck,
  ChevronDown,
} from 'lucide-react';

interface HeaderProps {
  currentCity: CityId;
  onSelectCity: (city: CityId) => void;
  isConnected: boolean;
  onToggleConnection: () => void;
  simulationSpeed: number;
  onSpeedChange: (speed: number) => void;
  onTriggerManualEvent: () => void;
  pendingApprovalsCount: number;
  onOpenApprovalModal: () => void;
  onOpenZonesModal: () => void;
}

const CITIES: Array<{ id: CityId; label: string; badge: string }> = [
  { id: 'santo_domingo', label: 'Santo Domingo', badge: 'Distrito Nacional' },
  { id: 'santiago', label: 'Santiago', badge: 'Ciudad Corazón' },
  { id: 'punta_cana', label: 'Punta Cana', badge: 'Zona Turística / PUJ' },
];

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  onSelectCity,
  isConnected,
  onToggleConnection,
  simulationSpeed,
  onSpeedChange,
  onTriggerManualEvent,
  pendingApprovalsCount,
  onOpenApprovalModal,
  onOpenZonesModal,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'hoy' | 'semana' | 'mes'>('hoy');
  const [showCityMenu, setShowCityMenu] = useState<boolean>(false);

  const currentCityObj = CITIES.find((c) => c.id === currentCity) || CITIES[0];

  return (
    <header
      id="dashboard-header"
      className="bg-white border-b border-slate-200/90 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 shadow-sm/50"
    >
      {/* Left: Main Title & City Context */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Resumen del día
            </h1>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              En tiempo real
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoreo en vivo de despacho, flota y demanda en República Dominicana
          </p>
        </div>

        {/* City Selector: Santo Domingo, Santiago, Punta Cana */}
        <div className="relative">
          <button
            id="city-selector-btn"
            onClick={() => setShowCityMenu(!showCityMenu)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold text-xs transition-colors border border-slate-200 shadow-2xs"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{currentCityObj.label}</span>
            <span className="text-[10px] text-slate-400 font-normal">({currentCityObj.badge})</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {showCityMenu && (
            <div className="absolute left-0 mt-1.5 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3.5 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Seleccionar Región Operacional
              </div>
              {CITIES.map((city) => (
                <button
                  key={city.id}
                  onClick={() => {
                    onSelectCity(city.id);
                    setShowCityMenu(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between transition-colors ${
                    currentCity === city.id
                      ? 'bg-emerald-50 text-emerald-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <div>
                    <p className="leading-tight">{city.label}</p>
                    <p className="text-[10px] text-slate-400 font-normal mt-0.5 leading-tight">
                      {city.badge}
                    </p>
                  </div>
                  {currentCity === city.id && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center / Right: Filters & Live Controls */}
      <div className="flex items-center flex-wrap gap-2.5">
        {/* Quick Date Filter Tabs */}
        <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 text-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
          {(
            [
              { id: 'hoy', label: 'Hoy' },
              { id: 'semana', label: 'Esta semana' },
              { id: 'mes', label: 'Mes' },
            ] as const
          ).map((period) => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id)}
              className={`px-3 py-1 rounded-lg font-medium text-xs transition-all ${
                selectedPeriod === period.id
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>

        {/* Live WebSocket Status Badge */}
        <div
          id="websocket-status-badge"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-800 font-medium"
        >
          <div className="relative flex h-2 w-2">
            {isConnected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isConnected ? 'bg-emerald-500' : 'bg-red-500'
              }`}
            ></span>
          </div>

          <div className="flex items-center gap-1.5">
            {isConnected ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-red-500" />
            )}
            <span className="font-semibold">
              {isConnected ? 'Conexión en vivo activa' : 'Desconectado'}
            </span>
            <span className="text-[10px] text-emerald-600/80 bg-emerald-100/70 px-1.5 py-0.2 rounded font-mono">
              14ms
            </span>
          </div>
        </div>

        {/* Simulation Controls: Play/Pause & Speed */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            id="toggle-stream-btn"
            onClick={onToggleConnection}
            title={isConnected ? 'Pausar simulación' : 'Reanudar simulación'}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
          >
            {isConnected ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => onSpeedChange(simulationSpeed === 1 ? 2 : 1)}
            title="Cambiar velocidad de despacho"
            className="px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
          >
            {simulationSpeed}x
          </button>

          <button
            id="trigger-event-btn"
            onClick={onTriggerManualEvent}
            title="Simular nueva solicitud inmediata"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors shadow-sm"
          >
            <Zap className="w-3 h-3 fill-current" />
            <span className="hidden md:inline">Simular Evento</span>
          </button>
        </div>

        {/* Quick Driver Approval Button */}
        <button
          id="open-approval-modal-btn"
          onClick={onOpenApprovalModal}
          className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors shadow-sm"
        >
          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Verificar Conductores</span>
          {pendingApprovalsCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold">
              {pendingApprovalsCount}
            </span>
          )}
        </button>

        {/* Quick Zones & Rates Button */}
        <button
          id="open-zones-modal-btn"
          onClick={onOpenZonesModal}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors border border-slate-200"
        >
          <span>Tarifas {currentCityObj.label}</span>
        </button>
      </div>
    </header>
  );
};
