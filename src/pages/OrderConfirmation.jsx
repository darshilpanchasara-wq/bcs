import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import api from '../api/axios';
import OrderStatusStepper from '../components/order/OrderStatusStepper';
import UpiScannerCard from '../components/common/UpiScannerCard';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#b5143c', '#fdcfca', '#805200', '#ffffff']
      });
    } catch {}

    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch (err) {
        console.error('Failed to load order:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
        <p className="mt-4 font-body text-sm text-secondary">Retrieving bakery receipt...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-surface-container-low rounded-3xl border border-outline-variant">
        <h2 className="font-headline text-2xl font-bold">Order Not Found</h2>
        <Link to="/" className="inline-block mt-4 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold">
          Return to Patisserie
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Celebration Header */}
      <div className="text-center flex flex-col items-center gap-3 mb-8">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white shadow-confectionery-2">
          <span className="material-symbols-outlined text-[32px]">celebration</span>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Order Successfully Placed
        </span>
        <h1 className="font-headline text-3xl sm:text-4xl font-bold text-on-surface">
          Thank You For Celebrating with Bhuvneshwari Cakes!
        </h1>
        <p className="font-body text-sm text-secondary max-w-md">
          Your order has been transmitted directly to Chef Darshil Panchasara’s kitchen station at Shree Bhuvneshwari Cake & Snacks.
        </p>
        <span className="inline-block px-4 py-1.5 rounded-full bg-surface-container font-mono text-xs font-bold text-on-surface mt-1">
          Order ID: #{order._id.slice(-6).toUpperCase()}
        </span>
      </div>

      {/* Live Order Tracker Stepper */}
      <div className="mb-8">
        <OrderStatusStepper
          currentStatus={order.orderStatus}
          statusHistory={order.statusHistory}
        />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Delivery Details */}
        <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-confectionery-1 flex flex-col gap-3">
          <h3 className="font-headline text-lg font-bold text-on-surface border-b border-surface-container-high pb-2.5">
            Scheduled Delivery
          </h3>
          <div className="text-xs text-secondary flex flex-col gap-1.5">
            <p><strong>Handover Slot:</strong> {order.deliverySlot?.date} • {order.deliverySlot?.timeSlot}</p>
            <p><strong>Recipient:</strong> {order.shippingAddress?.name} ({order.shippingAddress?.phone})</p>
            <p><strong>Address:</strong> {order.shippingAddress?.street}, {order.shippingAddress?.apartment ? `${order.shippingAddress?.apartment}, ` : ''}{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
            <p><strong>Packaging:</strong> Insulated Temperature Chilled Box</p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-confectionery-1 flex flex-col gap-3">
          <h3 className="font-headline text-lg font-bold text-on-surface border-b border-surface-container-high pb-2.5">
            Payment Status
          </h3>
          <div className="text-xs text-secondary flex flex-col gap-1.5">
            <p><strong>Payment Mode:</strong> {order.paymentMethod === 'UPI' ? 'Direct UPI (9427243732)' : order.paymentMethod}</p>
            <p>
              <strong>Payment Status:</strong>{' '}
              {order.isPaid
                ? 'Paid via Gateway'
                : order.paymentMethod === 'UPI'
                ? 'UPI Pending • Send Screenshot to 9313581083'
                : 'Payment on Delivery / Pending'}
            </p>
            {order.appliedCoupon && (
              <p className="text-primary font-semibold">
                <strong>Coupon Discount:</strong> {order.appliedCoupon} (-₹{order.discountAmount?.toLocaleString('en-IN')})
              </p>
            )}
            <p className="text-base font-headline font-bold text-on-surface pt-2">
              Total Amount: <span className="text-primary">₹{order.totalPrice.toLocaleString('en-IN')}</span>
            </p>

            {order.paymentMethod === 'UPI' && (
              <div className="mt-4">
                <UpiScannerCard
                  amount={order.totalPrice}
                  orderId={order._id}
                  showUtrInput={false}
                  showWhatsAppShare={true}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Items Breakdown Table */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-confectionery-1 mb-8">
        <h3 className="font-headline text-lg font-bold text-on-surface border-b border-surface-container-high pb-3 mb-4">
          Confectionery Items
        </h3>

        <div className="flex flex-col gap-3">
          {order.orderItems.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-surface-container-high/60 last:border-none">
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-bold text-sm text-on-surface">{item.name}</h4>
                  <p className="text-xs text-secondary">
                    {item.weight} {item.flavor ? `• ${item.flavor}` : ''}
                  </p>
                  {item.messageOnCake && (
                    <span className="text-[11px] text-primary italic">
                      "{item.messageOnCake}" ({item.finishingStyle})
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-secondary block">Qty: {item.quantity}</span>
                <span className="font-bold text-sm text-on-surface">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => window.print()}
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-surface-container-low text-on-surface font-semibold text-sm hover:bg-surface-container flex items-center justify-center gap-2 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">print</span>
          Print Receipt
        </button>
        <Link
          to="/orders"
          className="w-full sm:w-auto px-7 py-3 rounded-full bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <span>View All My Orders</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
