import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import RatingStars from '../../components/common/RatingStars';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews');
      if (res.data.success) {
        setReviews(res.data.reviews || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer review? The cake average rating will be recalculated.')) return;
    try {
      const res = await api.delete(`/reviews/${id}`);
      if (res.data.success) {
        showToast('Review deleted.', 'info');
        fetchReviews();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-16">
      <div>
        <span className="font-label text-xs text-primary font-bold uppercase tracking-wider">
          Patron Sentiment
        </span>
        <h1 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
          Customer Reviews & Ratings ({reviews.length})
        </h1>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-surface-container-low border-b border-surface-container-high text-secondary text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="p-4">Cake</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Comment</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/60">
              {reviews.map((r) => (
                <tr key={r._id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-on-surface block max-w-[140px] truncate">
                      {r.cake?.name || 'Cake'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-on-surface block">{r.userName}</span>
                    <span className="text-[11px] text-secondary">{r.user?.email}</span>
                  </td>
                  <td className="p-4">
                    <RatingStars rating={r.rating} size="14px" showNum={false} />
                  </td>
                  <td className="p-4 text-xs text-secondary max-w-xs">
                    <p className="line-clamp-2">"{r.comment}"</p>
                  </td>
                  <td className="p-4 text-xs text-secondary">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(r._id)}
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
    </div>
  );
};

export default AdminReviews;
