import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (result?.success) {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 pb-24">
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-confectionery-2 border border-outline-variant/60 flex flex-col gap-5">
        <div className="text-center flex flex-col items-center gap-1.5">
          <img
            src="/assets/bcs-logo.png"
            alt="BHUVNESHWARI CAKES"
            className="h-16 w-16 rounded-full object-cover border border-amber-300/40 shadow-sm mb-1"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/logo.png';
            }}
          />
          <h1 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
            Create an Account
          </h1>
          <p className="font-body text-xs text-secondary">
            Join the Bhuvneshwari Cakes circle to save favorite cakes and track orders.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-secondary">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Pooja Patel"
              className="w-full h-11 px-3.5 mt-1 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/60 outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-secondary">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. pooja@example.com"
              className="w-full h-11 px-3.5 mt-1 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/60 outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-secondary">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98765 43210"
              className="w-full h-11 px-3.5 mt-1 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/60 outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-secondary">
              Password (Min 6 chars) *
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full h-11 px-3.5 mt-1 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/60 outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full h-12 rounded-full bg-primary hover:bg-primary-container text-on-primary font-bold text-sm shadow-md active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center text-xs text-secondary border-t border-surface-container-high/60 pt-4">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-primary hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
