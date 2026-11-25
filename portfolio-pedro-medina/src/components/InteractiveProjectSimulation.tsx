import React, { useState } from 'react';
import { Language } from '../types/portfolio';
import {
  MapPin,
  Plane,
  ShoppingCart,
  ShieldCheck,
  Box,
  DollarSign,
  Cloud,
  HardDrive,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface SimulationProps {
  type: 'aviation' | 'taxi' | 'pos' | 'qa' | 'spatial3d' | 'fintech';
  lang: Language;
}

export const InteractiveProjectSimulation: React.FC<SimulationProps> = ({ type, lang }) => {
  // 1. TAXI OPERATIONS STATE
  const [selectedZone, setSelectedZone] = useState<number>(0);
  const taxiZones = [
    { name: 'Piantini', units: 94, grossRD: 164200, eta: '1m 48s', traffic: 'Moderate' },
    { name: 'Naco', units: 78, grossRD: 128500, eta: '2m 05s', traffic: 'High (27 Feb)' },
    { name: 'Bella Vista', units: 66, grossRD: 109428, eta: '2m 20s', traffic: 'Fluid' },
    { name: 'Zona Colonial', units: 72, grossRD: 86300, eta: '2m 42s', traffic: 'Moderate' }
  ];

  // 2. AVIATION IOCC STATE
  const [selectedCorridor, setSelectedCorridor] = useState<number>(0);
  const corridors = [
    { route: 'SDQ → JFK', otp: 94.8, delayCause: 'ATC Slot (12%)', blockHrs: '3h 52m', daxMs: '5.4ms' },
    { route: 'SDQ → MIA', otp: 96.4, delayCause: 'Weather (8%)', blockHrs: '2h 18m', daxMs: '4.9ms' },
    { route: 'PUJ → EWR', otp: 91.2, delayCause: 'Turnaround (18%)', blockHrs: '4h 05m', daxMs: '6.8ms' },
    { route: 'STI → SJU', otp: 98.1, delayCause: 'Nominal (<2%)', blockHrs: '1h 12m', daxMs: '4.1ms' }
  ];

  // 3. POS / COLMADOPRO STATE
  const [syncMode, setSyncMode] = useState<'cloud' | 'local'>('cloud');
  const [cartQty, setCartQty] = useState<number>(3);
  const unitPriceRD = 450;
  const subtotalRD = cartQty * unitPriceRD;
  const itbisRD = Math.round(subtotalRD * 0.18);
  const totalRD = subtotalRD + itbisRD;

  // 4. CENTERWELL QA ENGINE STATE
  const [qaMode, setQaMode] = useState<'automated' | 'manual'>('automated');

  // 5. NEXUS-01 & COSMOSLENS 3D STATE
  const [explosionFactor, setExplosionFactor] = useState<number>(65);
  const [shaderPreset, setShaderPreset] = useState<'obsidian' | 'titanium' | 'vermilion'>('obsidian');

  // 6. FINTECH / TIENDARD STATE
  const [fobUSD, setFobUSD] = useState<number>(240);
  const weightLbs = 4;
  const freightUSD = weightLbs * 3.5;
  const isTaxable = fobUSD > 200; // DR Law 146-00 $200 USD exemption
  const dutyUSD = isTaxable ? Math.round((fobUSD + freightUSD) * 0.38) : 0;
  const landedDOP = Math.round((fobUSD + freightUSD + dutyUSD) * 60.5);

  if (type === 'taxi') {
    const z = taxiZones[selectedZone];
    const commissionRD = Math.round(z.grossRD * 0.2);
    return (
      <div className="p-4 rounded-xl bg-[#F6F5F0] dark:bg-[#0A0A09] border border-[#DFDDD4] dark:border-[#242421] space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#FF4F18] font-bold flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {lang === 'en' ? 'LIVE POLYGON TELEMETRY // SDQ' : 'TELEMETRÍA DE POLÍGONOS // SDQ'}
          </span>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            INTRANT + PGR OK
          </span>
        </div>

        {/* Zone Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {taxiZones.map((zone, idx) => (
            <button
              key={zone.name}
              type="button"
              onClick={() => setSelectedZone(idx)}
              className={`py-1.5 px-2 rounded-lg font-mono text-[11px] font-semibold border transition-all ${
                selectedZone === idx
                  ? 'bg-[#111110] text-white dark:bg-[#F4F3EF] dark:text-[#0A0A09] border-[#111110] dark:border-[#F4F3EF]'
                  : 'bg-white dark:bg-[#151513] text-neutral-600 dark:text-neutral-400 border-[#DFDDD4] dark:border-[#262623]'
              }`}
            >
              {zone.name}
            </button>
          ))}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="p-2.5 rounded-lg bg-white dark:bg-[#141412] border border-[#DFDDD4] dark:border-[#242421]">
            <span className="font-mono text-[10px] text-neutral-500 block">
              {lang === 'en' ? 'Active Units' : 'Unidades'}
            </span>
            <span className="font-mono text-sm font-bold text-[#111110] dark:text-[#F4F3EF]">
              {z.units} Cars
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-[#141412] border border-[#DFDDD4] dark:border-[#242421]">
            <span className="font-mono text-[10px] text-neutral-500 block">
              {lang === 'en' ? 'Gross / 20% Fee' : 'Bruto / 20% Com.'}
            </span>
            <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
              RD$ {commissionRD.toLocaleString()}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-[#141412] border border-[#DFDDD4] dark:border-[#242421]">
            <span className="font-mono text-[10px] text-neutral-500 block">
              {lang === 'en' ? 'Mean Dispatch' : 'Asignación'}
            </span>
            <span className="font-mono text-sm font-bold text-[#FF4F18]">
              {z.eta}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'aviation') {
    const c = corridors[selectedCorridor];
    return (
      <div className="p-4 rounded-xl bg-[#F6F5F0] dark:bg-[#0A0A09] border border-[#DFDDD4] dark:border-[#242421] space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-sky-600 dark:text-sky-400 font-bold flex items-center gap-1.5">
            <Plane className="w-3.5 h-3.5" />
            {lang === 'en' ? 'CLIENT DAX CORRIDOR SIMULATOR' : 'SIMULADOR DAX DE CORREDORES'}
          </span>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400">
            DAX: {c.daxMs}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {corridors.map((item, idx) => (
            <button
              key={item.route}
              type="button"
              onClick={() => setSelectedCorridor(idx)}
              className={`py-1.5 px-2 rounded-lg font-mono text-[11px] font-semibold border transition-all ${
                selectedCorridor === idx
                  ? 'bg-[#111110] text-white dark:bg-[#F4F3EF] dark:text-[#0A0A09] border-[#111110] dark:border-[#F4F3EF]'
                  : 'bg-white dark:bg-[#151513] text-neutral-600 dark:text-neutral-400 border-[#DFDDD4] dark:border-[#262623]'
              }`}
            >
              {item.route}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="p-2.5 rounded-lg bg-white dark:bg-[#141412] border border-[#DFDDD4] dark:border-[#242421]">
            <span className="font-mono text-[10px] text-neutral-500 block">OTP (15m)</span>
            <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {c.otp}%
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-[#141412] border border-[#DFDDD4] dark:border-[#242421]">
            <span className="font-mono text-[10px] text-neutral-500 block">
              {lang === 'en' ? 'Pareto Top Cause' : 'Causa Pareto'}
            </span>
            <span className="font-mono text-xs font-bold text-[#111110] dark:text-[#F4F3EF]">
              {c.delayCause}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-[#141412] border border-[#DFDDD4] dark:border-[#242421]">
            <span className="font-mono text-[10px] text-neutral-500 block">Block Time</span>
            <span className="font-mono text-sm font-bold text-[#FF4F18]">
              {c.blockHrs}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'pos') {
    return (
      <div className="p-4 rounded-xl bg-[#F6F5F0] dark:bg-[#0A0A09] border border-[#DFDDD4] dark:border-[#242421] space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
            <ShoppingCart className="w-3.5 h-3.5" />
            {lang === 'en' ? 'DUAL-SYNC POS TERMINAL PREVIEW' : 'TERMINAL POS SINCRONIZACIÓN DUAL'}
          </span>
          <button
            type="button"
            onClick={() => setSyncMode(syncMode === 'cloud' ? 'local' : 'cloud')}
            className="inline-flex items-center gap-1 font-mono text-[10px] px-2.5 py-1 rounded-md bg-white dark:bg-[#161614] border border-[#DFDDD4] dark:border-[#262623] hover:border-[#FF4F18]"
          >
            {syncMode === 'cloud' ? (
              <>
                <Cloud className="w-3 h-3 text-emerald-500" />
                <span>Cloud Firestore</span>
              </>
            ) : (
              <>
                <HardDrive className="w-3 h-3 text-amber-500" />
                <span>Offline IndexedDB</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-white dark:bg-[#141412] border border-[#DFDDD4] dark:border-[#242421]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-[#111110] dark:text-[#F4F3EF]">
              SKU #804 (RD$ 450)
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCartQty(Math.max(1, cartQty - 1))}
                className="w-6 h-6 rounded bg-[#EEECE5] dark:bg-[#242421] font-mono text-xs font-bold"
              >
                -
              </button>
              <span className="w-6 text-center font-mono text-xs font-bold">{cartQty}</span>
              <button
                type="button"
                onClick={() => setCartQty(Math.min(20, cartQty + 1))}
                className="w-6 h-6 rounded bg-[#EEECE5] dark:bg-[#242421] font-mono text-xs font-bold"
              >
                +
              </button>
            </div>
          </div>

          <div className="text-right font-mono">
            <div className="text-[10px] text-neutral-500">
              +18% ITBIS (RD$ {itbisRD.toLocaleString()})
            </div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Total: RD$ {totalRD.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'qa') {
    return (
      <div className="p-4 rounded-xl bg-[#F6F5F0] dark:bg-[#0A0A09] border border-[#DFDDD4] dark:border-[#242421] space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            {lang === 'en' ? 'HEALTHCARE QA PIPELINE BENCHMARK' : 'BENCHMARK PIPELINE QA SALUD'}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setQaMode('manual')}
              className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold ${
                qaMode === 'manual'
                  ? 'bg-amber-500 text-black'
                  : 'bg-white dark:bg-[#161614] text-neutral-500'
              }`}
            >
              {lang === 'en' ? 'Legacy Manual' : 'Manual'}
            </button>
            <button
              type="button"
              onClick={() => setQaMode('automated')}
              className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold ${
                qaMode === 'automated'
                  ? 'bg-emerald-500 text-black'
                  : 'bg-white dark:bg-[#161614] text-neutral-500'
              }`}
            >
              Python + VBA
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-lg bg-white dark:bg-[#141412] border border-[#DFDDD4] dark:border-[#242421]">
            <span className="font-mono text-[10px] text-neutral-500 block">
              {lang === 'en' ? 'Cycle Time' : 'Tiempo Ciclo'}
            </span>
            <span className="font-mono text-sm font-bold text-[#111110] dark:text-[#F4F3EF]">
              {qaMode === 'automated' ? '14 mins (-65%)' : '42 mins'}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-[#141412] border border-[#DFDDD4] dark:border-[#242421]">
            <span className="font-mono text-[10px] text-neutral-500 block">
              {lang === 'en' ? 'Rubric Accuracy' : 'Precisión QA'}
            </span>
            <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {qaMode === 'automated' ? '99.2%' : '91.4%'}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-[#141412] border border-[#DFDDD4] dark:border-[#242421]">
            <span className="font-mono text-[10px] text-neutral-500 block">Power BI SLA</span>
            <span className="font-mono text-xs font-bold text-[#FF4F18]">
              {qaMode === 'automated' ? 'Auto-Synced' : 'Manual CSV'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'spatial3d') {
    const gapPx = Math.round((explosionFactor / 100) * 18);
    const shaderColors = {
      obsidian: 'bg-[#181816] border-neutral-600 text-white',
      titanium: 'bg-gradient-to-r from-neutral-300 to-neutral-100 border-neutral-400 text-neutral-900',
      vermilion: 'bg-gradient-to-r from-[#FF4F18] to-amber-500 border-[#FF4F18] text-white'
    };

    return (
      <div className="p-4 rounded-xl bg-[#F6F5F0] dark:bg-[#0A0A09] border border-[#DFDDD4] dark:border-[#242421] space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#FF4F18] font-bold flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5" />
            {lang === 'en' ? '3D KINEMATICS & PBR SHADER RIG' : 'CINEMÁTICA 3D Y SHADER PBR'}
          </span>
          <div className="flex items-center gap-1">
            {(['obsidian', 'titanium', 'vermilion'] as const).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setShaderPreset(preset)}
                className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase ${
                  shaderPreset === preset
                    ? 'bg-[#111110] text-white dark:bg-[#F4F3EF] dark:text-[#0A0A09] font-bold'
                    : 'text-neutral-500'
                }`}
              >
                {preset.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Exploded Layers */}
        <div className="py-2 px-3 rounded-lg bg-white dark:bg-[#141412] border border-[#DFDDD4] dark:border-[#242421] flex items-center justify-center overflow-hidden">
          <div className="flex items-center transition-all duration-200" style={{ gap: `${gapPx}px` }}>
            <div className={`px-2.5 py-1.5 rounded border font-mono text-[10px] font-bold ${shaderColors[shaderPreset]}`}>
              [CHASSIS L]
            </div>
            <div className="px-2.5 py-1.5 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold">
              [40mm DRIVER]
            </div>
            <div className="px-2.5 py-1.5 rounded border border-sky-500/40 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono text-[10px] font-bold">
              [NEURAL DSP]
            </div>
            <div className={`px-2.5 py-1.5 rounded border font-mono text-[10px] font-bold ${shaderColors[shaderPreset]}`}>
              [CHASSIS R]
            </div>
          </div>
        </div>

        {/* Exploded View Slider */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-neutral-500 whitespace-nowrap">
            {lang === 'en' ? 'Explode Vector:' : 'Vector Explosión:'} {explosionFactor}%
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={explosionFactor}
            onChange={(e) => setExplosionFactor(Number(e.target.value))}
            className="w-full accent-[#FF4F18] cursor-pointer h-1.5 rounded-lg"
          />
        </div>
      </div>
    );
  }

  // 6. FINTECH & TIENDARD CALCULATOR
  return (
    <div className="p-4 rounded-xl bg-[#F6F5F0] dark:bg-[#0A0A09] border border-[#DFDDD4] dark:border-[#242421] space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5" />
          {lang === 'en' ? 'LAW 146-00 DR CUSTOMS & FINTECH ENGINE' : 'MOTOR ADUANAL LEY 146-00 Y FINTECH'}
        </span>
        <span
          className={`font-mono text-[10px] px-2 py-0.5 rounded flex items-center gap-1 ${
            isTaxable
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          }`}
        >
          {isTaxable ? (
            <>
              <AlertTriangle className="w-3 h-3" />
              <span>{lang === 'en' ? '> $200 DGA Duty Applied' : '> US$200 Aplica Arancel'}</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3 h-3" />
              <span>{lang === 'en' ? 'Exempt (<$200 De Minimis)' : 'Exento (<US$200)'}</span>
            </>
          )}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] font-bold text-[#111110] dark:text-[#F4F3EF] whitespace-nowrap">
          FOB: US$ {fobUSD}
        </span>
        <input
          type="range"
          min={60}
          max={500}
          step={10}
          value={fobUSD}
          onChange={(e) => setFobUSD(Number(e.target.value))}
          className="w-full accent-[#FF4F18] cursor-pointer h-1.5 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 rounded-lg bg-white dark:bg-[#141412] border border-[#DFDDD4] dark:border-[#242421]">
          <span className="font-mono text-[10px] text-neutral-500 block">
            {lang === 'en' ? 'Miami Freight' : 'Flete Courier'}
          </span>
          <span className="font-mono text-xs font-bold text-[#111110] dark:text-[#F4F3EF]">
            US$ {freightUSD.toFixed(2)}
          </span>
        </div>
        <div className="p-2 rounded-lg bg-white dark:bg-[#141412] border border-[#DFDDD4] dark:border-[#242421]">
          <span className="font-mono text-[10px] text-neutral-500 block">
            {lang === 'en' ? 'DGA + ITBIS' : 'Arancel + ITBIS'}
          </span>
          <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
            US$ {dutyUSD}
          </span>
        </div>
        <div className="p-2 rounded-lg bg-white dark:bg-[#141412] border border-[#DFDDD4] dark:border-[#242421]">
          <span className="font-mono text-[10px] text-neutral-500 block">
            {lang === 'en' ? 'Landed in RD$' : 'Total en RD$'}
          </span>
          <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
            RD$ {landedDOP.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
