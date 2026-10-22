import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/student_data.dart';
import 'login_screen.dart';

class SettingsTab extends StatefulWidget {
  const SettingsTab({super.key});

  @override
  State<SettingsTab> createState() => _SettingsTabState();
}

class _SettingsTabState extends State<SettingsTab> {
  bool _absentAlerts = true;
  bool _lateAlerts = true;
  bool _marksheetAlerts = true;
  bool _smsMirroring = true;

  void _showUpdateDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        title: Text(
          'MSEC Parent Connect',
          style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w700),
        ),
        content: Text(
          'Version 1.0.0 (Build 2026.10)\n\nYou have the latest academic release installed. No updates available at this time.',
          style: GoogleFonts.inter(fontSize: 12, height: 1.4, color: const Color(0xFF475569)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              'Close',
              style: GoogleFonts.inter(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: const Color(0xFF2563EB),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _confirmSignOut() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        title: Text(
          'Sign Out?',
          style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w700),
        ),
        content: Text(
          'Are you sure you want to sign out of the MSEC Parent Portal? You will need to re-enter your registered mobile number.',
          style: GoogleFonts.inter(fontSize: 12, height: 1.4, color: const Color(0xFF475569)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              'Cancel',
              style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: const Color(0xFF64748B)),
            ),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              Navigator.of(context).pushAndRemoveUntil(
                PageRouteBuilder(
                  transitionDuration: const Duration(milliseconds: 250),
                  pageBuilder: (_, animation, secondaryAnimation) => FadeTransition(
                    opacity: animation,
                    child: const LoginScreen(),
                  ),
                ),
                (route) => false,
              );
            },
            child: Text(
              'Sign Out',
              style: GoogleFonts.inter(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: const Color(0xFFEF4444),
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    const navy = Color(0xFF0F172A);
    const royalBlue = Color(0xFF2563EB);
    const borderColor = Color(0xFFE5E7EB);
    const slateDark = Color(0xFF334155);
    const slateMuted = Color(0xFF64748B);
    const emeraldGreen = Color(0xFF10B981);

    const profile = mockStudentProfile;

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
                      'SETTINGS & PREFERENCES',
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.8,
                        color: navy,
                      ),
                    ),
                    Text(
                      'Account, alert channels, and institutional support',
                      style: GoogleFonts.inter(
                        fontSize: 10,
                        fontWeight: FontWeight.w500,
                        color: slateMuted,
                      ),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFECFDF5),
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: const Color(0xFFA7F3D0)),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 6,
                        height: 6,
                        decoration: const BoxDecoration(
                          color: emeraldGreen,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        'Push Active',
                        style: GoogleFonts.inter(
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                          color: const Color(0xFF065F46),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            const SizedBox(height: 16),

            // Group 1: Notification & Alert Preferences
            Text(
              'ALERT & NOTIFICATION CHANNELS',
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
                children: [
                  _buildSwitchTile(
                    title: 'Student Absence Alerts',
                    subtitle: 'Immediate push notification if absent during Period 1 roll-call.',
                    value: _absentAlerts,
                    onChanged: (val) => setState(() => _absentAlerts = val),
                    activeColor: royalBlue,
                  ),
                  const Divider(height: 1, thickness: 1, color: borderColor),
                  _buildSwitchTile(
                    title: 'Late Arrival Alerts',
                    subtitle: 'Notification when student clocks in after 8:40 AM.',
                    value: _lateAlerts,
                    onChanged: (val) => setState(() => _lateAlerts = val),
                    activeColor: royalBlue,
                  ),
                  const Divider(height: 1, thickness: 1, color: borderColor),
                  _buildSwitchTile(
                    title: 'Marksheet & Exam Results',
                    subtitle: 'Notify immediately when autonomous marks are published.',
                    value: _marksheetAlerts,
                    onChanged: (val) => setState(() => _marksheetAlerts = val),
                    activeColor: royalBlue,
                  ),
                  const Divider(height: 1, thickness: 1, color: borderColor),
                  _buildSwitchTile(
                    title: 'SMS Alert Mirroring',
                    subtitle: 'Mirror critical notifications to registered mobile number via SMS.',
                    value: _smsMirroring,
                    onChanged: (val) => setState(() => _smsMirroring = val),
                    activeColor: royalBlue,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 18),

            // Group 2: Account & Ward Identity
            Text(
              'LINKED PARENT ACCOUNT & WARD',
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
                children: [
                  _buildInfoTile('Parent / Guardian Name', profile.parentName),
                  const Divider(height: 1, thickness: 1, color: borderColor),
                  _buildInfoTile('Registered Mobile', profile.parentPhone),
                  const Divider(height: 1, thickness: 1, color: borderColor),
                  _buildInfoTile('Ward (Student)', '${profile.name} (${profile.registerNumber})'),
                  const Divider(height: 1, thickness: 1, color: borderColor),
                  _buildInfoTile('Department & Batch', '${profile.department} • ${profile.batch}'),
                ],
              ),
            ),

            const SizedBox(height: 18),

            // Group 3: College Helplines & Support
            Text(
              'COLLEGE HELPLINE & OFFICE',
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
                children: [
                  _buildInfoTile('College Office Direct', '+91 44 2480 1636 / 2480 2524'),
                  const Divider(height: 1, thickness: 1, color: borderColor),
                  _buildInfoTile('Academic Email', 'parentconnect@msec.edu.in'),
                  const Divider(height: 1, thickness: 1, color: borderColor),
                  _buildInfoTile('Campus Address', 'Arcot Road, Kodambakkam, Chennai - 600024'),
                ],
              ),
            ),

            const SizedBox(height: 18),

            // Group 4: App Details & Sign Out
            Text(
              'SYSTEM & SESSION',
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
                children: [
                  InkWell(
                    onTap: _showUpdateDialog,
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Check for App Updates',
                                style: GoogleFonts.inter(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: slateDark,
                                ),
                              ),
                              Text(
                                'Current version: v1.0.0 (Release Build)',
                                style: GoogleFonts.inter(
                                  fontSize: 11,
                                  color: slateMuted,
                                ),
                              ),
                            ],
                          ),
                          const Icon(Icons.chevron_right, size: 18, color: slateMuted),
                        ],
                      ),
                    ),
                  ),
                  const Divider(height: 1, thickness: 1, color: borderColor),
                  InkWell(
                    onTap: _confirmSignOut,
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 13),
                      child: Row(
                        children: [
                          const Icon(Icons.logout, size: 16, color: Color(0xFFEF4444)),
                          const SizedBox(width: 10),
                          Text(
                            'Sign Out from Account',
                            style: GoogleFonts.inter(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: const Color(0xFFEF4444),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 28),

            Center(
              child: Text(
                'Meenakshi Sundararajan Engineering College\n© 2026 MSEC Autonomous • All Rights Reserved',
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(
                  fontSize: 10,
                  color: const Color(0xFF94A3B8),
                  height: 1.4,
                ),
              ),
            ),

            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildSwitchTile({
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
    required Color activeColor,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: const Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 1),
                Text(
                  subtitle,
                  style: GoogleFonts.inter(
                    fontSize: 10,
                    color: const Color(0xFF64748B),
                    height: 1.3,
                  ),
                ),
              ],
            ),
          ),
          Switch.adaptive(
            value: value,
            onChanged: onChanged,
            activeTrackColor: activeColor,
          ),
        ],
      ),
    );
  }

  Widget _buildInfoTile(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: GoogleFonts.inter(
              fontSize: 11,
              fontWeight: FontWeight.w500,
              color: const Color(0xFF64748B),
            ),
          ),
          const SizedBox(width: 12),
          Flexible(
            child: Text(
              value,
              textAlign: TextAlign.right,
              style: GoogleFonts.inter(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: const Color(0xFF0F172A),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
