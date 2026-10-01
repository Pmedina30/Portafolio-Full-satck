import React, { useState } from 'react';
import { supabase, SupabaseUser } from '../lib/supabase';
import { X, Lock, Mail, User, Eye, EyeOff, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: SupabaseUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Sanitización de inputs contra XSS e inyecciones
  const sanitize = (val: string) => val.replace(/<[^>]*>?/gm, '').trim();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = sanitize(email);
    const cleanName = sanitize(fullName);

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Por favor ingresa un correo electrónico válido.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (mode === 'signup' && cleanName.length < 2) {
      setErrorMsg('Por favor introduce tu nombre completo.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { full_name: cleanName },
          },
        });

        if (error) throw error;
        if (data.user) {
          setSuccessMsg('¡Cuenta creada con éxito! Sesión iniciada.');
          setTimeout(() => {
            onAuthSuccess(data.user!);
            onClose();
          }, 800);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) throw error;
        if (data.user) {
          setSuccessMsg('¡Bienvenido de nuevo!');
          setTimeout(() => {
            onAuthSuccess(data.user!);
            onClose();
          }, 600);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al autenticar. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    setErrorMsg(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) throw error;

      // Obtener la sesión creada
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session?.user) {
        setSuccessMsg(`Autenticado exitosamente con ${provider === 'github' ? 'GitHub' : 'Google'}`);
        setTimeout(() => {
          onAuthSuccess(sessionData.session!.user);
          onClose();
        }, 600);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error en autenticación OAuth');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md no-print transition-all">
      <div
        className="relative w-full max-w-[440px] bg-[#0d0f12] border border-white/10 rounded-[28px] p-7 sm:p-8 text-white"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
        }}
      >
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          title="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Encabezado */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-300">
            <Sparkles className="w-3 h-3 text-[#0071e3]" />
            CVFORGE STUDIO ID
          </div>
          <h2 className="text-[22px] font-semibold tracking-[-0.5px] text-white">
            {mode === 'signin' ? 'Accede a tu Estudio' : 'Crea tu Cuenta Ejecutiva'}
          </h2>
          <p className="text-[12.5px] text-zinc-400 max-w-xs mx-auto">
            {mode === 'signin'
              ? 'Sincroniza tus currículums, analíticas y suscripciones Pro.'
              : 'Empieza gratis y publica tu CV con URL personalizada en segundos.'}
          </p>
        </div>

        {/* Selector Deslizante de Modo con Resorte */}
        <div className="relative flex p-1 bg-white/5 border border-white/10 rounded-full mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 text-[12px] font-medium rounded-full relative z-10 transition-colors duration-200 ${
              mode === 'signin' ? 'text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 text-[12px] font-medium rounded-full relative z-10 transition-colors duration-200 ${
              mode === 'signup' ? 'text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Registrarse
          </button>

          {/* Píldora de Fondo Animada */}
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#1e232b] border border-white/15 rounded-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mode === 'signin' ? 'translate-x-0' : 'translate-x-full'
            }`}
          />
        </div>

        {/* Acceso Rápido OAuth con un Clic */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Botón GitHub */}
          <button
            type="button"
            onClick={() => handleOAuthLogin('github')}
            disabled={loading}
            className="flex items-center justify-center gap-2 h-10 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[12px] font-medium text-white transition-all disabled:opacity-50"
          >
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub</span>
          </button>

          {/* Botón Google */}
          <button
            type="button"
            onClick={() => handleOAuthLogin('google')}
            disabled={loading}
            className="flex items-center justify-center gap-2 h-10 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[12px] font-medium text-white transition-all disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27a7.2 7.2 0 010-4.54V6.58H1.25a11.97 11.97 0 000 10.84l4.03-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
            <span>Google</span>
          </button>
        </div>

        {/* Separador con Hairline */}
        <div className="relative flex items-center justify-center my-4">
          <div className="w-full border-t border-white/10" />
          <span className="absolute px-3 bg-[#0d0f12] text-[10.5px] uppercase font-mono tracking-wider text-zinc-500">
            o con credenciales
          </span>
        </div>

        {/* Mensajes de Alerta / Éxito */}
        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[11.5px] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11.5px] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Formulario de Correo y Contraseña */}
        <form onSubmit={handleEmailAuth} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ej: Sofia Morales"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-white/5 border border-white/10 text-[13px] text-white placeholder-zinc-500 focus:bg-white/10 focus:border-white/30 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="tu.nombre@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-white/5 border border-white/10 text-[13px] text-white placeholder-zinc-500 focus:bg-white/10 focus:border-white/30 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
                Contraseña
              </label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => alert('Se ha enviado un enlace de recuperación a tu correo')}
                  className="text-[11px] text-[#0071e3] hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 pl-9 pr-10 rounded-xl bg-white/5 border border-white/10 text-[13px] text-white placeholder-zinc-500 focus:bg-white/10 focus:border-white/30 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 mt-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] active:bg-[#0062c4] text-white text-[13px] font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 select-none"
            style={{ boxShadow: 'none' }}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Autenticando con Supabase...</span>
              </>
            ) : (
              <span>{mode === 'signin' ? 'Iniciar Sesión' : 'Crear Cuenta Gratuita'}</span>
            )}
          </button>
        </form>

        {/* Footer del Modal */}
        <p className="text-[11px] text-center text-zinc-500 mt-5 leading-relaxed">
          Protegido por Supabase Auth & JWT seguro. Al continuar, aceptas los{' '}
          <span className="text-zinc-400 hover:underline cursor-pointer">Términos de Servicio</span> y{' '}
          <span className="text-zinc-400 hover:underline cursor-pointer">Política de Privacidad</span>.
        </p>
      </div>
    </div>
  );
};
