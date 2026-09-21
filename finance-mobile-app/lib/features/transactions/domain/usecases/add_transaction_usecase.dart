import '../entities/transaction.dart';
import '../repositories/transaction_repository.dart';

class AddTransactionUseCase {
  final TransactionRepository repository;

  AddTransactionUseCase(this.repository);

  Future<void> call(Transaction transaction) async {
    if (transaction.amount <= 0) {
      throw ArgumentError('El monto de la transacción debe ser mayor a cero.');
    }
    if (transaction.title.trim().isEmpty) {
      throw ArgumentError('El título de la transacción no puede estar vacío.');
    }
    return await repository.addTransaction(transaction);
  }
}

