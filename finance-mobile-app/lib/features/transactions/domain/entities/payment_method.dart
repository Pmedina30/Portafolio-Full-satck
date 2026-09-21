enum PaymentMethod {
  cash,
  debit,
  credit;

  String get displayName {
    switch (this) {
      case PaymentMethod.cash:
        return 'Efectivo';
      case PaymentMethod.debit:
        return 'Tarjeta de Débito';
      case PaymentMethod.credit:
        return 'Tarjeta de Crédito';
    }
  }
}
