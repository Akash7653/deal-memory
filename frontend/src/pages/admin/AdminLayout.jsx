import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  UserCheck,
  Users,
  MessageSquare,
  Activity,
  ShieldCheck,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  Database,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function AdminLayout() {
  const { adminUser, adminLogout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await adminLogout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/requests', label: 'Access Requests', icon: UserCheck, badge: 'Workflow' },
    { to: '/admin/companies', label: 'Companies', icon: Building2 },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/conversations', label: 'Support Chat', icon: MessageSquare },
    { to: '/admin/activity', label: 'Activity Log', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-150">
      {/* Top Header Floating Island */}
      <div className="pt-2 sm:pt-4 px-2.5 sm:px-6 pb-2 sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md">
        <header className="h-14 sm:h-16 border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl px-3 sm:px-6 flex items-center justify-between shadow-sm dark:shadow-xl dark:shadow-black/20">
          {/* Left Brand */}
          <div className="flex items-center space-x-3">
            <NavLink to="/admin" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform duration-200 text-white font-black text-sm">
                <ShieldCheck size={18} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                    DealMemory
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 uppercase tracking-wider">
                    Admin
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
                  Multi-Tenant Platform Hub
                </span>
              </div>
            </NavLink>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* View App Link */}
            <NavLink
              to="/app/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
              title="Open Company Portal in new tab"
            >
              <span>View Workspace</span>
              <ExternalLink size={12} />
            </NavLink>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              type="button"
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-purple-600" />}
            </button>

            {/* Admin Avatar & Sign Out */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center text-xs font-bold text-purple-600 dark:text-purple-400">
                AD
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {adminUser?.name || 'Super Admin'}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Platform Admin
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl flex flex-col space-y-1 animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-bold">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-2.5 sm:px-6 pb-8 gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 space-y-2 pt-2">
          <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-3 shadow-sm backdrop-blur">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-2">
              Platform Administration
            </p>
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-100'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Quick Info Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/5 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck size={16} className="text-purple-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Multi-Tenant Isolation
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Every company operates in a strict, cryptographically verified tenant namespace with isolated Hindsight memory banks.
            </p>
          </div>
        </aside>

        {/* Content Outlet */}
        <main className="flex-1 min-w-0 pt-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
