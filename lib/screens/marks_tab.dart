import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/student_data.dart';

class MarksTab extends StatefulWidget {
  const MarksTab({super.key});

  @override
  State<MarksTab> createState() => _MarksTabState();
}

class _MarksTabState extends State<MarksTab> {
  String _selectedSemester = 'Internal II';

  final List<String> _semesters = const [
    'Internal II',
    'Internal I',
    'Sem III',
    'Sem II',
    'Sem I',
  ];

  void _downloadMarksheetPdf(SemesterMarksheet marksheet) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: const Color(0xFF0F172A),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        content: Row(
          children: [
            const Icon(Icons.check_circle_rounded, color: Color(0xFF10B981), size: 18),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                'Official Grade Sheet (${marksheet.semesterId}) downloaded to device.',
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
            ),
          ],
        ),
        duration: const Duration(seconds: 2),
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

    final marksheet = mockMarksheets[_selectedSemester] ?? mockMarksheets.values.first;

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
                      'ACADEMIC PERFORMANCE & MARKS',
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.8,
                        color: navy,
                      ),
                    ),
                    Text(
                      'Autonomous Controller of Examinations (CoE)',
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
                    color: const Color(0xFFEFF6FF),
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: const Color(0xFFDBEAFE)),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.verified, size: 12, color: royalBlue),
                      const SizedBox(width: 4),
                      Text(
                        'Verified',
                        style: GoogleFonts.inter(
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                          color: royalBlue,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            const SizedBox(height: 14),

            // Horizontal Scrollable Semester Selector Pills (Flat, compact)
            SizedBox(
              height: 36,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: _semesters.length,
                separatorBuilder: (context, index) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final sem = _semesters[index];
                  final isSelected = sem == _selectedSemester;

                  return InkWell(
                    onTap: () {
                      setState(() => _selectedSemester = sem);
                    },
                    borderRadius: BorderRadius.circular(6),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 150),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: isSelected ? navy : Colors.white,
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(
                          color: isSelected ? navy : borderColor,
                        ),
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        sem,
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          fontWeight: isSelected ? FontWeight.w700 : FontWeight.w600,
                          color: isSelected ? Colors.white : slateDark,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 16),

            // Marksheet Header Strip (Flat container, 1px border)
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: borderColor),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          marksheet.title,
                          style: GoogleFonts.inter(
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                            color: navy,
                          ),
                        ),
                      ),
                      InkWell(
                        onTap: () => _downloadMarksheetPdf(marksheet),
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
                              const Icon(Icons.picture_as_pdf_outlined, size: 14, color: royalBlue),
                              const SizedBox(width: 4),
                              Text(
                                'PDF',
                                style: GoogleFonts.inter(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w700,
                                  color: slateDark,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  const Divider(height: 1, thickness: 1, color: borderColor),
                  const SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'GPA / GRADE POINT',
                            style: GoogleFonts.inter(
                              fontSize: 9,
                              fontWeight: FontWeight.w700,
                              color: slateMuted,
                              letterSpacing: 0.5,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Row(
                            children: [
                              Text(
                                '${marksheet.gpa}',
                                style: GoogleFonts.inter(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w800,
                                  color: royalBlue,
                                ),
                              ),
                              const SizedBox(width: 6),
                              Text(
                                '(${marksheet.totalMarks} / ${marksheet.maxMarks} marks)',
                                style: GoogleFonts.inter(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w500,
                                  color: slateMuted,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: const Color(0xFFECFDF5),
                          borderRadius: BorderRadius.circular(4),
                          border: Border.all(color: const Color(0xFFA7F3D0)),
                        ),
                        child: Text(
                          marksheet.resultStatus,
                          style: GoogleFonts.inter(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            color: const Color(0xFF065F46),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // High-Density Subject Performance Table (Flat, 1px hairlines)
            Text(
              'COURSE-WISE SCORES & GRADES',
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
                  // Table Column Header
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    child: Row(
                      children: [
                        Expanded(
                          flex: 5,
                          child: Text(
                            'Course / Subject',
                            style: GoogleFonts.inter(
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                              color: slateMuted,
                            ),
                          ),
                        ),
                        Expanded(
                          flex: 2,
                          child: Text(
                            'Score',
                            textAlign: TextAlign.center,
                            style: GoogleFonts.inter(
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                              color: slateMuted,
                            ),
                          ),
                        ),
                        Expanded(
                          flex: 2,
                          child: Text(
                            'Grade',
                            textAlign: TextAlign.center,
                            style: GoogleFonts.inter(
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                              color: slateMuted,
                            ),
                          ),
                        ),
                        Expanded(
                          flex: 2,
                          child: Text(
                            'Status',
                            textAlign: TextAlign.right,
                            style: GoogleFonts.inter(
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                              color: slateMuted,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Divider(height: 1, thickness: 1, color: borderColor),

                  // Subject Rows
                  ...List.generate(marksheet.subjects.length, (index) {
                    final sub = marksheet.subjects[index];
                    final isLast = index == marksheet.subjects.length - 1;

                    Color gradeBg;
                    Color gradeText;
                    if (sub.grade == 'O') {
                      gradeBg = const Color(0xFFEFF6FF);
                      gradeText = royalBlue;
                    } else if (sub.grade == 'A+') {
                      gradeBg = const Color(0xFFECFDF5);
                      gradeText = emeraldGreen;
                    } else {
                      gradeBg = const Color(0xFFF1F5F9);
                      gradeText = slateDark;
                    }

                    return Column(
                      children: [
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                          child: Row(
                            children: [
                              Expanded(
                                flex: 5,
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      sub.code,
                                      style: GoogleFonts.inter(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w700,
                                        color: navy,
                                      ),
                                    ),
                                    const SizedBox(height: 1),
                                    Text(
                                      sub.name,
                                      style: GoogleFonts.inter(
                                        fontSize: 11,
                                        color: slateDark,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    Text(
                                      '${sub.credits} Credits',
                                      style: GoogleFonts.inter(
                                        fontSize: 9,
                                        color: slateMuted,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Expanded(
                                flex: 2,
                                child: Text(
                                  '${sub.marks}/${sub.maxMarks}',
                                  textAlign: TextAlign.center,
                                  style: GoogleFonts.inter(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w700,
                                    color: navy,
                                  ),
                                ),
                              ),
                              Expanded(
                                flex: 2,
                                child: Center(
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: gradeBg,
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                    child: Text(
                                      sub.grade,
                                      style: GoogleFonts.inter(
                                        fontSize: 10,
                                        fontWeight: FontWeight.w700,
                                        color: gradeText,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                              Expanded(
                                flex: 2,
                                child: Text(
                                  'Pass',
                                  textAlign: TextAlign.right,
                                  style: GoogleFonts.inter(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    color: emeraldGreen,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        if (!isLast)
                          const Divider(height: 1, thickness: 1, color: borderColor),
                      ],
                    );
                  }),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Official Anna University Grading Scale Reference (Flat strip)
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: borderColor),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Anna University Autonomous Grading Standard',
                    style: GoogleFonts.inter(
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                      color: slateDark,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'O = Outstanding (91-100) • A+ = Excellent (81-90) • A = Very Good (71-80)\nMinimum Pass: 50% in End-Semester Exam & 50% in Aggregate.',
                    style: GoogleFonts.inter(
                      fontSize: 9,
                      color: slateMuted,
                      height: 1.35,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}

