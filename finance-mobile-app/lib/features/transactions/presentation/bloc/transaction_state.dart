import 'package:equatable/equatable.dart';
import '../../domain/entities/category.dart';
import '../../domain/entities/transaction.dart';
import '../../domain/entities/transaction_type.dart';

enum TransactionStatus { initial, loading, loaded, success, error }

class TransactionState extends Equatable {
  final TransactionStatus status;
  final List<Transaction> allTransactions;
  final List<Transaction> filteredTransactions;
  final List<Category> categories;
  final String activeTimeframe; // 'today', 'week', 'month', 'all'
  final TransactionType? selectedTypeFilter;
  final String? errorMessage;

  const TransactionState({
    this.status = TransactionStatus.initial,
    this.allTransactions = const [],
    this.filteredTransactions = const [],
    this.categories = const [],
    this.activeTimeframe = 'month',
    this.selectedTypeFilter,
    this.errorMessage,
  });

  // Financial Metrics (Based on current month)
  double get totalIncome {
    return allTransactions
        .where((t) => t.type.isIncome && _isCurrentMonth(t.date))
        .fold(0.0, (sum, t) => sum + t.amount);
  }

  double get totalExpense {
    return allTransactions
        .where((t) => t.type.isExpense && _isCurrentMonth(t.date))
        .fold(0.0, (sum, t) => sum + t.amount);
  }

  double get currentBalance => totalIncome - totalExpense;

  Map<Category, double> get expensesByCategory {
    final map = <Category, double>{};
    final monthExpenses = allTransactions.where((t) => t.type.isExpense && _isCurrentMonth(t.date));

    for (final tx in monthExpenses) {
      map[tx.category] = (map[tx.category] ?? 0.0) + tx.amount;
    }
    return map;
  }

  bool _isCurrentMonth(DateTime date) {
    final now = DateTime.now();
    return date.year == now.year && date.month == now.month;
  }

  TransactionState copyWith({
    TransactionStatus? status,
    List<Transaction>? allTransactions,
    List<Transaction>? filteredTransactions,
    List<Category>? categories,
    String? activeTimeframe,
    TransactionType? selectedTypeFilter,
    String? errorMessage,
  }) {
    return TransactionState(
      status: status ?? this.status,
      allTransactions: allTransactions ?? this.allTransactions,
      filteredTransactions: filteredTransactions ?? this.filteredTransactions,
      categories: categories ?? this.categories,
      activeTimeframe: activeTimeframe ?? this.activeTimeframe,
      selectedTypeFilter: selectedTypeFilter ?? this.selectedTypeFilter,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }

  @override
  List<Object?> get props => [
        status,
        allTransactions,
        filteredTransactions,
        categories,
        activeTimeframe,
        selectedTypeFilter,
        errorMessage,
      ];
}
