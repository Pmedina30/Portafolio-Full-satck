import 'package:get_it/get_it.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../security/security_service.dart';
import '../../features/security/presentation/bloc/security_bloc.dart';
import '../../features/settings/presentation/cubit/settings_cubit.dart';
import '../../features/transactions/data/datasources/transaction_local_data_source.dart';
import '../../features/transactions/data/models/category_model.dart';
import '../../features/transactions/data/models/transaction_model.dart';
import '../../features/transactions/data/repositories/transaction_repository_impl.dart';
import '../../features/transactions/domain/repositories/transaction_repository.dart';
import '../../features/transactions/domain/usecases/add_transaction_usecase.dart';
import '../../features/transactions/domain/usecases/delete_transaction_usecase.dart';
import '../../features/transactions/domain/usecases/get_categories_usecase.dart';
import '../../features/transactions/domain/usecases/get_transactions_usecase.dart';
import '../../features/transactions/presentation/bloc/transaction_bloc.dart';

final sl = GetIt.instance;

Future<void> initDependencies() async {
  // 1. Initialize Security Subsystem (Keychain/Keystore & Screen Protection)
  final securityService = SecurityServiceImpl();
  await securityService.initializeSecurity();
  sl.registerLazySingleton<SecurityService>(() => securityService);

  // 2. Initialize Hive Local Storage
  await Hive.initFlutter();

  // 3. Register Hive TypeAdapters
  if (!Hive.isAdapterRegistered(0)) {
    Hive.registerAdapter(CategoryModelAdapter());
  }
  if (!Hive.isAdapterRegistered(1)) {
    Hive.registerAdapter(TransactionModelAdapter());
  }

  // 4. Retrieve Hardware-backed AES-256 HiveCipher from Secure Storage
  final encryptedCipher = await securityService.getEncryptedCipher();

  // 5. Open Encrypted Hive Boxes
  final transactionBox = await Hive.openBox<TransactionModel>(
    TransactionLocalDataSourceImpl.transactionsBoxName,
    cipher: encryptedCipher, // AES-256 Encrypted at Rest
  );
  final categoryBox = await Hive.openBox<CategoryModel>(
    TransactionLocalDataSourceImpl.categoriesBoxName,
    cipher: encryptedCipher, // AES-256 Encrypted at Rest
  );
  final settingsBox = await Hive.openBox<dynamic>(
    SettingsCubit.settingsBoxName,
  );

  sl.registerLazySingleton<Box<TransactionModel>>(() => transactionBox);
  sl.registerLazySingleton<Box<CategoryModel>>(() => categoryBox);
  sl.registerLazySingleton<Box<dynamic>>(() => settingsBox);

  // 6. Data Sources
  sl.registerLazySingleton<TransactionLocalDataSource>(
    () => TransactionLocalDataSourceImpl(
      transactionBox: sl(),
      categoryBox: sl(),
    ),
  );

  // 7. Repositories
  sl.registerLazySingleton<TransactionRepository>(
    () => TransactionRepositoryImpl(
      localDataSource: sl(),
    ),
  );

  // Initialize default categories if first launch
  await sl<TransactionRepository>().initializeDefaultCategories();

  // 8. Use Cases
  sl.registerLazySingleton(() => GetTransactionsUseCase(sl()));
  sl.registerLazySingleton(() => AddTransactionUseCase(sl()));
  sl.registerLazySingleton(() => DeleteTransactionUseCase(sl()));
  sl.registerLazySingleton(() => GetCategoriesUseCase(sl()));

  // 9. Blocs & Cubits
  sl.registerFactory(
    () => SecurityBloc(
      securityService: sl(),
    ),
  );

  sl.registerFactory(
    () => TransactionBloc(
      getTransactionsUseCase: sl(),
      addTransactionUseCase: sl(),
      deleteTransactionUseCase: sl(),
      getCategoriesUseCase: sl(),
    ),
  );

  sl.registerLazySingleton(
    () => SettingsCubit(sl()),
  );
}
