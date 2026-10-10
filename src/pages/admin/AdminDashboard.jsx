import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
        <p className="mt-3 text-xs text-secondary font-medium">Compiling bakery metrics...</p>
      </div>
    );
  }

  const {
    totalRevenue = 0,
    totalOrders = 0,
    totalCakes = 0,
    totalUsers = 0,
    pendingCustomOrders = 0,
    orderStatusMap = {},
    recentOrders = [],
    topProducts = [],
    monthlySales = []
  } = stats || {};

  const maxSales = Math.max(...monthlySales.map((m) => m.sales), 10000);

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Title */}
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <span className="font-label text-xs text-primary font-bold uppercase tracking-wider">
            Bakery Performance Overview
          </span>
          <h1 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
            Kitchen & Sales Dashboard
          </h1>
        </div>
        <span className="text-xs text-secondary">
          Live Snapshot • {new Date().toLocaleDateString()}
        </span>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
            <span className="material-symbols-outlined text-[20px] text-primary">payments</span>
          </div>
          <span className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-green-700 font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">trending_up</span> +18.4% this month
          </span>
        </div>

        {/* Card 2: Orders */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <span className="material-symbols-outlined text-[20px] text-primary">receipt_long</span>
          </div>
          <span className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
            {totalOrders}
          </span>
          <span className="text-[11px] text-secondary">
            {orderStatusMap['Baking'] || 0} currently baking
          </span>
        </div>

        {/* Card 3: Cakes */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs font-bold uppercase tracking-wider">Active Cakes</span>
            <span className="material-symbols-outlined text-[20px] text-primary">cake</span>
          </div>
          <span className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
            {totalCakes}
          </span>
          <span className="text-[11px] text-secondary">Across 6 categories</span>
        </div>

        {/* Card 4: Customers & Custom Requests */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs font-bold uppercase tracking-wider">Patrons & Atelier</span>
            <span className="material-symbols-outlined text-[20px] text-primary">group</span>
          </div>
          <span className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
            {totalUsers}
          </span>
          {pendingCustomOrders > 0 ? (
            <span className="text-[11px] text-primary font-bold">
              {pendingCustomOrders} custom cake {pendingCustomOrders === 1 ? 'request' : 'requests'} waiting
            </span>
          ) : (
            <span className="text-[11px] text-secondary">All requests reviewed</span>
          )}
        </div>
      </div>

      {/* Two Column Charts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Revenue Chart Graphic */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col justify-between gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface">Monthly Sales Growth</h3>
              <p className="text-xs text-secondary">Gross sales across last 6 months</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container">
              Healthy Velocity
            </span>
          </div>

          {/* Bar Chart Visual */}
          <div className="flex items-end justify-between gap-3 h-48 pt-6 border-b border-surface-container-high px-2">
            {monthlySales.map((item, idx) => {
              const heightPercent = Math.max(15, Math.round((item.sales / maxSales) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{item.sales.toLocaleString('en-IN')}
                  </span>
                  <div className="w-full max-w-[36px] bg-surface-container-low rounded-t-xl overflow-hidden h-full flex items-end">
                    <div
                      className="w-full bg-primary group-hover:bg-primary-container rounded-t-xl transition-all duration-500"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-semibold text-secondary">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-4">
          <h3 className="font-headline text-lg font-bold text-on-surface border-b border-surface-container-high pb-2">
            Order Status Mix
          </h3>
          <div className="flex flex-col gap-3">
            {[
              { status: 'Placed', count: orderStatusMap['Placed'] || 0, color: 'bg-blue-500' },
              { status: 'Baking', count: orderStatusMap['Baking'] || 0, color: 'bg-amber-500' },
              { status: 'Out for Delivery', count: orderStatusMap['Out for Delivery'] || 0, color: 'bg-purple-500' },
              { status: 'Delivered', count: orderStatusMap['Delivered'] || 0, color: 'bg-green-600' },
              { status: 'Cancelled', count: orderStatusMap['Cancelled'] || 0, color: 'bg-red-500' },
            ].map((s) => (
              <div key={s.status} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${s.color}`}></span>
                  <span className="font-semibold text-on-surface">{s.status}</span>
                </div>
                <span className="font-bold px-2 py-0.5 rounded-full bg-surface-container text-secondary">
                  {s.count}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-surface-container-high">
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-primary hover:underline flex items-center justify-between"
            >
              <span>Manage Kitchen Orders</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Tables: Top Selling Cakes & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-surface-container-high pb-2">
            <h3 className="font-headline text-lg font-bold text-on-surface">Top Signature Cakes</h3>
            <Link to="/admin/cakes" className="text-xs font-bold text-primary hover:underline">
              All Cakes
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {topProducts.map((p) => (
              <div key={p._id} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={p.images?.[0] || '/assets/strawberry-cake.png'}
                    alt={p.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-xs sm:text-sm text-on-surface truncate">{p.name}</span>
                    <span className="text-[11px] text-secondary">
                      ⭐ {p.rating} ({p.numReviews} reviews)
                    </span>
                  </div>
                </div>
                <span className="font-headline text-sm font-bold text-primary ml-2">
                  ₹{p.basePrice?.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Kitchen Orders */}
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-surface-container-high pb-2">
            <h3 className="font-headline text-lg font-bold text-on-surface">Recent Dispatch Orders</h3>
            <Link to="/admin/orders" className="text-xs font-bold text-primary hover:underline">
              View All
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {recentOrders.map((ord) => (
              <div key={ord._id} className="flex items-center justify-between py-1.5 border-b border-surface-container-high/40 last:border-none">
                <div className="flex flex-col">
                  <span className="font-bold text-xs text-on-surface">
                    #{ord._id.slice(-6).toUpperCase()} • {ord.user?.name || 'Customer'}
                  </span>
                  <span className="text-[10px] text-secondary">
                    {ord.orderItems?.length} items • {new Date(ord.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-primary block">₹{ord.totalPrice.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-secondary-container text-on-secondary-container font-semibold">
                    {ord.orderStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
