import { useState, useEffect, useCallback, useRef } from 'react';
import { Driver, ActiveTrip, OperationEvent, KPIData, DriverApplication, CityId } from '../types';
import {
  CITY_CONFIGS,
  INITIAL_DRIVER_APPLICATIONS,
} from '../data/mockData';

export function useLiveOperations() {
  const [currentCity, setCurrentCity] = useState<CityId>('santo_domingo');

  const currentCityConfig = CITY_CONFIGS[currentCity];

  const [kpis, setKpis] = useState<KPIData>(currentCityConfig.kpis);
  const [drivers, setDrivers] = useState<Driver[]>(currentCityConfig.drivers);
  const [activeTrips, setActiveTrips] = useState<ActiveTrip[]>(currentCityConfig.activeTrips);
  const [events, setEvents] = useState<OperationEvent[]>(currentCityConfig.initialEvents);
  const [applications, setApplications] = useState<DriverApplication[]>(INITIAL_DRIVER_APPLICATIONS);

  // Live stream control
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1); // 1x, 2x, 0 (paused)
  const [focusedTripId, setFocusedTripId] = useState<string | null>(null);
  const [focusedCoordinates, setFocusedCoordinates] = useState<[number, number] | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ id: string; text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const eventCounterRef = useRef<number>(100);

  // Show a notification toast
  const showToast = useCallback((text: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString();
    setToastMessage({ id, text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.id === id ? null : prev));
    }, 4000);
  }, []);

  // Change city and reload datasets
  const changeCity = useCallback((cityId: CityId) => {
    setCurrentCity(cityId);
    const config = CITY_CONFIGS[cityId];
    setKpis(config.kpis);
    setDrivers(config.drivers);
    setActiveTrips(config.activeTrips);
    setEvents(config.initialEvents);
    setFocusedTripId(null);
    setFocusedCoordinates(config.coordinates);
    showToast(`Operaciones sincronizadas para ${config.name} (${config.tagline})`, 'success');
  }, [showToast]);

  // Trigger manual or procedural new event
  const addEvent = useCallback((event: Omit<OperationEvent, 'id' | 'timestamp' | 'timeAgo'>) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newEv: OperationEvent = {
      ...event,
      id: `ev-${currentCity}-${eventCounterRef.current++}`,
      timestamp: timeStr,
      timeAgo: 'Hace un momento',
    };

    setEvents((prev) => [newEv, ...prev.slice(0, 19)]);
  }, [currentCity]);

  // Approve a pending driver
  const approveDriver = useCallback((applicationId: string) => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return;

    setApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, status: 'approved' as const } : a))
    );

    const cityCoord = CITY_CONFIGS[currentCity].coordinates;

    // Add to active fleet
    const newDriver: Driver = {
      id: `drv-${Date.now().toString().slice(-4)}`,
      name: app.fullName,
      avatar: app.avatar,
      phone: app.phone,
      rating: 5.0,
      totalTripsToday: 0,
      vehicle: {
        model: `${app.vehicleModel} ${app.vehicleYear}`,
        plate: app.vehiclePlate,
        color: 'Plata Metálico',
        category: app.vehicleCategory,
      },
      status: 'available',
      currentZone: CITY_CONFIGS[currentCity].zones[0].name,
      coordinates: [cityCoord[0] + (Math.random() - 0.5) * 0.01, cityCoord[1] + (Math.random() - 0.5) * 0.01],
      heading: Math.floor(Math.random() * 360),
    };

    setDrivers((prev) => [newDriver, ...prev]);

    // Update KPIs
    setKpis((prev) => ({
      ...prev,
      driversOnline: prev.driversOnline + 1,
      driversTotal: prev.driversTotal + 1,
      fleetPercentage: Math.round(((prev.driversOnline + 1) / (prev.driversTotal + 1)) * 100),
    }));

    addEvent({
      type: 'driver_connected',
      title: 'Conductor Verificado & Aprobado',
      description: `${app.fullName} aprobado con éxito en ${CITY_CONFIGS[currentCity].name} (${app.vehiclePlate})`,
      zone: CITY_CONFIGS[currentCity].name,
      driverName: app.fullName,
    });

    showToast(`Conductor ${app.fullName} aprobado e integrado a la flota de ${CITY_CONFIGS[currentCity].name}.`, 'success');
  }, [applications, currentCity, addEvent, showToast]);

  // Reject a driver application
  const rejectDriver = useCallback((applicationId: string, reason: string = 'Documentación no conforme') => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return;

    setApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, status: 'rejected' as const, rejectionReason: reason } : a))
    );

    showToast(`Solicitud de ${app.fullName} rechazada: ${reason}`, 'warning');
  }, [applications, showToast]);

  // Focus a trip on the map (or clear focus)
  const focusTripOnMap = useCallback((tripId: string | null) => {
    if (!tripId) {
      setFocusedTripId(null);
      return;
    }
    const trip = activeTrips.find((t) => t.id === tripId);
    if (trip && trip.currentPosition) {
      setFocusedTripId(tripId);
      setFocusedCoordinates(trip.currentPosition);
    }
  }, [activeTrips]);

  // Simulation loop for live positions, trip progress, and stream events
  useEffect(() => {
    if (!isConnected || simulationSpeed === 0) return;

    const intervalTime = 3000 / simulationSpeed;

    const interval = setInterval(() => {
      // 1. Move cars slightly within the active city
      setDrivers((prevDrivers) =>
        prevDrivers.map((driver) => {
          if (driver.status === 'offline') return driver;

          const latDelta = (Math.random() - 0.49) * 0.0006;
          const lngDelta = (Math.random() - 0.49) * 0.0006;
          const newLat = driver.coordinates[0] + latDelta;
          const newLng = driver.coordinates[1] + lngDelta;

          return {
            ...driver,
            coordinates: [newLat, newLng],
            heading: Math.floor((driver.heading || 0) + (Math.random() - 0.5) * 20) % 360,
          };
        })
      );

      // 2. Advance active trips progress
      setActiveTrips((prevTrips) =>
        prevTrips.map((trip) => {
          const nextProgress = trip.progressPercentage + Math.floor(Math.random() * 4) + 1;
          if (nextProgress >= 100) {
            // Fare calculation based on city
            const isPuntaCana = currentCity === 'punta_cana';
            const fare = isPuntaCana
              ? Math.floor(800 + Math.random() * 950)
              : Math.floor(250 + Math.random() * 280);
            const comm = Math.round(fare * 0.2); // 20% commission

            setKpis((prevKpi) => ({
              ...prevKpi,
              tripsToday: prevKpi.tripsToday + 1,
              totalRevenueDOP: prevKpi.totalRevenueDOP + fare,
              commissionDOP: prevKpi.commissionDOP + comm,
            }));

            addEvent({
              type: 'trip_completed',
              title: 'Viaje finalizado con éxito',
              description: `Viaje finalizado por ${trip.driverName} en ${CITY_CONFIGS[currentCity].name} (Comisión 20%: RD$ ${comm})`,
              amountDOP: comm,
              driverName: trip.driverName,
              riderName: trip.riderName,
            });

            const riders = ['Laura Castillo', 'Enmanuel Reyes', 'Gabriela Cruz', 'Francisco Báez', 'Valeria Guzmán'];
            const randomRider = riders[Math.floor(Math.random() * riders.length)];
            return {
              ...trip,
              progressPercentage: 10,
              riderName: randomRider,
              fareDOP: fare,
              commissionDOP: comm,
              etaMinutes: Math.floor(4 + Math.random() * 8),
              distanceRemainingKm: +( (trip.totalDistanceKm || 5) * 0.9 ).toFixed(1),
              startTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            };
          }

          const fraction = nextProgress / 100;
          let newLat = trip.origin.coordinates[0] + (trip.destination.coordinates[0] - trip.origin.coordinates[0]) * fraction;
          let newLng = trip.origin.coordinates[1] + (trip.destination.coordinates[1] - trip.origin.coordinates[1]) * fraction;

          // If detailed waypoints are present, interpolate precisely along them
          if (trip.waypoints && trip.waypoints.length > 1) {
            const indexFloat = fraction * (trip.waypoints.length - 1);
            const index = Math.min(Math.floor(indexFloat), trip.waypoints.length - 2);
            const segFrac = indexFloat - index;
            const p1 = trip.waypoints[index];
            const p2 = trip.waypoints[index + 1];
            newLat = p1[0] + (p2[0] - p1[0]) * segFrac;
            newLng = p1[1] + (p2[1] - p1[1]) * segFrac;
          }

          const remainingKm = +( (trip.totalDistanceKm || 5) * (1 - fraction) ).toFixed(1);
          const eta = Math.max(1, Math.round(trip.etaMinutes * (1 - fraction)));

          return {
            ...trip,
            progressPercentage: nextProgress,
            currentPosition: [newLat, newLng],
            distanceRemainingKm: Math.max(0.2, remainingKm),
            etaMinutes: eta,
          };
        })
      );

      // 3. Random event generator adapting to active city
      const roll = Math.random();
      if (roll < 0.25) {
        const zones = CITY_CONFIGS[currentCity].zones;
        const randomZone = zones[Math.floor(Math.random() * zones.length)].name;
        const isPC = currentCity === 'punta_cana';
        const fare = isPC ? Math.floor(750 + Math.random() * 1100) : Math.floor(220 + Math.random() * 290);

        const sampleEvents: Array<Omit<OperationEvent, 'id' | 'timestamp' | 'timeAgo'>> = [
          {
            type: 'driver_connected',
            title: 'Conductor en línea',
            description: `Conductor disponible en zona ${randomZone} (${CITY_CONFIGS[currentCity].name})`,
            zone: randomZone,
          },
          {
            type: 'request_created',
            title: 'Nueva Solicitud',
            description: `Solicitud creada en ${randomZone} (Tarifa: RD$ ${fare})`,
            zone: randomZone,
            amountDOP: fare,
          },
          {
            type: 'trip_assigned',
            title: 'Viaje asignado',
            description: `Viaje asignado por despacho automático en ${randomZone}`,
          },
        ];

        const randomEvent = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
        addEvent(randomEvent);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isConnected, simulationSpeed, currentCity, addEvent]);

  // Manually generate a test event
  const triggerManualEvent = useCallback(() => {
    const zones = CITY_CONFIGS[currentCity].zones;
    const zone = zones[Math.floor(Math.random() * zones.length)].name;
    const isPC = currentCity === 'punta_cana';
    const fare = isPC ? Math.floor(950 + Math.random() * 850) : Math.floor(280 + Math.random() * 260);

    addEvent({
      type: 'request_created',
      title: `Nueva Solicitud en ${CITY_CONFIGS[currentCity].name}`,
      description: `Solicitud creada en tiempo real: ${zone} (RD$ ${fare})`,
      zone,
      amountDOP: fare,
    });

    showToast(`Nueva solicitud creada en ${zone} (${CITY_CONFIGS[currentCity].name}) por RD$ ${fare}`, 'info');
  }, [currentCity, addEvent, showToast]);

  return {
    currentCity,
    changeCity,
    currentCityConfig,
    kpis,
    drivers,
    activeTrips,
    events,
    applications,
    pendingApplicationsCount: applications.filter((a) => a.status === 'pending').length,
    isConnected,
    setIsConnected,
    simulationSpeed,
    setSimulationSpeed,
    focusedTripId,
    focusedCoordinates,
    focusTripOnMap,
    approveDriver,
    rejectDriver,
    triggerManualEvent,
    soundEnabled,
    setSoundEnabled,
    toastMessage,
  };
}
