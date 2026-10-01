import React, { useState, useMemo } from 'react';
import { Search, Filter, CheckCircle2, Clock, AlertCircle, CreditCard, ChevronRight } from 'lucide-react';
import { ReceivableInstallment, UserRole } from '../types/apexlend';
import { formatCurrency, maskBankAccount, maskNationalId } from '../utils/finance';

interface PendingInstallmentsTableProps {
  installments: ReceivableInstallment[];
  isMasked: boolean;
  role: UserRole;
  onSelectInstallmentToPay: (inst: ReceivableInstallment) => void;
}

export const PendingInstallmentsTable: React.FC<PendingInstallmentsTableProps> = ({
  installments,
  isMasked,
  role,
  onSelectInstallmentToPay,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const isAuditor = role === 'Auditor';

  // Filtered installments
  const filtered = useMemo(() => {
    return installments.filter((inst) => {
      // Search
      const s = searchTerm.toLowerCase();
      const matchesSearch =
        inst.id.toLowerCase().includes(s) ||
        inst.loanId.toLowerCase().includes(s) ||
        inst.clientName.toLowerCase().includes(s) ||
        inst.nationalId.toLowerCase().includes(s) ||
        inst.bankAccount.toLowerCase().includes(s);

      if (!matchesSearch) return false;

      // Status filters
      if (filterStatus === 'OVERDUE') return inst.status === 'overdue';
      if (filterStatus === 'TODAY') return inst.status === 'due_today';
      if (filterStatus === 'WEEK') return inst.status === 'due_this_week';
      if (filterStatus === 'PAID') return inst.status === 'paid';

      return true;
    });
  }, [installments, filterStatus, searchTerm]);

  return (
    <div className="bg-[#ffffff] border border-[#d6d6d6] rounded-[28px] p-6 sm:p-8 shadow-none space-y-6">
      {/* Header & Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#d6d6d6]">
        <div>
          <h2 className="text-[20px] font-semibold text-[#1d1d1f] tracking-sub-apple">
            Gestión de Cuotas Pendientes & Cobranza
          </h2>
          <p className="text-[14px] text-[#707070] mt-0.5 tracking-sub-apple">
            Control cronológico de amortizaciones exigibles, pagos del día y gestión de mora.
          </p>
        </div>
        <span className="text-[12px] font-medium text-[#707070] bg-[#f5f5f7] border border-[#d6d6d6] px-3 py-1 rounded-full self-start sm:self-auto">
          {filtered.length} cuotas mostradas
        </span>
      </div>

      {/* Filter Pills & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, préstamo o cuenta..."
            className="w-full h-10 pl-10 pr-4 text-[13px] text-[#1d1d1f] bg-[#f5f5f7] border border-[#86868b] rounded-full outline-none focus:border-[#0071e3] transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#f5f5f7] border border-[#d6d6d6] p-1 rounded-full">
          {[
            { id: 'ALL', label: 'Todas' },
            { id: 'OVERDUE', label: 'Vencidas (Mora)' },
            { id: 'TODAY', label: 'Vencen Hoy' },
            { id: 'WEEK', label: 'Esta Semana' },
            { id: 'PAID', label: 'Pagadas' },
          ].map((f) => {
            const isSelected = filterStatus === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className={`px-3 py-1 text-[12px] font-medium rounded-full transition-all duration-150 ${
                  isSelected
                    ? 'bg-[#ffffff] text-[#1d1d1f] border border-[#d6d6d6]'
                    : 'text-[#707070] hover:text-[#1d1d1f]'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[14px]">
          <thead className="bg-[#f5f5f7] text-[#707070] uppercase font-medium text-[11px] tracking-wider border-b border-[#d6d6d6]">
            <tr>
              <th className="py-3 px-4">Cuota & Préstamo</th>
              <th className="py-3 px-4">Titular del Crédito</th>
              <th className="py-3 px-4">Vencimiento</th>
              <th className="py-3 px-4 text-right">Monto Total</th>
              <th className="py-3 px-4 text-right">Capital / Interés</th>
              <th className="py-3 px-4 text-center">Estado de Cobro</th>
              <th className="py-3 px-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e5e7] text-[#1d1d1f]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#707070] text-[14px]">
                  No hay cuotas que coincidan con los criterios seleccionados.
                </td>
              </tr>
            ) : (
              filtered.map((inst) => {
                const isOverdue = inst.status === 'overdue';
                const isToday = inst.status === 'due_today';
                const isPaid = inst.status === 'paid';

                return (
                  <tr key={inst.id} className="hover:bg-[#f5f5f7]/60 transition-colors">
                    {/* Cuota & Loan ID */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-[#1d1d1f]">{inst.id}</div>
                      <div className="text-[12px] text-[#707070]">
                        {inst.loanId} (Cuota {inst.installmentNumber})
                      </div>
                    </td>

                    {/* Client Info */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#1d1d1f]">{inst.clientName}</div>
                      <div className="text-[12px] text-[#707070] flex items-center gap-1.5 mt-0.5">
                        <span>ID: {maskNationalId(inst.nationalId, isMasked)}</span>
                        <span>•</span>
                        <span>Cta: {maskBankAccount(inst.bankAccount, isMasked)}</span>
                      </div>
                    </td>

                    {/* Due Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-[#1d1d1f]">{inst.dueDate}</div>
                      {isOverdue && (
                        <span className="text-[11px] font-semibold text-[#ff3b30]">
                          +{inst.daysOverdue} días de atraso
                        </span>
                      )}
                      {isToday && (
                        <span className="text-[11px] font-semibold text-[#0071e3]">
                          Vence hoy
                        </span>
                      )}
                      {isPaid && (
                        <span className="text-[11px] text-[#28cd41] font-medium">
                          Pagado el {inst.paidAt?.split(' ')[0]}
                        </span>
                      )}
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="text-[16px] font-semibold text-[#1d1d1f]">
                        {formatCurrency(inst.totalAmount)}
                      </div>
                      {inst.penaltyFee > 0 && (
                        <div className="text-[11px] text-[#ff3b30]">
                          Incluye {formatCurrency(inst.penaltyFee)} mora
                        </div>
                      )}
                    </td>

                    {/* Principal / Interest */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap text-[13px] text-[#707070]">
                      <div>Cap: {formatCurrency(inst.principal)}</div>
                      <div>Int: {formatCurrency(inst.interest)}</div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[11px] font-medium ${
                          isPaid
                            ? 'bg-[#28cd41]/10 text-[#28cd41] border border-[#28cd41]/20'
                            : isOverdue
                            ? 'bg-[#ff3b30]/10 text-[#ff3b30] border border-[#ff3b30]/20'
                            : isToday
                            ? 'bg-[#0071e3]/10 text-[#0071e3] border border-[#0071e3]/20'
                            : 'bg-[#f5f5f7] text-[#707070] border border-[#d6d6d6]'
                        }`}
                      >
                        {isPaid
                          ? 'Pagada'
                          : isOverdue
                          ? 'En Mora'
                          : isToday
                          ? 'Vence Hoy'
                          : 'Al Día'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {isPaid ? (
                        <span className="text-[12px] text-[#28cd41] font-medium flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Amortizado</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => onSelectInstallmentToPay(inst)}
                          disabled={isAuditor}
                          className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                            isAuditor
                              ? 'bg-[#e5e5e7] text-[#86868b] cursor-not-allowed'
                              : 'bg-[#0071e3] hover:bg-[#0077ed] text-white'
                          }`}
                          title={isAuditor ? 'Acción deshabilitada para el rol Auditor' : ''}
                        >
                          Registrar Cobro
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

