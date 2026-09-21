import 'package:flutter/services.dart';
import 'package:flutter_jailbreak_detection/flutter_jailbreak_detection.dart';

abstract class TamperDetectionService {
  Future<bool> isDeviceCompromised();
}

class TamperDetectionServiceImpl implements TamperDetectionService {
  @override
  Future<bool> isDeviceCompromised() async {
    try {
      final isJailbroken = await FlutterJailbreakDetection.jailbroken;
      final isDevMode = await FlutterJailbreakDetection.developerMode;
      // You can choose whether developerMode strictly blocks or only logs
      return isJailbroken;
    } on PlatformException {
      // In case of platform exception, fail securely or gracefully
      return false;
    }
  }
}
