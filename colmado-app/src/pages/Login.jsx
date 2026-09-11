import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { 
  Store, 
  Lock, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Info 
} from "lucide-react";

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("pmedina@colmadopro.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginWithEmail, loginWithGoogle, loginAsPowerUser, isFirebaseConfigured } = useAuth();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      if (onLoginSuccess) onLoginSuccess();
    } catch {
      setError("Error al iniciar sesión: verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      if (onLoginSuccess) onLoginSuccess();
    } catch {
      setError("Error con Google Sign-In. Prueba el botón Power User.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role) => {
    loginAsPowerUser(role);
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-xl shadow-emerald-500/30 text-white">
            <Store className="w-9 h-9" />
          </div>
        </div>
        <h2 className="mt-5 text-center text-3xl font-black tracking-tight text-white">
          Colmado<span className="text-emerald-400">Pro</span>
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Plataforma de Control de Ventas, Inventario & KPIs
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white/95 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-white/20">
          {/* Quick Power User Badge */}
          <div className="mb-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
            <div className="p-1.5 bg-emerald-600 text-white rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1 text-xs text-emerald-900">
              <p className="font-bold">Acceso Rápido para Portafolio:</p>
              <p className="text-emerald-700 mt-0.5">
                Ingresa con 1 click como <strong>Power User (Pablo Medina)</strong> con permisos totales de administración.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
              {error}
            </div>
          )}

          {/* Direct 1-Click Power User Button */}
          <button
            onClick={() => handleQuickLogin("admin")}
            className="w-full mb-4 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition active:scale-98"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-200" />
            <span>Entrar como Power User (Pablo Medina)</span>
            <ArrowRight className="w-4 h-4 text-emerald-200 ml-auto" />
          </button>

          {/* Google Auth Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full mb-6 py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-750 font-semibold text-sm flex items-center justify-center gap-3 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continuar con Google</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-semibold">O con correo de colmado</span>
            </div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  placeholder="usuario@colmadopro.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition"
            >
              {loading ? "Accediendo..." : "Iniciar Sesión"}
            </button>
          </form>

          {/* Secondary Role Access */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>¿Quieres probar rol Cajero?</span>
            <button
              type="button"
              onClick={() => handleQuickLogin("cashier")}
              className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Entrar como Cajero →
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <Info className="w-3.5 h-3.5" />
          <span>
            {isFirebaseConfigured
              ? "Conectado a Firebase Cloud Firestore"
              : "Modo Demostración Activo con persistencia local"}
          </span>
        </div>
      </div>
    </div>
  );
}

