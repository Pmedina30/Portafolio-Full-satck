import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../settings/presentation/cubit/settings_cubit.dart';
import '../../domain/entities/transaction_type.dart';
import '../bloc/transaction_bloc.dart';
import '../bloc/transaction_event.dart';
import '../bloc/transaction_state.dart';
import '../widgets/balance_summary_card.dart';
import '../widgets/category_breakdown_chart.dart';
import '../widgets/recent_transactions_list.dart';
import 'add_transaction_page.dart';
import 'transactions_history_page.dart';

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: BlocConsumer<TransactionBloc, TransactionState>(
          listener: (context, state) {
            if (state.status == TransactionStatus.error && state.errorMessage != null) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(state.errorMessage!),
                  backgroundColor: AppTheme.expenseColor,
                ),
              );
            }
          },
          builder: (context, state) {
            final currency = context.watch<SettingsCubit>().state.currency;
            final isDark = Theme.of(context).brightness == Brightness.dark;

            return RefreshIndicator(
              onRefresh: () async {
                context.read<TransactionBloc>().add(const LoadTransactionsEvent());
              },
              child: CustomScrollView(
                slivers: [
                  // App Bar with Profile & Quick Settings
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Bienvenido de vuelta 👋',
                                style: TextStyle(
                                  fontSize: 13,
                                  color: Colors.grey.shade500,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              const SizedBox(height: 2),
                              const Text(
                                'Finanzas Personales',
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ],
                          ),
                          Row(
                            children: [
                              // Currency selector chip
                              PopupMenuButton<String>(
                                initialValue: currency,
                                onSelected: (val) {
                                  context.read<SettingsCubit>().updateCurrency(val);
                                },
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                itemBuilder: (context) => [
                                  const PopupMenuItem(value: 'DOP', child: Text('DOP (RD\$)')),
                                  const PopupMenuItem(value: 'USD', child: Text('USD (\$)')),
                                  const PopupMenuItem(value: 'EUR', child: Text('EUR (€)')),
                                  const PopupMenuItem(value: 'MXN', child: Text('MXN (Mex\$)')),
                                ],
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: isDark ? const Color(0xFF27272A) : const Color(0xFFF1F5F9),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Row(
                                    children: [
                                      Text(
                                        currency,
                                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                                      ),
                                      const Icon(Icons.arrow_drop_down, size: 18),
                                    ],
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              // Theme Mode Toggle
                              IconButton(
                                icon: Icon(
                                  isDark ? Icons.light_mode_rounded : Icons.dark_mode_rounded,
                                  size: 20,
                                ),
                                onPressed: () {
                                  context.read<SettingsCubit>().updateThemeMode(
                                        isDark ? ThemeMode.light : ThemeMode.dark,
                                      );
                                },
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),

                  // Main Balance Summary Card
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: BalanceSummaryCard(
                        balance: state.currentBalance,
                        income: state.totalIncome,
                        expense: state.totalExpense,
                        currency: currency,
                      ),
                    ),
                  ),

                  const SliverToBoxAdapter(child: SizedBox(height: 24)),

                  // Category Breakdown Section
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: Card(
                        child: Padding(
                          padding: const EdgeInsets.all(20),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  const Text(
                                    'Gastos por Categoría',
                                    style: TextStyle(
                                      fontSize: 15,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                  Text(
                                    'Este Mes',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: Colors.grey.shade500,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 16),
                              CategoryBreakdownChart(
                                expensesByCategory: state.expensesByCategory,
                                currency: currency,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),

                  const SliverToBoxAdapter(child: SizedBox(height: 24)),

                  // Filter Header & Timeframe Pills
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                'Transacciones Recientes',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              TextButton(
                                onPressed: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) => const TransactionsHistoryPage(),
                                    ),
                                  );
                                },
                                child: const Text('Ver todas'),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          // Timeframe Selector Chips
                          Row(
                            children: [
                              _FilterChip(
                                label: 'Este mes',
                                isSelected: state.activeTimeframe == 'month',
                                onTap: () => context
                                    .read<TransactionBloc>()
                                    .add(const FilterTransactionsByTimeframeEvent('month')),
                              ),
                              const SizedBox(width: 8),
                              _FilterChip(
                                label: 'Esta semana',
                                isSelected: state.activeTimeframe == 'week',
                                onTap: () => context
                                    .read<TransactionBloc>()
                                    .add(const FilterTransactionsByTimeframeEvent('week')),
                              ),
                              const SizedBox(width: 8),
                              _FilterChip(
                                label: 'Hoy',
                                isSelected: state.activeTimeframe == 'today',
                                onTap: () => context
                                    .read<TransactionBloc>()
                                    .add(const FilterTransactionsByTimeframeEvent('today')),
                              ),
                              const SizedBox(width: 8),
                              _FilterChip(
                                label: 'Todas',
                                isSelected: state.activeTimeframe == 'all',
                                onTap: () => context
                                    .read<TransactionBloc>()
                                    .add(const FilterTransactionsByTimeframeEvent('all')),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SliverToBoxAdapter(child: SizedBox(height: 16)),

                  // Transactions List
                  SliverPadding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    sliver: SliverToBoxAdapter(
                      child: state.status == TransactionStatus.loading && state.allTransactions.isEmpty
                          ? const Center(
                              child: Padding(
                                padding: EdgeInsets.all(32),
                                child: CircularProgressIndicator(),
                              ),
                            )
                          : RecentTransactionsList(
                              transactions: state.filteredTransactions.take(8).toList(),
                              currency: currency,
                              onDelete: (id) {
                                context.read<TransactionBloc>().add(DeleteTransactionEvent(id));
                              },
                            ),
                    ),
                  ),

                  const SliverToBoxAdapter(child: SizedBox(height: 100)),
                ],
              ),
            );
          },
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const AddTransactionPage()),
          );
        },
        backgroundColor: AppTheme.primaryColor,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add_rounded),
        label: const Text(
          'Nueva Transacción',
          style: TextStyle(fontWeight: FontWeight.w700),
        ),
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _FilterChip({
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
        decoration: BoxDecoration(
          color: isSelected
              ? AppTheme.primaryColor
              : (isDark ? const Color(0xFF27272A) : const Color(0xFFF1F5F9)),
          borderRadius: BorderRadius.circular(20),
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
