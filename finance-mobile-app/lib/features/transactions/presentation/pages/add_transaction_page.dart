import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:uuid/uuid.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/utils/date_formatter.dart';
import '../../../settings/presentation/cubit/settings_cubit.dart';
import '../../domain/entities/category.dart';
import '../../domain/entities/payment_method.dart';
import '../../domain/entities/transaction.dart';
import '../../domain/entities/transaction_type.dart';
import '../bloc/transaction_bloc.dart';
import '../bloc/transaction_event.dart';
import '../bloc/transaction_state.dart';
import '../widgets/category_grid_selector.dart';
import '../widgets/currency_amount_input.dart';

class AddTransactionPage extends StatefulWidget {
  const AddTransactionPage({super.key});

  @override
  State<AddTransactionPage> createState() => _AddTransactionPageState();
}

class _AddTransactionPageState extends State<AddTransactionPage> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _amountController = TextEditingController();
  final _noteController = TextEditingController();

  TransactionType _selectedType = TransactionType.expense;
  Category? _selectedCategory;
  DateTime _selectedDate = DateTime.now();
  PaymentMethod _selectedPaymentMethod = PaymentMethod.cash;

  @override
  void dispose() {
    _titleController.dispose();
    _amountController.dispose();
    _noteController.dispose();
    super.dispose();
  }

  Future<void> _pickDateTime() async {
    final pickedDate = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2020),
      lastDate: DateTime(2030),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: ColorScheme.fromSeed(
              seedColor: AppTheme.primaryColor,
              brightness: Theme.of(context).brightness,
            ),
          ),
          child: child!,
        );
      },
    );

    if (pickedDate != null && mounted) {
      final pickedTime = await showTimePicker(
        context: context,
        initialTime: TimeOfDay.fromDateTime(_selectedDate),
      );

      setState(() {
        final time = pickedTime ?? TimeOfDay.fromDateTime(_selectedDate);
        _selectedDate = DateTime(
          pickedDate.year,
          pickedDate.month,
          pickedDate.day,
          time.hour,
          time.minute,
        );
      });
    }
  }

  void _submitForm() {
    if (!_formKey.currentState!.validate()) return;

    if (_selectedCategory == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Por favor selecciona una categoría'),
          backgroundColor: AppTheme.expenseColor,
        ),
      );
      return;
    }

    final amount = double.parse(_amountController.text.trim());
    final newTransaction = Transaction(
      id: const Uuid().v4(),
      title: _titleController.text.trim(),
      amount: amount,
      type: _selectedType,
      category: _selectedCategory!,
      date: _selectedDate,
      note: _noteController.text.trim().isEmpty ? null : _noteController.text.trim(),
      paymentMethod: _selectedPaymentMethod,
    );

    context.read<TransactionBloc>().add(AddTransactionEvent(newTransaction));
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final currency = context.watch<SettingsCubit>().state.currency;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Registrar Transacción'),
        leading: IconButton(
          icon: const Icon(Icons.close_rounded),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: BlocBuilder<TransactionBloc, TransactionState>(
        builder: (context, state) {
          final availableCategories = state.categories
              .where((c) => c.type == _selectedType)
              .toList();

          // Auto-select first category if current is null or type mismatched
          if (_selectedCategory == null || _selectedCategory!.type != _selectedType) {
            if (availableCategories.isNotEmpty) {
              _selectedCategory = availableCategories.first;
            }
          }

          return Form(
            key: _formKey,
            child: ListView(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              children: [
                // 1. Transaction Type Toggle (Ingreso / Gasto)
                Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF27272A) : const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: _TypeToggleButton(
                          title: 'Gasto',
                          icon: Icons.arrow_upward_rounded,
                          isSelected: _selectedType.isExpense,
                          activeColor: AppTheme.expenseColor,
                          onTap: () {
                            setState(() {
                              _selectedType = TransactionType.expense;
                            });
                          },
                        ),
                      ),
                      Expanded(
                        child: _TypeToggleButton(
                          title: 'Ingreso',
                          icon: Icons.arrow_downward_rounded,
                          isSelected: _selectedType.isIncome,
                          activeColor: AppTheme.incomeColor,
                          onTap: () {
                            setState(() {
                              _selectedType = TransactionType.income;
                            });
                          },
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // 2. Amount Input
                CurrencyAmountInput(
                  controller: _amountController,
                  currency: currency,
                  type: _selectedType,
                ),

                const SizedBox(height: 24),

                // 3. Title / Concept
                const Text(
                  'Título / Concepto',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _titleController,
                  decoration: InputDecoration(
                    hintText: _selectedType.isExpense
                        ? 'Ej: Compra en supermercado'
                        : 'Ej: Salario quincenal',
                    prefixIcon: const Icon(Icons.edit_note_rounded, size: 22),
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Por favor ingresa un título';
                    }
                    return null;
                  },
                ),

                const SizedBox(height: 24),

                // 4. Category Visual Selector
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Categoría',
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700),
                    ),
                    Text(
                      _selectedCategory?.name ?? '',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: _selectedCategory?.color ?? AppTheme.primaryColor,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                CategoryGridSelector(
                  categories: availableCategories,
                  selectedCategory: _selectedCategory,
                  onCategorySelected: (cat) {
                    setState(() {
                      _selectedCategory = cat;
                    });
                  },
                ),

                const SizedBox(height: 24),

                // 5. Date & Time Picker Row
                const Text(
                  'Fecha y Hora',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 8),
                InkWell(
                  onTap: _pickDateTime,
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    decoration: BoxDecoration(
                      color: Theme.of(context).cardColor,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isDark ? const Color(0xFF27272A) : const Color(0xFFE2E8F0),
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.calendar_month_rounded, size: 20, color: AppTheme.primaryColor),
                            const SizedBox(width: 12),
                            Text(
                              DateFormatter.formatFull(_selectedDate),
                              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                        Text(
                          DateFormatter.formatTime(_selectedDate),
                          style: TextStyle(fontSize: 13, color: Colors.grey.shade500),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // 6. Payment Method
                const Text(
                  'Método de Pago',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 10,
                  children: PaymentMethod.values.map((method) {
                    final isSelected = _selectedPaymentMethod == method;
                    return ChoiceChip(
                      label: Text(method.displayName),
                      selected: isSelected,
                      selectedColor: AppTheme.primaryColor.withOpacity(0.18),
                      side: BorderSide(
                        color: isSelected ? AppTheme.primaryColor : Colors.transparent,
                      ),
                      onSelected: (selected) {
                        if (selected) {
                          setState(() {
                            _selectedPaymentMethod = method;
                          });
                        }
                      },
                    );
                  }).toList(),
                ),

                const SizedBox(height: 24),

                // 7. Optional Notes
                const Text(
                  'Nota adicional (Opcional)',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _noteController,
                  maxLines: 2,
                  decoration: const InputDecoration(
                    hintText: 'Detalles adicionales, número de recibo...',
                    alignLabelWithHint: true,
                  ),
                ),

                const SizedBox(height: 36),

                // Submit Button
                ElevatedButton.icon(
                  onPressed: _submitForm,
                  icon: const Icon(Icons.check_circle_outline_rounded),
                  label: const Text('Guardar Transacción'),
                ),

                const SizedBox(height: 40),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _TypeToggleButton extends StatelessWidget {
  final String title;
  final IconData icon;
  final bool isSelected;
  final Color activeColor;
  final VoidCallback onTap;

  const _TypeToggleButton({
    required this.title,
    required this.icon,
    required this.isSelected,
    required this.activeColor,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? activeColor : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: activeColor.withOpacity(0.35),
                    blurRadius: 8,
                    offset: const Offset(0, 3),
                  )
                ]
              : null,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 18,
              color: isSelected ? Colors.white : Colors.grey.shade500,
            ),
            const SizedBox(width: 8),
            Text(
              title,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 14,
                color: isSelected ? Colors.white : Colors.grey.shade500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
