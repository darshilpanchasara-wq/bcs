import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCat, setNewCat] = useState({ name: '', slug: '', description: '', icon: 'cake' });
  const [isAdding, setIsAdding] = useState(false);
  const { showToast } = useToast();

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.categories || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/categories', newCat);
      if (res.data.success) {
        showToast('Category created successfully!', 'success');
        setNewCat({ name: '', slug: '', description: '', icon: 'cake' });
        setIsAdding(false);
        fetchCategories();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? Cakes in this category may be affected.')) return;
    try {
      const res = await api.delete(`/categories/${id}`);
      if (res.data.success) {
        showToast('Category removed.', 'info');
        fetchCategories();
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
            Bakery Taxonomy
          </span>
          <h1 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
            Categories & Collections ({categories.length})
          </h1>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Category
        </button>
      </div>

      {isAdding && (
        <form
          onSubmit={handleCreateCategory}
          className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/60 flex flex-col gap-4 animate-in fade-in duration-200"
        >
          <h3 className="font-headline text-lg font-bold text-on-surface">Create New Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-secondary">Name *</label>
              <input
                type="text"
                required
                value={newCat.name}
                onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                placeholder="e.g. French Macarons"
                className="w-full h-10 px-3 mt-1 rounded-xl bg-surface-container-lowest text-sm border border-outline-variant outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-secondary">Slug (Optional)</label>
              <input
                type="text"
                value={newCat.slug}
                onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })}
                placeholder="e.g. macarons"
                className="w-full h-10 px-3 mt-1 rounded-xl bg-surface-container-lowest text-sm border border-outline-variant outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-secondary">Icon Symbol</label>
              <input
                type="text"
                value={newCat.icon}
                onChange={(e) => setNewCat({ ...newCat, icon: e.target.value })}
                placeholder="cake, diamond, favorite, eco"
                className="w-full h-10 px-3 mt-1 rounded-xl bg-surface-container-lowest text-sm border border-outline-variant outline-none"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="text-xs font-bold uppercase text-secondary">Description</label>
              <input
                type="text"
                value={newCat.description}
                onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                placeholder="Short editorial description for category cards..."
                className="w-full h-10 px-3 mt-1 rounded-xl bg-surface-container-lowest text-sm border border-outline-variant outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-full text-xs font-bold text-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-primary text-white text-xs font-bold shadow-sm"
            >
              Save Category
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col justify-between gap-3"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-base text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[20px]">{cat.icon || 'cake'}</span>
                  {cat.name}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
                  {cat.cakeCount || 0} cakes
                </span>
              </div>
              <p className="text-xs text-secondary leading-relaxed mt-1">
                {cat.description || 'Artisanal collection curated by head pâtissiers.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-surface-container-high text-xs text-secondary">
              <span className="font-mono">slug: /{cat.slug}</span>
              <button
                onClick={() => handleDelete(cat._id)}
                className="text-error font-semibold hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
