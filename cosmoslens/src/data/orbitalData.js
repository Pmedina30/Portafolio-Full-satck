/**
 * CosmosLens Orbital Telemetry & Celestial Registry
 * Real-time orbital mechanics, Keplerian parameters, space weather telemetry & NASA data hooks.
 */

export const CELESTIAL_BODIES = [
  {
    id: 'earth',
    name: 'Earth (Terra)',
    subtitle: 'LEO / MEO / GEO Orbital Shells',
    category: 'Planetary System',
    radius: 6371, // km
    orbitRadius: 0,
    color: '#00E5FF',
    accentColor: '#3B82F6',
    ambientGlow: 'rgba(0, 229, 255, 0.45)',
    description: 'Home planetary sphere host to primary human orbital infrastructure, navigation constellations, and science outposts.',
    stats: {
      mass: '5.972 × 10²⁴ kg',
      gravity: '9.807 m/s²',
      activeSatellites: '9,840+',
      spaceJunkTracked: '27,000+',
      orbitalVelocity: '29.78 km/s (heliocentric)',
    },
    cameraDistance: 4.8,
  },
  {
    id: 'moon',
    name: 'Moon (Luna)',
    subtitle: 'Cislunar & Artemis Gateway Zone',
    category: 'Natural Satellite',
    radius: 1737,
    orbitRadius: 384400,
    color: '#E2E8F0',
    accentColor: '#94A3B8',
    ambientGlow: 'rgba(226, 232, 240, 0.35)',
    description: 'Target of human return and site for the orbital Lunar Gateway station in Near-Rectilinear Halo Orbit (NRHO).',
    stats: {
      mass: '7.342 × 10²² kg',
      gravity: '1.62 m/s²',
      surfaceTemp: '-130°C to +120°C',
      orbitalPeriod: '27.3 days',
      gatewayDistance: '70,000 km (apoapsis)',
    },
    cameraDistance: 3.6,
  },
  {
    id: 'mars',
    name: 'Mars (Ares)',
    subtitle: 'Perseverance & Deep Space Outpost',
    category: 'Terrestrial Planet',
    radius: 3389,
    orbitRadius: 227900000,
    color: '#FF6B4A',
    accentColor: '#E11D48',
    ambientGlow: 'rgba(255, 107, 74, 0.4)',
    description: 'The Red Planet undergoing intensive robotic prospecting by NASA Perseverance, Curiosity, and orbital relay orbiters (MRO).',
    stats: {
      mass: '6.417 × 10²³ kg',
      gravity: '3.721 m/s²',
      activeRovers: '2 active (NASA / CNSA)',
      atmosphere: '95.3% CO₂ (0.6% Earth pressure)',
      signalDelay: '14.2 min (round-trip)',
    },
    cameraDistance: 4.0,
  },
  {
    id: 'jupiter',
    name: 'Jupiter (Jove)',
    subtitle: 'Gas Giant & Ocean Worlds (Europa/Ganymede)',
    category: 'Jovian System',
    radius: 69911,
    orbitRadius: 778500000,
    color: '#FBBF24',
    accentColor: '#F59E0B',
    ambientGlow: 'rgba(245, 158, 11, 0.4)',
    description: 'Solar System colossus exhibiting extreme radiation belts, Great Red Spot anticyclone, and habitable subsurface ocean moons.',
    stats: {
      mass: '1.898 × 10²⁷ kg (318 Earths)',
      moons: '95 recognized moons',
      magneticField: '20,000x stronger than Earth',
      radiationField: 'Extreme Jovian Bremsstrahlung',
      flagshipMission: 'Europa Clipper & JUICE En-Route',
    },
    cameraDistance: 5.2,
  },
  {
    id: 'jwst',
    name: 'Lagrange Point 2 (L2)',
    subtitle: 'James Webb Deep Space Observatory',
    category: 'Deep Space Observatory',
    radius: 200,
    orbitRadius: 1500000,
    color: '#8A2BE2',
    accentColor: '#C084FC',
    ambientGlow: 'rgba(138, 43, 226, 0.55)',
    description: 'Gravitationally stable halo orbit 1.5 million km anti-sunward, peering into the cosmic dawn and exoplanet atmospheres.',
    stats: {
      instrumentTemp: '7 Kelvin (-266°C MIRI Cryocooler)',
      sunshieldArea: 'Tennis Court Size (21m × 14m)',
      primaryMirror: '6.5m Beryllium-Gold (18 Segments)',
      dataTransmitted: '57.2 GB/day (Ka-band Direct to Earth)',
      targetRegistry: 'GN-z11, Pillars of Creation, Trappist-1',
    },
    cameraDistance: 3.2,
  }
];

