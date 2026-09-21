import 'package:equatable/equatable.dart';

abstract class Failure extends Equatable {
  final String message;
  const Failure(this.message);

  @override
  List<Object?> get props => [message];
}

class CacheFailure extends Failure {
  const CacheFailure([super.message = 'Error al acceder a los datos locales']);
}

class ValidationFailure extends Failure {
  const ValidationFailure([super.message = 'Error de validación en los datos ingresados']);
}
