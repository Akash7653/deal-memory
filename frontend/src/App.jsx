import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AccessPending from './pages/AccessPending';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRequests from './pages/admin/AdminRequests';
import AdminCompanies from './pages/admin/AdminCompanies';
import AdminCompanyDetail from './pages/admin/AdminCompanyDetail';
import AdminUsers from './pages/admin/AdminUsers';
import AdminConversations from './pages/admin/AdminConversations';
import AdminActivity from './pages/admin/AdminActivity';

// Company Workspace Pages
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import DealOverview from './pages/DealOverview';
import MemoryTimeline from './pages/MemoryTimeline';
import MeetingPrep from './pages/MeetingPrep';
import AiAgent from './pages/AiAgent';
import AddInteraction from './pages/AddInteraction';
import History from './pages/History';
import CompanySupport from './pages/CompanySupport';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* 1. Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/access-pending" element={<AccessPending />} />

            {/* 2. Admin Authentication */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* 3. Protected Admin Portal */}
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="requests" element={<AdminRequests />} />
              <Route path="companies" element={<AdminCompanies />} />
              <Route path="companies/:companyId" element={<AdminCompanyDetail />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="conversations" element={<AdminConversations />} />
              <Route path="activity" element={<AdminActivity />} />
            </Route>

            {/* 4. Company Workspace Routes (/app/*) */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="customers" element={<Customers />} />
              <Route path="deals" element={<DealOverview />} />
              <Route path="deals/:id" element={<DealOverview />} />
              <Route path="memory" element={<MemoryTimeline />} />
              <Route path="learning" element={<MemoryTimeline />} />
              <Route path="meeting-prep" element={<MeetingPrep />} />
              <Route path="ai" element={<AiAgent />} />
              <Route path="history" element={<History />} />
              <Route path="support" element={<CompanySupport />} />
              <Route path="add-interaction" element={<AddInteraction />} />
            </Route>

            {/* 5. Backwards-Compatible Workspace Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/deal" element={<DealOverview />} />
              <Route path="/deals" element={<DealOverview />} />
              <Route path="/deals/:id" element={<DealOverview />} />
              <Route path="/timeline" element={<MemoryTimeline />} />
              <Route path="/memory" element={<MemoryTimeline />} />
              <Route path="/meeting-prep" element={<MeetingPrep />} />
              <Route path="/agent" element={<AiAgent />} />
              <Route path="/ai" element={<AiAgent />} />
              <Route path="/history" element={<History />} />
              <Route path="/support" element={<CompanySupport />} />
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
