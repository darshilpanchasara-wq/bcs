import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const wishlistCount = user?.wishlist?.length || 0;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(75,46,43,0.05)] border-b border-surface-container-high/70">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Strictly Single-Line Header Bar */}
        <div className="h-16 flex items-center justify-between gap-2 sm:gap-4 flex-nowrap">
          {/* 1. Smaller Brand Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <img
              src="/assets/bcs-logo.png"
              alt="SHREE BHUVNESHWARI"
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-contain shadow-sm border border-amber-300/40 transition-transform group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/logo.png';
              }}
            />
            <div className="flex flex-col">
              <span className="font-headline text-xs sm:text-sm font-black tracking-wider uppercase text-on-surface group-hover:text-primary transition-colors leading-tight whitespace-nowrap">
                SHREE BHUVNESHWARI
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-widest uppercase font-bold text-primary -mt-0.5 whitespace-nowrap">
                CAKE & SNACKS
              </span>
            </div>
          </Link>

          {/* 2. Desktop Navigation Links (Engagement and Sugar Paste removed) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 flex-nowrap whitespace-nowrap">
            <Link
              to="/"
              className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                location.pathname === '/' ? 'text-primary' : 'text-secondary hover:text-primary'
              }`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                location.pathname.startsWith('/shop') && location.pathname === '/shop'
                  ? 'text-primary'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              All Cakes
            </Link>
            <Link
              to="/custom-order"
              className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                location.pathname === '/custom-order' ? 'text-primary' : 'text-secondary hover:text-primary'
              }`}
            >
              Custom Order
            </Link>
            <Link
              to="/shop-details"
              className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                location.pathname === '/shop-details' ? 'text-primary' : 'text-secondary hover:text-primary'
              }`}
            >
              Shop Details
            </Link>
            <Link
              to="/contact"
              className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                location.pathname === '/contact' ? 'text-primary' : 'text-secondary hover:text-primary'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* 3. Search Bar / Popover Toggle */}
          <div className="hidden md:flex items-center relative max-w-[200px] xl:max-w-xs">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[18px] pointer-events-none">
                search
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cakes..."
                className="w-full h-8 pl-8 pr-3 rounded-full bg-surface-container-low text-on-surface placeholder:text-secondary/60 text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 border border-outline-variant/40"
              />
            </form>
          </div>

          {/* 4. Right Side Container: Cart and Login Buttons */}
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0 flex-nowrap">

            {/* Mobile Search Toggle Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden w-8 h-8 flex items-center justify-center text-secondary hover:text-primary rounded-full hover:bg-surface-container-low"
              aria-label="Search"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>

            {/* Wishlist */}
            <Link
              to="/profile"
              aria-label="Wishlist"
              className="w-8 h-8 relative hidden sm:flex items-center justify-center text-secondary hover:text-primary transition-colors rounded-full hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-[20px]">favorite</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[15px] h-[15px] px-1 rounded-full bg-secondary text-surface text-[9px] font-bold leading-none shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Button */}
            <Link
              to="/cart"
              aria-label="Shopping Cart"
              className="relative flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-bold transition-all shadow-sm border border-outline-variant/50"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">shopping_bag</span>
              <span className="hidden sm:inline uppercase text-[11px] font-bold">Cart</span>
              {itemCount > 0 && (
                <span className="flex items-center justify-center min-w-[17px] h-[17px] px-1 rounded-full bg-primary text-white text-[10px] font-bold shadow-sm animate-pulse">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Login / User Account Button */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all focus:outline-none"
                    aria-label="User Menu"
                  >
                    <span className="material-symbols-outlined text-[18px]">account_circle</span>
                    <span className="hidden sm:inline text-xs font-bold uppercase truncate max-w-[90px]">
                      {user?.name?.split(' ')[0] || 'Account'}
                    </span>
                    <span className="material-symbols-outlined text-[14px]">expand_more</span>
                  </button>

                  {/* Profile Dropdown */}
                  {profileDropdown && (
                    <div
                      className="absolute right-0 mt-2 w-52 bg-surface-container-lowest rounded-2xl shadow-confectionery-3 border border-outline-variant py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                      onClick={() => setProfileDropdown(false)}
                    >
                      <div className="px-4 py-2 border-b border-surface-container-high">
                        <p className="font-bold text-xs text-on-surface uppercase truncate">{user.name}</p>
                        <p className="text-[11px] text-secondary truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-primary-container text-white text-[9px] font-bold uppercase">
                            Administrator
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase text-primary hover:bg-surface-container-low transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">dashboard</span>
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/orders"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                        My Orders
                      </Link>

                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">person</span>
                        Account Settings
                      </Link>

                      <div className="border-t border-surface-container-high my-1"></div>

                      <button
                        onClick={logout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase text-error hover:bg-error-container/20 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">logout</span>
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link
                    to="/login"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary hover:bg-primary-container text-white text-xs font-bold uppercase tracking-wider transition-transform active:scale-95 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">login</span>
                    <span>Log In</span>
                  </Link>
                  <Link
                    to="/register"
                    className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-bold uppercase tracking-wider transition-all border border-outline-variant/40"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-8 h-8 flex items-center justify-center text-on-surface hover:bg-surface-container-low rounded-full"
              aria-label="Open Menu"
            >
              <span className="material-symbols-outlined text-[22px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Overlay Bar */}
        {searchOpen && (
          <div className="md:hidden py-2 border-t border-surface-container-high animate-in fade-in duration-150">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[18px]">
                search
              </span>
              <input
                type="search"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cakes, flavors, snacks..."
                className="w-full h-9 pl-9 pr-4 rounded-full bg-surface-container-low text-xs text-on-surface placeholder:text-secondary/60 outline-none border border-outline-variant focus:border-primary"
              />
            </form>
          </div>
        )}

        {/* Mobile Drawer Menu (Strictly without Engagement and Sugar Paste) */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-surface-container-lowest border-t border-surface-container-high py-3 px-2 flex flex-col gap-1.5 rounded-b-2xl shadow-confectionery-2 animate-in fade-in duration-150">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-on-surface hover:bg-surface-container-low rounded-xl"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-on-surface hover:bg-surface-container-low rounded-xl"
            >
              All Cakes
            </Link>
            <Link
              to="/custom-order"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-on-surface hover:bg-surface-container-low rounded-xl"
            >
              Custom Order
            </Link>
            <Link
              to="/shop-details"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-on-surface hover:bg-surface-container-low rounded-xl"
            >
              Shop Details
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-on-surface hover:bg-surface-container-low rounded-xl"
            >
              Contact
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary hover:bg-surface-container-low rounded-xl flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">dashboard</span>
                Admin Dashboard
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