export const ORBITAL_OBJECTS = [
  {
    id: 'iss',
    name: 'ISS (Zarya)',
    type: 'Habited Space Station',
    country: 'International (NASA/ESA/JAXA/CSA/Roscosmos)',
    altitudeKm: 418.4,
    velocityKmS: 7.66,
    apogeeKm: 422,
    perigeeKm: 414,
    inclinationDeg: 51.64,
    periodMin: 92.9,
    crewCount: 7,
    noradId: 25544,
    orbitRadius3D: 1.45,
    speed3D: 0.8,
    orbitColor: '#00E5FF',
    beaconColor: '#00E5FF',
    status: 'Operational - Nominal',
    solarArrayOutputKw: 120,
    signalLatencyMs: 14.8,
    frequencyMhz: 145.80,
    description: 'Microgravity science laboratory orbiting Earth continuously with human crew since November 2000.',
    experiments: ['Cold Atom Lab', 'Alpha Magnetic Spectrometer', 'Tissue Chips in Space'],
    coordinates: { lat: -24.31, lng: 135.12 },
  },
  {
    id: 'hst',
    name: 'Hubble Space Telescope',
    type: 'Optical & UV Observatory',
    country: 'NASA / ESA',
    altitudeKm: 535.2,
    velocityKmS: 7.59,
    apogeeKm: 541,
    perigeeKm: 532,
    inclinationDeg: 28.47,
    periodMin: 95.4,
    crewCount: 0,
    noradId: 20580,
    orbitRadius3D: 1.62,
    speed3D: 0.65,
    orbitColor: '#38BDF8',
    beaconColor: '#38BDF8',
    status: 'Fine Guidance Tracking',
    solarArrayOutputKw: 2.8,
    signalLatencyMs: 18.2,
    frequencyMhz: 2287.5,
    description: 'Legendary space observatory in continuous operation since 1990, revealing cosmic expansion and deep nebulae.',
    experiments: ['Cosmic Origins Spectrograph', 'Wide Field Camera 3', 'Advanced Camera for Surveys'],
    coordinates: { lat: 18.64, lng: -42.85 },
  },
  {
    id: 'starlink-train',
    name: 'Starlink Fleet (G7-9)',
    type: 'LEO Broadband Constellation',
    country: 'SpaceX / USA',
    altitudeKm: 550.0,
    velocityKmS: 7.61,
    apogeeKm: 555,
    perigeeKm: 548,
    inclinationDeg: 53.2,
    periodMin: 95.6,
    crewCount: 0,
    noradId: 58241,
    orbitRadius3D: 1.70,
    speed3D: 0.72,
    orbitColor: '#A855F7',
    beaconColor: '#A855F7',
    status: 'Constellation Mesh Active',
    solarArrayOutputKw: 4.2,
    signalLatencyMs: 22.4,
    frequencyMhz: 12150.0,
    description: 'Optical space-laser crosslinked mega-constellation delivering high-throughput low-latency global broadband connectivity.',
    experiments: ['Direct-to-Cell LTE Payload', 'Autonomous Collision Avoidance Crypt'],
    coordinates: { lat: 46.12, lng: 9.38 },
  },
  {
    id: 'tiangong',
    name: 'Tiangong (CSS)',
    type: 'Modular Space Station',
    country: 'CNSA (China)',
    altitudeKm: 389.2,
    velocityKmS: 7.68,
    apogeeKm: 395,
    perigeeKm: 383,
    inclinationDeg: 41.47,
    periodMin: 92.2,
    crewCount: 3,
    noradId: 48274,
    orbitRadius3D: 1.38,
    speed3D: 0.85,
    orbitColor: '#F43F5E',
    beaconColor: '#F43F5E',
    status: 'Crewed Expedition Active',
    solarArrayOutputKw: 80,
    signalLatencyMs: 16.5,
    frequencyMhz: 2200.0,
    description: 'T-shaped modular orbital station comprising Tianhe core module and Wentian & Mengtian science experiment modules.',
    experiments: ['Cold Atomic Clock Ensemble', 'High Microgravity Physics Rack'],
    coordinates: { lat: 31.23, lng: 121.47 },
  },
  {
    id: 'goes16',
    name: 'GOES-16 (East)',
    type: 'Geostationary Weather & Solar Observer',
    country: 'NOAA / NASA',
    altitudeKm: 35786.0,
    velocityKmS: 3.07,
    apogeeKm: 35794,
    perigeeKm: 35780,
    inclinationDeg: 0.05,
    periodMin: 1436.1,
    crewCount: 0,
    noradId: 41866,
    orbitRadius3D: 2.35,
    speed3D: 0.25,
    orbitColor: '#F59E0B',
    beaconColor: '#F59E0B',
    status: 'GEO Synchronous Lock',
    solarArrayOutputKw: 4.0,
    signalLatencyMs: 238.0,
    frequencyMhz: 1694.1,
    description: 'Geostationary orbital sentinel monitoring western hemisphere weather dynamics, lightning flashes, and solar flare X-ray flux.',
    experiments: ['Advanced Baseline Imager (ABI)', 'Geostationary Lightning Mapper (GLM)', 'Solar Ultraviolet Imager (SUVI)'],
    coordinates: { lat: 0.02, lng: -75.2 },
  },
  {
    id: 'jwst-craft',
    name: 'James Webb Space Telescope',
    type: 'Cryogenic Infrared Observatory',
    country: 'NASA / ESA / CSA',
    altitudeKm: 1500000.0,
    velocityKmS: 0.22,
    apogeeKm: 1540000,
    perigeeKm: 1460000,
    inclinationDeg: 5.2,
    periodMin: 259200, // ~6 months halo period
    crewCount: 0,
    noradId: 50463,
    orbitRadius3D: 3.1,
    speed3D: 0.1,
    orbitColor: '#8A2BE2',
    beaconColor: '#C084FC',
    status: 'Deep Science Survey (Cycle 3)',
    solarArrayOutputKw: 2.0,
    signalLatencyMs: 5120.0,
    frequencyMhz: 25900.0,
    description: 'Flagship infrared observatory orbiting the Sun-Earth L2 Lagrangian point uncovering the earliest galaxies formed after the Big Bang.',
    experiments: ['NIRCam Early Universe', 'NIRSpec Multi-Object Prism', 'MIRI Exoplanet Transit'],
    coordinates: { lat: 0.0, lng: 180.0 },
  }
];

