import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';
import 'transaction_type.dart';

class Category extends Equatable {
  final String id;
  final String name;
  final int iconCode;
  final String colorHex;
  final TransactionType type;

  const Category({
    required this.id,
    required this.name,
    required this.iconCode,
    required this.colorHex,
    required this.type,
  });

  IconData get iconData => IconData(iconCode, fontFamily: 'MaterialIcons');

  Color get color {
    final hexCode = colorHex.replaceAll('#', '');
    return Color(int.parse('FF$hexCode', radix: 16));
  }

  @override
  List<Object?> get props => [id, name, iconCode, colorHex, type];
}

