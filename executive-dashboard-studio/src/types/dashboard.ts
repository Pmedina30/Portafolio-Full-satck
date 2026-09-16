export interface RawDataRow {
  [key: string]: any;
}

export type ColumnRole = 
  | 'date' 
  | 'status' 
  | 'metric' 
  | 'cause' 
  | 'region' 
  | 'route' 
  | 'resource' 
  | 'none';

export interface DetectedColumnInfo {
  columnName: string;
  sampleValues: any[];
  suggestedRole: ColumnRole;
  confidence: number;
}

export interface ColumnMappingConfig {
  dateCol: string;
  statusCol: string;
  delayMinutesCol: string;
  causeCol: string;
  regionCol: string;
  routeCol: string;
  resourceCol: string;
  otpThreshold: number; // e.g. <= 15 min for On-Time
}

export interface CalculatedKpis {
  totalVolume: number;
  otpRate: number;
  otpRateDelta: number;
  delayedCount: number;
  delayedRate: number;
  avgDelayMinutes: number;
  formattedAvgDuration: string;
  criticalFailuresCount: number;
  criticalFailuresRate: number;
  totalDelayHoursFormatted: string;
}

export interface TimeSeriesPoint {
  period: string;
  total: number;
  onTime: number;
  delayed: number;
  cancelled: number;
  otpPercentage: number;
  targetBenchmark: number;
}

export interface ParetoCauseItem {
  cause: string;
  count: number;
  totalMinutes: number;
  percentage: number;
  cumulativePercentage: number;
  severityColor?: string;
}

export interface RegionDistribution {
  region: string;
  count: number;
  percentage: number;
  otpRate: number;
  color: string;
}

export interface RouteMetric {
  route: string;
  volume: number;
  onTimeCount: number;
  delayedCount: number;
  otpRate: number;
  avgDelayMinutes: number;
}

export interface FleetStatusItem {
  tailNumber: string;
  model: string;
  status: 'On-Schedule' | 'In-Flight' | 'Delayed' | 'Maintenance';
  flightsCount: number;
  otpRate: number;
  lastRoute?: string;
}

export interface BrandingTheme {
  companyName: string;
  logoUrl: string;
  primaryColor: string;     // Default #0B1340 (Navy)
  accentColor: string;      // Default #6B21A8 (Purple)
  highlightColor: string;   // Default #00C3DE (Cyan)
  dashboardTitle: string;
  dashboardSubtitle: string;
  periodLabel: string;
}

export type ActiveNavTab = 
  | 'overview' 
  | 'otp' 
  | 'delays' 
  | 'operations' 
  | 'routes' 
  | 'fleet' 
  | 'reports';

