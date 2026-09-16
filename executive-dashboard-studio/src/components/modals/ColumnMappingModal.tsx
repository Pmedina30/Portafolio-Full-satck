import React, { useState, useEffect } from 'react';
import { ColumnMappingConfig, DetectedColumnInfo, RawDataRow } from '../../types/dashboard';
import { X, CheckCircle2, Sparkles, Database, ArrowRight, Settings2, Sliders } from 'lucide-react';

interface ColumnMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  detectedColumns: DetectedColumnInfo[];
  rawRows: RawDataRow[];
  currentMapping: ColumnMappingConfig;
  onApplyMapping: (mapping: ColumnMappingConfig) => void;
  fileName?: string;
}

export const ColumnMappingModal: React.FC<ColumnMappingModalProps> = ({
  isOpen,
  onClose,
  detectedColumns,
  rawRows,
  currentMapping,
  onApplyMapping,
  fileName = 'archivo_operacional.csv'
}) => {
  const [mapping, setMapping] = useState<ColumnMappingConfig>(currentMapping);

  useEffect(() => {
    setMapping(currentMapping);
  }, [currentMapping]);

  if (!isOpen) return null;

  const safeColumns = Array.isArray(detectedColumns) ? detectedColumns : [];
  const columnNames = safeColumns.map(c => c.columnName);
  const previewRows = Array.isArray(rawRows) ? rawRows.slice(0, 4) : [];

  const handleSelect = (field: keyof ColumnMappingConfig, value: any) => {
    setMapping(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAutoMap = () => {
    const updated = { ...mapping };
    safeColumns.forEach(col => {
      if (col.suggestedRole === 'date' && !updated.dateCol) updated.dateCol = col.columnName;
      if (col.suggestedRole === 'status' && !updated.statusCol) updated.statusCol = col.columnName;
      if (col.suggestedRole === 'metric' && !updated.delayMinutesCol) updated.delayMinutesCol = col.columnName;
      if (col.suggestedRole === 'cause' && !updated.causeCol) updated.causeCol = col.columnName;
      if (col.suggestedRole === 'region' && !updated.regionCol) updated.regionCol = col.columnName;
      if (col.suggestedRole === 'route' && !updated.routeCol) updated.routeCol = col.columnName;
      if (col.suggestedRole === 'resource' && !updated.resourceCol) updated.resourceCol = col.columnName;
    });
    setMapping(updated);
  };

  const fieldDefinitions: { key: keyof ColumnMappingConfig; label: string; desc: string; required?: boolean }[] = [
    { key: 'dateCol', label: 'Fecha / Marca de Tiempo', desc: 'Identifica la fecha del vuelo u operación (ej. FlightDate, Fecha)', required: true },
    { key: 'statusCol', label: 'Estado Operacional', desc: 'Columna con valores como On-Time, Delayed, Cancelled', required: true },
    { key: 'delayMinutesCol', label: 'Métrica de Demora (Minutos)', desc: 'Valor numérico de minutos de desvío (ej. DelayMinutes)', required: true },
    { key: 'causeCol', label: 'Causa Raíz / Motivo de Demora', desc: 'Clasificación de la demora (ej. ATC, Clima, Mantenimiento)' },
    { key: 'regionCol', label: 'Región / Mercado', desc: 'Agrupación geográfica o división de negocio (ej. Sudamérica)' },
    { key: 'routeCol', label: 'Ruta / Sector Operacional', desc: 'Par origen-destino o código de segmento (ej. SDQ-MIA)' },
    { key: 'resourceCol', label: 'Recurso / Matrícula Flota', desc: 'Aeronave asignada o identificador de activo (ej. HI-1026)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Mapeo Inteligente de Columnas (DAX Schema)</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500 text-white">
                  Smart Detector v2.4
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Archivo detectado: <span className="font-mono text-cyan-300 font-semibold">{fileName}</span> ({rawRows.length.toLocaleString()} registros)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action / Help Banner */}
        <div className="bg-indigo-50/60 border-b border-indigo-100 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-indigo-900">
            <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span>El motor heurístico analizó los encabezados y tipos de datos para pre-configurar las medidas analíticas.</span>
          </div>
          <button
            type="button"
            onClick={handleAutoMap}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
          >
            Re-detectar automático
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Data Preview Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Vista previa de datos cargados (Primeras filas)
              </h4>
              <span className="text-[11px] text-slate-400">Total columnas detectadas: {columnNames.length}</span>
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-36">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold sticky top-0">
                  <tr>
                    {columnNames.map(col => (
                      <th key={col} className="px-3 py-2 whitespace-nowrap font-mono">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {previewRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      {columnNames.map(col => (
                        <td key={col} className="px-3 py-1.5 whitespace-nowrap text-[11px] font-mono">
                          {String(row[col] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mapping Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-slate-500" />
              Asignación de Campos para Medidas C-Suite
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fieldDefinitions.map(f => {
                const currentValue = (mapping as any)[f.key] || '';
                return (
                  <div key={f.key} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-900">
                          {f.label} {f.required && <span className="text-rose-500">*</span>}
                        </label>
                        {currentValue && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3" /> Mapeado
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mb-2 leading-snug">{f.desc}</p>
                    </div>

                    <select
                      value={currentValue}
                      onChange={(e) => handleSelect(f.key, e.target.value)}
                      className="w-full text-xs font-mono font-medium bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">-- Seleccionar Columna --</option>
                      {columnNames.map(col => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Threshold setting */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-700">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900">Umbral Estándar de Puntualidad (OTP D-Rule)</h5>
                <p className="text-[11px] text-slate-500">
                  Tolerancia en minutos permitida para considerar la operación como puntual (Estándar OAG/IATA: D15 = ≤ 15 min)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {[0, 5, 15, 30].map(threshold => (
                <button
                  key={threshold}
                  type="button"
                  onClick={() => handleSelect('otpThreshold', threshold)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                    mapping.otpThreshold === threshold
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  D{threshold} ({threshold}m)
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancelar
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                onApplyMapping(mapping);
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <span>Aplicar y Calcular Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

