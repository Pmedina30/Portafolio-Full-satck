import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Navigation,
  Sliders,
  AlertCircle,
  Settings,
  ChevronDown,
  ShieldCheck,
  Radio,
} from 'lucide-react';

export type NavTab =
  | 'resumen'
  | 'conductores'
  | 'pasajeros'
  | 'viajes'
  | 'tarifas'
  | 'reclamaciones'
  | 'configuracion';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingApprovalsCount: number;
  openApprovalModal: () => void;
  currentCityName: string;
  onCycleCity?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingApprovalsCount,
  openApprovalModal,
  currentCityName,
  onCycleCity,
}) => {
  const menuItems = [
    {
      id: 'resumen' as NavTab,
      label: 'Resumen',
      icon: LayoutDashboard,
      badge: 'En vivo',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    },
    {
      id: 'conductores' as NavTab,
      label: 'Conductores',
      icon: Users,
      badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} pend.` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold',
    },
    {
      id: 'pasajeros' as NavTab,
      label: 'Pasajeros',
      icon: UserCheck,
    },
    {
      id: 'viajes' as NavTab,
      label: 'Viajes en vivo',
      icon: Navigation,
      badge: '4 activos',
      badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    },
    {
      id: 'tarifas' as NavTab,
      label: 'Tarifas y zonas',
      icon: Sliders,
    },
    {
      id: 'reclamaciones' as NavTab,
      label: 'Reclamaciones',
      icon: AlertCircle,
      badge: '2',
      badgeColor: 'bg-slate-700 text-slate-300',
    },
    {
      id: 'configuracion' as NavTab,
      label: 'Configuración',
      icon: Settings,
    },
  ];

  return (
    <aside
      id="sidebar-navigation"
      className="w-[260px] min-w-[260px] h-screen bg-[#0F172A] border-r border-slate-800 flex flex-col justify-between text-slate-300 select-none z-30"
    >
      {/* Top Branding & Context Selector */}
      <div className="p-5 pb-2">
        {/* Logo "taxi." */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => onSelectTab('resumen')}>
            <span className="text-3xl font-black tracking-tight text-white font-sans lowercase">
              taxi<span className="text-emerald-500 inline-block text-3xl font-black">.</span>
            </span>
            <span className="ml-2 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Ops
            </span>
          </div>

          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" title="Sistema operacional" />
        </div>

        {/* Context Selector: Operaciones · Santo Domingo / Santiago / Punta Cana */}
        <div
          onClick={onCycleCity}
          className="bg-slate-800/70 hover:bg-slate-800 transition-colors border border-slate-700/60 rounded-xl p-2.5 flex items-center justify-between cursor-pointer group shadow-sm"
          title="Haga clic para cambiar de región operacional"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <span className="text-xs">🇩🇴</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold truncate leading-none mb-1">
                Operaciones
              </p>
              <p className="text-xs font-bold text-white truncate leading-none">
                {currentCityName}
              </p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors shrink-0" />
        </div>
      </div>

      {/* Main Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-2">
          Monitoreo & Gestión
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full leading-normal ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Quick Driver Verification Banner in Menu */}
        {pendingApprovalsCount > 0 && (
          <div className="pt-4 px-1">
            <div
              onClick={openApprovalModal}
              className="bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-xl p-3 cursor-pointer hover:border-emerald-500/60 transition-all group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verificación
                </span>
                <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-md">
                  {pendingApprovalsCount}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 group-hover:text-slate-300 leading-snug">
                Nuevas solicitudes de conductores listas para revisión de INTRANT.
              </p>
            </div>
          </div>
        )}
      </nav>

      {/* Footer del Sidebar: Status "Operaciones (3) En línea" */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </div>
            <span className="text-xs font-semibold text-slate-200">
              Operaciones (3) En línea
            </span>
          </div>

          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        </div>

        {/* User Card */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
            PM
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-medium text-white truncate leading-tight">
              Pablo Medina
            </p>
            <p className="text-[10px] text-slate-300 truncate">
              Despachador Maestro
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
