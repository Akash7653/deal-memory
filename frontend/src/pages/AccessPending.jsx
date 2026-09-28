import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Clock, ShieldAlert, RefreshCw, LogOut, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AccessPending() {
  const { user, company, refreshSession, logout } = useAuth();
  const [checking, setChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const navigate = useNavigate();

  const handleCheckStatus = async () => {
    setChecking(true);
    setStatusMessage('');
    try {
      const res = await refreshSession();
      if (res && res.company && res.company.status === 'approved') {
        setStatusMessage('Your company has been approved! Redirecting to workspace...');
        setTimeout(() => {
          navigate('/app/dashboard');
        }, 1200);
      } else {
        setStatusMessage('Your access request is currently pending administrator review.');
      }
    } catch (e) {
      console.error(e);
      setStatusMessage('Unable to verify status at this moment.');
    } finally {
      setChecking(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-800 dark:text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 mb-4 shadow-lg shadow-amber-500/5">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          Access Request Pending
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Your company access request has been submitted.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xl border border-slate-200 dark:border-slate-800 sm:rounded-2xl sm:px-10">
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-5 mb-6">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {company?.name || 'Company Account'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Registered by: <span className="text-slate-700 dark:text-slate-300 font-medium">{user?.email || 'N/A'}</span>
                </p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                  Status: Pending Administrator Approval
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
            <p>
              To ensure strict multi-tenant data isolation and protect relationship memory banks, new company workspaces require review by a DealMemory platform administrator before activation.
            </p>
            <p>
              Once approved, your company will receive an isolated Hindsight memory namespace and your team will have full access to DealMemory intelligence.
            </p>
          </div>

          {statusMessage && (
            <div className={`p-3.5 rounded-xl text-xs font-medium mb-6 flex items-center gap-2 ${
              statusMessage.includes('approved')
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {statusMessage}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={handleCheckStatus}
              disabled={checking}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 active:scale-[0.98] transition-all disabled:opacity-50 shadow-md shadow-purple-600/20"
            >
              <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
              {checking ? 'Checking Status...' : 'Check Approval Status'}
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
