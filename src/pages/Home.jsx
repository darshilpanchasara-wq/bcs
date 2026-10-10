import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import CakeCard from '../components/cake/CakeCard';
import { CakeCardSkeleton } from '../components/common/LoadingSkeleton';
import { useToast } from '../context/ToastContext';

const Home = () => {
  const [featuredCakes, setFeaturedCakes] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, categoriesRes] = await Promise.all([
          api.get('/cakes/featured'),
          api.get('/categories')
        ]);

        if (featuredRes.data.success) {
          setFeaturedCakes(featuredRes.data.featured || []);
          setBestsellers(featuredRes.data.bestsellers || []);
        }

        if (categoriesRes.data.success) {
          setCategories(categoriesRes.data.categories || []);
        }
      } catch (err) {
        console.error('Home page data error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCopyCode = (code = 'BHUVNESHWARI15') => {
    navigator.clipboard.writeText(code);
    showToast(`Promo code ${code} copied to clipboard! ✂️`, 'success');
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* 1. Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="relative w-full h-[480px] sm:h-[540px] md:h-[620px] rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/60 group">
          <img
            src="/assets/bhuvneshwari-hero-banner.jpg"
            alt="Shree Bhuvneshwari Cake & Snacks"
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/catalog/boss-baby.jpg';
            }}
          />

          {/* Gradient Scrim Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20"></div>

          {/* Brand Floating Tag */}
          <div className="absolute top-5 left-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-md border border-amber-300/30">
            <span className="w-2.5 h-2.5 rounded-full bg-green-600 border border-white"></span>
            <span className="font-label text-xs text-primary tracking-wider uppercase font-bold">
              SHREE BHUVNESHWARI CAKE & SNACKS
            </span>
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 md:p-14 flex flex-col items-start gap-3.5 text-white max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-block px-3 py-1 rounded-full bg-primary text-white text-xs font-bold tracking-wider uppercase shadow-sm">
                100% Pure Veg (Eggless)
              </span>
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold tracking-wider uppercase">
                YOUR OWN BAKERY STORE
              </span>
            </div>

            <h1 className="font-headline text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-white drop-shadow-md">
              SHREE BHUVNESHWARI CAKE & SNACKS
            </h1>

            <p className="font-body text-sm sm:text-base text-neutral-200 leading-relaxed max-w-xl">
              Gujarat's premier 100% Eggless Patisserie & Savory Snacks destination. Handcrafted designer celebration cakes, interactive Tsunami Pull-me-up & Pinata smash cakes, authentic Rasmalai, and artisan golden crispy khari.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-3 w-full sm:w-auto">
              <Link
                to="/shop"
                className="flex-1 sm:flex-initial bg-primary hover:bg-primary-container text-on-primary font-body text-sm sm:text-base font-bold py-3.5 px-7 rounded-full flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
              >
                <span>Explore Full 65 Bakes</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <Link
                to="/shop?category=theme"
                className="bg-surface-container-lowest/90 hover:bg-white text-on-surface font-body text-sm sm:text-base font-bold py-3.5 px-6 rounded-full flex items-center justify-center active:scale-95 transition-all backdrop-blur-md shadow-sm"
              >
                Theme Based Cakes
              </Link>
              <Link
                to="/custom-order"
                className="bg-white/20 hover:bg-white/30 text-white border border-white/40 font-body text-sm sm:text-base font-semibold py-3.5 px-6 rounded-full flex items-center justify-center active:scale-95 transition-all backdrop-blur-md"
              >
                Custom Order
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Speciality Feature Banners: Theme Based & Unique Bakes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Theme Based Cakes Spotlight */}
          <Link
            to="/shop?category=theme"
            className="group relative rounded-3xl overflow-hidden h-72 sm:h-80 border border-outline-variant/60 shadow-md flex flex-col justify-end p-6 sm:p-8 text-white"
          >
            <img
              src="/assets/catalog/boss-baby.jpg"
              alt="Theme Based Cakes Collection"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
            <div className="relative z-10 flex flex-col gap-1.5">
              <span className="bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-full w-fit uppercase tracking-wider">
                🎨 Min. 500g
              </span>
              <h3 className="font-headline text-2xl sm:text-3xl font-black">
                Theme Based Cakes
              </h3>
              <p className="text-xs sm:text-sm text-neutral-200 line-clamp-2">
                Handcrafted fondant figurines: Boss Baby, Avengers superhero, supercar racing, and fairytale princess castles.
              </p>
              <div className="flex items-center gap-1 text-amber-300 text-xs font-bold mt-1 group-hover:translate-x-1 transition-transform">
                <span>Browse All 10 Theme Cakes</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
            </div>
          </Link>

          {/* Premium Flavour Cakes Spotlight */}
          <Link
            to="/shop?category=premium"
            className="group relative rounded-3xl overflow-hidden h-72 sm:h-80 border border-outline-variant/60 shadow-md flex flex-col justify-end p-6 sm:p-8 text-white"
          >
            <img
              src="/assets/catalog/rasmalai-cake.jpg"
              alt="Royal Rasmalai & Premium Cakes"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
            <div className="relative z-10 flex flex-col gap-1.5">
              <span className="bg-amber-600 text-white text-[11px] font-bold px-3 py-1 rounded-full w-fit uppercase tracking-wider">
                ⭐ Premium Flavours
              </span>
              <h3 className="font-headline text-2xl sm:text-3xl font-black">
                Royal Rasmalai & Dutch Chocolate
              </h3>
              <p className="text-xs sm:text-sm text-neutral-200 line-clamp-2">
                Infused with pure saffron, pistachio slivers, and rich Callebaut Belgian dark chocolate ganache.
              </p>
              <div className="flex items-center gap-1 text-amber-300 text-xs font-bold mt-1 group-hover:translate-x-1 transition-transform">
                <span>Explore Premium Cakes</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. Occasion / Category Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 w-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="font-label text-xs text-primary font-bold uppercase tracking-wider">
              All Bhuvneshwari Flavors
            </span>
            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
              Explore Our Categories
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-bold text-primary hover:underline flex items-center gap-0.5"
          >
            <span>View All</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </Link>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => {
              setActiveCategory('all');
              navigate('/shop');
            }}
            className={`flex-shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-full font-body text-xs sm:text-sm font-bold shadow-sm active:scale-95 transition-all ${
              activeCategory === 'all'
                ? 'bg-primary text-white'
                : 'bg-surface-container-low text-secondary hover:text-on-surface'
            }`}
          >
            <span>✨ All Cakes</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => {
                setActiveCategory(cat.slug);
                navigate(`/shop?category=${cat.slug}`);
              }}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full font-body text-xs sm:text-sm font-semibold border active:scale-95 transition-all ${
                activeCategory === cat.slug
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface-container-low hover:bg-surface-container text-secondary hover:text-on-surface border-outline-variant/40'
              }`}
            >
              <span>{cat.name}</span>
              {cat.cakeCount !== undefined && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 font-bold">
                  {cat.cakeCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* 4. Chef Darshil's Signature Bestsellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 w-full">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="font-label text-xs text-primary font-bold uppercase tracking-wider">
              Handpicked by Darshil Panchasara
            </span>
            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
              Darshil's Bestsellers
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-bold text-primary flex items-center gap-0.5 hover:underline"
          >
            <span>Explore All</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <CakeCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestsellers.slice(0, 4).map((cake) => (
              <CakeCard key={cake._id} cake={cake} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Promotional Festive Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 w-full">
        <div className="relative rounded-3xl bg-gradient-to-r from-primary via-[#b5143c] to-amber-700 p-6 sm:p-10 text-white overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2 text-center md:text-left z-10">
            <span className="inline-block w-fit mx-auto md:mx-0 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
              Shree Bhuvneshwari Celebration Code
            </span>
            <h3 className="font-headline text-2xl sm:text-4xl font-black leading-tight">
              Flat 15% Off Your Pure Veg Celebration Cake
            </h3>
            <p className="font-body text-sm text-neutral-100 max-w-md">
              Valid on all Engagement, Sugar Paste, Rasmalai, and designer truffle cakes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 z-10 w-full sm:w-auto">
            <div className="flex items-center justify-between bg-white text-on-surface px-5 py-3 rounded-full font-mono font-bold text-base shadow-md w-full sm:w-auto gap-4">
              <span className="tracking-wider text-primary">BHUVNESHWARI15</span>
              <button
                onClick={() => handleCopyCode('BHUVNESHWARI15')}
                className="text-xs bg-surface-container px-2.5 py-1 rounded-full text-secondary hover:text-primary transition-colors font-sans"
              >
                Copy
              </button>
            </div>
            <Link
              to="/shop"
              className="w-full sm:w-auto text-center px-6 py-3.5 rounded-full bg-neutral-900 text-white font-bold text-sm hover:bg-black active:scale-95 transition-all shadow-md"
            >
              Order Online
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Featured Cakes Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 w-full">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="font-label text-xs text-primary font-bold uppercase tracking-wider">
              Baked Fresh Every Morning
            </span>
            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
              Featured Creations
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-bold text-primary flex items-center gap-0.5 hover:underline"
          >
            <span>See Full Menu</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <CakeCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredCakes.slice(0, 8).map((cake) => (
              <CakeCard key={cake._id} cake={cake} />
            ))}
          </div>
        )}
      </section>

      {/* 7. Replaced Section: Shop Details & Founder Darshil Panchasara Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 w-full">
        <div className="rounded-3xl bg-surface-container-low border border-outline-variant/60 p-6 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <img src="/assets/bcs-logo.png" alt="BCS" className="w-6 h-6 rounded-full object-cover" />
              <span className="font-label text-xs text-primary font-bold uppercase tracking-wider">
                SHREE BHUVNESHWARI CAKE & SNACKS
              </span>
            </div>
            <h2 className="font-headline text-2xl sm:text-4xl font-black text-on-surface leading-tight">
              Master Craftsmanship by Darshil Panchasara
            </h2>
            <p className="font-body text-sm sm:text-base text-secondary leading-relaxed">
              Welcome to <strong className="text-on-surface">BHUVNESHWARI CAKES</strong>. Founded and led by Master Confectioner <strong className="text-on-surface">Darshil Panchasara</strong>, our Dhrol & Jamnagar outlet blends traditional Gujarati hospitality with haute-confectionery elegance.
            </p>
            <p className="font-body text-sm text-secondary leading-relaxed">
              Every creation is strictly 100% pure vegetarian (eggless) whipped with rich dairy butter, genuine Kashmiri saffron, and premium chocolate. Walk in anytime to enjoy warm savory puffs, fresh khari, and inspect our live cake showroom!
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 flex flex-col gap-1">
                <span className="font-headline text-xl font-bold text-green-600">100% Pure</span>
                <span className="text-xs font-bold text-on-surface">Eggless Kitchen</span>
                <span className="text-[11px] text-secondary">Zero animal gelatin</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 flex flex-col gap-1">
                <span className="font-headline text-xl font-bold text-primary">Daily Hot</span>
                <span className="text-xs font-bold text-on-surface">Bakery Snacks</span>
                <span className="text-[11px] text-secondary">Veg Puffs, Khari, Rolls</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 flex flex-col gap-1 col-span-2 sm:col-span-1">
                <span className="font-headline text-xl font-bold text-amber-600">Dhrol & Jamnagar</span>
                <span className="text-xs font-bold text-on-surface">Express Delivery</span>
                <span className="text-[11px] text-secondary">Temperature safe vans</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/shop-details"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold text-sm shadow-md hover:bg-primary-container transition-all"
              >
                <span>View Full Shop Details & Snacks</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface-container-lowest text-on-surface font-semibold text-sm border border-outline-variant/60 hover:bg-white transition-all"
              >
                <span>Store Location & Directions</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-outline-variant/60 group">
              <img
                src="/assets/darshil-panchasara.png"
                alt="Owner Darshil Panchasara"
                className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=600&q=80';
                }}
              />
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
                <p className="text-xs font-bold">Darshil Panchasara</p>
                <p className="text-[10px] text-neutral-300">Founder & Master Baker</p>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-outline-variant/60 group">
              <img
                src="/assets/bhuvneshwari-shop.png"
                alt="Shree Bhuvneshwari Cake & Snacks Counter"
                className="w-full h-44 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80';
                }}
              />
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
                <p className="text-xs font-bold">Shree Bhuvneshwari Outlet</p>
                <p className="text-[10px] text-neutral-300">PP Complex, Jamnagar Road, Dhrol</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Indian Customer Testimonials (Zero English Names) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="font-label text-xs text-primary font-bold uppercase tracking-wider">
            Client Blessings & Love
          </span>
          <h2 className="font-headline text-2xl sm:text-4xl font-bold text-on-surface mt-1">
            Words From Our Patrons
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-confectionery-1 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                ))}
              </div>
              <p className="font-body text-sm text-secondary italic leading-relaxed">
                "We ordered the 3-Tier Royal Engagement Cake from Bhuvneshwari Cakes for my sister's ring ceremony. The sugar florals and gold foil details were breathtaking. Everyone praised the Rasmalai sponge!"
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-surface-container-high">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                PP
              </div>
              <div>
                <h5 className="font-headline text-sm font-bold text-on-surface">Pooja Patel</h5>
                <span className="text-[11px] text-secondary">Verified Customer • Satellite, Ahmedabad</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-confectionery-1 flex flex-col justify-between gap-4">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
              ))}
            </div>
            <p className="font-body text-sm text-secondary italic leading-relaxed">
              "Being strictly vegetarian, finding truly gourmet eggless cakes was always hard until we found Bhuvneshwari Cakes. Darshil Panchasara's Belgian truffle cake is world-class, and their warm veg puffs are our daily evening snack!"
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-surface-container-high">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                AM
              </div>
              <div>
                <h5 className="font-headline text-sm font-bold text-on-surface">Aarav Mehta</h5>
                <span className="text-[11px] text-secondary">Verified Customer • Vastrapur, Ahmedabad</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-confectionery-1 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                ))}
              </div>
              <p className="font-body text-sm text-secondary italic leading-relaxed">
                "Our wedding sugar paste tier arrived in a refrigerated van in flawless condition. The cascading sugar roses looked real! Thank you Darshil and Shree Bhuvneshwari Cake & Snacks for making our day magical."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-surface-container-high">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                PD
              </div>
              <div>
                <h5 className="font-headline text-sm font-bold text-on-surface">Priyanka Desai</h5>
                <span className="text-[11px] text-secondary">Wedding Client • Bodakdev, Ahmedabad</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
