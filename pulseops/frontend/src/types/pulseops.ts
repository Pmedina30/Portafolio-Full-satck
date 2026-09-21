export type TeamFilter = 'ALL' | 'SRE-CORE' | 'L2-OPS' | 'BILLING-IOCC';
export type ShiftFilter = 'ALL' | 'MORNING' | 'EVENING' | 'NIGHT';
export type DateRangePreset = 'LIVE' | '6H' | 'TODAY' | '7D' | '30D';
export type ActiveMetricTab = 'SLA' | 'VOLUME' | 'MTTR';

export interface KpiMetric {
  id: string;
  title: string;
  value: string;
  rawValue: number;
  trend: string;
  isPositive: boolean;
  comparisonText: string;
  status: 'healthy' | 'warning' | 'critical';
  sparkline: number[];
}

export interface TimeSeriesPoint {
  time: string;
  sla: number;
  volume: number;
  mttr: number;
  shift: string;
}

export interface LivePulseEvent {
  timestamp: string;
  activeIncidents: number;
  slaComplianceRate: number;
  mttrMinutes: number;
  shiftConcurrency: number;
  latestEvent: {
    ticketNumber: string;
    title: string;
    priority: string;
    status: string;
    timeAgo: string;
  };
}
