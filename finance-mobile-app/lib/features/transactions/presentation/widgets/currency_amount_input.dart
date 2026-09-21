import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/theme/app_theme.dart';
import '../../domain/entities/transaction_type.dart';

class CurrencyAmountInput extends StatelessWidget {
  final TextEditingController controller;
  final String currency;
  final TransactionType type;
  final ValueChanged<String>? onChanged;

  const CurrencyAmountInput({
    super.key,
    required this.controller,
    required this.currency,
    required this.type,
    this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final symbol = AppConstants.getCurrencySymbol(currency);
    final accentColor = type.isIncome ? AppTheme.incomeColor : AppTheme.expenseColor;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      decoration: BoxDecoration(
        color: accentColor.withOpacity(0.06),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: accentColor.withOpacity(0.25), width: 1.5),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Text(
            symbol,
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.w700,
              color: accentColor,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: TextFormField(
              controller: controller,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              inputFormatters: [
                FilteringTextInputFormatter.allow(RegExp(r'^\d+\.?\d{0,2}')),
              ],
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.w800,
                color: accentColor,
                letterSpacing: -0.5,
              ),
              decoration: InputDecoration(
                hintText: '0.00',
                hintStyle: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.w800,
                  color: accentColor.withOpacity(0.35),
                ),
                border: InputBorder.none,
                enabledBorder: InputBorder.none,
                focusedBorder: InputBorder.none,
                contentPadding: EdgeInsets.zero,
                isDense: true,
              ),
              onChanged: onChanged,
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Ingresa un monto válido';
                }
                final numVal = double.tryParse(value);
                if (numVal == null || numVal <= 0) {
                  return 'El monto debe ser mayor a 0';
                }
                return null;
              },
            ),
          ),
        ],
      ),
    );
  }
}

