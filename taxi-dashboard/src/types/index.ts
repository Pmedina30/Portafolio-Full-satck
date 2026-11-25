export type DriverStatus = 'available' | 'on_trip' | 'offline';

export interface Driver {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  rating: number;
  totalTripsToday: number;
  vehicle: {
    model: string; // e.g. Hyundai Sonata 2021
    plate: string; // e.g. A-849201
    color: string;
    category: 'Económico' | 'Comfort' | 'Taxi XL';
  };
  status: DriverStatus;
  currentZone: string; // e.g. Piantini, Naco, etc.
  coordinates: [number, number]; // [lat, lng]
  heading?: number; // degrees for car rotation
  currentTripId?: string;
}

export type TripStatus = 'requested' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

export interface ActiveTrip {
  id: string;
  driverId: string;
  driverName: string;
  driverAvatar?: string;
  driverRating?: number;
  riderName: string;
  category: 'Comfort' | 'Económico' | 'Taxi XL';
  origin: {
    name: string;
    coordinates: [number, number];
    address?: string;
  };
  destination: {
    name: string;
    coordinates: [number, number];
    address?: string;
  };
  currentPosition?: [number, number];
  fareDOP: number; // in RD$
  commissionDOP: number; // 20% rule
  etaMinutes: number;
  status: TripStatus;
  startTime: string;
  progressPercentage: number;
  // Modern telemetry & route enhancements
  distanceRemainingKm?: number;
  totalDistanceKm?: number;
  speedKmh?: number;
  vehiclePlate?: string;
  vehicleModel?: string;
  waypoints?: [number, number][];
  surgeMultiplier?: number;
}

export type EventType = 'driver_connected' | 'request_created' | 'trip_assigned' | 'trip_completed' | 'trip_cancelled';

export interface OperationEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  timestamp: string; // e.g. "10:54 AM" or ISO
  timeAgo: string;
  zone?: string;
  amountDOP?: number;
  driverName?: string;
  riderName?: string;
}

export interface HourlyDemand {
  hour: string; // e.g. "08:00 AM"
  trips: number;
  revenueDOP: number;
  isPeak?: boolean;
}

export interface KPIData {
  tripsToday: number;
  tripsTrend: number; // +12%
  totalRevenueDOP: number; // RD$ 488,428
  grossVolumeLabel: string;
  commissionDOP: number; // RD$ 97,686 (20%)
  commissionRateLabel: string;
  driversOnline: number; // 310
  driversTotal: number; // 540
  fleetPercentage: number; // 57%
  avgAssignmentTime: string; // "2m 14s"
  assignmentTrendSeconds: number; // -18s vs objetivo
}

export interface DriverDocument {
  id: string;
  name: string;
  type: 'licencia' | 'seguro' | 'antecedentes' | 'inspeccion';
  issuer: string;
  documentNumber: string;
  expiryDate: string;
  status: 'valid' | 'pending_review' | 'expired' | 'rejected';
  fileUrl?: string;
  verificationBadge: string;
}

export interface DriverApplication {
  id: string;
  fullName: string;
  cedula: string; // e.g. 001-1849201-4
  phone: string;
  email: string;
  appliedDate: string;
  avatar: string;
  vehicleModel: string;
  vehicleYear: number;
  vehiclePlate: string;
  vehicleCategory: 'Comfort' | 'Económico' | 'Taxi XL';
  documents: {
    license: DriverDocument;
    insurance: DriverDocument;
    criminalRecord: DriverDocument;
    inspection: DriverDocument;
  };
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface SectorZone {
  id: string;
  name: string;
  demandLevel: 'Alta' | 'Media' | 'Baja';
  surgeMultiplier: number;
  activeDrivers: number;
  coordinates: [number, number];
  polygon?: [number, number][];
}

export type CityId = 'santo_domingo' | 'santiago' | 'punta_cana';

export interface CityConfig {
  id: CityId;
  name: string;
  tagline: string;
  coordinates: [number, number];
  zoom: number;
  kpis: KPIData;
  zones: SectorZone[];
  drivers: Driver[];
  activeTrips: ActiveTrip[];
  demandData: HourlyDemand[];
  initialEvents: OperationEvent[];
}

