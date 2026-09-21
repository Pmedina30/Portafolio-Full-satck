'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Users, Clock, Calendar, ChevronDown, Check, Sparkles } from 'lucide-react';
import { TeamFilter, ShiftFilter, DateRangePreset } from '../types/pulseops';

interface InteractiveViewFiltersProps {
  selectedTeam: TeamFilter;
  onSelectTeam: (team: TeamFilter) => void;
  selectedShift: ShiftFilter;
  onSelectShift: (shift: ShiftFilter) => void;
  selectedRange: DateRangePreset;
  onSelectRange: (range: DateRangePreset) => void;
}

export const InteractiveViewFilters: React.FC<InteractiveViewFiltersProps> = ({
  selectedTeam,
  onSelectTeam,
  selectedShift,
  onSelectShift,
  selectedRange,
  onSelectRange,
}) => {
  const [openDropdown, setOpenDropdown] = useState<'team' | 'shift' | 'range' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const teamOptions: { label: string; value: TeamFilter }[] = [
    { label: 'All Teams (Global)', value: 'ALL' },
    { label: 'Platform SRE Core', value: 'SRE-CORE' },
    { label: 'Customer Support L2', value: 'L2-OPS' },
    { label: 'Billing & IOCC Ops', value: 'BILLING-IOCC' },
  ];

  const shiftOptions: { label: string; value: ShiftFilter }[] = [
    { label: 'All Shifts (24h)', value: 'ALL' },
    { label: 'Morning (06:00 - 14:00)', value: 'MORNING' },
    { label: 'Evening (14:00 - 22:00)', value: 'EVENING' },
    { label: 'Night (22:00 - 06:00)', value: 'NIGHT' },
  ];

  const rangeOptions: { label: string; value: DateRangePreset }[] = [
    { label: 'Live Stream (Real-Time)', value: 'LIVE' },
    { label: 'Last 6 Hours', value: '6H' },
    { label: 'Today (Shift Window)', value: 'TODAY' },
    { label: 'Last 7 Days', value: '7D' },
    { label: 'Last 30 Days', value: '30D' },
  ];

  const currentTeamLabel = teamOptions.find((t) => t.value === selectedTeam)?.label || 'Team';
  const currentShiftLabel = shiftOptions.find((s) => s.value === selectedShift)?.label || 'Shift';
  const currentRangeLabel = rangeOptions.find((r) => r.value === selectedRange)?.label || 'Range';

  return (
    <div
      ref={containerRef}
      className="flex flex-wrap items-center gap-2.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-2 backdrop-blur-md"
    >
      {/* 1. Team Selector Popover */}
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === 'team' ? null : 'team')}
          className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-100"
        >
          <Users className="w-3.5 h-3.5 text-zinc-400" />
          <span className="truncate max-w-[130px]">{currentTeamLabel}</span>
          <ChevronDown className="w-3 h-3 text-zinc-500" />
        </button>

        {openDropdown === 'team' && (
          <div className="absolute left-0 top-full z-50 mt-1.5 w-56 rounded-lg border border-zinc-800 bg-zinc-950 p-1 shadow-xl shadow-black/60">
            {teamOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onSelectTeam(opt.value);
                  setOpenDropdown(null);
                }}
                className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                <span>{opt.label}</span>
                {selectedTeam === opt.value && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Shift Selector Popover */}
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === 'shift' ? null : 'shift')}
          className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-100"
        >
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <span className="truncate max-w-[140px]">{currentShiftLabel}</span>
          <ChevronDown className="w-3 h-3 text-zinc-500" />
        </button>

        {openDropdown === 'shift' && (
          <div className="absolute left-0 top-full z-50 mt-1.5 w-60 rounded-lg border border-zinc-800 bg-zinc-950 p-1 shadow-xl shadow-black/60">
            {shiftOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onSelectShift(opt.value);
                  setOpenDropdown(null);
                }}
                className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                <span>{opt.label}</span>
                {selectedShift === opt.value && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Date Range Popover */}
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === 'range' ? null : 'range')}
          className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-100"
        >
          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
          <span className="truncate">{currentRangeLabel}</span>
          <ChevronDown className="w-3 h-3 text-zinc-500" />
        </button>

        {openDropdown === 'range' && (
          <div className="absolute right-0 sm:left-0 top-full z-50 mt-1.5 w-56 rounded-lg border border-zinc-800 bg-zinc-950 p-1 shadow-xl shadow-black/60">
            {rangeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onSelectRange(opt.value);
                  setOpenDropdown(null);
                }}
                className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                <div className="flex items-center gap-2">
                  {opt.value === 'LIVE' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  )}
                  <span>{opt.label}</span>
                </div>
                {selectedRange === opt.value && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
