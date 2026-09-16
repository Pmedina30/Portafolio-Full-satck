import React, { useState, useMemo } from 'react';
import { RouteMetric, BrandingTheme } from '../../types/dashboard';
import { MapPin, Navigation, Plane, Globe, Compass, Filter, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface RouteNetworkMapProps {
  routes: RouteMetric[];
  brand?: BrandingTheme;
  theme?: BrandingTheme;
  title?: string;
  subtitle?: string;
}

interface AirportNode {
  code: string;
  name: string;
  city: string;
  country: string;
  region: string;
  x: number; // 0 to 1000 SVG coordinate
  y: number; // 0 to 700 SVG coordinate
  isHub?: boolean;
}

// Coordinate database for key hubs in the Americas (mapped onto 1000x700 SVG viewport)
const AIRPORT_COORDINATES: Record<string, AirportNode> = {
  SDQ: { code: 'SDQ', name: 'Las Américas Int.', city: 'Santo Domingo', country: 'Rep. Dominicana', region: 'Centroamérica y Caribe', x: 555, y: 310, isHub: true },
  PUJ: { code: 'PUJ', name: 'Punta Cana Int.', city: 'Punta Cana', country: 'Rep. Dominicana', region: 'Centroamérica y Caribe', x: 575, y: 315, isHub: true },
  MIA: { code: 'MIA', name: 'Miami International', city: 'Miami, FL', country: 'EE.UU.', region: 'Norteamérica', x: 490, y: 220 },
  YYZ: { code: 'YYZ', name: 'Toronto Pearson', city: 'Toronto', country: 'Canadá', region: 'Norteamérica', x: 495, y: 100 },
  JFK: { code: 'JFK', name: 'John F. Kennedy', city: 'New York', country: 'EE.UU.', region: 'Norteamérica', x: 545, y: 135 },
  CUN: { code: 'CUN', name: 'Cancún International', city: 'Cancún', country: 'México', region: 'Centroamérica y Caribe', x: 420, y: 270 },
  SJO: { code: 'SJO', name: 'Juan Santamaría', city: 'San José', country: 'Costa Rica', region: 'Centroamérica y Caribe', x: 440, y: 375 },
  PTY: { code: 'PTY', name: 'Tocumen International', city: 'Ciudad de Panamá', country: 'Panamá', region: 'Centroamérica y Caribe', x: 475, y: 385 },
  KIN: { code: 'KIN', name: 'Norman Manley', city: 'Kingston', country: 'Jamaica', region: 'Centroamérica y Caribe', x: 510, y: 320 },
  BOG: { code: 'BOG', name: 'El Dorado International', city: 'Bogotá', country: 'Colombia', region: 'Sudamérica', x: 505, y: 430 },
  MDE: { code: 'MDE', name: 'José María Córdova', city: 'Medellín', country: 'Colombia', region: 'Sudamérica', x: 485, y: 415 },
  LIM: { code: 'LIM', name: 'Jorge Chávez Int.', city: 'Lima', country: 'Perú', region: 'Sudamérica', x: 445, y: 535 },
  SCL: { code: 'SCL', name: 'Arturo Merino Benítez', city: 'Santiago', country: 'Chile', region: 'Sudamérica', x: 480, y: 645 },
  GRU: { code: 'GRU', name: 'Guarulhos International', city: 'São Paulo', country: 'Brasil', region: 'Sudamérica', x: 670, y: 585 },
  EZE: { code: 'EZE', name: 'Ministro Pistarini', city: 'Buenos Aires', country: 'Argentina', region: 'Sudamérica', x: 540, y: 655 },
  UIO: { code: 'UIO', name: 'Mariscal Sucre', city: 'Quito', country: 'Ecuador', region: 'Sudamérica', x: 460, y: 450 }
};

const DEFAULT_THEME: BrandingTheme = {
  companyName: 'Arajet Airlines',
  logoUrl: '',
  primaryColor: '#0B1340',
  accentColor: '#6B21A8',
  highlightColor: '#00C3DE',
  dashboardTitle: 'DASHBOARD OPERATIVO EJECUTIVO',
  dashboardSubtitle: 'Centro de Control de Operaciones (IOCC) · Puntualidad & Desvíos',
  periodLabel: '1 - 15 Septiembre 2026'
};

export const RouteNetworkMap: React.FC<RouteNetworkMapProps> = ({
  routes,
  brand,
  theme,
  title = 'Mapa de Red de Rutas & Desempeño Geográfico',
  subtitle = 'Monitoreo geoespacial en tiempo real de corredores y nodos operacionales'
}) => {
  const currentBrand = brand || theme || DEFAULT_THEME;
  const [selectedNode, setSelectedNode] = useState<AirportNode | null>(null);
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [metricDisplay, setMetricDisplay] = useState<'otp' | 'volume' | 'delay'>('otp');

  // Hub definition (default Santo Domingo SDQ)
  const hub = AIRPORT_COORDINATES['SDQ'];

  // Parse and aggregate route endpoints
  const networkData = useMemo(() => {
    const nodeStats: Record<string, { volume: number; onTime: number; delayed: number; totalDelayMinutes: number }> = {};
    const routeLines: {
      routeCode: string;
      origin: string;
      dest: string;
      fromNode: AirportNode;
      toNode: AirportNode;
      volume: number;
      otpRate: number;
      avgDelay: number;
    }[] = [];

    routes.forEach(r => {
      const parts = r.route.split('-');
      if (parts.length === 2) {
        const [orig, dest] = parts;
        const fromNode = AIRPORT_COORDINATES[orig] || {
          code: orig,
          name: `${orig} Station`,
          city: orig,
          country: 'Red Operativa',
          region: 'General',
          x: 400 + Math.random() * 200,
          y: 250 + Math.random() * 250
        };
        const toNode = AIRPORT_COORDINATES[dest] || {
          code: dest,
          name: `${dest} Station`,
          city: dest,
          country: 'Red Operativa',
          region: 'General',
          x: 450 + Math.random() * 200,
          y: 300 + Math.random() * 250
        };

        // Accumulate stats for origin and destination
        [orig, dest].forEach(code => {
          if (!nodeStats[code]) {
            nodeStats[code] = { volume: 0, onTime: 0, delayed: 0, totalDelayMinutes: 0 };
          }
          nodeStats[code].volume += r.volume;
          nodeStats[code].onTime += r.onTimeCount;
          nodeStats[code].delayed += r.delayedCount;
          nodeStats[code].totalDelayMinutes += r.avgDelayMinutes * r.delayedCount;
        });

        routeLines.push({
          routeCode: r.route,
          origin: orig,
          dest: dest,
          fromNode,
          toNode,
          volume: r.volume,
          otpRate: r.otpRate,
          avgDelay: r.avgDelayMinutes
        });
      }
    });

    return { nodeStats, routeLines };
  }, [routes]);

  // Filter routes by region
  const filteredRoutes = useMemo(() => {
    if (regionFilter === 'all') return networkData.routeLines;
    return networkData.routeLines.filter(r => 
      r.toNode.region === regionFilter || r.fromNode.region === regionFilter
    );
  }, [networkData.routeLines, regionFilter]);

  // Active nodes involved in filtered routes
  const activeNodes = useMemo(() => {
    const activeCodes = new Set<string>();
    filteredRoutes.forEach(r => {
      activeCodes.add(r.origin);
      activeCodes.add(r.dest);
    });
    // Always include hub
    activeCodes.add('SDQ');

    return Array.from(activeCodes).map(code => {
      const base = AIRPORT_COORDINATES[code] || {
        code,
        name: `${code} Node`,
        city: code,
        country: 'Operación',
        region: 'General',
        x: 500,
        y: 350
      };
      const stats = networkData.nodeStats[code] || { volume: 0, onTime: 0, delayed: 0, totalDelayMinutes: 0 };
      const otpRate = stats.volume > 0 ? Math.round((stats.onTime / stats.volume) * 100) : 100;
      const avgDelay = stats.delayed > 0 ? Math.round(stats.totalDelayMinutes / stats.delayed) : 0;

      return {
        ...base,
        volume: stats.volume,
        otpRate,
        avgDelay
      };
    });
  }, [filteredRoutes, networkData.nodeStats]);

  const getNodeColor = (otp: number) => {
    if (otp >= 85) return '#10B981'; // Emerald
    if (otp >= 70) return '#F59E0B'; // Amber
    return '#F43F5E'; // Rose
  };

  return (
    <div className="bg-slate-950 text-white rounded-2xl border border-slate-800 shadow-2xl p-6 flex flex-col justify-between overflow-hidden relative">
      {/* Background Radar Grid Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="radar-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#00C3DE" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#radar-grid)" />
        </svg>
      </div>

      {/* Header & Controls Bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
              style={{ backgroundColor: currentBrand.accentColor || '#6B21A8' }}
            >
              <Navigation className="w-5 h-5 text-cyan-300 rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight text-white">{title}</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  GIS Live Corridors
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
            </div>
          </div>
        </div>

        {/* Filter Badges & Metric Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Region filter */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setRegionFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                regionFilter === 'all' 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todas
            </button>
            <button
              type="button"
              onClick={() => setRegionFilter('Sudamérica')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                regionFilter === 'Sudamérica' 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sudamérica
            </button>
            <button
              type="button"
              onClick={() => setRegionFilter('Norteamérica')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                regionFilter === 'Norteamérica' 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Norteamérica
            </button>
            <button
              type="button"
              onClick={() => setRegionFilter('Centroamérica y Caribe')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                regionFilter === 'Centroamérica y Caribe' 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Caribe
            </button>
          </div>

          {/* Metric display selector */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setMetricDisplay('otp')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                metricDisplay === 'otp' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Puntualidad OTP
            </button>
            <button
              type="button"
              onClick={() => setMetricDisplay('volume')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                metricDisplay === 'volume' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Volumen
            </button>
            <button
              type="button"
              onClick={() => setMetricDisplay('delay')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                metricDisplay === 'delay' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Demoras
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Viewport */}
      <div className="relative z-10 w-full h-[460px] my-3 flex items-center justify-center overflow-hidden rounded-xl bg-slate-900/60 border border-slate-800/60">
        <svg
          viewBox="320 60 450 630"
          className="w-full h-full object-contain"
          style={{ filter: 'drop-shadow(0 0 10px rgba(0, 195, 222, 0.1))' }}
        >
          <defs>
            {/* Corridors Linear Gradient */}
            <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00C3DE" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#6B21A8" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#00C3DE" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="route-hover-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="1" />
              <stop offset="100%" stopColor="#F43F5E" stopOpacity="1" />
            </linearGradient>

            {/* Radar Pulse Animation Keyframes */}
            <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00C3DE" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00C3DE" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Stylized Continent Background Contours (The Americas) */}
          <g fill="#0B1340" stroke="#1E293B" strokeWidth="1" opacity="0.65">
            {/* North America outline */}
            <path d="M 380,80 Q 420,70 480,90 T 560,110 T 600,160 T 520,220 T 450,260 T 400,240 T 360,160 Z" />
            {/* Florida / Gulf */}
            <path d="M 470,200 Q 500,210 510,240 T 480,260 T 450,230 Z" />
            {/* Caribbean islands arc */}
            <path d="M 490,290 Q 530,300 580,315 T 620,340 T 560,335 T 510,310 Z" />
            {/* Central America bridge */}
            <path d="M 400,250 Q 430,290 460,360 T 480,390 T 450,380 T 410,290 Z" />
            {/* South America continent */}
            <path d="M 460,400 Q 550,380 620,440 T 700,540 T 640,640 T 530,680 T 440,620 T 430,500 T 460,420 Z" />
          </g>

          {/* Geodesic Corridors (Curved Bézier Flight Paths) */}
          <g>
            {filteredRoutes.map((r) => {
              const { fromNode, toNode, routeCode, otpRate } = r;
              // Midpoint calculation with curvature offset
              const dx = toNode.x - fromNode.x;
              const dy = toNode.y - fromNode.y;
              const cx = fromNode.x + dx / 2 - dy * 0.15;
              const cy = fromNode.y + dy / 2 + dx * 0.15;
              const pathStr = `M ${fromNode.x},${fromNode.y} Q ${cx},${cy} ${toNode.x},${toNode.y}`;

              const isHovered = hoveredRoute === routeCode;
              const strokeColor = isHovered 
                ? 'url(#route-hover-gradient)' 
                : otpRate < 75 
                  ? '#F43F5E' 
                  : 'url(#route-gradient)';

              return (
                <g key={routeCode} className="cursor-pointer">
                  {/* Outer glow stroke for visibility */}
                  <path
                    d={pathStr}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isHovered ? 3.5 : 1.5}
                    strokeOpacity={isHovered ? 1 : 0.6}
                    strokeDasharray={isHovered ? 'none' : '4, 4'}
                    className="transition-all duration-200"
                    onMouseEnter={() => setHoveredRoute(routeCode)}
                    onMouseLeave={() => setHoveredRoute(null)}
                  />
                  {/* Invisible wide hit-area for easier hover */}
                  <path
                    d={pathStr}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="16"
                    onMouseEnter={() => setHoveredRoute(routeCode)}
                    onMouseLeave={() => setHoveredRoute(null)}
                  />
                </g>
              );
            })}
          </g>

          {/* Main Hub Concentric Radar Rings (Santo Domingo SDQ) */}
          <g transform={`translate(${hub.x}, ${hub.y})`}>
            <circle r="40" fill="url(#hub-glow)" className="animate-ping" style={{ animationDuration: '3s' }} />
            <circle r="22" fill="none" stroke="#00C3DE" strokeWidth="0.8" opacity="0.4" strokeDasharray="3, 3" />
            <circle r="14" fill="none" stroke="#00C3DE" strokeWidth="1" opacity="0.6" />
          </g>

          {/* Airport / Station Nodes */}
          {activeNodes.map((node) => {
            const isSelected = selectedNode?.code === node.code;
            const nodeColor = getNodeColor(node.otpRate);

            return (
              <g
                key={node.code}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer group"
                onClick={() => setSelectedNode(node)}
              >
                {/* Node Ring & Dot */}
                <circle
                  r={node.isHub ? 8 : 5}
                  fill={node.isHub ? '#00C3DE' : nodeColor}
                  stroke="#FFFFFF"
                  strokeWidth={node.isHub ? 2 : 1.5}
                  className="transition-transform group-hover:scale-125"
                />

                {/* Node Code Label */}
                <text
                  x="0"
                  y={node.isHub ? -12 : 14}
                  textAnchor="middle"
                  fill={node.isHub ? '#00C3DE' : '#E2E8F0'}
                  fontSize={node.isHub ? '11' : '9'}
                  fontWeight="bold"
                  fontFamily="monospace"
                  className="pointer-events-none drop-shadow-md select-none"
                >
                  {node.code}
                </text>

                {/* Micro Metric Badge */}
                <text
                  x="0"
                  y={node.isHub ? -22 : 24}
                  textAnchor="middle"
                  fill={nodeColor}
                  fontSize="7.5"
                  fontWeight="black"
                  className="pointer-events-none select-none font-mono"
                >
                  {metricDisplay === 'otp' && `${node.otpRate}%`}
                  {metricDisplay === 'volume' && `${node.volume} ops`}
                  {metricDisplay === 'delay' && `${node.avgDelay}m`}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Flight Corridors Overlay Card */}
        {hoveredRoute && (
          <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 rounded-xl p-3.5 shadow-2xl z-30 animate-in fade-in duration-150 max-w-xs pointer-events-none">
            {(() => {
              const r = filteredRoutes.find(item => item.routeCode === hoveredRoute);
              if (!r) return null;
              return (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Plane className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-mono font-bold text-sm text-white">{r.routeCode}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300">
                      Corredor Activo
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {r.fromNode.city} ➔ {r.toNode.city}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Operaciones</span>
                      <strong className="font-mono text-white">{r.volume}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">OTP %</span>
                      <strong className={`font-mono ${r.otpRate >= 85 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {r.otpRate}%
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Demora</span>
                      <strong className="font-mono text-white">{r.avgDelay} min</strong>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Selected Node Details Card */}
        {selectedNode && (
          <div className="absolute bottom-4 right-4 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow-2xl z-30 animate-in fade-in duration-150 max-w-xs">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono font-bold text-xs">
                  {selectedNode.code}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">{selectedNode.city}</h4>
                  <p className="text-[10px] text-slate-400">{selectedNode.country}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-1.5"
              >
                ✕
              </button>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-800 space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Región / Mercado:</span>
                <span className="text-slate-200 font-medium">{selectedNode.region}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Puntualidad en Nodo:</span>
                <span className="font-mono font-bold text-emerald-400">{selectedNode.otpRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tráfico Operacional:</span>
                <span className="font-mono font-bold text-white">{selectedNode.volume} vuelos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Retraso Promedio:</span>
                <span className="font-mono font-bold text-amber-400">{selectedNode.avgDelay} min</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend Footer */}
      <div className="relative z-10 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-cyan-400/30" />
            <span className="text-white font-medium">Hub Central (SDQ)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>OTP Óptimo (&ge; 85%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Alerta Media (70-84%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Crítico (&lt; 70%)</span>
          </div>
        </div>

        <div className="font-mono text-[11px] text-slate-400">
          Mostrando <strong className="text-cyan-400">{filteredRoutes.length}</strong> rutas activas en la red
        </div>
      </div>
    </div>
  );
};
