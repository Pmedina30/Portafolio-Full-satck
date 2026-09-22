import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckCircle,
  Snowflake,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ArrowUpDown,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { AnalyzedTransaction, TransactionCategory, TransactionStatus } from '../types/finpulse';
import { formatFintechAmount, maskAccountNumber, maskEmployeeName } from '../utils/cryptoSecurity';

interface TransactionsTableProps {
  transactions: AnalyzedTransaction[];
  isMasked: boolean;
  onSelectTransaction: (tx: AnalyzedTransaction) => void;
  onApproveTransaction: (id: string) => void;
  onFreezeTransaction: (id: string) => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  isMasked,
  onSelectTransaction,
  onApproveTransaction,
  onFreezeTransaction,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'critical' | 'warning' | 'normal'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'date' | 'amount' | 'zScore'>('zScore');
  const [sortAsc, setSortAsc] = useState(false);

  const pageSize = 10;

  // Available categories
  const categories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.category));
    return ['ALL', ...Array.from(set)];
  }, [transactions]);

  // Filtering
  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      // Search
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        tx.id.toLowerCase().includes(searchLower) ||
        tx.merchant.toLowerCase().includes(searchLower) ||
        tx.employeeName.toLowerCase().includes(searchLower) ||
        tx.accountNumber.toLowerCase().includes(searchLower) ||
        tx.category.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      // Severity
      if (severityFilter !== 'ALL' && tx.severity !== severityFilter) return false;

      // Category
      if (categoryFilter !== 'ALL' && tx.category !== categoryFilter) return false;

      // Status
      if (statusFilter !== 'ALL' && tx.status !== statusFilter) return false;

      return true;
    });
  }, [transactions, searchTerm, severityFilter, categoryFilter, statusFilter]);

  // Sorting
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];
      if (sortField === 'zScore') {
        valA = Math.abs(a.zScore);
        valB = Math.abs(b.zScore);
      }
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filtered, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  const toggleSort = (field: 'date' | 'amount' | 'zScore') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default desc
    }
  };

  return (
    <div className="rounded-xl bg-[#0f1422] border border-[#1c2438] shadow-xl overflow-hidden">
      {/* Table Controls Bar */}
      <div className="p-4 border-b border-[#1c2438] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por ID, comercio, empleado, cuenta..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#131929] border border-[#1f293d] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Severity Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => {
              setSeverityFilter('ALL');
              setCurrentPage(1);
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              severityFilter === 'ALL'
                ? 'bg-slate-700 text-white'
                : 'bg-[#131929] text-slate-400 hover:text-slate-200 border border-[#1f293d]'
            }`}
          >
            Todas ({transactions.length})
          </button>
          <button
            onClick={() => {
              setSeverityFilter('critical');
              setCurrentPage(1);
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              severityFilter === 'critical'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold shadow-sm'
                : 'bg-[#131929] text-rose-400/80 hover:text-rose-300 border border-[#1f293d]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Críticas (|Z| &gt; 2.2)</span>
          </button>
          <button
            onClick={() => {
              setSeverityFilter('warning');
              setCurrentPage(1);
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              severityFilter === 'warning'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold shadow-sm'
                : 'bg-[#131929] text-amber-400/80 hover:text-amber-300 border border-[#1f293d]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Sospechas (1.5-2.2σ)</span>
          </button>
          <button
            onClick={() => {
              setSeverityFilter('normal');
              setCurrentPage(1);
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              severityFilter === 'normal'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold shadow-sm'
                : 'bg-[#131929] text-emerald-400/80 hover:text-emerald-300 border border-[#1f293d]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Normales</span>
          </button>
        </div>

        {/* Category & Status Selectors */}
        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#131929] border border-[#1f293d] rounded-lg text-xs text-slate-300 px-2.5 py-2 focus:outline-none focus:border-cyan-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'ALL' ? 'Categoría: Todas' : c}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#131929] border border-[#1f293d] rounded-lg text-xs text-slate-300 px-2.5 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Estado: Todos</option>
            <option value="pending">Pendientes</option>
            <option value="approved">Aprobados</option>
            <option value="frozen">Congelados</option>
          </select>
        </div>
      </div>

      {/* Transactions Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#1c2438] bg-[#0c101a] text-slate-400 uppercase tracking-wider font-mono text-[11px]">
              <th className="py-3 px-4">TX ID & Fecha</th>
              <th className="py-3 px-4">Comercio / Merchant</th>
              <th className="py-3 px-4">Categoría & Dept</th>
              <th className="py-3 px-4 cursor-pointer hover:text-slate-200" onClick={() => toggleSort('amount')}>
                <div className="flex items-center gap-1">
                  <span>Monto</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4">Cuenta / Empleado</th>
              <th className="py-3 px-4 cursor-pointer hover:text-slate-200" onClick={() => toggleSort('zScore')}>
                <div className="flex items-center gap-1">
                  <span>Z-Score (Desvío)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4">Estado</th>
              <th className="py-3 px-4 text-right">Acciones de Auditoría</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#172033]">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  No se encontraron transacciones con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              paginated.map((tx) => {
                const isCrit = tx.severity === 'critical';
                const isWarn = tx.severity === 'warning';

                return (
                  <tr
                    key={tx.id}
                    className={`transition-colors hover:bg-[#141b2c] ${
                      isCrit
                        ? 'bg-rose-950/10'
                        : isWarn
                        ? 'bg-amber-950/5'
                        : ''
                    }`}
                  >
                    {/* ID & Date */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono font-semibold text-slate-200">{tx.id}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>
                          {tx.date} • {tx.time}
                        </span>
                        {tx.isOffHours && (
                          <span className="ml-1 px-1 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[9px] font-mono">
                            OFF-HOURS
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Merchant */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-200 flex items-center gap-1.5">
                        <span>{tx.merchant}</span>
                        {isCrit && <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />}
                      </div>
                      {tx.notes && (
                        <div className="text-[11px] text-slate-400 truncate max-w-[240px]" title={tx.notes}>
                          {tx.notes}
                        </div>
                      )}
                    </td>

                    {/* Category & Department */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60 text-slate-300 font-medium text-[11px]">
                        {tx.category}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-1">{tx.employeeDepartment}</div>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono font-bold text-sm">
                      <span className={isCrit ? 'text-rose-300' : isWarn ? 'text-amber-300' : 'text-slate-100'}>
                        {formatFintechAmount(tx.amount, isMasked)}
                      </span>
                    </td>

                    {/* Account & Employee */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono">
                      <div className="text-slate-300 text-xs">
                        {maskAccountNumber(tx.accountNumber, isMasked)}
                      </div>
                      <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                        {maskEmployeeName(tx.employeeName, isMasked)}
                      </div>
                    </td>

                    {/* Z-Score Badge */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono">
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                          isCrit
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : isWarn
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        <span>{tx.zScore > 0 ? '+' : ''}{tx.zScore.toFixed(2)}σ</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-sans">
                        {isCrit ? 'Anomalía Crítica' : isWarn ? 'Alerta Media' : 'Distribución Normal'}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-medium font-mono uppercase ${
                          tx.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : tx.status === 'frozen'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {tx.status === 'approved' ? 'Aprobada' : tx.status === 'frozen' ? 'Congelada' : 'Pendiente'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Detail / Analyze */}
                        <button
                          onClick={() => onSelectTransaction(tx)}
                          className="px-2 py-1 rounded bg-[#162033] hover:bg-[#1e2c45] border border-[#23334f] text-cyan-300 text-xs font-medium transition-colors"
                          title="Ver desglose estadístico detallado"
                        >
                          Auditar
                        </button>

                        {/* Approve */}
                        <button
                          onClick={() => onApproveTransaction(tx.id)}
                          disabled={tx.status === 'approved'}
                          className={`p-1.5 rounded transition-all ${
                            tx.status === 'approved'
                              ? 'opacity-30 cursor-not-allowed text-slate-500'
                              : 'bg-emerald-950/40 hover:bg-emerald-800/50 text-emerald-300 border border-emerald-600/30'
                          }`}
                          title="Aprobar transacción y asentar en el libro mayor"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>

                        {/* Freeze */}
                        <button
                          onClick={() => onFreezeTransaction(tx.id)}
                          disabled={tx.status === 'frozen'}
                          className={`p-1.5 rounded transition-all ${
                            tx.status === 'frozen'
                              ? 'opacity-30 cursor-not-allowed text-slate-500'
                              : 'bg-rose-950/40 hover:bg-rose-800/50 text-rose-300 border border-rose-600/30'
                          }`}
                          title="Congelar fondos y emitir alerta de auditoría"
                        >
                          <Snowflake className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-[#1c2438] bg-[#0c101a] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div>
          Mostrando <span className="font-mono text-white">{sorted.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> a{' '}
          <span className="font-mono text-white">{Math.min(currentPage * pageSize, sorted.length)}</span> de{' '}
          <span className="font-mono text-white">{sorted.length}</span> transacciones filtradas
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded bg-[#131929] border border-[#1f293d] text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1a233a]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-slate-300">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded bg-[#131929] border border-[#1f293d] text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1a233a]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
