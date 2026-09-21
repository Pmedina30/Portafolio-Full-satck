import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:hive/hive.dart';
import 'security_config.dart';

abstract class EncryptionService {
  Future<List<int>> getOrCreateMasterKey();
  Future<HiveCipher> getHiveCipher();
}

class EncryptionServiceImpl implements EncryptionService {
  final FlutterSecureStorage secureStorage;

  EncryptionServiceImpl({
    FlutterSecureStorage? secureStorage,
  }) : secureStorage = secureStorage ??
            const FlutterSecureStorage(
              aOptions: AndroidOptions(
                encryptedSharedPreferences: true,
                resetOnError: false,
              ),
              iOptions: IOSOptions(
                accessibility: KeychainAccessibility.first_unlock_this_device,
              ),
            );

  @override
  Future<List<int>> getOrCreateMasterKey() async {
    // Check if key already exists in Hardware Secure Storage
    final existingKeyBase64 = await secureStorage.read(
      key: SecurityConfig.hiveEncryptionKeyAlias,
    );

    if (existingKeyBase64 != null && existingKeyBase64.isNotEmpty) {
      return base64Decode(existingKeyBase64);
    }

    // Generate a cryptographically secure 256-bit (32 bytes) AES key
    final newSecureKey = Hive.generateSecureKey();

    // Persist encoded key in Keychain / Keystore
    await secureStorage.write(
      key: SecurityConfig.hiveEncryptionKeyAlias,
      value: base64Encode(newSecureKey),
    );

    return newSecureKey;
  }

  @override
  Future<HiveCipher> getHiveCipher() async {
    final key = await getOrCreateMasterKey();
    return HiveAesCipher(key);
  }
}
