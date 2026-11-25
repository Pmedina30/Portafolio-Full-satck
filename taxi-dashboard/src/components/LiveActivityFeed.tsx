import React, { useState } from 'react';
import { OperationEvent, EventType } from '../types';
import {
  Activity,
  UserCheck,
  MapPin,
  CheckCircle2,
  Navigation,
  AlertCircle,
  Filter,
} from 'lucide-react';

interface LiveActivityFeedProps {
  events: OperationEvent[];
}

export const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({ events }) => {
  const [filterType, setFilterType] = useState<string>('all');

  const getEventIcon = (type: EventType) => {
    switch (type) {
      case 'driver_connected':
        return <UserCheck className="w-3.5 h-3.5 text-emerald-600" />;
      case 'request_created':
        return <MapPin className="w-3.5 h-3.5 text-blue-600" />;
      case 'trip_assigned':
        return <Navigation className="w-3.5 h-3.5 text-amber-600" />;
      case 'trip_completed':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'trip_cancelled':
        return <AlertCircle className="w-3.5 h-3.5 text-red-500" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const getBadgeStyle = (type: EventType) => {
    switch (type) {
      case 'driver_connected':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'request_created':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'trip_assigned':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'trip_completed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold';
      case 'trip_cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const filteredEvents = events.filter((ev) => {
    if (filterType === 'all') return true;
    if (filterType === 'completed') return ev.type === 'trip_completed';
    if (filterType === 'requests') return ev.type === 'request_created';
    if (filterType === 'drivers') return ev.type === 'driver_connected';
    return true;
  });

  return (
    <div
      id="live-activity-card"
      className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex flex-col h-[380px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Actividad en vivo
          </h3>
          <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-100 text-slate-500 font-mono">
            Stream
          </span>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1 text-[11px]">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2 py-0.5 rounded-md transition-colors font-medium ${
              filterType === 'all'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterType('requests')}
            className={`px-2 py-0.5 rounded-md transition-colors font-medium ${
              filterType === 'requests'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            Pedidos
          </button>
          <button
            onClick={() => setFilterType('completed')}
            className={`px-2 py-0.5 rounded-md transition-colors font-medium ${
              filterType === 'completed'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            Comisión
          </button>
        </div>
      </div>

      {/* Stream List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pt-3 pr-1 divide-y divide-slate-50 scrollbar-thin">
        {filteredEvents.map((ev) => (
          <div
            key={ev.id}
            className="pt-2 first:pt-0 flex items-start gap-2.5 group transition-colors hover:bg-slate-50/70 p-1.5 rounded-xl"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 mt-0.5">
              {getEventIcon(ev.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold truncate ${getBadgeStyle(
                    ev.type
                  )}`}
                >
                  {ev.title}
                </span>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">
                  {ev.timestamp.split(' ')[0]}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-snug break-words">
                {ev.description}
              </p>

              {ev.amountDOP && (
                <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono">
                  <span className="text-emerald-700 font-bold">
                    RD$ {ev.amountDOP.toLocaleString('es-DO')}
                  </span>
                  {ev.type === 'trip_completed' && (
                    <span className="text-[10px] text-slate-400">
                      (20% retención taxi.)
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
