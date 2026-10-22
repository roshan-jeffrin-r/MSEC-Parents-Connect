# MSEC Parent Connect Workspace

This repository houses the mobile application codebase for **MSEC Parent Connect** (Meenakshi Sundararajan Engineering College Autonomous, Kodambakkam, Chennai).

---

## 📁 Workspace Structure

```
MSEC Parent Connect/
├── parent_app/                # Flutter Parent Connect Prototype Application
│   ├── lib/                   # Application source code (Screens, Models, Services, Widgets)
│   ├── assets/                # Local data assets (Calendar JSON, preserved graphics)
│   └── pubspec.yaml           # Flutter dependencies and asset configuration
├── msec_parent_connect/       # Flutter project container (with native Android/iOS runner scaffolds)
└── .gitignore                 # Workspace version control ignore rules
```

---

## 📱 Flutter Mobile Applications

### 1. `parent_app/` (Active Prototype Frontend)
- **Compact & Flat Aesthetic:** No heavy cards or drop shadows; crisp 1px hairlines and Inter typography.
- **Strict Exception Rule:** Only 3 summary cards on the entire app (Attendance Tab: Total Days, Absent, Late Coming).
- **Core Modules:**
  - **Login:** Phone & password authentication with 1-tap demo auto-fill (`9876543210` / `msec123`).
  - **Dashboard:** Live biometric status, academic metrics (89.1% attendance, 8.78 CGPA, 0 arrears), advisor details, and recent alert feed.
  - **Attendance:** Multi-event calendar with Anna University autonomous schedule integration, local file import sync, and expandable day details.
  - **Marks:** High-density semester marksheets, grade badges (`O`, `A+`, `A`), CoE verification, and PDF download action.
  - **Settings:** Push notification switches, linked parent account, and college helplines.

### Quick Run (`parent_app`):
```bash
cd parent_app
flutter pub get
flutter run
```

---

## 📂 External Data Directory
- Academic calendar import files (JSON/CSV) are stored in `"D:\Projects\Websites\MSEC Parent Connect imports"`. The application automatically syncs with this directory when available, or falls back to bundled assets for standalone builds.
