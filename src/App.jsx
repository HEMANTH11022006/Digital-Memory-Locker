import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './hooks/AuthContext';

import Landing from './pages/Landing';
import Auth from './pages/Auth';
import LockScreen from './pages/LockScreen';
import Dashboard from './pages/Dashboard';
import AddMemory from './pages/AddMemory';
import MemoryDetail from './pages/MemoryDetail';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children }) => {
  const { user, locked } = useAuth();
  
  if (!user) return <Navigate to="/auth" />;
  if (locked) return <Navigate to="/lock" />;
  
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 selection:bg-indigo-500/30">
      <Navbar />
      <main className="flex-1 overflow-x-hidden pt-16">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
          <Route path="/lock" element={user ? <LockScreen /> : <Navigate to="/auth" />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/add" element={<ProtectedRoute><AddMemory /></ProtectedRoute>} />
          <Route path="/memory/:id" element={<ProtectedRoute><MemoryDetail /></ProtectedRoute>} />
        </Routes>
      </main>
      <Toaster position="bottom-center" toastOptions={{
        style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #334155' }
      }} />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
