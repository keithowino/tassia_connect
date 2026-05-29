import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Add token to requests
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// Handle response errors
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			window.location.href = "/auth";
		}
		return Promise.reject(error);
	},
);

// Auth API
export const authAPI = {
	register: (userData) => api.post("/auth/register", userData),
	login: (credentials) => api.post("/auth/login", credentials),
	googleSignIn: (userData) => api.post("/auth/google", userData),
	getMe: () => api.get("/auth/me"),
};

// Business API
export const businessAPI = {
	getAll: () => api.get("/businesses"),
	getBySlug: (slug) => api.get(`/businesses/slug/${slug}`),
	getMyBusinesses: () => api.get("/businesses/my"),
	create: (data) => api.post("/businesses", data),
	update: (id, data) => api.put(`/businesses/${id}`, data),
	delete: (id) => api.delete(`/businesses/${id}`),
};

// Product API
export const productAPI = {
	getByBusiness: (businessId) => api.get(`/products/business/${businessId}`),
	create: (data) => api.post("/products", data),
	update: (id, data) => api.put(`/products/${id}`, data),
	delete: (id) => api.delete(`/products/${id}`),
};

// Order API
export const orderAPI = {
	create: (data) => api.post("/orders", data),
	getMyOrders: () => api.get("/orders/my"),
	getBusinessOrders: (businessId) =>
		api.get(`/orders/business/${businessId}`),
	updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

// Community API
export const communityAPI = {
	getRecent: (limit = 10) => api.get(`/community/posts?limit=${limit}`),
	getAll: (page = 1, limit = 20) =>
		api.get(`/community/posts?page=${page}&limit=${limit}`),
	getById: (id) => api.get(`/community/posts/${id}`),
	create: (data) => api.post("/community/posts", data),
	update: (id, data) => api.put(`/community/posts/${id}`, data),
	delete: (id) => api.delete(`/community/posts/${id}`),
};

export default api;
