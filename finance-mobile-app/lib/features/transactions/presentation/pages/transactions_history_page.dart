import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/utils/currency_formatter.dart';
import '../../../../core/utils/date_formatter.dart';
import '../../../settings/presentation/cubit/settings_cubit.dart';
import '../../domain/entities/transaction.dart';
import '../../domain/entities/transaction_type.dart';
import '../bloc/transaction_bloc.dart';
import '../bloc/transaction_event.dart';
import '../bloc/transaction_state.dart';

class TransactionsHistoryPage extends StatefulWidget {
  const TransactionsHistoryPage({super.key});

  @override
  State<TransactionsHistoryPage> createState() => _TransactionsHistoryPageState();
}

class _TransactionsHistoryPageState extends State<TransactionsHistoryPage> {
  TransactionType? _selectedTypeFilter;
  String _searchQuery = '';

  @override
  Widget build(BuildContext context) {
    final currency = context.watch<SettingsCubit>().state.currency;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Historial de Movimientos'),
      ),
      body: BlocBuilder<TransactionBloc, TransactionState>(
        builder: (context, state) {
          // Filter by search query and type
          var list = state.allTransactions;
          if (_selectedTypeFilter != null) {
            list = list.where((t) => t.type == _selectedTypeFilter).toList();
          }
          if (_searchQuery.trim().isNotEmpty) {
            final q = _searchQuery.toLowerCase();
            list = list
                .where((t) =>
                    t.title.toLowerCase().contains(q) ||
                    t.category.name.toLowerCase().contains(q) ||
                    (t.note?.toLowerCase().contains(q) ?? false))
                .toList();
          }

          // Group by Date String
          final Map<String, List<Transaction>> grouped = {};
          for (final t in list) {
            final dateKey = DateFormatter.formatFull(t.date);
            grouped.putIfAbsent(dateKey, () => []).add(t);
          }

          return Column(
            children: [
              // Search & Type Filter Bar
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                child: Column(
                  children: [
                    TextField(
                      decoration: InputDecoration(
                        hintText: 'Buscar por concepto o categoría...',
                        prefixIcon: const Icon(Icons.search_rounded),
                        suffixIcon: _searchQuery.isNotEmpty
                            ? IconButton(
                                icon: const Icon(Icons.clear_rounded),
                                onPressed: () {
                                  setState(() {
                                    _searchQuery = '';
                                  });
                                },
                              )
                            : null,
                      ),
                      onChanged: (val) {
                        setState(() {
                          _searchQuery = val;
                        });
                      },
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        _TypeFilterChip(
                          label: 'Todos',
                          isSelected: _selectedTypeFilter == null,
                          onTap: () {
                            setState(() {
                              _selectedTypeFilter = null;
                            });
                          },
                        ),
                        const SizedBox(width: 8),
                        _TypeFilterChip(
                          label: 'Solo Gastos',
                          isSelected: _selectedTypeFilter == TransactionType.expense,
                          activeColor: AppTheme.expenseColor,
                          onTap: () {
                            setState(() {
                              _selectedTypeFilter = TransactionType.expense;
                            });
                          },
                        ),
                        const SizedBox(width: 8),
                        _TypeFilterChip(
                          label: 'Solo Ingresos',
                          isSelected: _selectedTypeFilter == TransactionType.income,
                          activeColor: AppTheme.incomeColor,
                          onTap: () {
                            setState(() {
                              _selectedTypeFilter = TransactionType.income;
                            });
                          },
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const Divider(height: 1),

              // Grouped Transactions List
              Expanded(
                child: grouped.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.search_off_rounded, size: 54, color: Colors.grey.shade400),
                            const SizedBox(height: 12),
                            Text(
                              'No se encontraron transacciones',
                              style: TextStyle(color: Colors.grey.shade500, fontSize: 14),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                        itemCount: grouped.keys.length,
                        itemBuilder: (context, groupIndex) {
                          final dateKey = grouped.keys.elementAt(groupIndex);
                          final items = grouped[dateKey]!;

                          return Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Padding(
                                padding: const EdgeInsets.symmetric(vertical: 10),
                                child: Text(
                                  dateKey,
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w700,
                                    color: Colors.grey.shade500,
                                  ),
                                ),
                              ),
                              ...items.map((tx) {
                                final isIncome = tx.type.isIncome;
                                final amountColor = isIncome ? AppTheme.incomeColor : AppTheme.expenseColor;
                                final amountPrefix = isIncome ? '+ ' : '- ';

                                return Container(
                                  margin: const EdgeInsets.only(bottom: 8),
                                  padding: const EdgeInsets.all(14),
                                  decoration: BoxDecoration(
                                    color: Theme.of(context).cardColor,
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(
                                      color: isDark ? const Color(0xFF27272A) : const Color(0xFFE2E8F0),
                                    ),
                                  ),
                                  child: Row(
                                    children: [
                                      Container(
                                        width: 42,
                                        height: 42,
                                        decoration: BoxDecoration(
                                          color: tx.category.color.withOpacity(0.12),
                                          borderRadius: BorderRadius.circular(12),
                                        ),
                                        child: Icon(
                                          tx.category.iconData,
                                          color: tx.category.color,
                                          size: 20,
                                        ),
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              tx.title,
                                              style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                                            ),
                                            const SizedBox(height: 2),
                                            Text(
                                              '${tx.category.name} • ${tx.paymentMethod.displayName}',
                                              style: TextStyle(fontSize: 11, color: Colors.grey.shade500),
                                            ),
                                          ],
                                        ),
                                      ),
                                      Column(
                                        crossAxisAlignment: CrossAxisAlignment.end,
                                        children: [
                                          Text(
                                            '$amountPrefix${CurrencyFormatter.format(tx.amount, currency: currency)}',
                                            style: TextStyle(
                                              fontSize: 14,
                                              fontWeight: FontWeight.w700,
                                              color: amountColor,
                                            ),
                                          ),
                                          const SizedBox(height: 2),
                                          Text(
                                            DateFormatter.formatTime(tx.date),
                                            style: TextStyle(fontSize: 10, color: Colors.grey.shade500),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                );
                              }),
                            ],
                          );
                        },
                      ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _TypeFilterChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final Color? activeColor;
  final VoidCallback onTap;

  const _TypeFilterChip({
    required this.label,
    required this.isSelected,
    this.activeColor,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveColor = activeColor ?? AppTheme.primaryColor;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
        decoration: BoxDecoration(
          color: isSelected
              ? effectiveColor
              : (isDark ? const Color(0xFF27272A) : const Color(0xFFF1F5F9)),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
            color: isSelected ? Colors.white : Colors.grey.shade500,
          ),
        ),
      ),
    );
  }
}

