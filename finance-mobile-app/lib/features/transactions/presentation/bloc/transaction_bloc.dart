import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/entities/transaction.dart';
import '../../domain/usecases/add_transaction_usecase.dart';
import '../../domain/usecases/delete_transaction_usecase.dart';
import '../../domain/usecases/get_categories_usecase.dart';
import '../../domain/usecases/get_transactions_usecase.dart';
import 'transaction_event.dart';
import 'transaction_state.dart';

class TransactionBloc extends Bloc<TransactionEvent, TransactionState> {
  final GetTransactionsUseCase getTransactionsUseCase;
  final AddTransactionUseCase addTransactionUseCase;
  final DeleteTransactionUseCase deleteTransactionUseCase;
  final GetCategoriesUseCase getCategoriesUseCase;

  TransactionBloc({
    required this.getTransactionsUseCase,
    required this.addTransactionUseCase,
    required this.deleteTransactionUseCase,
    required this.getCategoriesUseCase,
  }) : super(const TransactionState()) {
    on<LoadTransactionsEvent>(_onLoadTransactions);
    on<AddTransactionEvent>(_onAddTransaction);
    on<DeleteTransactionEvent>(_onDeleteTransaction);
    on<FilterTransactionsByTimeframeEvent>(_onFilterByTimeframe);
    on<FilterTransactionsByTypeEvent>(_onFilterByType);
  }

  Future<void> _onLoadTransactions(
    LoadTransactionsEvent event,
    Emitter<TransactionState> emit,
  ) async {
    emit(state.copyWith(status: TransactionStatus.loading));
    try {
      final transactions = await getTransactionsUseCase();
      final categories = await getCategoriesUseCase();

      final filtered = _applyFilters(
        transactions,
        timeframe: state.activeTimeframe,
        type: state.selectedTypeFilter,
      );

      emit(state.copyWith(
        status: TransactionStatus.loaded,
        allTransactions: transactions,
        filteredTransactions: filtered,
        categories: categories,
      ));
    } catch (e) {
      emit(state.copyWith(
        status: TransactionStatus.error,
        errorMessage: 'Error al cargar transacciones: ${e.toString()}',
      ));
    }
  }

  Future<void> _onAddTransaction(
    AddTransactionEvent event,
    Emitter<TransactionState> emit,
  ) async {
    emit(state.copyWith(status: TransactionStatus.loading));
    try {
      await addTransactionUseCase(event.transaction);
      // Reload updated transactions
      final transactions = await getTransactionsUseCase();
      final filtered = _applyFilters(
        transactions,
        timeframe: state.activeTimeframe,
        type: state.selectedTypeFilter,
      );

      emit(state.copyWith(
        status: TransactionStatus.success,
        allTransactions: transactions,
        filteredTransactions: filtered,
      ));
    } catch (e) {
      emit(state.copyWith(
        status: TransactionStatus.error,
        errorMessage: 'Error al registrar la transacción: ${e.toString()}',
      ));
    }
  }

  Future<void> _onDeleteTransaction(
    DeleteTransactionEvent event,
    Emitter<TransactionState> emit,
  ) async {
    try {
      await deleteTransactionUseCase(event.id);
      final transactions = await getTransactionsUseCase();
      final filtered = _applyFilters(
        transactions,
        timeframe: state.activeTimeframe,
        type: state.selectedTypeFilter,
      );

      emit(state.copyWith(
        allTransactions: transactions,
        filteredTransactions: filtered,
      ));
    } catch (e) {
      emit(state.copyWith(
        status: TransactionStatus.error,
        errorMessage: 'Error al eliminar la transacción',
      ));
    }
  }

  void _onFilterByTimeframe(
    FilterTransactionsByTimeframeEvent event,
    Emitter<TransactionState> emit,
  ) {
    final filtered = _applyFilters(
      state.allTransactions,
      timeframe: event.timeframe,
      type: state.selectedTypeFilter,
    );
    emit(state.copyWith(
      activeTimeframe: event.timeframe,
      filteredTransactions: filtered,
    ));
  }

  void _onFilterByType(
    FilterTransactionsByTypeEvent event,
    Emitter<TransactionState> emit,
  ) {
    final filtered = _applyFilters(
      state.allTransactions,
      timeframe: state.activeTimeframe,
      type: event.type,
    );
    emit(state.copyWith(
      selectedTypeFilter: event.type,
      filteredTransactions: filtered,
    ));
  }

  List<Transaction> _applyFilters(
    List<Transaction> list, {
    required String timeframe,
    TransactionType? type,
  }) {
    final now = DateTime.now();
    var result = list;

    if (type != null) {
      result = result.where((t) => t.type == type).toList();
    }

    switch (timeframe) {
      case 'today':
        result = result.where((t) {
          return t.date.year == now.year &&
              t.date.month == now.month &&
              t.date.day == now.day;
        }).toList();
        break;
      case 'week':
        final startOfWeek = now.subtract(Duration(days: now.weekday - 1));
        final start = DateTime(startOfWeek.year, startOfWeek.month, startOfWeek.day);
        result = result.where((t) => t.date.isAfter(start.subtract(const Duration(seconds: 1)))).toList();
        break;
      case 'month':
        result = result.where((t) {
          return t.date.year == now.year && t.date.month == now.month;
        }).toList();
        break;
      case 'all':
      default:
        break;
    }

    return result;
  }
}

