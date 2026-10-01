import { Transaction, AnalyzedTransaction, CategoryStatistics, OperationalMetrics, TransactionCategory } from '../types/finpulse';

/**
 * Calculates sample mean (mu): sum(X_i) / N
 */
export function calculateSampleMean(values: number[]): number {
  if (!values || values.length === 0) return 0;
  const sum = values.reduce((acc, curr) => acc + curr, 0);
  return sum / values.length;
}

/**
 * Calculates sample standard deviation (sigma) using Bessel's correction (N - 1)
 */
export function calculateSampleStdDev(values: number[], mean: number): number {
  if (!values || values.length <= 1) return 0;
  const sumSquaredDiffs = values.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0);
  return Math.sqrt(sumSquaredDiffs / (values.length - 1));
}

/**
 * Calculates Z-Score: Z = (X - mu) / sigma
 */
export function calculateZScore(value: number, mean: number, stdDev: number): number {
  if (stdDev <= 0.0001) return 0;
  return (value - mean) / stdDev;
}

/**
 * Compute statistical metrics grouped by category
 */
export function calculateCategoryStats(transactions: Transaction[]): Record<string, CategoryStatistics> {
  const groups: Record<string, number[]> = {};

  transactions.forEach((tx) => {
    if (!groups[tx.category]) {
      groups[tx.category] = [];
    }
    groups[tx.category].push(tx.amount);
  });

  const result: Record<string, CategoryStatistics> = {};

  Object.entries(groups).forEach(([cat, amounts]) => {
    const mean = calculateSampleMean(amounts);
    const stdDev = calculateSampleStdDev(amounts, mean);
    const min = Math.min(...amounts);
    const max = Math.max(...amounts);
    const total = amounts.reduce((a, b) => a + b, 0);

    result[cat] = {
      category: cat as TransactionCategory,
      count: amounts.length,
      mean,
      stdDev,
      min,
      max,
      total,
    };
  });

  return result;
}

/**
 * Analyzes transactions with exact Z-Scores, severity flags and diagnostic reasons
 */
export function analyzeTransactions(transactions: Transaction[]): AnalyzedTransaction[] {
  const catStats = calculateCategoryStats(transactions);

  return transactions.map((tx) => {
    const stats = catStats[tx.category] || {
      category: tx.category,
      count: 1,
      mean: tx.amount,
      stdDev: 0,
      min: tx.amount,
      max: tx.amount,
      total: tx.amount,
    };

    const mean = stats.mean;
    const stdDev = stats.stdDev;
    const zScore = calculateZScore(tx.amount, mean, stdDev);
    const absZ = Math.abs(zScore);
    const deviationPercent = mean > 0 ? ((tx.amount - mean) / mean) * 100 : 0;

    const anomalyReasons: string[] = [];
    let severity: 'critical' | 'warning' | 'normal' = 'normal';

    // Mandatory rule: |Z| > 2.2 is Critical Anomaly
    if (absZ > 2.2) {
      severity = 'critical';
      anomalyReasons.push(`Z-Score extremo de ${zScore > 0 ? '+' : ''}${zScore.toFixed(2)}σ excede el umbral crítico (|Z| > 2.2)`);
    } else if (absZ > 1.5) {
      severity = 'warning';
      anomalyReasons.push(`Z-Score elevado de ${zScore > 0 ? '+' : ''}${zScore.toFixed(2)}σ sobrepasa el rango estándar`);
    }

    if (deviationPercent > 100) {
      anomalyReasons.push(`Monto ${deviationPercent.toFixed(0)}% por encima del gasto promedio (${tx.category})`);
    }

    if (tx.isOffHours) {
      anomalyReasons.push(`Transacción registrada en horario no comercial (${tx.time})`);
      if (absZ > 1.8 && severity !== 'critical') {
        severity = 'critical';
        anomalyReasons.push(`Patrón de alto riesgo: Desviación estadística combinada con horario sospechoso`);
      }
    }

    // Risk score 0 to 100
    let risk = Math.min(100, Math.round((absZ / 3.5) * 75 + (tx.isOffHours ? 25 : 0)));
    if (severity === 'critical') {
      risk = Math.max(75, risk);
    } else if (severity === 'warning') {
      risk = Math.max(45, Math.min(74, risk));
    } else {
      risk = Math.min(30, risk);
    }

    return {
      ...tx,
      zScore,
      categoryMean: mean,
      categoryStdDev: stdDev,
      severity,
      deviationPercent,
      anomalyReasons: anomalyReasons.length > 0 ? anomalyReasons : ['Gasto dentro de los límites estocásticos esperados'],
      riskScore: risk,
    };
  });
}

/**
 * Calculates high-level financial operational metrics
 */
export function calculateOperationalMetrics(analyzed: AnalyzedTransaction[]): OperationalMetrics {
  const totalAudited = analyzed.reduce((sum, tx) => sum + tx.amount, 0);

  // Capital en Riesgo: total in critical transactions that are not approved
  const criticalTxs = analyzed.filter((tx) => tx.severity === 'critical');
  const capitalAtRisk = criticalTxs
    .filter((tx) => tx.status !== 'approved')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const criticalCount = criticalTxs.length;
  const warningCount = analyzed.filter((tx) => tx.severity === 'warning').length;
  const frozenCount = analyzed.filter((tx) => tx.status === 'frozen').length;
  const approvedCount = analyzed.filter((tx) => tx.status === 'approved').length;

  const avgCriticalZScore =
    criticalCount > 0
      ? criticalTxs.reduce((sum, tx) => sum + Math.abs(tx.zScore), 0) / criticalCount
      : 0;

  return {
    capitalAtRisk,
    totalAudited,
    transactionCount: analyzed.length,
    criticalCount,
    warningCount,
    frozenCount,
    approvedCount,
    avgCriticalZScore,
  };
}

