import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('sweetcrumbs_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('sweetcrumbs_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const { showToast } = useToast();

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('sweetcrumbs_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('sweetcrumbs_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('sweetcrumbs_coupon');
    }
  }, [appliedCoupon]);

  // Calculations
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  const freeDeliveryThreshold = 500.0;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;
  const deliveryFee = cartItems.length === 0 ? 0 : isFreeDelivery ? 0 : 50.0;
  const packagingFee = 0.0; // Complimentary temperature-controlled box

  const freeDeliveryProgress = Math.min(
    100,
    Math.round((subtotal / freeDeliveryThreshold) * 100)
  );

  const amountLeftForFreeDelivery = Math.max(
    0,
    Number((freeDeliveryThreshold - subtotal).toFixed(2))
  );

  let discountAmount = 0;
  if (appliedCoupon && subtotal >= (appliedCoupon.minOrderAmount || 0)) {
    discountAmount = (subtotal * appliedCoupon.discountPercentage) / 100;
    if (appliedCoupon.maxDiscountAmount && discountAmount > appliedCoupon.maxDiscountAmount) {
      discountAmount = appliedCoupon.maxDiscountAmount;
    }
    discountAmount = Number(discountAmount.toFixed(2));
  }

  const totalPrice = Number(
    Math.max(0, subtotal - discountAmount + deliveryFee + packagingFee).toFixed(2)
  );

  const addToCart = (product) => {
    const {
      cakeId,
      name,
      image,
      weight = '1.0 kg',
      price,
      flavor = '',
      isEggless = false,
      messageOnCake = '',
      finishingStyle = 'Cursive Cream Piping',
      quantity = 1
    } = product;

    setCartItems((prev) => {
      // Find if item with same cakeId AND weight AND messageOnCake exists
      const existingIndex = prev.findIndex(
        (item) =>
          item.cakeId === cakeId &&
          item.weight === weight &&
          item.messageOnCake === messageOnCake &&
          item.flavor === flavor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            id: `${cakeId}-${weight}-${Date.now()}`,
            cakeId,
            name,
            image,
            weight,
            price: Number(price),
            flavor,
            isEggless,
            messageOnCake,
            finishingStyle,
            quantity
          }
        ];
      }
    });

    showToast(`Added ${name} to your patisserie box! 🍰`, 'success');
  };

  const updateQuantity = (itemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = async (code) => {
    try {
      const res = await api.post('/coupons/validate', {
        code,
        orderAmount: subtotal
      });

      if (res.data.success) {
        setAppliedCoupon(res.data.coupon);
        showToast(`Promo ${res.data.coupon.code} applied! Saved ₹${res.data.coupon.discountAmount}`, 'success');
        return { success: true };
      }
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, message: err.message };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Promo code removed', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        subtotal: Number(subtotal.toFixed(2)),
        deliveryFee,
        packagingFee,
        discountAmount,
        totalPrice,
        isFreeDelivery,
        freeDeliveryProgress,
        amountLeftForFreeDelivery,
        appliedCoupon,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
