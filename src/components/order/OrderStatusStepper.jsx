import React from 'react';

const steps = [
  { key: 'Placed', label: 'Order Placed', icon: 'receipt_long' },
  { key: 'Baking', label: 'Fresh Baking', icon: 'bakery_dining' },
  { key: 'Out for Delivery', label: 'Out for Delivery', icon: 'local_shipping' },
  { key: 'Delivered', label: 'Delivered with Joy', icon: 'celebration' },
];

const OrderStatusStepper = ({ currentStatus = 'Placed', statusHistory = [] }) => {
  const isCancelled = currentStatus === 'Cancelled';

  const getStepIndex = (status) => {
    switch (status) {
      case 'Placed': return 0;
      case 'Baking': return 1;
      case 'Out for Delivery': return 2;
      case 'Delivered': return 3;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);

  if (isCancelled) {
    return (
      <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-3">
        <span className="material-symbols-outlined text-[28px] text-red-600">cancel</span>
        <div>
          <h4 className="font-bold text-sm">Order Cancelled</h4>
          <p className="text-xs text-red-700">This order has been cancelled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-confectionery-1 border border-outline-variant/60">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-headline text-lg font-bold text-on-surface">Live Bakery Tracking</h3>
        <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-wider">
          {currentStatus}
        </span>
      </div>

      {/* Stepper Progress Visual */}
      <div className="relative flex items-center justify-between">
        {/* Background connector line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-surface-container-high z-0"></div>
        {/* Active connector fill line */}
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-primary transition-all duration-700 ease-out z-0"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 90}%` }}
        ></div>

        {steps.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-primary text-on-primary shadow-sm'
                    : isCurrent
                    ? 'bg-primary text-on-primary ring-4 ring-primary-fixed-dim animate-pulse shadow-md'
                    : 'bg-surface-container text-secondary'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] sm:text-[22px]">
                  {isDone ? 'check' : step.icon}
                </span>
              </div>
              <span
                className={`text-[11px] sm:text-xs font-bold text-center mt-2 max-w-[70px] sm:max-w-none ${
                  isCurrent ? 'text-primary' : isDone ? 'text-on-surface' : 'text-secondary/70'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Status History Logs */}
      {statusHistory && statusHistory.length > 0 && (
        <div className="mt-8 pt-5 border-t border-surface-container-high/60 flex flex-col gap-2.5">
          <span className="text-xs uppercase font-bold text-secondary tracking-wider">Activity Updates</span>
          {statusHistory.slice(-3).reverse().map((entry, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></span>
              <div className="flex flex-col">
                <span className="font-semibold text-on-surface">
                  {entry.status} {entry.note ? `• ${entry.note}` : ''}
                </span>
                <span className="text-[10px] text-secondary/80">
                  {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
                  {new Date(entry.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderStatusStepper;
