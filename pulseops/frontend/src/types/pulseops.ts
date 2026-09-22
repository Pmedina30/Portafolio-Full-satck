export type UserRole = 'SuperAdmin' | 'Operator' | 'Auditor';

export type Priority = 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MEDIUM' | 'P4_LOW';

export type IncidentStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';

export type TeamSquad = 'N1 Triage' | 'N2 Support' | 'SRE Especialistas';

export type TimeframeFilter = 'ALL' | '1H' | '6H' | 'TODAY' | '7D';

export type MetricTab = 'SLA' | 'VOLUME' | 'MTTR';

export interface Incident {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  priority: Priority;
  status: IncidentStatus;
  team: TeamSquad;
  createdAt: string; // ISO string
  resolvedAt?: string;
  slaTargetMinutes: number;
  timeToResolveMinutes?: number;
  slaBreached: boolean;
  assignee: string;
  rawTitleBeforeSanitization?: string;
  sanitizationTriggered?: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  role: UserRole;
  details: string;
  severity: 'info' | 'warning' | 'danger';
}

export interface OperationalMetrics {
  slaComplianceRate: number; // e.g. 99.2%
  slaTrend: string;
  activeTickets: number;
  activeTrend: string;
  mttrMinutes: number; // e.g. 18.5 min
  mttrTrend: string;
  criticalAlerts: number;
  criticalTrend: string;
}

export interface TimeSeriesPoint {
  time: string;
  sla: number;
  volume: number;
  mttr: number;
  openCount: number;
  resolvedCount: number;
}
