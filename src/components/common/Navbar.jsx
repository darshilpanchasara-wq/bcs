import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const wishlistCount = user?.wishlist?.length || 0;

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(75,46,43,0.04)] border-b border-surface-container-high/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Bar */}
        <div className="h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <img
              src="/assets/bcs-logo.png"
              alt="SHREE BHUVNESHWARI CAKE & SNACKS"
              className="h-11 w-auto rounded-full object-contain shadow-sm border border-amber-300/40 transition-transform group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/logo.png';
              }}
            />
            <div className="flex flex-col">
              <span className="font-headline text-base sm:text-lg font-black tracking-tight text-on-surface group-hover:text-primary transition-colors leading-tight">
                SHREE BHUVNESHWARI
              </span>
              <span className="text-[10px] tracking-widest uppercase font-bold text-primary -mt-0.5">
                CAKE & SNACKS • 100% EGGLESS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`font-body text-sm font-semibold transition-colors ${
                location.pathname === '/' ? 'text-primary' : 'text-secondary hover:text-primary'
              }`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`font-body text-sm font-semibold transition-colors ${
                location.pathname.startsWith('/shop') ? 'text-primary' : 'text-secondary hover:text-primary'
              }`}
            >
              All Cakes
            </Link>
            <Link
              to="/shop?category=engagement"
              className={`font-body text-sm font-semibold transition-colors ${
                location.search.includes('engagement') ? 'text-primary' : 'text-secondary hover:text-primary'
              }`}
            >
              Engagement
            </Link>
            <Link
              to="/shop?category=sugarpaste"
              className={`font-body text-sm font-semibold transition-colors ${
                location.search.includes('sugarpaste') ? 'text-primary' : 'text-secondary hover:text-primary'
              }`}
            >
              Sugar Paste
            </Link>
            <Link
              to="/custom-order"
              className={`font-body text-sm font-semibold transition-colors ${
                location.pathname === '/custom-order' ? 'text-primary' : 'text-secondary hover:text-primary'
              }`}
            >
              Custom Order
            </Link>
            <Link
              to="/shop-details"
              className={`font-body text-sm font-semibold transition-colors ${
                location.pathname === '/shop-details' ? 'text-primary' : 'text-secondary hover:text-primary'
              }`}
            >
              Shop Details
            </Link>
            <Link
              to="/contact"
              className={`font-body text-sm font-semibold transition-colors ${
                location.pathname === '/contact' ? 'text-primary' : 'text-secondary hover:text-primary'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Search Input (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex items-center relative flex-1 max-w-xs"
          >
            <span className="material-symbols-outlined absolute left-3 text-secondary text-[20px] pointer-events-none">
              search
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cakes, flavors, tags..."
              className="w-full h-10 pl-10 pr-4 rounded-full bg-surface-container-low text-on-surface placeholder:text-secondary/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all border border-transparent focus:border-outline-variant"
            />
          </form>

          {/* Right Icon Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Wishlist */}
            <Link
              to="/profile"
              aria-label="Wishlist"
              className="w-10 h-10 relative flex items-center justify-center text-secondary hover:text-primary transition-colors rounded-full hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-[24px]">favorite</span>
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-secondary text-surface text-[10px] font-bold leading-none shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag */}
            <Link
              to="/cart"
              aria-label="Shopping Cart"
              className="w-10 h-10 relative flex items-center justify-center text-secondary hover:text-primary transition-colors rounded-full hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-on-primary text-[10px] font-bold leading-none shadow-sm animate-pulse">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Profile / Auth */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="w-10 h-10 flex items-center justify-center rounded-full p-0.5 border border-primary/20 hover:border-primary transition-all focus:outline-none"
                    aria-label="User Menu"
                  >
                    <img
                      src={user?.avatar || '/assets/customer-portrait.png'}
                      alt={user?.name || 'User'}
                      className="w-full h-full rounded-full object-cover shadow-sm"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
                      }}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdown && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-2xl shadow-confectionery-3 border border-outline-variant py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                      onClick={() => setProfileDropdown(false)}
                    >
                      <div className="px-4 py-2 border-b border-surface-container-high">
                        <p className="font-bold text-sm text-on-surface truncate">{user.name}</p>
                        <p className="text-xs text-secondary truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container text-[10px] font-bold tracking-wider uppercase">
                            Administrator
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-primary font-bold hover:bg-surface-container-low transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">dashboard</span>
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/orders"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                        My Orders & Tracking
                      </Link>

                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">person</span>
                        Account Settings
                      </Link>

                      <div className="border-t border-surface-container-high my-1"></div>

                      <button
                        onClick={logout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-error-container/20 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="hidden sm:inline-flex px-4 py-2 rounded-full font-label-md text-sm font-semibold text-secondary hover:text-primary transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs sm:text-sm font-semibold shadow-sm transition-transform active:scale-95"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-on-surface"
              aria-label="Open Mobile Menu"
            >
              <span className="material-symbols-outlined text-[26px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (always visible on phone) */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-[20px] pointer-events-none">
              search
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search artisan cakes, cupcakes, flavors..."
              className="w-full h-10 pl-10 pr-4 rounded-full bg-surface-container-low text-on-surface placeholder:text-secondary/60 text-sm focus:outline-none focus:bg-white border border-transparent focus:border-outline-variant transition-colors"
            />
          </form>
        </div>

        {/* Mobile Dropdown Nav Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-surface-container-lowest border-t border-surface-container-high py-4 px-2 flex flex-col gap-2 rounded-b-2xl shadow-confectionery-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-on-surface font-semibold hover:bg-surface-container-low rounded-xl"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-on-surface font-semibold hover:bg-surface-container-low rounded-xl"
            >
              All Cakes
            </Link>
            <Link
              to="/shop?category=engagement"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-on-surface font-semibold hover:bg-surface-container-low rounded-xl"
            >
              Engagement Cakes
            </Link>
            <Link
              to="/shop?category=sugarpaste"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-on-surface font-semibold hover:bg-surface-container-low rounded-xl"
            >
              Sugar Paste Cakes
            </Link>
            <Link
              to="/custom-order"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-on-surface font-semibold hover:bg-surface-container-low rounded-xl"
            >
              Custom Order
            </Link>
            <Link
              to="/shop-details"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-on-surface font-semibold hover:bg-surface-container-low rounded-xl"
            >
              Shop Details
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-on-surface font-semibold hover:bg-surface-container-low rounded-xl"
            >
              Contact & Store Location
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-primary font-bold hover:bg-surface-container-low rounded-xl flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">dashboard</span>
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
