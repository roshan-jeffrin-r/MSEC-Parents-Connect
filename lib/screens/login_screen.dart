import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'main_shell.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen>
    with SingleTickerProviderStateMixin {
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  bool _isLoading = false;
  String? _errorMessage;
  double _buttonScale = 1.0;

  @override
  void dispose() {
    _phoneController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleLogin() async {
    final phone = _phoneController.text.trim().replaceAll(RegExp(r'\D'), '');
    final password = _passwordController.text.trim();

    setState(() {
      _errorMessage = null;
    });

    if (phone.isEmpty || phone.length < 10) {
      setState(() {
        _errorMessage = 'Please enter a valid 10-digit registered mobile number.';
      });
      return;
    }

    if (password.isEmpty) {
      setState(() {
        _errorMessage = 'Please enter your portal password.';
      });
      return;
    }

    setState(() => _isLoading = true);

    // Simulate snappy network verification (300ms)
    await Future.delayed(const Duration(milliseconds: 350));

    if (!mounted) return;

    // Accept demo credentials or any 10-digit phone
    if ((phone == '9876543210' && password == 'msec123') || password.isNotEmpty) {
      Navigator.of(context).pushReplacement(
        PageRouteBuilder(
          transitionDuration: const Duration(milliseconds: 350),
          pageBuilder: (_, animation, secondaryAnimation) => FadeTransition(
            opacity: animation,
            child: const MainShell(),
          ),
        ),
      );
    } else {
      setState(() {
        _isLoading = false;
        _errorMessage = 'Invalid credentials. Demo: 9876543210 / msec123';
      });
    }
  }

  void _quickFillDemo() {
    setState(() {
      _phoneController.text = '9876543210';
      _passwordController.text = 'msec123';
      _errorMessage = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    const navy = Color(0xFF0F172A);
    const royalBlue = Color(0xFF2563EB);
    const borderColor = Color(0xFFE5E7EB);

    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 28.0, vertical: 24.0),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 400),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // MSEC Minimalist Emblem / Header (No Box, Pure Typography & Whitespace)
                  Center(
                    child: Container(
                      width: 56,
                      height: 56,
                      decoration: BoxDecoration(
                        color: navy,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Center(
                        child: Text(
                          'M',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 28,
                            fontWeight: FontWeight.w900,
                            letterSpacing: -1,
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    'MSEC PARENT CONNECT',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 1.2,
                      color: navy,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Meenakshi Sundararajan Engineering College\nAutonomous • Kodambakkam, Chennai',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                      color: const Color(0xFF64748B),
                      height: 1.35,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Center(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                      decoration: BoxDecoration(
                        color: const Color(0xFFEFF6FF),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFFBFDBFE)),
                      ),
                      child: Text(
                        'Parent Portal v1.0',
                        style: GoogleFonts.inter(
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                          color: royalBlue,
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 36),

                  // Flat Borderless Form Inputs
                  Text(
                    'Parent Mobile Number',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFF334155),
                    ),
                  ),
                  const SizedBox(height: 6),
                  Container(
                    height: 48,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: borderColor),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          alignment: Alignment.center,
                          child: Text(
                            '+91',
                            style: GoogleFonts.inter(
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              color: const Color(0xFF475569),
                            ),
                          ),
                        ),
                        Container(width: 1, height: 24, color: borderColor),
                        Expanded(
                          child: TextField(
                            controller: _phoneController,
                            keyboardType: TextInputType.phone,
                            maxLength: 10,
                            style: GoogleFonts.inter(
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              color: navy,
                            ),
                            decoration: InputDecoration(
                              counterText: '',
                              hintText: 'Enter 10-digit number',
                              hintStyle: GoogleFonts.inter(
                                fontSize: 13,
                                color: const Color(0xFF94A3B8),
                              ),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 12),
                              border: InputBorder.none,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 18),

                  Text(
                    'Portal Password',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFF334155),
                    ),
                  ),
                  const SizedBox(height: 6),
                  Container(
                    height: 48,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: borderColor),
                    ),
                    child: TextField(
                      controller: _passwordController,
                      obscureText: _obscurePassword,
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: navy,
                      ),
                      decoration: InputDecoration(
                        hintText: 'Enter student DOB / password',
                        hintStyle: GoogleFonts.inter(
                          fontSize: 13,
                          color: const Color(0xFF94A3B8),
                        ),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                        border: InputBorder.none,
                        suffixIcon: IconButton(
                          icon: Icon(
                            _obscurePassword ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                            size: 18,
                            color: const Color(0xFF64748B),
                          ),
                          onPressed: () {
                            setState(() {
                              _obscurePassword = !_obscurePassword;
                            });
                          },
                        ),
                      ),
                    ),
                  ),

                  if (_errorMessage != null) ...[
                    const SizedBox(height: 12),
                    Text(
                      _errorMessage!,
                      style: GoogleFonts.inter(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: const Color(0xFFEF4444),
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],

                  const SizedBox(height: 24),

                  // Full-Width Primary Button with subtle press-scale animation
                  GestureDetector(
                    onTapDown: (_) => setState(() => _buttonScale = 0.98),
                    onTapUp: (_) => setState(() => _buttonScale = 1.0),
                    onTapCancel: () => setState(() => _buttonScale = 1.0),
                    onTap: _isLoading ? null : _handleLogin,
                    child: AnimatedScale(
                      scale: _buttonScale,
                      duration: const Duration(milliseconds: 100),
                      child: Container(
                        height: 48,
                        decoration: BoxDecoration(
                          color: navy,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        alignment: Alignment.center,
                        child: _isLoading
                            ? const SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  color: Colors.white,
                                ),
                              )
                            : Text(
                                'Sign In to Portal',
                                style: GoogleFonts.inter(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w700,
                                  color: Colors.white,
                                  letterSpacing: 0.3,
                                ),
                              ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Demo Credentials Quick Fill Pill
                  Center(
                    child: InkWell(
                      onTap: _quickFillDemo,
                      borderRadius: BorderRadius.circular(8),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(
                              Icons.bolt_rounded,
                              size: 14,
                              color: Color(0xFFF59E0B),
                            ),
                            const SizedBox(width: 4),
                            Flexible(
                              child: Text(
                                'Auto-Fill Demo: 9876543210 / msec123',
                                overflow: TextOverflow.ellipsis,
                                style: GoogleFonts.inter(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                  color: const Color(0xFF64748B),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 28),

                  // Institutional Help Footnote
                  Center(
                    child: Text(
                      'For mobile number updates, please contact the MSEC College Office or your ward’s Class Advisor.',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.inter(
                        fontSize: 10,
                        color: const Color(0xFF94A3B8),
                        height: 1.4,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
