'use client';

import React from 'react';
import { Play, Pause, Zap, RefreshCcw } from 'lucide-react';

interface LiveSimulatorControlProps {
  isSimulating: boolean;
  onToggleSimulation: () => void;
  intervalSpeed: number;
  onChangeSpeed: (ms: number) => void;
  generatedCount: number;
  onTriggerManualEvent: () => void;
}

export const LiveSimulatorControl: React.FC<LiveSimulatorControlProps> = ({
  isSimulating,
  onToggleSimulation,
  intervalSpeed,
  onChangeSpeed,
  generatedCount,
  onTriggerManualEvent,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-md">
      {/* Status indicator */}
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2.5 w-2.5">
          {isSimulating && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          )}
          <span
            className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              isSimulating ? 'bg-emerald-500' : 'bg-zinc-600'
            }`}
          />
        </span>
        <span className="text-xs font-semibold text-zinc-200">
          Simulador de Telemetría en Vivo
        </span>
        <span className="text-[11px] font-mono text-zinc-500">
          ({generatedCount} eventos generados)
        </span>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-2">
        {/* Play/Pause Toggle */}
        <button
          onClick={onToggleSimulation}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            isSimulating
              ? 'bg-zinc-800 text-amber-400 hover:bg-zinc-700'
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
          }`}
        >
          {isSimulating ? (
            <>
              <Pause className="w-3 h-3" /> Pausar Flujo
            </>
          ) : (
            <>
              <Play className="w-3 h-3" /> Reanudar Flujo
            </>
          )}
        </button>

        {/* Speed Selector */}
        <select
          value={intervalSpeed}
          onChange={(e) => onChangeSpeed(Number(e.target.value))}
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none"
        >
          <option value={4000}>Velocidad: 4s</option>
          <option value={8000}>Velocidad: 8s</option>
          <option value={15000}>Velocidad: 15s</option>
        </select>

        {/* Trigger Instant Event */}
        <button
          onClick={onTriggerManualEvent}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/90 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
          title="Inyectar incidente inmediato"
        >
          <Zap className="w-3 h-3 text-emerald-400" />
          <span>+1 Ticket Inmediato</span>
        </button>
      </div>
    </div>
  );
};

