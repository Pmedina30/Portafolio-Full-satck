"""
Database Layer for SmileCraft Dental Platform.
Uses SQLite with connection management, secure password hashing,
and rich clinical seed data.
"""

import sqlite3
import os
from werkzeug.security import generate_password_hash, check_password_hash

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dental.db')

def get_db_connection():
    """Establish and return an SQLite connection with Row mapping."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize tables and populate dental seed data."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Users Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'patient', -- 'patient' or 'staff'
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Dental Services Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS services (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            description TEXT NOT NULL,
            price REAL NOT NULL,
            duration_minutes INTEGER NOT NULL,
            icon TEXT
        )
    ''')

    # Dentists Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS dentists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            title TEXT NOT NULL,
            specialty TEXT NOT NULL,
            experience_years INTEGER NOT NULL,
            bio TEXT NOT NULL,
            image_url TEXT
        )
    ''')

    # Appointments Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            patient_name TEXT NOT NULL,
            patient_email TEXT NOT NULL,
            patient_phone TEXT,
            service_id INTEGER,
            dentist_id INTEGER,
            appointment_date TEXT NOT NULL,
            appointment_time TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Confirmed', -- 'Pending', 'Confirmed', 'Completed', 'Cancelled'
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (service_id) REFERENCES services (id),
            FOREIGN KEY (dentist_id) REFERENCES dentists (id)
        )
    ''')

    # Clinical Treatments History Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS treatments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            dentist_name TEXT NOT NULL,
            procedure_name TEXT NOT NULL,
            tooth_number TEXT,
            treatment_date TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Completed',
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    # --- Seed Services ---
    cursor.execute("SELECT COUNT(*) FROM services")
    if cursor.fetchone()[0] == 0:
        services_data = [
            ("Comprehensive Dental Exam & Cleaning", "Preventive", "Full dental examination, digital bitewing X-rays, ultrasonic scaling, and enamel polishing.", 120.00, 45, "Sparkles"),
            ("Professional Laser Teeth Whitening", "Cosmetic", "Advanced in-office LED laser whitening treatment lightening teeth up to 8 shades in 1 hour.", 299.00, 60, "Sun"),
            ("Invisalign & Clear Aligners", "Orthodontics", "Custom clear aligner digital treatment plan for discreet, comfortable teeth straightening.", 2400.00, 30, "Smile"),
            ("Titanium Dental Implants", "Restorative", "State-of-the-art permanent tooth replacement with titanium post and custom porcelain crown.", 1850.00, 90, "ShieldCheck"),
            ("Porcelain Veneers & Bonding", "Cosmetic", "Custom-crafted ultra-thin porcelain shells designed to fix chipped, gapped, or discolored teeth.", 650.00, 60, "Star"),
            ("Emergency Dental Pain Relief", "Emergency", "Immediate same-day emergency assessment for severe toothaches, chipped teeth, or dental trauma.", 95.00, 30, "AlertCircle")
        ]
        cursor.executemany(
            "INSERT INTO services (name, category, description, price, duration_minutes, icon) VALUES (?, ?, ?, ?, ?, ?)",
            services_data
        )

    # --- Seed Dentists ---
    cursor.execute("SELECT COUNT(*) FROM dentists")
    if cursor.fetchone()[0] == 0:
        dentists_data = [
            (
                "Dr. Sarah Mitchell, DDS",
                "Lead Cosmetic Dentist & Clinical Director",
                "Cosmetic Dentistry & Aesthetic Restorations",
                14,
                "Harvard Dental graduate with over 14 years specializing in digital smile designs, porcelain veneers, and gentle patient care.",
                "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"
            ),
            (
                "Dr. Marcus Vance, DMD, MS",
                "Senior Orthodontist",
                "Orthodontics & Invisalign Diamond Provider",
                11,
                "Board-certified orthodontist specializing in adult and teen clear aligner therapy, smile symmetry, and bite correction.",
                "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300"
            ),
            (
                "Dr. Elena Rostova, DDS, PhD",
                "Periodontal & Implant Surgeon",
                "Dental Implants & Laser Periodontics",
                16,
                "International lecturer and specialist in 3D-guided dental implantology, bone regeneration, and minimally invasive gum health.",
                "https://images.unsplash.com/photo-1594824813581-807d9b047545?auto=format&fit=crop&q=80&w=300"
            )
        ]
        cursor.executemany(
            "INSERT INTO dentists (name, title, specialty, experience_years, bio, image_url) VALUES (?, ?, ?, ?, ?, ?)",
            dentists_data
        )

    # --- Seed Demo Users ---
    cursor.execute("SELECT id FROM users WHERE email = 'patient@smilecraft.com'")
    patient_row = cursor.fetchone()
    if not patient_row:
        cursor.execute(
            "INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)",
            ("Michael Reynolds", "patient@smilecraft.com", "(555) 234-8901", generate_password_hash("smile123"), "patient")
        )
        patient_id = cursor.lastrowid
    else:
        patient_id = patient_row[0]

    cursor.execute("SELECT id FROM users WHERE email = 'dr.sarah@smilecraft.com'")
    if not cursor.fetchone():
        cursor.execute(
            "INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)",
            ("Dr. Sarah Mitchell", "dr.sarah@smilecraft.com", "(555) 987-6543", generate_password_hash("smile123"), "staff")
        )

    # --- Seed Demo Patient Appointments ---
    cursor.execute("SELECT COUNT(*) FROM appointments WHERE user_id = ?", (patient_id,))
    if cursor.fetchone()[0] == 0:
        appointments_data = [
            (patient_id, "Michael Reynolds", "patient@smilecraft.com", "(555) 234-8901", 1, 1, "2026-09-22", "10:30 AM", "Confirmed", "Routine biannual hygiene and enamel polish."),
            (patient_id, "Michael Reynolds", "patient@smilecraft.com", "(555) 234-8901", 2, 1, "2026-10-15", "02:00 PM", "Confirmed", "Follow-up laser shade check.")
        ]
        cursor.executemany(
            "INSERT INTO appointments (user_id, patient_name, patient_email, patient_phone, service_id, dentist_id, appointment_date, appointment_time, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            appointments_data
        )

    # --- Seed Demo Patient Treatments History ---
    cursor.execute("SELECT COUNT(*) FROM treatments WHERE user_id = ?", (patient_id,))
    if cursor.fetchone()[0] == 0:
        treatments_data = [
            (patient_id, "Dr. Sarah Mitchell, DDS", "Comprehensive Oral Evaluation", "All", "2026-03-10", "Completed", "Gums healthy. Enamel in great condition. Recommended nightguard for light clenching."),
            (patient_id, "Dr. Sarah Mitchell, DDS", "Composite Resin Filling", "Tooth #14 (Upper Left Molar)", "2025-11-04", "Completed", "Treated minor occlusal decay. Tooth restored with matching natural shade composite."),
            (patient_id, "Dr. Marcus Vance, DMD", "Invisalign Progress Scan", "Upper & Lower Arches", "2025-06-18", "Completed", "Alignment scan completed. Tooth movement tracked according to plan.")
        ]
        cursor.executemany(
            "INSERT INTO treatments (user_id, dentist_name, procedure_name, tooth_number, treatment_date, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)",
            treatments_data
        )

    conn.commit()
    conn.close()

# --- Helper Functions ---

def register_user(name, email, password, phone="", role="patient"):
    email = email.strip().lower()
    name = name.strip()
    if not name or not email or not password:
        return False, "Name, email, and password are required.", None

    if len(password) < 6:
        return False, "Password must be at least 6 characters.", None

    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        hashed = generate_password_hash(password)
        cursor.execute(
            "INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)",
            (name, email, phone.strip(), hashed, role)
        )
        conn.commit()
        user_id = cursor.lastrowid
        return True, "User registered successfully.", {"id": user_id, "name": name, "email": email, "phone": phone, "role": role}
    except sqlite3.IntegrityError:
        return False, "An account with this email already exists.", None
    except Exception as e:
        return False, f"Registration failed: {str(e)}", None
    finally:
        if conn:
            conn.close()

def authenticate_user(email, password):
    email = email.strip().lower()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, phone, password_hash, role FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()

    if user and check_password_hash(user['password_hash'], password):
        return {
            "id": user['id'],
            "name": user['name'],
            "email": user['email'],
            "phone": user['phone'],
            "role": user['role']
        }
    return None

def get_user_by_id(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()
    conn.close()
    return dict(user) if user else None

def get_services():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM services ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_dentists():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM dentists ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_appointments(user_id=None, is_staff=False):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = '''
        SELECT 
            a.id, a.user_id, a.patient_name, a.patient_email, a.patient_phone,
            a.appointment_date, a.appointment_time, a.status, a.notes, a.created_at,
            s.name AS service_name, s.price AS service_price, s.duration_minutes,
            d.name AS dentist_name, d.specialty AS dentist_specialty, d.image_url AS dentist_image
        FROM appointments a
        LEFT JOIN services s ON a.service_id = s.id
        LEFT JOIN dentists d ON a.dentist_id = d.id
    '''
    
    if not is_staff and user_id:
        query += " WHERE a.user_id = ? ORDER BY a.appointment_date ASC, a.appointment_time ASC"
        cursor.execute(query, (user_id,))
    else:
        query += " ORDER BY a.appointment_date ASC, a.appointment_time ASC"
        cursor.execute(query)

    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def create_appointment(patient_name, patient_email, patient_phone, service_id, dentist_id, appointment_date, appointment_time, notes="", user_id=None):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO appointments (user_id, patient_name, patient_email, patient_phone, service_id, dentist_id, appointment_date, appointment_time, status, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed', ?)
        ''', (user_id, patient_name, patient_email, patient_phone, service_id, dentist_id, appointment_date, appointment_time, notes))
        conn.commit()
        new_id = cursor.lastrowid
        return True, "Appointment booked successfully!", new_id
    except Exception as e:
        return False, f"Failed to create appointment: {str(e)}", None
    finally:
        if conn:
            conn.close()

def update_appointment_status(appointment_id, new_status):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE appointments SET status = ? WHERE id = ?", (new_status, appointment_id))
        conn.commit()
        return True, "Status updated successfully."
    except Exception as e:
        return False, str(e)
    finally:
        if conn:
            conn.close()

def get_treatments(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM treatments WHERE user_id = ? ORDER BY treatment_date DESC", (user_id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_clinic_stats():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM appointments")
    total_appts = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM appointments WHERE status = 'Confirmed'")
    confirmed_appts = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'patient'")
    total_patients = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM services")
    total_services = cursor.fetchone()[0]

    conn.close()
    return {
        "total_appointments": total_appts,
        "confirmed_appointments": confirmed_appts,
        "total_patients": total_patients,
        "total_services": total_services
    }

