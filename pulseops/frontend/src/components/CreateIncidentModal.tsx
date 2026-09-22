'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, AlertTriangle, Send, Sparkles } from 'lucide-react';
import { Priority, TeamSquad, UserRole } from '../types/pulseops';
import { sanitizeInput } from '../utils/security';

interface CreateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: UserRole;
  onCreateIncident: (incidentData: {
    title: string;
    description: string;
    priority: Priority;
    team: TeamSquad;
    slaTargetMinutes: number;
    wasSanitized: boolean;
    rawTitle: string;
  }) => void;
}

export const CreateIncidentModal: React.FC<CreateIncidentModalProps> = ({
  isOpen,
  onClose,
  currentUserRole,
  onCreateIncident,
}) => {
  const [rawTitle, setRawTitle] = useState('');
  const [rawDescription, setRawDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('P2_HIGH');
  const [team, setTeam] = useState<TeamSquad>('SRE Especialistas');
  const [slaMinutes, setSlaMinutes] = useState(60);

  if (!isOpen) return null;

  // Live sanitization preview
  const sanitizedTitleResult = sanitizeInput(rawTitle, 120);
  const sanitizedDescResult = sanitizeInput(rawDescription, 300);

  const hasDetectedThreat =
    sanitizedTitleResult.wasSanitized || sanitizedDescResult.wasSanitized;

  const isAuditor = currentUserRole === 'Auditor';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuditor) return;
    if (!sanitizedTitleResult.sanitized.trim()) return;

    onCreateIncident({
      title: sanitizedTitleResult.sanitized,
      description: sanitizedDescResult.sanitized || 'Sin descripción adicional provista.',
      priority,
      team,
      slaTargetMinutes: slaMinutes,
      wasSanitized: hasDetectedThreat,
      rawTitle,
    });

    setRawTitle('');
    setRawDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100">Crear Incidente Operacional</h2>
              <p className="text-xs text-zinc-400">
                Entrada protegida con sanitización XSS activa en tiempo real
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* RBAC Block Warning for Auditor */}
        {isAuditor && (
          <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 flex items-start gap-2.5 text-xs text-amber-300">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
            <div>
              <span className="font-bold">Permiso Denegado (RBAC):</span> Tu rol actual es{' '}
              <span className="font-mono underline">Auditor</span>. Los auditores tienen acceso de solo lectura y no pueden crear nuevos incidentes.
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Input with Sanitization Feedback */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Título / Resumen del Incidente
              </label>
              <span className="text-[10px] text-zinc-500 font-mono">
                Prueba escribir: &lt;script&gt;alert(1)&lt;/script&gt;
              </span>
            </div>
            <input
              type="text"
              required
              disabled={isAuditor}
              value={rawTitle}
              onChange={(e) => setRawTitle(e.target.value)}
              placeholder="Ej: Saturación en microservicio de pagos Stripe"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
            />

            {/* Sanitization Live Alert */}
            {sanitizedTitleResult.wasSanitized && (
              <div className="mt-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-[11px] text-emerald-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-400 mt-0.5" />
                <div>
                  <span className="font-bold">Sanitización Activa:</span> Se neutralizó contenido malicioso.
                  <div className="font-mono text-[10px] mt-0.5 text-zinc-300">
                    Resultado: "{sanitizedTitleResult.sanitized}"
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Priority & Team Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Severidad / Prioridad
              </label>
              <select
                disabled={isAuditor}
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none disabled:opacity-50"
              >
                <option value="P1_CRITICAL">P1 - Crítico (SLA 30m)</option>
                <option value="P2_HIGH">P2 - Alto (SLA 60m)</option>
                <option value="P3_MEDIUM">P3 - Medio (SLA 120m)</option>
                <option value="P4_LOW">P4 - Bajo (SLA 240m)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Equipo Responsable
              </label>
              <select
                disabled={isAuditor}
                value={team}
                onChange={(e) => setTeam(e.target.value as TeamSquad)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none disabled:opacity-50"
              >
                <option value="SRE Especialistas">SRE Especialistas</option>
                <option value="N2 Support">N2 Support</option>
                <option value="N1 Triage">N1 Triage</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Detalles / Diagnóstico Preliminar
            </label>
            <textarea
              rows={3}
              disabled={isAuditor}
              value={rawDescription}
              onChange={(e) => setRawDescription(e.target.value)}
              placeholder="Describe síntomas, logs de error o métricas impactadas..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isAuditor || !rawTitle.trim()}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              Publicar Incidente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
