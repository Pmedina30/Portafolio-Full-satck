import React, { useState, useMemo } from 'react';
import { ActiveTrip } from '../types';
import {
  Navigation,
  MapPin,
  Clock,
  Car,
  Crosshair,
  User,
  ShieldCheck,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  Gauge,
  Phone,
  MessageSquare,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface ActiveTripsListProps {
  trips: ActiveTrip[];
  focusedTripId: string | null;
  onFocusTrip: (tripId: string) => void;
}

type TripFilter = 'all' | 'in_progress' | 'arriving' | 'vip';

export const ActiveTripsList: React.FC<ActiveTripsListProps> = ({
  trips,
  focusedTripId,
  onFocusTrip,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<TripFilter>('all');
  const [expandedTripId, setExpandedTripId] = useState<string | null>(null);

  // Filter trips based on tab and query
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      // Tab filter
      if (activeFilter === 'arriving' && trip.progressPercentage < 70) return false;
      if (activeFilter === 'vip' && trip.category === 'Económico') return false;
      if (activeFilter === 'in_progress' && trip.progressPercentage >= 70) return false;

      // Query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        trip.driverName.toLowerCase().includes(q) ||
        trip.riderName.toLowerCase().includes(q) ||
        trip.origin.name.toLowerCase().includes(q) ||
        trip.destination.name.toLowerCase().includes(q) ||
        (trip.vehiclePlate && trip.vehiclePlate.toLowerCase().includes(q)) ||
        (trip.origin.address && trip.origin.address.toLowerCase().includes(q))
      );
    });
  }, [trips, activeFilter, searchQuery]);

  const totalFares = useMemo(() => {
    return trips.reduce((acc, t) => acc + t.fareDOP, 0);
  }, [trips]);

  return (
    <div
      id="active-trips-card"
      className="bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col flex-1 overflow-hidden"
    >
      {/* 1. Header with Live Telemetry Badge */}
      <div className="p-4 pb-3 border-b border-slate-100 bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Despacho de Rutas Activas
                </h3>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Monitoreo GPS en tiempo real · República Dominicana
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
              {trips.length} en curso
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
              RD$ {totalFares.toLocaleString('es-DO')} activos
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mt-2">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por conductor, pasajero, sector o placa (A-XXX)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800/90 hover:bg-slate-800 focus:bg-slate-800 text-white text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-700/80 focus:border-emerald-500 focus:outline-none placeholder:text-slate-400 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-700/50 overflow-x-auto scrollbar-none text-[11px]">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all shrink-0 ${
              activeFilter === 'all'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Todos ({trips.length})
          </button>
          <button
            onClick={() => setActiveFilter('in_progress')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all shrink-0 ${
              activeFilter === 'in_progress'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            En Ruta ({trips.filter((t) => t.progressPercentage < 70).length})
          </button>
          <button
            onClick={() => setActiveFilter('arriving')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all shrink-0 ${
              activeFilter === 'arriving'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Llegando ({trips.filter((t) => t.progressPercentage >= 70).length})
          </button>
          <button
            onClick={() => setActiveFilter('vip')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all shrink-0 ${
              activeFilter === 'vip'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            VIP & XL ({trips.filter((t) => t.category !== 'Económico').length})
          </button>
        </div>
      </div>

      {/* 2. Scrollable Trips Cards List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
        {filteredTrips.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Navigation className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
            <p className="text-xs font-medium">No hay rutas activas para este filtro</p>
            <p className="text-[11px] text-slate-400 mt-1">Prueba cambiando el criterio de búsqueda</p>
          </div>
        ) : (
          filteredTrips.map((trip) => {
            const isFocused = trip.id === focusedTripId;
            const isExpanded = expandedTripId === trip.id;
            const isArriving = trip.progressPercentage >= 70;

            return (
              <div
                key={trip.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isFocused
                    ? 'border-emerald-500 bg-emerald-50/20 shadow-md ring-2 ring-emerald-500/30'
                    : 'border-slate-200/90 hover:border-slate-300 bg-white hover:shadow-xs'
                }`}
              >
                {/* Card Top: Driver, Category & Fare */}
                <div className="p-3.5 pb-3">
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    {/* Driver Avatar & Name */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative shrink-0">
                        {trip.driverAvatar ? (
                          <img
                            src={trip.driverAvatar}
                            alt={trip.driverName}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                            {trip.driverName[0]}
                          </div>
                        )}
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -right-0.5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {trip.driverName}
                          </span>
                          {trip.driverRating && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              ★ {trip.driverRating}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5 truncate">
                          <span className="truncate">{trip.vehicleModel || 'Vehículo taxi'}</span>
                          {trip.vehiclePlate && (
                            <span className="font-mono text-[10px] px-1 py-0.2 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200">
                              {trip.vehiclePlate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Fare & Status Badge */}
                    <div className="text-right shrink-0">
                      <div className="text-sm font-mono font-black text-slate-900">
                        RD$ {trip.fareDOP.toLocaleString('es-DO')}
                      </div>
                      <span
                        className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-bold mt-0.5 border ${
                          isArriving
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {isArriving ? 'Llegando a destino' : 'En trayecto'}
                      </span>
                    </div>
                  </div>

                  {/* Visual Route Timeline */}
                  <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 space-y-2 mb-3">
                    {/* Origin */}
                    <div className="flex items-start gap-2.5">
                      <div className="flex flex-col items-center mt-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 shrink-0" />
                        <span className="w-0.5 h-6 bg-linear-to-b from-emerald-500 via-slate-300 to-slate-900 my-0.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                          <span>Punto de Recogida</span>
                          <span>{trip.startTime}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {trip.origin.name}
                        </p>
                        {trip.origin.address && (
                          <p className="text-[11px] text-slate-500 truncate">
                            {trip.origin.address}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Destination */}
                    <div className="flex items-start gap-2.5">
                      <div className="mt-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-4 ring-slate-200 shrink-0 block" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                          <span>Destino</span>
                          <span className="text-emerald-600 font-bold font-mono">
                            ETA: {trip.etaMinutes} min
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {trip.destination.name}
                        </p>
                        {trip.destination.address && (
                          <p className="text-[11px] text-slate-500 truncate">
                            {trip.destination.address}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Route Progress Bar & Live Telemetry Pill */}
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 font-medium">
                        <Gauge className="w-3.5 h-3.5 text-emerald-600" />
                        {trip.speedKmh ? `${trip.speedKmh} km/h` : '38 km/h'} · GPS Activo
                      </span>
                      <span className="font-semibold text-slate-700">
                        {trip.distanceRemainingKm
                          ? `${trip.distanceRemainingKm} km restantes`
                          : 'Ruta en curso'}
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden p-0.5">
                      <div
                        className="bg-linear-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500 shadow-xs"
                        style={{ width: `${trip.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Rider Information Pill */}
                  <div className="flex items-center justify-between text-xs py-1.5 px-2.5 bg-slate-50 rounded-xl border border-slate-100 mb-3">
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                        {trip.riderName[0]}
                      </div>
                      <span className="text-[11px] font-medium text-slate-700 truncate">
                        Pasajero: <strong className="text-slate-900">{trip.riderName}</strong>
                      </span>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.2 rounded font-semibold border ${
                        trip.category === 'Comfort'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : trip.category === 'Taxi XL'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {trip.category}
                    </span>
                  </div>

                  {/* Action Buttons: "Enfocar Ruta en Mapa" */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onFocusTrip(trip.id)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-xs ${
                        isFocused
                          ? 'bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-500'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isFocused ? 'Enfocado en Mapa' : 'Enfocar Ruta'}</span>
                    </button>

                    <button
                      onClick={() => setExpandedTripId(isExpanded ? null : trip.id)}
                      className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors"
                    >
                      <span>{isExpanded ? 'Ocultar Detalle' : 'Telemetría'}</span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Collapsible Telemetry Details Drawer */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] grid grid-cols-2 gap-2 animate-in fade-in duration-200">
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block text-[10px]">Comisión Taxi (20%)</span>
                        <strong className="text-slate-800 font-mono">
                          RD$ {trip.commissionDOP.toFixed(2)}
                        </strong>
                      </div>

                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block text-[10px]">Distancia Total</span>
                        <strong className="text-slate-800 font-mono">
                          {trip.totalDistanceKm ? `${trip.totalDistanceKm} km` : '5.2 km'}
                        </strong>
                      </div>

                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block text-[10px]">Multiplicador Surge</span>
                        <strong className="text-emerald-700 font-mono">
                          {trip.surgeMultiplier ? `${trip.surgeMultiplier}x` : '1.0x (Estándar)'}
                        </strong>
                      </div>

                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block text-[10px]">ID de Despacho</span>
                        <strong className="text-slate-700 font-mono text-[10px] truncate block">
                          {trip.id}
                        </strong>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
