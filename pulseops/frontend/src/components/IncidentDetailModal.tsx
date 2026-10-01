'use client';

import React from 'react';
import {
  X,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  User,
  Users,
  AlertOctagon,
  FileText,
} from 'lucide-react';
import { Incident, UserRole } from '../types/pulseops';

interface IncidentDetailModalProps {
  incident: Incident | null;
  onClose: () => void;
  currentUserRole: UserRole;
  onResolve: (id: string) => void;
  onInvestigate: (id: string) => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  incident,
  onClose,
  currentUserRole,
  onResolve,
  onInvestigate,
}) => {
  if (!incident) return null;

  const isAuditor = currentUserRole === 'Auditor';
  const isResolved = incident.status === 'RESOLVED' || incident.status === 'CLOSED';

  // Calculate elapsed time from creation
  const createdDate = new Date(incident.createdAt);
  const elapsedMinutes = Math.floor((Date.now() - createdDate.getTime()) / (60 * 1000));
  const remainingMinutes = Math.max(0, incident.slaTargetMinutes - elapsedMinutes);
  const progressPercent = Math.min(100, (elapsedMinutes / incident.slaTargetMinutes) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800/80 pb-4 mb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-zinc-400 bg-zinc-900 border border-zinc-700 px-2 py-0.5 rounded">
                {incident.ticketNumber}
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  incident.priority === 'P1_CRITICAL'
                    ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    : incident.priority === 'P2_HIGH'
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                }`}
              >
                {incident.priority}
              </span>
              {incident.sanitizationTriggered && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Sanitizado XSS
                </span>
              )}
            </div>
            <h2 className="text-base font-bold text-zinc-100 pr-4">{incident.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SLA Runway Meter */}
        <div className="mb-5 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-zinc-400 flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              Tolerancia SLA ({incident.slaTargetMinutes}m objetivo)
            </span>
            <span
              className={`font-mono font-bold ${
                incident.slaBreached
                  ? 'text-rose-400'
                  : remainingMinutes < 15
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {incident.slaBreached
                ? 'SLA Incumplido (Breached)'
                : isResolved
                ? `Resuelto en ${incident.timeToResolveMinutes || elapsedMinutes}m`
                : `${remainingMinutes}m restantes`}
            </span>
          </div>

          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                incident.slaBreached
                  ? 'bg-rose-500'
                  : progressPercent > 80
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Incident Details Grid */}
        <div className="grid grid-cols-2 gap-3.5 mb-5 text-xs">
          <div className="rounded-xl border border-zinc-800/70 bg-zinc-900/40 p-3">
            <div className="text-zinc-500 mb-1 flex items-center gap-1.5">
              <Users className="w-3 h-3" /> Equipo Responsable
            </div>
            <div className="font-semibold text-zinc-200">{incident.team}</div>
          </div>

          <div className="rounded-xl border border-zinc-800/70 bg-zinc-900/40 p-3">
            <div className="text-zinc-500 mb-1 flex items-center gap-1.5">
              <User className="w-3 h-3" /> Asignado a
            </div>
            <div className="font-semibold text-zinc-200">{incident.assignee}</div>
          </div>

          <div className="rounded-xl border border-zinc-800/70 bg-zinc-900/40 p-3">
            <div className="text-zinc-500 mb-1">Estado Actual</div>
            <div className="font-mono font-bold text-zinc-200 flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isResolved
                    ? 'bg-emerald-400'
                    : incident.status === 'INVESTIGATING'
                    ? 'bg-amber-400'
                    : 'bg-rose-400'
                }`}
              />
              {incident.status}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800/70 bg-zinc-900/40 p-3">
            <div className="text-zinc-500 mb-1">Fecha de Creación</div>
            <div className="font-mono text-zinc-300">
              {new Date(incident.createdAt).toLocaleTimeString()} (Hace {elapsedMinutes}m)
            </div>
          </div>
        </div>

        {/* Description Box */}
        <div className="mb-6 rounded-xl border border-zinc-800/70 bg-zinc-900/30 p-3.5">
          <div className="text-xs font-semibold text-zinc-400 mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-zinc-400" />
            Descripción & Diagnóstico
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">{incident.description}</p>
        </div>

        {/* Action Controls & RBAC Enforcement */}
        <div className="pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-zinc-500">
            {isAuditor ? (
              <span className="text-amber-400/90 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Rol Auditor: Acciones bloqueadas
              </span>
            ) : (
              <span>Rol activo: <span className="font-mono text-zinc-300">{currentUserRole}</span></span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {!isResolved && incident.status !== 'INVESTIGATING' && (
              <button
                disabled={isAuditor}
                onClick={() => {
                  onInvestigate(incident.id);
                  onClose();
                }}
                className="flex-1 sm:flex-none rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title={isAuditor ? 'Acción restringida para el rol Auditor' : ''}
              >
                Investigar
              </button>
            )}

            {!isResolved && (
              <button
                disabled={isAuditor}
                onClick={() => {
                  onResolve(incident.id);
                  onClose();
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-lg shadow-emerald-500/20"
                title={isAuditor ? 'Acción restringida para el rol Auditor' : ''}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Resolver Incidente
              </button>
            )}

            {isResolved && (
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Incidente Mitigado
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

