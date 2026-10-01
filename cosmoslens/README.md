# 🌌 CosmosLens — Orbital Telemetry & Deep Space Data Explorer
### Apple visionOS Spatial Computing Aesthetic • Three.js WebGL • Real-Time Orbital Mechanics

**CosmosLens** is a next-generation web application designed with the spatial computing visual language of **Apple visionOS**. It delivers real-time orbital telemetry, satellite ephemerides, space radiation metrics, and deep space exploration through ultra-translucent glassmorphic surfaces, procedural shaders, and interactive 3D WebGL rendering.

---

## ✨ Design Philosophy: visionOS Spatial Computing

- **Deep Glass Refraction (`glass-refraction`)**: Ultra-translucent multi-layered frosted glass panels (`backdrop-filter: blur(28px) saturate(190%)`) featuring specular rim reflections (`inset 0 1px 1px rgba(255,255,255,0.35)`).
- **Floating Spatial Pills & Halos**: Pill-shaped action capsules with soft glowing halos in **Neon Cyan (`#00E5FF`)** and **Cosmic Violet (`#8A2BE2`)**.
- **Futuristic & Minimalist Typography**: Space Grotesk, Outfit, and JetBrains Mono for telemetry readouts.
- **Atmospheric & Celestial Shaders**: Procedural Earth sphere with Fresnel atmospheric glow, specular ocean reflectance, dynamic swirling clouds, and city night lights.
- **Spatial Audio Synthesizer**: Pure Web Audio API ambient cosmic drone (55Hz sub-bass with lowpass resonance sweep) and haptic crystal glass pings.

---

## 🛰️ Core Features & Views

### 1. Interactive 3D Orbital Globe & Ephemerides
- **Live Satellites & Stations**:
  - **ISS (Zarya)**: Crewed laboratory in LEO (418 km, 7.66 km/s, 51.64° inclination).
  - **Hubble Space Telescope (HST)**: High-resolution optical/UV observatory (535 km).
  - **Starlink Fleet (G7-9)**: Laser cross-linked broadband constellation.
  - **Tiangong (CSS)**: Modular Chinese Space Station.
  - **GOES-16 (East)**: Geostationary Earth-monitoring sentinel (35,786 km).
  - **James Webb Space Telescope (JWST)**: Halo orbit at Sun-Earth L2 (1.5M km).
- **Interactive Orbit Paths**: 3D elliptical trajectory curves with pulsation nodes and velocity vectors.
- **Smooth OrbitControls**: Tactile rotation, damping, pinch/scroll zoom, and target camera lock.

### 2. Floating Telemetry Card (visionOS Window)
- **Speedometer Radial Gauge**: Animated SVG arc speedometer with Mach number conversions.
- **Ephemeris Data**: Apogee, Perigee, Inclination, Period, Sub-satellite Lat/Long ground tracks.
- **System Health**: Signal telemetry latency (ms), solar array power output (kW), active onboard science instruments.
- **Export & Telemetry Lock**: Copy telemetry JSON payload with a single tap.

### 3. Solar Climate & Radiation Observatory Modal
- **Chronological Telemetry Stream**: Interactive timeline charts displaying 24-hour variations in:
  - **Solar Wind Speed (km/s)** & Proton Density ($p/cm^3$).
  - **Planetary Kp-Index** with geomagnetic storm alerts (G1-G5).
  - **Interplanetary Magnetic Field (IMF Bz Vector)** in nanoTeslas ($nT$).
  - **GOES X-Ray Solar Flare Classification** (B, C, M, X class).
- **Auroral Oval Window**: Real-time aurora borealis/australis visibility forecaster.

### 4. macOS / visionOS Horizontal Celestial Dock
- Floating capsule dock at the bottom of the viewport with 3D-styled rendered thumbnails:
  - **Earth (Terra)**: LEO/MEO/GEO orbital shells.
  - **Moon (Luna)**: Cislunar & Artemis Gateway zone.
  - **Mars (Ares)**: Perseverance rover and robotic exploration outposts.
  - **Jupiter (Jove)**: Gas giant with Jovian radiation belts & ocean moons (Europa).
  - **Deep Space L2**: James Webb Space Telescope deep cosmic fields.

### 5. Resilient GPU Fallback (2D Tactical Radar)
- Automatic WebGL capability detection.
- Seamless degradation to an interactive **2D Canvas Orbital Radar** with sweeping phosphor beams, concentric orbital shells (LEO, MEO, HEO, GEO), and interactive target selection for low-powered devices.

### 6. NASA Open Data Integration
- Client integration with **NASA NeoWs (Near-Earth Object Web Service)** for live asteroid close approaches and **NOAA SWPC / DONKI** space weather metrics.

---

## ⌨️ Tactical Keyboard Shortcuts

| Key | Action |
| --- | --- |
| <kbd>Space</kbd> | Toggle Simulation Pause / Resume |
| <kbd>1</kbd> | Focus Earth & Orbital Shells |
| <kbd>2</kbd> | Focus Moon (Luna & Gateway) |
| <kbd>3</kbd> | Focus Mars (Ares) |
| <kbd>4</kbd> | Focus Jupiter & Europa |
| <kbd>5</kbd> | Focus Deep Space JWST (L2) |
| <kbd>Esc</kbd> | Close Active Telemetry / Weather Panels |

---

## 🚀 Quick Start

### Option A: One-Click Windows Launcher
Double-click the root batch file:
```cmd
run_cosmoslens.bat
```

### Option B: Terminal Command
```bash
cd cosmoslens
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack

- **Framework**: React 18 & Vite 6
- **3D Graphics**: Three.js (r170) with OrbitControls & Procedural Canvas Shaders
- **Styling**: Tailwind CSS & Apple visionOS Custom Design Tokens
- **Icons**: Lucide React
- **Audio Engine**: Web Audio API Procedural Synthesizer
- **Data**: NASA Open APIs & NOAA SWPC Ephemeris Models
