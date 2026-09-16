import { RawDataRow, ColumnMappingConfig, DetectedColumnInfo, ColumnRole } from '../types/dashboard';

declare global {
  interface Window {
    Papa?: any;
    XLSX?: any;
  }
}

/**
 * Universal Data Parser for CSV and Excel files.
 * Provides resilient fallback: uses window.Papa / window.XLSX if available,
 * and includes a native RFC-4180 CSV parser for 100% offline reliability.
 */
export async function parseDataFile(file: File): Promise<{
  rows: RawDataRow[];
  columns: string[];
  suggestedMapping: ColumnMappingConfig;
  detectedColumns: DetectedColumnInfo[];
}> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  let rows: RawDataRow[] = [];

  if (extension === 'csv' || extension === 'txt') {
    rows = await parseCsv(file);
  } else if (extension === 'xlsx' || extension === 'xls') {
    rows = await parseExcel(file);
  } else {
    throw new Error('Formato no soportado. Por favor sube un archivo .csv o .xlsx / .xls');
  }

  if (!rows || rows.length === 0) {
    throw new Error('El archivo procesado no contiene registros de datos.');
  }

  const columns = Object.keys(rows[0] || {});
  const { suggestedMapping, detectedColumns } = detectColumnRoles(columns, rows);

  return {
    rows,
    columns,
    suggestedMapping,
    detectedColumns
  };
}

// Alias for backwards compatibility
export const parseFile = parseDataFile;

/**
 * Parses CSV using window.Papa if present, or native RFC-4180 fallback
 */
async function parseCsv(file: File): Promise<RawDataRow[]> {
  const text = await file.text();

  // Try window.Papa if loaded
  if (typeof window !== 'undefined' && window.Papa) {
    return new Promise((resolve, reject) => {
      window.Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results: any) => resolve(results.data),
        error: (err: any) => reject(new Error(err.message))
      });
    });
  }

  // Pure Native RFC-4180 CSV parser fallback
  return parseCsvNative(text);
}

/**
 * Pure TypeScript RFC-4180 compliant CSV parser with automatic delimiter detection
 */
