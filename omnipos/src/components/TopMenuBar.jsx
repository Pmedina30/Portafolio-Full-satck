import React, { useState, useEffect } from 'react';
import { 
  Apple, Search, Layers, DollarSign, BarChart3, 
  ShieldCheck, Wifi, WifiOff, User, Lock, ChevronDown, 
  Clock, Package, Maximize2 
} from 'lucide-react';

export default function TopMenuBar({
  activeUser,
  users,
  onSwitchUser,
  isOffline,
  onToggleOffline,
  cashInDrawer = 0,
  onOpenSpotlight,
  onOpenInventory,
  onOpenCashManagement,
  onOpenAnalytics,
  onOpenAudit,
  offlineQueueCount = 0
}) {
  const [time, setTime] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="h-11 px-4 macos-frosted-dark border-b border-white/10 flex items-center justify-between z-40 select-none text-xs">
      
      {/* Left: macOS Apple Brand & Navigation Modules */}
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-2 pr-3 border-r border-white/10">
          <div className="w-6 h-6 rounded-lg bg-apple-blue flex items-center justify-center text-white shadow-sm font-bold text-xs">
            
          </div>
          <span className="font-bold tracking-tight text-white font-sans">
            OmniPOS <span className="text-[10px] text-apple-blue font-mono px-1 py-0.5 rounded bg-apple-blue/15 border border-apple-blue/30">PRO</span>
          </span>
        </div>

        {/* Module Action Pills */}
        <div className="flex items-center gap-1">
          <button 
            onClick={onOpenSpotlight}
            className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 flex items-center gap-1.5 transition-colors font-sans"
            title="Spotlight Search (Cmd + K)"
          >
            <Search className="w-3.5 h-3.5 text-apple-blue" />
            <span className="hidden sm:inline">Spotlight</span>
            <kbd className="hidden md:inline px-1.5 py-0.2 text-[9px] font-mono bg-white/10 rounded border border-white/15 text-slate-400">⌘K</kbd>
          </button>

          <button 
            onClick={onOpenInventory}
            className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 flex items-center gap-1.5 transition-colors font-sans"
          >
            <Package className="w-3.5 h-3.5 text-apple-orange" />
            <span>Inventario & Kardex</span>
          </button>

          <button 
            onClick={onOpenCashManagement}
            className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 flex items-center gap-1.5 transition-colors font-sans"
          >
            <DollarSign className="w-3.5 h-3.5 text-apple-green" />
            <span>Caja: <strong className="text-white font-mono">${cashInDrawer.toFixed(2)}</strong></span>
          </button>

          <button 
            onClick={onOpenAnalytics}
            className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 flex items-center gap-1.5 transition-colors font-sans"
          >
            <BarChart3 className="w-3.5 h-3.5 text-apple-purple" />
            <span className="hidden md:inline">Métricas & Reportes</span>
          </button>

          <button 
            onClick={onOpenAudit}
            className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 flex items-center gap-1.5 transition-colors font-sans"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-apple-teal" />
            <span className="hidden lg:inline">Auditoría RBAC</span>
          </button>
        </div>
      </div>

      {/* Right: Network Status, User Selector & Clock */}
      <div className="flex items-center gap-2.5">
        
        {/* Offline Queue Badge & Toggle */}
        <button
          onClick={onToggleOffline}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all border ${
            isOffline
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm animate-pulse'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}
          title={isOffline ? 'Modo Offline Activo. Clic para simular Reconexión' : 'Conexión Cloud Estable. Clic para simular Pérdida de Red'}
        >
          {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
          <span>{isOffline ? 'OFFLINE' : 'ONLINE'}</span>
          {offlineQueueCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-[9px]">
              {offlineQueueCount}
            </span>
          )}
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={handleToggleFullscreen}
          className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
          title="Pantalla Completa"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        {/* User / RBAC Selector */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-apple-blue to-apple-purple text-white flex items-center justify-center text-[10px] font-bold">
              {activeUser.avatar}
            </div>
            <span className="font-semibold text-xs text-white">{activeUser.name}</span>
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono uppercase font-bold ${
              activeUser.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
              activeUser.role === 'SUPERVISOR' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
              'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {activeUser.role}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* User Menu Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 top-9 w-60 py-2 macos-frosted rounded-2xl shadow-macos-popover border border-white/20 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 border-b border-white/10 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Cambio de Rol RBAC (Simulación)
              </div>
              {users.map(u => (
                <button
                  key={u.id}
                  onClick={() => {
                    onSwitchUser(u);
                    setIsUserMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-white/10 transition-colors ${
                    activeUser.id === u.id ? 'bg-apple-blue/15 text-white' : 'text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                      {u.avatar}
                    </div>
                    <div>
                      <div className="text-xs font-semibold">{u.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">PIN: {u.pin}</div>
                    </div>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                    u.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-300' :
                    u.role === 'SUPERVISOR' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {u.role}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live System Clock */}
        <div className="pl-2 border-l border-white/10 flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{time}</span>
        </div>
      </div>
    </header>
  );
}
