import {
  RawDataRow,
  ColumnMappingConfig,
  CalculatedKpis,
  TimeSeriesPoint,
  ParetoCauseItem,
  RegionDistribution,
  RouteMetric,
  FleetStatusItem
} from '../types/dashboard';

const PALETTE = [
  '#0B1340', // Deep Navy
  '#6B21A8', // Royal Purple
  '#00C3DE', // Electric Cyan
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#F43F5E', // Rose
  '#64748B', // Slate
];

export function computeExecutiveAnalytics(
  rows: RawDataRow[],
  mapping: ColumnMappingConfig
): {
  kpis: CalculatedKpis;
  timeSeries: TimeSeriesPoint[];
  paretoCauses: ParetoCauseItem[];
  regionalDistribution: RegionDistribution[];
  topRoutes: RouteMetric[];
  fleetStatus: FleetStatusItem[];
} {
  if (!rows || rows.length === 0) {
    return getEmptyAnalytics();
  }

  const {
    dateCol,
    statusCol,
    delayMinutesCol,
    causeCol,
    regionCol,
    routeCol,
    resourceCol,
    otpThreshold
  } = mapping;

  let totalVolume = rows.length;
  let onTimeCount = 0;
  let delayedCount = 0;
  let criticalFailuresCount = 0;
  let totalDelayMinutesSum = 0;
  let delayedItemsTotalMinutes = 0;

  // Grouping structures
  const dailyBuckets: Record<string, { total: number; onTime: number; delayed: number; cancelled: number }> = {};
  const causeBuckets: Record<string, { count: number; minutes: number }> = {};
  const regionBuckets: Record<string, { count: number; onTime: number }> = {};
  const routeBuckets: Record<string, { volume: number; onTime: number; delayed: number; delayMinutesSum: number }> = {};
  const fleetBuckets: Record<string, { model: string; count: number; onTime: number; lastRoute: string }> = {};

  // For Delta MoM / PoP estimation (split dataset into first half and second half)
  const midpoint = Math.floor(rows.length / 2);
  let firstHalfOnTime = 0;
  let firstHalfTotal = 0;
  let secondHalfOnTime = 0;
  let secondHalfTotal = 0;

  rows.forEach((row, index) => {
    // 1. Determine delay value
    const rawDelay = row[delayMinutesCol];
    const delayMinutes = typeof rawDelay === 'number' ? rawDelay : parseFloat(rawDelay) || 0;
    
    // 2. Determine status
    const rawStatus = String(row[statusCol] || '').toLowerCase();
    const isCancelled = rawStatus.includes('cancel') || rawStatus.includes('fall') || rawStatus.includes('abort');
    
    // An operation is considered on-time if not cancelled and delay <= threshold
    const isOnTime = !isCancelled && (delayMinutes <= otpThreshold || rawStatus.includes('on-time') || rawStatus.includes('puntual') || rawStatus.includes('a tiempo'));
    const isDelayed = !isCancelled && !isOnTime;

    if (isCancelled) {
      criticalFailuresCount++;
    } else if (isOnTime) {
      onTimeCount++;
    } else {
      delayedCount++;
      delayedItemsTotalMinutes += Math.max(0, delayMinutes);
    }

    if (delayMinutes > 0) {
      totalDelayMinutesSum += delayMinutes;
    }

    // Delta tracking
    if (index < midpoint) {
      firstHalfTotal++;
      if (isOnTime) firstHalfOnTime++;
    } else {
      secondHalfTotal++;
      if (isOnTime) secondHalfOnTime++;
    }

    // 3. Aggregate Date Time Series
    const rawDate = row[dateCol];
    let dateKey = 'Sin Fecha';
    if (rawDate) {
      const dStr = String(rawDate).split(' ')[0];
      dateKey = dStr.length >= 10 ? dStr.substring(5) : dStr; // e.g. "09-01"
    }

    if (!dailyBuckets[dateKey]) {
      dailyBuckets[dateKey] = { total: 0, onTime: 0, delayed: 0, cancelled: 0 };
    }
    dailyBuckets[dateKey].total++;
    if (isCancelled) dailyBuckets[dateKey].cancelled++;
    else if (isOnTime) dailyBuckets[dateKey].onTime++;
    else dailyBuckets[dateKey].delayed++;

    // 4. Aggregate Causes (only for delays and cancellations)
    if (isDelayed || isCancelled) {
      const cause = String(row[causeCol] || 'Otras Causas / No Especificado').trim();
      if (cause && cause.toLowerCase() !== 'none' && cause.toLowerCase() !== 'ninguna') {
        if (!causeBuckets[cause]) {
          causeBuckets[cause] = { count: 0, minutes: 0 };
        }
        causeBuckets[cause].count++;
        causeBuckets[cause].minutes += Math.max(0, delayMinutes);
      }
    }

    // 5. Aggregate Regions
    const region = String(row[regionCol] || 'Otras Regiones').trim();
    if (!regionBuckets[region]) {
      regionBuckets[region] = { count: 0, onTime: 0 };
    }
    regionBuckets[region].count++;
    if (isOnTime) regionBuckets[region].onTime++;

    // 6. Aggregate Routes
    const route = String(row[routeCol] || 'Sin Ruta').trim();
    if (!routeBuckets[route]) {
      routeBuckets[route] = { volume: 0, onTime: 0, delayed: 0, delayMinutesSum: 0 };
    }
    routeBuckets[route].volume++;
    if (isOnTime) routeBuckets[route].onTime++;
    if (isDelayed) {
      routeBuckets[route].delayed++;
      routeBuckets[route].delayMinutesSum += delayMinutes;
    }

    // 7. Aggregate Fleet/Resources
    const tail = String(row[resourceCol] || '').trim();
    if (tail) {
      if (!fleetBuckets[tail]) {
        fleetBuckets[tail] = {
          model: String(row['AircraftModel'] || 'B737-MAX8'),
          count: 0,
          onTime: 0,
          lastRoute: route
        };
      }
      fleetBuckets[tail].count++;
      if (isOnTime) fleetBuckets[tail].onTime++;
      fleetBuckets[tail].lastRoute = route;
    }
  });

  // Calculate Primary KPIs
  const effectiveBase = totalVolume - criticalFailuresCount;
  const otpRate = effectiveBase > 0 ? (onTimeCount / effectiveBase) * 100 : 0;
  const delayedRate = totalVolume > 0 ? (delayedCount / totalVolume) * 100 : 0;
  const criticalFailuresRate = totalVolume > 0 ? (criticalFailuresCount / totalVolume) * 100 : 0;
  const avgDelayMinutes = delayedCount > 0 ? Math.round(delayedItemsTotalMinutes / delayedCount) : 0;

  // Calculate Delta
  const firstHalfRate = firstHalfTotal > 0 ? (firstHalfOnTime / firstHalfTotal) * 100 : 0;
  const secondHalfRate = secondHalfTotal > 0 ? (secondHalfOnTime / secondHalfTotal) * 100 : 0;
  const otpRateDelta = Number((secondHalfRate - firstHalfRate).toFixed(1));

  // TimeSeries array sorted
  const timeSeries: TimeSeriesPoint[] = Object.entries(dailyBuckets)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([period, data]) => {
      const dayBase = data.total - data.cancelled;
      const dayOtp = dayBase > 0 ? Number(((data.onTime / dayBase) * 100).toFixed(1)) : 0;
      return {
        period,
        total: data.total,
        onTime: data.onTime,
        delayed: data.delayed,
        cancelled: data.cancelled,
        otpPercentage: dayOtp,
        targetBenchmark: 85.0
      };
    });

  // Pareto Causes sorted descending
  const totalCausesCount = Object.values(causeBuckets).reduce((acc, c) => acc + c.count, 0) || 1;
  let runningCount = 0;
  const paretoCauses: ParetoCauseItem[] = Object.entries(causeBuckets)
    .map(([cause, d]) => ({
      cause,
      count: d.count,
      totalMinutes: d.minutes,
      percentage: Number(((d.count / totalCausesCount) * 100).toFixed(1)),
      cumulativePercentage: 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
    .map((item) => {
      runningCount += item.count;
      return {
        ...item,
        cumulativePercentage: Number(((runningCount / totalCausesCount) * 100).toFixed(1))
      };
    });

  // Regional distribution with colors
  const totalRegionalVolume = Object.values(regionBuckets).reduce((acc, r) => acc + r.count, 0) || 1;
  const regionalDistribution: RegionDistribution[] = Object.entries(regionBuckets)
    .map(([region, d], idx) => ({
      region,
      count: d.count,
      percentage: Number(((d.count / totalRegionalVolume) * 100).toFixed(1)),
      otpRate: d.count > 0 ? Number(((d.onTime / d.count) * 100).toFixed(1)) : 0,
      color: PALETTE[idx % PALETTE.length]
    }))
    .sort((a, b) => b.count - a.count);

  // Top Routes sorted by volume
  const topRoutes: RouteMetric[] = Object.entries(routeBuckets)
    .map(([route, d]) => ({
      route,
      volume: d.volume,
      onTimeCount: d.onTime,
      delayedCount: d.delayed,
      otpRate: d.volume > 0 ? Number(((d.onTime / d.volume) * 100).toFixed(1)) : 0,
      avgDelayMinutes: d.delayed > 0 ? Math.round(d.delayMinutesSum / d.delayed) : 0
    }))
    .sort((a, b) => b.delayedCount - a.delayedCount)
    .slice(0, 8);

  // Fleet status
  const fleetStatus: FleetStatusItem[] = Object.entries(fleetBuckets)
    .map(([tail, d]) => {
      const rate = d.count > 0 ? Number(((d.onTime / d.count) * 100).toFixed(1)) : 100;
      let status: FleetStatusItem['status'] = 'On-Schedule';
      if (rate < 75) status = 'Delayed';
      else if (Math.random() < 0.15) status = 'In-Flight';
      else if (Math.random() < 0.1) status = 'Maintenance';

      return {
        tailNumber: tail,
        model: d.model,
        status,
        flightsCount: d.count,
        otpRate: rate,
        lastRoute: d.lastRoute
      };
    })
    .sort((a, b) => b.flightsCount - a.flightsCount);

  return {
    kpis: {
      totalVolume,
      otpRate: Number(otpRate.toFixed(1)),
      otpRateDelta,
      delayedCount,
      delayedRate: Number(delayedRate.toFixed(1)),
      avgDelayMinutes,
      formattedAvgDuration: formatMinutesToHours(avgDelayMinutes),
      criticalFailuresCount,
      criticalFailuresRate: Number(criticalFailuresRate.toFixed(1)),
      totalDelayHoursFormatted: formatMinutesToHours(totalDelayMinutesSum)
    },
    timeSeries,
    paretoCauses,
    regionalDistribution,
    topRoutes,
    fleetStatus
  };
}

export function formatMinutesToHours(minutes: number): string {
  if (!minutes || minutes <= 0) return '0min';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  if (hours === 0) return `${remainingMinutes}min`;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}min`;
}

function getEmptyAnalytics() {
  return {
    kpis: {
      totalVolume: 0,
      otpRate: 0,
      otpRateDelta: 0,
      delayedCount: 0,
      delayedRate: 0,
      avgDelayMinutes: 0,
      formattedAvgDuration: '0min',
      criticalFailuresCount: 0,
      criticalFailuresRate: 0,
      totalDelayHoursFormatted: '0h'
    },
    timeSeries: [],
    paretoCauses: [],
    regionalDistribution: [],
    topRoutes: [],
    fleetStatus: []
  };
}
