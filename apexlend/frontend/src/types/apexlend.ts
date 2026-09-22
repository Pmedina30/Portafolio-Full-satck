export type UserRole = 'Oficial de Crédito' | 'Comité de Riesgos' | 'Auditor';

export type AmortizationSystem = 'frances' | 'aleman';

export interface AmortizationRow {
  installmentNumber: number;
  paymentDate: string;
  paymentAmount: number;
  principalAmount: number;
  interestAmount: number;
  insuranceAmount: number;
  remainingBalance: number;
}

export interface LoanCalculationResult {
  monthlyPayment: number;
  initialPayment: number;
  finalPayment: number;
  totalInterest: number;
  totalInsurance: number;
  totalCost: number;
  effectiveAnnualRate: number; // TEA
  monthlyRate: number; // TEM
  schedule: AmortizationRow[];
}

export interface LoanAccount {
  id: string;
  clientName: string;
  nationalId: string;
  bankAccount: string;
  principalAmount: number;
  termMonths: number;
  teaRate: number;
  system: AmortizationSystem;
  startDate: string;
  status: 'active' | 'in_arrears' | 'paid_off' | 'pending_approval';
  currentBalance: number;
  daysOverdue: number;
  installmentsPaid: number;
  totalInstallments: number;
  monthlyInstallmentAmount: number;
  nextDueDate: string;
}

export interface ReceivableInstallment {
  id: string;
  loanId: string;
  installmentNumber: number;
  clientName: string;
  nationalId: string;
  bankAccount: string;
  dueDate: string;
  totalAmount: number;
  principal: number;
  interest: number;
  insurance: number;
  penaltyFee: number;
  status: 'paid' | 'due_today' | 'due_this_week' | 'overdue' | 'future';
  daysOverdue: number;
  paidAt?: string;
}

export interface AuditLedgerBlock {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: 'DISBURSEMENT' | 'PAYMENT_COLLECTED' | 'LOAN_APPROVED' | 'WAIVE_PENALTY' | 'TOGGLE_MASK';
  details: string;
  loanId?: string;
  amount?: number;
  previousHash: string;
  hash: string;
}

export interface PortfolioMetrics {
  placedCapital: number;
  monthlyInterest: number;
  par30Ratio: number;
  totalActiveClients: number;
  collectionEfficiency: number;
  collectedThisMonth: number;
  projectedThisMonth: number;
}
