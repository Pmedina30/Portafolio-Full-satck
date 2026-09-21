import '../entities/category.dart';
import '../entities/transaction_type.dart';
import '../repositories/transaction_repository.dart';

class GetCategoriesUseCase {
  final TransactionRepository repository;

  GetCategoriesUseCase(this.repository);

  Future<List<Category>> call({TransactionType? type}) async {
    return await repository.getCategories(type: type);
  }
}

