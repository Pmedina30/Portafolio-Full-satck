import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';
import { api, getStoredUser } from './api';

export default function App() {
  const [user, setUser] = useState(getStoredUser());
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'dashboard'
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [services, setServices] = useState([]);
  const [dentists, setDentists] = useState([]);

  // Fetch public data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const srvRes = await api.getServices();
        setServices(srvRes.services || []);
      } catch (e) {
        console.warn('Could not fetch services:', e);
      }

      try {
        const docRes = await api.getDentists();
        setDentists(docRes.dentists || []);
      } catch (e) {
        console.warn('Could not fetch dentists:', e);
      }
    }
    loadData();
  }, []);

  const handleLogin = async (email, password) => {
    const res = await api.login(email, password);
    setUser(res.user);
    setCurrentView('dashboard');
  };

  const handleRegister = async (name, email, password, phone, role) => {
    const res = await api.register(name, email, password, phone, role);
    setUser(res.user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setCurrentView('landing');
  };

  const handleBookAppointment = async (appointmentData) => {
    return await api.bookAppointment(appointmentData);
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleBookClick = () => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
    }
    setTimeout(() => {
      const el = document.getElementById('booking');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar 
        user={user}
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onBookClick={handleBookClick}
      />

      <main className="flex-1">
        {currentView === 'landing' ? (
          <LandingPage 
            services={services}
            dentists={dentists}
            onBookAppointment={handleBookAppointment}
            onOpenAuth={handleOpenAuth}
            user={user}
          />
        ) : (
          <Dashboard 
            user={user}
            onBookNewClick={handleBookClick}
            onLogout={handleLogout}
          />
        )}
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
}

