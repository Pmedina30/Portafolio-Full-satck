import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

class AppSettings extends Equatable {
  final String currency;
  final ThemeMode themeMode;

  const AppSettings({
    required this.currency,
    required this.themeMode,
  });

  AppSettings copyWith({
    String? currency,
    ThemeMode? themeMode,
  }) {
    return AppSettings(
      currency: currency ?? this.currency,
      themeMode: themeMode ?? this.themeMode,
    );
  }

  @override
  List<Object?> get props => [currency, themeMode];
}