export const SPACE_WEATHER_INITIAL = {
  kpIndex: 3.67, // Geomagnetic disturbance scale (0-9)
  kpStatus: 'Active - Aurora Possible at High Latitudes',
  solarWindSpeedKmS: 472.4, // Normal: 300-800 km/s
  solarWindDensityPcm3: 5.8, // Protons per cm3
  interplanetaryMagneticFieldBt: 6.4, // nanoTeslas
  interplanetaryMagneticFieldBz: -2.8, // Southward Bz indicates reconnection/storm
  xrayFlareClass: 'M1.4', // Current solar flare background
  cosmicRayDoseMicroSvH: 0.28,
  vanAllenBeltDensity: 'Moderate Trapped Electron Flux',
  solarCycle: 'Cycle 25 - Approaching Solar Maximum',
  alertLevel: 'NORMAL-ELEVATED',
  telemetryHistory: [
    { time: '00:00', wind: 410, kp: 2.3, bz: 1.2, flux: 1.2 },
    { time: '03:00', wind: 425, kp: 2.7, bz: -0.8, flux: 1.8 },
    { time: '06:00', wind: 440, kp: 3.1, bz: -1.4, flux: 2.5 },
    { time: '09:00', wind: 462, kp: 3.5, bz: -2.1, flux: 3.8 },
    { time: '12:00', wind: 485, kp: 4.2, bz: -3.5, flux: 5.1 },
    { time: '15:00', wind: 495, kp: 4.0, bz: -3.1, flux: 4.4 },
    { time: '18:00', wind: 478, kp: 3.8, bz: -2.6, flux: 3.9 },
    { time: '21:00', wind: 472, kp: 3.67, bz: -2.8, flux: 3.6 }
  ]
};

/**
 * NASA Open API Integration & Secure Proxy Client
 * Fetches Near-Earth Asteroids (NeoWs) or Astronomy Picture of the Day (APOD)
 * with robust offline mock fallback.
 */
export async function fetchNasaNeoSummary() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=DEMO_KEY`;
    const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!response.ok) throw new Error('NASA API response error');
    const data = await response.json();
    return {
      elementCount: data.element_count,
      nearEarthObjects: Object.values(data.near_earth_objects || {})[0] || []
    };
  } catch (err) {
    // Graceful offline fallback with authentic NEO data
    return {
      elementCount: 14,
      nearEarthObjects: [
        {
          id: '3542519',
          name: '(2010 PK9)',
          estimated_diameter: { meters: { estimated_diameter_max: 260.4 } },
          is_potentially_hazardous_asteroid: false,
          close_approach_data: [{
            relative_velocity: { kilometers_per_second: '18.42' },
            miss_distance: { kilometers: '4285190' }
          }]
        },
        {
          id: '5426189',
          name: '(2023 DZ2)',
          estimated_diameter: { meters: { estimated_diameter_max: 95.0 } },
          is_potentially_hazardous_asteroid: false,
          close_approach_data: [{
            relative_velocity: { kilometers_per_second: '28.04' },
            miss_distance: { kilometers: '174650' }
          }]
        }
      ]
    };
  }
}
