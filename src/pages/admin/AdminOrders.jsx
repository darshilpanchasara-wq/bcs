import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { showToast } = useToast();

  const fetchOrders = async () => {
    try {
      const res = await api.get(`/admin/orders?status=${filterStatus}`);
      if (res.data.success) {
        setOrders(res.data.orders || []);
      }
    } catch (err) {
      console.error('Failed to load orders:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/admin/orders/${orderId}/status`, {
        status: newStatus,
        note: `Status marked as ${newStatus} by bakery supervisor.`
      });
      if (res.data.success) {
        showToast(`Order status updated to ${newStatus}`, 'success');
        fetchOrders();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const filteredOrders = orders.filter((ord) => {
    const term = search.toLowerCase();
    const idMatch = ord._id.toLowerCase().includes(term);
    const nameMatch = ord.user?.name?.toLowerCase().includes(term) || ord.shippingAddress?.name?.toLowerCase().includes(term);
    const emailMatch = ord.user?.email?.toLowerCase().includes(term);
    return idMatch || nameMatch || emailMatch;
  });

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Title */}
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <span className="font-label text-xs text-primary font-bold uppercase tracking-wider">
            Bakery Kitchen & Dispatch
          </span>
          <h1 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
            Manage Orders ({orders.length})
          </h1>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/60 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">
            search
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, customer name, email..."
            className="w-full h-10 pl-10 pr-4 rounded-full bg-surface-container-low text-xs sm:text-sm outline-none border border-outline-variant/40"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-secondary font-semibold">Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-10 px-3.5 rounded-full bg-surface-container-low text-xs sm:text-sm font-semibold outline-none border border-outline-variant/40 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Placed">Placed</option>
            <option value="Baking">Baking</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-surface-container-low border-b border-surface-container-high text-secondary text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Delivery Slot</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Update Status</th>
                <th className="p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/60">
              {filteredOrders.map((ord) => (
                <tr key={ord._id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-on-surface">
                    #{ord._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-on-surface block">
                      {ord.shippingAddress?.name || ord.user?.name}
                    </span>
                    <span className="text-[11px] text-secondary">{ord.shippingAddress?.phone}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-semibold text-on-surface block">
                      {ord.deliverySlot?.date}
                    </span>
                    <span className="text-[11px] text-secondary">{ord.deliverySlot?.timeSlot}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-bold text-on-surface">
                      {ord.orderItems?.length} {ord.orderItems?.length === 1 ? 'item' : 'items'}
                    </span>
                  </td>
                  <td className="p-4 font-headline text-base font-bold text-primary">
                    ₹{ord.totalPrice.toLocaleString('en-IN')}
                  </td>
                  <td className="p-4">
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border outline-none cursor-pointer ${
                        ord.orderStatus === 'Delivered'
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : ord.orderStatus === 'Cancelled'
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : 'bg-secondary-container text-on-secondary-container border-primary/40'
                      }`}
                    >
                      <option value="Placed">Placed</option>
                      <option value="Baking">Baking</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-3 py-1.5 rounded-xl bg-surface-container-low text-xs font-semibold hover:bg-surface-container transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-xl w-full p-6 sm:p-8 rounded-3xl shadow-confectionery-3 border border-outline-variant max-h-[85vh] overflow-y-auto flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
              <div>
                <h3 className="font-headline text-xl font-bold text-on-surface">
                  Order #{selectedOrder._id.slice(-6).toUpperCase()}
                </h3>
                <span className="text-xs text-secondary">
                  Placed {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-secondary hover:text-on-surface">
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-low text-xs text-secondary flex flex-col gap-1.5">
              <p><strong>Customer:</strong> {selectedOrder.shippingAddress?.name} ({selectedOrder.user?.email || 'Guest'})</p>
              <p><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone}</p>
              <p><strong>Delivery Address:</strong> {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.apartment ? `${selectedOrder.shippingAddress?.apartment}, ` : ''}{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}</p>
              <p><strong>Scheduled Slot:</strong> {selectedOrder.deliverySlot?.date} ({selectedOrder.deliverySlot?.timeSlot})</p>
              <p><strong>Payment:</strong> {selectedOrder.paymentMethod} • {selectedOrder.isPaid ? 'Paid' : 'Pending'}</p>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">Ordered Cakes</span>
              {selectedOrder.orderItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-surface-container-high/60 last:border-none text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <span className="font-bold text-on-surface block">{item.name}</span>
                      <span className="text-secondary">{item.weight} {item.flavor ? `• ${item.flavor}` : ''}</span>
                      {item.messageOnCake && (
                        <span className="text-primary italic block">"{item.messageOnCake}" ({item.finishingStyle})</span>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-on-surface">
                    Qty: {item.quantity} • ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-baseline pt-3 border-t border-surface-container-high">
              <span className="font-headline text-lg font-bold">Total Charged</span>
              <span className="font-headline text-2xl font-bold text-primary">₹{selectedOrder.totalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
