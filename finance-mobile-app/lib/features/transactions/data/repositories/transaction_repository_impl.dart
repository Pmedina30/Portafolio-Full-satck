import '../../domain/entities/category.dart';
import '../../domain/entities/transaction.dart';
import '../../domain/entities/transaction_type.dart';
import '../../domain/repositories/transaction_repository.dart';
import '../datasources/transaction_local_data_source.dart';
import '../models/category_model.dart';
import '../models/transaction_model.dart';

class TransactionRepositoryImpl implements TransactionRepository {
  final TransactionLocalDataSource localDataSource;

  TransactionRepositoryImpl({required this.localDataSource});

  @override
  Future<List<Transaction>> getAllTransactions() async {
    final models = await localDataSource.getTransactions();
    return models;
  }

  @override
  Future<List<Transaction>> getTransactionsByDateRange(DateTime start, DateTime end) async {
    final models = await localDataSource.getTransactions();
    return models.where((t) => t.date.isAfter(start) && t.date.isBefore(end)).toList();
  }

  @override
  Future<void> addTransaction(Transaction transaction) async {
    final model = TransactionModel.fromEntity(transaction);
    await localDataSource.saveTransaction(model);
  }

  @override
  Future<void> updateTransaction(Transaction transaction) async {
    final model = TransactionModel.fromEntity(transaction);
    await localDataSource.saveTransaction(model);
  }

  @override
  Future<void> deleteTransaction(String id) async {
    await localDataSource.deleteTransaction(id);
  }

  @override
  Future<List<Category>> getCategories({TransactionType? type}) async {
    final models = await localDataSource.getCategories(type: type);
    return models;
  }

  @override
  Future<void> addCategory(Category category) async {
    final model = CategoryModel.fromEntity(category);
    await localDataSource.saveCategory(model);
  }

  @override
  Future<void> initializeDefaultCategories() async {
    await localDataSource.initializeDefaultsIfNeeded();
  }
}

