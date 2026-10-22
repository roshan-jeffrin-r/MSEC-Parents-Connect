import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class AppSvgIcons {
  // 1. Dashboard Icon (Academic Home / Cap Silhouette)
  static const String dashboardSvg = '''
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
  <polyline points="9 22 9 12 15 12 15 22"/>
</svg>
''';

  // 2. Attendance Icon (Calendar with Checkmark)
  static const String attendanceSvg = '''
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
  <line x1="16" y1="2" x2="16" y2="6"/>
  <line x1="8" y1="2" x2="8" y2="6"/>
  <line x1="3" y1="10" x2="21" y2="10"/>
  <path d="M9 16l2 2 4-4"/>
</svg>
''';

  // 3. Marks Icon (Academic Transcript / Medal Ribbon)
  static const String marksSvg = '''
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
  <polyline points="14 2 14 8 20 8"/>
  <line x1="16" y1="13" x2="8" y2="13"/>
  <line x1="16" y1="17" x2="8" y2="17"/>
  <polyline points="10 9 9 9 8 9"/>
</svg>
''';

  // 4. Settings Icon (Sliders / Preferences Controls)
  static const String settingsSvg = '''
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="4" y1="21" x2="4" y2="14"/>
  <line x1="4" y1="10" x2="4" y2="3"/>
  <line x1="12" y1="21" x2="12" y2="12"/>
  <line x1="12" y1="8" x2="12" y2="3"/>
  <line x1="20" y1="21" x2="20" y2="16"/>
  <line x1="20" y1="12" x2="20" y2="3"/>
  <line x1="1" y1="14" x2="7" y2="14"/>
  <line x1="9" y1="8" x2="15" y2="8"/>
  <line x1="17" y1="16" x2="23" y2="16"/>
</svg>
''';

  static Widget icon(String svgString, {Color color = Colors.black, double size = 22}) {
    return SvgPicture.string(
      svgString,
      width: size,
      height: size,
      colorFilter: ColorFilter.mode(color, BlendMode.srcIn),
    );
  }
}
