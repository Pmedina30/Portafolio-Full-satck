class AppConstants {
  static const String appName = 'FinTrack Pro';

  static const List<String> supportedCurrencies = ['USD', 'DOP', 'EUR', 'MXN'];
  static const String defaultCurrency = 'DOP';

  static String getCurrencySymbol(String currencyCode) {
    switch (currencyCode) {
      case 'DOP':
        return 'RD\$';
      case 'USD':
        return '\$';
      case 'EUR':
        return '€';
      case 'MXN':
        return 'Mex\$';
      default:
        return '\$';
    }
  }
}
