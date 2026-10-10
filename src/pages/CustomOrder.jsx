import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const CustomOrder = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
    occasion: 'Birthday',
    servings: '15-20 guests (2.0 kg)',
    flavor: 'Madagascan Vanilla Sponge + Fresh Strawberry Compote',
    dietary: [],
    budget: '₹3,000 – ₹6,000',
    deliveryDate: '',
    specialInstructions: ''
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);

  const handleDietaryToggle = (item) => {
    setFormData((prev) => ({
      ...prev,
      dietary: prev.dietary.includes(item)
        ? prev.dietary.filter((d) => d !== item)
        : [...prev.dietary, item]
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 4) {
      showToast('Maximum 4 reference images allowed.', 'error');
      return;
    }

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setFilePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone || !formData.deliveryDate) {
      showToast('Please fill out all required contact and event date fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'dietary') {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      });

      selectedFiles.forEach((file) => {
        data.append('referenceImages', file);
      });

      const res = await api.post('/custom-orders', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        showToast('Custom cake request submitted successfully! 🎨', 'success');
        setSubmittedRequest(res.data.customOrder);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedRequest) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white shadow-confectionery-2">
          <span className="material-symbols-outlined text-[32px]">palette</span>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Atelier Request Received
        </span>
        <h2 className="font-headline text-3xl font-bold text-on-surface">
          Your Custom Cake Commission is in Review!
        </h2>
        <p className="font-body text-sm text-secondary max-w-md">
          Master Confectioner Darshil Panchasara will review your design sketches, flavor choices, and guest size. We will contact you at <strong>{submittedRequest.customerEmail}</strong> within 12 hours with a bespoke quote and baking schedule.
        </p>
        <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 w-full text-left text-xs text-secondary mt-2">
          <p><strong>Occasion:</strong> {submittedRequest.occasion}</p>
          <p><strong>Portion:</strong> {submittedRequest.servings}</p>
          <p><strong>Flavor:</strong> {submittedRequest.flavor}</p>
          <p><strong>Target Handover:</strong> {submittedRequest.deliveryDate}</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-8 py-3 rounded-full bg-primary text-white text-sm font-semibold shadow-md active:scale-95 transition-transform"
        >
          Return to Bhuvneshwari Cakes
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Title & Atelier Introduction */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="font-label text-xs text-primary font-bold uppercase tracking-wider">
          BHUVNESHWARI CAKES • Royal Custom Atelier
        </span>
        <h1 className="font-headline text-3xl sm:text-4xl font-bold text-on-surface mt-1">
          Custom Celebration Cake Form
        </h1>
        <p className="font-body text-xs sm:text-sm text-secondary mt-2 leading-relaxed">
          From multi-tiered wedding centerpieces to hand-painted Lambeth piping and custom figurines. Share your dream vision, and our master chefs will bring it to life.
        </p>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-surface-container-lowest p-6 sm:p-10 rounded-3xl shadow-confectionery-1 border border-outline-variant/60 flex flex-col gap-8"
      >
        {/* Section 1: Occasion & Event Details */}
        <div className="flex flex-col gap-4">
          <h3 className="font-headline text-lg sm:text-xl font-bold text-on-surface border-b border-surface-container-high pb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">cake</span>
            1. Occasion & Servings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">
                Occasion *
              </label>
              <select
                value={formData.occasion}
                onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                className="w-full h-11 px-3.5 mt-1 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/60 outline-none focus:border-primary"
              >
                <option>Birthday Milestone</option>
                <option>Wedding Grand</option>
                <option>Anniversary Romance</option>
                <option>Baby Shower / Gender Reveal</option>
                <option>Corporate Gala / Launch</option>
                <option>Bachelorette Party</option>
                <option>Other Special Gathering</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">
                Expected Guests & Servings *
              </label>
              <select
                value={formData.servings}
                onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
                className="w-full h-11 px-3.5 mt-1 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/60 outline-none focus:border-primary"
              >
                <option>8-12 guests (1.0 kg Single Tier)</option>
                <option>15-20 guests (2.0 kg Single or Mini Two-Tier)</option>
                <option>25-35 guests (3.0 kg Two-Tier)</option>
                <option>40-60 guests (5.0 kg Three-Tier)</option>
                <option>70+ guests (Grand Multi-Tier Commission)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Flavors & Dietary Customization */}
        <div className="flex flex-col gap-4">
          <h3 className="font-headline text-lg sm:text-xl font-bold text-on-surface border-b border-surface-container-high pb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">restaurant</span>
            2. Flavor Profile & Dietary Needs
          </h3>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-secondary">
              Sponge & Filling Pairing *
            </label>
            <select
              value={formData.flavor}
              onChange={(e) => setFormData({ ...formData, flavor: e.target.value })}
              className="w-full h-11 px-3.5 mt-1 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/60 outline-none focus:border-primary"
            >
              <option>Madagascan Vanilla Sponge + Fresh Strawberry Compote</option>
              <option>70% Belgian Dark Chocolate Ganache + Hazelnut Praline Crunch</option>
              <option>Red Velvet Silk + Philadelphia Vanilla Cream Cheese</option>
              <option>Salted Caramel Feuilletine + Espresso Truffle</option>
              <option>Sicilian Pistachio + White Vineyard Peach Mousse</option>
              <option>French Brut Champagne + Raspberry Lychee Curd</option>
              <option>Kyoto Uji Matcha + Ivoire White Chocolate Mousse</option>
              <option>Custom Flavor Creation (Explain in notes below)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-secondary">
              Dietary Requirements (Select any that apply)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1.5">
              {['100% Eggless', 'Gluten-Free', 'Dairy-Free / Vegan', 'Refined Sugar-Free'].map((diet) => (
                <button
                  key={diet}
                  type="button"
                  onClick={() => handleDietaryToggle(diet)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold text-center border transition-all ${
                    formData.dietary.includes(diet)
                      ? 'bg-secondary-container text-on-secondary-container border-primary font-bold'
                      : 'bg-surface-container-low text-secondary border-outline-variant/60 hover:text-on-surface'
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Design Reference Image Upload */}
        <div className="flex flex-col gap-4">
          <h3 className="font-headline text-lg sm:text-xl font-bold text-on-surface border-b border-surface-container-high pb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">add_photo_alternate</span>
            3. Design Reference Photos (Up to 4)
          </h3>

          <div className="border-2 border-dashed border-outline-variant/80 rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-2 bg-surface-container-low/50 hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-[36px] text-primary">cloud_upload</span>
            <span className="font-body text-sm font-bold text-on-surface">
              Upload cake inspiration photos, sketches, or color palettes
            </span>
            <span className="text-xs text-secondary">PNG, JPG, WEBP up to 10MB each</span>

            <input
              type="file"
              multiple
              accept="image/*"
              id="custom-cake-images"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="custom-cake-images"
              className="mt-2 px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold cursor-pointer shadow-sm active:scale-95 transition-transform"
            >
              Browse Files
            </label>
          </div>

          {/* Image Previews */}
          {filePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {filePreviews.map((preview, index) => (
                <div key={index} className="relative rounded-xl overflow-hidden aspect-square border border-outline-variant group">
                  <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 4: Budget, Date & Special Notes */}
        <div className="flex flex-col gap-4">
          <h3 className="font-headline text-lg sm:text-xl font-bold text-on-surface border-b border-surface-container-high pb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">calendar_month</span>
            4. Timeline, Budget & Thematic Notes
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">
                Delivery / Event Date *
              </label>
              <input
                type="date"
                required
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                className="w-full h-11 px-3.5 mt-1 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/60 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">
                Estimated Budget Range
              </label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full h-11 px-3.5 mt-1 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/60 outline-none focus:border-primary"
              >
                <option>₹1,500 – ₹3,000</option>
                <option>₹3,000 – ₹6,000</option>
                <option>₹6,000 – ₹12,000</option>
                <option>₹12,000+ (High Couture Royal Tiered)</option>
                <option>Flexible / Open to Quote</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">
                Special Instructions, Inscription Text & Theme Vision
              </label>
              <textarea
                rows={4}
                value={formData.specialInstructions}
                onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                placeholder="Mention any specific color palette (e.g. blush pink & gold), exact plaque lettering, floral toppers, or delivery instructions..."
                className="w-full p-3.5 mt-1 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm border border-outline-variant/60 outline-none focus:border-primary"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Section 5: Contact Details */}
        <div className="flex flex-col gap-4">
          <h3 className="font-headline text-lg sm:text-xl font-bold text-on-surface border-b border-surface-container-high pb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">person</span>
            5. Your Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="e.g. Pooja Patel"
                className="w-full h-11 px-3.5 mt-1 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/60 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                placeholder="e.g. pooja@example.com"
                className="w-full h-11 px-3.5 mt-1 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/60 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full h-11 px-3.5 mt-1 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/60 outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full h-14 rounded-full bg-primary hover:bg-primary-container text-on-primary font-body text-base font-bold shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
              <span>Submitting Design Commission...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">send</span>
              <span>Submit Custom Cake Order Request</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CustomOrder;
