import '../entities/category.dart';
import '../entities/transaction.dart';
import '../entities/transaction_type.dart';

abstract class TransactionRepository {
  Future<List<Transaction>> getAllTransactions();
  Future<List<Transaction>> getTransactionsByDateRange(DateTime start, DateTime end);
  Future<void> addTransaction(Transaction transaction);
  Future<void> updateTransaction(Transaction transaction);
  Future<void> deleteTransaction(String id);

  Future<List<Category>> getCategories({TransactionType? type});
  Future<void> addCategory(Category category);
  Future<void> initializeDefaultCategories();
}
