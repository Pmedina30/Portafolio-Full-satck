import React, { useState, useMemo, useRef } from 'react';
import { 
  RawDataRow, 
  ColumnMappingConfig, 
  BrandingTheme, 
  ActiveNavTab, 
  DetectedColumnInfo 
} from './types/dashboard';
import { generateDefaultAviationData, DEFAULT_COLUMN_MAPPING } from './data/defaultAviationData';
import { parseDataFile, detectColumnRoles } from './services/dataParser';
import { computeExecutiveAnalytics } from './services/daxEngine';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { KpiRow } from './components/KpiRow';
import { PunctualityTrendChart } from './components/charts/PunctualityTrendChart';
import { DelayCausesBarChart } from './components/charts/DelayCausesBarChart';
import { RegionalDonutChart } from './components/charts/RegionalDonutChart';
import { OperationalTables } from './components/OperationalTables';
import { ColumnMappingModal } from './components/modals/ColumnMappingModal';
import { BrandModal } from './components/modals/BrandModal';

export const App: React.FC = () => {
  // Pre-loaded dataset (Arajet IOCC Operations)
  const [rawData, setRawData] = useState<RawDataRow[]>(() => generateDefaultAviationData());
  const [columnMapping, setColumnMapping] = useState<ColumnMappingConfig>(DEFAULT_COLUMN_MAPPING);
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [fileName, setFileName] = useState('Arajet_IOCC_Ops_Sept2026.csv');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic Branding Theme
  const [theme, setTheme] = useState<BrandingTheme>({
    companyName: 'Arajet Airlines',
    logoUrl: '',
    primaryColor: '#0B1340',
    accentColor: '#6B21A8',
    highlightColor: '#00C3DE',
    dashboardTitle: 'DASHBOARD OPERATIVO EJECUTIVO',
    dashboardSubtitle: 'Centro de Control de Operaciones (IOCC) · Puntualidad & Desvíos',
    periodLabel: '1 - 15 Septiembre 2026'
  });

  // Modal States
  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [detectedColumns, setDetectedColumns] = useState<DetectedColumnInfo[]>(() => {
    const sample = generateDefaultAviationData();
    const cols = Object.keys(sample[0] || {});
    return detectColumnRoles(cols, sample).detectedColumns;
  });

  // Filter raw data by search query if any
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return rawData;
    const query = searchQuery.toLowerCase();
    return rawData.filter(row => {
      return Object.values(row).some(val => 
        String(val ?? '').toLowerCase().includes(query)
      );
    });
  }, [rawData, searchQuery]);

  // DAX Metric Calculations (Instant client-side aggregation)
  const analytics = useMemo(() => {
    return computeExecutiveAnalytics(filteredData, columnMapping);
  }, [filteredData, columnMapping]);

  const {
    kpis,
    timeSeries: timeSeriesData,
    paretoCauses,
    regionalDistribution: regionalShare,
    topRoutes: routeMetrics,
    fleetStatus
  } = analytics;

  // File Upload Ingestion
  const handleFileUpload = async (file: File) => {
    try {
      const result = await parseDataFile(file);
      setRawData(result.rows);
      setFileName(file.name);

      const { suggestedMapping, detectedColumns: detected } = detectColumnRoles(result.columns, result.rows);
      setDetectedColumns(detected);
      setColumnMapping(suggestedMapping);
      setIsMappingModalOpen(true);
    } catch (err: any) {
      alert(`Error al procesar archivo: ${err.message || err}`);
    }
  };

  const handleOpenFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleResetDemoData = () => {
    setRawData(generateDefaultAviationData());
    setFileName('Arajet_IOCC_Ops_Sept2026.csv');
    setColumnMapping(DEFAULT_COLUMN_MAPPING);
  };

  // Change OTP threshold
  const handleThresholdChange = (threshold: number) => {
    setColumnMapping(prev => ({
      ...prev,
      otpThreshold: threshold
    }));
  };

  const handleExportReport = () => {
    window.print();
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] font-sans text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".csv,.xlsx,.xls,.txt"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
          e.target.value = '';
        }}
        className="hidden"
      />

      {/* 1. Left Sidebar (Arajet Corporate Navy #0B1340) */}
      <div className="no-print h-full flex-shrink-0">
        <Sidebar
          brand={theme}
          theme={theme}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          rowCount={kpis.totalVolume}
          totalOperationsCount={kpis.totalVolume}
          onOpenBrandModal={() => setIsBrandModalOpen(true)}
          onOpenFileUpload={handleOpenFileUpload}
        />
      </div>

      {/* 2. Main Executive Canvas (Widescreen 16:9 1080p container) */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar">
        {/* Top Executive Header */}
        <div className="sticky top-0 z-30 bg-[#F8FAFC]/90 backdrop-blur-md px-6 py-4 border-b border-slate-200/80">
          <Header
            brand={theme}
            theme={theme}
            setBrand={setTheme}
            onUpdateTheme={setTheme}
            kpis={kpis}
            threshold={columnMapping.otpThreshold}
            activeThreshold={columnMapping.otpThreshold}
            setThreshold={handleThresholdChange}
            onChangeThreshold={handleThresholdChange}
            onOpenMappingModal={() => setIsMappingModalOpen(true)}
            onOpenBrandModal={() => setIsBrandModalOpen(true)}
            onOpenFileUpload={handleOpenFileUpload}
            onResetDemoData={handleResetDemoData}
            onExportPdf={handleExportReport}
            onExportReport={handleExportReport}
          />
        </div>

        {/* Executive Canvas Content */}
        <div className="p-6 space-y-6 max-w-[1920px] mx-auto w-full">
          {/* Active Filter Notification */}
          {searchQuery && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-xs text-amber-800 flex items-center justify-between">
              <span>Filtro activo por búsqueda: "<strong>{searchQuery}</strong>" ({filteredData.length} registros)</span>
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                className="font-bold underline hover:text-amber-950 ml-2"
              >
                Limpiar filtro
              </button>
            </div>
          )}

          {/* Row 1: Executive 5 KPI Cards */}
          <section aria-label="Executive KPIs">
            <KpiRow kpis={kpis} brand={theme} theme={theme} />
          </section>

          {/* Tab Views Logic */}
          {(activeTab === 'overview' || activeTab === 'reports') && (
            <>
              {/* Row 2: 3 Visual Charts (Trend, Pareto, Region Donut) */}
              <section aria-label="Visual Analytics" className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                <div className="lg:col-span-5 h-[360px]">
                  <PunctualityTrendChart
                    data={timeSeriesData}
                    brand={theme}
                    theme={theme}
                    threshold={columnMapping.otpThreshold}
                  />
                </div>
                <div className="lg:col-span-4 h-[360px]">
                  <DelayCausesBarChart
                    data={paretoCauses}
                    brand={theme}
                    theme={theme}
                  />
                </div>
                <div className="lg:col-span-3 h-[360px]">
                  <RegionalDonutChart
                    data={regionalShare}
                    totalVolume={kpis.totalVolume}
                    brand={theme}
                    theme={theme}
                  />
                </div>
              </section>

              {/* Row 3: Operational Tables (Critical Routes + Fleet Status) */}
              <section aria-label="Operational Tables">
                <OperationalTables
                  routes={routeMetrics}
                  fleet={fleetStatus}
                  brand={theme}
                  theme={theme}
                />
              </section>
            </>
          )}

          {activeTab === 'otp' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="h-[420px]">
                <PunctualityTrendChart
                  data={timeSeriesData}
                  brand={theme}
                  theme={theme}
                  threshold={columnMapping.otpThreshold}
                  title="Análisis Detallado de Tendencia OTP (D-Rule)"
                  subtitle="Comportamiento diario vs Benchmark Corporativo 85%"
                />
              </div>
              <OperationalTables
                routes={routeMetrics}
                fleet={fleetStatus}
                brand={theme}
                theme={theme}
              />
            </div>
          )}

          {activeTab === 'delays' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-[440px]">
                  <DelayCausesBarChart
                    data={paretoCauses}
                    brand={theme}
                    theme={theme}
                    title="Análisis Causa Raíz de Demoras (Pareto 80/20)"
                    subtitle="Distribución ponderada por minutos acumulados de desvío"
                  />
                </div>
                <div className="h-[440px]">
                  <RegionalDonutChart
                    data={regionalShare}
                    totalVolume={kpis.totalVolume}
                    brand={theme}
                    theme={theme}
                  />
                </div>
              </div>
              <OperationalTables
                routes={routeMetrics}
                fleet={fleetStatus}
                brand={theme}
                theme={theme}
              />
            </div>
          )}

          {activeTab === 'operations' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <OperationalTables
                routes={routeMetrics}
                fleet={fleetStatus}
                brand={theme}
                theme={theme}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-[360px]">
                  <PunctualityTrendChart
                    data={timeSeriesData}
                    brand={theme}
                    theme={theme}
                    threshold={columnMapping.otpThreshold}
                  />
                </div>
                <div className="h-[360px]">
                  <DelayCausesBarChart
                    data={paretoCauses}
                    brand={theme}
                    theme={theme}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'routes' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <OperationalTables
                routes={routeMetrics}
                fleet={fleetStatus}
                brand={theme}
                theme={theme}
              />
              <div className="h-[360px]">
                <RegionalDonutChart
                  data={regionalShare}
                  totalVolume={kpis.totalVolume}
                  brand={theme}
                  theme={theme}
                />
              </div>
            </div>
          )}

          {activeTab === 'fleet' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <OperationalTables
                routes={routeMetrics}
                fleet={fleetStatus}
                brand={theme}
                theme={theme}
              />
            </div>
          )}

          {/* Footer Info / Disclaimer */}
          <footer className="pt-6 border-t border-slate-200 text-slate-400 text-xs flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>
              Executive Dashboard Studio · Diseñado según el Estándar de Aviación Comercial Arajet IOCC
            </p>
            <p className="font-mono text-[11px]">
              Motor DAX v3.2 · Latencia de cálculo: &lt;12ms · 100% Client-Side Safe
            </p>
          </footer>
        </div>
      </main>

      {/* Modals */}
      <ColumnMappingModal
        isOpen={isMappingModalOpen}
        onClose={() => setIsMappingModalOpen(false)}
        detectedColumns={detectedColumns}
        rawRows={rawData}
        currentMapping={columnMapping}
        onApplyMapping={setColumnMapping}
        fileName={fileName}
      />

      <BrandModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        currentTheme={theme}
        onSaveTheme={setTheme}
      />
    </div>
  );
};

export default App;
