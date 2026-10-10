import React, { useState, useEffect, useRef } from 'react';

const WhatsAppChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      sender: 'bot',
      time: 'Just now',
      text: 'Namaste! 🙏 Welcome to SHREE BHUVNESHWARI CAKE & SNACKS (Dhrol).'
    },
    {
      sender: 'bot',
      time: 'Just now',
      text: 'We bake 100% pure vegetarian cakes, bespoke wedding tiers, and daily hot snacks. How can we help you today?'
    }
  ]);
  const [hasUnread, setHasUnread] = useState(true);
  const messagesEndRef = useRef(null);

  const WHATSAPP_NUMBER = '919313581083'; // 9313581083 with India country code
  const DISPLAY_WHATSAPP = '9313581083';

  const quickPrompts = [
    {
      icon: '🎂',
      label: 'Order Custom Cake',
      prompt: 'Hello Shree Bhuvneshwari Cakes, I would like to order a custom cake for my upcoming celebration.'
    },
    {
      icon: '🍰',
      label: "Today's Fresh Bakes",
      prompt: "Namaste! What fresh cake flavors and daily snacks are available at your Dhrol counter today?"
    },
    {
      icon: '📍',
      label: 'Store Location & Hours',
      prompt: 'Hi! Could you share directions to PP Complex, Dhrol? (Google Maps: https://maps.app.goo.gl/xEMDs6p1rZgFNaqr8)'
    },
    {
      icon: '🚚',
      label: 'Delivery in Dhrol / Jamnagar',
      prompt: 'Hi! Do you offer chilled delivery to my address in Dhrol / Jamnagar?'
    },
    {
      icon: '💍',
      label: 'Wedding & Engagement Tiers',
      prompt: 'Hello Darshil, I want to consult for a luxury multi-tier engagement / wedding cake.'
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, chatLog]);

  const handleSendToWhatsApp = (textToSend) => {
    const finalMsg = textToSend || message || 'Hello Shree Bhuvneshwari Cakes, I want to inquire about ordering a cake.';
    const encoded = encodeURIComponent(finalMsg);
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
    
    // Add user message to chat log
    setChatLog((prev) => [
      ...prev,
      { sender: 'user', time: 'Just now', text: finalMsg },
      { sender: 'bot', time: 'Just now', text: 'Redirecting you to WhatsApp with Darshil Panchasara on +91 ' + DISPLAY_WHATSAPP + '... 🟢' }
    ]);
    setMessage('');

    // Open WhatsApp
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleQuickPromptClick = (prompt) => {
    setMessage(prompt);
    handleSendToWhatsApp(prompt);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    handleSendToWhatsApp(message.trim());
  };

  return (
    <>
      {/* Floating WhatsApp Action Button */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 group">
        {!isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-lowest text-on-surface text-xs font-bold shadow-lg border border-outline-variant/60 cursor-pointer animate-in fade-in slide-in-from-right-3 duration-300 hover:border-emerald-500/60 transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Chat on WhatsApp</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open WhatsApp Chatbot"
          className="relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-[0_8px_24px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none"
        >
          {isOpen ? (
            <span className="material-symbols-outlined text-[28px]">close</span>
          ) : (
            <>
              {/* WhatsApp Icon */}
              <svg
                className="w-7 h-7 fill-white"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.03C9.33 7.03 9 7.11 8.71 7.42C8.42 7.74 7.62 8.49 7.62 10.04C7.62 11.59 8.75 13.08 8.91 13.29C9.07 13.5 11.13 16.68 14.28 18.04C15.03 18.36 15.61 18.55 16.07 18.7C16.82 18.94 17.5 18.9 18.04 18.82C18.65 18.73 19.89 18.07 20.15 17.33C20.41 16.6 20.41 15.97 20.33 15.84C20.25 15.71 20.05 15.63 19.75 15.48C19.45 15.34 17.98 14.61 17.7 14.51C17.43 14.41 17.23 14.36 17.03 14.67C16.83 14.98 16.25 15.66 16.07 15.86C15.9 16.07 15.72 16.1 15.42 15.95C15.12 15.8 13.85 15.38 12.35 14.04C11.18 13 10.39 11.72 10.16 11.33C9.93 10.94 10.14 10.73 10.29 10.58C10.43 10.44 10.6 10.21 10.75 10.04C10.9 9.86 10.95 9.73 11.05 9.53C11.15 9.33 11.1 9.15 11.02 9C10.95 8.85 10.35 7.38 10.1 6.78C9.86 6.19 9.61 6.27 9.43 6.26C9.26 6.25 9.06 6.25 8.86 6.25L9.53 7.03Z" />
              </svg>
              {hasUnread && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-black flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
                  1
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {/* WhatsApp Interactive Chatbot Modal */}
      {isOpen && (
        <div className="fixed bottom-36 sm:bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[380px] max-w-[400px] h-[520px] max-h-[80vh] flex flex-col bg-surface rounded-3xl shadow-2xl border border-outline-variant/70 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#075E54] to-[#128C7E] p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/assets/bcs-logo.png"
                  alt="Bhuvneshwari Cakes"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/60 bg-white"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/customer-portrait.png';
                  }}
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25D366] border-2 border-[#075E54]"></span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-sm leading-tight text-white">
                  SHREE BHUVNESHWARI CAKES
                </h3>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                  <span>Dhrol, Jamnagar • Online Assistant</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Store Info Micro-Banner */}
          <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200/50 px-3 py-1.5 text-[11px] text-amber-900 dark:text-amber-200 flex items-center justify-between">
            <span className="truncate">📍 PP Complex, Near Sak Market, Dhrol</span>
            <span className="font-bold font-mono text-[10px] bg-amber-200 dark:bg-amber-800 px-1.5 py-0.5 rounded">
              361210
            </span>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#e5ddd5]/30 dark:bg-surface-container-lowest">
            {chatLog.map((item, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${item.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-sm ${
                    item.sender === 'user'
                      ? 'bg-[#dcf8c6] text-neutral-900 rounded-tr-none'
                      : 'bg-surface text-on-surface border border-outline-variant/40 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{item.text}</p>
                  <span className="text-[9px] text-secondary mt-1 block text-right">
                    {item.time}
                  </span>
                </div>
              </div>
            ))}

            {/* Quick Action Suggestion Chips */}
            <div className="pt-2">
              <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-2">
                Quick Options (Click to chat):
              </p>
              <div className="flex flex-col gap-1.5">
                {quickPrompts.map((qp, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickPromptClick(qp.prompt)}
                    className="flex items-center gap-2 text-left px-3 py-2 rounded-xl bg-surface hover:bg-surface-container text-on-surface text-xs border border-outline-variant/60 shadow-xs transition-all active:scale-98 group hover:border-[#25D366]"
                  >
                    <span className="text-base">{qp.icon}</span>
                    <span className="flex-1 font-medium text-[11px]">{qp.label}</span>
                    <span className="material-symbols-outlined text-[14px] text-secondary group-hover:text-[#25D366]">
                      arrow_forward
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* Direct Hotlines Strip */}
          <div className="px-3 py-1.5 bg-surface-container-high/80 border-t border-outline-variant/40 text-[10px] text-secondary flex items-center justify-between">
            <span className="font-semibold text-on-surface flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-primary">call</span>
              Hotlines:
            </span>
            <div className="flex items-center gap-2 font-mono font-bold text-primary">
              <a href="tel:8866265927" className="hover:underline font-bold">88662 65927</a>
              <span>•</span>
              <a href="tel:9427243732" className="hover:underline">94272 43732</a>
            </div>
          </div>

          {/* Footer Input Area */}
          <form
            onSubmit={handleSubmit}
            className="p-2.5 bg-surface border-t border-outline-variant/50 flex items-center gap-2"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about cakes or order..."
              className="flex-1 h-10 px-3.5 rounded-full bg-surface-container-low text-on-surface text-xs border border-outline-variant focus:outline-none focus:border-[#25D366] transition-colors"
            />
            <button
              type="submit"
              className="h-10 px-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center gap-1 shadow-md transition-transform active:scale-95"
              title="Send to WhatsApp"
            >
              <span className="text-xs font-bold hidden sm:inline">WhatsApp</span>
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default WhatsAppChatbot;
