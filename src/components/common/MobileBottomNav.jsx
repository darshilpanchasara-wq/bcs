import React from 'react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const MobileBottomNav = () => {
  const { itemCount } = useCart();
  const { isAuthenticated } = useAuth();

  const navItems = [
    { to: '/', label: 'Home', icon: 'home' },
    { to: '/shop', label: 'Shop', icon: 'cake' },
    { to: '/cart', label: 'Cart', icon: 'shopping_bag', badge: itemCount },
    { to: isAuthenticated ? '/profile' : '/login', label: 'Profile', icon: 'person' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/90 backdrop-blur-xl border-t border-outline-variant/60 shadow-[0_-4px_16px_rgba(75,46,43,0.05)] pb-safe">
      <div className="h-16 flex items-center justify-around px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center relative py-1 px-3 min-w-[64px] transition-colors ${
                isActive ? 'text-primary' : 'text-secondary hover:text-primary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <span
                    className={`material-symbols-outlined text-[24px] ${isActive ? 'fill' : ''}`}
                  >
                    {item.icon}
                  </span>
                  {item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">
                  {item.label}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-0.5 animate-pulse"></span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
