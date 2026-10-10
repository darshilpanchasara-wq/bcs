import axios from 'axios';
import { clientStore, INITIAL_USERS } from './clientStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header if token exists in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sweetcrumbs_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fallback dispatcher when backend server is absent or returns HTML (Vercel/static live deployment)
function handleClientStoreRequest(config) {
  const url = (config.url || '').replace(/^\/api/, '');
  const method = (config.method || 'get').toLowerCase();

  let body = {};
  if (config.data) {
    try {
      body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    } catch {
      body = {};
    }
  }

  // Parse query params from URL
  const query = {};
  if (url.includes('?')) {
    const searchParams = new URLSearchParams(url.split('?')[1]);
    for (const [key, value] of searchParams.entries()) {
      query[key] = value;
    }
  }
  const cleanPath = url.split('?')[0].replace(/\/+$/, '') || '/';

  // 1. Categories
  if (cleanPath === '/categories' && method === 'get') {
    return Promise.resolve({
      status: 200,
      data: { success: true, categories: clientStore.getCategories() }
    });
  }

  // 2. Cakes - Featured
  if (cleanPath === '/cakes/featured' && method === 'get') {
    return Promise.resolve({
      status: 200,
      data: { success: true, ...clientStore.getFeaturedCakes() }
    });
  }

  // 3. Cakes - Catalog
  if (cleanPath === '/cakes' && method === 'get') {
    const params = { ...query, ...(config.params || {}) };
    return Promise.resolve({
      status: 200,
      data: { success: true, ...clientStore.getCakes(params) }
    });
  }

  // 4. Cake Details by ID or Slug: /cakes/:identifier
  if (cleanPath.startsWith('/cakes/') && method === 'get') {
    const identifier = cleanPath.replace('/cakes/', '');
    const cakeData = clientStore.getCakeById(identifier);
    if (!cakeData) {
      return Promise.reject(new Error('Cake not found'));
    }
    return Promise.resolve({
      status: 200,
      data: { success: true, ...cakeData }
    });
  }

  // 5. Auth - Register
  if (cleanPath === '/auth/register' && method === 'post') {
    try {
      const { user, token } = clientStore.register(body);
      return Promise.resolve({
        status: 200,
        data: { success: true, user, token }
      });
    } catch (err) {
      return Promise.reject(new Error(err.message || 'Registration failed'));
    }
  }

  // 6. Auth - Login
  if (cleanPath === '/auth/login' && method === 'post') {
    try {
      const { user, token } = clientStore.login(body.email, body.password);
      return Promise.resolve({
        status: 200,
        data: { success: true, user, token }
      });
    } catch (err) {
      return Promise.reject(new Error(err.message || 'Login failed'));
    }
  }

  // 7. Auth - Me
  if (cleanPath === '/auth/me' && method === 'get') {
    const user = clientStore.getCurrentUser();
    if (user) {
      return Promise.resolve({
        status: 200,
        data: { success: true, user }
      });
    }
    return Promise.reject(new Error('No active session'));
  }

  // 8. Auth - Logout
  if (cleanPath === '/auth/logout' && method === 'post') {
    clientStore.logout();
    return Promise.resolve({
      status: 200,
      data: { success: true, message: 'Logged out successfully' }
    });
  }

  // 9. Auth - Profile Update
  if (cleanPath === '/auth/profile' && method === 'put') {
    const user = clientStore.updateProfile(body);
    return Promise.resolve({
      status: 200,
      data: { success: true, user }
    });
  }

  // 10. Auth - Wishlist Toggle: /auth/wishlist/:id
  if (cleanPath.startsWith('/auth/wishlist/') && method === 'post') {
    const cakeId = cleanPath.replace('/auth/wishlist/', '');
    const res = clientStore.toggleWishlist(cakeId);
    return Promise.resolve({
      status: 200,
      data: { success: true, ...res }
    });
  }

  // 11. Auth - Forgot Password
  if (cleanPath === '/auth/forgot-password' && method === 'post') {
    return Promise.resolve({
      status: 200,
      data: { success: true, message: 'Password reset link sent to your email.' }
    });
  }

  // 12. Coupons - Validate
  if (cleanPath === '/coupons/validate' && method === 'post') {
    try {
      const coupon = clientStore.validateCoupon(body.code, body.orderAmount);
      return Promise.resolve({
        status: 200,
        data: { success: true, coupon }
      });
    } catch (err) {
      return Promise.reject(new Error(err.message));
    }
  }

  // 13. Orders - Place Order
  if (cleanPath === '/orders' && method === 'post') {
    const order = clientStore.createOrder(body);
    return Promise.resolve({
      status: 201,
      data: { success: true, order }
    });
  }

  // 14. Orders - My Orders
  if (cleanPath === '/orders/my-orders' && method === 'get') {
    return Promise.resolve({
      status: 200,
      data: { success: true, orders: clientStore.getUserOrders() }
    });
  }

  // 15. Orders - Get Single: /orders/:id
  if (cleanPath.startsWith('/orders/') && !cleanPath.includes('cancel') && !cleanPath.includes('verify') && method === 'get') {
    const orderId = cleanPath.replace('/orders/', '');
    const order = clientStore.getOrderById(orderId);
    if (!order) return Promise.reject(new Error('Order not found'));
    return Promise.resolve({
      status: 200,
      data: { success: true, order }
    });
  }

  // 16. Orders - Cancel: /orders/:id/cancel
  if (cleanPath.startsWith('/orders/') && cleanPath.endsWith('/cancel') && method === 'put') {
    const orderId = cleanPath.split('/')[2];
    const order = clientStore.cancelOrder(orderId);
    return Promise.resolve({
      status: 200,
      data: { success: true, order }
    });
  }

  // 17. Orders - Verify Payment
  if (cleanPath.includes('/verify-payment') && method === 'post') {
    return Promise.resolve({
      status: 200,
      data: { success: true, message: 'Payment verified' }
    });
  }

  // 18. Custom Orders
  if (cleanPath === '/custom-orders' && method === 'post') {
    const customOrder = clientStore.createCustomOrder(body);
    return Promise.resolve({
      status: 201,
      data: { success: true, customOrder }
    });
  }

  if (cleanPath === '/custom-orders' && method === 'get') {
    return Promise.resolve({
      status: 200,
      data: { success: true, customOrders: [] }
    });
  }

  // 19. Reviews
  if (cleanPath.startsWith('/reviews/cake/') && method === 'post') {
    const cakeId = cleanPath.replace('/reviews/cake/', '');
    const review = clientStore.addReview(cakeId, body.rating, body.comment);
    return Promise.resolve({
      status: 201,
      data: { success: true, review, cakeRating: 5.0, numReviews: 12 }
    });
  }

  // 20. Admin Dashboard
  if (cleanPath === '/admin/dashboard' && method === 'get') {
    return Promise.resolve({
      status: 200,
      data: { success: true, stats: clientStore.getAdminDashboard() }
    });
  }

  // 21. Admin Users & Orders
  if (cleanPath === '/admin/users' && method === 'get') {
    return Promise.resolve({
      status: 200,
      data: { success: true, users: INITIAL_USERS }
    });
  }

  if (cleanPath === '/admin/orders' && method === 'get') {
    return Promise.resolve({
      status: 200,
      data: { success: true, orders: clientStore.getUserOrders() }
    });
  }

  return Promise.reject(new Error(`Endpoint ${method.toUpperCase()} ${cleanPath} not handled`));
}

// Response interceptor with graceful client store fallback
api.interceptors.response.use(
  (response) => {
    // If static hosting (like Vercel) served HTML for an API endpoint
    if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
      return handleClientStoreRequest(response.config);
    }
    return response;
  },
  async (error) => {
    // If backend connection fails, connection refused, 404/405/500, or network error
    try {
      if (error.config) {
        return await handleClientStoreRequest(error.config);
      }
    } catch (fallbackError) {
      return Promise.reject(fallbackError);
    }
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
