import { RawDataRow, ColumnMappingConfig, BrandingTheme } from '../types/dashboard';

export interface DatasetPreset {
  id: string;
  name: string;
  domain: string;
  icon: string;
  theme: BrandingTheme;
  mapping: ColumnMappingConfig;
  generateData: () => RawDataRow[];
}

export function generateLogisticsData(): RawDataRow[] {
  const routes = [
    { code: 'SDQ-MIA', origin: 'SDQ', dest: 'MIA', region: 'Norteamérica' },
    { code: 'SDQ-BOG', origin: 'SDQ', dest: 'BOG', region: 'Sudamérica' },
    { code: 'SDQ-PTY', origin: 'SDQ', dest: 'PTY', region: 'Centroamérica y Caribe' },
    { code: 'MIA-SDQ', origin: 'MIA', dest: 'SDQ', region: 'Centroamérica y Caribe' },
    { code: 'BOG-MDE', origin: 'BOG', dest: 'MDE', region: 'Sudamérica' },
    { code: 'CUN-SDQ', origin: 'CUN', dest: 'SDQ', region: 'Centroamérica y Caribe' },
    { code: 'SDQ-SJO', origin: 'SDQ', dest: 'SJO', region: 'Centroamérica y Caribe' },
    { code: 'GRU-SDQ', origin: 'GRU', dest: 'SDQ', region: 'Sudamérica' }
  ];

  const vehicles = ['FREIGHT-101', 'FREIGHT-102', 'CARGO-205', 'CARGO-208', 'VAN-310', 'VAN-312'];
  const causes = [
    'Aduanas & Retención Fronteriza',
    'Tráfico Pesado & Congestión Vial',
    'Falla Mecánica de Flota',
    'Sobrecarga en Hub de Distribución',
    'Condiciones Climáticas Adversas'
  ];

  const rows: RawDataRow[] = [];
  const baseDate = new Date(2026, 8, 1);

  for (let day = 0; day < 15; day++) {
    const date = new Date(baseDate.getTime() + day * 86400000).toISOString().split('T')[0];
    const dailyShipments = 25 + (day % 4);

    for (let s = 0; s < dailyShipments; s++) {
      const r = routes[s % routes.length];
      const v = vehicles[(s + day) % vehicles.length];
      const rand = Math.random();

      let status = 'On-Time';
      let delayMinutes = 0;
      let reason = 'None';

      if (rand < 0.02) {
        status = 'Cancelled';
        reason = 'Condiciones Climáticas Adversas';
      } else if (rand < 0.16) {
        status = 'Delayed';
        delayMinutes = Math.floor(25 + Math.random() * 85);
        reason = causes[Math.floor(Math.random() * causes.length)];
      } else {
        delayMinutes = Math.floor(-15 + Math.random() * 20);
        status = delayMinutes > 15 ? 'Delayed' : 'On-Time';
        reason = delayMinutes > 15 ? 'Tráfico Pesado & Congestión Vial' : 'None';
      }

      rows.push({
        TrackingNumber: `TRK-${1000 + day * 100 + s}`,
        DispatchDate: date,
        OriginHub: r.origin,
        DestinationHub: r.dest,
        RouteCode: r.code,
        Region: r.region,
        FleetVehicle: v,
        DeliveryStatus: status,
        DelayMinutes: Math.max(0, delayMinutes),
        DelayReason: reason,
        PackagesCount: Math.floor(120 + Math.random() * 180)
      });
    }
  }

  return rows;
}

export function generateSupportSlaData(): RawDataRow[] {
  const queues = [
    { code: 'SDQ-MIA', name: 'Tier-3 Infrastructure', region: 'Norteamérica' },
    { code: 'SDQ-BOG', name: 'Database Reliability', region: 'Sudamérica' },
    { code: 'SDQ-PTY', name: 'Security & IAM Operations', region: 'Centroamérica y Caribe' },
    { code: 'BOG-MDE', name: 'API Gateway & Latency', region: 'Sudamérica' },
    { code: 'SDQ-SJO', name: 'Billing & Payments SLA', region: 'Centroamérica y Caribe' }
  ];

  const engineers = ['ENG-ALEX', 'ENG-SARAH', 'ENG-CARLOS', 'ENG-DANIEL', 'ENG-MARIA'];
  const causes = [
    'Dependencia de API de Terceros',
    'Degradación de Red / ISP',
    'Validación de Permisos de Seguridad',
    'Alta Concurrencia de Incidentes',
    'Falta de Logs & Diagnóstico'
  ];

  const rows: RawDataRow[] = [];
  const baseDate = new Date(2026, 8, 1);

  for (let day = 0; day < 15; day++) {
    const date = new Date(baseDate.getTime() + day * 86400000).toISOString().split('T')[0];
    const dailyTickets = 20 + (day % 3);

    for (let t = 0; t < dailyTickets; t++) {
      const q = queues[t % queues.length];
      const eng = engineers[(t + day) % engineers.length];
      const rand = Math.random();

      let status = 'On-Time';
      let delayMinutes = 0;
      let reason = 'None';

      if (rand < 0.03) {
        status = 'Cancelled';
        reason = 'Dependencia de API de Terceros';
      } else if (rand < 0.18) {
        status = 'Delayed';
        delayMinutes = Math.floor(20 + Math.random() * 90);
        reason = causes[Math.floor(Math.random() * causes.length)];
      } else {
        delayMinutes = Math.floor(2 + Math.random() * 12);
        status = 'On-Time';
      }

      rows.push({
        TicketNumber: `INC-${8000 + day * 50 + t}`,
        CreatedDate: date,
        ServiceQueue: q.code,
        QueueName: q.name,
        Region: q.region,
        AssignedEngineer: eng,
        SlaStatus: status,
        ResolutionDelayMin: delayMinutes,
        IncidentCause: reason,
        ImpactUsers: Math.floor(50 + Math.random() * 500)
      });
    }
  }

  return rows;
}

