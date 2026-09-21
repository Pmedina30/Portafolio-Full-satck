import 'security_config.dart';

class InputSanitizer {
  /// Strips control characters, dangerous tags, and excessive spaces from text
  static String sanitizeText(String input, {int maxLength = SecurityConfig.maxTitleLength}) {
    // 1. Remove dangerous HTML / script tags
    var cleaned = input.replaceAll(RegExp(r'<[^>]*>'), '');

    // 2. Remove non-printable control characters (except common space & newline)
    cleaned = cleaned.replaceAll(RegExp(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]'), '');

    // 3. Trim extra surrounding spaces
    cleaned = cleaned.trim();

    // 4. Enforce strict character bounds
    if (cleaned.length > maxLength) {
      cleaned = cleaned.substring(0, maxLength);
    }

    return cleaned;
  }

  /// Validates that amount is finite, positive, and within safe financial boundaries
  static double? validateAmount(String rawInput) {
    if (rawInput.trim().isEmpty) return null;

    final parsed = double.tryParse(rawInput.trim().replaceAll(',', '.'));
    if (parsed == null) return null;

    if (parsed.isNaN || parsed.isInfinite) return null;

    if (parsed < SecurityConfig.minTransactionAmount ||
        parsed > SecurityConfig.maxTransactionAmount) {
      return null;
    }

    // Round to 2 decimal places
    return double.parse(parsed.toStringAsFixed(2));
  }
}
