'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldAlert,
  Radio,
  RefreshCw,
  SlidersHorizontal,
  Bell,
  Search,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Plus,
  History,
  ShieldCheck,
  UserCheck,
  Filter,
  Eye,
} from 'lucide-react';
import { MetricKpiCard } from './MetricKpiCard';
import { PulseTimeSeriesChart } from './PulseTimeSeriesChart';
import { CreateIncidentModal } from './CreateIncidentModal';
import { IncidentDetailModal } from './IncidentDetailModal';
import { AuditLogDrawer } from './AuditLogDrawer';
import { LiveSimulatorControl } from './LiveSimulatorControl';
import { INITIAL_INCIDENTS } from '../data/initialIncidents';
import {
  Incident,
  UserRole,
  Priority,
  TeamSquad,
  AuditLogEntry,
  TimeframeFilter,
} from '../types/pulseops';
import { calculateOperationalMetrics, generateTimeSeriesFromIncidents } from '../utils/analytics';
import { sanitizeInput } from '../utils/security';

export const PulseOpsDashboard: React.FC = () => {
  // ==============================================================================
  // 1. REACTIVE STATE STORE
  // ==============================================================================

  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('SuperAdmin');
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'audit-01',
      timestamp: new Date().toISOString(),
      action: 'SYSTEM_BOOTSTRAP',
      actor: 'system',
      role: 'SuperAdmin',
      details: 'Mock Data Store inicializado con 42 incidentes operativos y motor analítico.',
      severity: 'info',
    },
  ]);

  // Simulator Controls State
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simulatorSpeed, setSimulatorSpeed] = useState<number>(6000); // 6s per ticket
  const [generatedCount, setGeneratedCount] = useState<number>(0);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [sanitizedSearchWarning, setSanitizedSearchWarning] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedTeam, setSelectedTeam] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL'); // ALL, ACTIVE, RESOLVED

  // Modals & Drawers State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedIncidentForDetail, setSelectedIncidentForDetail] = useState<Incident | null>(null);
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);

  // Sorting
  const [sortField, setSortField] = useState<'createdAt' | 'priority' | 'status'>('createdAt');
  const [sortAsc, setSortAsc] = useState(false);

  // ==============================================================================
  // 2. AUDIT LOGGING HELPER
  // ==============================================================================

  const logAction = (action: string, details: string, severity: 'info' | 'warning' | 'danger' = 'info') => {
    const newEntry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      action,
      actor: currentUserRole === 'SuperAdmin' ? 'Pedro Medina' : `User (${currentUserRole})`,
      role: currentUserRole,
      details,
      severity,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // Switch Role Handler
  const handleRoleChange = (newRole: UserRole) => {
    setCurrentUserRole(newRole);
    logAction(
      'USER_ROLE_SWITCHED',
      `Rol del operador cambiado a ${newRole}. Permisos actualizados según matriz RBAC.`,
      newRole === 'Auditor' ? 'warning' : 'info'
    );
  };

  // ==============================================================================
  // 3. LIVE SIMULATOR ENGINE (Generates real-time incident flow)
  // ==============================================================================

  const sampleIncidentTemplates = [
    {
      title: 'Latencia > 150ms en servicio de autenticación JWT',
      team: 'SRE Especialistas' as TeamSquad,
      priority: 'P2_HIGH' as Priority,
      slaTargetMinutes: 60,
    },
    {
      title: 'Sincronización demorada en Webhook de pasarela de pagos',
      team: 'N2 Support' as TeamSquad,
      priority: 'P3_MEDIUM' as Priority,
      slaTargetMinutes: 120,
    },
    {
      title: 'Saturación en cola de mensajes SQS de notificaciones',
      team: 'SRE Especialistas' as TeamSquad,
      priority: 'P1_CRITICAL' as Priority,
      slaTargetMinutes: 30,
    },
    {
      title: 'Peticiones 429 Too Many Requests en API de exportación',
      team: 'N1 Triage' as TeamSquad,
      priority: 'P3_MEDIUM' as Priority,
      slaTargetMinutes: 120,
    },
    {
      title: 'Desfase temporal en lecturas de réplica secundaria MySQL',
      team: 'SRE Especialistas' as TeamSquad,
      priority: 'P2_HIGH' as Priority,
      slaTargetMinutes: 60,
    },
  ];

  const injectNewIncident = () => {
    const template = sampleIncidentTemplates[Math.floor(Math.random() * sampleIncidentTemplates.length)];
    const ticketSeq = 9042 + generatedCount;

    const newTicket: Incident = {
      id: `inc-sim-${Date.now()}`,
      ticketNumber: `INC-2026-${ticketSeq}`,
      title: template.title,
      description: `Generado automáticamente por el simulador de telemetría en vivo. Verificando métricas operacionales.`,
      priority: template.priority,
      status: 'OPEN',
      team: template.team,
      createdAt: new Date().toISOString(),
      slaTargetMinutes: template.slaTargetMinutes,
      slaBreached: false,
      assignee: 'Sin Asignar',
    };

    setIncidents((prev) => [newTicket, ...prev]);
    setGeneratedCount((c) => c + 1);
    logAction(
      'SIMULATED_TICKET_INJECTED',
      `Nuevo ticket entrante recibido: ${newTicket.ticketNumber} [${newTicket.priority}] asignado a ${newTicket.team}.`
    );
  };

  useEffect(() => {
    if (!isSimulating) return;

    const timer = setInterval(() => {
      injectNewIncident();
    }, simulatorSpeed);

    return () => clearInterval(timer);
  }, [isSimulating, simulatorSpeed, generatedCount]);

  // ==============================================================================
  // 4. INCIDENT ACTIONS (Investigate, Resolve, Create)
  // ==============================================================================

  const handleCreateIncident = (data: {
    title: string;
    description: string;
    priority: Priority;
    team: TeamSquad;
    slaTargetMinutes: number;
    wasSanitized: boolean;
    rawTitle: string;
  }) => {
    const ticketSeq = 9042 + generatedCount;
    const newInc: Incident = {
      id: `inc-${Date.now()}`,
      ticketNumber: `INC-2026-${ticketSeq}`,
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: 'OPEN',
      team: data.team,
      createdAt: new Date().toISOString(),
      slaTargetMinutes: data.slaTargetMinutes,
      slaBreached: false,
      assignee: 'Pedro Medina',
      sanitizationTriggered: data.wasSanitized,
      rawTitleBeforeSanitization: data.wasSanitized ? data.rawTitle : undefined,
    };

    setIncidents((prev) => [newInc, ...prev]);
    setGeneratedCount((c) => c + 1);

    if (data.wasSanitized) {
      logAction(
        'SECURITY_XSS_SANITIZED',
        `Ataque XSS potencial neutralizado en creación de ticket. Entrada cruda: "${data.rawTitle}". Salida sanitizada: "${data.title}".`,
        'danger'
      );
    }

    logAction('INCIDENT_CREATED', `Incidente ${newInc.ticketNumber} creado manualmente por el operador.`);
  };

  const handleResolveIncident = (id: string) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== id) return inc;
        const createdDate = new Date(inc.createdAt);
        const resolvedDate = new Date();
        const elapsedMinutes = Math.max(1, Math.floor((resolvedDate.getTime() - createdDate.getTime()) / (60 * 1000)));
        const breached = elapsedMinutes > inc.slaTargetMinutes;

        logAction(
          'INCIDENT_RESOLVED',
          `Incidente ${inc.ticketNumber} resuelto en ${elapsedMinutes}m. SLA Breached: ${breached ? 'SÍ' : 'NO'}.`,
          breached ? 'warning' : 'info'
        );

        return {
          ...inc,
          status: 'RESOLVED',
          resolvedAt: resolvedDate.toISOString(),
          timeToResolveMinutes: elapsedMinutes,
          slaBreached: breached,
        };
      })
    );
  };

  const handleInvestigateIncident = (id: string) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== id) return inc;
        logAction('INCIDENT_TRIAGE', `Incidente ${inc.ticketNumber} puesto en estado de investigación activa.`);
        return {
          ...inc,
          status: 'INVESTIGATING',
          assignee: currentUserRole === 'SuperAdmin' ? 'Pedro Medina' : 'Operador en Turno',
        };
      })
    );
  };

  // Search input handler with Sanitization
  const handleSearchChange = (val: string) => {
    const { sanitized, wasSanitized } = sanitizeInput(val, 50);
    setSearchQuery(sanitized);

    if (wasSanitized && val.includes('<')) {
      setSanitizedSearchWarning(true);
      logAction(
        'SECURITY_XSS_SEARCH_FILTERED',
        `Intento de inyección de script neutralizado en campo de búsqueda: "${val}".`,
        'danger'
      );
      setTimeout(() => setSanitizedSearchWarning(false), 4000);
    }
  };

  // ==============================================================================
  // 5. ANALYTICAL METRICS DERIVATION
  // ==============================================================================

  const metrics = useMemo(() => calculateOperationalMetrics(incidents), [incidents]);
  const timeSeriesData = useMemo(() => generateTimeSeriesFromIncidents(incidents), [incidents]);

  // Filtered & Sorted Incidents List
  const filteredIncidents = useMemo(() => {
    return incidents
      .filter((inc) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = inc.title.toLowerCase().includes(q);
          const matchNumber = inc.ticketNumber.toLowerCase().includes(q);
          const matchAssignee = inc.assignee.toLowerCase().includes(q);
          if (!matchTitle && !matchNumber && !matchAssignee) return false;
        }

        // Priority filter
        if (selectedPriority !== 'ALL' && inc.priority !== selectedPriority) return false;

        // Team filter
        if (selectedTeam !== 'ALL' && inc.team !== selectedTeam) return false;

        // Status filter
        if (selectedStatus === 'ACTIVE') {
          if (inc.status !== 'OPEN' && inc.status !== 'INVESTIGATING') return false;
        } else if (selectedStatus === 'RESOLVED') {
          if (inc.status !== 'RESOLVED' && inc.status !== 'CLOSED') return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortField === 'createdAt') {
          return sortAsc
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortField === 'priority') {
          return sortAsc ? a.priority.localeCompare(b.priority) : b.priority.localeCompare(a.priority);
        }
        return sortAsc ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
      });
  }, [incidents, searchQuery, selectedPriority, selectedTeam, selectedStatus, sortField, sortAsc]);

  // ==============================================================================
  // 6. RENDER
  // ==============================================================================

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-emerald-500/20 selection:text-emerald-300 font-sans">
      {/* Top Navbar with Role Switcher & Audit Trigger */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Brand & Organization */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-950 font-black text-sm shadow-sm">
                P
              </div>
              <span className="font-semibold text-sm tracking-tight text-zinc-100">
                PulseOps <span className="text-zinc-500 font-mono text-xs font-normal">/ SLA Intelligence</span>
              </span>
            </div>

            <span className="hidden sm:inline text-zinc-700">|</span>

            {/* Live Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>En Vivo ({incidents.length} tickets)</span>
            </div>
          </div>

          {/* RBAC Selector & Actions */}
          <div className="flex items-center gap-3">
            {/* RBAC Simulator Dropdown */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl border border-zinc-800 bg-zinc-900/80 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-400 hidden sm:inline">Rol RBAC:</span>
              <select
                value={currentUserRole}
                onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                className="bg-transparent font-bold text-emerald-400 focus:outline-none cursor-pointer"
              >
                <option value="SuperAdmin" className="bg-zinc-950 text-white">SuperAdmin</option>
                <option value="Operator" className="bg-zinc-950 text-white">Operator</option>
                <option value="Auditor" className="bg-zinc-950 text-white">Auditor (Solo Lectura)</option>
              </select>
            </div>

            {/* Audit Log Drawer Button */}
            <button
              onClick={() => setIsAuditDrawerOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-zinc-300 transition-colors"
              title="Ver Audit Log"
            >
              <History className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Audit Log</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </button>

            {/* Create Incident Button */}
            <button
              disabled={currentUserRole === 'Auditor'}
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
              title={currentUserRole === 'Auditor' ? 'Acción restringida para el rol Auditor' : 'Crear incidente'}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuevo Ticket</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
        {/* Simulator Control Bar */}
        <LiveSimulatorControl
          isSimulating={isSimulating}
          onToggleSimulation={() => {
            setIsSimulating(!isSimulating);
            logAction(
              'SIMULATOR_STATE_TOGGLED',
              `Simulador de tickets puesto en estado: ${!isSimulating ? 'ACTIVO' : 'PAUSADO'}.`
            );
          }}
          intervalSpeed={simulatorSpeed}
          onChangeSpeed={(ms) => setSimulatorSpeed(ms)}
          generatedCount={generatedCount}
          onTriggerManualEvent={injectNewIncident}
        />

        {/* 4 KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricKpiCard
            metric={{
              id: 'sla',
              title: 'SLA Compliance Rate',
              value: `${metrics.slaComplianceRate}%`,
              rawValue: metrics.slaComplianceRate,
              trend: metrics.slaTrend,
              isPositive: metrics.slaComplianceRate >= 99.0,
              comparisonText: 'Objetivo SLA: ≥99.0%',
              status: metrics.slaComplianceRate >= 99.0 ? 'healthy' : 'critical',
              sparkline: [97.8, 98.2, 98.9, 98.4, 99.1, 99.0, metrics.slaComplianceRate],
            }}
          />

          <MetricKpiCard
            metric={{
              id: 'volume',
              title: 'Active Incident Volume',
              value: String(metrics.activeTickets),
              rawValue: metrics.activeTickets,
              trend: metrics.activeTrend,
              isPositive: true,
              comparisonText: 'Tickets en investigación',
              status: metrics.activeTickets > 8 ? 'warning' : 'healthy',
              sparkline: [12, 10, 8, 9, 7, 6, metrics.activeTickets],
            }}
          />

          <MetricKpiCard
            metric={{
              id: 'mttr',
              title: 'Mean Time to Resolve',
              value: `${metrics.mttrMinutes}m`,
              rawValue: metrics.mttrMinutes,
              trend: metrics.mttrTrend,
              isPositive: metrics.mttrMinutes <= 30,
              comparisonText: 'Meta: <30 min promedio',
              status: metrics.mttrMinutes <= 30 ? 'healthy' : 'warning',
              sparkline: [32, 28, 25, 22, 20, 19, metrics.mttrMinutes],
            }}
          />

          <MetricKpiCard
            metric={{
              id: 'critical',
              title: 'Critical Alerts (P1 / P2)',
              value: String(metrics.criticalAlerts),
              rawValue: metrics.criticalAlerts,
              trend: metrics.criticalTrend,
              isPositive: metrics.criticalAlerts === 0,
              comparisonText: 'Atención inmediata requerida',
              status: metrics.criticalAlerts > 0 ? 'critical' : 'healthy',
              sparkline: [4, 3, 2, 3, 2, 1, metrics.criticalAlerts],
            }}
          />
        </div>

        {/* Dynamic Time-Series Telemetry Chart */}
        <PulseTimeSeriesChart data={timeSeriesData} />

        {/* Incidents Table & Filter Bar */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md overflow-hidden">
          {/* Filter Bar */}
          <div className="p-4 border-b border-zinc-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input with Sanitization Feedback */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Buscar por ID, título o responsable..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-zinc-800 bg-zinc-950/80 text-xs text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
              {sanitizedSearchWarning && (
                <div className="absolute left-0 top-full mt-1.5 z-20 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-[10px] text-rose-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-3 h-3 text-rose-400" />
                  <span>XSS neutralizado: se detectaron etiquetas no seguras en la búsqueda.</span>
                </div>
              )}
            </div>

            {/* Quick Filter Selectors */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Priority Filter */}
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="rounded-xl border border-zinc-800 bg-zinc-950/90 px-3 py-2 text-xs text-zinc-300 focus:border-emerald-500 focus:outline-none"
              >
                <option value="ALL">Todas las Prioridades</option>
                <option value="P1_CRITICAL">P1 - Crítico</option>
                <option value="P2_HIGH">P2 - Alto</option>
                <option value="P3_MEDIUM">P3 - Medio</option>
                <option value="P4_LOW">P4 - Bajo</option>
              </select>

              {/* Team Filter */}
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="rounded-xl border border-zinc-800 bg-zinc-950/90 px-3 py-2 text-xs text-zinc-300 focus:border-emerald-500 focus:outline-none"
              >
                <option value="ALL">Todos los Equipos</option>
                <option value="SRE Especialistas">SRE Especialistas</option>
                <option value="N2 Support">N2 Support</option>
                <option value="N1 Triage">N1 Triage</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-xl border border-zinc-800 bg-zinc-950/90 px-3 py-2 text-xs text-zinc-300 focus:border-emerald-500 focus:outline-none"
              >
                <option value="ALL">Todos los Estados</option>
                <option value="ACTIVE">Solo Activos (Open/Investigating)</option>
                <option value="RESOLVED">Solo Resueltos</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950/80 text-zinc-500 font-mono uppercase text-[10px] tracking-wider border-b border-zinc-800/80">
                <tr>
                  <th className="px-5 py-3.5">Ticket ID</th>
                  <th className="px-5 py-3.5">Título / Resumen</th>
                  <th className="px-5 py-3.5">Severidad</th>
                  <th className="px-5 py-3.5">Estado</th>
                  <th className="px-5 py-3.5">Equipo</th>
                  <th className="px-5 py-3.5">Tolerancia SLA</th>
                  <th className="px-5 py-3.5">Responsable</th>
                  <th className="px-5 py-3.5 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-sans">
                {filteredIncidents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-zinc-500">
                      No se encontraron incidentes con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  filteredIncidents.map((inc) => {
                    const isResolved = inc.status === 'RESOLVED' || inc.status === 'CLOSED';
                    return (
                      <tr
                        key={inc.id}
                        className="hover:bg-zinc-800/30 transition-colors cursor-pointer"
                        onClick={() => setSelectedIncidentForDetail(inc)}
                      >
                        <td className="px-5 py-3.5 font-mono text-zinc-300 font-semibold whitespace-nowrap">
                          {inc.ticketNumber}
                        </td>
                        <td className="px-5 py-3.5 text-zinc-200 max-w-sm truncate font-medium">
                          {inc.title}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                              inc.priority === 'P1_CRITICAL'
                                ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                                : inc.priority === 'P2_HIGH'
                                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                            }`}
                          >
                            {inc.priority}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className="text-zinc-400 flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isResolved
                                  ? 'bg-emerald-400'
                                  : inc.status === 'INVESTIGATING'
                                  ? 'bg-amber-400'
                                  : 'bg-rose-400'
                              }`}
                            />
                            {inc.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-zinc-400 font-mono whitespace-nowrap">{inc.team}</td>
                        <td className="px-5 py-3.5 font-mono font-bold whitespace-nowrap">
                          {inc.slaBreached ? (
                            <span className="text-rose-400">Incumplido</span>
                          ) : isResolved ? (
                            <span className="text-emerald-400">{inc.timeToResolveMinutes || 25}m</span>
                          ) : (
                            <span className="text-zinc-300">{inc.slaTargetMinutes}m meta</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-zinc-400 whitespace-nowrap">{inc.assignee}</td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedIncidentForDetail(inc);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      <IncidentDetailModal
        incident={selectedIncidentForDetail}
        onClose={() => setSelectedIncidentForDetail(null)}
        currentUserRole={currentUserRole}
        onResolve={handleResolveIncident}
        onInvestigate={handleInvestigateIncident}
      />

      {/* Create Modal */}
      <CreateIncidentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        currentUserRole={currentUserRole}
        onCreateIncident={handleCreateIncident}
      />

      {/* Audit Trail Drawer */}
      <AuditLogDrawer
        isOpen={isAuditDrawerOpen}
        onClose={() => setIsAuditDrawerOpen(false)}
        logs={auditLogs}
      />
    </div>
  );
};
