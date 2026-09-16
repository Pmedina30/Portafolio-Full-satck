"""
SmileCraft Dental - Flask REST API Backend.
Provides endpoints for Authentication, Services, Dentists, Appointments, Treatments, and Stats.
"""

import os
import datetime
import jwt
from functools import wraps
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import database

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

JWT_SECRET = os.environ.get("JWT_SECRET", "smilecraft-dental-super-secret-jwt-key-2026")
JWT_ALGORITHM = "HS256"

# Initialize SQLite database with seed data
database.init_db()

@app.before_request
def block_database_and_source_inspection():
    """Block any attempt to read database files, source code, or env secrets."""
    path = request.path.lower()
    blocked = ('.db', '.sqlite', '.sqlite3', '.env', '.py', '.bat', '.git', '.sql')
    if any(path.endswith(ext) for ext in blocked):
        return jsonify({"error": "Access Denied: Direct database or system inspection is prohibited."}), 403

@app.after_request
def add_security_headers(response):
    """Defensive HTTP headers for security and zero data sniffing."""
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    return response

def create_token(user_dict):
    """Generate JWT authentication token expiring in 7 days."""
    payload = {
        "id": user_dict["id"],
        "name": user_dict["name"],
        "email": user_dict["email"],
        "role": user_dict.get("role", "patient"),
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def get_current_user_from_token():
    """Extract and verify user from Bearer Authorization header."""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None

    token = auth_header.split(" ")[1]
    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return decoded
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None

def auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        user = get_current_user_from_token()
        if not user:
            return jsonify({"error": "Authentication required. Invalid or missing token."}), 401
        return f(user, *args, **kwargs)
    return decorated

# ----------------- Auth Endpoints -----------------

@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "")
    phone = data.get("phone", "").strip()
    role = data.get("role", "patient")

    if role not in ["patient", "staff"]:
        role = "patient"

    success, message, user_info = database.register_user(name, email, password, phone, role)
    if not success:
        return jsonify({"error": message}), 400

    token = create_token(user_info)
    return jsonify({
        "message": message,
        "token": token,
        "user": user_info
    }), 201

@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    user = database.authenticate_user(email, password)
    if not user:
        return jsonify({"error": "Invalid email or password."}), 401

    token = create_token(user)
    return jsonify({
        "message": "Login successful.",
        "token": token,
        "user": user
    }), 200

@app.route("/api/auth/me", methods=["GET"])
@auth_required
def get_me(user):
    user_details = database.get_user_by_id(user["id"])
    if not user_details:
        return jsonify({"error": "User not found."}), 404
    # Do not expose password hash
    user_details.pop("password_hash", None)
    return jsonify({"user": user_details}), 200

# ----------------- Public Clinic Data -----------------

@app.route("/api/services", methods=["GET"])
def get_services():
    services = database.get_services()
    return jsonify({"services": services}), 200

@app.route("/api/dentists", methods=["GET"])
def get_dentists():
    dentists = database.get_dentists()
    return jsonify({"dentists": dentists}), 200

@app.route("/api/stats", methods=["GET"])
def get_stats():
    stats = database.get_clinic_stats()
    return jsonify({"stats": stats}), 200

# ----------------- Appointments Endpoints -----------------

@app.route("/api/appointments", methods=["GET"])
def list_appointments():
    current_user = get_current_user_from_token()
    if not current_user:
        # Unauthenticated users cannot view appointment lists
        return jsonify({"appointments": []}), 200

    is_staff = current_user.get("role") == "staff"
    appointments = database.get_appointments(user_id=current_user["id"], is_staff=is_staff)
    return jsonify({"appointments": appointments}), 200

@app.route("/api/appointments", methods=["POST"])
def book_appointment():
    data = request.get_json() or {}
    patient_name = data.get("patient_name", "").strip()
    patient_email = data.get("patient_email", "").strip()
    patient_phone = data.get("patient_phone", "").strip()
    service_id = data.get("service_id")
    dentist_id = data.get("dentist_id")
    appointment_date = data.get("appointment_date", "").strip()
    appointment_time = data.get("appointment_time", "").strip()
    notes = data.get("notes", "").strip()

    if not patient_name or not patient_email or not appointment_date or not appointment_time:
        return jsonify({"error": "Name, email, date, and time are required."}), 400

    current_user = get_current_user_from_token()
    user_id = current_user["id"] if current_user else None

    # If the user is authenticated, fall back to their profile information if not specified
    if current_user and not patient_name:
        patient_name = current_user.get("name")
    if current_user and not patient_email:
        patient_email = current_user.get("email")

    success, msg, appt_id = database.create_appointment(
        patient_name=patient_name,
        patient_email=patient_email,
        patient_phone=patient_phone,
        service_id=service_id,
        dentist_id=dentist_id,
        appointment_date=appointment_date,
        appointment_time=appointment_time,
        notes=notes,
        user_id=user_id
    )

    if not success:
        return jsonify({"error": msg}), 500

    return jsonify({"message": msg, "appointment_id": appt_id}), 201

@app.route("/api/appointments/<int:appt_id>/status", methods=["PATCH"])
@auth_required
def update_status(current_user, appt_id):
    if current_user.get("role") != "staff":
        return jsonify({"error": "Unauthorized. Only clinic staff can update appointment status."}), 403

    data = request.get_json() or {}
    new_status = data.get("status")
    if new_status not in ["Pending", "Confirmed", "Completed", "Cancelled"]:
        return jsonify({"error": "Invalid status value."}), 400

    success, msg = database.update_appointment_status(appt_id, new_status)
    if not success:
        return jsonify({"error": msg}), 500

    return jsonify({"message": msg}), 200

# ----------------- Treatments History -----------------

@app.route("/api/treatments", methods=["GET"])
@auth_required
def get_treatments(user):
    treatments = database.get_treatments(user["id"])
    return jsonify({"treatments": treatments}), 200

# ----------------- Health Check -----------------

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "platform": "SmileCraft Dental API", "timestamp": str(datetime.datetime.now())})

# ----------------- Serve Frontend Single-Page App -----------------

FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    if path.startswith('api/'):
        return jsonify({"error": "Endpoint not found"}), 404

    # Prevent directory traversal attacks
    safe_path = os.path.normpath(path).lstrip('/\\')
    target_file = os.path.abspath(os.path.join(FRONTEND_DIST, safe_path))
    if not target_file.startswith(FRONTEND_DIST):
        return jsonify({"error": "Forbidden"}), 403

    if path != '' and os.path.exists(target_file) and os.path.isfile(target_file):
        return send_from_directory(FRONTEND_DIST, safe_path)

    index_file = os.path.join(FRONTEND_DIST, 'index.html')
    if os.path.exists(index_file):
        return send_from_directory(FRONTEND_DIST, 'index.html')

    return jsonify({
        "message": "SmileCraft Dental API is running.",
        "hint": "Run `npm run dev` in dental-app/frontend or run `run_dental.bat`."
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    print(f"🦷 SmileCraft Dental Backend running on http://127.0.0.1:{port}")
    app.run(host="127.0.0.1", port=port, debug=True)


