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
	// getRecent: (limit = 10) => api.get(`/community/posts?limit=${limit}`),
	getAll: (page = 1, limit = 20) =>
		api.get(`/community/posts?page=${page}&limit=${limit}`),
	getByType: (type, page = 1, limit = 20) =>
		api.get(`/community/posts?type=${type}&page=${page}&limit=${limit}`),
	getById: (id) => api.get(`/community/posts/${id}`),
	create: (data) => api.post("/community/posts", data),
	update: (id, data) => api.put(`/community/posts/${id}`, data),
	delete: (id) => api.delete(`/community/posts/${id}`),
	togglePin: (id) => api.patch(`/community/posts/${id}/pin`),
};

// Category API
export const categoryAPI = {
	getAll: () => api.get("/categories"),
	getBySlug: (slug) => api.get(`/categories/slug/${slug}`),
	getById: (id) => api.get(`/categories/${id}`),
	create: (data) => api.post("/categories", data),
	update: (id, data) => api.put(`/categories/${id}`, data),
	delete: (id) => api.delete(`/categories/${id}`),
	getBusinessesByCategory: (slug) =>
		api.get(`/categories/${slug}/businesses`),
};

// Helper function to get categories from businesses (dynamic)
export const extractCategoriesFromBusinesses = (businesses) => {
	const categoryMap = new Map();

	businesses.forEach((business) => {
		if (business.category && !categoryMap.has(business.category)) {
			categoryMap.set(business.category, {
				id: business.category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
				name: business.category,
				slug: getSlug(business.category),
				icon: getDefaultIconForCategory(business.category),
				color: getDefaultColorForCategory(business.category),
				businessCount: 1,
			});
		} else if (business.category) {
			const existing = categoryMap.get(business.category);
			if (existing) {
				existing.businessCount++;
			}
		}
	});

	return Array.from(categoryMap.values());
};

// Helper function to create slug
function getSlug(text) {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

// Helper function to get default icon based on category
function getDefaultIconForCategory(category) {
	const iconMap = {
		restaurant: "UtensilsCrossed",
		food: "UtensilsCrossed",
		cafe: "Coffee",
		salon: "Scissors",
		barber: "Scissors",
		spa: "Wind",
		hardware: "Wrench",
		pharmacy: "Pill",
		clinic: "Stethoscope",
		electronics: "Smartphone",
		clothing: "Shirt",
		grocery: "ShoppingBasket",
		education: "BookOpen",
		automotive: "Car",
	};

	const lowerCategory = category.toLowerCase();
	for (const [key, icon] of Object.entries(iconMap)) {
		if (lowerCategory.includes(key)) {
			return icon;
		}
	}
	return "Store";
}

// Helper function to get default color
function getDefaultColorForCategory(category) {
	const colorMap = {
		restaurant: "#f97316",
		food: "#f97316",
		cafe: "#d97706",
		salon: "#ec4899",
		barber: "#ec4899",
		pharmacy: "#10b981",
		clinic: "#10b981",
		electronics: "#6366f1",
		clothing: "#f43f5e",
		grocery: "#22c55e",
		hardware: "#3b82f6",
		education: "#8b5cf6",
		automotive: "#ef4444",
	};

	const lowerCategory = category.toLowerCase();
	for (const [key, color] of Object.entries(colorMap)) {
		if (lowerCategory.includes(key)) {
			return color;
		}
	}
	return "#6b7280";
}

// Add to your existing api.js file

// Favorites API
export const favoritesAPI = {
	getMyFavorites: () => api.get("/favorites"),
	addFavorite: (businessId) => api.post("/favorites", { businessId }),
	removeFavorite: (businessId) => api.delete(`/favorites/${businessId}`),
	checkFavorite: (businessId) => api.get(`/favorites/check/${businessId}`),
};

export default api;
