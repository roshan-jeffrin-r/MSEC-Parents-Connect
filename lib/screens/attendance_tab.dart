import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:table_calendar/table_calendar.dart';
import '../models/student_data.dart';
import '../services/calendar_import_service.dart';

class AttendanceTab extends StatefulWidget {
  const AttendanceTab({super.key});

  @override
  State<AttendanceTab> createState() => _AttendanceTabState();
}

class _AttendanceTabState extends State<AttendanceTab> {
  final CalendarImportService _calendarService = CalendarImportService();
  Map<DateTime, List<CalendarEvent>> _eventsMap = {};
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _selectedDay = _focusedDay;
    _loadEvents();
  }

  Future<void> _loadEvents() async {
    setState(() => _isLoading = true);
    final events = await _calendarService.loadCalendarEvents();
    if (mounted) {
      setState(() {
        _eventsMap = CalendarImportService.groupEventsByDay(events);
        _isLoading = false;
      });
    }
  }

  List<CalendarEvent> _getEventsForDay(DateTime day) {
    final key = CalendarImportService.normalizeDate(day);
    return _eventsMap[key] ?? [];
  }

  @override
  Widget build(BuildContext context) {
    const navy = Color(0xFF0F172A);
    const royalBlue = Color(0xFF2563EB);
    const borderColor = Color(0xFFE5E7EB);
    const slateDark = Color(0xFF334155);
    const slateMuted = Color(0xFF64748B);
    const emeraldGreen = Color(0xFF10B981);
    const coralRed = Color(0xFFEF4444);
    const amberOrange = Color(0xFFF59E0B);
    const purpleHoliday = Color(0xFF8B5CF6);
    const pinkEvent = Color(0xFFEC4899);

    const summary = mockAttendanceSummary;
    final selectedEvents = _selectedDay != null ? _getEventsForDay(_selectedDay!) : <CalendarEvent>[];

    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
          children: [
            // Tab Title Bar
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'ATTENDANCE & CALENDAR',
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.8,
                        color: navy,
                      ),
                    ),
                    Text(
                      'Even Semester • Academic Year 2026-27',
                      style: GoogleFonts.inter(
                        fontSize: 10,
                        fontWeight: FontWeight.w500,
                        color: slateMuted,
                      ),
                    ),
                  ],
                ),
                InkWell(
                  onTap: _loadEvents,
                  borderRadius: BorderRadius.circular(6),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: borderColor),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.sync_rounded, size: 12, color: royalBlue),
                        const SizedBox(width: 4),
                        Text(
                          'Sync',
                          style: GoogleFonts.inter(
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                            color: slateDark,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 14),

            // THE 3 EXCEPTION SUMMARY CARDS (Top row of Attendance Tab)
            Row(
              children: [
                // 1. Total Days Card
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: borderColor),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'TOTAL DAYS',
                          style: GoogleFonts.inter(
                            fontSize: 9,
                            fontWeight: FontWeight.w700,
                            color: slateMuted,
                            letterSpacing: 0.5,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${summary.totalWorkingDays}',
                          style: GoogleFonts.inter(
                            fontSize: 20,
                            fontWeight: FontWeight.w800,
                            color: navy,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '${summary.presentDays} Present',
                          style: GoogleFonts.inter(
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                            color: emeraldGreen,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 8),

                // 2. Absent Card
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: borderColor),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'ABSENT',
                          style: GoogleFonts.inter(
                            fontSize: 9,
                            fontWeight: FontWeight.w700,
                            color: slateMuted,
                            letterSpacing: 0.5,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${summary.absentDays}',
                          style: GoogleFonts.inter(
                            fontSize: 20,
                            fontWeight: FontWeight.w800,
                            color: coralRed,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '${summary.absentPercentage}% rate',
                          style: GoogleFonts.inter(
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                            color: coralRed,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 8),

                // 3. Late Coming Card
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: borderColor),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'LATE COMING',
                          style: GoogleFonts.inter(
                            fontSize: 9,
                            fontWeight: FontWeight.w700,
                            color: slateMuted,
                            letterSpacing: 0.5,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${summary.lateDays}',
                          style: GoogleFonts.inter(
                            fontSize: 20,
                            fontWeight: FontWeight.w800,
                            color: amberOrange,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '${summary.latePercentage}% rate',
                          style: GoogleFonts.inter(
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                            color: amberOrange,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 16),

            // Flat Calendar Container (1px subtle border, no heavy drop shadows)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: borderColor),
              ),
              child: _isLoading
                  ? const Center(
                      child: Padding(
                        padding: EdgeInsets.all(32.0),
                        child: CircularProgressIndicator(strokeWidth: 2, color: royalBlue),
                      ),
                    )
                  : TableCalendar<CalendarEvent>(
                      firstDay: DateTime.utc(2025, 1, 1),
                      lastDay: DateTime.utc(2027, 12, 31),
                      focusedDay: _focusedDay,
                      selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
                      calendarFormat: CalendarFormat.month,
                      startingDayOfWeek: StartingDayOfWeek.monday,
                      rowHeight: 42,
                      eventLoader: _getEventsForDay,
                      onDaySelected: (selectedDay, focusedDay) {
                        setState(() {
                          _selectedDay = selectedDay;
                          _focusedDay = focusedDay;
                        });
                      },
                      onPageChanged: (focusedDay) {
                        setState(() {
                          _focusedDay = focusedDay;
                        });
                      },
                      headerStyle: HeaderStyle(
                        titleCentered: true,
                        formatButtonVisible: false,
                        titleTextStyle: GoogleFonts.inter(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: navy,
                        ),
                        leftChevronIcon: const Icon(Icons.chevron_left, size: 20, color: slateDark),
                        rightChevronIcon: const Icon(Icons.chevron_right, size: 20, color: slateDark),
                        headerPadding: const EdgeInsets.symmetric(vertical: 4),
                      ),
                      daysOfWeekStyle: DaysOfWeekStyle(
                        weekdayStyle: GoogleFonts.inter(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: slateMuted,
                        ),
                        weekendStyle: GoogleFonts.inter(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFF94A3B8),
                        ),
                      ),
                      calendarStyle: CalendarStyle(
                        outsideDaysVisible: false,
                        defaultTextStyle: GoogleFonts.inter(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: navy,
                        ),
                        weekendTextStyle: GoogleFonts.inter(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: slateMuted,
                        ),
                        todayDecoration: const BoxDecoration(
                          color: Color(0xFFE2E8F0),
                          shape: BoxShape.circle,
                        ),
                        todayTextStyle: GoogleFonts.inter(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: navy,
                        ),
                        selectedDecoration: const BoxDecoration(
                          color: navy,
                          shape: BoxShape.circle,
                        ),
                        selectedTextStyle: GoogleFonts.inter(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                        ),
                        markersMaxCount: 3,
                        markersAlignment: Alignment.bottomCenter,
                      ),
                      calendarBuilders: CalendarBuilders(
                        markerBuilder: (context, date, events) {
                          if (events.isEmpty) return null;
                          return Positioned(
                            bottom: 3,
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: events.take(3).map((event) {
                                return Container(
                                  margin: const EdgeInsets.symmetric(horizontal: 1.0),
                                  width: 5,
                                  height: 5,
                                  decoration: BoxDecoration(
                                    color: event.color,
                                    shape: BoxShape.circle,
                                  ),
                                );
                              }).toList(),
                            ),
                          );
                        },
                      ),
                    ),
            ),

            const SizedBox(height: 12),

            // Compact Calendar Legend Wrap (Flat row)
            Wrap(
              spacing: 12,
              runSpacing: 6,
              children: [
                _buildLegendItem(coralRed, 'Absent'),
                _buildLegendItem(amberOrange, 'Late Arrival'),
                _buildLegendItem(purpleHoliday, 'College Holiday'),
                _buildLegendItem(pinkEvent, 'Campus Event'),
                _buildLegendItem(emeraldGreen, 'Present'),
              ],
            ),

            const SizedBox(height: 16),

            // Selected Day Details Header & Flat Stream
            if (_selectedDay != null) ...[
              Text(
                'SELECTED DATE DETAILS',
                style: GoogleFonts.inter(
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.8,
                  color: slateMuted,
                ),
              ),
              const SizedBox(height: 6),

              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: borderColor),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Date Title Row
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            DateFormat('EEEE, d MMMM yyyy').format(_selectedDay!),
                            style: GoogleFonts.inter(
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                              color: navy,
                            ),
                          ),
                          Text(
                            isSameDay(_selectedDay, DateTime.now()) ? 'Today' : '',
                            style: GoogleFonts.inter(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: royalBlue,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const Divider(height: 1, thickness: 1, color: borderColor),

                    // Events or Regular Day Status
                    if (selectedEvents.isNotEmpty)
                      ...List.generate(selectedEvents.length, (i) {
                        final event = selectedEvents[i];
                        final isLast = i == selectedEvents.length - 1;

                        return Column(
                          children: [
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Padding(
                                    padding: const EdgeInsets.only(top: 3.0),
                                    child: Container(
                                      width: 8,
                                      height: 8,
                                      decoration: BoxDecoration(
                                        color: event.color,
                                        shape: BoxShape.circle,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 10),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          event.title,
                                          style: GoogleFonts.inter(
                                            fontSize: 12,
                                            fontWeight: FontWeight.w700,
                                            color: navy,
                                          ),
                                        ),
                                        const SizedBox(height: 2),
                                        Text(
                                          event.label,
                                          style: GoogleFonts.inter(
                                            fontSize: 11,
                                            fontWeight: FontWeight.w500,
                                            color: slateMuted,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            if (!isLast)
                              const Divider(height: 1, thickness: 1, color: borderColor),
                          ],
                        );
                      })
                    else
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        child: _buildDefaultDayMessage(_selectedDay!),
                      ),
                  ],
                ),
              ),
            ],

            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildLegendItem(Color color, String label) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 7,
          height: 7,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
        const SizedBox(width: 4),
        Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 10,
            fontWeight: FontWeight.w600,
            color: const Color(0xFF475569),
          ),
        ),
      ],
    );
  }

  Widget _buildDefaultDayMessage(DateTime day) {
    const navy = Color(0xFF0F172A);
    const slateMuted = Color(0xFF64748B);
    const emeraldGreen = Color(0xFF10B981);

    final isWeekend = day.weekday == DateTime.saturday || day.weekday == DateTime.sunday;
    final isFuture = day.isAfter(DateTime.now());

    if (isWeekend) {
      return Row(
        children: [
          const Icon(Icons.weekend_outlined, size: 16, color: slateMuted),
          const SizedBox(width: 8),
          Text(
            'Weekend • No college instructional hours',
            style: GoogleFonts.inter(fontSize: 12, color: slateMuted),
          ),
        ],
      );
    }

    if (isFuture) {
      return Row(
        children: [
          const Icon(Icons.schedule_outlined, size: 16, color: slateMuted),
          const SizedBox(width: 8),
          Text(
            'Upcoming scheduled academic working day (8:30 AM - 4:15 PM)',
            style: GoogleFonts.inter(fontSize: 12, color: slateMuted),
          ),
        ],
      );
    }

    return Row(
      children: [
        const Icon(Icons.check_circle_outline, size: 16, color: emeraldGreen),
        const SizedBox(width: 8),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Marked Present • Full Day Attended',
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: navy,
                ),
              ),
              Text(
                'Periods 1 to 6 verified by CSE Faculty Advisors.',
                style: GoogleFonts.inter(
                  fontSize: 11,
                  color: slateMuted,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
