import 'package:intl/intl.dart';
import '../constants/app_constants.dart';

class CurrencyFormatter {
  static String format(double amount, {String currency = AppConstants.defaultCurrency}) {
    final symbol = AppConstants.getCurrencySymbol(currency);
    final formatter = NumberFormat('#,##0.00', 'es_DO');
    return '$symbol ${formatter.format(amount)}';
  }

  static String formatCompact(double amount, {String currency = AppConstants.defaultCurrency}) {
    final symbol = AppConstants.getCurrencySymbol(currency);
    final formatter = NumberFormat.compact(locale: 'es_DO');
    return '$symbol ${formatter.format(amount)}';
  }
}

