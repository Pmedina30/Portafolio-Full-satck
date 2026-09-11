import React, { createContext, useContext, useState } from "react";
import { firebaseRest, isFirebaseConfigured } from "../firebase/config";

const AuthContext = createContext();

const POWER_USER_DEFAULT = {
  uid: "power-user-pmedina",
  email: "pmedina@colmadopro.com",
  displayName: "Pablo Medina",
  role: "admin", // Power User with full privileges
  photoURL: null,
  businessName: "Colmado San Rafael",
  isPowerUser: true
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("colmadopro_user");
    return saved ? JSON.parse(saved) : POWER_USER_DEFAULT; // Default to Power User for instant access
  });

  // Email / Password Login (Calls Firebase REST if configured, else instant demo login)
  const loginWithEmail = async (email, password) => {
    if (isFirebaseConfigured) {
      try {
        const res = await firebaseRest.signInWithPassword(email, password);
        const mapped = {
          uid: res.localId,
          email: res.email,
          displayName: res.displayName || "Pablo Medina (Admin)",
          role: "admin",
          isPowerUser: true
        };
        setCurrentUser(mapped);
        localStorage.setItem("colmadopro_user", JSON.stringify(mapped));
        return mapped;
      } catch (err) {
        console.warn("Firebase sign-in failed, using local power user:", err);
      }
    }

    // Local demo sign-in
    const mapped = {
      ...POWER_USER_DEFAULT,
      email: email || POWER_USER_DEFAULT.email
    };
    setCurrentUser(mapped);
    localStorage.setItem("colmadopro_user", JSON.stringify(mapped));
    return mapped;
  };

  // Google Sign-In Demo / Fallback
  const loginWithGoogle = async () => {
    const mapped = {
      ...POWER_USER_DEFAULT,
      email: "pmedina.developer@gmail.com",
      displayName: "Pablo Medina (Google Auth)"
    };
    setCurrentUser(mapped);
    localStorage.setItem("colmadopro_user", JSON.stringify(mapped));
    return mapped;
  };

  // Direct Power User Login
  const loginAsPowerUser = (role = "admin") => {
    const user = role === "admin" ? POWER_USER_DEFAULT : {
      uid: "cajero-01",
      email: "cajero@colmadopro.com",
      displayName: "Cajero de Turno",
      role: "cashier",
      photoURL: null,
      isPowerUser: false
    };
    setCurrentUser(user);
    localStorage.setItem("colmadopro_user", JSON.stringify(user));
    return user;
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("colmadopro_user");
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      loginWithEmail,
      loginWithGoogle,
      loginAsPowerUser,
      logout,
      isFirebaseConfigured
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

