import React, { useState, useEffect } from 'react';
import SpaceScene3D from './components/SpaceScene3D';
import FallbackRadar2D from './components/FallbackRadar2D';
import VisionTopBar from './components/VisionTopBar';
import TelemetryPanel from './components/TelemetryPanel';
import SpaceWeatherModal from './components/SpaceWeatherModal';
import CelestialDock from './components/CelestialDock';
import AboutModal from './components/AboutModal';
import { 
  CELESTIAL_BODIES, 
  ORBITAL_OBJECTS, 
  fetchNasaNeoSummary 
} from './data/orbitalData';
import { soundFx } from './utils/audioAmbiance';
import { Shield, Sparkles, AlertTriangle } from 'lucide-react';

export default function App() {
  const [currentBody, setCurrentBody] = useState(CELESTIAL_BODIES[0]);
  const [satellites, setSatellites] = useState(ORBITAL_OBJECTS);
  const [selectedObject, setSelectedObject] = useState(ORBITAL_OBJECTS[0]); // Start with ISS active
  const [isSpaceWeatherOpen, setIsSpaceWeatherOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  
  const [timeMultiplier, setTimeMultiplier] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [use2DFallback, setUse2DFallback] = useState(false);

  // NASA Near-Earth Asteroids telemetry summary state
  const [neoData, setNeoData] = useState(null);

  useEffect(() => {
    // Fetch NASA Asteroids data (with authentic offline fallback)
    fetchNasaNeoSummary().then(data => setNeoData(data));
  }, []);

  // Keyboard shortcut controller
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Space to toggle pause
      if (e.code === 'Space') {
        e.preventDefault();
        soundFx.playVisionClick();
        setIsPaused(prev => !prev);
      }
      // Esc to dismiss modals
      if (e.key === 'Escape') {
        setIsSpaceWeatherOpen(false);
        setIsAboutOpen(false);
        setSelectedObject(null);
      }
      // 1-5 to switch celestial bodies
      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const index = parseInt(e.key, 10) - 1;
        if (CELESTIAL_BODIES[index]) {
          soundFx.playGlassPing(1.1);
          setCurrentBody(CELESTIAL_BODIES[index]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleAudio = () => {
    const newState = !isAudioEnabled;
    const success = soundFx.toggleDrone(newState);
    setIsAudioEnabled(success);
  };

  const handleLockCamera = (obj) => {
    setSelectedObject({ ...obj });
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-space-950 text-slate-100 flex flex-col select-none">
      
      {/* Background Starfield Ambient Glow Mesh */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(circle at 50% 40%, rgba(0, 229, 255, 0.08) 0%, transparent 65%),
            radial-gradient(circle at 80% 80%, rgba(138, 43, 226, 0.07) 0%, transparent 55%),
            radial-gradient(circle at 15% 20%, rgba(59, 130, 246, 0.06) 0%, transparent 50%),
            #02040a
          `
        }}
      />

      {/* Primary Top Bar HUD */}
      <VisionTopBar
        timeMultiplier={timeMultiplier}
        setTimeMultiplier={setTimeMultiplier}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        onOpenSpaceWeather={() => setIsSpaceWeatherOpen(true)}
        isAudioEnabled={isAudioEnabled}
        onToggleAudio={handleToggleAudio}
        use2DFallback={use2DFallback}
        onToggle2DMode={() => {
          soundFx.playVisionClick();
          setUse2DFallback(prev => !prev);
        }}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Main 3D Viewport or 2D Radar Fallback */}
      <div className="relative flex-1 w-full h-full z-10">
        {!use2DFallback ? (
          <SpaceScene3D
            currentBody={currentBody}
            satellites={satellites}
            selectedObject={selectedObject}
            onSelectObject={(obj) => {
              soundFx.playGlassPing(1.25);
              setSelectedObject(obj);
            }}
            timeMultiplier={timeMultiplier}
            isPaused={isPaused}
            onWebGLFailure={() => setUse2DFallback(true)}
          />
        ) : (
          <FallbackRadar2D
            satellites={satellites}
            selectedObject={selectedObject}
            onSelectObject={(obj) => {
              soundFx.playGlassPing(1.2);
              setSelectedObject(obj);
            }}
            onRetryWebGL={() => setUse2DFallback(false)}
            timeMultiplier={timeMultiplier}
            isPaused={isPaused}
          />
        )}
      </div>

      {/* Floating Telemetry Panel */}
      <TelemetryPanel
        object={selectedObject}
        onClose={() => setSelectedObject(null)}
        onLockCamera={handleLockCamera}
      />

      {/* NASA Near-Earth Asteroid Sentinel Pill (Left Bottom HUD) */}
      {neoData && (
        <div className="hidden lg:flex absolute bottom-28 right-6 z-20 items-center gap-3 p-3 rounded-2xl vision-glass-panel max-w-sm">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-sans">
                NASA NeoWs Sentinel
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-white/10 text-slate-300">
                {neoData.elementCount} NEOs Today
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 mt-0.5 truncate">
              Closest: {neoData.nearEarthObjects[1]?.name || '2023 DZ2'} @ {neoData.nearEarthObjects[1]?.close_approach_data[0]?.miss_distance?.kilometers ? (+neoData.nearEarthObjects[1]?.close_approach_data[0]?.miss_distance?.kilometers).toLocaleString() + ' km' : '174,650 km'}
            </p>
          </div>
        </div>
      )}

      {/* Floating Celestial macOS/visionOS Dock */}
      <CelestialDock
        currentBody={currentBody}
        onSelectBody={(body) => {
          setCurrentBody(body);
        }}
      />

      {/* Space Weather & Solar Flare Modal */}
      <SpaceWeatherModal
        isOpen={isSpaceWeatherOpen}
        onClose={() => setIsSpaceWeatherOpen(false)}
      />

      {/* About & Technical Architecture Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </main>
  );
}
