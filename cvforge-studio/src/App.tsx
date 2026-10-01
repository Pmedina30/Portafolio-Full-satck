import React, { useState, useEffect } from 'react';
import { ResumeData, TemplateType, ViewMode } from './types';
import { INITIAL_RESUME_DATA } from './data/mockData';
import { supabase, SupabaseUser } from './lib/supabase';
import { FloatingNavbar } from './components/FloatingNavbar';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { SplitEditor } from './components/SplitEditor';
import { PublicResumeView } from './components/PublicResumeView';
import { DashboardAnalytics } from './components/DashboardAnalytics';
import { ProCheckoutModal } from './components/ProCheckoutModal';
import { AuthModal } from './components/AuthModal';
import { CheckCircle2 } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_DATA);
  const [template, setTemplate] = useState<TemplateType>('cupertino_minimal');
  const [isPro, setIsPro] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Inicializar y escuchar estado de autenticación con Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser(data.session.user);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleCheckoutSuccess = () => {
    setIsPro(true);
    setIsCheckoutOpen(false);
    showToast('¡Plan Pro activado! Marca de agua eliminada y descargas en alta resolución desbloqueadas.');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    showToast('Has cerrado sesión correctamente.');
  };

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] font-sans selection:bg-[#1d1d1f] selection:text-white flex flex-col justify-between">
      {/* Toast Notification Flotante */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-[#1d1d1f] text-white px-5 py-2.5 rounded-full text-[12.5px] font-medium flex items-center gap-2 border border-white/20 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navbar Flotante Apple White Gallery (Fondo Oscuro Translúcido con Resorte y Auth) */}
      <FloatingNavbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isPro={isPro}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user}
        onSignOut={handleSignOut}
      />

      {/* Renderizado de Vistas según la navegación activa */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <>
            <HeroSection
              onNavigate={(view) => {
                setCurrentView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenCheckout={() => setIsCheckoutOpen(true)}
            />
            <FeaturesSection
              onNavigate={(view) => {
                setCurrentView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </>
        )}

        {currentView === 'editor' && (
          <SplitEditor
            resumeData={resumeData}
            setResumeData={setResumeData}
            template={template}
            setTemplate={setTemplate}
            isPro={isPro}
            onOpenCheckout={() => setIsCheckoutOpen(true)}
            onViewPublicProfile={() => setCurrentView('public_profile')}
          />
        )}

        {currentView === 'public_profile' && (
          <PublicResumeView
            resumeData={resumeData}
            template={template}
            isPro={isPro}
            onOpenCheckout={() => setIsCheckoutOpen(true)}
            onBackToEditor={() => setCurrentView('editor')}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardAnalytics
            isPro={isPro}
            onOpenCheckout={() => setIsCheckoutOpen(true)}
            onNavigateToEditor={() => setCurrentView('editor')}
            onNavigateToPublic={() => setCurrentView('public_profile')}
          />
        )}
      </main>

      {/* Modal de Autenticación de Supabase (Log In & Sign Up) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(authUser) => {
          setUser(authUser);
          showToast(`¡Sesión iniciada como ${authUser.user_metadata?.full_name || authUser.email}!`);
        }}
      />

      {/* Modal de Checkout Pro Simulado de Stripe */}
      <ProCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
      />

      {/* Footer Minimalista White Gallery */}
      <footer className="bg-white py-12 px-6 border-t border-[#d6d6d6] text-center text-[12px] text-[#86868b] no-print">
        <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-[#1d1d1f] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-sm bg-white" />
            </div>
            <span className="font-semibold text-[#1d1d1f]">CVForge Studio</span>
            <span>— Apple White Gallery Style Reference</span>
          </div>

          <div className="flex gap-6">
            <button onClick={() => setCurrentView('landing')} className="hover:text-[#1d1d1f] transition-colors">
              Inicio
            </button>
            <button onClick={() => setCurrentView('editor')} className="hover:text-[#1d1d1f] transition-colors">
              Estudio
            </button>
            <button onClick={() => setCurrentView('public_profile')} className="hover:text-[#1d1d1f] transition-colors">
              Perfil Público
            </button>
            <button onClick={() => setCurrentView('dashboard')} className="hover:text-[#1d1d1f] transition-colors">
              Analíticas
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
