# SmileCraft Dental - Full-Stack Dental Practice Platform

A full-stack modern web application for a Dental Business built with **React**, **Tailwind CSS**, and a **Python REST API** backed by **SQLite**.

---

## 🌟 Application Highlights

### 1. Patient Landing Page (`http://localhost:5173`)
- **Hero Showcase**: Trust statistics ("15,000+ Smiles", "99.8% Satisfaction", "0% Financing"), booking call-to-actions, and painless dentistry highlights.
- **Treatments & Services Catalog**: 6 dental procedures including Laser Whitening, Invisalign, Dental Implants, Preventive Hygiene, and Emergency Care with pricing and duration.
- **Board-Certified Specialists**: Doctor profiles with specialties, credentials, years of experience, and clinical bios.
- **Online Booking Widget**: Interactive appointment scheduler with service selection, doctor choice, date/time pickers, and instant confirmation.
- **Patient Testimonials & Reviews**: Verified 5-star patient stories.
- **Emergency Hotline & Hours**: 24/7 dental emergency contacts and operating schedule.

### 2. Authentication & Patient/Staff Portals
- **Role-based Authentication**: Supports both **Patient** and **Clinic Staff / Doctor** roles.
- **Pre-Configured Demo Accounts**:
  - **Patient Demo**: `patient@smilecraft.com` / `smile123`
  - **Doctor / Staff Demo**: `dr.sarah@smilecraft.com` / `smile123`
  - *(Includes 1-click **Auto-fill** buttons directly on the sign-in modal!)*
- **Patient Dashboard**:
  - Upcoming and past appointments with live status pills (`Confirmed`, `Pending`, `Completed`, `Cancelled`).
  - Treatment history and clinical dental chart records.
  - Post-procedure care instructions and everyday hygiene guides.
- **Clinic Staff / Doctor Dashboard**:
  - Clinic analytics (total appointments, active patients, confirmed visits).
  - Clinic-wide appointment manager with status controls (Confirm, Complete, Cancel).

---

## 🚀 How to Run

### Method 1: Double-Click Launcher (Windows)
Double-click **`run_dental.bat`** in the project root. It will:
1. Detect or configure Python and Node.js.
2. Launch the Python REST API Backend on port `5001`.
3. Launch the React + Tailwind Frontend on port `5173`.
4. Open both in separate terminal windows.

### Method 2: Manual Terminal Launch

#### Step 1: Start Python Backend
```bash
cd dental-app/backend
..\..\.venv\Scripts\python.exe app.py
```
*Runs on `http://127.0.0.1:5001`*

#### Step 2: Start React Frontend
```bash
cd dental-app/frontend
npm run dev
```
*Runs on `http://localhost:5173`*

---

## 📂 Architecture

```
dental-app/
├── backend/
│   ├── app.py                   # REST API routes (Auth, Appointments, Services, Dentists, Treatments)
│   ├── database.py              # SQLite models, password hashing, and seed data
│   ├── requirements.txt         # Flask, Flask-Cors, Werkzeug, PyJWT
│   └── test_dental_backend.py   # Automated backend test suite
└── frontend/
    ├── package.json             # React 18, Tailwind CSS, Lucide Icons, Vite
    ├── tailwind.config.js       # Dental aesthetics color palette
    ├── vite.config.js           # Vite dev server with proxy to port 5001
    ├── src/
    │   ├── api.js               # Frontend API service layer
    │   ├── App.jsx              # Main view & state orchestrator
    │   ├── main.jsx             # React DOM entrypoint
    │   ├── index.css            # Tailwind directives & custom gradients
    │   └── components/
    │       ├── Navbar.jsx       # Header with emergency ticker & user menu
    │       ├── LandingPage.jsx  # Hero, Services, Booking widget, Specialists, Reviews
    │       ├── AuthModal.jsx    # Sign In / Register dialog with demo quick-fill
    │       └── Dashboard.jsx    # Patient and Clinic Staff dashboards
```

