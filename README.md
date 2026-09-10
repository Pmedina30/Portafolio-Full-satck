# PyStack - Python Web Application (Landing Page & Authentication)

A clean, responsive, and production-ready web application built with **Python**, **Flask**, **SQLite**, and **HTML5/CSS3**.

---

## 🚀 Features

- **Modern Landing Page**:
  - Hero banner with title, value proposition, and primary call-to-action.
  - Interactive syntax-highlighted route code snippet.
  - Performance and architecture metrics counter.
  - Interactive feature highlights grid.
- **Complete Authentication Flow**:
  - User sign in with email and password.
  - User registration with validation and password matching.
  - Cryptographic password hashing (`PBKDF2` with `SHA-256`) via Werkzeug security.
  - Show/hide password visibility toggle.
  - 1-click **Auto-fill Demo Credentials** button for instant testing.
  - Secure session management with `@login_required` route decorators.
- **Protected User Dashboard**:
  - Displays user profile, session details, and registration date.
  - Account statistics and navigation controls.
  - Secure sign-out with flash alerts.
- **Zero Heavy Frontend Dependencies**:
  - Modern, responsive CSS written with CSS Variables, Flexbox, and CSS Grid.
  - Works on mobile phones, tablets, and desktop displays.
- **Plug-and-Play Database**:
  - SQLite database (`app.db`) is automatically initialized and seeded on first run.

---

## 🔑 Demo Account Credentials

A pre-configured demo account is automatically seeded into the database:

- **Email**: `demo@example.com`
- **Password**: `password123`

*(You can also use the **Register** tab to create your own new account anytime!)*

---

## 🛠️ Quick Start Guide

### Option 1: One-Click Launch (Windows)
Double-click `run.bat` in this folder. It will:
1. Create a Python virtual environment (`.venv`) if one doesn't exist.
2. Install dependencies (`Flask`, `Werkzeug`).
3. Start the application at `http://127.0.0.1:5000`.

### Option 2: Manual Setup via Command Line

1. **Open your terminal** in this project folder:
   ```bash
   cd "c:\Users\pmedina\OneDrive - Trueshore, BPO\Documents\Portafolio-Full satck"
   ```

2. **Create and activate a virtual environment**:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   ```

3. **Install required dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the server**:
   ```bash
   python app.py
   ```

5. **Open in browser**:
   Navigate to [http://127.0.0.1:5000](http://127.0.0.1:5000).

---

## 📂 Project Structure

```
├── app.py                  # Main Flask application and URL routes
├── database.py             # SQLite database layer & password hashing
├── requirements.txt        # Python package dependencies (Flask, Werkzeug)
├── run.bat                 # Convenient Windows one-click launcher
├── README.md               # Project documentation
├── static/
│   ├── css/
│   │   └── style.css       # Clean modern CSS styling (responsive)
│   └── js/
│       └── main.js         # Interactive JS (demo fill, password toggle, alerts)
└── templates/
    ├── base.html           # Master layout template (navbar, flash alerts, footer)
    ├── index.html          # Modern Landing page
    ├── login.html          # Authentication login card
    ├── register.html       # User sign up form
    └── dashboard.html      # Protected user account dashboard
```

