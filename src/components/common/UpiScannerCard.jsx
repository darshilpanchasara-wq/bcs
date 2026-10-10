import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

const UpiScannerCard = ({
  amount = 0,
  orderId = '',
  upiRef = '',
  setUpiRef = null,
  showUtrInput = true,
  showWhatsAppShare = false
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const UPI_ID = '9427243732@upi';
  const UPI_NUMBER = '9427243732';
  const PAYEE_NAME = 'Shree Bhuvneshwari Cake and Snacks';

  // Generate UPI string: standard NPIC / UPI URI
  const upiUri = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(
    PAYEE_NAME
  )}&am=${amount}&cu=INR${orderId ? `&tn=${encodeURIComponent(`Order ${orderId}`)}` : ''}`;

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(upiUri, {
      width: 260,
      margin: 1.5,
      color: {
        dark: '#1e1b18',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then((url) => {
        if (isMounted) setQrCodeUrl(url);
      })
      .catch((err) => {
        console.error('QR generation error:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [upiUri]);

  const handleCopy = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    navigator.clipboard.writeText(UPI_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappShareMsg = encodeURIComponent(
    `Hello Shree Bhuvneshwari Cakes, here is my UPI payment confirmation${
      orderId ? ` for Order #${orderId.slice(-6).toUpperCase()}` : ''
    } of ₹${amount} sent to 9427243732.`
  );

  return (
    <div className="w-full max-w-md mx-auto my-2 rounded-2xl bg-surface-container-lowest border-2 border-emerald-500/40 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Standee Top Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-3.5 sm:p-4 text-center">
        <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-100">
          <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
          <span>Official All-In-One UPI QR Scanner</span>
        </div>
        <h4 className="font-headline text-base sm:text-lg font-black mt-0.5 tracking-tight text-white">
          SCAN & PAY WITH ANY UPI APP
        </h4>

        {/* Brand App Chips */}
        <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
          <span className="px-2 py-0.5 rounded-full bg-white text-neutral-900 font-bold text-[10px] shadow-xs">
            Google Pay
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#5f259f] text-white font-bold text-[10px] shadow-xs">
            PhonePe
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#00baf2] text-white font-bold text-[10px] shadow-xs">
            Paytm
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#e05a2b] text-white font-bold text-[10px] shadow-xs">
            BHIM UPI
          </span>
        </div>
      </div>

      {/* Main QR Display Section */}
      <div className="p-5 flex flex-col items-center text-center bg-white dark:bg-neutral-900">
        {/* QR Code Container */}
        <div className="relative p-3 rounded-2xl bg-white shadow-md border-2 border-dashed border-emerald-500/50 flex items-center justify-center">
          {qrCodeUrl ? (
            <div className="relative">
              <img
                src={qrCodeUrl}
                alt={`UPI QR Code for ${UPI_NUMBER}`}
                className="w-52 h-52 sm:w-56 sm:h-56 object-contain rounded-lg"
              />
              {/* Center Logo Plaque */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-11 h-11 rounded-full bg-white shadow-md border-2 border-emerald-600 flex items-center justify-center p-0.5">
                  <img
                    src="/assets/bcs-logo.png"
                    alt="BCS"
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="w-52 h-52 flex flex-col items-center justify-center gap-2 text-secondary">
              <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs">Generating UPI Scanner...</span>
            </div>
          )}
        </div>

        {/* Amount to Pay Callout */}
        <div className="mt-3.5 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-1.5">
          <span>Amount to Pay:</span>
          <span className="font-headline text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-400">
            ₹{Number(amount).toLocaleString('en-IN')}
          </span>
        </div>

        {/* Payee Info & Copy Button */}
        <div className="mt-3 w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/60 flex items-center justify-between gap-2 text-left">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
              UPI Mobile / VPA
            </span>
            <span className="font-mono font-bold text-base text-on-surface truncate block">
              {UPI_NUMBER}
            </span>
            <p className="text-[11px] text-secondary truncate mt-0.5">
              Shree Bhuvneshwari Cake & Snacks (Darshil)
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className={`px-3 py-2 rounded-lg text-xs font-bold shadow-xs flex items-center gap-1 transition-all active:scale-95 ${
              copied
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        {/* One-Tap Mobile Intent Link */}
        <div className="w-full mt-2.5">
          <a
            href={upiUri}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
          >
            <span className="material-symbols-outlined text-[18px]">phone_android</span>
            <span>Tap to Pay with UPI App (Mobile)</span>
          </a>
        </div>

        {/* Optional UTR Input Field */}
        {showUtrInput && setUpiRef && (
          <div className="w-full mt-3 text-left">
            <label className="text-[11px] font-bold text-secondary block mb-1">
              Enter 12-Digit UPI Ref / UTR Number (Optional):
            </label>
            <input
              type="text"
              value={upiRef}
              onChange={(e) => setUpiRef(e.target.value)}
              placeholder="e.g. 4081xxxxxxxx (Found in GPay/PhonePe receipt)"
              className="w-full h-9 px-3 rounded-lg bg-surface-container-lowest text-xs border border-outline-variant focus:outline-none focus:border-emerald-600 font-mono"
            />
          </div>
        )}

        {/* WhatsApp Screenshot Share CTA */}
        {showWhatsAppShare && (
          <div className="w-full mt-3">
            <a
              href={`https://wa.me/919313581083?text=${whatsappShareMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-10 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-98"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.03C9.33 7.03 9 7.11 8.71 7.42C8.42 7.74 7.62 8.49 7.62 10.04C7.62 11.59 8.75 13.08 8.91 13.29C9.07 13.5 11.13 16.68 14.28 18.04C15.03 18.36 15.61 18.55 16.07 18.7C16.82 18.94 17.5 18.9 18.04 18.82C18.65 18.73 19.89 18.07 20.15 17.33C20.41 16.6 20.41 15.97 20.33 15.84C20.25 15.71 20.05 15.63 19.75 15.48C19.45 15.34 17.98 14.61 17.7 14.51C17.43 14.41 17.23 14.36 17.03 14.67C16.83 14.98 16.25 15.66 16.07 15.86C15.9 16.07 15.72 16.1 15.42 15.95C15.12 15.8 13.85 15.38 12.35 14.04C11.18 13 10.39 11.72 10.16 11.33C9.93 10.94 10.14 10.73 10.29 10.58C10.43 10.44 10.6 10.21 10.75 10.04C10.9 9.86 10.95 9.73 11.05 9.53C11.15 9.33 11.1 9.15 11.02 9C10.95 8.85 10.35 7.38 10.1 6.78C9.86 6.19 9.61 6.27 9.43 6.26C9.26 6.25 9.06 6.25 8.86 6.25L9.53 7.03Z" />
              </svg>
              <span>Share Payment Screenshot on WhatsApp (9313581083)</span>
            </a>
          </div>
        )}

        <div className="mt-3 text-[10px] text-secondary flex items-center justify-center gap-1.5">
          <span className="material-symbols-outlined text-[14px] text-emerald-600">verified_user</span>
          <span>100% Direct & Safe Payment • Zero Processing Surcharges</span>
        </div>
      </div>
    </div>
  );
};

export default UpiScannerCard;
