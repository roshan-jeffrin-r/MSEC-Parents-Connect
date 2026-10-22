import 'dart:convert';
import 'dart:io';
import 'package:flutter/services.dart';
import '../models/student_data.dart';

class CalendarImportService {
  static const String localImportsDirPath =
      r'D:\Projects\Websites\MSEC Parent Connect imports';
  static const String assetCalendarPath = 'assets/data/msec_calendar.json';

  /// Loads college calendar events from local imports directory if accessible,
  /// otherwise seamlessly falls back to bundled asset.
  Future<List<CalendarEvent>> loadCalendarEvents() async {
    // 1. Try reading directly from local imports directory if running on desktop / sync mode
    try {
      final jsonFile = File('$localImportsDirPath\\msec_calendar.json');
      if (await jsonFile.exists()) {
        final content = await jsonFile.readAsString();
        final events = parseJson(content);
        if (events.isNotEmpty) return events;
      }

      final csvFile = File('$localImportsDirPath\\msec_calendar.csv');
      if (await csvFile.exists()) {
        final content = await csvFile.readAsString();
        final events = parseCsv(content);
        if (events.isNotEmpty) return events;
      }
    } catch (_) {
      // Running on mobile / sandbox where host D: drive is unavailable
    }

    // 2. Bundled fallback asset for standalone APK deployment
    try {
      final assetContent = await rootBundle.loadString(assetCalendarPath);
      return parseJson(assetContent);
    } catch (e) {
      // Fallback in-memory list if asset bundle hasn't loaded yet
      return _fallbackDefaultEvents();
    }
  }

  /// Parses JSON array of calendar event objects
  List<CalendarEvent> parseJson(String jsonString) {
    try {
      final List<dynamic> list = jsonDecode(jsonString) as List<dynamic>;
      return list
          .map((item) => CalendarEvent.fromJson(item as Map<String, dynamic>))
          .toList();
    } catch (e) {
      return [];
    }
  }

  /// Parses CSV format with header: date,title,type
  List<CalendarEvent> parseCsv(String csvString) {
    final List<CalendarEvent> events = [];
    final lines = csvString.trim().split(RegExp(r'\r?\n'));
    if (lines.length <= 1) return events;

    // Skip header line
    for (int i = 1; i < lines.length; i++) {
      final line = lines[i].trim();
      if (line.isEmpty) continue;

      // Handle simple CSV splitting
      final parts = line.split(',');
      if (parts.length >= 3) {
        try {
          final dateStr = parts[0].trim();
          final titleStr = parts[1].trim();
          final typeStr = parts[2].trim();

          events.add(CalendarEvent(
            date: DateTime.parse(dateStr),
            title: titleStr,
            type: CalendarEvent.parseType(typeStr),
          ));
        } catch (_) {
          continue;
        }
      }
    }
    return events;
  }

  /// Normalizes date to midnight for accurate TableCalendar day comparison
  static DateTime normalizeDate(DateTime date) {
    return DateTime(date.year, date.month, date.day);
  }

  /// Groups events into a Map keyed by normalized DateTime for TableCalendar
  static Map<DateTime, List<CalendarEvent>> groupEventsByDay(
      List<CalendarEvent> events) {
    final Map<DateTime, List<CalendarEvent>> map = {};
    for (final event in events) {
      final key = normalizeDate(event.date);
      if (!map.containsKey(key)) {
        map[key] = [];
      }
      map[key]!.add(event);
    }
    return map;
  }

  List<CalendarEvent> _fallbackDefaultEvents() {
    return [
      CalendarEvent(
        date: DateTime(2026, 10, 2),
        title: 'Gandhi Jayanthi (Govt Holiday)',
        type: CalendarEventType.leave,
      ),
      CalendarEvent(
        date: DateTime(2026, 10, 6),
        title: 'Student Absent (Medical Leave)',
        type: CalendarEventType.absent,
      ),
      CalendarEvent(
        date: DateTime(2026, 10, 9),
        title: 'Late Arrival at 8:46 AM (Traffic Delay)',
        type: CalendarEventType.late,
      ),
      CalendarEvent(
        date: DateTime(2026, 10, 14),
        title: 'Late Arrival at 8:52 AM • Afternoon: TechSymposium',
        type: CalendarEventType.late,
      ),
      CalendarEvent(
        date: DateTime(2026, 10, 19),
        title: 'Ayudha Pooja (College Holiday)',
        type: CalendarEventType.leave,
      ),
      CalendarEvent(
        date: DateTime(2026, 10, 21),
        title: 'Student Absent (Family Function)',
        type: CalendarEventType.absent,
      ),
      CalendarEvent(
        date: DateTime(2026, 10, 22),
        title: 'Campus Placement Drive (Zoho & Cognizant)',
        type: CalendarEventType.celebration,
      ),
      CalendarEvent(
        date: DateTime(2026, 10, 27),
        title: 'Annual Inter-College Cultural Fest "Tarang 2026"',
        type: CalendarEventType.celebration,
      ),
    ];
  }
}
