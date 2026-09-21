import 'package:flutter/services.dart';
import 'package:local_auth/local_auth.dart';

abstract class BiometricAuthService {
  Future<bool> isBiometricsAvailable();
  Future<List<BiometricType>> getAvailableBiometrics();
  Future<bool> authenticate({String reason = 'Desbloquea FinTrack para acceder a tus finanzas'});
}

class BiometricAuthServiceImpl implements BiometricAuthService {
  final LocalAuthentication _auth;

  BiometricAuthServiceImpl({LocalAuthentication? auth})
      : _auth = auth ?? LocalAuthentication();

  @override
  Future<bool> isBiometricsAvailable() async {
    try {
      final canCheck = await _auth.canCheckBiometrics;
      final isSupported = await _auth.isDeviceSupported();
      return canCheck || isSupported;
    } on PlatformException {
      return false;
    }
  }

  @override
  Future<List<BiometricType>> getAvailableBiometrics() async {
    try {
      return await _auth.getAvailableBiometrics();
    } on PlatformException {
      return [];
    }
  }

  @override
  Future<bool> authenticate({
    String reason = 'Desbloquea FinTrack para acceder a tus finanzas',
  }) async {
    try {
      final isAvailable = await isBiometricsAvailable();
      if (!isAvailable) {
        // Fallback: If device has no biometrics or hardware, allow entry or require PIN
        return true;
      }

      return await _auth.authenticate(
        localizedReason: reason,
        options: const AuthenticationOptions(
          stickyAuth: true,
          biometricOnly: false, // Allows device PIN / passcode fallback
          useErrorDialogs: true,
        ),
      );
    } on PlatformException {
      return false;
    }
  }
}
