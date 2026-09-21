import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:screen_protector/screen_protector.dart';

abstract class ScreenPrivacyService {
  Future<void> enableProtection();
  Future<void> disableProtection();
  Future<void> protectAppSwitcher();
}

class ScreenPrivacyServiceImpl implements ScreenPrivacyService {
  @override
  Future<void> enableProtection() async {
    try {
      // 1. Prevent Screenshots and Screen Recording (Android FLAG_SECURE & iOS equivalent)
      await ScreenProtector.preventScreenshotOn();
      // 2. Protect Recent App switcher preview with blur or splash
      await ScreenProtector.protectDataLeakageWithBlur();
    } on PlatformException {
      // Graceful fallback if platform doesn't support specific flag
    }
  }

  @override
  Future<void> disableProtection() async {
    try {
      await ScreenProtector.preventScreenshotOff();
      await ScreenProtector.protectDataLeakageOff();
    } on PlatformException {
      // Graceful fallback
    }
  }

  @override
  Future<void> protectAppSwitcher() async {
    try {
      await ScreenProtector.protectDataLeakageWithColor(Colors.black);
    } on PlatformException {
      // Fallback
    }
  }
}
