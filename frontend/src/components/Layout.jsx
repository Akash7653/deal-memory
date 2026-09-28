import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  GitBranch,
  CalendarCheck2,
  Bot,
  PlusCircle,
  Clock,
  Search,
  Sparkles,
  Database,
  ShieldCheck,
  Menu,
  X,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  User,
  Sliders,
  MoreHorizontal,
} from 'lucide-react';
import { fetchHealth } from '../api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Layout() {
  const { user, logout, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [hindsightStatus, setHindsightStatus] = useState('checking');
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileCompany, setProfileCompany] = useState(user?.company || '');
  const [profileRole, setProfileRole] = useState(user?.role || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const openEditProfile = () => {
    setProfileName(user?.name || '');
    setProfileCompany(user?.company || '');
    setProfileRole(user?.role || 'Enterprise AE');
    setProfileModalOpen(true);
    setUserDropdownOpen(false);
    setMobileMoreOpen(false);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileName.trim()) return;
    setSavingProfile(true);
    try {
      await updateProfile({
        name: profileName.trim(),
        company: profileCompany.trim(),
        role: profileRole.trim(),
      });
      setProfileModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  useEffect(() => {
    fetchHealth()
      .then((data) => {
        if (data.hindsight_configured) {
          setHindsightStatus('connected');
        } else {
          setHindsightStatus('unconfigured');
        }
      })
      .catch(() => setHindsightStatus('offline'));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleNavScrollToTop = () => {
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      mainEl.scrollTop = 0;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const navItems = [
    { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/deal', label: 'Deals', icon: Building2 },
    { to: '/timeline', label: 'Memory', icon: GitBranch, badge: 'Hindsight' },
    { to: '/meeting-prep', label: 'Meeting Prep', icon: CalendarCheck2, badge: 'AI Brief' },
    { to: '/agent', label: 'AI Agent', icon: Bot, badge: 'Grounded' },
    { to: '/history', label: 'History', icon: Clock },
    { to: '/add-interaction', label: 'Add Interaction', icon: PlusCircle },
  ];

  // Initials for avatar
  const getInitials = (name) => {
    if (!name) return 'DM';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const userInitials = getInitials(user?.name);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-150">
      {/* Top Header Floating Island with top margin */}
      <div className="pt-2 sm:pt-4 px-2.5 sm:px-6 pb-2 sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md">
        <header className="h-14 sm:h-16 border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl px-3 sm:px-6 flex items-center justify-between shadow-sm dark:shadow-xl dark:shadow-black/20">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-shrink-0">
            <NavLink to="/dashboard" className="flex items-center space-x-2 sm:space-x-2.5 flex-shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center shadow-md shadow-indigo-600/20 text-white font-black text-base sm:text-lg flex-shrink-0">
                <Database size={18} className="text-white" />
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                  DealMemory
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  Hindsight
                </span>
              </div>
            </NavLink>
          </div>

        {/* Global Search & Active Deal indicator */}
        <div className="hidden lg:flex items-center space-x-3 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-400">
          <Search size={14} className="text-slate-500 dark:text-slate-400" />
          <span>Active Deal:</span>
          <span className="text-slate-900 dark:text-white font-semibold bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 shadow-xs">
            ACME Corp ($120K)
          </span>
        </div>


          {/* Right side: Hindsight status, Theme toggle, User Profile */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Hindsight connection badge */}
            <div className="hidden sm:flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-full text-xs">
              {hindsightStatus === 'connected' ? (
                <span className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Hindsight Connected</span>
                </span>
              ) : hindsightStatus === 'offline' ? (
                <span className="flex items-center space-x-1.5 text-rose-600 dark:text-rose-400 font-semibold">
                  <span className="w-2 h-2 rounded-full border border-rose-500" />
                  <span>Offline</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                  <span className="w-2 h-2 rounded-full border border-amber-500 animate-spin" />
                  <span>Connecting...</span>
                </span>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-700/60 cursor-pointer shadow-xs flex-shrink-0"
            >
              {theme === 'dark' ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-indigo-600" />}
            </button>

            {/* User Profile dropdown menu with matching dimensions and contained bounds */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="h-9 px-1.5 sm:px-2 flex items-center space-x-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60 transition-colors cursor-pointer shadow-xs flex-shrink-0"
                title="Account menu"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center font-bold text-[11px] text-white shadow-xs flex-shrink-0">
                  {userInitials}
                </div>
                <div className="hidden md:block text-left text-xs pr-1">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[100px] leading-tight">{user?.name || 'User'}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{user?.role || 'AE'}</div>
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 text-xs animate-fade-in">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{user?.name || 'Account'}</div>
                    <div className="text-slate-500 dark:text-slate-400 truncate">{user?.email}</div>
                    <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">{user?.company || 'Personal Workspace'}</div>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={openEditProfile}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                    >
                      <User size={14} className="text-indigo-500 dark:text-indigo-400" />
                      <span>Edit Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        toggleTheme();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                    >
                      <span className="flex items-center space-x-2">
                        {theme === 'dark' ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-indigo-600" />}
                        <span>Theme</span>
                      </span>
                      <span className="capitalize text-slate-500 dark:text-slate-400 text-[11px] font-semibold">{theme}</span>
                    </button>
                    <NavLink
                      to="/history"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    >
                      <Clock size={14} />
                      <span>My Activity History</span>
                    </NavLink>
                  </div>
                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-semibold cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Top Nav Sign Out Button (Desktop only, mobile has bottom nav logout) */}
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 whitespace-nowrap"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for Desktop */}
        <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hidden md:flex flex-col justify-between p-4 transition-colors">
          <div className="space-y-6">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400 px-3 mb-2">
                Sales Navigation
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                          isActive
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 font-bold shadow-xs'
                            : 'text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-medium'
                        }`
                      }
                    >
                      <div className="flex items-center space-x-3">
                        <Icon size={17} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-slate-300 border border-indigo-200 dark:border-slate-700">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Core Differentiator Callout Card */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl text-xs space-y-2 shadow-xs">
              <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-[11px]">
                <Sparkles size={14} />
                <span>Memory → Outcome → Learning</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                DealMemory tracks whether previous strategies worked and learns for future interactions.
              </p>
              <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
                <span className="truncate max-w-[120px] font-medium">User: {user?.name}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Isolated</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <div className="flex items-center justify-between text-slate-800 dark:text-slate-300 font-semibold">
                <span>Hindsight 0.10.1</span>
                <ShieldCheck size={14} className="text-emerald-500" />
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Vectorize persistent cognitive architecture
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl border border-rose-200 dark:border-slate-800 bg-rose-50/70 dark:bg-slate-900/60 text-xs font-bold text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors cursor-pointer shadow-xs"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area: pb-24 on mobile so bottom bar never obscures content! */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 transition-colors">
          <Outlet />
        </main>
      </div>

      {/* ========================================================================= */}
      {/* FIXED MOBILE BOTTOM NAVIGATION BAR (Home, Deal, Memory, AI, More, Logout) */}
      {/* ========================================================================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-lg shadow-2xl safe-area-bottom">
        <div className="grid grid-cols-6 w-full max-w-lg mx-auto px-1 py-1.5 items-center">
          <NavLink
            to="/dashboard"
            onClick={handleNavScrollToTop}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-0.5 rounded-lg text-[10px] font-medium transition-colors text-center ${
                isActive ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`
            }
          >
            <LayoutDashboard size={18} className="mb-0.5" />
            <span className="truncate w-full">Home</span>
          </NavLink>

          <NavLink
            to="/deal"
            onClick={handleNavScrollToTop}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-0.5 rounded-lg text-[10px] font-medium transition-colors text-center ${
                isActive ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`
            }
          >
            <Building2 size={18} className="mb-0.5" />
            <span className="truncate w-full">Deal</span>
          </NavLink>

          <NavLink
            to="/timeline"
            onClick={handleNavScrollToTop}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-0.5 rounded-lg text-[10px] font-medium transition-colors text-center ${
                isActive ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`
            }
          >
            <GitBranch size={18} className="mb-0.5" />
            <span className="truncate w-full">Memory</span>
          </NavLink>

          <NavLink
            to="/agent"
            onClick={handleNavScrollToTop}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-0.5 rounded-lg text-[10px] font-medium transition-colors text-center ${
                isActive ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`
            }
          >
            <Bot size={18} className="mb-0.5" />
            <span className="truncate w-full">AI</span>
          </NavLink>

          <button
            onClick={() => setMobileMoreOpen(true)}
            className={`flex flex-col items-center justify-center py-1 px-0.5 rounded-lg text-[10px] font-medium transition-colors cursor-pointer text-center ${
              mobileMoreOpen ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <MoreHorizontal size={18} className="mb-0.5" />
            <span className="truncate w-full">More</span>
          </button>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="flex flex-col items-center justify-center py-1 px-0.5 rounded-lg text-[10px] font-bold text-rose-700 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 transition-colors cursor-pointer text-center"
          >
            <LogOut size={18} className="mb-0.5 text-rose-600 dark:text-rose-400" />
            <span className="truncate w-full">Logout</span>
          </button>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* MOBILE "MORE" MENU DRAWER / BOTTOM SHEET                                  */}
      {/* ========================================================================= */}
      {mobileMoreOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex flex-col justify-end animate-fade-in">
          <div
            className="flex-1"
            onClick={() => setMobileMoreOpen(false)}
          />
          <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            {/* Header & close */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center font-bold text-white text-sm shadow-sm">
                  {userInitials}
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{user?.name || 'Account'}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</div>
                </div>
              </div>
              <button
                onClick={() => setMobileMoreOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Additional Navigation Links */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2 mb-1">
                More Features
              </div>
              <NavLink
                to="/meeting-prep"
                onClick={() => setMobileMoreOpen(false)}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 font-semibold border border-slate-200/60 dark:border-slate-800 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <CalendarCheck2 size={18} className="text-indigo-600 dark:text-indigo-400" />
                  <span>Meeting Prep Brief</span>
                </div>
                <ChevronRight size={16} className="text-slate-400" />
              </NavLink>

              <NavLink
                to="/history"
                onClick={() => setMobileMoreOpen(false)}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 font-semibold border border-slate-200/60 dark:border-slate-800 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Clock size={18} className="text-indigo-600 dark:text-indigo-400" />
                  <span>My Activity & AI History</span>
                </div>
                <ChevronRight size={16} className="text-slate-400" />
              </NavLink>

              <NavLink
                to="/add-interaction"
                onClick={() => setMobileMoreOpen(false)}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 font-semibold border border-slate-200/60 dark:border-slate-800 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <PlusCircle size={18} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Add Interaction / Outcome</span>
                </div>
                <ChevronRight size={16} className="text-slate-400" />
              </NavLink>

              <button
                onClick={openEditProfile}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 font-semibold border border-slate-200/60 dark:border-slate-800 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <User size={18} className="text-indigo-600 dark:text-indigo-400" />
                  <span>Edit Profile</span>
                </div>
                <ChevronRight size={16} className="text-slate-400" />
              </button>
            </div>

            {/* Quick Actions: Theme */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                onClick={() => {
                  toggleTheme();
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-sm text-slate-800 dark:text-slate-200 cursor-pointer font-medium"
              >
                <span className="flex items-center space-x-2.5">
                  {theme === 'dark' ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-indigo-600" />}
                  <span>Theme</span>
                </span>
                <span className="capitalize text-xs font-semibold px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-600 shadow-xs">
                  {theme}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT USER PROFILE MODAL                                                   */}
      {/* ========================================================================= */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                  <User size={16} />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Edit Your Profile</h3>
              </div>
              <button
                onClick={() => setProfileModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="e.g. Akash Koravena"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={profileCompany}
                  onChange={(e) => setProfileCompany(e.target.value)}
                  placeholder="e.g. Enterprise CRM Corp"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Role / Title
                </label>
                <input
                  type="text"
                  value={profileRole}
                  onChange={(e) => setProfileRole(e.target.value)}
                  placeholder="e.g. Enterprise AE, VP Sales"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 disabled:opacity-50 cursor-pointer flex items-center space-x-1.5"
                >
                  {savingProfile ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
