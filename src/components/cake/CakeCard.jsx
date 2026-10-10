import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import RatingStars from '../common/RatingStars';

const CakeCard = ({ cake }) => {
  const { toggleWishlist, isInWishlist } = useAuth();
  const { addToCart } = useCart();

  const isFavorited = isInWishlist(cake._id);

  // Default weight option
  const defaultWeight =
    cake.weightOptions?.find((w) => w.isDefault) ||
    cake.weightOptions?.[0] || {
      weight: '1.0 kg',
      price: cake.basePrice
    };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      cakeId: cake._id,
      name: cake.name,
      image: cake.images?.[0] || '/assets/strawberry-cake.png',
      weight: defaultWeight.weight,
      price: defaultWeight.price,
      flavor: cake.flavors?.[0] || '',
      isEggless: cake.isEggless,
      messageOnCake: '',
      finishingStyle: 'Cursive Cream Piping',
      quantity: 1
    });
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(cake._id);
  };

  return (
    <div className="group relative flex flex-col rounded-2xl bg-surface-container-lowest shadow-confectionery-1 hover:shadow-confectionery-2 border border-outline-variant/50 overflow-hidden transition-all duration-300">
      {/* Product Image Frame */}
      <Link
        to={`/cakes/${cake.slug || cake._id}`}
        className="relative w-full aspect-[4/3] bg-surface-container-low overflow-hidden block"
      >
        <img
          src={cake.images?.[0] || '/assets/catalog/boss-baby.jpg'}
          alt={cake.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {cake.isBestseller && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary-container text-[11px] font-bold shadow-sm">
              <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
              Bestseller
            </span>
          )}
          {cake.isEggless && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container/90 text-on-secondary-container text-[11px] font-bold backdrop-blur-sm shadow-sm">
              <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                eco
              </span>
              Eggless
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label="Save to Wishlist"
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-surface-container-lowest/85 backdrop-blur-md flex items-center justify-center text-primary shadow-sm hover:scale-110 active:scale-95 transition-all z-10"
        >
          <span
            className={`material-symbols-outlined text-[18px] transition-colors ${
              isFavorited ? 'fill text-primary' : 'text-secondary hover:text-primary'
            }`}
          >
            {isFavorited ? 'favorite' : 'favorite'}
          </span>
        </button>

        {/* Portion Pill */}
        <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full bg-surface-container-lowest/85 backdrop-blur-md text-on-surface text-[10px] font-bold shadow-sm">
          {defaultWeight.weight}
        </span>
      </Link>

      {/* Product Details Content */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Rating */}
          <div className="mb-1">
            <RatingStars rating={cake.rating} numReviews={cake.numReviews} size="14px" />
          </div>

          {/* Title */}
          <Link
            to={`/cakes/${cake.slug || cake._id}`}
            className="block font-headline text-base sm:text-lg font-bold text-on-surface hover:text-primary transition-colors line-clamp-1"
          >
            {cake.name}
          </Link>

          {/* Description */}
          <p className="font-body text-xs text-secondary line-clamp-2 mt-1 leading-relaxed">
            {cake.shortDescription || cake.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between pt-2 border-t border-surface-container-high/60 mt-1">
          <div className="flex flex-col">
            <span className="text-[11px] text-secondary font-medium leading-none">From</span>
            <span className="font-headline text-lg sm:text-xl font-bold text-on-surface leading-tight mt-0.5">
              ₹{(defaultWeight.price || cake.basePrice).toLocaleString('en-IN')}
            </span>
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            className="px-3.5 py-2 rounded-full bg-primary hover:bg-primary-container text-on-primary font-body text-xs sm:text-sm font-semibold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CakeCard;
