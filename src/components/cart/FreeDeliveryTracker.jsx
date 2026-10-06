import React from 'react';
import { useCart } from '../../context/CartContext';

const FreeDeliveryTracker = () => {
  const { isFreeDelivery, freeDeliveryProgress, amountLeftForFreeDelivery } = useCart();

  return (
    <div className="w-full bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-confectionery-1 border border-outline-variant/60 flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="material-symbols-outlined text-primary text-[22px] flex-shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            local_shipping
          </span>
          <span className="font-body text-sm sm:text-base font-bold text-on-surface truncate">
            {isFreeDelivery
              ? '🎉 You unlocked Free Express Delivery!'
              : `Add ₹${Math.round(amountLeftForFreeDelivery)} more for Free Express!`}
          </span>
        </div>
        <span className="font-body text-xs sm:text-sm font-bold text-primary flex-shrink-0">
          {freeDeliveryProgress}%
        </span>
      </div>

      {/* Fluid Bakery Progress Bar */}
      <div className="w-full h-2.5 rounded-full bg-surface-container-high overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${freeDeliveryProgress}%` }}
        ></div>
      </div>

      <p className="font-body text-xs text-secondary leading-snug">
        Unlock temperature-controlled chilled box delivery and priority morning dispatch.
      </p>
    </div>
  );
};

export default FreeDeliveryTracker;
