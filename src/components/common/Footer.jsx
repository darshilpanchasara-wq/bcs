import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      showToast('Thank you for subscribing to Bhuvneshwari Cakes news & festive offers! 🍰', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-surface-container-low border-t border-outline-variant text-on-surface pt-16 pb-24 md:pb-16 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Promise Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-surface-container-high">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary-container/60 flex items-center justify-center text-primary flex-shrink-0">
              <span className="material-symbols-outlined text-[26px]">bakery_dining</span>
            </div>
            <div>
              <h4 className="font-headline text-base font-bold text-on-surface">Baked Daily</h4>
              <p className="text-xs text-secondary">Whipped fresh every morning</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary-container/60 flex items-center justify-center text-primary flex-shrink-0">
              <span className="material-symbols-outlined text-[26px]">severe_cold</span>
            </div>
            <div>
              <h4 className="font-headline text-base font-bold text-on-surface">Chilled Transit</h4>
              <p className="text-xs text-secondary">Temperature safe guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary-container/60 flex items-center justify-center text-primary flex-shrink-0">
              <span className="material-symbols-outlined text-[26px]">eco</span>
            </div>
            <div>
              <h4 className="font-headline text-base font-bold text-on-surface">100% Eggless</h4>
              <p className="text-xs text-secondary">Dedicated pure veg options</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary-container/60 flex items-center justify-center text-primary flex-shrink-0">
              <span className="material-symbols-outlined text-[26px]">verified</span>
            </div>
            <div>
              <h4 className="font-headline text-base font-bold text-on-surface">Belgian Cocoa</h4>
              <p className="text-xs text-secondary">Callebaut single-origin</p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-12">
          {/* Brand Info */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/assets/bcs-logo.png"
                alt="BHUVNESHWARI CAKES BCS Logo"
                className="h-12 w-12 rounded-full object-cover border border-amber-300/40 shadow-sm"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/logo.png';
                }}
              />
              <div className="flex flex-col">
                <span className="font-headline text-lg font-black tracking-tight text-on-surface">
                  SHREE BHUVNESHWARI
                </span>
                <span className="text-[10px] tracking-wider uppercase font-bold text-primary">
                  CAKE & SNACKS • 100% EGGLESS
                </span>
              </div>
            </Link>
            <p className="font-body text-sm text-secondary leading-relaxed max-w-sm">
              Dhrol & Jamnagar’s premier confectionery specializing in pure vegetarian couture cakes, royal Engagement tiers, handcrafted Sugar Paste designs, and hot savory bakery snacks. Founded by <strong className="text-on-surface">Darshil Panchasara</strong>.
            </p>
            <div className="flex items-center gap-3 pt-2 text-secondary">
              <span className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center hover:text-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              </span>
              <span className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center hover:text-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">public</span>
              </span>
              <span className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center hover:text-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">call</span>
              </span>
            </div>
          </div>

          {/* Occasions / Shop */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h4 className="font-headline text-base font-bold text-on-surface">Speciality Categories</h4>
            <ul className="flex flex-col gap-2 text-sm text-secondary">
              <li><Link to="/shop?category=engagement" className="hover:text-primary transition-colors font-semibold text-primary">💍 Engagement Cakes</Link></li>
              <li><Link to="/shop?category=sugarpaste" className="hover:text-primary transition-colors font-semibold text-primary">🎂 Sugar Paste Cakes</Link></li>
              <li><Link to="/shop?category=fusion" className="hover:text-primary transition-colors">Rasmalai & Indian Fusion</Link></li>
              <li><Link to="/shop?category=birthday" className="hover:text-primary transition-colors">Birthday Cakes</Link></li>
              <li><Link to="/shop?category=chocolate" className="hover:text-primary transition-colors">Belgian Truffle & Chocolate</Link></li>
              <li><Link to="/custom-order" className="hover:text-primary transition-colors">Custom Designer Order</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <h4 className="font-headline text-base font-bold text-on-surface">Explore</h4>
            <ul className="flex flex-col gap-2 text-sm text-secondary">
              <li><Link to="/shop-details" className="hover:text-primary transition-colors font-semibold text-primary">Shop Details</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact & Location</Link></li>
              <li><Link to="/orders" className="hover:text-primary transition-colors">Track Your Order</Link></li>
              <li><Link to="/profile" className="hover:text-primary transition-colors">My Account</Link></li>
              <li><Link to="/shop-details" className="hover:text-primary transition-colors">Founder: Darshil Panchasara</Link></li>
            </ul>
          </div>

          {/* Store Info & Newsletter */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4 className="font-headline text-base font-bold text-on-surface">Bhuvneshwari Club</h4>
            <p className="font-body text-xs text-secondary">
              Subscribe for festive discounts, Diwali hampers, and secret seasonal flavors.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="flex-1 h-10 px-3 rounded-full bg-surface-container-lowest text-on-surface text-xs border border-outline-variant focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="h-10 px-4 rounded-full bg-primary hover:bg-primary-container text-on-primary font-bold text-xs shadow-sm transition-transform active:scale-95"
              >
                Join
              </button>
            </form>

            <div className="pt-2 text-xs text-secondary flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                <span>Open Daily: 7:00 AM – 10:30 PM</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">pin_drop</span>
                <span>PP Complex, Near Sak Market, Jamnagar Road, Dhrol - 361210</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">call</span>
                <span>94272 43732 / 88662 65927 / 9313581083</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-surface-container-high pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-secondary gap-3">
          <p>© {new Date().getFullYear()} SHREE BHUVNESHWARI CAKE & SNACKS (BHUVNESHWARI CAKES). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Owner: Darshil Panchasara</span>
            <span className="hover:underline cursor-pointer">100% Pure Veg</span>
            <span className="hover:underline cursor-pointer">FSSAI Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
