# SmartCare™ | Emergency Triage & Dynamic Patient Queue

A modern, polished healthcare SaaS application designed for acute hospital emergency departments and urgent care clinics. Built with **React 18**, **Vite**, and **Tailwind CSS**.

---

## 🌟 Key Features

### 1. Patient Registration & Intake Validation
- Validated patient intake form capturing demographics, contact details, auto-generated MRN (`SC-2026-XXXX`), department, and chief complaint.
- **Full Vital Signs Intake**: Systolic & Diastolic BP, Heart Rate, Respiratory Rate, Pulse Oximetry (SpO2), Body Temperature, and Pain Score (0–10).
- **Real-Time Screener Preview**: Dynamic feedback on abnormal physiological parameters as vitals are entered.
- **Staff Sign-Off**: Mandatory clinician verification and credentialing before queue admission.

### 2. Dynamic Live Patient Queue
- **Real-Time Search**: Search by patient name, MRN, chief complaint, or symptoms.
- **Department & Specialty Filters**: Emergency & Trauma, Cardiology, Pulmonology, Pediatrics, Neurology, and General Medicine.
- **Status Filter Tabs**: Filter with live counts across *All Patients*, *Waiting*, *In Consultation*, and *Completed*.
- **Acuity Level Filter**: Filter by ESI Level 1 through Level 5.
- **Priority "Call Next Urgent Patient"**: Instantly identifies the highest-acuity waiting patient and admits them to active consultation.

### 3. Clinician-Confirmed Urgency (ESI 1–5) Sorting
- Strict adherence to emergency triage prioritization:
  - **Level 1 (Immediate / Resuscitation)**
  - **Level 2 (Emergency / Very Urgent)**
  - **Level 3 (Urgent)**
  - **Level 4 (Standard / Less Urgent)**
  - **Level 5 (Non-Urgent / Routine)**
- **Tie-Breaker**: When urgency levels match, patients are sorted by earliest arrival timestamp.
- User-selectable sort overrides (Arrival Asc/Desc, Longest Wait Time, Alphabetical).

### 4. Patient Status Updates & Transitions
- One-click workflow transitions:
  - `Waiting in Queue` ➔ `In Consultation` (assigns exam bay / bed)
  - `In Consultation` ➔ `Completed / Discharged` (requires confirmation modal)
  - Re-open completed cases if clinical review continues.
- **Clinical Record & Re-Triage Modal**: Detailed vitals matrix, clinical notes editor, and acuity level re-evaluation with required clinical rationale.

### 5. Unified Real-Time Dashboard Metrics
- Derived dynamically from patient data:
  - **Waiting in Queue**: Real-time counter of unassigned waiting patients.
  - **In Active Consultation**: Occupied exam beds and consultation bays.
  - **Critical Alert Flags**: Level 1 & 2 cases requiring immediate monitoring.
  - **Dynamic Average Wait Time**: Calculated from actual queue wait durations.
  - **Completed / Discharged**: Census of treated patients today.

### 6. Interactive Visualizations & Triage Alerts Panel
- **Triage Acuity Distribution**: Interactive visual bar and percentage breakdown across all 5 ESI acuity tiers with one-click filtering.
- **Department Caseload Chart**: Workload and census tracking across ED specialties.
- **Triage Alerts Panel**: Feed of physiological anomalies (e.g., critical hypoxia, hypertensive crisis, tachyarrhythmia) with direct click-through to clinical records.

### 7. UX & Accessibility Essentials
- **Toast Notifications**: Automatic non-blocking alerts for admissions, status transitions, and alerts.
- **Confirmation Dialogs**: Protection against accidental discharges or demo data wipes.
- **Empty States**: Clear messaging with quick filter-reset buttons when searches return no results.
- **Responsive Layout**: Full support for desktop monitors, tablets, and mobile devices with hamburger drawer navigation.

### 8. Persistent Demo Sandbox & Quick Simulation
- Demo data persists across page refreshes via `localStorage`.
- **Reset Sandbox Button**: Restores the 12 default realistic fictional patients and resets timestamps relative to current time.
- **"+ Simulate Inflow" Button**: Injects random emergency cases (e.g. Acute MI, severe asthma flare) for rapid hackathon live demonstrations.
- **Visible Demo Indicator**: Clear banner and header badge identifying fictional sandbox isolation.

---

## 🛡️ Clinical Safety & Ethics Mandate

1. **Fictional Data Only**: All demo records, patient names, MRNs, and vitals are simulated.
2. **Preliminary Warning Flags, Never Diagnoses**: Automated screener checks function strictly as physiological warning signals. They do not diagnose conditions or generate automated medical advice.
3. **Mandatory Clinician Assessment**: Final urgency and care pathways must always be confirmed by qualified medical staff.
4. **No Guaranteed Wait Times**: All wait metrics reflect retrospective queue elapsed times, not guaranteed outcome estimates.

---

## 🎨 Design System

- **Background**: Clean white / slate-50 canvas (`#F8FAFC`).
- **Typography**: Deep navy hierarchy (`#0B1727`, `#0F172A`, `#1E293B`) using Inter & Plus Jakarta Sans.
- **Primary Actions**: Teal SaaS accents (`#0D9488`, `#0F766E`, `#14B8A6`).
- **Restrained Urgency Palette**:
  - *Level 1 (Immediate)*: Deep Rose (`#E11D48`, `bg-rose-50`, `border-rose-200`)
  - *Level 2 (Emergency)*: Warm Orange (`#EA580C`, `bg-orange-50`, `border-orange-200`)
  - *Level 3 (Urgent)*: Amber (`#CA8A04`, `bg-amber-50`, `border-amber-200`)
  - *Level 4 (Standard)*: Sky Blue (`#0284C7`, `bg-sky-50`, `border-sky-200`)
  - *Level 5 (Non-Urgent)*: Slate (`#64748B`, `bg-slate-50`, `border-slate-200`)

---

## 🚀 How to Run

### Prerequisites
- Node.js (v18+)
- npm

### 1. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Run Unit Tests
```bash
npm test
```
Executes automated tests validating sorting rules, preliminary flags, filtering, and metric aggregations.

### 3. Build for Production
```bash
npm run build
```
Generates optimized static assets in the `dist/` directory.

### 4. Preview Production Build
```bash
npm run preview
```
Runs a local preview of the production bundle.
