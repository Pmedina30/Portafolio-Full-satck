import 'package:hive/hive.dart';
import '../../domain/entities/payment_method.dart';
import '../../domain/entities/transaction.dart';
import '../../domain/entities/transaction_type.dart';
import 'category_model.dart';

class TransactionModel extends Transaction {
  const TransactionModel({
    required super.id,
    required super.title,
    required super.amount,
    required super.type,
    required CategoryModel super.category,
    required super.date,
    super.note,
    super.paymentMethod,
  });

  factory TransactionModel.fromEntity(Transaction transaction) {
    return TransactionModel(
      id: transaction.id,
      title: transaction.title,
      amount: transaction.amount,
      type: transaction.type,
      category: CategoryModel.fromEntity(transaction.category),
      date: transaction.date,
      note: transaction.note,
      paymentMethod: transaction.paymentMethod,
    );
  }

  factory TransactionModel.fromJson(Map<String, dynamic> json) {
    return TransactionModel(
      id: json['id'] as String,
      title: json['title'] as String,
      amount: (json['amount'] as num).toDouble(),
      type: TransactionType.values.firstWhere(
        (e) => e.name == json['type'],
        orElse: () => TransactionType.expense,
      ),
      category: CategoryModel.fromJson(json['category'] as Map<String, dynamic>),
      date: DateTime.parse(json['date'] as String),
      note: json['note'] as String?,
      paymentMethod: PaymentMethod.values.firstWhere(
        (e) => e.name == json['paymentMethod'],
        orElse: () => PaymentMethod.cash,
      ),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'amount': amount,
      'type': type.name,
      'category': (category as CategoryModel).toJson(),
      'date': date.toIso8601String(),
      'note': note,
      'paymentMethod': paymentMethod.name,
    };
  }
}

class TransactionModelAdapter extends TypeAdapter<TransactionModel> {
  @override
  final int typeId = 1;

  @override
  TransactionModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return TransactionModel(
      id: fields[0] as String,
      title: fields[1] as String,
      amount: fields[2] as double,
      type: TransactionType.values.firstWhere(
        (e) => e.name == (fields[3] as String),
        orElse: () => TransactionType.expense,
      ),
      category: fields[4] as CategoryModel,
      date: DateTime.fromMillisecondsSinceEpoch(fields[5] as int),
      note: fields[6] as String?,
      paymentMethod: PaymentMethod.values.firstWhere(
        (e) => e.name == (fields[7] as String? ?? 'cash'),
        orElse: () => PaymentMethod.cash,
      ),
    );
  }

  @override
  void write(BinaryWriter writer, TransactionModel obj) {
    writer
      ..writeByte(8)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.title)
      ..writeByte(2)
      ..write(obj.amount)
      ..writeByte(3)
      ..write(obj.type.name)
      ..writeByte(4)
      ..write(CategoryModel.fromEntity(obj.category))
      ..writeByte(5)
      ..write(obj.date.millisecondsSinceEpoch)
      ..writeByte(6)
      ..write(obj.note)
      ..writeByte(7)
      ..write(obj.paymentMethod.name);
  }
}

