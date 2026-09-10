/**
 * API Service layer communicating with Flask Python REST Backend.
 */

const API_BASE = '/api';

export function getAuthToken() {
  return localStorage.getItem('smilecraft_token');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('smilecraft_token', token);
  } else {
    localStorage.removeItem('smilecraft_token');
  }
}

export function getStoredUser() {
  const data = localStorage.getItem('smilecraft_user');
  try {
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (user) {
    localStorage.setItem('smilecraft_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('smilecraft_user');
  }
}

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'An error occurred during request.');
  }
  return data;
}

export const api = {
  // Authentication
  async login(email, password) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    setAuthToken(data.token);
    setStoredUser(data.user);
    return data;
  },

  async register(name, email, password, phone, role = 'patient') {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone, role })
    });
    setAuthToken(data.token);
    setStoredUser(data.user);
    return data;
  },

  async getCurrentUser() {
    return request('/auth/me');
  },

  logout() {
    setAuthToken(null);
    setStoredUser(null);
  },

  // Public Clinic Data
  async getServices() {
    return request('/services');
  },

  async getDentists() {
    return request('/dentists');
  },

  async getStats() {
    return request('/stats');
  },

  // Appointments
  async getAppointments() {
    return request('/appointments');
  },

  async bookAppointment(appointmentData) {
    return request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData)
    });
  },

  async updateAppointmentStatus(appointmentId, status) {
    return request(`/appointments/${appointmentId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  // Treatments History
  async getTreatments() {
    return request('/treatments');
  }
};

