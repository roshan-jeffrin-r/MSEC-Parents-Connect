import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'screens/login_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  // Configure clean edge-to-edge system chrome
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      statusBarBrightness: Brightness.light,
      systemNavigationBarColor: Colors.white,
      systemNavigationBarIconBrightness: Brightness.dark,
      systemNavigationBarDividerColor: Color(0xFFE5E7EB),
    ),
  );

  runApp(const MsecParentApp());
}

class MsecParentApp extends StatelessWidget {
  const MsecParentApp({super.key});

  @override
  Widget build(BuildContext context) {
    const navy = Color(0xFF0F172A);
    const royalBlue = Color(0xFF2563EB);
    const backgroundColor = Color(0xFFF9FAFB);

    return MaterialApp(
      title: 'MSEC Parent Connect',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: backgroundColor,
        primaryColor: navy,
        colorScheme: ColorScheme.fromSeed(
          seedColor: navy,
          primary: navy,
          secondary: royalBlue,
          surface: Colors.white,
        ),
        textTheme: GoogleFonts.interTextTheme(
          Theme.of(context).textTheme,
        ),
        appBarTheme: const AppBarTheme(
          elevation: 0,
          scrolledUnderElevation: 0,
          backgroundColor: Colors.transparent,
          systemOverlayStyle: SystemUiOverlayStyle.dark,
        ),
        dividerTheme: const DividerThemeData(
          color: Color(0xFFE5E7EB),
          thickness: 1,
          space: 1,
        ),
        splashFactory: InkRipple.splashFactory,
      ),
      home: const LoginScreen(),
    );
  }
}
