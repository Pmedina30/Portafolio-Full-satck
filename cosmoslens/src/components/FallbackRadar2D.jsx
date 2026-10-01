import React, { useEffect, useRef } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { soundFx } from '../utils/audioAmbiance';

export default function FallbackRadar2D({
  satellites,
  selectedObject,
  onSelectObject,
  onRetryWebGL,
  timeMultiplier = 1,
  isPaused = false
}) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let scanAngle = 0;
    let satAngles = satellites.map((_, i) => i * (Math.PI * 2 / satellites.length));

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const maxR = Math.min(width, height) * 0.42;

      // Deep space dark background with fading trail
      ctx.fillStyle = 'rgba(2, 4, 10, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // Draw Range Rings
      const rings = [0.25, 0.5, 0.75, 1.0];
      const ringLabels = ['LEO (500km)', 'MEO (2,000km)', 'HEO (20,000km)', 'GEO (36,000km)'];

      rings.forEach((rFactor, idx) => {
        const r = maxR * rFactor;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = 'rgba(100, 116, 139, 0.8)';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText(ringLabels[idx], cx + 6, cy - r + 12);
      });

      // Crosshairs
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy - maxR);
      ctx.lineTo(cx, cy + maxR);
      ctx.moveTo(cx - maxR, cy);
      ctx.lineTo(cx + maxR, cy);
      ctx.stroke();

      // Sweeping Radar Beam
      if (!isPaused) {
        scanAngle += 0.025 * (timeMultiplier || 1);
      }
      const sweepGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      sweepGradient.addColorStop(0, 'rgba(0, 229, 255, 0.25)');
      sweepGradient.addColorStop(1, 'rgba(0, 229, 255, 0.0)');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxR, scanAngle - 0.35, scanAngle, false);
      ctx.closePath();
      ctx.fillStyle = sweepGradient;
      ctx.fill();

      // Sweeping leading line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(scanAngle) * maxR, cy + Math.sin(scanAngle) * maxR);
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Central Earth Globe Disc
      ctx.beginPath();
      ctx.arc(cx, cy, maxR * 0.16, 0, Math.PI * 2);
      const earthGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.16);
      earthGrad.addColorStop(0, '#0284c7');
      earthGrad.addColorStop(0.7, '#0369a1');
      earthGrad.addColorStop(1, '#075985');
      ctx.fillStyle = earthGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Satellites on Radar
      satellites.forEach((sat, i) => {
        if (!isPaused) {
          satAngles[i] += sat.speed3D * 0.008 * (timeMultiplier || 1);
        }
        const ang = satAngles[i];
        const rDist = maxR * (0.28 + (i * 0.11));
        const sx = cx + Math.cos(ang) * rDist;
        const sy = cy + Math.sin(ang) * rDist;

        // Satellite Marker
        const isSelected = selectedObject?.id === sat.id;

        ctx.beginPath();
        ctx.arc(sx, sy, isSelected ? 7 : 4.5, 0, Math.PI * 2);
        ctx.fillStyle = sat.beaconColor || '#00E5FF';
        ctx.fill();

        // Pulsing selection ring
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(sx, sy, 12, 0, Math.PI * 2);
          ctx.strokeStyle = '#00E5FF';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Label
        ctx.fillStyle = isSelected ? '#00E5FF' : '#ffffff';
        ctx.font = `${isSelected ? 'bold' : 'normal'} 10px "Space Grotesk", sans-serif`;
        ctx.fillText(sat.name.split(' ')[0], sx + 9, sy + 3);
      });
    };

    render();

    // Canvas click to select satellite
    const handleCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const maxR = Math.min(canvas.width, canvas.height) * 0.42;

      satellites.forEach((sat, i) => {
        const ang = satAngles[i];
        const rDist = maxR * (0.28 + (i * 0.11));
        const sx = cx + Math.cos(ang) * rDist;
        const sy = cy + Math.sin(ang) * rDist;
        const dist = Math.hypot(clickX - sx, clickY - sy);

        if (dist < 18) {
          soundFx.playGlassPing(1.2);
          onSelectObject(sat);
        }
      });
    };

    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [satellites, selectedObject, timeMultiplier, isPaused]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-space-950">
      <canvas ref={canvasRef} className="w-full h-full" />

      {/* 2D Fallback Banner */}
      <div className="absolute top-20 left-6 z-10 flex items-center gap-3 px-4 py-2 rounded-2xl vision-glass-panel border border-amber-500/30">
        <AlertCircle className="w-4 h-4 text-amber-400" />
        <div>
          <div className="text-xs font-semibold text-white">2D Orbital Radar Mode (GPU Fallback Active)</div>
          <div className="text-[10px] font-mono text-slate-400">Rendering 2D Tactical Planar Projection</div>
        </div>
        {onRetryWebGL && (
          <button
            onClick={onRetryWebGL}
            className="ml-2 px-3 py-1 rounded-xl text-xs font-mono bg-white/10 hover:bg-white/20 text-vision-cyan border border-vision-cyan/30 flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3 h-3" />
            Retry 3D
          </button>
        )}
      </div>
    </div>
  );
}
