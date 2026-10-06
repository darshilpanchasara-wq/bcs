import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import OrderStatusStepper from '../components/order/OrderStatusStepper';
import { useToast } from '../context/ToastContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const { showToast } = useToast();

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/my-orders');
      if (res.data.success) {
        setOrders(res.data.orders || []);
        if (res.data.orders && res.data.orders.length > 0) {
          setExpandedOrderId(res.data.orders[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to load orders:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you wish to cancel this order?')) return;

    try {
      const res = await api.put(`/orders/${orderId}/cancel`);
      if (res.data.success) {
        showToast('Order cancelled successfully.', 'info');
        fetchOrders();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
        <p className="mt-4 font-body text-sm text-secondary">Loading your order history...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-surface-container-low rounded-3xl border border-outline-variant">
        <span className="material-symbols-outlined text-[48px] text-secondary mb-2">
          receipt_long
        </span>
        <h2 className="font-headline text-2xl font-bold text-on-surface">No Orders Yet</h2>
        <p className="text-sm text-secondary mt-1">
          When you order our celebration cakes, you can track their fresh baking here.
        </p>
        <Link
          to="/shop"
          className="inline-block mt-4 px-6 py-2.5 rounded-full bg-primary text-white font-semibold text-sm shadow-sm"
        >
          Explore Cakes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <span className="font-label text-xs text-primary font-bold uppercase tracking-wider">
            Patisserie Kitchen
          </span>
          <h1 className="font-headline text-3xl sm:text-4xl font-bold text-on-surface">
            My Orders & Tracking
          </h1>
        </div>
        <span className="font-body text-xs sm:text-sm font-semibold text-secondary">
          {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Total
        </span>
      </div>

      <div className="flex flex-col gap-6">
        {orders.map((order) => {
          const isExpanded = expandedOrderId === order._id;
          return (
            <div
              key={order._id}
              className="bg-surface-container-lowest rounded-3xl p-6 sm:p-7 shadow-confectionery-1 border border-outline-variant/60 flex flex-col gap-5"
            >
              {/* Order Header Card */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-container-high pb-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-headline text-lg sm:text-xl font-bold text-on-surface">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </span>
                    <span
                      className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.orderStatus === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-secondary-container text-on-secondary-container'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                  <span className="text-xs text-secondary mt-0.5">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-headline text-xl sm:text-2xl font-bold text-primary">
                    ₹{order.totalPrice.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => setExpandedOrderId(isExpanded ? null : order._id)}
                    className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-secondary hover:text-on-surface transition-colors"
                    aria-label="Toggle Details"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {isExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Items Summary preview */}
              <div className="flex flex-wrap items-center gap-4">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 bg-surface-container-low px-3 py-1.5 rounded-2xl">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-9 h-9 rounded-lg object-cover"
                    />
                    <div className="flex flex-col text-xs">
                      <span className="font-bold text-on-surface truncate max-w-[140px]">{item.name}</span>
                      <span className="text-secondary text-[11px]">{item.weight} (Qty: {item.quantity})</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Collapsible Stepper & Details */}
              {isExpanded && (
                <div className="flex flex-col gap-6 pt-2 animate-in fade-in duration-200">
                  <OrderStatusStepper
                    currentStatus={order.orderStatus}
                    statusHistory={order.statusHistory}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-secondary bg-surface-container-low p-4 rounded-2xl">
                    <div>
                      <p><strong>Scheduled Slot:</strong> {order.deliverySlot?.date} ({order.deliverySlot?.timeSlot})</p>
                      <p><strong>Payment:</strong> {order.paymentMethod} • {order.isPaid ? 'Paid' : 'Pending'}</p>
                    </div>
                    <div>
                      <p><strong>Delivery Address:</strong> {order.shippingAddress?.street}, {order.shippingAddress?.city} - {order.shippingAddress?.pincode}</p>
                      <p><strong>Recipient:</strong> {order.shippingAddress?.name} ({order.shippingAddress?.phone})</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Link
                      to={`/order-confirmation/${order._id}`}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">receipt</span>
                      View Invoice Receipt
                    </Link>

                    {order.orderStatus === 'Placed' && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="text-xs font-semibold text-error hover:bg-error-container/20 px-3 py-1.5 rounded-full transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
