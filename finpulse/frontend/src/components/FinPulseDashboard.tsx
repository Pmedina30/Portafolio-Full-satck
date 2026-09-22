import React, { useState, useMemo, useCallback } from 'react';
import { FinPulseHeader } from './FinPulseHeader';
import { TopMetricsBar } from './TopMetricsBar';
import { StatisticalDispersionChart } from './StatisticalDispersionChart';
import { TransactionsTable } from './TransactionsTable';
import { TransactionDetailDrawer } from './TransactionDetailDrawer';
import { SecurityPinModal } from './SecurityPinModal';
import { AuditTrailModal } from './AuditTrailModal';
import { CsvUploaderModal } from './CsvUploaderModal';
import { INITIAL_TRANSACTIONS } from '../data/initialTransactions';
import {
  analyzeTransactions,
  calculateOperationalMetrics,
  calculateCategoryStats,
} from '../utils/statistics';
import {
  INITIAL_AUDIT_LOG,
  computeSha256,
} from '../utils/cryptoSecurity';
import { Transaction, AnalyzedTransaction, AuditLogEntry, TransactionCategory } from '../types/finpulse';

export const FinPulseDashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [isMasked, setIsMasked] = useState<boolean>(true);
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState<boolean>(false);
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOG);

  // Real-time statistical analysis
  const analyzedTransactions = useMemo(() => {
    return analyzeTransactions(transactions);
  }, [transactions]);

  // Operational metrics
  const metrics = useMemo(() => {
    return calculateOperationalMetrics(analyzedTransactions);
  }, [analyzedTransactions]);

  // Currently selected transaction for drawer
  const selectedTransaction = useMemo(() => {
    if (!selectedTxId) return null;
    return analyzedTransactions.find((t) => t.id === selectedTxId) || null;
  }, [selectedTxId, analyzedTransactions]);

  // Append new audit block with SHA-256 hash chain
  const appendAuditLog = useCallback(
    async (
      actor: string,
      action: AuditLogEntry['action'],
      details: string,
      txId?: string
    ) => {
      const prevEntry = auditLog[auditLog.length - 1];
      const prevHash = prevEntry
        ? prevEntry.hash
        : '0000000000000000000000000000000000000000000000000000000000000000';
      const timestamp = new Date().toISOString();
      const rawPayload = `${prevHash}|${timestamp}|${actor}|${action}|${details}|${txId || ''}`;
      const hash = await computeSha256(rawPayload);

      const newEntry: AuditLogEntry = {
        id: `LOG-${(auditLog.length + 1).toString().padStart(4, '0')}`,
        timestamp,
        actor,
        action,
        details,
        transactionId: txId,
        previousHash: prevHash,
        hash,
      };

      setAuditLog((prev) => [...prev, newEntry]);
    },
    [auditLog]
  );

  // Approve Transaction
  const handleApprove = useCallback(
    (id: string) => {
      setTransactions((prev) =>
        prev.map((tx) => (tx.id === id ? { ...tx, status: 'approved' } : tx))
      );
      const target = transactions.find((t) => t.id === id);
      appendAuditLog(
        'Lead Controller (Auditor)',
        'APPROVE_TX',
        `Aprobación formal de gasto por $${target?.amount.toFixed(2) || '0.00'} en ${target?.merchant || id}`,
        id
      );
    },
    [transactions, appendAuditLog]
  );

  // Freeze Transaction
  const handleFreeze = useCallback(
    (id: string) => {
      setTransactions((prev) =>
        prev.map((tx) => (tx.id === id ? { ...tx, status: 'frozen' } : tx))
      );
      const target = transactions.find((t) => t.id === id);
      appendAuditLog(
        'Automated Risk Sentinel',
        'FREEZE_TX',
        `Retención preventiva de capital ($${target?.amount.toFixed(2) || '0.00'}) en ${target?.merchant || id} por desvío estadístico`,
        id
      );
    },
    [transactions, appendAuditLog]
  );

  // Inject Test Transactions
  const handleInjectTestData = useCallback(() => {
    const randomMerchants: {
      merchant: string;
      category: TransactionCategory;
      amount: number;
      isOffHours: boolean;
      notes: string;
    }[] = [
      {
        merchant: 'Palantir Foundry Enterprise AI',
        category: 'Software & SaaS',
        amount: 8200.0,
        isOffHours: false,
        notes: 'Inyección de prueba: licencia trimestral data intelligence',
      },
      {
        merchant: 'Midnight VIP Yacht Charters',
        category: 'Meals & Entertainment',
        amount: 22400.0,
        isOffHours: true,
        notes: 'Inyección de prueba: evento nocturno anómalo de alto riesgo',
      },
      {
        merchant: 'WeWork All-Access Global Passes',
        category: 'Office & Hardware',
        amount: 1250.0,
        isOffHours: false,
        notes: 'Inyección de prueba: membresías de coworking remoto',
      },
    ];

    const pick = randomMerchants[Math.floor(Math.random() * randomMerchants.length)];
    const newId = `TX-2026-${Math.floor(1200 + Math.random() * 800)}`;
    const now = new Date();
    const timeStr = pick.isOffHours
      ? '03:45 AM'
      : `${now.getHours() % 12 || 12}:${now.getMinutes().toString().padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;

    const newTx: Transaction = {
      id: newId,
      date: now.toISOString().split('T')[0],
      time: timeStr,
      merchant: pick.merchant,
      category: pick.category,
      amount: pick.amount,
      accountNumber: 'CORP-8899-4411',
      employeeName: 'Simulated Agent',
      employeeDepartment: 'Risk Audit Lab',
      status: 'pending',
      notes: pick.notes,
      isOffHours: pick.isOffHours,
    };

    setTransactions((prev) => [newTx, ...prev]);
    appendAuditLog(
      'Forense Synthetic Generator',
      'INJECT_TEST',
      `Inyección de lote sintético: ${newTx.id} ($${newTx.amount.toFixed(2)} en ${newTx.category})`,
      newTx.id
    );
  }, [appendAuditLog]);

  // Import CSV Transactions
  const handleImportCsv = useCallback(
    (imported: Transaction[]) => {
      setTransactions((prev) => [...imported, ...prev]);
      appendAuditLog(
        'Compliance Auditor',
        'UPLOAD_CSV',
        `Carga externa de archivo CSV con ${imported.length} transacciones nuevas incorporadas al modelo gaussiano`
      );
    },
    [appendAuditLog]
  );

  // Export Audit Report
  const handleExportReport = useCallback(() => {
    const headers = [
      'Transaction_ID',
      'Date',
      'Time',
      'Merchant',
      'Category',
      'Amount_USD',
      'Category_Mean_USD',
      'Category_StdDev_USD',
      'Z_Score',
      'Severity',
      'Status',
      'Employee',
      'Account',
      'Off_Hours',
      'Reasons',
    ];

    const rows = analyzedTransactions.map((t) => [
      t.id,
      t.date,
      t.time,
      `"${t.merchant.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      t.amount.toFixed(2),
      t.categoryMean.toFixed(2),
      t.categoryStdDev.toFixed(2),
      t.zScore.toFixed(3),
      t.severity,
      t.status,
      `"${t.employeeName}"`,
      t.accountNumber,
      t.isOffHours ? 'YES' : 'NO',
      `"${t.anomalyReasons.join(' | ').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `finpulse_auditoria_reporte_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [analyzedTransactions]);

  // Toggle Masked Mode
  const handleToggleMask = useCallback(() => {
    if (isMasked) {
      // Prompt for PIN to unlock
      setIsPinModalOpen(true);
    } else {
      // Re-lock
      setIsMasked(true);
      appendAuditLog(
        'Security Daemon',
        'MASK_DATA',
        'Re-enmascaramiento preventivo de cuentas y montos confidenciales activado'
      );
    }
  }, [isMasked, appendAuditLog]);

  const handlePinSuccess = useCallback(() => {
    setIsMasked(false);
    appendAuditLog(
      'Senior Auditor (PIN Validated)',
      'UNMASK_DATA',
      'Autenticación biométrica/PIN exitosa: Desbloqueo temporal de datos contables en claro'
    );
  }, [appendAuditLog]);

  return (
    <div className="min-h-screen bg-[#080a10] text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <FinPulseHeader
        isMasked={isMasked}
        onToggleMask={handleToggleMask}
        onOpenAuditTrail={() => setIsAuditModalOpen(true)}
        onOpenCsvModal={() => setIsCsvModalOpen(true)}
        onInjectTestData={handleInjectTestData}
        onExportReport={handleExportReport}
        auditCount={auditLog.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* KPI Summary Cards */}
        <TopMetricsBar metrics={metrics} isMasked={isMasked} />

        {/* Statistical Dispersion & Gaussian Scatter Plot */}
        <StatisticalDispersionChart
          transactions={analyzedTransactions}
          isMasked={isMasked}
          onSelectTransaction={(tx) => setSelectedTxId(tx.id)}
        />

        {/* Interactive Transactions & Audit Table */}
        <TransactionsTable
          transactions={analyzedTransactions}
          isMasked={isMasked}
          onSelectTransaction={(tx) => setSelectedTxId(tx.id)}
          onApproveTransaction={handleApprove}
          onFreezeTransaction={handleFreeze}
        />
      </main>

      {/* Slide-over Transaction Detail Drawer */}
      <TransactionDetailDrawer
        transaction={selectedTransaction}
        isOpen={!!selectedTxId}
        onClose={() => setSelectedTxId(null)}
        isMasked={isMasked}
        onApprove={handleApprove}
        onFreeze={handleFreeze}
      />

      {/* PIN Unlock Modal */}
      <SecurityPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handlePinSuccess}
      />

      {/* Cryptographic Audit Ledger Modal */}
      <AuditTrailModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        auditLog={auditLog}
      />

      {/* CSV Import Modal */}
      <CsvUploaderModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onImportTransactions={handleImportCsv}
      />
    </div>
  );
};