function parseCsvNative(text: string): RawDataRow[] {
  const cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = cleanText.split('\n').filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  // Delimiter detection: comma, semicolon, tab
  const firstLine = lines[0];
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;

  let delimiter = ',';
  if (semiCount > commaCount && semiCount > tabCount) delimiter = ';';
  if (tabCount > commaCount && tabCount > semiCount) delimiter = '\t';

  // Parse header
  const headers = splitCsvLine(lines[0], delimiter).map(h => h.trim().replace(/^["']|["']$/g, ''));
  const rows: RawDataRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawCells = splitCsvLine(lines[i], delimiter);
    if (rawCells.length === 0) continue;

    const row: RawDataRow = {};
    headers.forEach((header, colIdx) => {
      let val: any = rawCells[colIdx] !== undefined ? rawCells[colIdx].trim() : '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1).replace(/""/g, '"');
      }

      // Dynamic typing: number or string
      if (val !== '' && !isNaN(Number(val))) {
        row[header] = Number(val);
      } else {
        row[header] = val;
      }
    });

    rows.push(row);
  }

  return rows;
}

function splitCsvLine(line: string, delimiter: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      current += char;
    } else if (char === delimiter && !inQuotes) {
      cells.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells;
}

/**
 * Parses XLSX / XLS using window.XLSX
 */
async function parseExcel(file: File): Promise<RawDataRow[]> {
  if (typeof window === 'undefined' || !window.XLSX) {
    throw new Error('La librería SheetJS (XLSX) no se ha cargado. Comprueba tu conexión a internet o convierte el archivo a .CSV');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = window.XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheet];
        const json = window.XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        resolve(json as RawDataRow[]);
      } catch (err: any) {
        reject(new Error(`Error al leer archivo Excel: ${err?.message || err}`));
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo.'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Heuristic detector for operational and aviation datasets
 */
export function detectColumnRoles(
  headers: string[],
  sampleRows: RawDataRow[]
): {
  suggestedMapping: ColumnMappingConfig;
  detectedColumns: DetectedColumnInfo[];
} {
  const detectedColumns: DetectedColumnInfo[] = [];

  const mapping: ColumnMappingConfig = {
    dateCol: '',
    statusCol: '',
    delayMinutesCol: '',
    causeCol: '',
    regionCol: '',
    routeCol: '',
    resourceCol: '',
    otpThreshold: 15
  };

  const regexPatterns: Record<ColumnRole, RegExp> = {
    date: /(date|fecha|timestamp|tiempo|hora|scheduled|dep_time|std|sta|departure|arrival|dia|mes|periodo)/i,
    status: /(status|estado|resultado|condicion|outcome|punctual|otp|flight_status|atraso_flag)/i,
    metric: /(delay|minutos|minutes|demora|duracion|duration|min|late|retraso|tardanza|loss|tiempo_espera)/i,
    cause: /(cause|reason|causa|motivo|categoria|delay_code|codigo|explicacion|root_cause|submotivo)/i,
    region: /(region|zona|pais|country|market|mercado|hub|territorio|continente|area)/i,
    route: /(route|ruta|segmento|sector|trayecto|origen_destino|flight_no|od|leg|vuelo|flight)/i,
    resource: /(tail|aircraft|aeronave|matricula|equipo|avion|flota|fleet|resource|plane)/i,
    none: /^$/
  };

  for (const header of headers) {
    const samples = sampleRows.slice(0, 5).map((r) => r[header]);
    let bestRole: ColumnRole = 'none';
    let maxScore = 0;

    for (const [role, pattern] of Object.entries(regexPatterns) as [ColumnRole, RegExp][]) {
      if (role === 'none') continue;
      if (pattern.test(header)) {
        const score = 0.8;
        if (score > maxScore) {
          maxScore = score;
          bestRole = role;
        }
      }
    }

    if (bestRole === 'none') {
      const firstVal = samples.find((v) => v !== null && v !== undefined && v !== '');
      if (typeof firstVal === 'number' && maxScore < 0.5) {
        bestRole = 'metric';
        maxScore = 0.4;
      } else if (typeof firstVal === 'string') {
        if (!isNaN(Date.parse(firstVal)) && firstVal.length > 5) {
          bestRole = 'date';
          maxScore = 0.5;
        }
      }
    }

    detectedColumns.push({
      columnName: header,
      sampleValues: samples,
      suggestedRole: bestRole,
      confidence: maxScore
    });

    if (bestRole === 'date' && !mapping.dateCol) mapping.dateCol = header;
    if (bestRole === 'status' && !mapping.statusCol) mapping.statusCol = header;
    if (bestRole === 'metric' && !mapping.delayMinutesCol) mapping.delayMinutesCol = header;
    if (bestRole === 'cause' && !mapping.causeCol) mapping.causeCol = header;
    if (bestRole === 'region' && !mapping.regionCol) mapping.regionCol = header;
    if (bestRole === 'route' && !mapping.routeCol) mapping.routeCol = header;
    if (bestRole === 'resource' && !mapping.resourceCol) mapping.resourceCol = header;
  }

  // Fallbacks if any crucial column was not auto-detected
  if (!mapping.dateCol && headers.length > 0) mapping.dateCol = headers[0];
  if (!mapping.statusCol && headers.length > 1) mapping.statusCol = headers[1];
  if (!mapping.delayMinutesCol) {
    const numCol = headers.find((h) => {
      const v = sampleRows[0]?.[h];
      return typeof v === 'number';
    });
    if (numCol) mapping.delayMinutesCol = numCol;
  }
  if (!mapping.causeCol && headers.length > 3) mapping.causeCol = headers[3];
  if (!mapping.regionCol && headers.length > 4) mapping.regionCol = headers[4];
  if (!mapping.routeCol && headers.length > 2) mapping.routeCol = headers[2];

  return {
    suggestedMapping: mapping,
    detectedColumns
  };
}

