import 'package:hive/hive.dart';
import 'biometric_auth_service.dart';
import 'encryption_service.dart';
import 'input_sanitizer.dart';
import 'screen_privacy_service.dart';
import 'tamper_detection_service.dart';

abstract class SecurityService {
  Future<void> initializeSecurity();
  Future<HiveCipher> getEncryptedCipher();
  Future<bool> authenticateBiometric();
  Future<bool> verifyDeviceIntegrity();
  void enableScreenPrivacy();
  void disableScreenPrivacy();
  String sanitizeInput(String text, {int maxLength});
  double? validateAmount(String raw);
}

class SecurityServiceImpl implements SecurityService {
  final EncryptionService _encryptionService;
  final BiometricAuthService _biometricAuthService;
  final TamperDetectionService _tamperDetectionService;
  final ScreenPrivacyService _screenPrivacyService;

  SecurityServiceImpl({
    EncryptionService? encryptionService,
    BiometricAuthService? biometricAuthService,
    TamperDetectionService? tamperDetectionService,
    ScreenPrivacyService? screenPrivacyService,
  })  : _encryptionService = encryptionService ?? EncryptionServiceImpl(),
        _biometricAuthService = biometricAuthService ?? BiometricAuthServiceImpl(),
        _tamperDetectionService = tamperDetectionService ?? TamperDetectionServiceImpl(),
        _screenPrivacyService = screenPrivacyService ?? ScreenPrivacyServiceImpl();

  @override
  Future<void> initializeSecurity() async {
    // 1. Activate Screen Privacy Protection immediately upon launch
    await _screenPrivacyService.enableProtection();
  }

  @override
  Future<HiveCipher> getEncryptedCipher() async {
    return await _encryptionService.getHiveCipher();
  }

  @override
  Future<bool> authenticateBiometric() async {
    return await _biometricAuthService.authenticate();
  }

  @override
  Future<bool> verifyDeviceIntegrity() async {
    final isCompromised = await _tamperDetectionService.isDeviceCompromised();
    return !isCompromised;
  }

  @override
  void enableScreenPrivacy() {
    _screenPrivacyService.enableProtection();
  }

  @override
  void disableScreenPrivacy() {
    _screenPrivacyService.disableProtection();
  }

  @override
  String sanitizeInput(String text, {int maxLength = 80}) {
    return InputSanitizer.sanitizeText(text, maxLength: maxLength);
  }

  @override
  double? validateAmount(String raw) {
    return InputSanitizer.validateAmount(raw);
  }
}
