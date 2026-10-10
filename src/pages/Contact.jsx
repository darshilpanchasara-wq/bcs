import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

const Contact = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Order Support',
    message: ''
  });
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast('Dhanyawad! Your message has been sent to Darshil Panchasara and the Bhuvneshwari Cakes team.', 'success');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'Order Support',
      message: ''
    });
  };

  const faqs = [
    {
      q: 'How far in advance should I order custom celebration cakes?',
      a: 'For signature catalog cakes, orders can be placed same-day or 24 hours in advance. For grand multi-tier designer celebration cakes, we recommend booking 2 to 3 days in advance so Chef Darshil Panchasara can customize each tier to perfection.'
    },
    {
      q: 'Are all your cakes and snacks 100% Pure Vegetarian (Eggless)?',
      a: 'Yes, 100%! SHREE BHUVNESHWARI CAKE & SNACKS operates a strictly pure vegetarian, eggless bakery kitchen. We use fresh Amul butter, pure milk cream, real saffron, and certified pure ingredients compliant with all religious and dietary standards.'
    },
    {
      q: 'Do you supply hot bakery snacks for party catering & gatherings?',
      a: 'Yes! Our savory counter prepares warm butter veg puffs, paneer rolls, khari, samosas, and fresh desi ghee nankhatai. We cater for birthdays, ring ceremonies, housewarming events, and corporate gatherings.'
    },
    {
      q: 'Do you offer chilled delivery across Dhrol, Jamnagar & Rajkot?',
      a: 'Yes. All designer and tiered cakes are transported in our temperature-controlled chilled vehicles to ensure decorations, delicate sugar roses, and fondants remain in immaculate condition across Dhrol, Jamnagar, and Rajkot.'
    },
    {
      q: 'Can I request a custom message or photograph on the cake?',
      a: 'Absolutely! Enter your greeting message directly during checkout or on the cake page. For photo prints or themed toppers, you can upload reference images or contact Darshil Panchasara directly on WhatsApp.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
          <img src="/assets/bcs-logo.png" alt="BCS" className="w-5 h-5 rounded-full object-cover" />
          <span className="font-label text-xs font-bold text-primary uppercase tracking-wider">
            SHREE BHUVNESHWARI CAKE & SNACKS
          </span>
        </div>
        <h1 className="font-headline text-3xl sm:text-5xl font-black text-on-surface mt-1">
          Connect With Bhuvneshwari Cakes
        </h1>
        <p className="font-body text-sm sm:text-base text-secondary mt-2">
          Have an upcoming celebration, birthday party, wedding, or bulk snack order? Reach out to owner <strong className="text-on-surface">Darshil Panchasara</strong> and our team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-confectionery-1 border border-outline-variant/60">
          <div className="flex items-center justify-between border-b border-surface-container-high pb-3 mb-5">
            <div>
              <h3 className="font-headline text-xl font-bold text-on-surface">
                Send an Inquiry
              </h3>
              <p className="text-xs text-secondary mt-0.5">We reply promptly via call or WhatsApp</p>
            </div>
            <img src="/assets/bcs-logo.png" alt="BCS" className="w-9 h-9 rounded-full object-cover" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-secondary">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. pooja@example.com"
                  className="w-full h-11 px-3.5 mt-1 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/60 outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-secondary">
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full h-11 px-3.5 mt-1 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/60 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-secondary">
                  Subject *
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full h-11 px-3.5 mt-1 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/60 outline-none focus:border-primary"
                >
                  <option>Custom Designer Cake Consultation</option>
                  <option>Order Support & Delivery Tracking</option>
                  <option>Party Snacks & Bulk Catering</option>
                  <option>Custom Birthday / Milestone Cake</option>
                  <option>Other Feedback</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">
                Your Message *
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Mention cake weight (e.g. 1kg, 2kg), date, event theme, or snack requirements..."
                className="w-full p-3.5 mt-1 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/60 outline-none focus:border-primary"
              ></textarea>
            </div>

            <button
              type="submit"
              className="mt-2 w-full h-12 rounded-full bg-primary hover:bg-primary-container text-on-primary font-bold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Submit Inquiry to Darshil Panchasara</span>
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>

        {/* Flagship Store Info */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-confectionery-1 border border-outline-variant/60 flex flex-col gap-4">
            <div className="border-b border-surface-container-high pb-3">
              <span className="text-[10px] tracking-widest uppercase font-bold text-primary">Main Storefront</span>
              <h3 className="font-headline text-xl font-bold text-on-surface">
                SHREE BHUVNESHWARI CAKE & SNACKS
              </h3>
              <p className="text-xs text-secondary mt-0.5">
                Owner & Master Baker: <strong className="text-on-surface">Darshil Panchasara</strong>
              </p>
            </div>

            <div className="flex flex-col gap-3.5 text-xs sm:text-sm text-secondary">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[22px] text-primary flex-shrink-0 mt-0.5">
                  location_on
                </span>
                <div>
                  <p className="font-bold text-on-surface">Dhrol Storefront & Bakery</p>
                  <p>PP Complex, Near Sak Market</p>
                  <p>Jamnagar Road, Dhrol</p>
                  <p>Jamnagar, Gujarat - 361210</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[22px] text-primary flex-shrink-0">
                  schedule
                </span>
                <div>
                  <p className="font-bold text-on-surface">Store Hours</p>
                  <p>Open 7 Days: 7:00 AM – 10:30 PM</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[22px] text-primary flex-shrink-0">
                  call
                </span>
                <div>
                  <p className="font-bold text-on-surface">Direct Phone & WhatsApp</p>
                  <p className="text-primary font-semibold">94272 43732 / 88662 65927 / 9313581083</p>
                  <p className="text-xs text-secondary mt-0.5">
                    WhatsApp Chat: <a href="https://wa.me/919313581083" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">+91 9313581083</a>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[22px] text-primary flex-shrink-0">
                  mail
                </span>
                <div>
                  <p className="font-bold text-on-surface">Email Address</p>
                  <p>darshil@bhuvneshwaricakes.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Store Interior Card */}
          <div className="relative rounded-3xl overflow-hidden aspect-video border border-outline-variant/60 shadow-md group">
            <img
              src="/assets/bhuvneshwari-shop.png"
              alt="Shree Bhuvneshwari Cake & Snacks Store"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
              <span className="material-symbols-outlined text-amber-400 text-[28px] mb-1">
                storefront
              </span>
              <p className="font-headline text-base font-bold">
                Visit Our Live Bakery & Snacks Counter
              </p>
              <p className="text-xs text-neutral-300">
                Near Sak Market, Jamnagar Road, Dhrol • Fresh bakes every morning & evening
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <section className="pt-8 border-t border-surface-container-high">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="font-label text-xs text-primary font-bold uppercase tracking-wider">
            Customer Guide
          </span>
          <h2 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : i)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 font-headline text-base font-bold text-on-surface hover:text-primary transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="material-symbols-outlined text-[20px] text-secondary flex-shrink-0">
                    {isOpen ? 'remove' : 'add'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-secondary leading-relaxed border-t border-surface-container-high/40 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Contact;
