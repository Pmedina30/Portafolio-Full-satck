import 'package:hive/hive.dart';
import '../../domain/entities/transaction_type.dart';
import '../models/category_model.dart';
import '../models/transaction_model.dart';
import 'default_categories.dart';

abstract class TransactionLocalDataSource {
  Future<List<TransactionModel>> getTransactions();
  Future<void> saveTransaction(TransactionModel transaction);
  Future<void> deleteTransaction(String id);
  Future<List<CategoryModel>> getCategories({TransactionType? type});
  Future<void> saveCategory(CategoryModel category);
  Future<void> initializeDefaultsIfNeeded();
}

class TransactionLocalDataSourceImpl implements TransactionLocalDataSource {
  static const String transactionsBoxName = 'transactions_box';
  static const String categoriesBoxName = 'categories_box';

  final Box<TransactionModel> transactionBox;
  final Box<CategoryModel> categoryBox;

  TransactionLocalDataSourceImpl({
    required this.transactionBox,
    required this.categoryBox,
  });

  @override
  Future<List<TransactionModel>> getTransactions() async {
    final list = transactionBox.values.toList();
    // Sort descending by date (most recent first)
    list.sort((a, b) => b.date.compareTo(a.date));
    return list;
  }

  @override
  Future<void> saveTransaction(TransactionModel transaction) async {
    await transactionBox.put(transaction.id, transaction);
  }

  @override
  Future<void> deleteTransaction(String id) async {
    await transactionBox.delete(id);
  }

  @override
  Future<List<CategoryModel>> getCategories({TransactionType? type}) async {
    if (categoryBox.isEmpty) {
      await initializeDefaultsIfNeeded();
    }
    final all = categoryBox.values.toList();
    if (type == null) return all;
    return all.where((c) => c.type == type).toList();
  }

  @override
  Future<void> saveCategory(CategoryModel category) async {
    await categoryBox.put(category.id, category);
  }

  @override
  Future<void> initializeDefaultsIfNeeded() async {
    if (categoryBox.isEmpty) {
      for (final cat in defaultCategories) {
        await categoryBox.put(cat.id, cat);
      }
    }
  }
}

