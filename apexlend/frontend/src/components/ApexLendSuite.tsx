import React, { useState, useMemo, useCallback } from 'react';
import { AppleHeader } from './AppleHeader';
import { HeroTitle } from './HeroTitle';
import { PortfolioMetricsBar } from './PortfolioMetricsBar';
import { ReceivablesChart } from './ReceivablesChart';
import { LoanCalculatorSection } from './LoanCalculatorSection';
import { PendingInstallmentsTable } from './PendingInstallmentsTable';
import { PaymentCollectionModal } from './PaymentCollectionModal';
import { TwoFactorAuthModal } from './TwoFactorAuthModal';
import { AuditLedgerDrawer } from './AuditLedgerDrawer';
import {
  INITIAL_LOANS,
  INITIAL_INSTALLMENTS,
  INITIAL_AUDIT_LEDGER,
} from '../data/initialData';
import {
  UserRole,
  LoanAccount,
  ReceivableInstallment,
  AuditLedgerBlock,
  AmortizationSystem,
  PortfolioMetrics,
} from '../types/apexlend';
import { calculateAmortizationSchedule, generateSha256 } from '../utils/finance';

export const ApexLendSuite: React.FC = () => {
  const [role, setRole] = useState<UserRole>('Oficial de Crédito');
  const [isMasked, setIsMasked] = useState<boolean>(true);
  const [loans, setLoans] = useState<LoanAccount[]>(INITIAL_LOANS);
  const [installments, setInstallments] = useState<ReceivableInstallment[]>(INITIAL_INSTALLMENTS);
  const [ledger, setLedger] = useState<AuditLedgerBlock[]>(INITIAL_AUDIT_LEDGER);

  // Modals & Drawers state
  const [isLedgerOpen, setIsLedgerOpen] = useState<boolean>(false);
  const [selectedInstallment, setSelectedInstallment] = useState<ReceivableInstallment | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isTwoFactorOpen, setIsTwoFactorOpen] = useState<boolean>(false);
  const [pendingDisbursement, setPendingDisbursement] = useState<{
    clientName: string;
    amount: number;
    term: number;
    tea: number;
    system: AmortizationSystem;
  } | null>(null);

  const [notification, setNotification] = useState<string | null>(null);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Helper to append signed block to cryptographic ledger
  const appendLedgerBlock = useCallback(
    async (
      action: AuditLedgerBlock['action'],
      details: string,
      loanId?: string,
      amount?: number
    ) => {
      const prevBlock = ledger[ledger.length - 1];
      const prevHash = prevBlock
        ? prevBlock.hash
        : '0000000000000000000000000000000000000000000000000000000000000000';
      const timestamp = new Date().toISOString();
      const rawText = `${prevHash}|${timestamp}|${role}|${action}|${details}|${loanId || ''}|${amount || 0}`;
      const hash = await generateSha256(rawText);

      const newBlock: AuditLedgerBlock = {
        id: `LEDGER-${(ledger.length + 1).toString().padStart(4, '0')}`,
        timestamp,
        actor: role === 'Comité de Riesgos' ? 'Dr. Hernán Saavedra' : role === 'Auditor' ? 'Lic. Marcela Ibañez' : 'Lic. Claudia Mendoza',
        role,
        action,
        details,
        loanId,
        amount,
        previousHash: prevHash,
        hash,
      };

      setLedger((prev) => [...prev, newBlock]);
    },
    [ledger, role]
  );

  // Dynamic Portfolio Metrics calculation
  const metrics: PortfolioMetrics = useMemo(() => {
    const placedCapital = loans
      .filter((l) => l.status === 'active' || l.status === 'in_arrears')
      .reduce((sum, l) => sum + l.currentBalance, 0);

    const totalActiveClients = loans.filter((l) => l.status === 'active' || l.status === 'in_arrears').length;

    const overdueBalance = loans
      .filter((l) => l.status === 'in_arrears' && l.daysOverdue > 30)
      .reduce((sum, l) => sum + l.currentBalance, 0);

    const par30Ratio = placedCapital > 0 ? (overdueBalance / placedCapital) * 100 : 0;

    const collectedThisMonth = installments
      .filter((i) => i.status === 'paid')
      .reduce((sum, i) => sum + i.totalAmount, 0);

    const pendingThisMonth = installments
      .filter((i) => i.status !== 'paid')
      .reduce((sum, i) => sum + i.totalAmount, 0);

    const projectedThisMonth = collectedThisMonth + pendingThisMonth;
    const collectionEfficiency = projectedThisMonth > 0 ? (collectedThisMonth / projectedThisMonth) * 100 : 98.2;

    const monthlyInterest = installments.reduce((sum, i) => sum + i.interest, 0) * 1.65;

    return {
      placedCapital,
      monthlyInterest,
      par30Ratio,
      totalActiveClients,
      collectionEfficiency,
      collectedThisMonth,
      projectedThisMonth,
    };
  }, [loans, installments]);

  // Handle Disbursement Flow (with 2FA check if > $15,000)
  const handleRequestDisbursement = (
    clientName: string,
    amount: number,
    term: number,
    tea: number,
    system: AmortizationSystem
  ) => {
    const data = { clientName, amount, term, tea, system };
    if (amount >= 15000 || role === 'Comité de Riesgos') {
      setPendingDisbursement(data);
      setIsTwoFactorOpen(true);
    } else {
      executeDisbursement(data);
    }
  };

  const executeDisbursement = async (data: {
    clientName: string;
    amount: number;
    term: number;
    tea: number;
    system: AmortizationSystem;
  }) => {
    const newLoanId = `LN-2026-${Math.floor(8920 + Math.random() * 80)}`;
    const newLoan: LoanAccount = {
      id: newLoanId,
      clientName: data.clientName,
      nationalId: `402-${Math.floor(1000000 + Math.random() * 8999999)}-${Math.floor(Math.random() * 9)}`,
      bankAccount: `960-${Math.floor(100000 + Math.random() * 899999)}-${Math.floor(1000 + Math.random() * 8999)}`,
      principalAmount: data.amount,
      termMonths: data.term,
      teaRate: data.tea,
      system: data.system,
      startDate: new Date().toISOString().split('T')[0],
      status: 'active',
      currentBalance: data.amount,
      daysOverdue: 0,
      installmentsPaid: 0,
      totalInstallments: data.term,
      monthlyInstallmentAmount: data.amount / data.term * 1.1,
      nextDueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    };

    // Calculate schedule and create first installment
    const schedule = calculateAmortizationSchedule(data.amount, data.term, data.tea, data.system);
    const firstRow = schedule.schedule[0];

    const newInst: ReceivableInstallment = {
      id: `CUO-2026-${Math.floor(100 + Math.random() * 899)}`,
      loanId: newLoanId,
      installmentNumber: 1,
      clientName: data.clientName,
      nationalId: newLoan.nationalId,
      bankAccount: newLoan.bankAccount,
      dueDate: firstRow.paymentDate,
      totalAmount: firstRow.paymentAmount,
      principal: firstRow.principalAmount,
      interest: firstRow.interestAmount,
      insurance: firstRow.insuranceAmount,
      penaltyFee: 0,
      status: 'due_this_week',
      daysOverdue: 0,
    };

    setLoans((prev) => [newLoan, ...prev]);
    setInstallments((prev) => [newInst, ...prev]);

    await appendLedgerBlock(
      'DISBURSEMENT',
      `Desembolso aprobado por ${data.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} para ${data.clientName} (${data.term} meses, ${data.tea}% TEA, Sistema ${data.system})`,
      newLoanId,
      data.amount
    );

    triggerNotification(`Préstamo ${newLoanId} aprobado y desembolsado exitosamente.`);
    setPendingDisbursement(null);
  };

  // Handle Payment Collection
  const handleOpenPaymentModal = (inst: ReceivableInstallment) => {
    setSelectedInstallment(inst);
    setIsPaymentModalOpen(true);
  };

  const handleConfirmPayment = async (
    installmentId: string,
    method: string,
    waivedPenalty: boolean
  ) => {
    const inst = installments.find((i) => i.id === installmentId);
    if (!inst) return;

    const paidAmount = inst.totalAmount - (waivedPenalty ? inst.penaltyFee : 0);
    const paidTimestamp = new Date().toISOString();

    // 1. Update installment status
    setInstallments((prev) =>
      prev.map((item) =>
        item.id === installmentId
          ? {
              ...item,
              status: 'paid',
              paidAt: paidTimestamp,
              penaltyFee: waivedPenalty ? 0 : item.penaltyFee,
            }
          : item
      )
    );

    // 2. Reduce loan balance
    setLoans((prev) =>
      prev.map((l) =>
        l.id === inst.loanId
          ? {
              ...l,
              currentBalance: Math.max(0, l.currentBalance - inst.principal),
              installmentsPaid: l.installmentsPaid + 1,
              status: l.installmentsPaid + 1 >= l.totalInstallments ? 'paid_off' : l.daysOverdue > 0 ? 'active' : l.status,
              daysOverdue: 0,
            }
          : l
      )
    );

    // 3. Append to signed Ledger
    await appendLedgerBlock(
      'PAYMENT_COLLECTED',
      `Amortización de cuota ${inst.id} ($${paidAmount.toFixed(2)}) de ${inst.clientName} vía ${method}${waivedPenalty ? ' (Mora condonada)' : ''}`,
      inst.loanId,
      paidAmount
    );

    triggerNotification(`Cobro de ${inst.id} registrado exitosamente. Saldo deudor amortizado.`);
  };

  const handleRoleChange = async (newRole: UserRole) => {
    setRole(newRole);
    triggerNotification(`Perfil de seguridad actualizado a: ${newRole}`);
  };

  const handleToggleMask = async () => {
    const nextMasked = !isMasked;
    setIsMasked(nextMasked);
    await appendLedgerBlock(
      'TOGGLE_MASK',
      nextMasked
        ? 'Ofuscación de PII activada (enmascarando cédulas y cuentas bancarias)'
        : 'Visualización de PII en claro autorizada temporalmente'
    );
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#1d1d1f] flex flex-col font-sans selection:bg-[#0071e3]/10 selection:text-[#0071e3]">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-[#ffffff] border border-[#d6d6d6] rounded-full px-5 py-2.5 text-[13px] font-medium text-[#1d1d1f] shadow-none animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0071e3]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <AppleHeader
        role={role}
        onRoleChange={handleRoleChange}
        isMasked={isMasked}
        onToggleMask={handleToggleMask}
        onOpenLedger={() => setIsLedgerOpen(true)}
        ledgerCount={ledger.length}
      />

      {/* Hero Section */}
      <HeroTitle />

      {/* Section 1: Portfolio Metrics & Receivables Chart */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12 sm:pb-16 space-y-6">
        <PortfolioMetricsBar metrics={metrics} />
        <ReceivablesChart />
      </section>

      {/* Section 2: Interactive Loan Calculator & Amortization Engine (Studio Mist Background) */}
      <LoanCalculatorSection
        role={role}
        onRequestDisbursement={handleRequestDisbursement}
      />

      {/* Section 3: Pending Installments & Collection Management */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-16">
        <PendingInstallmentsTable
          installments={installments}
          isMasked={isMasked}
          role={role}
          onSelectInstallmentToPay={handleOpenPaymentModal}
        />
      </section>

      {/* Footer */}
      <footer className="border-t border-[#d6d6d6] bg-[#f5f5f7] py-8 text-center text-[12px] text-[#707070]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>ApexLend Suite Financiera • Diseñado bajo las Guías Apple White Gallery</div>
          <div className="flex items-center gap-4">
            <span>Cero Sombras</span>
            <span>•</span>
            <span>Bordes Hairline 1px</span>
            <span>•</span>
            <span>Cálculo Francés & Alemán</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <PaymentCollectionModal
        installment={selectedInstallment}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        isMasked={isMasked}
        role={role}
        onConfirmPayment={handleConfirmPayment}
      />

      <TwoFactorAuthModal
        isOpen={isTwoFactorOpen}
        onClose={() => setIsTwoFactorOpen(false)}
        onSuccess={() => pendingDisbursement && executeDisbursement(pendingDisbursement)}
        disbursementData={pendingDisbursement}
      />

      <AuditLedgerDrawer
        isOpen={isLedgerOpen}
        onClose={() => setIsLedgerOpen(false)}
        ledger={ledger}
      />
    </div>
  );
};

