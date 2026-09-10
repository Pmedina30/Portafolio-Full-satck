"""
Unit and Integration Tests for PyStack Web Application.
Tests database operations, password verification, route responses, and authentication sessions.
"""

import unittest
import os
import tempfile
import database
import app

class PyStackTestCase(unittest.TestCase):
    def setUp(self):
        # Use a temporary database for test isolation
        fd, database.DB_PATH = tempfile.mkstemp(suffix='.db')
        os.close(fd)
        database.init_db()
        
        # Configure test client
        app.app.config['TESTING'] = True
        app.app.config['WTF_CSRF_ENABLED'] = False
        self.client = app.app.test_client()

    def tearDown(self):
        import gc
        gc.collect()
        try:
            if os.path.exists(database.DB_PATH):
                os.remove(database.DB_PATH)
        except OSError:
            pass

    def test_database_demo_user_seeded(self):
        """Test that default demo user is seeded during init_db."""
        user = database.verify_user("demo@example.com", "password123")
        self.assertIsNotNone(user)
        self.assertEqual(user['name'], "Demo User")

    def test_database_verify_wrong_password(self):
        """Test authentication rejection with incorrect password."""
        user = database.verify_user("demo@example.com", "incorrect")
        self.assertIsNone(user)

    def test_database_create_user(self):
        """Test registration of a new user."""
        success, msg = database.create_user("Alice Wonderland", "alice@example.com", "secret456")
        self.assertTrue(success)
        
        # Verify can login
        user = database.verify_user("alice@example.com", "secret456")
        self.assertIsNotNone(user)
        self.assertEqual(user['name'], "Alice Wonderland")

    def test_database_duplicate_user(self):
        """Test that duplicate email registration is rejected."""
        success, _ = database.create_user("Duplicate User", "demo@example.com", "password123")
        self.assertFalse(success)

    def test_landing_page_route(self):
        """Test GET / landing page response."""
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'PyStack', response.data)
        self.assertIn(b'Modern Full-Stack Python Starter', response.data)

    def test_login_page_get(self):
        """Test GET /login renders login form."""
        response = self.client.get('/login')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Sign In', response.data)
        self.assertIn(b'demo@example.com', response.data)

    def test_dashboard_protected_redirect(self):
        """Test GET /dashboard requires login and redirects unauthenticated users."""
        response = self.client.get('/dashboard')
        self.assertEqual(response.status_code, 302)
        self.assertIn('/login', response.headers['Location'])

    def test_login_and_access_dashboard(self):
        """Test full login session flow and accessing dashboard."""
        # Submit login form
        response = self.client.post('/login', data={
            'email': 'demo@example.com',
            'password': 'password123'
        }, follow_redirects=True)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Welcome back, Demo User!', response.data)
        self.assertIn(b'Hello, Demo User', response.data)

        # Access dashboard directly while authenticated
        dash_response = self.client.get('/dashboard')
        self.assertEqual(dash_response.status_code, 200)
        self.assertIn(b'Session Status', dash_response.data)

        # Logout
        logout_response = self.client.get('/logout', follow_redirects=True)
        self.assertEqual(logout_response.status_code, 200)
        self.assertIn(b'You have been signed out.', logout_response.data)

if __name__ == '__main__':
    unittest.main()

