import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, Heart } from "lucide-react";
import { businessAPI, categoryAPI, favoritesAPI } from "../lib/api";
import { useAuth } from "../lib/context/AuthContext";
import SearchBar from "../components/business/SearchBar";
import CategoryFilter from "../components/business/CategoryFilter";
import BusinessCard from "../components/business/BusinessCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import MetaDataInsert from "../lib/MetaDataInsert";
import { useCommon } from "../lib/context/CommonContext";

export default function Discovery() {
	const { getDefaultIconForCategory, getDefaultColorForCategory } =
		useCommon();
	const [searchParams, setSearchParams] = useSearchParams();
	const [businesses, setBusinesses] = useState([]);
	const [categories, setCategories] = useState([]);
	const [favorites, setFavorites] = useState(new Set());
	const [loading, setLoading] = useState(true);
	const [sortBy, setSortBy] = useState("rating");
	const [deliveryOnly, setDeliveryOnly] = useState(false);
	const [showFilters, setShowFilters] = useState(false);

	const { user } = useAuth();
	const searchQuery = searchParams.get("q") || "";
	const selectedCategory = searchParams.get("category") || null;

	// Fetch businesses and categories
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				// Fetch all data in parallel
				const [businessesRes, categoriesRes] = await Promise.all([
					businessAPI.getAll(),
					categoryAPI.getAll().catch(() => ({ data: [] })),
				]);

				// Process businesses
				let allBusinesses = businessesRes.data || [];

				// Filter only active businesses
				const activeBusinesses = allBusinesses.filter(
					(biz) => biz.isActive === true,
				);

				// Enhance businesses with category data
				const businessesWithCategories = activeBusinesses.map(
					(biz) => ({
						...biz,
						categories:
							categoriesRes.data.find(
								(cat) => cat.name === biz.category,
							) || null,
					}),
				);

				setBusinesses(businessesWithCategories);

				// Process categories
				let categoryData = categoriesRes.data;

				// If no categories from API, extract dynamically from businesses
				if (!categoryData || categoryData.length === 0) {
					categoryData =
						extractCategoriesFromBusinesses(activeBusinesses);
				}

				setCategories(categoryData);
			} catch (error) {
				console.error("Error fetching discovery data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	// Fetch user favorites
	useEffect(() => {
		if (!user) return;

		const fetchFavorites = async () => {
			try {
				const response = await favoritesAPI.getMyFavorites();
				const favoriteBusinessIds = response.data.map(
					(fav) => fav.businessId,
				);
				setFavorites(new Set(favoriteBusinessIds));
			} catch (error) {
				console.error("Error fetching favorites:", error);
			}
		};

		fetchFavorites();
	}, [user]);

	// Handle toggling favorites
	const handleToggleFavorite = async (businessId) => {
		if (!user) {
			// Redirect to login or show message
			alert("Please login to save favorites");
			return;
		}

		try {
			if (favorites.has(businessId)) {
				// Remove from favorites
				await favoritesAPI.removeFavorite(businessId);
				setFavorites((prev) => {
					const newSet = new Set(prev);
					newSet.delete(businessId);
					return newSet;
				});
			} else {
				// Add to favorites
				await favoritesAPI.addFavorite(businessId);
				setFavorites((prev) => new Set([...prev, businessId]));
			}
		} catch (error) {
			console.error("Error toggling favorite:", error);
		}
	};

	// Filter and sort businesses
	const filteredAndSortedBusinesses = useMemo(() => {
		let result = [...businesses];

		// Apply search filter
		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			result = result.filter(
				(b) =>
					b.businessName?.toLowerCase().includes(q) ||
					b.description?.toLowerCase().includes(q) ||
					b.category?.toLowerCase().includes(q),
			);
		}

		// Apply category filter
		if (selectedCategory) {
			const category = categories.find(
				(cat) => cat.slug === selectedCategory,
			);
			if (category) {
				result = result.filter((b) => b.category === category.name);
			}
		}

		// Apply delivery filter (if your business model has delivery_available field)
		if (deliveryOnly) {
			result = result.filter((b) => b.deliveryAvailable === true);
		}

		// Apply sorting
		switch (sortBy) {
			case "rating":
				result.sort(
					(a, b) => (b.averageRating || 0) - (a.averageRating || 0),
				);
				break;
			case "newest":
				result.sort((a, b) => {
					const dateA = a.createdAt
						? new Date(a.createdAt).getTime()
						: 0;
					const dateB = b.createdAt
						? new Date(b.createdAt).getTime()
						: 0;
					return dateB - dateA;
				});
				break;
			case "name":
				result.sort((a, b) =>
					(a.businessName || "").localeCompare(b.businessName || ""),
				);
				break;
			default:
				break;
		}

		// Verified businesses on top
		result.sort((a, b) => (b.isVerified ? 1 : 0) - (a.isVerified ? 1 : 0));

		return result;
	}, [
		businesses,
		searchQuery,
		selectedCategory,
		sortBy,
		deliveryOnly,
		categories,
	]);

	// Helper function to extract categories from businesses
	const extractCategoriesFromBusinesses = (businessesList) => {
		const categoryMap = new Map();

		businessesList.forEach((business) => {
			if (business.category && !categoryMap.has(business.category)) {
				categoryMap.set(business.category, {
					id: business.category
						.toLowerCase()
						.replace(/[^a-z0-9]+/g, "-"),
					name: business.category,
					slug: getCategorySlug(business.category),
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

		return Array.from(categoryMap.values()).sort((a, b) =>
			a.name.localeCompare(b.name),
		);
	};

	const getCategorySlug = (name) => {
		return name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "");
	};

	const clearAllFilters = () => {
		setSearchParams({});
		setSortBy("rating");
		setDeliveryOnly(false);
	};

	const hasActiveFilters = searchQuery || selectedCategory || deliveryOnly;

	// In Discovery.jsx
	const getDiscoveryMetaDescription = () => {
		if (searchQuery && selectedCategory) {
			return `Find ${searchQuery} in ${selectedCategory} category near Tassia Complex. Local businesses ready to serve you.`;
		}
		if (searchQuery) {
			return `Search results for "${searchQuery}" in Tassia Complex. Discover local businesses offering ${searchQuery}.`;
		}
		if (selectedCategory) {
			return `Browse ${selectedCategory} businesses in Tassia Complex. Find the best local services near you.`;
		}
		return "Discover local businesses, restaurants, and services in Tassia Complex, Embakasi East.";
	};

	return (
		<>
			<MetaDataInsert
				title={searchQuery ? `Search: ${searchQuery}` : "Discover"}
				description={getDiscoveryMetaDescription()}
				keywords={`${searchQuery || "discover"}, local businesses, tassia complex, nairobi`}
			/>

			<section className="max-w-5xl mx-auto px-4 py-4 space-y-4">
				{/* Search and Filter Header */}
				<div className="flex gap-2">
					<div className="flex-1">
						<SearchBar
							value={searchQuery}
							onChange={(q) =>
								setSearchParams((prev) => {
									if (q) prev.set("q", q);
									else prev.delete("q");
									return prev;
								})
							}
						/>
					</div>
					<button
						onClick={() => setShowFilters(!showFilters)}
						className={`p-3 rounded-2xl border transition-all ${
							showFilters
								? "bg-orange-500 border-orange-500 text-white"
								: "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
						}`}
						aria-label="Toggle filters"
					>
						<SlidersHorizontal size={18} />
					</button>
				</div>

				{/* Filters Panel */}
				{showFilters && (
					<div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3 shadow-sm">
						<div className="flex items-center justify-between">
							<p className="font-semibold text-gray-800 text-sm">
								Filters & Sort
							</p>
							<button
								onClick={() => setShowFilters(false)}
								className="hover:bg-gray-100 p-1 rounded-full transition-colors"
								aria-label="Close filters"
							>
								<X size={16} className="text-gray-400" />
							</button>
						</div>

						{/* Sort Options */}
						<div className="flex gap-2 flex-wrap">
							<p className="text-xs text-gray-500 w-full">
								Sort by:
							</p>
							{[
								{ value: "rating", label: "Top Rated" },
								{ value: "newest", label: "Newest" },
								{ value: "name", label: "A-Z" },
							].map((option) => (
								<button
									key={option.value}
									onClick={() => setSortBy(option.value)}
									className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
										sortBy === option.value
											? "bg-orange-500 text-white shadow-sm"
											: "bg-gray-100 text-gray-600 hover:bg-gray-200"
									}`}
								>
									{option.label}
								</button>
							))}
						</div>

						{/* Delivery Filter */}
						<label className="flex items-center gap-2 cursor-pointer select-none">
							<div
								onClick={() => setDeliveryOnly(!deliveryOnly)}
								className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
									deliveryOnly
										? "bg-orange-500"
										: "bg-gray-300"
								}`}
							>
								<div
									className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
										deliveryOnly
											? "translate-x-5"
											: "translate-x-1"
									}`}
								/>
							</div>
							<span className="text-sm text-gray-700">
								Delivery available only
							</span>
						</label>
					</div>
				)}

				{/* Category Filter */}
				<CategoryFilter
					categories={categories}
					selected={selectedCategory}
					onSelect={(slug) =>
						setSearchParams((prev) => {
							if (slug) prev.set("category", slug);
							else prev.delete("category");
							return prev;
						})
					}
				/>

				{/* Results Info */}
				<div className="flex items-center justify-between flex-wrap gap-2">
					<p className="text-sm text-gray-500">
						{loading
							? "Loading..."
							: `${filteredAndSortedBusinesses.length} business${filteredAndSortedBusinesses.length !== 1 ? "es" : ""} found`}
					</p>
					{hasActiveFilters && (
						<button
							onClick={clearAllFilters}
							className="text-sm text-orange-500 flex items-center gap-1 hover:text-orange-600 transition-colors"
						>
							<X size={13} /> Clear all filters
						</button>
					)}
				</div>

				{/* Results Grid */}
				{loading ? (
					<div className="flex justify-center py-16">
						<LoadingSpinner size="lg" />
					</div>
				) : filteredAndSortedBusinesses.length === 0 ? (
					<div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
						<div className="text-4xl mb-3">🔍</div>
						<p className="font-semibold text-gray-800 text-lg">
							No businesses found
						</p>
						<p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
							{searchQuery || selectedCategory
								? "Try adjusting your search or category filters"
								: "Be the first to register a business in Tassia!"}
						</p>
						{!searchQuery && !selectedCategory && (
							<Link
								to="/dashboard/new"
								className="mt-4 inline-block bg-orange-500 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors"
							>
								Register Your Business
							</Link>
						)}
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{filteredAndSortedBusinesses.map((biz) => (
							<BusinessCard
								key={biz._id}
								business={biz}
								isFavorited={favorites.has(biz._id)}
								onToggleFavorite={
									user ? handleToggleFavorite : undefined
								}
							/>
						))}
					</div>
				)}
			</section>
		</>
	);
}
