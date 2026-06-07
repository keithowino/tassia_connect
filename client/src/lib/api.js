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
	getById: (id) => api.get(`/businesses/${id}`),
	create: (data) => api.post("/businesses", data),
	update: (id, data) => api.put(`/businesses/${id}`, data),
	delete: (id) => api.delete(`/businesses/${id}`),
	updateStatus: (id, data) => api.patch(`/businesses/${id}/status`, data),
};

// Product API
export const productAPI = {
	getAll: () => api.get("/products"), // Admin only
	getByBusiness: (businessId) => api.get(`/products/business/${businessId}`),
	create: (data) => api.post("/products", data),
	update: (id, data) => api.put(`/products/${id}`, data),
	delete: (id) => api.delete(`/products/${id}`),
};

// Order API
export const orderAPI = {
	getAll: () => api.get("/orders"),
	getMyOrders: () => api.get("/orders/my"),
	getBusinessOrders: (businessId) =>
		api.get(`/orders/business/${businessId}`),
	create: (data) => api.post("/orders", data),
	updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
	updatePaymentStatus: (id, paymentStatus) =>
		api.patch(`/orders/${id}/payment-status`, { paymentStatus }),
};

// Community API
export const communityAPI = {
	getAll: async (page = 1, limit = 20) => {
		try {
			const response = await api.get(
				`/community/posts?page=${page}&limit=${limit}`,
			);
			// Return the posts array directly for easier consumption
			return { ...response, data: response.data?.posts || [] };
		} catch (error) {
			console.error("Error fetching community posts:", error);
			return { data: [] };
		}
	},
	getByType: async (type, page = 1, limit = 20) => {
		try {
			const response = await api.get(
				`/community/posts?type=${type}&page=${page}&limit=${limit}`,
			);
			return { ...response, data: response.data?.posts || [] };
		} catch (error) {
			return { data: [] };
		}
	},
	getById: (id) => api.get(`/community/posts/${id}`),
	create: (data) => api.post("/community/posts", data),
	update: (id, data) => api.put(`/community/posts/${id}`, data),
	delete: (id) => api.delete(`/community/posts/${id}`),
	togglePin: (id) => api.patch(`/community/posts/${id}/pin`),
	addReaction: (postId, reactionType) =>
		api.post(`/community/posts/${postId}/${reactionType}`),
	removeReaction: (postId, reactionType) =>
		api.delete(`/community/posts/${postId}/${reactionType}`),
	addComment: (postId, content) =>
		api.post(`/community/posts/${postId}/comments`, { content }),
	deleteComment: (postId, commentId) =>
		api.delete(`/community/posts/${postId}/comments/${commentId}`),
	customRequest: (endpoint, method, data) =>
		api({ method, url: endpoint, data }), // Custom request for flexibility
};

// Category API
export const categoryAPI = {
	getAll: () => api.get("/categories"),
	getAllAdmin: () => api.get("/categories/admin/all"),
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

// Favorites API
export const favoritesAPI = {
	getMyFavorites: () => api.get("/favorites"),
	addFavorite: (businessId) => api.post("/favorites", { businessId }),
	removeFavorite: (businessId) => api.delete(`/favorites/${businessId}`),
	checkFavorite: (businessId) => api.get(`/favorites/check/${businessId}`),
};

// User API
export const userAPI = {
	updateProfile: (data) => api.put("/users/profile", data),
	getProfile: () => api.get("/users/profile"),
	getAllUsers: () => api.get("/users"), // Admin only
};

// Admin API
export const adminAPI = {
	getAllUsers: () => api.get("/users"),
	getStats: () => api.get("/admin/stats"),
	updateUserRole: (userId, role) =>
		api.put(`/admin/users/${userId}/role`, { role }),
};

// Review API
export const reviewAPI = {
	getAll: () => api.get("/reviews").catch(() => ({ data: [] })),
	getByBusiness: (businessId) =>
		api.get(`/reviews/business/${businessId}`).catch(() => ({
			data: { reviews: [], averageRating: 0, totalReviews: 0 },
		})),
	create: (data) => api.post("/reviews", data),
	delete: (id) => api.delete(`/reviews/${id}`),
	update: (id, data) => api.put(`/reviews/${id}`, data),
	addLike: (reviewId) => api.post(`/reviews/${reviewId}/like`),
	addDislike: (reviewId) => api.post(`/reviews/${reviewId}/dislike`),
	addComment: (reviewId, content) =>
		api.post(`/reviews/${reviewId}/comments`, { content }),
	deleteComment: (reviewId, commentId) =>
		api.delete(`/reviews/${reviewId}/comments/${commentId}`),
};

// Upload API
export const uploadAPI = {
	uploadSingle: (formData) =>
		api.post("/upload/single", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		}),
	uploadMultiple: (formData) =>
		api.post("/upload/multiple", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		}),
	deleteImage: (publicId) => api.delete(`/upload/${publicId}`),
};

export default api;
