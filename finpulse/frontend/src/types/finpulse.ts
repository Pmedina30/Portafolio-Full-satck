export type TransactionCategory =
  | 'Software & SaaS'
  | 'Travel & Lodging'
  | 'Meals & Entertainment'
  | 'Office & Hardware'
  | 'Marketing & Ads'
  | 'Professional Services';

export type TransactionStatus = 'pending' | 'approved' | 'frozen';

export type TransactionSeverity = 'critical' | 'warning' | 'normal';

export interface Transaction {
  id: string;
  date: string;
  time: string;
  merchant: string;
  category: TransactionCategory;
  amount: number;
  accountNumber: string;
  employeeName: string;
  employeeDepartment: string;
  status: TransactionStatus;
  notes?: string;
  isOffHours: boolean;
}

export interface AnalyzedTransaction extends Transaction {
  zScore: number;
  categoryMean: number;
  categoryStdDev: number;
  severity: TransactionSeverity;
  deviationPercent: number;
  anomalyReasons: string[];
  riskScore: number; // 0 - 100
}

export interface CategoryStatistics {
  category: TransactionCategory;
  count: number;
  mean: number;
  stdDev: number;
  min: number;
  max: number;
  total: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: 'APPROVE_TX' | 'FREEZE_TX' | 'INJECT_TEST' | 'UPLOAD_CSV' | 'UNMASK_DATA' | 'MASK_DATA';
  transactionId?: string;
  details: string;
  previousHash: string;
  hash: string;
}

export interface OperationalMetrics {
  capitalAtRisk: number;
  totalAudited: number;
  transactionCount: number;
  criticalCount: number;
  warningCount: number;
  frozenCount: number;
  approvedCount: number;
  avgCriticalZScore: number;
}
