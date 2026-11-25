import React, { useState } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { KPIGrid } from './components/KPIGrid';
import { LiveMap } from './components/LiveMap';
import { DemandChart } from './components/DemandChart';
import { LiveActivityFeed } from './components/LiveActivityFeed';
import { ActiveTripsList } from './components/ActiveTripsList';
import { DriverApprovalModal } from './components/DriverApprovalModal';
import { ZonesAndRatesModal } from './components/ZonesAndRatesModal';
import { OtherTabsView } from './components/OtherTabsView';
import { Toast } from './components/Toast';
import { useLiveOperations } from './hooks/useLiveOperations';
import { CityId } from './types';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('resumen');
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState<boolean>(false);
  const [isZonesModalOpen, setIsZonesModalOpen] = useState<boolean>(false);

  const {
    currentCity,
    changeCity,
    currentCityConfig,
    kpis,
    drivers,
    activeTrips,
    events,
    applications,
    pendingApplicationsCount,
    isConnected,
    setIsConnected,
    simulationSpeed,
    setSimulationSpeed,
    focusedTripId,
    focusedCoordinates,
    focusTripOnMap,
    approveDriver,
    rejectDriver,
    triggerManualEvent,
    toastMessage,
  } = useLiveOperations();

  const handleCycleCity = () => {
    const order: CityId[] = ['santo_domingo', 'santiago', 'punta_cana'];
    const nextIdx = (order.indexOf(currentCity) + 1) % order.length;
    changeCity(order[nextIdx]);
  };

  const handleSelectTab = (tab: NavTab) => {
    setCurrentTab(tab);
    if (tab === 'conductores') {
      setIsApprovalModalOpen(true);
    } else if (tab === 'tarifas') {
      setIsZonesModalOpen(true);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] font-sans antialiased text-slate-800">
      {/* A. Fixed Left Sidebar (260px Dark Slate) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        pendingApprovalsCount={pendingApplicationsCount}
        openApprovalModal={() => setIsApprovalModalOpen(true)}
        currentCityName={currentCityConfig.name}
        onCycleCity={handleCycleCity}
      />

      {/* Main Area: Header + Scrollable Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* B. Top Header */}
        <Header
          currentCity={currentCity}
          onSelectCity={changeCity}
          isConnected={isConnected}
          onToggleConnection={() => setIsConnected(!isConnected)}
          simulationSpeed={simulationSpeed}
          onSpeedChange={setSimulationSpeed}
          onTriggerManualEvent={triggerManualEvent}
          pendingApprovalsCount={pendingApplicationsCount}
          onOpenApprovalModal={() => setIsApprovalModalOpen(true)}
          onOpenZonesModal={() => setIsZonesModalOpen(true)}
        />

        {/* Scrollable Main Content Dashboard */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* C. Fila de KPIs Principales (5 Tarjetas Superiores en RD$) */}
          <KPIGrid data={kpis} />

          {/* Conditional View: Resumen / Viajes vs Other Tabs */}
          {currentTab === 'resumen' || currentTab === 'viajes' ? (
            /* D & E. Main Split: Central (Map + Chart) and Right Column (Events + Trips) */
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
              {/* D. Área Central (Mapa en Tiempo Real + Gráfico de Demanda) - 8 cols on xl */}
              <div className="xl:col-span-8 space-y-5">
                {/* 1. Real-time Map Card */}
                <LiveMap
                  drivers={drivers}
                  activeTrips={activeTrips}
                  focusedCoordinates={focusedCoordinates}
                  focusedTripId={focusedTripId}
                  onFocusTrip={focusTripOnMap}
                  driversOnlineCount={kpis.driversOnline}
                  currentCityName={currentCityConfig.name}
                  cityCoordinates={currentCityConfig.coordinates}
                  cityZoom={currentCityConfig.zoom}
                  zones={currentCityConfig.zones}
                />

                {/* 2. Hourly Demand Chart */}
                <DemandChart
                  data={currentCityConfig.demandData}
                  cityName={currentCityConfig.name}
                />
              </div>

              {/* E. Columna Derecha (Panel de Eventos y Despacho en Vivo - 380px approx / 4 cols) */}
              <div className="xl:col-span-4 space-y-5">
                {/* Live Activity Feed Stream */}
                <LiveActivityFeed events={events} />

                {/* Compact Active Trips List with "Ver en mapa" */}
                <ActiveTripsList
                  trips={activeTrips}
                  focusedTripId={focusedTripId}
                  onFocusTrip={focusTripOnMap}
                />
              </div>
            </div>
          ) : (
            <OtherTabsView
              currentTab={currentTab}
              onOpenApprovalModal={() => setIsApprovalModalOpen(true)}
              onOpenZonesModal={() => setIsZonesModalOpen(true)}
              onShowToast={(msg) => {}}
            />
          )}
        </main>
      </div>

      {/* Driver Approval Modal (INTRANT Verification) */}
      <DriverApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        applications={applications}
        onApprove={approveDriver}
        onReject={rejectDriver}
      />

      {/* Dynamic Zones and Rates Configuration Modal */}
      <ZonesAndRatesModal
        isOpen={isZonesModalOpen}
        onClose={() => setIsZonesModalOpen(false)}
        onShowToast={() => {}}
        initialZones={currentCityConfig.zones}
        cityName={currentCityConfig.name}
      />

      {/* Floating Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
}

export default App;
