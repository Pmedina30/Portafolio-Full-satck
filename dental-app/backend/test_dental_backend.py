"""
Automated Test Suite for SmileCraft Dental Python Backend.
"""

import unittest
import json
import os
import tempfile
import database
import app

class DentalBackendTestCase(unittest.TestCase):
    def setUp(self):
        self.db_fd, database.DB_PATH = tempfile.mkstemp(suffix='.db')
        os.close(self.db_fd)
        database.init_db()

        app.app.config['TESTING'] = True
        self.client = app.app.test_client()

    def tearDown(self):
        import gc
        gc.collect()
        try:
            if os.path.exists(database.DB_PATH):
                os.remove(database.DB_PATH)
        except OSError:
            pass

    def test_demo_users_seeded(self):
        """Test default demo patient and dentist accounts."""
        patient = database.authenticate_user("patient@smilecraft.com", "smile123")
        self.assertIsNotNone(patient)
        self.assertEqual(patient['role'], 'patient')

        dentist = database.authenticate_user("dr.sarah@smilecraft.com", "smile123")
        self.assertIsNotNone(dentist)
        self.assertEqual(dentist['role'], 'staff')

    def test_services_and_dentists_endpoints(self):
        """Test public services and dentists catalog."""
        srv_res = self.client.get('/api/services')
        self.assertEqual(srv_res.status_code, 200)
        services = json.loads(srv_res.data)['services']
        self.assertGreaterEqual(len(services), 6)

        doc_res = self.client.get('/api/dentists')
        self.assertEqual(doc_res.status_code, 200)
        dentists = json.loads(doc_res.data)['dentists']
        self.assertGreaterEqual(len(dentists), 3)

    def test_login_and_token_generation(self):
        """Test POST /api/auth/login with valid credentials."""
        res = self.client.post('/api/auth/login', json={
            "email": "patient@smilecraft.com",
            "password": "smile123"
        })
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertIn("token", data)
        self.assertEqual(data["user"]["name"], "Michael Reynolds")

        # Test authenticated request
        token = data["token"]
        me_res = self.client.get('/api/auth/me', headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(me_res.status_code, 200)
        me_data = json.loads(me_res.data)
        self.assertEqual(me_data["user"]["email"], "patient@smilecraft.com")

    def test_appointment_booking_and_status_update(self):
        """Test booking an appointment and updating status."""
        # Book appointment as public/authenticated
        book_res = self.client.post('/api/appointments', json={
            "patient_name": "Test Patient",
            "patient_email": "test@smilecraft.com",
            "patient_phone": "555-999-8888",
            "service_id": 1,
            "dentist_id": 1,
            "appointment_date": "2026-10-01",
            "appointment_time": "11:30 AM",
            "notes": "Testing appointment"
        })
        self.assertEqual(book_res.status_code, 201)
        book_data = json.loads(book_res.data)
        appt_id = book_data["appointment_id"]
        self.assertIsNotNone(appt_id)

        # Update status
        status_res = self.client.patch(f'/api/appointments/{appt_id}/status', json={
            "status": "Completed"
        })
        self.assertEqual(status_res.status_code, 200)

if __name__ == '__main__':
    unittest.main()

