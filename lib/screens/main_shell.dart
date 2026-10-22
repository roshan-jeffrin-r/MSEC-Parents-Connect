import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/svg_icons.dart';
import 'dashboard_tab.dart';
import 'attendance_tab.dart';
import 'marks_tab.dart';
import 'settings_tab.dart';

class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _currentIndex = 0;

  final List<Widget> _tabs = const [
    DashboardTab(),
    AttendanceTab(),
    MarksTab(),
    SettingsTab(),
  ];

  final List<({String label, String svg})> _navItems = const [
    (label: 'Dashboard', svg: AppSvgIcons.dashboardSvg),
    (label: 'Attendance', svg: AppSvgIcons.attendanceSvg),
    (label: 'Marks', svg: AppSvgIcons.marksSvg),
    (label: 'Settings', svg: AppSvgIcons.settingsSvg),
  ];

  @override
  Widget build(BuildContext context) {
    const navy = Color(0xFF0F172A);
    const slateGrey = Color(0xFF64748B);
    const borderColor = Color(0xFFE5E7EB);

    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      body: SafeArea(
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 220),
          switchInCurve: Curves.easeOutCubic,
          switchOutCurve: Curves.easeInCubic,
          transitionBuilder: (Widget child, Animation<double> animation) {
            final slideAnimation = Tween<Offset>(
              begin: const Offset(0.0, 0.03),
              end: Offset.zero,
            ).animate(animation);

            return FadeTransition(
              opacity: animation,
              child: SlideTransition(
                position: slideAnimation,
                child: child,
              ),
            );
          },
          child: KeyedSubtree(
            key: ValueKey<int>(_currentIndex),
            child: _tabs[_currentIndex],
          ),
        ),
      ),
      bottomNavigationBar: Container(
        height: 60,
        decoration: const BoxDecoration(
          color: Colors.white,
          border: Border(
            top: BorderSide(color: borderColor, width: 1.0),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: List.generate(_navItems.length, (index) {
            final item = _navItems[index];
            final isActive = _currentIndex == index;

            return Expanded(
              child: InkWell(
                onTap: () {
                  if (_currentIndex != index) {
                    setState(() => _currentIndex = index);
                  }
                },
                highlightColor: Colors.transparent,
                splashColor: const Color(0xFFF1F5F9),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    AnimatedContainer(
                      duration: const Duration(milliseconds: 180),
                      curve: Curves.easeOutCubic,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 3,
                      ),
                      decoration: BoxDecoration(
                        color: isActive
                            ? const Color(0xFFF1F5F9)
                            : Colors.transparent,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: AppSvgIcons.icon(
                        item.svg,
                        color: isActive ? navy : slateGrey,
                        size: 20,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      item.label,
                      style: GoogleFonts.inter(
                        fontSize: 10,
                        fontWeight: isActive ? FontWeight.w700 : FontWeight.w500,
                        color: isActive ? navy : slateGrey,
                        letterSpacing: -0.1,
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
        ),
      ),
    );
  }
}
