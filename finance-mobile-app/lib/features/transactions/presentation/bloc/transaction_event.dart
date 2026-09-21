import 'package:equatable/equatable.dart';
import '../../domain/entities/transaction.dart';
import '../../domain/entities/transaction_type.dart';

abstract class TransactionEvent extends Equatable {
  const TransactionEvent();

  @override
  List<Object?> get props => [];
}

class LoadTransactionsEvent extends TransactionEvent {
  const LoadTransactionsEvent();
}

class AddTransactionEvent extends TransactionEvent {
  final Transaction transaction;

  const AddTransactionEvent(this.transaction);

  @override
  List<Object?> get props => [transaction];
}

class DeleteTransactionEvent extends TransactionEvent {
  final String id;

  const DeleteTransactionEvent(this.id);

  @override
  List<Object?> get props => [id];
}

class FilterTransactionsByTimeframeEvent extends TransactionEvent {
  final String timeframe; // 'today', 'week', 'month', 'all'

  const FilterTransactionsByTimeframeEvent(this.timeframe);

  @override
  List<Object?> get props => [timeframe];
}

class FilterTransactionsByTypeEvent extends TransactionEvent {
  final TransactionType? type;

  const FilterTransactionsByTypeEvent(this.type);

  @override
  List<Object?> get props => [type];
}

