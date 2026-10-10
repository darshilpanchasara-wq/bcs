import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { clientStore } from '../api/clientStore';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import RatingStars from '../components/common/RatingStars';
import CakeCard from '../components/cake/CakeCard';

const CakeDetails = () => {
  const { identifier } = useParams();
  const { addToCart } = useCart();
  const { user, isAuthenticated, toggleWishlist, isInWishlist } = useAuth();
  const { showToast } = useToast();

  const [cake, setCake] = useState(null);
  const [relatedCakes, setRelatedCakes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Customization States
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [messageOnCake, setMessageOnCake] = useState('');
  const [finishingStyle, setFinishingStyle] = useState('Cursive Cream Piping');
  const [isEggless, setIsEggless] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Review Form States
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchCakeDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/cakes/${identifier}`);
        if (res && res.data && res.data.success) {
          const cakeData = res.data.cake;
          setCake(cakeData);
          setRelatedCakes(res.data.relatedCakes || []);
          setReviews(res.data.reviews || []);

          // Set default weight
          const defaultOpt =
            cakeData.weightOptions?.find((w) => w.isDefault) ||
            cakeData.weightOptions?.[0] || {
              weight: '1.0 kg',
              servings: '8-10 Slices',
              price: cakeData.basePrice
            };
          setSelectedWeight(defaultOpt);

          // Set default flavor
          if (cakeData.flavors && cakeData.flavors.length > 0) {
            setSelectedFlavor(cakeData.flavors[0]);
          }

          setIsEggless(cakeData.isEggless || false);
          setSelectedImageIndex(0);
        } else {
          throw new Error('Fallback to clientStore');
        }
      } catch (err) {
        console.warn('Using clientStore cake fallback:', err.message);
        const fallback = clientStore.getCakeById(identifier);
        if (fallback) {
          setCake(fallback.cake);
          setRelatedCakes(fallback.relatedCakes || []);
          setReviews(fallback.reviews || []);
          const defaultOpt =
            fallback.cake.weightOptions?.find((w) => w.isDefault) ||
            fallback.cake.weightOptions?.[0] || {
              weight: '1.0 kg',
              servings: '8-10 Slices',
              price: fallback.cake.basePrice
            };
          setSelectedWeight(defaultOpt);
          if (fallback.cake.flavors && fallback.cake.flavors.length > 0) {
            setSelectedFlavor(fallback.cake.flavors[0]);
          }
          setIsEggless(fallback.cake.isEggless || false);
        } else {
          showToast('Could not load cake details.', 'error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCakeDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [identifier]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
        <p className="mt-4 font-body text-sm text-secondary font-medium">Baking fresh preview...</p>
      </div>
    );
  }

  if (!cake) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-surface-container-low rounded-3xl border border-outline-variant">
        <h2 className="font-headline text-2xl font-bold">Cake Not Found</h2>
        <p className="text-sm text-secondary mt-2">The artisanal cake you are looking for is no longer in the oven.</p>
        <Link to="/shop" className="inline-block mt-4 px-6 py-2.5 rounded-full bg-primary text-white font-semibold text-sm">
          Browse Catalog
        </Link>
      </div>
    );
  }

  const currentPrice = selectedWeight ? selectedWeight.price : cake.basePrice;
  const isFavorited = isInWishlist(cake._id);

  const handleAddToCart = () => {
    addToCart({
      cakeId: cake._id,
      name: cake.name,
      image: cake.images?.[0] || '/assets/strawberry-cake.png',
      weight: selectedWeight ? selectedWeight.weight : '1.0 kg',
      price: currentPrice,
      flavor: selectedFlavor,
      isEggless,
      messageOnCake: messageOnCake.trim(),
      finishingStyle,
      quantity
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please log in to leave a review.', 'info');
      return;
    }
    if (!reviewComment.trim()) {
      showToast('Please provide a comment for your review.', 'error');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.post(`/reviews/cake/${cake._id}`, {
        rating: reviewRating,
        comment: reviewComment.trim()
      });

      if (res.data.success) {
        showToast('Thank you! Your review has been published.', 'success');
        setReviews([res.data.review, ...reviews]);
        setCake((prev) => ({
          ...prev,
          rating: res.data.cakeRating,
          numReviews: res.data.numReviews
        }));
        setReviewComment('');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const activeImage = cake.images?.[selectedImageIndex] || cake.images?.[0] || '/assets/strawberry-cake.png';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-secondary mb-6 overflow-x-auto no-scrollbar">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-primary transition-colors">Cakes</Link>
        <span>/</span>
        {cake.category && (
          <>
            <Link to={`/shop?category=${cake.categorySlug}`} className="hover:text-primary transition-colors capitalize">
              {cake.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-on-surface font-semibold truncate">{cake.name}</span>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Main Visual Display */}
          <div className="relative w-full aspect-[4/3] rounded-3xl bg-surface-container-low overflow-hidden shadow-confectionery-2 border border-outline-variant/60 group">
            <img
              src={activeImage}
              alt={cake.name}
              className="w-full h-full object-cover transition-all duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1000&q=80';
              }}
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none"></div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-on-primary text-xs font-bold shadow-md">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  workspace_premium
                </span>
                Chef’s Signature
              </span>
              {cake.isEggless && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-secondary text-xs font-bold shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">eco</span>
                  100% Eggless Option
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(cake._id)}
              aria-label="Toggle Wishlist"
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center text-primary shadow-md active:scale-90 transition-transform z-10"
            >
              <span className={`material-symbols-outlined text-[20px] ${isFavorited ? 'fill text-primary' : 'text-secondary hover:text-primary'}`}>
                {isFavorited ? 'favorite' : 'favorite'}
              </span>
            </button>
          </div>

          {/* Thumbnails Row */}
          {cake.images && cake.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
              {cake.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden shadow-sm transition-all ${
                    selectedImageIndex === idx
                      ? 'ring-2 ring-primary scale-105 opacity-100'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Detailed Description & Ingredients Accordion */}
          <div className="mt-4 p-6 rounded-3xl bg-surface-container-low border border-outline-variant/60 flex flex-col gap-4">
            <h3 className="font-headline text-xl font-bold text-on-surface">The Confectionery Story</h3>
            <p className="font-body text-sm text-secondary leading-relaxed">{cake.description}</p>

            {/* Ingredients */}
            {((Array.isArray(cake.ingredients) && cake.ingredients.length > 0) || (typeof cake.ingredients === 'string' && cake.ingredients.trim().length > 0)) && (
              <div className="pt-2 border-t border-surface-container-high/60">
                <span className="font-body text-xs font-bold uppercase tracking-wider text-secondary">
                  Key Ingredients & Craft
                </span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(Array.isArray(cake.ingredients)
                    ? cake.ingredients
                    : cake.ingredients.split(',').map((s) => s.trim()).filter(Boolean)
                  ).map((ing, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface text-xs font-medium border border-outline-variant/40"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 pt-2 text-xs text-secondary">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                Prep Time: {cake.preparationTime || '4 - 6 hours'}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-primary">severe_cold</span>
                Chilled Packaging Included
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Customizer & Ordering Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6 bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-confectionery-1 border border-outline-variant/60">
          {/* Fresh baked pulse & Ratings */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 bg-secondary-container/40 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-body text-xs font-bold text-on-secondary-container">
                Freshly baked today
              </span>
            </div>
            <RatingStars rating={cake.rating} numReviews={cake.numReviews} size="16px" />
          </div>

          {/* Cake Title */}
          <div>
            <h1 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface leading-tight">
              {cake.name}
            </h1>
            <p className="font-body text-xs sm:text-sm text-secondary mt-1">
              {cake.shortDescription}
            </p>
          </div>

          {/* Dynamic Price Display */}
          <div className="flex items-baseline gap-3 pt-1 border-b border-surface-container-high pb-4">
            <span className="font-headline text-3xl sm:text-4xl text-primary font-bold">
              ₹{currentPrice.toLocaleString('en-IN')}
            </span>
            <span className="font-body text-base text-secondary line-through opacity-70">
              ₹{Math.round(currentPrice * 1.15).toLocaleString('en-IN')}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold uppercase tracking-wider">
              Save 15%
            </span>
          </div>

          {/* Size / Weight Selector */}
          {cake.weightOptions && Array.isArray(cake.weightOptions) && cake.weightOptions.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <label className="font-body text-xs font-bold uppercase tracking-wider text-secondary">
                  Select Size & Servings
                </label>
                <span className="text-xs text-secondary font-medium">
                  {selectedWeight?.servings || 'Ideal for celebration'}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {cake.weightOptions.map((opt, i) => {
                  const isSelected = selectedWeight?.weight === opt.weight;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedWeight(opt)}
                      className={`py-2.5 px-2 rounded-2xl flex flex-col items-center justify-center text-center transition-all ${
                        isSelected
                          ? 'bg-primary text-on-primary shadow-md scale-[1.02]'
                          : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      <span className="font-body text-xs font-bold">{opt.weight}</span>
                      <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-secondary'}`}>
                        {opt.servings || 'Guests'}
                      </span>
                      <span className={`text-xs font-semibold mt-1 ${isSelected ? 'text-white' : 'text-primary'}`}>
                        ₹{opt.price.toLocaleString('en-IN')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Flavor Selection */}
          {cake.flavors && Array.isArray(cake.flavors) && cake.flavors.length > 0 && (
            <div className="flex flex-col gap-2">
              <label className="font-body text-xs font-bold uppercase tracking-wider text-secondary">
                Flavor & Sponge Profile
              </label>
              <div className="relative">
                <select
                  value={selectedFlavor}
                  onChange={(e) => setSelectedFlavor(e.target.value)}
                  className="w-full h-12 pl-4 pr-10 rounded-2xl bg-surface-container-low text-on-surface text-xs sm:text-sm font-medium appearance-none outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/40"
                >
                  {cake.flavors.map((flv, idx) => (
                    <option key={idx} value={flv}>
                      {flv}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none text-[20px]">
                  expand_more
                </span>
              </div>
            </div>
          )}

          {/* Personalization: Message on Cake */}
          <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-primary">
                <span className="material-symbols-outlined text-[18px]">edit_note</span>
                <span className="font-body text-xs font-bold uppercase tracking-wider text-on-surface">
                  Piped Message on Cake
                </span>
              </div>
              <span className="text-[11px] font-mono text-secondary">
                {messageOnCake.length} / 35
              </span>
            </div>
            <input
              type="text"
              maxLength={35}
              value={messageOnCake}
              onChange={(e) => setMessageOnCake(e.target.value)}
              placeholder="e.g., Happy Birthday Pooja! ❤️ or Rings For Aarav & Diya 💍"
              className="w-full h-11 px-3.5 rounded-xl bg-surface-container-lowest text-on-surface text-xs sm:text-sm placeholder:text-secondary/50 outline-none border border-outline-variant/50 focus:border-primary transition-all"
            />

            {/* Finishing Style Switches */}
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="text-[11px] text-secondary font-medium">Finishing Style:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFinishingStyle('Cursive Cream Piping')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    finishingStyle === 'Cursive Cream Piping'
                      ? 'bg-surface-container text-primary font-bold border border-primary/40 shadow-sm'
                      : 'bg-surface-container-lowest text-secondary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {finishingStyle === 'Cursive Cream Piping' ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  Cursive Cream
                </button>
                <button
                  type="button"
                  onClick={() => setFinishingStyle('Chocolate Plaque')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    finishingStyle === 'Chocolate Plaque'
                      ? 'bg-surface-container text-primary font-bold border border-primary/40 shadow-sm'
                      : 'bg-surface-container-lowest text-secondary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {finishingStyle === 'Chocolate Plaque' ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  Chocolate Plaque
                </button>
              </div>
            </div>
          </div>

          {/* Eggless Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/60">
            <div className="flex flex-col">
              <span className="font-body text-xs font-bold text-on-surface">100% Eggless Preparation</span>
              <span className="text-[11px] text-secondary">Flax & Greek yogurt crumb substitution</span>
            </div>
            <button
              type="button"
              onClick={() => setIsEggless(!isEggless)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isEggless ? 'bg-primary' : 'bg-surface-container-highest'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isEggless ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Quantity Stepper & Add to Cart Button */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center bg-surface-container-low rounded-full px-2 py-1 gap-2 border border-outline-variant/50">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-white transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <span className="font-body text-sm font-bold text-on-surface min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-white transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 h-12 rounded-full bg-primary hover:bg-primary-container text-on-primary font-body text-sm sm:text-base font-bold shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              <span>Add to Cart • ₹{(currentPrice * quantity).toLocaleString('en-IN')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reviews & Ratings Section */}
      <section className="mt-16 pt-12 border-t border-surface-container-high">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Reviews List */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex items-baseline justify-between">
              <h2 className="font-headline text-2xl font-bold text-on-surface">
                Customer Reviews ({reviews.length})
              </h2>
              <RatingStars rating={cake.rating} showNum={true} size="16px" />
            </div>

            {(!Array.isArray(reviews) || reviews.length === 0) ? (
              <p className="text-sm text-secondary italic">Be the first to review this artisanal cake!</p>
            ) : (
              <div className="flex flex-col gap-4">
                {(Array.isArray(reviews) ? reviews : []).map((rev) => (
                  <div
                    key={rev._id}
                    className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                          alt={rev.userName}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-on-surface">{rev.userName}</h4>
                          <span className="text-[10px] text-secondary">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <RatingStars rating={rev.rating} showNum={false} size="14px" />
                    </div>
                    <p className="font-body text-xs sm:text-sm text-secondary leading-relaxed mt-1">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Leave a Review Form */}
          <div className="lg:col-span-5 bg-surface-container-low p-6 sm:p-8 rounded-3xl border border-outline-variant/60">
            <h3 className="font-headline text-xl font-bold text-on-surface mb-2">Write a Review</h3>
            <p className="font-body text-xs text-secondary mb-4">
              Share your tasting experience with other cake aficionados.
            </p>

            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-secondary uppercase">Your Rating</label>
                <div className="flex items-center gap-1 mt-1 text-tertiary">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <span
                        className="material-symbols-outlined text-[28px]"
                        style={{ fontVariationSettings: star <= reviewRating ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        star
                      </span>
                    </button>
                  ))}
                  <span className="ml-2 font-bold text-xs text-on-surface">{reviewRating} Stars</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-secondary uppercase">Your Comments</label>
                <textarea
                  rows={4}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Tell us about the texture, sweetness balance, and delivery..."
                  className="w-full p-3 mt-1 rounded-2xl bg-surface-container-lowest text-on-surface text-xs sm:text-sm border border-outline-variant/60 outline-none focus:border-primary"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full h-11 rounded-full bg-primary hover:bg-primary-container text-on-primary font-semibold text-xs sm:text-sm shadow-sm transition-transform active:scale-95 disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Related Cakes Section */}
      {relatedCakes && Array.isArray(relatedCakes) && relatedCakes.length > 0 && (
        <section className="mt-16 pt-12 border-t border-surface-container-high">
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">
            You May Also Adore
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedCakes.map((related) => (
              <CakeCard key={related._id} cake={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default CakeDetails;
