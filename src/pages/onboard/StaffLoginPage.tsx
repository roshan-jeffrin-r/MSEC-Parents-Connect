import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/common/Badge';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const StaffLoginPage: React.FC = () => {
  const { staffLogin, staffAccounts } = useApp();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      const res = staffLogin(username, password);
      setLoading(false);
      if (res.success) {
        navigate('/teacher');
      } else {
        setErrorMsg(res.message);
      }
    }, 250);
  };

  const handleQuickLogin = (account: typeof staffAccounts[0]) => {
    setUsername(account.username);
    setPassword(account.password);
    const res = staffLogin(account.username, account.password);
    if (res.success) {
      navigate('/teacher');
    }
  };

  return (
    <div className="min-h-[75vh] flex flex-col justify-center items-center py-6 px-4 sm:px-6">
      <div className="w-full max-w-md space-y-4">
        {/* Header Branding */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 flex items-center justify-center text-white shadow-md ring-2 ring-blue-900/20">
            <GraduationCap className="w-6 h-6 text-amber-300" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            MSEC Faculty Authentication
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Meenakshi Sundararajan Engineering College (Autonomous) • Faculty &amp; HOD Portal
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-5 sm:p-6">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-blue-600" />
              Staff Login
            </span>
            <Badge variant="primary" size="sm">Fixed Credentials</Badge>
          </div>

          {errorMsg && (
            <div className="p-2.5 mb-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="username" className="block text-xs font-bold text-slate-800 mb-1">
                Faculty Username / ID <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  name="username"
                  autoComplete="username"
                  required
                  placeholder="e.g. kavitha.cse"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400 font-mono"
                />
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label htmlFor="current-password" className="block text-xs font-bold text-slate-800 mb-1">
                Security Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="current-password"
                  name="password"
                  autoComplete="current-password"
                  required
                  placeholder="Enter staff security password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-8 pr-9 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400 font-mono"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-500 flex items-start gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Staff credentials are provisioned by the Principal and HOD. Passwords cannot be altered in-app.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In as Faculty'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* 1-Click Fast Demonstration Credentials */}
        <div className="bg-slate-100/90 rounded-2xl p-3.5 border border-slate-200/90 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Faculty Demonstration Accounts (Click to Sign In):</span>
          </div>

          <div className="space-y-1.5">
            {staffAccounts.map((acc) => (
              <button
                key={acc.username}
                type="button"
                onClick={() => handleQuickLogin(acc)}
                className="w-full p-2 bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-xl flex items-center justify-between text-left text-xs transition-colors shadow-2xs group"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-slate-900 group-hover:text-blue-700 font-bold">{acc.fullName}</strong>
                    <Badge variant={acc.assignedClass === 'ALL_CSE' ? 'info' : 'primary'} size="sm">
                      {acc.assignedClass}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-slate-500 block font-mono mt-0.5">
                    User: <code className="bg-slate-100 px-1 py-0.2 rounded">{acc.username}</code> • Pass: <code className="bg-slate-100 px-1 py-0.2 rounded">{acc.password}</code>
                  </span>
                </div>
                <span className="text-[11px] text-blue-700 font-bold group-hover:translate-x-0.5 transition-transform shrink-0 ml-2">
                  Sign In →
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            ← Return to Parent Portal
          </button>
        </div>
      </div>
    </div>
  );
};
