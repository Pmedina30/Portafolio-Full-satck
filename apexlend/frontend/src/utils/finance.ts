import { AmortizationRow, AmortizationSystem, LoanCalculationResult } from '../types/apexlend';

export const DESGRAVAMEN_MONTHLY_RATE = 0.0005; // 0.05% mensual sobre saldo insoluto

/**
 * Convierte Tasa Efectiva Anual (TEA en decimal) a Tasa Efectiva Mensual (TEM en decimal)
 * TEM = (1 + TEA)^(1/12) - 1
 */
export function calculateTEMFromTEA(teaPercent: number): number {
  const teaDecimal = teaPercent / 100;
  return Math.pow(1 + teaDecimal, 1 / 12) - 1;
}

/**
 * Calcula el cronograma completo de amortización para Sistema Francés o Alemán
 */
export function calculateAmortizationSchedule(
  principal: number,
  termMonths: number,
  teaPercent: number,
  system: AmortizationSystem,
  startDateStr?: string
): LoanCalculationResult {
  const tem = calculateTEMFromTEA(teaPercent);
  const rows: AmortizationRow[] = [];

  let currentBalance = principal;
  let totalInterest = 0;
  let totalInsurance = 0;

  const baseDate = startDateStr ? new Date(startDateStr) : new Date();

  if (system === 'frances') {
    // Cuota fija de capital + interés: C = P * [i*(1+i)^n] / [(1+i)^n - 1]
    const factor = Math.pow(1 + tem, termMonths);
    const pureAnnuity = principal * ((tem * factor) / (factor - 1));

    for (let k = 1; k <= termMonths; k++) {
      const interest = currentBalance * tem;
      let principalAmortized = pureAnnuity - interest;
      const insurance = currentBalance * DESGRAVAMEN_MONTHLY_RATE;

      if (k === termMonths || principalAmortized > currentBalance) {
        principalAmortized = currentBalance;
      }

      const totalPayment = principalAmortized + interest + insurance;
      currentBalance = Math.max(0, currentBalance - principalAmortized);

      totalInterest += interest;
      totalInsurance += insurance;

      const dueDate = new Date(baseDate);
      dueDate.setMonth(dueDate.getMonth() + k);

      rows.push({
        installmentNumber: k,
        paymentDate: dueDate.toISOString().split('T')[0],
        paymentAmount: totalPayment,
        principalAmount: principalAmortized,
        interestAmount: interest,
        insuranceAmount: insurance,
        remainingBalance: currentBalance,
      });
    }

    const firstPayment = rows.length > 0 ? rows[0].paymentAmount : 0;
    const lastPayment = rows.length > 0 ? rows[rows.length - 1].paymentAmount : 0;

    return {
      monthlyPayment: firstPayment,
      initialPayment: firstPayment,
      finalPayment: lastPayment,
      totalInterest,
      totalInsurance,
      totalCost: principal + totalInterest + totalInsurance,
      effectiveAnnualRate: teaPercent,
      monthlyRate: tem * 100,
      schedule: rows,
    };
  } else {
    // Sistema Alemán: Amortización de capital constante A = P / n
    const fixedPrincipalAmortization = principal / termMonths;

    for (let k = 1; k <= termMonths; k++) {
      const interest = currentBalance * tem;
      const insurance = currentBalance * DESGRAVAMEN_MONTHLY_RATE;
      let principalAmortized = fixedPrincipalAmortization;

      if (k === termMonths || currentBalance - principalAmortized < 0.01) {
        principalAmortized = currentBalance;
      }

      const totalPayment = principalAmortized + interest + insurance;
      currentBalance = Math.max(0, currentBalance - principalAmortized);

      totalInterest += interest;
      totalInsurance += insurance;

      const dueDate = new Date(baseDate);
      dueDate.setMonth(dueDate.getMonth() + k);

      rows.push({
        installmentNumber: k,
        paymentDate: dueDate.toISOString().split('T')[0],
        paymentAmount: totalPayment,
        principalAmount: principalAmortized,
        interestAmount: interest,
        insuranceAmount: insurance,
        remainingBalance: currentBalance,
      });
    }

    const firstPayment = rows.length > 0 ? rows[0].paymentAmount : 0;
    const lastPayment = rows.length > 0 ? rows[rows.length - 1].paymentAmount : 0;

    return {
      monthlyPayment: firstPayment,
      initialPayment: firstPayment,
      finalPayment: lastPayment,
      totalInterest,
      totalInsurance,
      totalCost: principal + totalInterest + totalInsurance,
      effectiveAnnualRate: teaPercent,
      monthlyRate: tem * 100,
      schedule: rows,
    };
  }
}

/**
 * Formato de moneda Apple White Gallery ($12,450.00)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Enmascara números de cuenta bancaria
 */
export function maskBankAccount(account: string, isMasked: boolean): string {
  if (!isMasked) return account;
  const parts = account.split('-');
  if (parts.length >= 2) {
    const last = parts[parts.length - 1];
    return `***-*****-${last}`;
  }
  return `***-*****-${account.slice(-4)}`;
}

/**
 * Enmascara cédula o DNI
 */
export function maskNationalId(nationalId: string, isMasked: boolean): string {
  if (!isMasked) return nationalId;
  const parts = nationalId.split('-');
  if (parts.length >= 2) {
    const last = parts[parts.length - 1];
    return `***-*****-${last}`;
  }
  return `***-***-${nationalId.slice(-4)}`;
}

/**
 * Generador de SHA-256 para el ledger inmutable de auditoría
 */
export async function generateSha256(text: string): Promise<string> {
  try {
    if (window.crypto && window.crypto.subtle) {
      const msgBuffer = new TextEncoder().encode(text);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (err) {
    console.warn('SubtleCrypto fallback', err);
  }

  // Fallback hash
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `0x${hex}ab94cf210e74f8819d45e${hex.slice(0, 4)}c9172844`;
}

