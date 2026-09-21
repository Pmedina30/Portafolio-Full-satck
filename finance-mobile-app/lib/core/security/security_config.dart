class SecurityConfig {
  static const String hiveEncryptionKeyAlias = 'fintrack_aes256_master_key';
  static const String biometricEnabledKey = 'fintrack_biometrics_enabled';
  static const String autoLockTimeoutKey = 'fintrack_autolock_seconds';
  static const String privacyModeKey = 'fintrack_privacy_mode';

  // Default auto-lock in seconds (e.g. 30 seconds of background)
  static const int defaultAutoLockSeconds = 30;

  // Max transaction amount bounds to prevent arithmetic overflows / anomalies
  static const double maxTransactionAmount = 999999999.99;
  static const double minTransactionAmount = 0.01;

  // Max character lengths
  static const int maxTitleLength = 80;
  static const int maxNoteLength = 250;
}
