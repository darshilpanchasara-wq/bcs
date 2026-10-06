import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      showToast('Please provide email and password.', 'error');
      setLoginError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setLoginError('');
    const result = await login(email, password);
    setLoading(false);

    if (result?.success) {
      navigate(from, { replace: true });
    } else {
      setLoginError(result?.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleQuickLogin = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoginError('');
    setLoading(true);
    const result = await login(demoEmail, demoPass);
    setLoading(false);

    if (result?.success) {
      navigate(from, { replace: true });
    } else {
      setLoginError(result?.message || 'Login failed for ' + demoEmail);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 pb-24">
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-confectionery-2 border border-outline-variant/60 flex flex-col gap-5">
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-1.5">
          <img
            src="/assets/bcs-logo.png"
            alt="SHREE BHUVNESHWARI CAKE & SNACKS"
            className="h-16 w-auto object-contain rounded-xl border border-amber-300/40 shadow-sm mb-1"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/logo.png';
            }}
          />
          <h1 className="font-headline text-xl sm:text-2xl font-black text-on-surface">
            SHREE BHUVNESHWARI CAKE & SNACKS
          </h1>
          <p className="font-body text-xs text-secondary">
            Sign in to access your orders, track cake delivery across Gujarat, and manage addresses.
          </p>
        </div>

        {/* Error message */}
        {loginError && (
          <div className="p-3 rounded-xl bg-error/10 border border-error/30 text-error text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{loginError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-secondary">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); setLoginError(''); }}
              placeholder="e.g. admin@bhuvneshwaricakes.com or pooja@bhuvneshwaricakes.com"
              className="w-full h-11 px-3.5 mt-1 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/60 outline-none focus:border-primary"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline font-semibold">
                Forgot Password?
              </Link>
            </div>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
                placeholder="••••••••"
                className="w-full h-11 pl-3.5 pr-10 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/60 outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]"
              >
                {showPassword ? 'visibility_off' : 'visibility'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full h-12 rounded-full bg-primary hover:bg-primary-container text-on-primary font-bold text-sm shadow-md active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <span className="material-symbols-outlined text-[18px]">login</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Helper */}
        <div className="pt-2 border-t border-surface-container-high/60 flex flex-col gap-2 text-center">
          <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
            1-Click Quick Demo Accounts
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('pooja@bhuvneshwaricakes.com', 'customer123')}
              className="py-2 px-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold border border-outline-variant/40 transition-all flex flex-col items-center gap-0.5"
            >
              <span className="font-bold text-primary">Customer (Pooja)</span>
              <span className="text-[10px] text-secondary">pooja@bhuvneshwaricakes.com</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@bhuvneshwaricakes.com', 'admin123')}
              className="py-2 px-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-on-surface text-xs font-semibold border border-primary/30 transition-all flex flex-col items-center gap-0.5"
            >
              <span className="font-bold text-primary">Store Admin</span>
              <span className="text-[10px] text-secondary">admin@bhuvneshwaricakes.com</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px] text-secondary mt-1">
            <button
              type="button"
              onClick={() => handleQuickLogin('pooja@thecakepool.com', 'customer123')}
              className="py-1 px-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 text-secondary"
            >
              Alias: Pooja (Cakepool)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('darshil@bhuvneshwaricakes.com', 'admin123')}
              className="py-1 px-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 text-secondary"
            >
              Founder: Darshil
            </button>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center text-xs text-secondary">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-primary hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
