import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

const AdminCakes = () => {
  const [cakes, setCakes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const { showToast } = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCakeId, setEditingCakeId] = useState(null);

  // Form State
  const initialForm = {
    name: '',
    shortDescription: '',
    description: '',
    category: '',
    basePrice: 45,
    isEggless: false,
    isGlutenFree: false,
    isBestseller: false,
    isFeatured: true,
    stock: 20,
    preparationTime: '4 - 6 hours',
    flavors: 'Madagascan Vanilla, Belgian Dark Chocolate',
    ingredients: 'Flour, Pure Butter, Sugar, Vanilla',
    images: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
    weightOptions: [
      { weight: '0.5 kg', servings: '4-6 Slices', price: 35, isDefault: false },
      { weight: '1.0 kg', servings: '8-10 Slices', price: 48, isDefault: true },
      { weight: '1.5 kg', servings: '12-16 Slices', price: 68, isDefault: false }
    ]
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchCakes = async () => {
    try {
      const [cakesRes, catRes] = await Promise.all([
        api.get('/cakes?limit=100'),
        api.get('/categories')
      ]);
      if (cakesRes.data.success) {
        setCakes(cakesRes.data.cakes || []);
      }
      if (catRes.data.success) {
        setCategories(catRes.data.categories || []);
        if (catRes.data.categories?.length > 0 && !formData.category) {
          setFormData((prev) => ({ ...prev, category: catRes.data.categories[0]._id }));
        }
      }
    } catch (err) {
      console.error('Failed to load cakes:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCakes();
  }, []);

  const handleOpenAdd = () => {
    setEditingCakeId(null);
    setFormData({
      ...initialForm,
      category: categories[0]?._id || ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cake) => {
    setEditingCakeId(cake._id);
    setFormData({
      name: cake.name,
      shortDescription: cake.shortDescription,
      description: cake.description,
      category: cake.category?._id || cake.category,
      basePrice: cake.basePrice,
      isEggless: cake.isEggless,
      isGlutenFree: cake.isGlutenFree,
      isBestseller: cake.isBestseller,
      isFeatured: cake.isFeatured,
      stock: cake.stock || 20,
      preparationTime: cake.preparationTime || '4 - 6 hours',
      flavors: Array.isArray(cake.flavors) ? cake.flavors.join(', ') : (cake.flavors || ''),
      ingredients: Array.isArray(cake.ingredients) ? cake.ingredients.join(', ') : (cake.ingredients || ''),
      images: Array.isArray(cake.images) ? cake.images.join(', ') : (cake.images || ''),
      weightOptions: cake.weightOptions || initialForm.weightOptions
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (cakeId) => {
    if (!window.confirm('Are you sure you want to delete this cake?')) return;

    try {
      const res = await api.delete(`/cakes/${cakeId}`);
      if (res.data.success) {
        showToast('Cake deleted successfully', 'info');
        fetchCakes();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        basePrice: Number(formData.basePrice),
        stock: Number(formData.stock),
        flavors: formData.flavors.split(',').map((s) => s.trim()).filter(Boolean),
        ingredients: formData.ingredients.split(',').map((s) => s.trim()).filter(Boolean),
        images: formData.images.split(',').map((s) => s.trim()).filter(Boolean),
        weightOptions: formData.weightOptions
      };

      if (editingCakeId) {
        const res = await api.put(`/cakes/${editingCakeId}`, payload);
        if (res.data.success) {
          showToast('Cake updated successfully!', 'success');
          setIsModalOpen(false);
          fetchCakes();
        }
      } else {
        const res = await api.post('/cakes', payload);
        if (res.data.success) {
          showToast('New cake added to bakery menu!', 'success');
          setIsModalOpen(false);
          fetchCakes();
        }
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const filteredCakes = cakes.filter((c) => {
    const matchesCat = filterCat === 'all' || c.categorySlug === filterCat;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="font-label text-xs text-primary font-bold uppercase tracking-wider">
            Confectionery Inventory
          </span>
          <h1 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
            Manage Cakes ({cakes.length})
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add New Cake
        </button>
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
            placeholder="Search by cake name..."
            className="w-full h-10 pl-10 pr-4 rounded-full bg-surface-container-low text-xs sm:text-sm outline-none border border-outline-variant/40"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-secondary font-semibold">Category:</label>
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="h-10 px-3.5 rounded-full bg-surface-container-low text-xs sm:text-sm font-semibold outline-none border border-outline-variant/40 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cakes Table */}
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-surface-container-low border-b border-surface-container-high text-secondary text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="p-4">Cake</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Attributes</th>
                <th className="p-4">Rating</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/60">
              {filteredCakes.map((cake) => (
                <tr key={cake._id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={cake.images?.[0] || '/assets/strawberry-cake.png'}
                        alt={cake.name}
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-on-surface block truncate max-w-[180px]">
                          {cake.name}
                        </span>
                        <span className="text-[11px] text-secondary truncate block max-w-[180px]">
                          {cake.shortDescription}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-xs font-semibold text-secondary">
                    {cake.category?.name || cake.categorySlug}
                  </td>
                  <td className="p-4 font-headline text-base font-bold text-primary">
                    ₹{cake.basePrice?.toLocaleString('en-IN')}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full bg-surface-container text-xs font-bold">
                      {cake.stock} left
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 flex-wrap">
                      {cake.isEggless && (
                        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-[10px] font-bold">
                          Eggless
                        </span>
                      )}
                      {cake.isBestseller && (
                        <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                          Bestseller
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-tertiary">
                    ⭐ {cake.rating} ({cake.numReviews})
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(cake)}
                        className="p-1.5 rounded-lg bg-surface-container-low text-secondary hover:text-primary transition-colors"
                        title="Edit Cake"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(cake._id)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                        title="Delete Cake"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Cake Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest max-w-2xl w-full p-6 sm:p-8 rounded-3xl shadow-confectionery-3 border border-outline-variant my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3 mb-4">
              <h3 className="font-headline text-xl font-bold text-on-surface">
                {editingCakeId ? 'Edit Celebration Cake' : 'Add New Cake'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-secondary hover:text-on-surface">
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase text-secondary">Cake Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-10 px-3 mt-1 rounded-xl bg-surface-container-low text-sm border border-outline-variant/60 outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-secondary">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-10 px-3 mt-1 rounded-xl bg-surface-container-low text-sm border border-outline-variant/60 outline-none focus:border-primary"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-secondary">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    className="w-full h-10 px-3 mt-1 rounded-xl bg-surface-container-low text-sm border border-outline-variant/60 outline-none focus:border-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase text-secondary">Short Description *</label>
                  <input
                    type="text"
                    required
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full h-10 px-3 mt-1 rounded-xl bg-surface-container-low text-sm border border-outline-variant/60 outline-none focus:border-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase text-secondary">Full Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 mt-1 rounded-xl bg-surface-container-low text-sm border border-outline-variant/60 outline-none focus:border-primary"
                  ></textarea>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase text-secondary">
                    Image URLs (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    placeholder="https://images.unsplash.com/..., https://..."
                    className="w-full h-10 px-3 mt-1 rounded-xl bg-surface-container-low text-sm border border-outline-variant/60 outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-secondary">Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full h-10 px-3 mt-1 rounded-xl bg-surface-container-low text-sm border border-outline-variant/60 outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-secondary">Prep Time</label>
                  <input
                    type="text"
                    value={formData.preparationTime}
                    onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                    className="w-full h-10 px-3 mt-1 rounded-xl bg-surface-container-low text-sm border border-outline-variant/60 outline-none focus:border-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase text-secondary">Flavors (Comma-separated)</label>
                  <input
                    type="text"
                    value={formData.flavors}
                    onChange={(e) => setFormData({ ...formData, flavors: e.target.value })}
                    className="w-full h-10 px-3 mt-1 rounded-xl bg-surface-container-low text-sm border border-outline-variant/60 outline-none focus:border-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase text-secondary">Key Ingredients</label>
                  <input
                    type="text"
                    value={formData.ingredients}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                    className="w-full h-10 px-3 mt-1 rounded-xl bg-surface-container-low text-sm border border-outline-variant/60 outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-surface-container-high">
                <label className="flex items-center gap-2 text-xs font-bold text-on-surface cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isEggless}
                    onChange={(e) => setFormData({ ...formData, isEggless: e.target.checked })}
                    className="accent-primary w-4 h-4"
                  />
                  100% Eggless
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-on-surface cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isGlutenFree}
                    onChange={(e) => setFormData({ ...formData, isGlutenFree: e.target.checked })}
                    className="accent-primary w-4 h-4"
                  />
                  Gluten-Free
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-on-surface cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                    className="accent-primary w-4 h-4"
                  />
                  Bestseller
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-on-surface cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="accent-primary w-4 h-4"
                  />
                  Featured Home
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-container-high">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-secondary hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-primary text-white text-xs font-bold shadow-md hover:bg-primary-container"
                >
                  {editingCakeId ? 'Save Changes' : 'Create Cake'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCakes;
