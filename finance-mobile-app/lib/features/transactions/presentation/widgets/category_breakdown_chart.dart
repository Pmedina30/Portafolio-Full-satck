import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import '../../../../core/utils/currency_formatter.dart';
import '../../domain/entities/category.dart';

class CategoryBreakdownChart extends StatefulWidget {
  final Map<Category, double> expensesByCategory;
  final String currency;

  const CategoryBreakdownChart({
    super.key,
    required this.expensesByCategory,
    required this.currency,
  });

  @override
  State<CategoryBreakdownChart> createState() => _CategoryBreakdownChartState();
}

class _CategoryBreakdownChartState extends State<CategoryBreakdownChart> {
  int touchedIndex = -1;

  @override
  Widget build(BuildContext context) {
    if (widget.expensesByCategory.isEmpty) {
      return Container(
        height: 180,
        alignment: Alignment.center,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.pie_chart_outline_rounded, size: 48, color: Colors.grey.withOpacity(0.5)),
            const SizedBox(height: 8),
            Text(
              'No hay gastos registrados este mes',
              style: TextStyle(color: Colors.grey.shade500, fontSize: 13),
            ),
          ],
        ),
      );
    }

    final total = widget.expensesByCategory.values.fold(0.0, (a, b) => a + b);
    final entries = widget.expensesByCategory.entries.toList();

    return Column(
      children: [
        SizedBox(
          height: 190,
          child: PieChart(
            PieChartData(
              pieTouchData: PieTouchData(
                touchCallback: (FlTouchEvent event, pieTouchResponse) {
                  setState(() {
                    if (!event.isInterestedForInteractions ||
                        pieTouchResponse == null ||
                        pieTouchResponse.touchedSection == null) {
                      touchedIndex = -1;
                      return;
                    }
                    touchedIndex = pieTouchResponse.touchedSection!.touchedSectionIndex;
                  });
                },
              ),
              borderData: FlBorderData(show: false),
              sectionsSpace: 3,
              centerSpaceRadius: 46,
              sections: List.generate(entries.length, (i) {
                final isTouched = i == touchedIndex;
                final entry = entries[i];
                final percentage = (entry.value / total) * 100;
                final radius = isTouched ? 42.0 : 34.0;

                return PieChartSectionData(
                  color: entry.key.color,
                  value: entry.value,
                  title: isTouched ? '${percentage.toStringAsFixed(1)}%' : '',
                  radius: radius,
                  titleStyle: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                );
              }),
            ),
          ),
        ),
        const SizedBox(height: 12),
        // Mini Legend
        Wrap(
          spacing: 12,
          runSpacing: 8,
          alignment: WrapAlignment.center,
          children: entries.take(4).map((e) {
            final pct = ((e.value / total) * 100).toStringAsFixed(0);
            return Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: e.key.color,
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 6),
                Text(
                  '${e.key.name} ($pct%)',
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w500),
                ),
              ],
            );
          }).toList(),
        ),
      ],
    );
  }
}
