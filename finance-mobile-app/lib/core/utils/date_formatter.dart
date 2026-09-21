import 'package:intl/intl.dart';

class DateFormatter {
  static String formatFull(DateTime date) {
    return DateFormat('EEEE, d MMMM yyyy', 'es_ES').format(date);
  }

  static String formatShort(DateTime date) {
    return DateFormat('d MMM yyyy', 'es_ES').format(date);
  }

  static String formatTime(DateTime date) {
    return DateFormat('h:mm a').format(date);
  }

  static String formatRelative(DateTime date) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final targetDate = DateTime(date.year, date.month, date.day);

    final difference = today.difference(targetDate).inDays;

    if (difference == 0) {
      return 'Hoy';
    } else if (difference == 1) {
      return 'Ayer';
    } else if (difference == -1) {
      return 'Mañana';
    } else if (difference > 1 && difference < 7) {
      return 'Hace $difference días';
    } else {
      return formatShort(date);
    }
  }
}

