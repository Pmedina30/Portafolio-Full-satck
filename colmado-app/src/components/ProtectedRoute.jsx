import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && currentUser.role !== "admin") {
    return (
      <div className="p-8 text-center bg-red-50 text-red-700 rounded-xl m-6">
        <h2 className="text-xl font-bold">Acceso Restringido</h2>
        <p className="mt-2 text-sm">Esta sección requiere permisos de Administrador / Power User.</p>
      </div>
    );
  }

  return children;
}

