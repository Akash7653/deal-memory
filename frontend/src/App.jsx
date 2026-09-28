import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Pages
import Dashboard from './pages/Dashboard';
import DealOverview from './pages/DealOverview';
import MemoryTimeline from './pages/MemoryTimeline';
import MeetingPrep from './pages/MeetingPrep';
import AiAgent from './pages/AiAgent';
import AddInteraction from './pages/AddInteraction';
import History from './pages/History';

import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Authenticated Application */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/deal" element={<DealOverview />} />
              <Route path="/deals" element={<Navigate to="/deal" replace />} />
              <Route path="/deals/:id" element={<DealOverview />} />
              <Route path="/timeline" element={<MemoryTimeline />} />
              <Route path="/memory" element={<Navigate to="/timeline" replace />} />
              <Route path="/meeting-prep" element={<MeetingPrep />} />
              <Route path="/agent" element={<AiAgent />} />
              <Route path="/ai" element={<Navigate to="/agent" replace />} />
              <Route path="/history" element={<History />} />
              <Route path="/add-interaction" element={<AddInteraction />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
