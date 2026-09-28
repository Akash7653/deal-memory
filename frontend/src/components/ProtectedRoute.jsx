import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Database } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isPending, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-slate-800 dark:text-slate-200">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-700 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-600/30 mb-4 animate-pulse">
          <Database size={24} className="text-white" />
        </div>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Verifying DealMemory workspace...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If this user is an admin accidentally hitting company routes, let them go to /admin
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  // If company or user registration is still pending approval, redirect to access-pending
  if (isPending && location.pathname !== '/access-pending') {
    return <Navigate to="/access-pending" replace />;
  }

  return children;
}
