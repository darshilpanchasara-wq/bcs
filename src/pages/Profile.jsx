import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import CakeCard from '../components/cake/CakeCard';

const Profile = () => {
  const { user, updateProfile, toggleWishlist } = useAuth();
  const { showToast } = useToast();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState('addresses'); // 'addresses' | 'wishlist' | 'settings'

  // Edit Profile state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // Address Modal / Form state
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    name: user?.name || '',
    phone: user?.phone || '',
    street: '',
    apartment: '',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '',
    isDefault: false
  });

  // Wishlist items populated
  const [wishlistCakes, setWishlistCakes] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || '');
      setAvatar(user.avatar || '');
      setAddresses(user.addresses || []);
    }
  }, [user]);

  // Fetch populated wishlist cakes when wishlist tab is clicked
  useEffect(() => {
    if (activeTab === 'wishlist' && user?.wishlist?.length > 0) {
      const fetchWishlist = async () => {
        setLoadingWishlist(true);
        try {
          const res = await api.get('/auth/me');
          if (res.data.success && res.data.user.wishlist) {
            setWishlistCakes(res.data.user.wishlist);
          }
        } catch (err) {
          console.error('Failed to load wishlist:', err.message);
        } finally {
          setLoadingWishlist(false);
        }
      };
      fetchWishlist();
    }
  }, [activeTab, user?.wishlist]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    await updateProfile({ name, phone, avatar });
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city || !newAddress.pincode) {
      showToast('Please fill out required address details.', 'error');
      return;
    }

    const updated = [...addresses];
    if (newAddress.isDefault) {
      updated.forEach((a) => (a.isDefault = false));
    }
    updated.push(newAddress);

    const result = await updateProfile({ addresses: updated });
    if (result?.success) {
      setAddresses(updated);
      setIsAddingAddress(false);
      setNewAddress({
        label: 'Home',
        name: user?.name || '',
        phone: user?.phone || '',
        street: '',
        apartment: '',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '',
        isDefault: false
      });
    }
  };

  const handleDeleteAddress = async (index) => {
    const updated = addresses.filter((_, i) => i !== index);
    const result = await updateProfile({ addresses: updated });
    if (result?.success) {
      setAddresses(updated);
    }
  };

  const handleSetDefaultAddress = async (index) => {
    const updated = addresses.map((a, i) => ({
      ...a,
      isDefault: i === index
    }));
    const result = await updateProfile({ addresses: updated });
    if (result?.success) {
      setAddresses(updated);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Profile Header Card */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-confectionery-1 border border-outline-variant/60 flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-5">
          <img
            src={user?.avatar || '/assets/customer-portrait.png'}
            alt={user?.name}
            className="w-20 h-20 rounded-full object-cover shadow-md border-2 border-primary/20"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
            }}
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline text-2xl font-bold text-on-surface">{user?.name}</h1>
              {user?.role === 'admin' && (
                <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary-container text-[10px] font-bold uppercase tracking-wider">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-secondary mt-0.5">{user?.email}</p>
            {user?.phone && <p className="text-xs text-secondary">{user.phone}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/orders"
            className="px-5 py-2.5 rounded-full bg-surface-container text-on-surface font-semibold text-xs sm:text-sm hover:bg-secondary-container transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            My Orders
          </Link>
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-bold text-xs sm:text-sm shadow-md hover:bg-primary-container transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              Admin Panel
            </Link>
          )}
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-surface-container-high mb-8 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('addresses')}
          className={`py-3 px-5 font-body text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'addresses'
              ? 'border-primary text-primary'
              : 'border-transparent text-secondary hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">pin_drop</span>
          Saved Addresses ({addresses.length})
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`py-3 px-5 font-body text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'wishlist'
              ? 'border-primary text-primary'
              : 'border-transparent text-secondary hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">favorite</span>
          Wishlist ({user?.wishlist?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`py-3 px-5 font-body text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'border-primary text-primary'
              : 'border-transparent text-secondary hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
          Profile Details
        </button>
      </div>

      {/* Tab 1: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-xl font-bold text-on-surface">Delivery Locations</h3>
            <button
              onClick={() => setIsAddingAddress(!isAddingAddress)}
              className="px-4 py-2 rounded-full bg-primary text-on-primary font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Add New Address
            </button>
          </div>

          {/* Add Address Form Modal / Inline */}
          {isAddingAddress && (
            <form
              onSubmit={handleSaveAddress}
              className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/60 flex flex-col gap-4 animate-in fade-in duration-200"
            >
              <h4 className="font-headline text-lg font-bold text-on-surface">New Address</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-secondary">Label (e.g. Home, Office)</label>
                  <input
                    type="text"
                    required
                    value={newAddress.label}
                    onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                    className="w-full h-10 px-3 mt-1 rounded-xl bg-surface-container-lowest text-sm border border-outline-variant/60 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-secondary">Contact Name</label>
                  <input
                    type="text"
                    required
                    value={newAddress.name}
                    onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                    className="w-full h-10 px-3 mt-1 rounded-xl bg-surface-container-lowest text-sm border border-outline-variant/60 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-secondary">Phone</label>
                  <input
                    type="tel"
                    required
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    className="w-full h-10 px-3 mt-1 rounded-xl bg-surface-container-lowest text-sm border border-outline-variant/60 outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase text-secondary">Street</label>
                  <input
                    type="text"
                    required
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    className="w-full h-10 px-3 mt-1 rounded-xl bg-surface-container-lowest text-sm border border-outline-variant/60 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-secondary">Apt / Suite</label>
                  <input
                    type="text"
                    value={newAddress.apartment}
                    onChange={(e) => setNewAddress({ ...newAddress, apartment: e.target.value })}
                    className="w-full h-10 px-3 mt-1 rounded-xl bg-surface-container-lowest text-sm border border-outline-variant/60 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-secondary">City</label>
                  <input
                    type="text"
                    required
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full h-10 px-3 mt-1 rounded-xl bg-surface-container-lowest text-sm border border-outline-variant/60 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-secondary">State</label>
                  <input
                    type="text"
                    required
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="w-full h-10 px-3 mt-1 rounded-xl bg-surface-container-lowest text-sm border border-outline-variant/60 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-secondary">Pincode</label>
                  <input
                    type="text"
                    required
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                    className="w-full h-10 px-3 mt-1 rounded-xl bg-surface-container-lowest text-sm border border-outline-variant/60 outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-on-surface">
                  <input
                    type="checkbox"
                    checked={newAddress.isDefault}
                    onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                    className="w-4 h-4 rounded text-primary accent-primary"
                  />
                  Set as primary default delivery address
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="px-4 py-2 rounded-full text-xs font-bold text-secondary hover:bg-surface-container transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-primary text-white text-xs font-bold shadow-sm"
                  >
                    Save Address
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Addresses Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {addresses.map((addr, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col justify-between gap-3 relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-on-surface">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface font-semibold">{addr.name} ({addr.phone})</p>
                  <p className="text-xs text-secondary mt-1 leading-relaxed">
                    {addr.street}, {addr.apartment ? `${addr.apartment}, ` : ''}{addr.city}, {addr.state} - {addr.pincode}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-surface-container-high text-xs">
                  {!addr.isDefault ? (
                    <button
                      onClick={() => handleSetDefaultAddress(idx)}
                      className="text-primary font-semibold hover:underline"
                    >
                      Make Default
                    </button>
                  ) : (
                    <span className="text-secondary text-[11px]">Primary</span>
                  )}
                  <button
                    onClick={() => handleDeleteAddress(idx)}
                    className="text-error font-semibold hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Wishlist */}
      {activeTab === 'wishlist' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-xl font-bold text-on-surface">Saved Delights</h3>
            <span className="text-xs text-secondary">
              {wishlistCakes.length} {wishlistCakes.length === 1 ? 'Cake' : 'Cakes'} saved
            </span>
          </div>

          {loadingWishlist ? (
            <div className="p-12 text-center text-sm text-secondary">Loading wishlist cakes...</div>
          ) : wishlistCakes.length === 0 ? (
            <div className="p-12 text-center bg-surface-container-low rounded-3xl border border-outline-variant/60">
              <span className="material-symbols-outlined text-[40px] text-secondary mb-2">favorite_border</span>
              <p className="font-headline text-lg font-bold text-on-surface">Your Wishlist is Empty</p>
              <p className="text-xs text-secondary mt-1">Tap the heart on any celebration cake to save it here.</p>
              <Link to="/shop" className="inline-block mt-4 px-6 py-2 rounded-full bg-primary text-white text-xs font-bold">
                Browse Cakes
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {wishlistCakes.map((cake) => (
                <CakeCard key={cake._id} cake={cake} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Profile Settings */}
      {activeTab === 'settings' && (
        <form
          onSubmit={handleUpdateProfile}
          className="max-w-xl bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant/60 shadow-sm flex flex-col gap-4"
        >
          <h3 className="font-headline text-xl font-bold text-on-surface border-b border-surface-container-high pb-3 mb-2">
            Personal Information
          </h3>

          <div>
            <label className="text-xs font-bold uppercase text-secondary">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-3.5 mt-1 rounded-xl bg-surface-container-low text-sm border border-outline-variant/60 outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-secondary">Email Address (Read-only)</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full h-11 px-3.5 mt-1 rounded-xl bg-surface-container-highest text-secondary text-sm border border-outline-variant/40 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-secondary">Contact Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full h-11 px-3.5 mt-1 rounded-xl bg-surface-container-low text-sm border border-outline-variant/60 outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-secondary">Avatar Image URL</label>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
              className="w-full h-11 px-3.5 mt-1 rounded-xl bg-surface-container-low text-sm border border-outline-variant/60 outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full h-12 rounded-full bg-primary hover:bg-primary-container text-on-primary font-bold text-sm shadow-md active:scale-95 transition-all"
          >
            Save Profile Changes
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;
