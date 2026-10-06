import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';
import UpiScannerCard from '../components/common/UpiScannerCard';

const Checkout = () => {
  const { cartItems, subtotal, deliveryFee, discountAmount, totalPrice, appliedCoupon, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Address State
  const defaultAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0] || {};
  const [address, setAddress] = useState({
    name: defaultAddress.name || user?.name || '',
    phone: defaultAddress.phone || user?.phone || '',
    street: defaultAddress.street || '',
    apartment: defaultAddress.apartment || '',
    city: defaultAddress.city || 'Ahmedabad',
    state: defaultAddress.state || 'Gujarat',
    pincode: defaultAddress.pincode || '380015'
  });

  // Slot State
  const [deliveryDate, setDeliveryDate] = useState('Tomorrow');
  const [timeSlot, setTimeSlot] = useState('2:00 PM – 4:00 PM');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI', 'Razorpay', or 'COD'
  const [upiRef, setUpiRef] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Pincode validation state
  const [pincodeValid, setPincodeValid] = useState(true);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handlePincodeChange = (val) => {
    setAddress({ ...address, pincode: val });
    // Valid if 5-6 digits
    if (/^\d{5,6}$/.test(val.trim())) {
      setPincodeValid(true);
    } else {
      setPincodeValid(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!address.name || !address.phone || !address.street || !address.city || !address.pincode) {
      showToast('Please fill out all delivery address fields.', 'error');
      return;
    }

    if (!pincodeValid) {
      showToast('Please enter a valid 5 or 6 digit pincode for delivery check.', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          cake: item.cakeId,
          name: item.name,
          image: item.image,
          weight: item.weight,
          flavor: item.flavor,
          isEggless: item.isEggless,
          messageOnCake: item.messageOnCake,
          finishingStyle: item.finishingStyle,
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress: address,
        deliverySlot: {
          date: deliveryDate,
          timeSlot
        },
        paymentMethod,
        couponCode: appliedCoupon?.code || ''
      };

      const res = await api.post('/orders', orderPayload);

      if (res.data.success) {
        const createdOrder = res.data.order;
        const razorpayOrder = res.data.razorpayOrder;
        const razorpayKeyId = res.data.razorpayKeyId;

        // If Direct UPI or Cash on Delivery, complete immediately
        if (paymentMethod === 'UPI' || paymentMethod === 'COD') {
          clearCart();
          if (paymentMethod === 'UPI') {
            showToast('Order confirmed via UPI (9427243732)! 🎂', 'success');
          } else {
            showToast('Order confirmed with Cash on Delivery! 🍰', 'success');
          }
          navigate(`/order-confirmation/${createdOrder._id}`);
          return;
        }

        // Razorpay Online Flow
        if (window.Razorpay && !razorpayOrder?.isMock && !razorpayKeyId?.includes('placeholder')) {
          const options = {
            key: razorpayKeyId,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency || 'INR',
            name: 'BHUVNESHWARI CAKES',
            description: `Payment for Order #${createdOrder._id.slice(-6).toUpperCase()}`,
            image: '/assets/bcs-logo.png',
            order_id: razorpayOrder.id,
            handler: async function (response) {
              try {
                await api.post(`/orders/${createdOrder._id}/verify-payment`, {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature
                });
                clearCart();
                showToast('Payment successful! Your order is baking.', 'success');
                navigate(`/order-confirmation/${createdOrder._id}`);
              } catch (verifyErr) {
                showToast('Payment verification failed: ' + verifyErr.message, 'error');
              }
            },
            prefill: {
              name: address.name,
              email: user?.email || 'darshil@bhuvneshwaricakes.com',
              contact: address.phone
            },
            theme: {
              color: '#b5143c'
            }
          };

          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (response) {
            showToast('Payment failed: ' + response.error.description, 'error');
            setIsProcessing(false);
          });
          rzp.open();
        } else {
          // Simulated / Test Mode fallback when no live keys are configured
          setTimeout(async () => {
            try {
              await api.post(`/orders/${createdOrder._id}/verify-payment`, {
                razorpayOrderId: razorpayOrder?.id || `order_mock_${Date.now()}`,
                razorpayPaymentId: `pay_mock_${Date.now()}`,
                razorpaySignature: 'mock_signature_test_mode'
              });
              clearCart();
              showToast('Test Razorpay payment verified! Order confirmed.', 'success');
              navigate(`/order-confirmation/${createdOrder._id}`);
            } catch (err) {
              console.error('Fallback verify error:', err);
              clearCart();
              navigate(`/order-confirmation/${createdOrder._id}`);
            }
          }, 1200);
        }
      }
    } catch (err) {
      showToast(err.message, 'error');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      <div className="flex items-center gap-2 mb-6">
        <Link to="/cart" className="text-secondary hover:text-primary transition-colors flex items-center">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <h1 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
          Checkout & Scheduled Delivery
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Multi-Step Forms */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Step 1: Delivery Address Form */}
          <div className="w-full bg-surface-container-lowest rounded-2xl p-6 shadow-confectionery-1 border border-outline-variant/60 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-surface-container-high pb-3">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs font-bold">
                1
              </div>
              <h3 className="font-headline text-lg font-bold text-on-surface">
                Delivery Address & Contact
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-secondary">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  required
                  value={address.name}
                  onChange={(e) => setAddress({ ...address, name: e.target.value })}
                  placeholder="e.g. Pooja Patel"
                  className="w-full h-11 px-3.5 mt-1 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/60 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-secondary">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full h-11 px-3.5 mt-1 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/60 outline-none focus:border-primary"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  placeholder="e.g. 102, Shivalik Highstreet, Satellite Road"
                  className="w-full h-11 px-3.5 mt-1 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/60 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-secondary">
                  Apartment / Suite / Landmark
                </label>
                <input
                  type="text"
                  value={address.apartment}
                  onChange={(e) => setAddress({ ...address, apartment: e.target.value })}
                  placeholder="e.g. Near Swaminarayan Temple"
                  className="w-full h-11 px-3.5 mt-1 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/60 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-secondary">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder="e.g. Ahmedabad"
                  className="w-full h-11 px-3.5 mt-1 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/60 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-secondary">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  placeholder="e.g. Gujarat"
                  className="w-full h-11 px-3.5 mt-1 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/60 outline-none focus:border-primary"
                />
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary">
                    Pincode / Postal Code *
                  </label>
                  {pincodeValid && address.pincode && (
                    <span className="text-[11px] font-bold text-green-700 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px]">check</span> Chilled Delivery Available
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  required
                  value={address.pincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  placeholder="e.g. 10024"
                  className={`w-full h-11 px-3.5 mt-1 rounded-xl bg-surface-container-low text-on-surface text-sm border outline-none ${
                    pincodeValid ? 'border-outline-variant/60 focus:border-primary' : 'border-red-500 focus:border-red-600'
                  }`}
                />
                {!pincodeValid && (
                  <span className="text-[11px] text-red-600 mt-1 block">
                    Please provide a valid 5 or 6 digit postal code.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Step 2: Delivery Slot & Care */}
          <div className="w-full bg-surface-container-lowest rounded-2xl p-6 shadow-confectionery-1 border border-outline-variant/60 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-surface-container-high pb-3">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs font-bold">
                2
              </div>
              <h3 className="font-headline text-lg font-bold text-on-surface">
                Delivery Schedule & Chilled Care
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">
                Select Handover Day
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Today (Express)', 'Tomorrow', 'This Weekend'].map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setDeliveryDate(day)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold text-center transition-all ${
                      deliveryDate === day
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              <label className="text-xs font-bold uppercase tracking-wider text-secondary mt-2">
                Select Preferred Time Slot
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {['Morning: 10 AM – 1 PM', 'Afternoon: 2 PM – 5 PM', 'Evening: 6 PM – 9 PM'].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold text-center transition-all ${
                      timeSlot === slot
                        ? 'bg-on-surface text-surface shadow-sm'
                        : 'bg-surface-container-low text-secondary hover:text-on-surface'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-2 p-3 rounded-xl bg-surface-container-low text-xs text-secondary">
                <span className="material-symbols-outlined text-[18px] text-tertiary">severe_cold</span>
                <span>All cakes are transported in our temperature-controlled insulated confectionery box.</span>
              </div>
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="w-full bg-surface-container-lowest rounded-2xl p-6 shadow-confectionery-1 border border-outline-variant/60 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs font-bold">
                  3
                </div>
                <h3 className="font-headline text-lg font-bold text-on-surface">Payment Method</h3>
              </div>
              <span className="text-xs text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">lock</span> 256-bit Encrypted
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {/* Direct UPI Option with 9427243732 */}
              <label
                className={`flex flex-col p-4 rounded-xl cursor-pointer transition-all border ${
                  paymentMethod === 'UPI'
                    ? 'bg-secondary-container/40 border-primary shadow-sm'
                    : 'bg-surface-container-low border-transparent hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      className="accent-primary w-4 h-4"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-headline text-base font-bold text-on-surface">
                          Direct UPI (GPay / PhonePe / Paytm)
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white font-mono">
                          9427243732
                        </span>
                      </div>
                      <span className="text-xs text-secondary">
                        Fast zero-fee transfer via any UPI app to Darshil Panchasara
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-emerald-600 text-[24px]">qr_code_2</span>
                </div>

                {/* Expanded details when selected */}
                {paymentMethod === 'UPI' && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-3 pt-3 border-t border-outline-variant/50 flex flex-col items-center gap-2.5 animate-in fade-in duration-200"
                  >
                    <UpiScannerCard
                      amount={totalPrice}
                      upiRef={upiRef}
                      setUpiRef={setUpiRef}
                      showUtrInput={true}
                      showWhatsAppShare={true}
                    />
                  </div>
                )}
              </label>

              {/* Razorpay Option */}
              <label
                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border ${
                  paymentMethod === 'Razorpay'
                    ? 'bg-secondary-container/40 border-primary shadow-sm'
                    : 'bg-surface-container-low border-transparent hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Razorpay'}
                    onChange={() => setPaymentMethod('Razorpay')}
                    className="accent-primary w-4 h-4"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-headline text-base font-bold text-on-surface">
                        Razorpay Secure Gateway
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-white">
                        Recommended
                      </span>
                    </div>
                    <span className="text-xs text-secondary">
                      Credit / Debit Card, UPI (Google Pay, PhonePe, Paytm), Net Banking
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-primary text-[22px]">credit_card</span>
              </label>

              {/* Cash On Delivery Option */}
              <label
                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border ${
                  paymentMethod === 'COD'
                    ? 'bg-secondary-container/40 border-primary shadow-sm'
                    : 'bg-surface-container-low border-transparent hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="accent-primary w-4 h-4"
                  />
                  <div>
                    <span className="font-headline text-base font-bold text-on-surface">
                      Cash on Delivery (COD)
                    </span>
                    <p className="text-xs text-secondary">
                      Pay with cash or card reader upon cake handover.
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-secondary text-[22px]">payments</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Button */}
        <div className="lg:col-span-5 flex flex-col gap-5 sticky top-28">
          <div className="w-full bg-surface-container-lowest rounded-2xl p-6 shadow-confectionery-1 border border-outline-variant/60 flex flex-col gap-4">
            <h4 className="font-headline text-xl font-bold text-on-surface border-b border-surface-container-high pb-3">
              Items in Your Order
            </h4>

            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-on-surface truncate">{item.name}</span>
                      <span className="text-secondary text-[11px]">
                        {item.weight} • Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-on-surface ml-2">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-surface-container-high pt-3 flex flex-col gap-2 text-sm text-secondary">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-on-surface font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-primary font-medium">
                  <span>Promo Discount ({appliedCoupon?.code})</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Chilled Protective Box</span>
                <span className="text-primary font-bold">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-on-surface font-semibold">
                  {deliveryFee === 0 ? <span className="text-primary font-bold">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>
            </div>

            <div className="border-t border-surface-container-high pt-3 flex justify-between items-baseline">
              <span className="font-headline text-lg font-bold text-on-surface">Total Amount</span>
              <span className="font-headline text-2xl font-bold text-primary">₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full h-14 rounded-full bg-primary hover:bg-primary-container text-on-primary font-body text-base font-bold shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                  <span>Securing Order...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                  <span>Place Order • ₹{totalPrice.toLocaleString('en-IN')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
