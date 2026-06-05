import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
	MapPin,
	Phone,
	Clock,
	Star,
	Heart,
	ShoppingCart,
	MessageCircle,
	ChevronLeft,
	Globe,
	Mail,
	Package,
	Wrench,
	Plus,
	Check,
	Share2,
} from "lucide-react";
import { useAuth } from "../lib/context/AuthContext";
import { businessAPI, productAPI, reviewAPI, favoritesAPI } from "../lib/api";
import StarRating from "../components/common/StarRating";
import LoadingSpinner from "../components/common/LoadingSpinner";
import MetaDataInsert from "../lib/MetaDataInsert";
import { useCart } from "../lib/context/CartContext";
import SingleLocationMap from "../components/common/map/SingleLocationMap";

// Category display names and icons mapping
const CATEGORY_CONFIG = {
	general: { icon: Package, label: "General", color: "gray" },
	food: { icon: Package, label: "Food & Beverages", color: "orange" },
	clothing: { icon: Package, label: "Clothing & Fashion", color: "pink" },
	electronics: { icon: Package, label: "Electronics", color: "blue" },
	beauty: { icon: Package, label: "Beauty & Personal Care", color: "purple" },
	services: { icon: Wrench, label: "Services", color: "green" },
};

export default function BusinessProfile() {
	const { slug } = useParams();
	const [business, setBusiness] = useState(null);
	const [products, setProducts] = useState([]);
	const [reviews, setReviews] = useState([]);
	const [isFavorited, setIsFavorited] = useState(false);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("menu");
	const [reviewForm, setReviewForm] = useState({ rating: 0, comment: "" });
	const [submittingReview, setSubmittingReview] = useState(false);
	const [addedItems, setAddedItems] = useState(new Set());
	const [showShareMenu, setShowShareMenu] = useState(false);

	const { user } = useAuth();
	const { addItem } = useCart();

	useEffect(() => {
		if (!slug) return;

		const fetchBusinessData = async () => {
			setLoading(true);
			try {
				// Fetch business by slug
				const businessRes = await businessAPI.getBySlug(slug);
				const businessData = businessRes.data;

				// Check if business is active/verified
				if (!businessData.isActive && !businessData.isVerified) {
					setBusiness(null);
					setLoading(false);
					return;
				}

				setBusiness(businessData);

				// Fetch products
				const productsRes = await productAPI.getByBusiness(
					businessData._id,
				);
				setProducts(productsRes.data || []);

				// Fetch reviews
				const reviewsRes = await reviewAPI.getByBusiness(
					businessData._id,
				);
				setReviews(reviewsRes.data?.reviews || []);

				// Check if favorited
				if (user) {
					try {
						const favCheck = await favoritesAPI.checkFavorite(
							businessData._id,
						);
						setIsFavorited(favCheck.data.isFavorited);
					} catch (err) {
						console.log("Favorite check failed:", err);
						setIsFavorited(false);
					}
				}
			} catch (error) {
				console.error("Error fetching business:", error);
				if (error.response?.status === 404) {
					setBusiness(null);
				}
			} finally {
				setLoading(false);
			}
		};

		fetchBusinessData();
	}, [slug, user]);

	const toggleFavorite = async () => {
		if (!user || !business) {
			alert("Please login to save favorites");
			return;
		}

		try {
			if (isFavorited) {
				await favoritesAPI.removeFavorite(business._id);
				setIsFavorited(false);
			} else {
				await favoritesAPI.addFavorite(business._id);
				setIsFavorited(true);
			}
		} catch (error) {
			console.error("Error toggling favorite:", error);
			alert("Could not save favorite. Please try again.");
		}
	};

	const handleAddToCart = (product) => {
		if (!business) return;
		addItem(product, business._id, business.businessName);
		setAddedItems((prev) => new Set([...prev, product._id]));
		setTimeout(() => {
			setAddedItems((prev) => {
				const newSet = new Set(prev);
				newSet.delete(product._id);
				return newSet;
			});
		}, 2000);
	};

	const handleSubmitReview = async () => {
		if (!user || !business || reviewForm.rating === 0) {
			alert("Please select a rating and login to review");
			return;
		}

		setSubmittingReview(true);

		try {
			const response = await reviewAPI.create({
				businessId: business._id,
				rating: reviewForm.rating,
				comment: reviewForm.comment,
			});

			// Add new review to list
			const newReview = response.data;
			setReviews((prev) => [newReview, ...prev]);
			setReviewForm({ rating: 0, comment: "" });

			// Refresh business to update rating
			const updatedBusiness = await businessAPI.getBySlug(slug);
			setBusiness(updatedBusiness.data);
		} catch (error) {
			console.error("Error submitting review:", error);
			if (error.response?.status === 400) {
				alert("You have already reviewed this business");
			} else {
				alert("Failed to submit review. Please try again.");
			}
		} finally {
			setSubmittingReview(false);
		}
	};

	const shareBusiness = () => {
		const url = window.location.href;
		if (navigator.share) {
			navigator
				.share({
					title: business?.businessName,
					text: `Check out ${business?.businessName} on Tassia Connect!`,
					url: url,
				})
				.catch(() => console.log("Share cancelled"));
		} else {
			navigator.clipboard.writeText(url);
			alert("Link copied to clipboard!");
		}
		setShowShareMenu(false);
	};

	// Helper function to get product image (handles both images array and image_url)
	const getProductImage = (product) => {
		if (product.images && product.images.length > 0) {
			return product.images[0];
		}
		return product.image_url || null;
	};

	// Group products by category
	const getGroupedProducts = () => {
		const grouped = {};
		products.forEach((product) => {
			const category = product.category || "general";
			if (!grouped[category]) {
				grouped[category] = [];
			}
			grouped[category].push(product);
		});
		return grouped;
	};

	const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
	const today = days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

	if (loading) {
		return (
			<div className="flex justify-center py-20">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	if (!business) {
		return (
			<>
				<MetaDataInsert title="Invalid business search" />

				<section className="text-center py-20 px-4">
					<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<Package size={32} className="text-gray-400" />
					</div>
					<p className="text-gray-500 text-lg font-medium">
						Business not found
					</p>
					<p className="text-gray-400 text-sm mt-1">
						The business you're looking for doesn't exist or is
						unavailable
					</p>
					<Link
						to="/discover"
						className="mt-6 inline-block bg-orange-500 text-white px-6 py-2.5 rounded-full font-medium hover:bg-orange-600 transition-colors"
					>
						Browse Businesses
					</Link>
				</section>
			</>
		);
	}

	const coverImage =
		business.coverImage ||
		business.cover_image ||
		`https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800`;
	const businessName = business.businessName || business.name;
	const averageRating =
		business.averageRating || business.average_rating || 0;
	const reviewCount = business.reviewCount || reviews.length;
	const isOpen = business.open_days?.includes(today);
	const groupedProducts = getGroupedProducts();
	const hasProducts = products.length > 0;

	return (
		<>
			<MetaDataInsert
				title={business.businessName}
				description={
					business.description ||
					`Visit ${business.businessName} at ${business.location?.label || "Tassia Complex"}. ${business.tagline || "Local business serving the community."}`
				}
				image={business.coverImage || business.cover_image}
				type="business"
				url={`https://tassia-connect.vercel.app/business/${business.slug}`}
			/>

			<section className="max-w-5xl mx-auto pb-20">
				{/* Cover Image */}
				<div className="relative h-52 md:h-72">
					<img
						src={coverImage}
						alt={businessName}
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

					{/* Back Button */}
					<Link
						to="/discover"
						className="absolute top-4 left-4 p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all hover:scale-105"
						aria-label="Go back"
					>
						<ChevronLeft size={20} className="text-gray-700" />
					</Link>

					{/* Action Buttons */}
					<div className="absolute top-4 right-4 flex gap-2">
						<button
							onClick={shareBusiness}
							className="p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all hover:scale-105"
							aria-label="Share business"
						>
							<Share2 size={20} className="text-gray-700" />
						</button>

						{user && (
							<button
								onClick={toggleFavorite}
								className="p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all hover:scale-105"
								aria-label={
									isFavorited
										? "Remove from favorites"
										: "Add to favorites"
								}
							>
								<Heart
									size={20}
									className={
										isFavorited
											? "fill-red-500 text-red-500"
											: "text-gray-700"
									}
								/>
							</button>
						)}
					</div>

					{/* Business Name */}
					<div className="absolute bottom-6 left-4 right-4">
						<h1 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg">
							{businessName}
						</h1>
						{business.tagline && (
							<p className="text-white/90 text-sm mt-1 drop-shadow">
								{business.tagline}
							</p>
						)}
					</div>
				</div>

				{/* Main Content */}
				<div className="px-4 -mt-6 relative">
					{/* Quick Info Card */}
					<div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
						<div className="flex flex-wrap items-start justify-between gap-3">
							<div className="space-y-2">
								{/* Category Badge */}
								{business.category && (
									<span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full text-white bg-orange-500">
										{business.category}
									</span>
								)}

								{/* Rating */}
								<div className="flex items-center gap-2">
									<StarRating
										rating={averageRating}
										size={16}
									/>
									<span className="font-bold text-gray-800">
										{averageRating > 0
											? averageRating.toFixed(1)
											: "No ratings"}
									</span>
									<span className="text-gray-400 text-sm">
										({reviewCount}{" "}
										{reviewCount === 1
											? "review"
											: "reviews"}
										)
									</span>
								</div>

								{/* Location */}
								<div className="flex items-center gap-1.5 text-sm text-gray-600">
									<MapPin
										size={14}
										className="text-orange-500 shrink-0"
									/>
									<span>
										{business.location?.label ||
											business.location_label ||
											"Location"}
										{business.location?.floor_unit &&
											`, ${business.location.floor_unit}`}
									</span>
								</div>

								{/* Hours */}
								<div className="flex items-center gap-1.5 text-sm">
									<Clock
										size={14}
										className={
											isOpen
												? "text-green-500"
												: "text-red-500"
										}
									/>
									<span
										className={
											isOpen
												? "text-green-600 font-medium"
												: "text-gray-500"
										}
									>
										{isOpen ? "Open now" : "Closed"} ·{" "}
										{business.opening_time || "N/A"} –{" "}
										{business.closing_time || "N/A"}
									</span>
								</div>
							</div>

							{/* Contact Buttons */}
							<div className="flex gap-2">
								{business.phone && (
									<a
										href={`tel:${business.phone}`}
										className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-2 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors"
									>
										<Phone size={14} /> Call
									</a>
								)}
								{business.whatsapp && (
									<a
										href={`https://wa.me/${business.whatsapp.replace(/\D/g, "")}`}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors"
									>
										<MessageCircle size={14} /> WhatsApp
									</a>
								)}
							</div>
						</div>

						{/* Delivery Info */}
						{business.delivery_available && (
							<div className="mt-3 flex flex-wrap items-center gap-2 bg-blue-50 rounded-xl p-2.5">
								<ShoppingCart
									size={16}
									className="text-blue-500"
								/>
								<span className="text-sm text-blue-700 font-medium">
									Delivery available
								</span>
								{business.delivery_fee > 0 && (
									<span className="text-sm text-blue-600">
										· KES {business.delivery_fee} fee
									</span>
								)}
								{business.min_order > 0 && (
									<span className="text-xs text-blue-500 ml-auto">
										Min order: KES {business.min_order}
									</span>
								)}
							</div>
						)}
					</div>

					{/* Tabs */}
					<div className="flex gap-1 bg-gray-100 rounded-2xl p-1 mb-6">
						{[
							{
								id: "menu",
								label: "Menu & Services",
								icon: Package,
							},
							{ id: "reviews", label: "Reviews", icon: Star },
							{ id: "info", label: "Info", icon: MapPin },
						].map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
									activeTab === tab.id
										? "bg-white text-gray-900 shadow-sm"
										: "text-gray-500 hover:text-gray-700"
								}`}
							>
								<tab.icon size={14} />
								{tab.label}
							</button>
						))}
					</div>

					{/* Menu Tab - New Grid Layout */}
					{activeTab === "menu" && (
						<div className="space-y-8">
							{!hasProducts ? (
								<div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
									<Package
										size={48}
										className="text-gray-300 mx-auto mb-3"
									/>
									<p className="text-gray-500 font-medium">
										No products or services listed yet
									</p>
									<p className="text-sm text-gray-400 mt-1">
										Check back later for updates!
									</p>
								</div>
							) : (
								Object.entries(groupedProducts).map(
									([category, items]) => {
										const config =
											CATEGORY_CONFIG[category] ||
											CATEGORY_CONFIG.general;
										const Icon = config.icon;

										return (
											<div key={category}>
												{/* Category Header */}
												<h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide flex items-center gap-2 mb-4">
													<Icon
														size={16}
														className="text-orange-500"
													/>
													{config.label} (
													{items.length})
												</h3>

												{/* Grid Layout */}
												<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
													{items.map((item) => {
														const imageSrc =
															getProductImage(
																item,
															);

														return (
															<div
																key={item._id}
																className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 group flex flex-col"
															>
																{/* Product Image */}
																<div className="relative h-48 bg-gray-100">
																	{imageSrc ? (
																		<img
																			src={
																				imageSrc
																			}
																			alt={
																				item.name
																			}
																			className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
																		/>
																	) : (
																		<div className="w-full h-full flex items-center justify-center">
																			<Package
																				size={
																					48
																				}
																				className="text-gray-300"
																			/>
																		</div>
																	)}

																	{!item.isAvailable && (
																		<div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-medium">
																			Out
																			of
																			Stock
																		</div>
																	)}
																</div>

																{/* Product Info */}
																<div className="p-4 flex-1 flex flex-col">
																	<div className="flex-1">
																		<p className="font-semibold text-gray-900 line-clamp-2 leading-tight mb-1">
																			{
																				item.name
																			}
																		</p>

																		{item.description && (
																			<p className="text-xs text-gray-500 line-clamp-2 mb-3">
																				{
																					item.description
																				}
																			</p>
																		)}
																	</div>

																	<div className="flex items-center justify-between mt-3">
																		<p className="font-bold text-orange-600 text-lg">
																			KES{" "}
																			{item.price.toLocaleString()}
																		</p>

																		{item.stock >
																			0 &&
																			item.stock <
																				10 && (
																				<span className="text-xs text-orange-500 font-medium">
																					Only{" "}
																					{
																						item.stock
																					}{" "}
																					left
																				</span>
																			)}
																	</div>
																</div>

																{/* Add to Cart Button */}
																<div className="px-4 pb-4">
																	<button
																		onClick={() =>
																			handleAddToCart(
																				item,
																			)
																		}
																		disabled={
																			!item.isAvailable
																		}
																		className={`w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
																			!item.isAvailable
																				? "bg-gray-200 text-gray-500 cursor-not-allowed"
																				: addedItems.has(
																							item._id,
																					  )
																					? "bg-green-500 text-white"
																					: "bg-orange-500 hover:bg-orange-600 text-white"
																		}`}
																	>
																		{addedItems.has(
																			item._id,
																		) ? (
																			<>
																				<Check
																					size={
																						18
																					}
																				/>{" "}
																				Added
																			</>
																		) : (
																			<>
																				<Plus
																					size={
																						18
																					}
																				/>{" "}
																				Add
																				to
																				Cart
																			</>
																		)}
																	</button>
																</div>
															</div>
														);
													})}
												</div>
											</div>
										);
									},
								)
							)}
						</div>
					)}

					{/* Reviews Tab */}
					{activeTab === "reviews" && (
						<div className="space-y-4">
							{/* Review Form */}
							{user && (
								<div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
									<h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
										<Star
											size={18}
											className="text-orange-500"
										/>
										Write a Review
									</h3>
									<StarRating
										rating={reviewForm.rating}
										size={28}
										interactive
										onChange={(r) =>
											setReviewForm((prev) => ({
												...prev,
												rating: r,
											}))
										}
									/>
									<textarea
										value={reviewForm.comment}
										onChange={(e) =>
											setReviewForm((prev) => ({
												...prev,
												comment: e.target.value,
											}))
										}
										placeholder="Share your experience with this business..."
										rows={3}
										className="w-full mt-3 border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
									/>
									<button
										onClick={handleSubmitReview}
										disabled={
											reviewForm.rating === 0 ||
											submittingReview
										}
										className="mt-2 bg-orange-500 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
									>
										{submittingReview
											? "Submitting..."
											: "Submit Review"}
									</button>
								</div>
							)}

							{/* Reviews List */}
							{reviews.length === 0 ? (
								<div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
									<Star
										size={48}
										className="text-gray-300 mx-auto mb-3"
									/>
									<p className="text-gray-500 font-medium">
										No reviews yet
									</p>
									<p className="text-sm text-gray-400 mt-1">
										Be the first to review this business!
									</p>
								</div>
							) : (
								<div className="space-y-3">
									{reviews.map((review) => (
										<div
											key={review._id}
											className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow"
										>
											<div className="flex items-start gap-3">
												<div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shrink-0">
													<span className="text-white font-bold text-sm">
														{review.userId?.fullName?.[0]?.toUpperCase() ||
															"U"}
													</span>
												</div>
												<div className="flex-1">
													<div className="flex flex-wrap items-center justify-between gap-2">
														<p className="font-semibold text-gray-900 text-sm">
															{review.userId
																?.fullName ||
																"User"}
														</p>
														<span className="text-xs text-gray-400">
															{review.createdAt
																? new Date(
																		review.createdAt,
																	).toLocaleDateString(
																		"en-KE",
																		{
																			day: "numeric",
																			month: "short",
																			year: "numeric",
																		},
																	)
																: "Recently"}
														</span>
													</div>
													<StarRating
														rating={review.rating}
														size={14}
														className="mt-1"
													/>
													{review.comment && (
														<p className="text-gray-700 text-sm mt-2 leading-relaxed">
															{review.comment}
														</p>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					)}

					{/* Info Tab */}
					{activeTab === "info" && (
						<div className="space-y-4">
							{/* About */}
							<div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
								<h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
									<Package
										size={16}
										className="text-orange-500"
									/>
									About
								</h3>
								<p className="text-gray-600 text-sm leading-relaxed">
									{business.description ||
										"No description available."}
								</p>
							</div>

							{/* Location Map - ADD THIS */}
							<div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
								<h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
									<MapPin
										size={16}
										className="text-orange-500"
									/>
									Location Map
								</h3>
								<SingleLocationMap
									business={business}
									height="250px"
								/>
							</div>

							{/* Contact & Location */}
							<div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
								<h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
									<MapPin
										size={16}
										className="text-orange-500"
									/>
									Contact & Location
								</h3>
								<div className="space-y-2.5">
									{business.location?.address && (
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<MapPin
												size={14}
												className="text-orange-500 shrink-0"
											/>
											<span>
												{business.location.address}
											</span>
										</div>
									)}
									{business.phone && (
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<Phone
												size={14}
												className="text-orange-500 shrink-0"
											/>
											<a
												href={`tel:${business.phone}`}
												className="hover:text-orange-500"
											>
												{business.phone}
											</a>
										</div>
									)}
									{business.email && (
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<Mail
												size={14}
												className="text-orange-500 shrink-0"
											/>
											<a
												href={`mailto:${business.email}`}
												className="hover:text-orange-500"
											>
												{business.email}
											</a>
										</div>
									)}
									{business.website && (
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<Globe
												size={14}
												className="text-orange-500 shrink-0"
											/>
											<a
												href={business.website}
												target="_blank"
												rel="noopener noreferrer"
												className="hover:text-orange-500"
											>
												{business.website}
											</a>
										</div>
									)}
								</div>
							</div>

							{/* Opening Hours */}
							<div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
								<h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
									<Clock
										size={16}
										className="text-orange-500"
									/>
									Opening Hours
								</h3>
								<div className="space-y-1.5">
									{days.map((day) => {
										const isToday = day === today;
										const isOpenDay =
											business.open_days?.includes(day) ||
											false;

										return (
											<div
												key={day}
												className={`flex items-center justify-between py-2 px-2 rounded-lg text-sm ${
													isToday
														? "bg-orange-50"
														: ""
												}`}
											>
												<span
													className={`font-medium ${isToday ? "text-orange-600" : "text-gray-700"}`}
												>
													{day}
													{isToday && " (Today)"}
												</span>
												<span
													className={
														isOpenDay
															? "text-gray-600"
															: "text-gray-400"
													}
												>
													{isOpenDay
														? `${business.opening_time || "N/A"} – ${business.closing_time || "N/A"}`
														: "Closed"}
												</span>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					)}
				</div>
			</section>
		</>
	);
}
