"""
Flask Web Application with Landing Page, Authentication, and Dashboard.
"""

from functools import wraps
import os
from flask import Flask, render_template, request, redirect, url_for, session, flash
import database

app = Flask(__name__)
# In a production environment, use an environment variable for SECRET_KEY
app.secret_key = os.environ.get('SECRET_KEY', 'python-web-demo-secret-key-change-in-prod')

# Security cookie hardening
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax',
    SESSION_COOKIE_SECURE=False, # Set to True in production HTTPS
)

# Ensure database is initialized at startup
database.init_db()

@app.before_request
def block_sensitive_files():
    """Prevent inspecting or downloading database files or source code."""
    path = request.path.lower()
    blocked_extensions = ('.db', '.sqlite', '.sqlite3', '.env', '.py', '.bat', '.log', '.git', '.json')
    if any(path.endswith(ext) for ext in blocked_extensions):
        return ("Access Denied: Direct database or system file inspection is blocked.", 403)

@app.after_request
def apply_security_headers(response):
    """Add defensive security headers to prevent sniffing, framing, and XSS."""
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    return response

def login_required(f):
    """Decorator to require login for protected routes."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash("Please sign in to access this page.", "warning")
            return redirect(url_for('login', next=request.path))
        return f(*args, **kwargs)
    return decorated_function

@app.context_processor
def inject_user():
    """Inject current_user helper into all Jinja templates."""
    user = None
    if 'user_id' in session:
        user = {
            'id': session.get('user_id'),
            'name': session.get('user_name'),
            'email': session.get('user_email')
        }
    return {'current_user': user}

@app.route('/')
def home():
    """Landing Page showcasing application features and CTA."""
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    """User Login handler."""
    if 'user_id' in session:
        return redirect(url_for('dashboard'))

    if request.method == 'POST':
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '')
        remember = request.form.get('remember')

        if not email or not password:
            flash("Please enter both email and password.", "danger")
            return render_template('login.html', email=email)

        user = database.verify_user(email, password)
        if user:
            session['user_id'] = user['id']
            session['user_name'] = user['name']
            session['user_email'] = user['email']
            if remember:
                session.permanent = True

            flash(f"Welcome back, {user['name']}!", "success")
            next_page = request.args.get('next')
            if next_page and next_page.startswith('/'):
                return redirect(next_page)
            return redirect(url_for('dashboard'))
        else:
            flash("Invalid email or password. Please try again.", "danger")
            return render_template('login.html', email=email)

    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    """User Registration handler."""
    if 'user_id' in session:
        return redirect(url_for('dashboard'))

    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '')
        confirm_password = request.form.get('confirm_password', '')

        if not name or not email or not password:
            flash("All fields are required.", "danger")
            return render_template('register.html', name=name, email=email)

        if password != confirm_password:
            flash("Passwords do not match.", "danger")
            return render_template('register.html', name=name, email=email)

        success, message = database.create_user(name, email, password)
        if success:
            flash("Registration successful! You can now sign in.", "success")
            return redirect(url_for('login'))
        else:
            flash(message, "danger")
            return render_template('register.html', name=name, email=email)

    return render_template('register.html')

@app.route('/dashboard')
@login_required
def dashboard():
    """Protected Dashboard for authenticated users."""
    user = database.get_user_by_id(session['user_id'])
    return render_template('dashboard.html', user=user)

@app.route('/logout')
def logout():
    """Log out the current user."""
    session.clear()
    flash("You have been signed out.", "info")
    return redirect(url_for('home'))

if __name__ == '__main__':
    # Listen on all interfaces on port 5000 in debug mode
    print("Starting Flask application on http://127.0.0.1:5000 ...")
    app.run(debug=True, host='127.0.0.1', port=5000)

