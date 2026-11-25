import React, { useEffect, useRef, useState, useCallback } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { Driver, ActiveTrip, SectorZone } from '../types';
import {
  Layers,
  Maximize2,
  Minimize2,
  Navigation,
  Compass,
  Star,
  Phone,
  CheckCircle2,
  Car,
  Flame,
  Route,
  Eye,
  EyeOff,
  Crosshair,
  Gauge,
  X,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface LiveMapProps {
  drivers: Driver[];
  activeTrips: ActiveTrip[];
  focusedCoordinates: [number, number] | null;
  focusedTripId: string | null;
  onFocusTrip?: (tripId: string | null) => void;
  driversOnlineCount: number;
  currentCityName: string;
  cityCoordinates: [number, number];
  cityZoom: number;
  zones: SectorZone[];
}

const GOOGLE_MAPS_API_KEY =
  (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ||
  'AIzaSyCP2OH1kXlG58EKNCKhrUPrrI3sk0iFcZw';

// Custom clean styling for Google Maps matching taxi. aesthetic
const GOOGLE_MAPS_STYLE: google.maps.MapTypeStyle[] = [
  {
    featureType: 'all',
    elementType: 'geometry',
    stylers: [{ color: '#f8fafc' }],
  },
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#334155' }],
  },
  {
    featureType: 'all',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#ffffff' }, { weight: 2 }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#cbd5e1' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#475569' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#e2e8f0' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#cbd5e1' }, { weight: 1 }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#f1f5f9' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#f1f5f9' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#e2e8f0' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#e2e8f0' }],
  },
];

export const LiveMap: React.FC<LiveMapProps> = ({
  drivers,
  activeTrips,
  focusedCoordinates,
  focusedTripId,
  onFocusTrip,
  driversOnlineCount,
  currentCityName,
  cityCoordinates,
  cityZoom,
  zones,
}) => {
  const [mapEngine, setMapEngine] = useState<'google' | 'leaflet'>('google');
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState<boolean>(false);
  const [googleMapsError, setGoogleMapsError] = useState<string | null>(null);

  const [activeFilter, setActiveFilter] = useState<'all' | 'available' | 'on_trip' | 'offline'>('all');
  const [routesVisibility, setRoutesVisibility] = useState<'all' | 'focused' | 'hidden'>('all');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [trafficEnabled, setTrafficEnabled] = useState<boolean>(true);
  const [googleMapTypeId, setGoogleMapTypeId] = useState<string>('roadmap');

  // Active focused trip object
  const focusedTrip = activeTrips.find((t) => t.id === focusedTripId) || null;

  // DOM Refs
  const gmapContainerRef = useRef<HTMLDivElement>(null);
  const leafletContainerRef = useRef<HTMLDivElement>(null);

  // Google Maps Instance Refs
  const gmapInstanceRef = useRef<google.maps.Map | null>(null);
  const gmapMarkersRef = useRef<google.maps.Marker[]>([]);
  const gmapPolylinesRef = useRef<google.maps.Polyline[]>([]);
  const gmapRouteMarkersRef = useRef<google.maps.Marker[]>([]);
  const gmapTrafficLayerRef = useRef<google.maps.TrafficLayer | null>(null);

  // Leaflet Instance Refs
  const leafletInstanceRef = useRef<any>(null);
  const leafletMarkersGroupRef = useRef<any>(null);
  const leafletRoutesGroupRef = useRef<any>(null);

  // -------------------------------------------------------------
  // 1. Initialize Google Maps via modern functional importLibrary
  // -------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    try {
      setOptions({
        key: GOOGLE_MAPS_API_KEY,
        v: 'weekly',
      });

      importLibrary('maps')
        .then(() => {
          if (!isMounted) return;
          setGoogleMapsLoaded(true);

          if (gmapContainerRef.current && !gmapInstanceRef.current) {
            const map = new google.maps.Map(gmapContainerRef.current, {
              center: { lat: cityCoordinates[0], lng: cityCoordinates[1] },
              zoom: cityZoom,
              styles: GOOGLE_MAPS_STYLE,
              disableDefaultUI: true,
              zoomControl: true,
              zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM,
              },
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
            });

            // Traffic Layer
            const trafficLayer = new google.maps.TrafficLayer();
            trafficLayer.setMap(map);
            gmapTrafficLayerRef.current = trafficLayer;

            gmapInstanceRef.current = map;
          }
        })
        .catch((err) => {
          console.error('Google Maps API Loader Error:', err);
          if (isMounted) {
            setGoogleMapsError('No se pudo cargar Google Maps API. Activando Leaflet.');
            setMapEngine('leaflet');
          }
        });
    } catch (e) {
      console.warn('Failed to call setOptions:', e);
      setMapEngine('leaflet');
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Update center & zoom when city changes
  useEffect(() => {
    if (mapEngine === 'google' && gmapInstanceRef.current) {
      gmapInstanceRef.current.panTo({
        lat: cityCoordinates[0],
        lng: cityCoordinates[1],
      });
      gmapInstanceRef.current.setZoom(cityZoom);
    } else if (mapEngine === 'leaflet' && leafletInstanceRef.current) {
      leafletInstanceRef.current.setView(cityCoordinates, cityZoom);
    }
  }, [cityCoordinates, cityZoom, mapEngine]);

  // Traffic Layer toggle on Google Maps
  useEffect(() => {
    if (mapEngine === 'google' && gmapTrafficLayerRef.current) {
      gmapTrafficLayerRef.current.setMap(
        trafficEnabled ? gmapInstanceRef.current : null
      );
    }
  }, [trafficEnabled, mapEngine]);

  // Map type change (Roadmap vs Satellite)
  const setGoogleMapType = (typeId: string) => {
    setGoogleMapTypeId(typeId);
    if (gmapInstanceRef.current) {
      gmapInstanceRef.current.setMapTypeId(typeId as any);
      if (typeId === 'roadmap') {
        gmapInstanceRef.current.setOptions({ styles: GOOGLE_MAPS_STYLE });
      } else {
        gmapInstanceRef.current.setOptions({ styles: [] });
      }
    }
  };

  // -------------------------------------------------------------
  // 2. Render Google Maps Markers and Modern Glowing Polylines
  // -------------------------------------------------------------
  useEffect(() => {
    if (mapEngine !== 'google' || !googleMapsLoaded || !gmapInstanceRef.current) return;
    const map = gmapInstanceRef.current;

    // Clear previous Google markers, polylines & route endpoint pins
    gmapMarkersRef.current.forEach((m) => m.setMap(null));
    gmapMarkersRef.current = [];
    gmapPolylinesRef.current.forEach((p) => p.setMap(null));
    gmapPolylinesRef.current = [];
    gmapRouteMarkersRef.current.forEach((m) => m.setMap(null));
    gmapRouteMarkersRef.current = [];

    // Draw active trip polylines & endpoints on Google Maps
    activeTrips.forEach((trip) => {
      const isFocused = trip.id === focusedTripId;

      // Filter by routes visibility toggle
      if (routesVisibility === 'hidden') return;
      if (routesVisibility === 'focused' && !isFocused) return;

      const origin = { lat: trip.origin.coordinates[0], lng: trip.origin.coordinates[1] };
      const current = trip.currentPosition
        ? { lat: trip.currentPosition[0], lng: trip.currentPosition[1] }
        : origin;
      const dest = { lat: trip.destination.coordinates[0], lng: trip.destination.coordinates[1] };

      // Use rich waypoints if available for realistic urban street curves
      const pathPoints = trip.waypoints && trip.waypoints.length > 1
        ? trip.waypoints.map((w) => ({ lat: w[0], lng: w[1] }))
        : [origin, current, dest];

      // A. Outer Ambient Halo Glow Polyline
      const glowPolyline = new google.maps.Polyline({
        path: pathPoints,
        geodesic: true,
        strokeColor: isFocused ? '#10B981' : '#0284C7',
        strokeOpacity: isFocused ? 0.35 : 0.18,
        strokeWeight: isFocused ? 9 : 5,
        map,
      });

      // B. Inner High-Contrast Core Polyline
      const corePolyline = new google.maps.Polyline({
        path: pathPoints,
        geodesic: true,
        strokeColor: isFocused ? '#059669' : '#0369A1',
        strokeOpacity: isFocused ? 0.98 : 0.70,
        strokeWeight: isFocused ? 4 : 2.5,
        map,
      });

      // Click to focus
      const handlePolylineClick = () => {
        onFocusTrip?.(trip.id);
      };
      glowPolyline.addListener('click', handlePolylineClick);
      corePolyline.addListener('click', handlePolylineClick);

      gmapPolylinesRef.current.push(glowPolyline, corePolyline);

      // C. Endpoint Origin Marker (Punto A - Recogida)
      const originIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#10B981',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 2.5,
        scale: isFocused ? 7 : 5,
      };

      const originMarker = new google.maps.Marker({
        position: origin,
        map,
        title: `Punto de Recogida: ${trip.origin.name} (${trip.riderName})`,
        icon: originIcon,
      });
      originMarker.addListener('click', () => onFocusTrip?.(trip.id));
      gmapRouteMarkersRef.current.push(originMarker);

      // D. Endpoint Destination Marker (Punto B - Destino)
      const destIcon = {
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
        fillColor: '#0F172A',
        fillOpacity: 1,
        strokeColor: isFocused ? '#10B981' : '#FFFFFF',
        strokeWeight: 2,
        scale: isFocused ? 1.4 : 1.1,
        anchor: new google.maps.Point(12, 22),
      };

      const destMarker = new google.maps.Marker({
        position: dest,
        map,
        title: `Destino: ${trip.destination.name} (ETA: ${trip.etaMinutes} min)`,
        icon: destIcon,
      });
      destMarker.addListener('click', () => onFocusTrip?.(trip.id));
      gmapRouteMarkersRef.current.push(destMarker);
    });

    // Filter drivers
    const filteredDrivers = drivers.filter((d) => {
      if (activeFilter === 'all') return true;
      return d.status === activeFilter;
    });

    // Create SVG icons for Google Maps vehicles
    filteredDrivers.forEach((driver) => {
      let fillColor = '#10B981'; // Available
      if (driver.status === 'on_trip') {
        fillColor = '#F59E0B'; // On trip
      } else if (driver.status === 'offline') {
        fillColor = '#94A3B8'; // Offline
      }

      const isFocused = driver.currentTripId === focusedTripId;

      const svgIcon = {
        path: 'M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11.1 2 11.5 2 12v4c0 .6.4 1 1 1h2 M7 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M17 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
        fillColor,
        fillOpacity: 1,
        strokeColor: isFocused ? '#059669' : '#FFFFFF',
        strokeWeight: isFocused ? 3 : 2,
        scale: isFocused ? 1.6 : 1.25,
        anchor: new google.maps.Point(12, 12),
      };

      const marker = new google.maps.Marker({
        position: { lat: driver.coordinates[0], lng: driver.coordinates[1] },
        map,
        title: `${driver.name} (${driver.vehicle.model})`,
        icon: svgIcon,
        zIndex: isFocused ? 99 : 10,
      });

      marker.addListener('click', () => {
        setSelectedDriver(driver);
        if (driver.currentTripId) {
          onFocusTrip?.(driver.currentTripId);
        }
      });

      gmapMarkersRef.current.push(marker);
    });
  }, [mapEngine, googleMapsLoaded, drivers, activeTrips, activeFilter, focusedTripId, routesVisibility, onFocusTrip]);

  // -------------------------------------------------------------
  // 3. Initialize Leaflet Map (Alternative / Fallback)
  // -------------------------------------------------------------
  useEffect(() => {
    if (mapEngine !== 'leaflet' || !leafletContainerRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    if (!leafletInstanceRef.current) {
      const map = L.map(leafletContainerRef.current, {
        center: [cityCoordinates[0], cityCoordinates[1]],
        zoom: cityZoom,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      leafletMarkersGroupRef.current = L.layerGroup().addTo(map);
      leafletRoutesGroupRef.current = L.layerGroup().addTo(map);
      leafletInstanceRef.current = map;
    } else {
      leafletInstanceRef.current.setView(cityCoordinates, cityZoom);
    }

    setTimeout(() => {
      leafletInstanceRef.current?.invalidateSize();
    }, 200);
  }, [mapEngine, cityCoordinates, cityZoom]);

  // Render Leaflet markers & modern routes
  useEffect(() => {
    if (mapEngine !== 'leaflet' || !leafletInstanceRef.current) return;
    const L = (window as any).L;
    if (!L || !leafletMarkersGroupRef.current || !leafletRoutesGroupRef.current) return;

    leafletMarkersGroupRef.current.clearLayers();
    leafletRoutesGroupRef.current.clearLayers();

    // Routes
    activeTrips.forEach((trip) => {
      const isFocused = trip.id === focusedTripId;

      if (routesVisibility === 'hidden') return;
      if (routesVisibility === 'focused' && !isFocused) return;

      const origin = trip.origin.coordinates;
      const dest = trip.destination.coordinates;
      const current = trip.currentPosition || origin;

      const pathPoints = trip.waypoints && trip.waypoints.length > 1
        ? trip.waypoints
        : [origin, current, dest];

      // Outer glow line
      L.polyline(pathPoints, {
        color: isFocused ? '#10B981' : '#0284C7',
        weight: isFocused ? 9 : 5,
        opacity: isFocused ? 0.35 : 0.18,
      }).addTo(leafletRoutesGroupRef.current);

      // Inner core line
      const coreLine = L.polyline(pathPoints, {
        color: isFocused ? '#059669' : '#0369A1',
        weight: isFocused ? 4 : 2.5,
        opacity: isFocused ? 0.98 : 0.75,
      }).addTo(leafletRoutesGroupRef.current);

      coreLine.on('click', () => onFocusTrip?.(trip.id));

      // Origin Point A icon
      const originIcon = L.divIcon({
        className: 'custom-origin-marker',
        html: `
          <div style="width: 18px; height: 18px; border-radius: 50%; background: #10B981; border: 2.5px solid white; box-shadow: 0 0 10px rgba(16,185,129,0.8); display: flex; align-items: center; justify-content: center; color: white; font-size: 9px; font-weight: bold;">
            A
          </div>
        `,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      L.marker(origin, { icon: originIcon })
        .on('click', () => onFocusTrip?.(trip.id))
        .addTo(leafletRoutesGroupRef.current);

      // Destination Point B icon
      const destIcon = L.divIcon({
        className: 'custom-dest-marker',
        html: `
          <div style="width: 20px; height: 20px; border-radius: 6px; background: #0F172A; border: 2px solid ${isFocused ? '#10B981' : '#FFFFFF'}; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold;">
            B
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
      L.marker(dest, { icon: destIcon })
        .on('click', () => onFocusTrip?.(trip.id))
        .addTo(leafletRoutesGroupRef.current);
    });

    // Drivers
    const filteredDrivers = drivers.filter((d) => {
      if (activeFilter === 'all') return true;
      return d.status === activeFilter;
    });

    filteredDrivers.forEach((driver) => {
      let bgColor = '#10B981';
      if (driver.status === 'on_trip') bgColor = '#F59E0B';
      else if (driver.status === 'offline') bgColor = '#94A3B8';

      const isFocused = driver.currentTripId === focusedTripId;

      const customIcon = L.divIcon({
        className: 'custom-taxi-marker',
        html: `
          <div style="width: ${isFocused ? '38px' : '32px'}; height: ${isFocused ? '38px' : '32px'}; border-radius: 10px; background: ${bgColor}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(0,0,0,0.25); border: ${isFocused ? '3px solid #059669' : '2px solid white'}; transition: all 0.2s;">
            <svg width="${isFocused ? '20' : '16'}" height="${isFocused ? '20' : '16'}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11.1 2 11.5 2 12v4c0 .6.4 1 1 1h2"/>
              <circle cx="7" cy="17" r="2"/>
              <path d="M9 17h6"/>
              <circle cx="17" cy="17" r="2"/>
            </svg>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker(driver.coordinates, { icon: customIcon });
      marker.on('click', () => {
        setSelectedDriver(driver);
        if (driver.currentTripId) {
          onFocusTrip?.(driver.currentTripId);
        }
      });
      marker.addTo(leafletMarkersGroupRef.current);
    });
  }, [mapEngine, drivers, activeTrips, activeFilter, focusedTripId, routesVisibility, onFocusTrip]);

  // Fit bounds to entire route when focused trip changes
  const fitBoundsToFocusedTrip = useCallback(() => {
    if (!focusedTrip) return;

    if (mapEngine === 'google' && gmapInstanceRef.current) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend({ lat: focusedTrip.origin.coordinates[0], lng: focusedTrip.origin.coordinates[1] });
      if (focusedTrip.currentPosition) {
        bounds.extend({ lat: focusedTrip.currentPosition[0], lng: focusedTrip.currentPosition[1] });
      }
      bounds.extend({ lat: focusedTrip.destination.coordinates[0], lng: focusedTrip.destination.coordinates[1] });
      gmapInstanceRef.current.fitBounds(bounds, { top: 70, right: 70, bottom: 90, left: 70 });
    } else if (mapEngine === 'leaflet' && leafletInstanceRef.current) {
      const points = [
        focusedTrip.origin.coordinates,
        focusedTrip.currentPosition || focusedTrip.origin.coordinates,
        focusedTrip.destination.coordinates,
      ];
      leafletInstanceRef.current.fitBounds(points, { padding: [60, 60] });
    }
  }, [focusedTrip, mapEngine]);

  useEffect(() => {
    if (focusedTripId) {
      fitBoundsToFocusedTrip();
    }
  }, [focusedTripId, fitBoundsToFocusedTrip]);

  return (
    <div
      id="live-map-card"
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col overflow-hidden relative ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : 'h-[500px]'
      }`}
    >
      {/* 1. Map Header with Engine Switcher, Legends & Route Controls */}
      <div className="p-3.5 px-5 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Mapa y Rutas · {currentCityName}
            </h2>
          </div>

          {/* Engine Selector: Google Maps (Default) vs Leaflet */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setMapEngine('google')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                mapEngine === 'google'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Google Maps</span>
              <span className="text-[9px] px-1 bg-emerald-100 text-emerald-800 font-bold rounded">
                Oficial
              </span>
            </button>

            <button
              onClick={() => setMapEngine('leaflet')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                mapEngine === 'leaflet'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Leaflet OSM</span>
            </button>
          </div>

          {/* Floating Pill: driversOnlineCount */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{driversOnlineCount} activos en {currentCityName}</span>
          </div>
        </div>

        {/* Legend Filters & Route Mode Controls */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          {/* Route Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setRoutesVisibility('all')}
              title="Mostrar todas las rutas activas"
              className={`flex items-center gap-1 px-2 py-1 rounded-lg font-medium transition-all ${
                routesVisibility === 'all'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Route className="w-3.5 h-3.5" />
              <span>Rutas ({activeTrips.length})</span>
            </button>

            <button
              onClick={() => setRoutesVisibility('focused')}
              title="Mostrar solo la ruta seleccionada"
              className={`flex items-center gap-1 px-2 py-1 rounded-lg font-medium transition-all ${
                routesVisibility === 'focused'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Enfocada</span>
            </button>

            <button
              onClick={() => setRoutesVisibility('hidden')}
              title="Ocultar todas las rutas (solo autos)"
              className={`flex items-center gap-1 px-2 py-1 rounded-lg font-medium transition-all ${
                routesVisibility === 'hidden'
                  ? 'bg-slate-700 text-white font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Driver Status Filters */}
          <button
            onClick={() => setActiveFilter(activeFilter === 'available' ? 'all' : 'available')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors font-medium ${
              activeFilter === 'available'
                ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-500'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="hidden md:inline">Disponible</span>
          </button>

          <button
            onClick={() => setActiveFilter(activeFilter === 'on_trip' ? 'all' : 'on_trip')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors font-medium ${
              activeFilter === 'on_trip'
                ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-500'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="hidden md:inline">En viaje</span>
          </button>

          {/* Google Maps Traffic Layer Button */}
          {mapEngine === 'google' && (
            <button
              onClick={() => setTrafficEnabled(!trafficEnabled)}
              title={`Capa de tráfico en tiempo real (${currentCityName})`}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg font-semibold text-xs transition-colors border ${
                trafficEnabled
                  ? 'bg-red-50 text-red-700 border-red-200 ring-1 ring-red-400'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Tráfico Vivo</span>
            </button>
          )}

          {/* Map Layer Switcher & Fullscreen */}
          <div className="flex items-center border-l border-slate-200 pl-2 ml-1 gap-1">
            {mapEngine === 'google' && (
              <button
                onClick={() =>
                  setGoogleMapType(googleMapTypeId === 'roadmap' ? 'hybrid' : 'roadmap')
                }
                title="Cambiar a Satélite / Vectorial"
                className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold"
              >
                <Layers className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => {
                setIsFullscreen(!isFullscreen);
                setTimeout(() => {
                  if (mapEngine === 'google') {
                    google.maps.event.trigger(gmapInstanceRef.current, 'resize');
                  } else {
                    leafletInstanceRef.current?.invalidateSize();
                  }
                }, 200);
              }}
              title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
              className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Quick Sector FlyTo Bar (Dynamic sectors for current city) */}
      <div className="px-4 py-1.5 bg-slate-50/90 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] z-10 scrollbar-none">
        <span className="text-slate-400 font-medium flex items-center gap-1 shrink-0">
          <Compass className="w-3 h-3 text-slate-500" /> Cuadrantes {currentCityName}:
        </span>

        <button
          onClick={() => {
            if (mapEngine === 'google' && gmapInstanceRef.current) {
              gmapInstanceRef.current.panTo({ lat: cityCoordinates[0], lng: cityCoordinates[1] });
              gmapInstanceRef.current.setZoom(cityZoom);
            } else if (mapEngine === 'leaflet' && leafletInstanceRef.current) {
              leafletInstanceRef.current.flyTo(cityCoordinates, cityZoom, { duration: 1.2 });
            }
          }}
          className="px-2.5 py-0.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shrink-0 shadow-2xs"
        >
          Todo {currentCityName}
        </button>

        {zones.map((zone) => (
          <button
            key={zone.id}
            onClick={() => {
              if (mapEngine === 'google' && gmapInstanceRef.current) {
                gmapInstanceRef.current.panTo({
                  lat: zone.coordinates[0],
                  lng: zone.coordinates[1],
                });
                gmapInstanceRef.current.setZoom(15);
              } else if (mapEngine === 'leaflet' && leafletInstanceRef.current) {
                leafletInstanceRef.current.flyTo(zone.coordinates, 15, { duration: 1.2 });
              }
            }}
            className="px-2.5 py-0.5 rounded-md bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 transition-colors shrink-0 font-medium shadow-2xs flex items-center gap-1"
          >
            <span>{zone.name}</span>
            <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-1 rounded">
              {zone.surgeMultiplier}x
            </span>
          </button>
        ))}
      </div>

      {/* 3. Map Viewports Container */}
      <div className="relative flex-1 w-full h-full bg-slate-100">
        {/* Google Maps Viewport */}
        <div
          ref={gmapContainerRef}
          className={`w-full h-full absolute inset-0 z-0 ${
            mapEngine === 'google' ? 'block' : 'hidden'
          }`}
        />

        {/* Leaflet Viewport */}
        <div
          ref={leafletContainerRef}
          className={`w-full h-full absolute inset-0 z-0 ${
            mapEngine === 'leaflet' ? 'block' : 'hidden'
          }`}
        />

        {/* 4. Ultra-Modern Floating Route Telemetry HUD Overlay */}
        {focusedTrip && (
          <div className="absolute top-4 left-4 z-20 bg-slate-950/85 backdrop-blur-md rounded-2xl p-4 border border-slate-700/80 shadow-2xl text-white max-w-md w-full animate-in fade-in slide-in-from-top-3 duration-200">
            {/* HUD Top Bar */}
            <div className="flex items-center justify-between gap-3 mb-2.5 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-white tracking-wide uppercase">
                  Telemetría de Ruta en Vivo
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {focusedTrip.id}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {focusedTrip.category}
                </span>
                <button
                  onClick={() => onFocusTrip?.(null)}
                  className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors text-xs"
                  title="Cerrar telemetría de ruta"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Route Vector Graphic */}
            <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800/90 mb-3 space-y-2">
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span className="font-bold text-slate-100 truncate">
                    {focusedTrip.origin.name}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <div className="flex items-center gap-2 min-w-0 text-right">
                  <span className="font-bold text-slate-100 truncate">
                    {focusedTrip.destination.name}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                </div>
              </div>

              {/* Progress Track */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-linear-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${focusedTrip.progressPercentage}%` }}
                />
              </div>
            </div>

            {/* 4 Telemetry Metrics Grid */}
            <div className="grid grid-cols-4 gap-2 mb-3 text-center">
              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Restante</span>
                <strong className="text-xs font-mono font-bold text-white">
                  {focusedTrip.distanceRemainingKm ? `${focusedTrip.distanceRemainingKm} km` : '2.4 km'}
                </strong>
              </div>

              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">ETA</span>
                <strong className="text-xs font-mono font-bold text-emerald-400">
                  {focusedTrip.etaMinutes} min
                </strong>
              </div>

              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Velocidad</span>
                <strong className="text-xs font-mono font-bold text-white">
                  {focusedTrip.speedKmh ? `${focusedTrip.speedKmh} km/h` : '38 km/h'}
                </strong>
              </div>

              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Tarifa</span>
                <strong className="text-xs font-mono font-bold text-amber-300">
                  RD$ {focusedTrip.fareDOP}
                </strong>
              </div>
            </div>

            {/* Driver & Rider Pill */}
            <div className="flex items-center justify-between text-[11px] py-1.5 px-2.5 bg-slate-900/80 rounded-xl border border-slate-800 mb-3">
              <div className="flex items-center gap-1.5 truncate">
                <Car className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300 truncate">
                  {focusedTrip.driverName}
                </span>
                {focusedTrip.vehiclePlate && (
                  <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-200 border border-slate-700 font-bold">
                    {focusedTrip.vehiclePlate}
                  </span>
                )}
              </div>

              <span className="text-slate-400 text-[10px]">
                Pasajero: <strong className="text-white">{focusedTrip.riderName}</strong>
              </span>
            </div>

            {/* Action Bar */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  if (focusedTrip.currentPosition) {
                    if (mapEngine === 'google' && gmapInstanceRef.current) {
                      gmapInstanceRef.current.panTo({
                        lat: focusedTrip.currentPosition[0],
                        lng: focusedTrip.currentPosition[1],
                      });
                      gmapInstanceRef.current.setZoom(16);
                    } else if (mapEngine === 'leaflet' && leafletInstanceRef.current) {
                      leafletInstanceRef.current.flyTo(focusedTrip.currentPosition, 16);
                    }
                  }
                }}
                className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
              >
                <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
                <span>Centrar en Auto</span>
              </button>

              <button
                onClick={fitBoundsToFocusedTrip}
                className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors shadow-sm"
              >
                <Route className="w-3.5 h-3.5" />
                <span>Ver Trayecto</span>
              </button>
            </div>
          </div>
        )}

        {/* 5. Selected Driver Inspection Card Overlay */}
        {selectedDriver && !focusedTrip && (
          <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200 shadow-xl max-w-sm w-full animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedDriver.avatar}
                  alt={selectedDriver.name}
                  className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">
                    {selectedDriver.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-current mr-0.5" />
                      {selectedDriver.rating}
                    </span>
                    <span>·</span>
                    <span>{selectedDriver.totalTripsToday} viajes hoy</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedDriver(null)}
                className="text-slate-400 hover:text-slate-700 text-xs p-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-xs space-y-1.5 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Vehículo:</span>
                <span className="font-semibold text-slate-800">
                  {selectedDriver.vehicle.model}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Placa Dominicana:</span>
                <span className="font-mono font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  {selectedDriver.vehicle.plate}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Zona actual:</span>
                <span className="font-medium text-emerald-700">
                  {selectedDriver.currentZone} ({currentCityName})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Estado:</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedDriver.status === 'available'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedDriver.status === 'on_trip'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {selectedDriver.status === 'available'
                    ? 'Disponible'
                    : selectedDriver.status === 'on_trip'
                    ? 'En viaje activo'
                    : 'Desconectado'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${selectedDriver.phone}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                Llamar
              </a>

              <button
                onClick={() => {
                  if (mapEngine === 'google' && gmapInstanceRef.current) {
                    gmapInstanceRef.current.panTo({
                      lat: selectedDriver.coordinates[0],
                      lng: selectedDriver.coordinates[1],
                    });
                    gmapInstanceRef.current.setZoom(16);
                  } else if (mapEngine === 'leaflet' && leafletInstanceRef.current) {
                    leafletInstanceRef.current.flyTo(selectedDriver.coordinates, 16);
                  }
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Centrar Auto
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
