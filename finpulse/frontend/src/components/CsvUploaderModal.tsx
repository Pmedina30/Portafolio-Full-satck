import React, { useState } from 'react';
import { Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Transaction, TransactionCategory } from '../types/finpulse';

interface CsvUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportTransactions: (imported: Transaction[]) => void;
}

export const CsvUploaderModal: React.FC<CsvUploaderModalProps> = ({
  isOpen,
  onClose,
  onImportTransactions,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedPreview, setParsedPreview] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    processCsvFile(selected);
  };

  const processCsvFile = (csvFile: File) => {
    setFile(csvFile);
    setError(null);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        if (!text) {
          throw new Error('El archivo CSV está vacío');
        }

        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
        if (lines.length < 2) {
          throw new Error('El archivo debe contener encabezados y al menos una fila de datos');
        }

        const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

        const txList: Transaction[] = [];

        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
          if (row.length < 5) continue;

          // Parse columns with fallbacks
          const date = row[0] || new Date().toISOString().split('T')[0];
          const time = row[1] || '12:00 PM';
          const merchant = row[2] || 'Comercio Corporativo';
          const category = (row[3] as TransactionCategory) || 'Software & SaaS';
          const amount = parseFloat(row[4].replace(/[^0-9.-]+/g, '')) || 100.0;
          const employeeName = row[5] || 'Colaborador';
          const accountNumber = row[6] || 'CORP-9900-1122';
          const notes = row[7] || 'Carga manual vía CSV';

          // Detect off-hours (e.g. 11:00 PM - 05:00 AM)
          const hourMatch = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
          let isOffHours = false;
          if (hourMatch) {
            let h = parseInt(hourMatch[1], 10);
            const isPM = hourMatch[3].toUpperCase() === 'PM';
            if (isPM && h !== 12) h += 12;
            if (!isPM && h === 12) h = 0;
            if (h >= 22 || h < 6) isOffHours = true;
          }

          txList.push({
            id: `TX-CSV-${1000 + i}`,
            date,
            time,
            merchant,
            category,
            amount,
            accountNumber,
            employeeName,
            employeeDepartment: 'Auditoría Externa',
            status: 'pending',
            notes,
            isOffHours,
          });
        }

        if (txList.length === 0) {
          throw new Error('No se encontraron transacciones válidas en el archivo');
        }

        setParsedPreview(txList);
        setIsProcessing(false);
      } catch (err: any) {
        setError(err.message || 'Error al procesar el archivo CSV');
        setIsProcessing(false);
      }
    };

    reader.readAsText(csvFile);
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      'Date,Time,Merchant,Category,Amount,Employee,Account,Notes\n' +
      '2026-09-22,02:15 AM,Offshore Cloud Data Ltd,Software & SaaS,34500.00,Arthur Dent,CORP-9988-1122,Inyección de anomalía intencional\n' +
      '2026-09-22,11:30 AM,Best Buy Enterprise,Office & Hardware,450.00,Jane Doe,CORP-4455-8899,Compra regular monitores\n' +
      '2026-09-22,01:15 PM,Sweetgreen Catering,Meals & Entertainment,180.00,John Smith,CORP-3322-1144,Almuerzo de trabajo equipo\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'finpulse_plantilla_auditoria.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleApply = () => {
    if (parsedPreview.length > 0) {
      onImportTransactions(parsedPreview);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0c101a] border border-[#1f293d] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#1c2438] bg-[#090d16] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Importar Transacciones Corporativas (CSV)
              </h3>
              <p className="text-xs text-slate-400">
                Sube tu archivo de gastos para cálculo dinámico e instantáneo de Z-Score.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Dropzone */}
          <div className="relative rounded-xl border-2 border-dashed border-[#26354f] hover:border-cyan-500/50 bg-[#111726]/60 p-6 text-center transition-colors">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-xs font-semibold text-slate-200">
              Arrastra y suelta tu archivo CSV o <span className="text-cyan-400 underline">haz clic aquí</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Formato admitido: .csv (encabezados: Date, Time, Merchant, Category, Amount, Employee, Account)
            </div>
          </div>

          {/* Download Template helper */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#111726] border border-[#1f293d] text-xs">
            <span className="text-slate-300">¿No tienes el formato exacto preparado?</span>
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#182338] hover:bg-[#202f4a] text-cyan-300 font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar Plantilla CSV</span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Parsed Preview */}
          {parsedPreview.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {parsedPreview.length} transacciones procesadas correctamente
                </span>
                <span className="text-slate-400 text-[11px]">Listo para anexar a la muestra</span>
              </div>
              <div className="max-h-40 overflow-y-auto rounded-lg border border-[#1f293d] bg-[#0b0f19]">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-[#121827] text-slate-400 uppercase font-mono">
                    <tr>
                      <th className="p-2">Fecha</th>
                      <th className="p-2">Comercio</th>
                      <th className="p-2">Categoría</th>
                      <th className="p-2 text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                    {parsedPreview.slice(0, 5).map((t, idx) => (
                      <tr key={idx}>
                        <td className="p-2">{t.date}</td>
                        <td className="p-2 font-sans text-slate-200">{t.merchant}</td>
                        <td className="p-2 font-sans">{t.category}</td>
                        <td className="p-2 text-right text-emerald-400">${t.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedPreview.length > 5 && (
                <div className="text-[11px] text-slate-500 text-center">
                  + {parsedPreview.length - 5} transacciones adicionales en el archivo
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1c2438] bg-[#090d16] flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#162033] hover:bg-[#1e2c45] border border-[#23334f] text-slate-300 text-xs font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleApply}
            disabled={parsedPreview.length === 0}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-lg shadow-cyan-950/40"
          >
            Importar e Iniciar Auditoría ({parsedPreview.length})
          </button>
        </div>
      </div>
    </div>
  );
};
