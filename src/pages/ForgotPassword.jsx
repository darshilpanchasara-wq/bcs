import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        setSubmitted(true);
        showToast(res.data.message, 'success');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 pb-24">
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-confectionery-2 border border-outline-variant/60 flex flex-col gap-5">
        <div className="text-center flex flex-col items-center gap-1.5">
          <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-primary mb-1">
            <span className="material-symbols-outlined text-[24px]">lock_reset</span>
          </div>
          <h1 className="font-headline text-2xl font-bold text-on-surface">
            Reset Password
          </h1>
          <p className="font-body text-xs text-secondary">
            Enter your email to receive a password reset link.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 rounded-2xl bg-green-50 text-green-800 text-xs text-center border border-green-200">
            <p className="font-bold text-sm mb-1">Link Sent!</p>
            <p>If an account exists for {email}, a recovery link has been dispatched.</p>
            <Link to="/login" className="inline-block mt-3 text-primary font-bold underline">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. pooja@bhuvneshwaricakes.com"
                className="w-full h-11 px-3.5 mt-1 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/60 outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full h-12 rounded-full bg-primary hover:bg-primary-container text-on-primary font-bold text-sm shadow-md active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="text-center text-xs text-secondary border-t border-surface-container-high/60 pt-4">
          Remember your password?{' '}
          <Link to="/login" className="font-bold text-primary hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
