import React from 'react';
import { useCart } from '../../context/CartContext';

const CartItemRow = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="w-full bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-confectionery-1 border border-outline-variant/60 flex flex-col gap-3 relative">
      <div className="flex gap-4 items-start">
        {/* Cake Thumbnail with Weight Badge */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 relative bg-surface-container border border-surface-container-high">
          <img
            src={item.image || '/assets/strawberry-cake.png'}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=200&q=80';
            }}
          />
          <span className="absolute bottom-1 left-1 bg-surface-container-lowest/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-primary shadow-sm">
            {item.weight}
          </span>
        </div>

        {/* Item Information */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-headline text-base sm:text-lg font-bold text-on-surface truncate">
              {item.name}
            </h3>
            <button
              type="button"
              onClick={() => removeFromCart(item.id)}
              aria-label="Remove item"
              className="text-secondary hover:text-primary transition-colors p-1 -mr-1"
            >
              <span className="material-symbols-outlined text-[20px]">delete</span>
            </button>
          </div>

          {/* Flavor note */}
          {item.flavor && (
            <p className="text-xs text-secondary italic truncate mt-0.5">
              Flavor: {item.flavor}
            </p>
          )}

          {/* Message on Cake Badge if any */}
          {item.messageOnCake && (
            <div className="mt-1 inline-flex items-center gap-1.5 text-secondary bg-surface-container-low px-2.5 py-1 rounded-full w-fit max-w-full">
              <span className="material-symbols-outlined text-[14px] text-primary flex-shrink-0">
                edit_note
              </span>
              <span className="font-body text-xs truncate">
                "{item.messageOnCake}"
              </span>
            </div>
          )}

          {/* Finishing style */}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {item.isEggless && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                Eggless
              </span>
            )}
            {item.finishingStyle && (
              <span className="text-[11px] font-medium text-secondary bg-secondary-container/40 px-2 py-0.5 rounded-full">
                {item.finishingStyle}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Price & Quantity Row */}
      <div className="flex items-center justify-between pt-2 border-t border-surface-container-high/60">
        <div className="flex items-baseline gap-1.5">
          <span className="font-headline text-lg sm:text-xl font-bold text-on-surface">
            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
          </span>
          {item.quantity > 1 && (
            <span className="text-xs text-secondary">
              (₹{item.price.toLocaleString('en-IN')} each)
            </span>
          )}
        </div>

        {/* Pill Quantity Stepper */}
        <div className="flex items-center bg-secondary-container/40 rounded-full px-1.5 py-0.5 gap-2 border border-outline-variant/40">
          <button
            type="button"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            aria-label="Decrease quantity"
            className="w-7 h-7 rounded-full flex items-center justify-center text-primary hover:bg-white active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">remove</span>
          </button>
          <span className="font-body text-sm font-bold text-on-surface min-w-[20px] text-center">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            aria-label="Increase quantity"
            className="w-7 h-7 rounded-full flex items-center justify-center text-primary hover:bg-white active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemRow;
