import axios from 'axios';

/**
 * Enterprise Axios API Client instance configured for Spring Boot Backend Integration.
 * BaseURL defaults to '/api/v1' or environment configuration.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('inventora_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Uniform error handling & status handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token & redirect on unauthorized backend response
      localStorage.removeItem('inventora_token');
    }
    return Promise.reject(error);
  }
);

// Exported endpoints helper structure for Spring Boot mapping
export const ProductAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const WarehouseAPI = {
  getAll: () => api.get('/warehouses'),
  getById: (id) => api.get(`/warehouses/${id}`),
  create: (data) => api.post('/warehouses', data),
  update: (id, data) => api.put(`/warehouses/${id}`, data),
  delete: (id) => api.delete(`/warehouses/${id}`),
};

export const SupplierAPI = {
  getAll: () => api.get('/suppliers'),
  create: (data) => api.post('/suppliers', data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  delete: (id) => api.delete(`/suppliers/${id}`),
};

export const OrderAPI = {
  getPurchaseOrders: () => api.get('/purchase-orders'),
  createPurchaseOrder: (data) => api.post('/purchase-orders', data),
  getSalesOrders: () => api.get('/sales-orders'),
  createSalesOrder: (data) => api.post('/sales-orders', data),
};

export default api;
