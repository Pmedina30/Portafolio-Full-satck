import { RawDataRow } from '../types/dashboard';

export const DEFAULT_COLUMN_MAPPING = {
  dateCol: 'FlightDate',
  statusCol: 'Status',
  delayMinutesCol: 'DelayMinutes',
  causeCol: 'DelayReason',
  regionCol: 'Region',
  routeCol: 'Route',
  resourceCol: 'AircraftTail',
  otpThreshold: 15
};

const DESTINATIONS = [
  { code: 'BOG', name: 'Bogotá (El Dorado)', region: 'Sudamérica' },
  { code: 'MDE', name: 'Medellín (J.M. Córdova)', region: 'Sudamérica' },
  { code: 'MIA', name: 'Miami International', region: 'Norteamérica' },
  { code: 'YYZ', name: 'Toronto Pearson', region: 'Norteamérica' },
  { code: 'CUN', name: 'Cancún International', region: 'Centroamérica y Caribe' },
  { code: 'SJO', name: 'San José (Juan Santamaría)', region: 'Centroamérica y Caribe' },
  { code: 'GRU', name: 'São Paulo (Guarulhos)', region: 'Sudamérica' },
  { code: 'SCL', name: 'Santiago de Chile', region: 'Sudamérica' },
  { code: 'LIM', name: 'Lima (Jorge Chávez)', region: 'Sudamérica' },
  { code: 'KIN', name: 'Kingston (Norman Manley)', region: 'Centroamérica y Caribe' },
];

const AIRCRAFT_FLEET = [
  { tail: 'HI-1026', model: 'Boeing 737 MAX 8' },
  { tail: 'HI-1027', model: 'Boeing 737 MAX 8' },
  { tail: 'HI-1078', model: 'Boeing 737 MAX 8' },
  { tail: 'HI-1081', model: 'Boeing 737 MAX 8' },
  { tail: 'HI-1082', model: 'Boeing 737 MAX 8' },
  { tail: 'HI-1101', model: 'Boeing 737 MAX 8' },
  { tail: 'HI-1102', model: 'Boeing 737 MAX 8' },
];

const DELAY_REASONS = [
  'ATC Flow & Slot Restrictions',
  'Late Inbound Aircraft Rotation',
  'Severe Weather & Tropical Turbulence',
  'Ground Handling & Ramp Operations',
  'Aircraft Maintenance Inspection',
  'Passenger & Document Clearance'
];

export function generateDefaultAviationData(): RawDataRow[] {
  const rows: RawDataRow[] = [];
  const baseDate = new Date(2026, 8, 1); // Sept 1, 2026
  const totalDays = 15;

  let flightCounter = 100;

  for (let day = 0; day < totalDays; day++) {
    const currentDate = new Date(baseDate.getTime() + day * 86400000);
    const dateStr = currentDate.toISOString().split('T')[0];

    // 22-26 flights per day
    const dailyFlights = 22 + (day % 5);

    for (let f = 0; f < dailyFlights; f++) {
      flightCounter++;
      const dest = DESTINATIONS[f % DESTINATIONS.length];
      const aircraft = AIRCRAFT_FLEET[(f + day) % AIRCRAFT_FLEET.length];
      const isReturn = f % 2 === 1;
      const origin = isReturn ? dest.code : 'SDQ';
      const destination = isReturn ? 'SDQ' : dest.code;
      const route = `${origin}-${destination}`;
      const flightNum = `DM${flightCounter}`;

      // Realistic delay probability (~12% delay, 1.5% cancelled)
      const rand = Math.random();
      let status = 'On-Time';
      let delayMinutes = 0;
      let delayReason = 'None';

      if (rand < 0.015) {
        status = 'Cancelled';
        delayMinutes = 0;
        delayReason = 'Severe Weather & Tropical Turbulence';
      } else if (rand < 0.14) {
        status = 'Delayed';
        // Random delay between 18 and 145 minutes
        delayMinutes = Math.floor(18 + Math.random() * 95);
        delayReason = DELAY_REASONS[Math.floor(Math.random() * DELAY_REASONS.length)];
      } else {
        // On-Time (between -12 and 14 min)
        delayMinutes = Math.floor(-10 + Math.random() * 24);
        if (delayMinutes > 15) {
          status = 'Delayed';
          delayReason = 'Ground Handling & Ramp Operations';
        } else {
          status = 'On-Time';
          delayReason = 'None';
        }
      }

      rows.push({
        FlightNumber: flightNum,
        FlightDate: dateStr,
        ScheduledDeparture: `${dateStr} ${String(6 + (f % 16)).padStart(2, '0')}:${String((f * 15) % 60).padStart(2, '0')}`,
        Origin: origin,
        Destination: destination,
        Route: route,
        Region: dest.region,
        AircraftTail: aircraft.tail,
        AircraftModel: aircraft.model,
        Status: status,
        DelayMinutes: delayMinutes,
        DelayReason: delayReason,
        Passengers: Math.floor(145 + Math.random() * 40)
      });
    }
  }

  return rows;
}
