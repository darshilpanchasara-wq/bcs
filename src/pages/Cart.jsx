import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import FreeDeliveryTracker from '../components/cart/FreeDeliveryTracker';
import CartItemRow from '../components/cart/CartItemRow';

const Cart = () => {
  const {
    cartItems,
    itemCount,
    subtotal,
    deliveryFee,
    packagingFee,
    discountAmount,
    totalPrice,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [applying, setApplying] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setApplying(true);
    await applyCoupon(couponInput.trim().toUpperCase());
    setApplying(false);
    setCouponInput('');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center flex flex-col items-center justify-center gap-4">
        <div className="w-24 h-24 rounded-full bg-secondary-container/50 flex items-center justify-center text-primary mb-2 shadow-inner">
          <span className="material-symbols-outlined text-[44px]">shopping_bag</span>
        </div>
        <h2 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
          Your Patisserie Box is Empty
        </h2>
        <p className="font-body text-sm text-secondary max-w-sm">
          It looks like you haven't picked any freshly whipped celebration cakes yet.
        </p>
        <Link
          to="/shop"
          className="mt-2 px-8 py-3.5 rounded-full bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm shadow-md transition-all active:scale-95"
        >
          Explore Delicious Cakes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="font-headline text-2xl sm:text-4xl font-bold text-on-surface">
          My Sweet Cart <span className="font-body text-sm font-normal text-secondary">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
        </h1>
        <Link to="/shop" className="text-xs sm:text-sm font-semibold text-primary hover:underline flex items-center gap-0.5">
          <span>Continue Shopping</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery Progress & Cart Items */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <FreeDeliveryTracker />

          <div className="flex flex-col gap-4">
            {cartItems.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Right Column: Coupon & Order Summary */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Coupon Code Card */}
          <div className="w-full bg-surface-container-lowest rounded-2xl p-5 shadow-confectionery-1 border border-outline-variant/60 flex flex-col gap-3">
            <label className="font-body text-xs font-bold uppercase tracking-wider text-secondary">
              Baker's Promo Code
            </label>

            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-secondary-container/40 p-3.5 rounded-2xl border border-secondary-container">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    redeem
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-body text-sm font-bold text-on-surface">
                      {appliedCoupon.code} (-{appliedCoupon.discountPercentage}%)
                    </span>
                    <span className="text-xs text-primary font-semibold">
                      Applied! Saved ₹{discountAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-xs text-secondary hover:text-primary font-semibold ml-2 underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="e.g., BHUVNESHWARI15"
                  className="flex-1 h-11 px-4 rounded-xl bg-surface-container-low text-on-surface font-mono text-sm uppercase placeholder:text-secondary/50 outline-none border border-outline-variant/60 focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={applying || !couponInput.trim()}
                  className="h-11 px-5 rounded-xl bg-on-surface text-surface font-body text-xs sm:text-sm font-bold shadow-sm disabled:opacity-50 active:scale-95 transition-transform"
                >
                  {applying ? 'Checking...' : 'Apply'}
                </button>
              </form>
            )}

            {!appliedCoupon && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-secondary">Celebration offer: Use code:</span>
                <button
                  type="button"
                  onClick={() => applyCoupon('BHUVNESHWARI15')}
                  className="text-[11px] font-bold text-primary hover:underline font-mono"
                >
                  BHUVNESHWARI15 (-15%)
                </button>
              </div>
            )}
          </div>

          {/* Order Summary Card */}
          <div className="w-full bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-confectionery-1 border border-outline-variant/60 flex flex-col gap-3.5">
            <h4 className="font-headline text-xl font-bold text-on-surface border-b border-surface-container-high pb-3">
              Order Breakdown
            </h4>

            <div className="flex justify-between text-sm text-secondary">
              <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
              <span className="text-on-surface font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-sm text-primary font-medium">
                <span>Promo Discount ({appliedCoupon?.code})</span>
                <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-sm text-secondary">
              <span className="flex items-center gap-1">
                Chilled Protective Box
                <span className="material-symbols-outlined text-[14px] text-tertiary">severe_cold</span>
              </span>
              <span className="text-primary font-bold">COMPLIMENTARY</span>
            </div>

            <div className="flex justify-between text-sm text-secondary">
              <span>Express Chilled Handover</span>
              <span className="text-on-surface font-semibold">
                {deliveryFee === 0 ? <span className="text-primary font-bold">FREE</span> : `₹${deliveryFee}`}
              </span>
            </div>

            <div className="w-full h-px bg-surface-container-high my-1"></div>

            <div className="flex justify-between items-baseline pt-1">
              <div className="flex flex-col">
                <span className="font-headline text-lg sm:text-xl font-bold text-on-surface">Total</span>
                <span className="text-[11px] text-secondary">Includes all taxes</span>
              </div>
              <div className="text-right">
                <span className="font-headline text-2xl sm:text-3xl font-bold text-primary">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="mt-4 w-full h-14 rounded-full bg-primary hover:bg-primary-container text-on-primary font-body text-base font-bold shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <span>Proceed to Checkout</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
