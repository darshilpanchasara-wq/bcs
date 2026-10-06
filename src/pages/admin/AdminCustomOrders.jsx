import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

const AdminCustomOrders = () => {
  const [customOrders, setCustomOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [quotePrice, setQuotePrice] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [status, setStatus] = useState('Pending');
  const { showToast } = useToast();

  const fetchCustomOrders = async () => {
    try {
      const res = await api.get('/custom-orders');
      if (res.data.success) {
        setCustomOrders(res.data.customOrders || []);
      }
    } catch (err) {
      console.error('Failed to load custom requests:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomOrders();
  }, []);

  const handleOpenReview = (req) => {
    setSelectedRequest(req);
    setStatus(req.status || 'Pending');
    setQuotePrice(req.quotedPrice ? req.quotedPrice.toString() : '');
    setAdminNotes(req.adminNotes || '');
  };

  const handleSaveQuote = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/custom-orders/${selectedRequest._id}`, {
        status,
        quotedPrice: quotePrice ? Number(quotePrice) : null,
        adminNotes
      });

      if (res.data.success) {
        showToast('Custom cake commission updated!', 'success');
        setSelectedRequest(null);
        fetchCustomOrders();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-16">
      <div>
        <span className="font-label text-xs text-primary font-bold uppercase tracking-wider">
          Bespoke Commissions
        </span>
        <h1 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
          Custom Cake Requests ({customOrders.length})
        </h1>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-surface-container-low border-b border-surface-container-high text-secondary text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Occasion & Servings</th>
                <th className="p-4">Flavor</th>
                <th className="p-4">Target Date</th>
                <th className="p-4">Quoted Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/60">
              {customOrders.map((req) => (
                <tr key={req._id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-on-surface block">{req.customerName}</span>
                    <span className="text-[11px] text-secondary">{req.customerEmail}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-on-surface block">{req.occasion}</span>
                    <span className="text-[11px] text-secondary">{req.servings}</span>
                  </td>
                  <td className="p-4 text-xs text-secondary max-w-[160px] truncate">
                    {req.flavor}
                  </td>
                  <td className="p-4 font-semibold text-on-surface">
                    {req.deliveryDate}
                  </td>
                  <td className="p-4 font-headline text-base font-bold text-primary">
                    {req.quotedPrice ? `₹${req.quotedPrice.toLocaleString('en-IN')}` : <span className="text-secondary text-xs font-normal">Pending Quote</span>}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        req.status === 'Approved' || req.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : req.status === 'Quoted'
                          ? 'bg-blue-100 text-blue-800'
                          : req.status === 'Rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-secondary-container text-on-secondary-container'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleOpenReview(req)}
                      className="px-3.5 py-1.5 rounded-xl bg-surface-container-low text-xs font-bold text-primary hover:bg-surface-container transition-colors"
                    >
                      Review & Quote
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest max-w-2xl w-full p-6 sm:p-8 rounded-3xl shadow-confectionery-3 border border-outline-variant max-h-[90vh] overflow-y-auto flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
              <div>
                <h3 className="font-headline text-xl font-bold text-on-surface">
                  Review Custom Request
                </h3>
                <span className="text-xs text-secondary">
                  From {selectedRequest.customerName} ({selectedRequest.customerPhone})
                </span>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="text-secondary hover:text-on-surface">
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {/* Reference Photos if uploaded */}
            {selectedRequest.referenceImages && selectedRequest.referenceImages.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase text-secondary">Reference Photos</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {selectedRequest.referenceImages.map((img, i) => (
                    <a key={i} href={img} target="_blank" rel="noreferrer" className="rounded-xl overflow-hidden aspect-square border border-outline-variant block">
                      <img src={img} alt="Reference" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-surface-container-low text-xs text-secondary flex flex-col gap-1.5">
              <p><strong>Occasion:</strong> {selectedRequest.occasion}</p>
              <p><strong>Portion & Size:</strong> {selectedRequest.servings}</p>
              <p><strong>Flavor:</strong> {selectedRequest.flavor}</p>
              <p><strong>Target Handover Date:</strong> {selectedRequest.deliveryDate}</p>
              <p><strong>Customer Estimated Budget:</strong> {selectedRequest.budget}</p>
              {selectedRequest.specialInstructions && (
                <p className="mt-1 pt-1 border-t border-surface-container-high text-on-surface">
                  <strong>Notes:</strong> "{selectedRequest.specialInstructions}"
                </p>
              )}
            </div>

            {/* Quote Form */}
            <form onSubmit={handleSaveQuote} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-secondary">Quoted Price (₹)</label>
                  <input
                    type="number"
                    step="1"
                    value={quotePrice}
                    onChange={(e) => setQuotePrice(e.target.value)}
                    placeholder="e.g. 3500"
                    className="w-full h-11 px-3.5 mt-1 rounded-xl bg-surface-container-low text-sm font-headline font-bold text-primary border border-outline-variant outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-secondary">Commission Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full h-11 px-3.5 mt-1 rounded-xl bg-surface-container-low text-sm font-semibold border border-outline-variant outline-none"
                  >
                    <option value="Pending">Pending Review</option>
                    <option value="Reviewing">Reviewing</option>
                    <option value="Quoted">Quoted (Sent to Client)</option>
                    <option value="Approved">Approved (Ready to Bake)</option>
                    <option value="Baking">Baking in Kitchen</option>
                    <option value="Completed">Completed & Handed Over</option>
                    <option value="Rejected">Rejected / Unavailable</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase text-secondary">Kitchen / Chef Notes</label>
                  <textarea
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Internal notes regarding flower suppliers, fondant colors, or customer agreement..."
                    className="w-full p-3.5 mt-1 rounded-xl bg-surface-container-low text-xs sm:text-sm border border-outline-variant outline-none"
                  ></textarea>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container-high">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-secondary hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-primary text-white text-xs font-bold shadow-md hover:bg-primary-container"
                >
                  Save Quote & Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomOrders;
