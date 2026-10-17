# Lumina Parent Connect — MSEC Parent Portal Prototype

[![React 19](https://img.shields.io/badge/React-19.x-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/Status-Independent%20Prototype-amber.svg)]()

> **Lumina Parent Connect** is a modern, responsive, professional web application designed to simplify communication between **Meenakshi Sundararajan Engineering College (Autonomous)** and parents. It provides rapid, transparent access to student academic performance, daily attendance records, late-arrival alerts, digital report cards, and leave application workflows.

---

## 1. Project Overview & Prototype Purpose

The project is built as an independent, high-fidelity functional prototype to demonstrate to college faculty members on **October 21, 2026**. While the college already operates an academic system for report cards, Lumina Parent Connect focuses on making the parent experience significantly simpler, faster, more accessible, and mobile-friendly.

> [!NOTE]
> **Independent Prototype Notice**: This system uses realistic, consistent fictional sample data for demonstration. It does not connect to the college's live student records database or SMS gateway without prior authorization.

---

## 2. Target Users & Key Features

### A. Parent Portal (Primary Experience)
- **Executive Student Dashboard**: Welcoming profile card for **Aarav Kumar (CSE2026001)**, overall attendance (88.5%), Model Exam GPA (8.78), unread notification badges, and quick-action navigation cards.
- **Multi-Child Switcher**: Allows parents to switch between children (e.g. Aarav Kumar in 3rd Sem CSE and sibling Ananya Kumar in 1st Sem ECE).
- **Digital Report Cards**: Detailed Statements of Marks for **Internal Assessment 1**, **Internal Assessment 2**, and **Model Examination**. Includes Anna University 10-point CBCS grading system (`O`, `A+`, `A`, `B+`), teacher remarks, and a clean, print-friendly/PDF download view (`window.print()`).
- **Attendance Management**: Real-time attendance percentage, total working days, present/absent/late counters, interactive October 2026 calendar matrix, month/status filters, and daily history log.
- **Absence & Late-Arrival Alerts**: Simulated in-app notification center for gate check-in delays (e.g., *Oct 14 at 9:12 AM*), unexcused absences (e.g., *Oct 08*), and grade releases.
- **Leave Request Management**: Form with start/end dates, leave types (*Medical*, *Personal*, *Family Emergency*, *Other*), medical certificate attachment simulation, and accessible field validation following `:user-invalid` modern web standards. Real-time status tracking (*Pending*, *Approved*, *Rejected*, *Cancelled*).
- **College Announcements**: Digital notice board for examination timetables, parent-teacher council circulars, Deepavali vacation notices, and fee payment deadlines.
- **Settings & Profile**: Notification channel preference toggles, language translation preview (English/Tamil), and a local demo data reset switch.

### B. Teacher Portal
- **Class Advisor Overview**: Assigned classes (**III Year CSE - B** — 62 students), quick stats, and pending leave counts.
- **Class Roster**: Searchable student directory with parent contact details.
- **Daily Muster Attendance Recorder**: Date picker, morning/afternoon session toggle, one-click *"Mark All Present"*, interactive status buttons (*Present*, *Late*, *Absent*), and confirmation dialogs. Marking a student late or absent immediately dispatches parent notifications.
- **Marks Entry & Publishing**: Course marks register (CS3301 Data Structures), automatic GPA/percentage calculations, and publishing gates to release report cards to parents.
- **Leave Request Approvals**: Faculty review workflow to approve or decline parent leave requests with custom remarks. Approved requests automatically update the student's attendance records to *On Leave*.

### C. Administrator Portal
- **Campus KPI Overview**: Campus-wide student count (1,480), registered parents (1,420), faculty (84), and daily campus attendance rate (92.4%).
- **Students & Parents Registry**: Verification of parent-child linkages.
- **Examinations Management**: Publication gates and scheduling for Odd Semester assessment cycles.
- **Circulars Publisher**: Direct announcement composer to broadcast urgent circulars to parents and faculty.
- **Integration Blueprint**: Architectural documentation for connecting to MSEC SIS/ERP, SMS gateways, and Anna University results.

---

## 3. Technology Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6+ (`@vitejs/plugin-react`, `@tailwindcss/vite`)
- **Styling**: Tailwind CSS v4 (academic navy aesthetic: Deep Navy `#0f172a`, Soft Blue `#2563eb`, Accent Teal `#0d9488`, Slate `#f8fafc`)
- **Routing**: React Router v7 (`react-router-dom`)
- **Icons**: Lucide React
- **State Management**: React Context (`AppContext`) with automatic `localStorage` persistence and factory reset capabilities
- **Forms & Accessibility**: Modern Web Guidance compliance (`:user-invalid` pseudo-class, dynamic `aria-invalid` synchronization)

---

## 4. Local Installation & Setup

### Prerequisites
- **Node.js**: v18.0.0 or later (Tested on Node v24.21.0)
- **npm**: v9.0.0 or later (Tested on npm 11.19.0)

### Quick Start

1. Clone or extract the repository:
   ```bash
   cd "d:\Projects\Websites\MSEC Parent Connect"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. Build for production:
   ```bash
   npm run build
   ```

---

## 5. Built-in Faculty Demonstration Guide (10-Step Plan)

The application includes an interactive **"Faculty Demo Guide"** modal accessible at any time via the header button. It outlines the exact 10-step demonstration sequence requested for the October 21 meeting:

| Step | Sequence | Screen / Action | Role Required |
|:---:|---|---|---|
| **1** | Application Overview | Landing header and prototype disclosure banner | Parent |
| **2** | Parent Dashboard | Student Profile card for **Aarav Kumar (CSE2026001)** | Parent |
| **3** | Key Metrics | Attendance (88.5%) and Model Exam GPA (8.78 / 87.33%) | Parent |
| **4** | Digital Report Card | Open `/report-cards`, review CBCS grades, trigger Print/PDF view | Parent |
| **5** | Attendance History | Open `/attendance`, show Oct 14 Late Arrival (09:12 AM) & calendar | Parent |
| **6** | Notification Center | Open `/notifications`, show unread alerts for late arrival & results | Parent |
| **7** | Submit Leave Request | Open `/leave-requests`, fill form, attach certificate, submit | Parent |
| **8** | Track Leave Status | View updated leave history showing *Pending* status | Parent |
| **9** | Teacher Approval Workflow | Switch to **Teacher Portal**, approve Aarav's request, mark attendance | Teacher |
| **10** | Enterprise Architecture | Switch to **Admin Portal**, explain MSEC SIS/ERP integration pathway | Admin |

---

## 6. Known Limitations & Production Roadmap

| Current Prototype State | Production Roadmap |
|---|---|
| In-browser `localStorage` reactive persistence | Cloud Firestore / PostgreSQL database with secure row-level security |
| Simulated in-app notification center | SMS Gateway integration (e.g. CDAC / Twilio) & Firebase Cloud Messaging (FCM) |
| Hardcoded sample student profiles | MSEC SIS / ERP Single Sign-On (SSO) via SAML / OAuth 2.0 |
| Browser-rendered print engine (`window.print()`) | Server-side cryptographic PDF generation with QR verification |
| Local role switcher pill | Role-based authentication via Firebase Auth / LDAP directory |

---

## 7. Deployment Instructions

### Option A: Netlify / Vercel
1. Run `npm run build` to generate the `dist/` directory.
2. In Netlify or Vercel, set:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. Add a single-page rewrite (`/*` to `/index.html`) for React Router.

### Option B: Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting # Select dist as public directory, configure as single-page app
firebase deploy
```

---

## 8. License & Attribution

- **Project**: Lumina Parent Connect
- **Institution**: Meenakshi Sundararajan Engineering College (Autonomous), Kodambakkam, Chennai.
- **Created**: October 2026
