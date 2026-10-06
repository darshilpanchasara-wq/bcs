import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed top-24 left-4 right-4 max-w-md mx-auto z-50 pointer-events-none flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto shadow-confectionery-3 rounded-full px-5 py-3.5 flex items-center justify-between transition-all transform animate-bounce-short ${
              toast.type === 'error'
                ? 'bg-red-800 text-white border border-red-700'
                : toast.type === 'info'
                ? 'bg-surface-container-highest text-on-surface border border-outline-variant'
                : 'bg-on-surface text-surface-bright border border-primary/30'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`material-symbols-outlined text-[22px] flex-shrink-0 ${
                  toast.type === 'error' ? 'text-red-300' : 'text-primary-fixed-dim'
                }`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {toast.type === 'error' ? 'error' : toast.type === 'info' ? 'info' : 'cake'}
              </span>
              <span className="font-body text-sm font-semibold truncate">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-surface-container-high hover:text-white p-1 -mr-1 flex-shrink-0 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
