import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { clientStore } from '../api/clientStore';
import CakeCard from '../components/cake/CakeCard';
import { CatalogSkeleton } from '../components/common/LoadingSkeleton';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [cakes, setCakes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalCakes, setTotalCakes] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filter States initialized from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [priceMax, setPriceMax] = useState(searchParams.get('maxPrice') || 4000);
  const [isEggless, setIsEggless] = useState(searchParams.get('isEggless') === 'true');
  const [isGlutenFree, setIsGlutenFree] = useState(searchParams.get('isGlutenFree') === 'true');
  const [selectedFlavor, setSelectedFlavor] = useState(searchParams.get('flavor') || '');
  const [selectedWeight, setSelectedWeight] = useState(searchParams.get('weight') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'bestseller');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [error, setError] = useState(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res && res.data && res.data.success) {
          setCategories(res.data.categories || []);
        } else {
          setCategories(clientStore.getCategories());
        }
      } catch (err) {
        console.warn('Using clientStore categories:', err.message);
        setCategories(clientStore.getCategories());
      }
    };
    fetchCategories();
  }, [refreshIndex]);

  // Fetch Cakes on Filter / Param Change
  useEffect(() => {
    const fetchCakes = async () => {
      setLoading(true);
      setError(null);
      const queryObj = {};
      try {
        const params = new URLSearchParams();
        if (search) { params.append('search', search); queryObj.search = search; }
        if (selectedCategory && selectedCategory !== 'all') { params.append('category', selectedCategory); queryObj.category = selectedCategory; }
        if (priceMax && Number(priceMax) < 4000) { params.append('maxPrice', priceMax); queryObj.maxPrice = priceMax; }
        if (isEggless) { params.append('isEggless', 'true'); queryObj.isEggless = 'true'; }
        if (isGlutenFree) { params.append('isGlutenFree', 'true'); queryObj.isGlutenFree = 'true'; }
        if (selectedFlavor) { params.append('flavor', selectedFlavor); queryObj.flavor = selectedFlavor; }
        if (selectedWeight) { params.append('weight', selectedWeight); queryObj.weight = selectedWeight; }
        if (sortBy) { params.append('sort', sortBy); queryObj.sort = sortBy; }
        params.append('page', currentPage); queryObj.page = currentPage;
        params.append('limit', 12); queryObj.limit = 12;

        // Update URL query params
        setSearchParams(params, { replace: true });

        const res = await api.get(`/cakes?${params.toString()}`);
        if (res && res.data && res.data.success && res.data.cakes?.length > 0) {
          setCakes(res.data.cakes || []);
          setTotalCakes(res.data.totalCakes || 0);
          setPages(res.data.pages || 1);
        } else {
          const fallback = clientStore.getCakes(queryObj);
          setCakes(fallback.cakes);
          setTotalCakes(fallback.totalCakes);
          setPages(fallback.pages);
        }
      } catch (err) {
        console.warn('Using clientStore cakes fallback:', err.message);
        const fallback = clientStore.getCakes(queryObj);
        setCakes(fallback.cakes);
        setTotalCakes(fallback.totalCakes);
        setPages(fallback.pages);
      } finally {
        setLoading(false);
      }
    };

    fetchCakes();
  }, [selectedCategory, priceMax, isEggless, isGlutenFree, selectedFlavor, selectedWeight, sortBy, currentPage, search, refreshIndex]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setPriceMax(4000);
    setIsEggless(false);
    setIsGlutenFree(false);
    setSelectedFlavor('');
    setSelectedWeight('');
    setSortBy('bestseller');
    setCurrentPage(1);
  };

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (priceMax < 4000 ? 1 : 0) +
    (isEggless ? 1 : 0) +
    (isGlutenFree ? 1 : 0) +
    (selectedFlavor ? 1 : 0) +
    (selectedWeight ? 1 : 0);

  const flavorOptions = [
    'Kesar Pista Saffron Infusion',
    'Belgian Dark Truffle',
    'Rasmalai & Saffron Cardamom',
    'Gulab Jamun Pistachio',
    'Madagascan Vanilla & Alphonso Mango Coulis',
    'Belgian White Chocolate Rose',
    'Red Velvet Cream Cheese',
    'Butterscotch Crunch'
  ];

  const weightOptions = ['0.5 kg', '1.0 kg', '1.5 kg', '2.0 kg', '2.5 kg', '3.0 kg', '4.0 kg'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header & Category Title */}
      <div className="flex flex-col gap-1 pb-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="flex items-center gap-2">
            <img src="/assets/bcs-logo.png" alt="BCS" className="w-8 h-8 rounded-full object-cover border border-amber-300/40" />
            <h1 className="font-headline text-3xl sm:text-4xl font-black text-on-surface tracking-tight">
              BHUVNESHWARI CAKES Catalog
            </h1>
          </div>
          <span className="font-body text-xs sm:text-sm font-semibold px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container">
            {totalCakes} {totalCakes === 1 ? 'Creation' : 'Creations'} Available
          </span>
        </div>
        <p className="font-body text-xs sm:text-sm text-secondary">
          100% Pure vegetarian & eggless celebration cakes, handcrafted designer bakes, and savory snacks by Darshil Panchasara.
        </p>
      </div>

      {/* Quick Category Filter Strip */}
      <div className="pt-2 pb-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => {
            setSelectedCategory('all');
            setCurrentPage(1);
          }}
          className={`flex-shrink-0 px-4 py-2 rounded-full font-body text-xs sm:text-sm font-semibold transition-all ${
            selectedCategory === 'all'
              ? 'bg-on-surface text-surface shadow-sm'
              : 'bg-surface-container-low text-secondary hover:bg-surface-container'
          }`}
        >
          ✨ All Cakes
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => {
              setSelectedCategory(cat.slug);
              setCurrentPage(1);
            }}
            className={`flex-shrink-0 px-4 py-2 rounded-full font-body text-xs sm:text-sm font-semibold transition-all ${
              selectedCategory === cat.slug
                ? 'bg-on-surface text-surface shadow-sm'
                : 'bg-surface-container-low text-secondary hover:bg-surface-container'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Control Strip: Filter Toggle & Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-y border-surface-container-high/60 my-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className={`flex items-center gap-1.5 h-10 px-4 rounded-full font-body text-xs sm:text-sm font-bold transition-colors ${
              filterDrawerOpen || activeFilterCount > 0
                ? 'bg-secondary-container text-on-secondary-container border border-primary/30'
                : 'bg-surface-container-high text-on-surface hover:bg-secondary-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-primary">tune</span>
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Quick Eggless Chip Toggle */}
          <button
            onClick={() => {
              setIsEggless(!isEggless);
              setCurrentPage(1);
            }}
            className={`flex items-center gap-1 h-10 px-4 rounded-full font-body text-xs sm:text-sm font-semibold transition-transform active:scale-95 ${
              isEggless
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-low text-secondary hover:bg-surface-container'
            }`}
          >
            <span>🌱</span>
            <span>100% Eggless</span>
            {isEggless && <span className="material-symbols-outlined text-[14px]">check</span>}
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-primary hover:underline font-bold ml-1 uppercase"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-secondary hidden sm:inline-block">Sort by:</label>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 pl-3.5 pr-8 rounded-full bg-surface-container-low text-on-surface font-body text-xs sm:text-sm font-medium appearance-none outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/40 cursor-pointer"
            >
              <option value="bestseller">Chef's Bestsellers</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Creations</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none text-[18px]">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* Expandable Filter Drawer Panel */}
      {filterDrawerOpen && (
        <div className="p-5 sm:p-6 rounded-3xl bg-surface-container-low shadow-confectionery-2 border border-outline-variant/60 my-4 flex flex-col gap-5 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
              <h3 className="font-headline text-lg font-bold text-on-surface">Refine Palette</h3>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-primary hover:underline uppercase tracking-wider"
            >
              Reset All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Price Range Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-body text-xs font-bold uppercase tracking-wider text-secondary">
                  Max Price
                </span>
                <span className="text-xs font-bold text-primary px-2.5 py-0.5 rounded-full bg-secondary-container">
                  Up to ₹{Number(priceMax).toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="300"
                max="4000"
                step="50"
                value={priceMax}
                onChange={(e) => {
                  setPriceMax(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[11px] text-secondary">
                <span>₹300</span>
                <span>₹4,000+</span>
              </div>
            </div>

            {/* Weight / Portion Chip Selector */}
            <div className="flex flex-col gap-2">
              <span className="font-body text-xs font-bold uppercase tracking-wider text-secondary">
                Portion & Weight
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {weightOptions.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => {
                      setSelectedWeight(selectedWeight === w ? '' : w);
                      setCurrentPage(1);
                    }}
                    className={`h-9 rounded-xl font-body text-xs font-semibold flex items-center justify-center transition-all ${
                      selectedWeight === w
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container-lowest text-on-surface hover:bg-secondary-container/60'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Flags */}
            <div className="flex flex-col gap-2">
              <span className="font-body text-xs font-bold uppercase tracking-wider text-secondary">
                Dietary Attributes
              </span>
              <div className="flex flex-col gap-2">
                <label className="flex items-center justify-between p-2 rounded-xl bg-surface-container-lowest cursor-pointer">
                  <span className="text-xs font-medium text-on-surface">100% Eggless Baking</span>
                  <input
                    type="checkbox"
                    checked={isEggless}
                    onChange={(e) => {
                      setIsEggless(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 rounded text-primary accent-primary"
                  />
                </label>
                <label className="flex items-center justify-between p-2 rounded-xl bg-surface-container-lowest cursor-pointer">
                  <span className="text-xs font-medium text-on-surface">Gluten-Free Flour Base</span>
                  <input
                    type="checkbox"
                    checked={isGlutenFree}
                    onChange={(e) => {
                      setIsGlutenFree(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 rounded text-primary accent-primary"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Flavor Chips */}
          <div className="flex flex-col gap-2 pt-2 border-t border-surface-container-high">
            <span className="font-body text-xs font-bold uppercase tracking-wider text-secondary">
              Flavor Infusions
            </span>
            <div className="flex flex-wrap gap-2">
              {flavorOptions.map((flv) => (
                <button
                  key={flv}
                  type="button"
                  onClick={() => {
                    setSelectedFlavor(selectedFlavor === flv ? '' : flv);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedFlavor === flv
                      ? 'bg-on-surface text-surface'
                      : 'bg-surface-container-lowest text-secondary hover:text-on-surface'
                  }`}
                >
                  {flv}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cake Catalog Grid */}
      <div className="mt-4">
        {loading ? (
          <CatalogSkeleton count={8} />
        ) : error ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-8 bg-surface-container-low rounded-3xl border border-red-200/80 my-6">
            <span className="material-symbols-outlined text-[48px] text-red-500 mb-2">
              cloud_off
            </span>
            <h3 className="font-headline text-2xl font-bold text-on-surface">Backend API Not Reachable</h3>
            <p className="font-body text-sm text-secondary mt-1 max-w-md">
              Please ensure the backend server is running on port 5000. Run <code className="bg-surface-container px-2 py-0.5 rounded font-mono text-xs text-primary font-bold">npm run dev</code> from the root folder.
            </p>
            <button
              onClick={() => setRefreshIndex((v) => v + 1)}
              className="mt-4 px-6 py-2.5 rounded-full bg-primary text-white font-semibold text-sm shadow-sm hover:opacity-90 active:scale-95 transition-all"
            >
              Retry Connection
            </button>
          </div>
        ) : cakes.length === 0 ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-8 bg-surface-container-low rounded-3xl border border-outline-variant/60 my-6">
            <span className="material-symbols-outlined text-[48px] text-secondary mb-2">
              search_off
            </span>
            <h3 className="font-headline text-2xl font-bold text-on-surface">No cakes matched your search</h3>
            <p className="font-body text-sm text-secondary mt-1 max-w-sm">
              Try adjusting your price range or clearing dietary filters to see more artisanal bakes.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-6 py-2.5 rounded-full bg-primary text-on-primary font-semibold text-sm shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {cakes.map((cake) => (
              <CakeCard key={cake._id} cake={cake} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination Bar */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-low text-on-surface disabled:opacity-40 hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>

          {[...Array(pages)].map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 rounded-full font-body text-sm font-bold transition-all ${
                  currentPage === pageNum
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-low text-secondary hover:bg-surface-container'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(pages, p + 1))}
            disabled={currentPage === pages}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-low text-on-surface disabled:opacity-40 hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Shop;
