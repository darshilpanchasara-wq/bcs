import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountPercentage: 15,
    minOrderAmount: 30,
    maxDiscountAmount: 30,
    description: '',
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true
  });
  const { showToast } = useToast();

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/coupons');
      if (res.data.success) {
        setCoupons(res.data.coupons || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/coupons', {
        ...newCoupon,
        code: newCoupon.code.toUpperCase().trim(),
        discountPercentage: Number(newCoupon.discountPercentage),
        minOrderAmount: Number(newCoupon.minOrderAmount),
        maxDiscountAmount: newCoupon.maxDiscountAmount ? Number(newCoupon.maxDiscountAmount) : null
      });

      if (res.data.success) {
        showToast('Promo coupon created!', 'success');
        setIsModalOpen(false);
        fetchCoupons();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const res = await api.delete(`/coupons/${id}`);
      if (res.data.success) {
        showToast('Coupon removed.', 'info');
        fetchCoupons();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-label text-xs text-primary font-bold uppercase tracking-wider">
            Promotional Engine
          </span>
          <h1 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
            Coupons & Vouchers ({coupons.length})
          </h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Create Promo Code
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-surface-container-low border-b border-surface-container-high text-secondary text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="p-4">Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Min Order</th>
                <th className="p-4">Max Cap</th>
                <th className="p-4">Redemptions</th>
                <th className="p-4">Expires</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/60">
              {coupons.map((c) => (
                <tr key={c._id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-primary text-sm">
                    {c.code}
                  </td>
                  <td className="p-4 font-bold text-on-surface">
                    {c.discountPercentage}% OFF
                  </td>
                  <td className="p-4 text-secondary">
                    ₹{c.minOrderAmount || 0}
                  </td>
                  <td className="p-4 text-secondary">
                    {c.maxDiscountAmount ? `₹${c.maxDiscountAmount}` : 'No limit'}
                  </td>
                  <td className="p-4 font-semibold text-on-surface">
                    {c.usageCount || 0} times
                  </td>
                  <td className="p-4 text-secondary">
                    {new Date(c.expiresAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.isActive ? 'bg-green-100 text-green-800' : 'bg-surface-container text-secondary'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-md w-full p-6 sm:p-8 rounded-3xl shadow-confectionery-3 border border-outline-variant flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
              <h3 className="font-headline text-xl font-bold text-on-surface">New Coupon Code</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold uppercase text-secondary">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SUMMER25"
                  className="w-full h-10 px-3 mt-1 rounded-xl bg-surface-container-low font-mono font-bold uppercase text-sm border border-outline-variant outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase text-secondary">Discount (%) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={newCoupon.discountPercentage}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountPercentage: e.target.value })}
                    className="w-full h-10 px-3 mt-1 rounded-xl bg-surface-container-low text-sm border border-outline-variant outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-secondary">Min Order (₹)</label>
                  <input
                    type="number"
                    value={newCoupon.minOrderAmount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minOrderAmount: e.target.value })}
                    className="w-full h-10 px-3 mt-1 rounded-xl bg-surface-container-low text-sm border border-outline-variant outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-secondary">Max Discount Cap (₹)</label>
                <input
                  type="number"
                  value={newCoupon.maxDiscountAmount}
                  onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscountAmount: e.target.value })}
                  placeholder="e.g. 500 (optional)"
                  className="w-full h-10 px-3 mt-1 rounded-xl bg-surface-container-low text-sm border border-outline-variant outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-secondary">Expiry Date *</label>
                <input
                  type="date"
                  required
                  value={newCoupon.expiresAt}
                  onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}
                  className="w-full h-10 px-3 mt-1 rounded-xl bg-surface-container-low text-sm border border-outline-variant outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-surface-container-high">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-primary text-white text-xs font-bold shadow-sm"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
