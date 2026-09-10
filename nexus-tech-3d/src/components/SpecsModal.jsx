import React from 'react';
import { X, Cpu, Check, Activity, Zap, Shield, Radio } from 'lucide-react';

export default function SpecsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const specCategories = [
    {
      category: 'Acoustic Transducer',
      items: [
        { label: 'Driver Architecture', value: '50mm Planar Magnetic Diaphragm' },
        { label: 'Diaphragm Coating', value: 'Beryllium Vapor-Deposited Matrix' },
        { label: 'Frequency Response', value: '4 Hz – 52,000 Hz' },
        { label: 'Total Harmonic Distortion (THD)', value: '< 0.002% @ 1kHz, 100dB SPL' },
        { label: 'Impedance', value: '32 Ohms (Active DSP Controlled)' }
      ]
    },
    {
      category: 'Neural Signal Processing',
      items: [
        { label: 'DSP Processor', value: 'Dual-Core Neural-16 Audio Tensor' },
        { label: 'Latency', value: '0.8ms End-to-End Processing' },
        { label: 'Active Noise Cancellation', value: 'Adaptive Neural Null (-45dB)' },
        { label: 'Microphone Array', value: '6x Beamforming MEMS Sensor Microphones' }
      ]
    },
    {
      category: 'Power & Connectivity',
      items: [
        { label: 'Battery Life', value: '48 Hours (ANC On) / 60 Hours (Standard)' },
        { label: 'Cryo-Fast Charge', value: '15 Minutes = 8 Hours Playback' },
        { label: 'Wireless Protocol', value: 'Bluetooth 5.4 LE Audio + Ultra-Wideband' },
        { label: 'Wired Connection', value: 'USB-C Lossless 96kHz/24-Bit & 4.4mm Balanced' }
      ]
    },
    {
      category: 'Chassis & Materials',
      items: [
        { label: 'Frame Material', value: 'Aeronautical Titanium-Magnesium Alloy' },
        { label: 'Ear Cushion Material', value: 'Memory Foam with Cooling Cryo-Gel' },
        { label: 'Total Weight', value: '310 grams' },
        { label: 'Water & Sweat Resistance', value: 'IP54 Certified' }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[#0b0f19] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase">
            <Cpu className="w-4 h-4" />
            <span>NEXUS-01 Technical Blueprint</span>
          </div>
          <h3 className="text-2xl font-black font-mono tracking-tight">Full System Specifications</h3>
          <p className="text-xs text-slate-400">
            Validated against International Electrotechnical Commission (IEC) acoustic measurement benchmarks.
          </p>
        </div>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          {specCategories.map((cat, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-1">
                {cat.category}
              </h4>
              <div className="space-y-2">
                {cat.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex justify-between items-center text-xs py-1 border-b border-slate-900">
                    <span className="text-slate-400 font-mono">{item.label}</span>
                    <span className="font-mono font-bold text-white text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs uppercase font-bold transition"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
}

