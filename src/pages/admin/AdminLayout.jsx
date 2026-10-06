import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, isAdmin, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-surface-container-low rounded-3xl border border-outline-variant">
        <span className="material-symbols-outlined text-[48px] text-error mb-2">lock</span>
        <h2 className="font-headline text-2xl font-bold text-on-surface">Restricted Access</h2>
        <p className="font-body text-sm text-secondary mt-1">
          You must have Patisserie Administrator privileges to access this area.
        </p>
        <Link
          to="/"
          className="inline-block mt-4 px-6 py-2.5 rounded-full bg-primary text-white text-xs font-bold"
        >
          Return to Storefront
        </Link>
      </div>
    );
  }

  const menuItems = [
    { to: '/admin', label: 'Dashboard', icon: 'dashboard', end: true },
    { to: '/admin/cakes', label: 'Manage Cakes', icon: 'cake' },
    { to: '/admin/categories', label: 'Categories & Flavors', icon: 'category' },
    { to: '/admin/orders', label: 'Orders & Dispatch', icon: 'local_shipping' },
    { to: '/admin/custom-orders', label: 'Custom Cake Atelier', icon: 'palette' },
    { to: '/admin/coupons', label: 'Coupons & Promos', icon: 'redeem' },
    { to: '/admin/reviews', label: 'Customer Reviews', icon: 'rate_review' },
    { to: '/admin/users', label: 'User Accounts', icon: 'group' },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Admin Top Header */}
      <header className="h-16 bg-surface-container-lowest border-b border-surface-container-high px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center text-on-surface"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>

          <Link to="/" className="flex items-center gap-2">
            <img src="/assets/bcs-logo.png" alt="BCS Logo" className="h-8 w-8 rounded-full object-cover border border-amber-300/40" />
            <span className="font-headline text-lg sm:text-xl font-bold text-on-surface hidden sm:inline">
              BHUVNESHWARI CAKES
            </span>
          </Link>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container uppercase">
            Owner (Darshil Panchasara)
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-xs font-semibold text-secondary hover:text-primary transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">storefront</span>
            <span className="hidden sm:inline">View Storefront</span>
          </Link>
          <div className="h-4 w-px bg-surface-container-high"></div>
          <div className="flex items-center gap-2">
            <img
              src={user?.avatar || '/assets/customer-portrait.png'}
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover border border-primary/20"
            />
            <span className="text-xs font-bold text-on-surface hidden sm:inline">{user?.name}</span>
          </div>
        </div>
      </header>

      {/* Main Admin Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 p-4 border-r border-surface-container-high bg-surface-container-lowest/50 shrink-0">
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-secondary hover:bg-surface-container-low hover:text-on-surface'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-surface-container-high">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-error hover:bg-error-container/20 rounded-2xl transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Log Out
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        {mobileSidebarOpen && (
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <div
              className="w-64 h-full bg-surface-container-lowest p-4 flex flex-col gap-1 shadow-xl animate-in slide-in-from-left duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-surface-container-high mb-2">
                <span className="font-headline font-bold text-base">Admin Menu</span>
                <button onClick={() => setMobileSidebarOpen(false)}>
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
              {menuItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-primary text-on-primary'
                        : 'text-secondary hover:bg-surface-container-low'
                    }`
                  }
                >
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-8 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
