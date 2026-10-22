import 'package:flutter_test/flutter_test.dart';
import 'package:msec_parent_connect/main.dart';

void main() {
  testWidgets('MSEC Parent Connect smoke test', (WidgetTester tester) async {
    // Build MSEC Parent App and trigger a frame.
    await tester.pumpWidget(const MsecParentApp());

    // Verify root widget renders
    expect(find.byType(MsecParentApp), findsOneWidget);
  });
}
