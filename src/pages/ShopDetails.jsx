import React from 'react';
import { Link } from 'react-router-dom';

const ShopDetails = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
          <img src="/assets/bcs-logo.png" alt="BCS" className="w-5 h-5 rounded-full object-cover" />
          <span className="font-label text-xs font-bold text-primary uppercase tracking-wider">
            Official Storefront & Confectionery
          </span>
        </div>
        <h1 className="font-headline text-3xl sm:text-5xl font-black text-on-surface mt-1 leading-tight tracking-tight">
          SHREE BHUVNESHWARI CAKE & SNACKS
        </h1>
        <p className="font-body text-base sm:text-lg text-secondary mt-3 leading-relaxed">
          Dhrol & Jamnagar’s premier destination for artisan pure-vegetarian celebration cakes, designer custom bakes, and warm freshly baked Gujarati & Continental snacks.
        </p>
      </div>

      {/* Store Exterior & Interior Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
        <div className="lg:col-span-7 relative rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/60 group">
          <img
            src="/assets/bhuvneshwari-shop.png"
            alt="Shree Bhuvneshwari Cake & Snacks Storefront"
            className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
            <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-2 uppercase tracking-wider">
              Flagship Outlet
            </span>
            <h3 className="font-headline text-2xl font-bold">
              Walk Into A World of Fresh Aromas
            </h3>
            <p className="text-sm text-neutral-200 mt-1 max-w-lg">
              Live display of over 40+ handcrafted daily cake varieties, warm puff cabinets, and freshly fried snack counters.
            </p>
          </div>
        </div>

        {/* Quick Highlights card */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary text-2xl">storefront</span>
              <h3 className="font-headline text-lg font-bold text-on-surface">Store Timings</h3>
            </div>
            <p className="text-sm text-on-surface font-semibold">Open All 7 Days: 7:00 AM – 10:30 PM</p>
            <p className="text-xs text-secondary mt-1">
              Fresh morning batch ready by 7:30 AM. Evening hot snacks served continuously from 4:00 PM to 9:30 PM.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <a
                  href="https://maps.app.goo.gl/xEMDs6p1rZgFNaqr8"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View on Google Maps"
                  className="w-10 h-10 rounded-2xl bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-transform hover:scale-110 shadow-sm"
                >
                  <span className="material-symbols-outlined text-primary text-2xl">location_on</span>
                </a>
                <h3 className="font-headline text-lg font-bold text-on-surface">Store Location</h3>
              </div>
              <a
                href="https://maps.app.goo.gl/xEMDs6p1rZgFNaqr8"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-0.5"
              >
                <span>Google Maps</span>
                <span className="material-symbols-outlined text-[13px]">open_in_new</span>
              </a>
            </div>
            <p className="text-sm text-on-surface font-medium">
              PP Complex, Near Sak Market, Jamnagar Road, Dhrol, Jamnagar - 361210
            </p>
            <p className="text-xs text-secondary mt-1">Landmark: Near Sak Market, Jamnagar Road</p>
            <a
              href="https://maps.app.goo.gl/xEMDs6p1rZgFNaqr8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2 px-3.5 py-1.5 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary-container transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              <span>Open in Google Maps</span>
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <a
                href="tel:8866265927"
                title="Call 8866265927"
                className="w-10 h-10 rounded-2xl bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-transform hover:scale-110 shadow-sm"
              >
                <span className="material-symbols-outlined text-primary text-2xl">call</span>
              </a>
              <h3 className="font-headline text-lg font-bold text-on-surface">Direct Orders & Inquiries</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2 my-1.5">
              <a
                href="tel:8866265927"
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary-container transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[14px]">call</span>
                <span>Call: 88662 65927</span>
              </a>
              <a
                href="https://wa.me/918866265927?text=Hello%20Shree%20Bhuvneshwari%20Cakes,%20I%20would%20like%20to%20order%20a%20cake."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#25D366] text-white text-xs font-bold hover:bg-[#1ebd5a] transition-all shadow-sm"
              >
                <span>WhatsApp (8866265927)</span>
              </a>
            </div>
            <p className="text-xs text-secondary mt-1">
              Alternate hotlines: <a href="tel:9427243732" className="hover:underline">94272 43732</a> • <a href="tel:9313581083" className="hover:underline">9313581083</a>
            </p>
          </div>
        </div>
      </div>

      {/* Owner Profile Section */}
      <div className="bg-gradient-to-br from-amber-50/60 to-primary/5 rounded-3xl p-8 sm:p-12 border border-primary/20 shadow-sm mb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 flex justify-center">
            <div className="relative">
              <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <img
                  src="/assets/darshil-panchasara.png"
                  alt="Darshil Panchasara - Founder & Master Baker"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg border border-white">
                Master Confectioner
              </div>
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="font-label text-xs font-bold text-primary uppercase tracking-wider">
                Founder & Master Confectioner
              </span>
            </div>
            <h2 className="font-headline text-2xl sm:text-4xl font-black text-on-surface">
              Darshil Panchasara
            </h2>
            <p className="font-body text-sm sm:text-base text-secondary leading-relaxed">
              "At <strong className="text-on-surface">SHREE BHUVNESHWARI CAKE & SNACKS</strong>, our philosophy is anchored in pure ingredients, traditional warmth, and high-fashion confectionery artistry. Every sponge, cream whip, and savory puff that leaves our kitchen is 100% vegetarian, prepared with the finest Amul dairy butter, real saffron, and Belgian chocolate."
            </p>
            <p className="font-body text-sm text-secondary leading-relaxed">
              Darshil personally oversees the design of every custom celebration cake tier, ensuring each creation is not only a centerpiece of visual wonder but also an unforgettable culinary delight for your loved ones.
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <span className="px-3 py-1 rounded-full bg-white border border-outline-variant/60 text-xs font-semibold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-green-600 text-[16px]">verified</span>
                100% Eggless Kitchen
              </span>
              <span className="px-3 py-1 rounded-full bg-white border border-outline-variant/60 text-xs font-semibold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-600 text-[16px]">award_star</span>
                FSSAI Certified Bakery
              </span>
              <span className="px-3 py-1 rounded-full bg-white border border-outline-variant/60 text-xs font-semibold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[16px]">favorite</span>
                15,000+ Happy Celebrations
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fresh Snacks & Bakery Savory Counter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
        <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col gap-4">
          <span className="font-label text-xs text-primary font-bold uppercase tracking-wider">
            Warm From The Oven
          </span>
          <h2 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
            Fresh Savory Bakery Snacks & Namkeen
          </h2>
          <p className="font-body text-sm text-secondary leading-relaxed">
            Along with our designer cakes, our daily snack counter is Ahmedabad’s beloved evening stop. Freshly baked hourly in pure vegetable oil and cow ghee.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/40">
              <p className="font-bold text-sm text-on-surface">Butter Veg Puffs</p>
              <p className="text-xs text-secondary">Flaky layers stuffed with spiced garden vegetables</p>
            </div>
            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/40">
              <p className="font-bold text-sm text-on-surface">Paneer Tikka Roll</p>
              <p className="text-xs text-secondary">Marinated cottage cheese rolled in golden crust</p>
            </div>
            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/40">
              <p className="font-bold text-sm text-on-surface">Surati Jeera Khari</p>
              <p className="text-xs text-secondary">Melt-in-mouth crisp teatime favorite</p>
            </div>
            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/40">
              <p className="font-bold text-sm text-on-surface">Desi Ghee Nankhatai</p>
              <p className="text-xs text-secondary">Traditional cardamom-pistachio shortbread</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 order-1 lg:order-2 rounded-3xl overflow-hidden shadow-xl border border-outline-variant/60">
          <img
            src="/assets/bakery-snacks.png"
            alt="Fresh Bakery Snacks at Shree Bhuvneshwari"
            className="w-full h-[360px] object-cover hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80';
            }}
          />
        </div>
      </div>

      {/* Four Core Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-2">
          <span className="material-symbols-outlined text-[32px] text-primary">cake</span>
          <h3 className="font-headline text-lg font-bold text-on-surface">Baked Daily</h3>
          <p className="text-xs text-secondary leading-relaxed">
            Zero frozen base sponges. Every Bhuvneshwari cake is baked fresh on the day of delivery.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-2">
          <span className="material-symbols-outlined text-[32px] text-green-600">eco</span>
          <h3 className="font-headline text-lg font-bold text-on-surface">100% Pure Veg (Eggless)</h3>
          <p className="text-xs text-secondary leading-relaxed">
            Every creation is prepared in a strictly vegetarian kitchen compliant with religious & dietary purity.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-2">
          <span className="material-symbols-outlined text-[32px] text-amber-600">diamond</span>
          <h3 className="font-headline text-lg font-bold text-on-surface">Artisanal Designer Bakes</h3>
          <p className="text-xs text-secondary leading-relaxed">
            Grand multi-tier wedding and celebration centerpieces designed with gold foil & handcrafted florals.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-2">
          <span className="material-symbols-outlined text-[32px] text-blue-600">local_shipping</span>
          <h3 className="font-headline text-lg font-bold text-on-surface">Chilled Delivery Vans</h3>
          <p className="text-xs text-secondary leading-relaxed">
            Delivered across Dhrol, Jamnagar & Rajkot in temperature-stabilized vehicles so your cake arrives pristine.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="rounded-3xl bg-primary text-white p-8 sm:p-12 text-center shadow-xl flex flex-col items-center gap-4">
        <img src="/assets/bcs-logo.png" alt="BCS" className="w-16 h-16 rounded-full object-cover border-2 border-white/50 shadow-md" />
        <h2 className="font-headline text-2xl sm:text-4xl font-black">
          Plan Your Next Celebration With Bhuvneshwari Cakes
        </h2>
        <p className="font-body text-sm sm:text-base text-white/90 max-w-xl">
          Visit our Dhrol store or order online with guaranteed same-day delivery. Connect with Darshil Panchasara for personalized bespoke wedding orders.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-2">
          <Link
            to="/shop"
            className="px-8 py-3.5 rounded-full bg-white text-primary font-bold text-sm shadow-lg hover:bg-neutral-100 transition-colors"
          >
            Explore All Cakes
          </Link>
          <Link
            to="/custom-order"
            className="px-8 py-3.5 rounded-full bg-primary-dark/60 text-white border border-white/40 font-bold text-sm hover:bg-white/20 transition-colors"
          >
            Custom Ring / Wedding Order
          </Link>
          <Link
            to="/contact"
            className="px-8 py-3.5 rounded-full bg-neutral-900/60 text-white border border-white/20 font-bold text-sm hover:bg-neutral-900 transition-colors"
          >
            Contact & Hotline
          </Link>
          <a
            href="https://maps.app.goo.gl/xEMDs6p1rZgFNaqr8"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-full bg-white/20 text-white border border-white/40 font-bold text-sm hover:bg-white/30 transition-colors inline-flex items-center gap-1.5 backdrop-blur-md"
          >
            <span className="material-symbols-outlined text-[18px]">location_on</span>
            <span>Google Maps</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;
