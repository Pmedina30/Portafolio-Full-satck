import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import Inventory from "./pages/Inventory";

function MainApp() {
  const { currentUser } = useAuth();
  const [currentTab, setCurrentTab] = useState("dashboard"); // 'dashboard' | 'pos' | 'inventory'

  if (!currentUser) {
    return <Login onLoginSuccess={() => setCurrentTab("dashboard")} />;
  }

  return (
    <Layout currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === "dashboard" && <Dashboard onNavigate={(tab) => setCurrentTab(tab)} />}
      {currentTab === "pos" && <Sales onNavigate={(tab) => setCurrentTab(tab)} />}
      {currentTab === "inventory" && <Inventory onNavigate={(tab) => setCurrentTab(tab)} />}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

