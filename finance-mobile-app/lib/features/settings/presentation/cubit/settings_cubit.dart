import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hive/hive.dart';
import '../../../core/constants/app_constants.dart';
import '../../domain/settings_entity.dart';

class SettingsCubit extends Cubit<AppSettings> {
  static const String settingsBoxName = 'settings_box';
  final Box<dynamic> settingsBox;

  SettingsCubit(this.settingsBox)
      : super(AppSettings(
          currency: settingsBox.get('currency', defaultValue: AppConstants.defaultCurrency) as String,
          themeMode: _parseThemeMode(settingsBox.get('themeMode', defaultValue: 'system') as String),
        ));

  static ThemeMode _parseThemeMode(String mode) {
    switch (mode) {
      case 'light':
        return ThemeMode.light;
      case 'dark':
        return ThemeMode.dark;
      default:
        return ThemeMode.system;
    }
  }

  Future<void> updateCurrency(String newCurrency) async {
    await settingsBox.put('currency', newCurrency);
    emit(state.copyWith(currency: newCurrency));
  }

  Future<void> updateThemeMode(ThemeMode newMode) async {
    final modeString = newMode == ThemeMode.dark
        ? 'dark'
        : newMode == ThemeMode.light
            ? 'light'
            : 'system';
    await settingsBox.put('themeMode', modeString);
    emit(state.copyWith(themeMode: newMode));
  }
}

