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
} from "lucide-react";
import { db } from "../lib/firebase.config";
import {
	collection,
	query,
	where,
	getDocs,
	getDoc,
	doc,
	addDoc,
	updateDoc,
	deleteDoc,
	orderBy,
	limit,
} from "firebase/firestore";
import { useAuth } from "../lib/context/AuthContext";
import { useCart } from "../lib/context/CartContext";
import StarRating from "../components/common/StarRating";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { increment } from "firebase/firestore";

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

	const { user } = useAuth();
	const { addItem } = useCart();

	useEffect(() => {
		if (!slug) return;

		const fetchBusiness = async () => {
			setLoading(true);
			try {
				console.log("Fetching business with slug:", slug);

				// Fetch business by slug - DON'T filter by status here
				const businessesQuery = query(
					collection(db, "businesses"),
					where("slug", "==", slug),
					limit(1),
				);
				const businessesSnapshot = await getDocs(businessesQuery);

				if (businessesSnapshot.empty) {
					console.log("No business found with slug:", slug);
					setLoading(false);
					return;
				}

				const businessDoc = businessesSnapshot.docs[0];
				const businessData = {
					id: businessDoc.id,
					...businessDoc.data(),
				};
				console.log(
					"Business found:",
					businessData.name,
					"Status:",
					businessData.status,
				);

				// Fetch category if exists
				if (businessData.category_id) {
					try {
						const categoryRef = doc(
							db,
							"categories",
							businessData.category_id,
						);
						const categoryDoc = await getDoc(categoryRef);
						if (categoryDoc.exists()) {
							businessData.categories = {
								id: categoryDoc.id,
								...categoryDoc.data(),
							};
						}
					} catch (catError) {
						console.error("Error fetching category:", catError);
					}
				}

				// Fetch owner profile
				if (businessData.owner_id) {
					try {
						const ownerRef = doc(
							db,
							"profiles",
							businessData.owner_id,
						);
						const ownerDoc = await getDoc(ownerRef);
						if (ownerDoc.exists()) {
							businessData.profiles = {
								id: ownerDoc.id,
								...ownerDoc.data(),
							};
						} else {
							businessData.profiles = {
								full_name: "Business Owner",
							};
						}
					} catch (profileError) {
						console.error(
							"Error fetching owner profile:",
							profileError,
						);
						businessData.profiles = { full_name: "Business Owner" };
					}
				}

				setBusiness(businessData);

				try {
					const businessRef = doc(db, "businesses", businessDoc.id);
					updateDoc(businessRef, {
						view_count: increment(1),
					}).catch((e) =>
						console.warn("View count update failed:", e.message),
					);
				} catch (updateError) {
					console.warn("View count update skipped");
				}

				// Fetch products (don't filter by available if not needed)
				try {
					const productsQuery = query(
						collection(db, "products_services"),
						where("business_id", "==", businessDoc.id),
						orderBy("sort_order"),
					);
					const productsSnapshot = await getDocs(productsQuery);
					const productsData = productsSnapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}));
					setProducts(productsData);
				} catch (prodError) {
					console.error("Error fetching products:", prodError);
					setProducts([]);
				}

				// Fetch reviews
				try {
					const reviewsQuery = query(
						collection(db, "reviews"),
						where("business_id", "==", businessDoc.id),
						orderBy("created_at", "desc"),
					);
					const reviewsSnapshot = await getDocs(reviewsQuery);
					const reviewsData = [];

					for (const reviewDoc of reviewsSnapshot.docs) {
						const reviewData = {
							id: reviewDoc.id,
							...reviewDoc.data(),
						};

						// Fetch user profile for review
						if (reviewData.user_id) {
							try {
								const userRef = doc(
									db,
									"profiles",
									reviewData.user_id,
								);
								const userDoc = await getDoc(userRef);
								if (userDoc.exists()) {
									reviewData.profiles = {
										id: userDoc.id,
										...userDoc.data(),
									};
								}
							} catch (userError) {
								console.error(
									"Error fetching review user profile:",
									userError,
								);
							}
						}

						reviewsData.push(reviewData);
					}
					setReviews(reviewsData);
				} catch (revError) {
					console.error("Error fetching reviews:", revError);
					setReviews([]);
				}

				// Check if favorited
				if (user) {
					try {
						const favoritesQuery = query(
							collection(db, "favorites"),
							where("user_id", "==", user.uid),
							where("business_id", "==", businessDoc.id),
							limit(1),
						);
						const favoritesSnapshot = await getDocs(favoritesQuery);
						setIsFavorited(!favoritesSnapshot.empty);
					} catch (favError) {
						console.error("Error checking favorite:", favError);
						setIsFavorited(false);
					}
				}
			} catch (error) {
				console.error("Error fetching business:", error);
				console.error("Error code:", error.code);
				console.error("Error message:", error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchBusiness();
	}, [slug, user]);

	const toggleFavorite = async () => {
		if (!user || !business) {
			console.log("Cannot toggle favorite: No user or business", {
				user: !!user,
				business: !!business,
			});
			return;
		}

		try {
			console.log(
				"Toggling favorite for user:",
				user.uid,
				"business:",
				business.id,
			);

			if (isFavorited) {
				// Find and delete favorite
				const favoritesQuery = query(
					collection(db, "favorites"),
					where("user_id", "==", user.uid),
					where("business_id", "==", business.id),
					limit(1),
				);
				const favoritesSnapshot = await getDocs(favoritesQuery);
				if (!favoritesSnapshot.empty) {
					const favDoc = favoritesSnapshot.docs[0];
					await deleteDoc(doc(db, "favorites", favDoc.id));
					console.log("Favorite removed");
				}
			} else {
				// Add favorite
				await addDoc(collection(db, "favorites"), {
					user_id: user.uid,
					business_id: business.id,
					created_at: new Date().toISOString(),
				});
				console.log("Favorite added");
			}
			setIsFavorited(!isFavorited);
		} catch (error) {
			console.error("Error toggling favorite:", error);
			console.error("Error code:", error.code);
			console.error("Error message:", error.message);
			alert("Could not save favorite. Please try again.");
		}
	};

	const handleAddToCart = (product) => {
		if (!business) return;
		addItem(product, business.id, business.name);
		setAddedItems((prev) => new Set([...prev, product.id]));
		setTimeout(() => {
			setAddedItems((prev) => {
				const newSet = new Set(prev);
				newSet.delete(product.id);
				return newSet;
			});
		}, 2000);
	};

	const handleSubmitReview = async () => {
		if (!user || !business || reviewForm.rating === 0) return;
		setSubmittingReview(true);

		try {
			// Check if user already reviewed this business
			const existingReviewQuery = query(
				collection(db, "reviews"),
				where("business_id", "==", business.id),
				where("user_id", "==", user.uid),
				limit(1),
			);
			const existingReviewSnapshot = await getDocs(existingReviewQuery);

			let reviewData;
			if (!existingReviewSnapshot.empty) {
				// Update existing review
				const reviewId = existingReviewSnapshot.docs[0].id;
				const reviewRef = doc(db, "reviews", reviewId);
				await updateDoc(reviewRef, {
					rating: reviewForm.rating,
					comment: reviewForm.comment,
					updated_at: new Date().toISOString(),
				});
				reviewData = {
					id: reviewId,
					...existingReviewSnapshot.docs[0].data(),
					...reviewForm,
				};
			} else {
				// Create new review
				const docRef = await addDoc(collection(db, "reviews"), {
					business_id: business.id,
					user_id: user.uid,
					rating: reviewForm.rating,
					comment: reviewForm.comment,
					created_at: new Date().toISOString(),
				});
				reviewData = {
					id: docRef.id,
					...reviewForm,
					user_id: user.uid,
				};
			}

			// Fetch user profile for the new review
			try {
				const userRef = doc(db, "profiles", user.uid);
				const userDoc = await getDoc(userRef);
				if (userDoc.exists()) {
					reviewData.profiles = { id: userDoc.id, ...userDoc.data() };
				}
			} catch (profileError) {
				console.error(
					"Error fetching user profile for review:",
					profileError,
				);
			}

			// Update reviews list
			setReviews((prev) => {
				const filtered = prev.filter((r) => r.user_id !== user.uid);
				return [reviewData, ...filtered];
			});

			setReviewForm({ rating: 0, comment: "" });
		} catch (error) {
			console.error("Error submitting review:", error);
			alert("Failed to submit review. Please try again.");
		} finally {
			setSubmittingReview(false);
		}
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
			<div className="text-center py-20">
				<p className="text-gray-500 text-lg">Business not found</p>
				<Link
					to="/discover"
					className="mt-4 inline-block text-orange-500 font-medium"
				>
					Browse businesses
				</Link>
			</div>
		);
	}

	const coverImage =
		business.cover_image ||
		`https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800`;

	return (
		<div className="max-w-3xl mx-auto">
			{/* Cover */}
			<div className="relative h-52 md:h-72">
				<img
					src={coverImage}
					alt={business.name}
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
				<Link
					to="/discover"
					className="absolute top-4 left-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
				>
					<ChevronLeft size={20} className="text-gray-700" />
				</Link>
				{user && (
					<button
						onClick={toggleFavorite}
						className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
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
				<div className="absolute bottom-4 left-4 right-4">
					<h1 className="text-2xl font-extrabold text-white">
						{business.name}
					</h1>
					{business.tagline && (
						<p className="text-white/80 text-sm">
							{business.tagline}
						</p>
					)}
				</div>
			</div>

			{/* Rest of the component remains the same */}
			<div className="px-4 pb-8">
				{/* Quick Info */}
				<div className="bg-white rounded-2xl -mt-6 relative shadow-md p-4 mb-4">
					<div className="flex items-start justify-between gap-4">
						<div className="space-y-1.5">
							{business.categories && (
								<span
									className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full text-white"
									style={{
										backgroundColor:
											business.categories.color ||
											"#f97316",
									}}
								>
									{business.categories.name}
								</span>
							)}
							<div className="flex items-center gap-2">
								<StarRating
									rating={business.average_rating || 0}
									size={16}
								/>
								<span className="font-bold text-gray-800">
									{business.average_rating > 0
										? business.average_rating.toFixed(1)
										: "No ratings"}
								</span>
								<span className="text-gray-400 text-sm">
									({business.review_count || 0} reviews)
								</span>
							</div>
							<div className="flex items-center gap-1.5 text-sm text-gray-500">
								<MapPin size={14} className="text-orange-500" />
								<span>
									{business.location_label}
									{business.floor_unit
										? `, ${business.floor_unit}`
										: ""}
								</span>
							</div>
							<div className="flex items-center gap-1.5 text-sm text-gray-500">
								<Clock size={14} className="text-green-500" />
								<span>
									{business.opening_time} –{" "}
									{business.closing_time}
								</span>
							</div>
						</div>
						<div className="flex flex-col gap-2">
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
					{business.delivery_available && (
						<div className="mt-3 flex items-center gap-2 bg-blue-50 rounded-xl p-2.5">
							<ShoppingCart size={16} className="text-blue-500" />
							<span className="text-sm text-blue-700 font-medium">
								Delivery available · KES{" "}
								{business.delivery_fee || 0} fee
							</span>
							{business.min_order > 0 && (
								<span className="text-xs text-blue-500">
									Min order: KES {business.min_order}
								</span>
							)}
						</div>
					)}
				</div>

				{/* Tabs */}
				<div className="flex gap-1 bg-gray-100 rounded-2xl p-1 mb-4">
					{["menu", "reviews", "info"].map((tab) => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
								activeTab === tab
									? "bg-white text-gray-900 shadow-sm"
									: "text-gray-500 hover:text-gray-700"
							}`}
						>
							{tab === "menu" ? "Menu & Services" : tab}
						</button>
					))}
				</div>

				{/* Tab Content */}
				{activeTab === "menu" && (
					<div className="space-y-3">
						{products.length === 0 ? (
							<div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
								<p className="text-gray-500">
									No products or services listed yet.
								</p>
							</div>
						) : (
							<>
								{["product", "service"].map((type) => {
									const items = products.filter(
										(p) => p.type === type,
									);
									if (items.length === 0) return null;
									return (
										<div key={type}>
											<h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide flex items-center gap-2 mb-2">
												{type === "product" ? (
													<Package size={14} />
												) : (
													<Wrench size={14} />
												)}
												{type === "product"
													? "Products"
													: "Services"}
											</h3>
											<div className="space-y-2">
												{items.map((item) => (
													<div
														key={item.id}
														className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3"
													>
														{item.image_url && (
															<img
																src={
																	item.image_url
																}
																alt={item.name}
																className="w-14 h-14 rounded-lg object-cover shrink-0"
															/>
														)}
														<div className="flex-1 min-w-0">
															<p className="font-semibold text-gray-900 text-sm">
																{item.name}
															</p>
															{item.description && (
																<p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
																	{
																		item.description
																	}
																</p>
															)}
															<p className="font-bold text-orange-500 text-base mt-1">
																KES{" "}
																{item.price.toLocaleString()}
															</p>
														</div>
														<button
															onClick={() =>
																handleAddToCart(
																	item,
																)
															}
															className={`shrink-0 p-2 rounded-xl transition-all ${
																addedItems.has(
																	item.id,
																)
																	? "bg-green-500 text-white"
																	: "bg-orange-500 text-white hover:bg-orange-600"
															}`}
														>
															{addedItems.has(
																item.id,
															) ? (
																<Check
																	size={18}
																/>
															) : (
																<Plus
																	size={18}
																/>
															)}
														</button>
													</div>
												))}
											</div>
										</div>
									);
								})}
							</>
						)}
					</div>
				)}

				{activeTab === "reviews" && (
					<div className="space-y-4">
						{user && (
							<div className="bg-white rounded-2xl border border-gray-100 p-4">
								<h3 className="font-bold text-gray-900 mb-3">
									Leave a Review
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
									placeholder="Share your experience..."
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
						{reviews.length === 0 ? (
							<div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
								<Star
									size={32}
									className="text-gray-300 mx-auto mb-2"
								/>
								<p className="text-gray-500">
									No reviews yet. Be the first!
								</p>
							</div>
						) : (
							reviews.map((review) => (
								<div
									key={review.id}
									className="bg-white rounded-2xl border border-gray-100 p-4"
								>
									<div className="flex items-center gap-2 mb-2">
										<div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
											<span className="text-orange-600 font-bold text-sm">
												{review.profiles?.full_name?.[0]?.toUpperCase() ||
													"U"}
											</span>
										</div>
										<div>
											<p className="font-semibold text-gray-900 text-sm">
												{review.profiles?.full_name ||
													"User"}
											</p>
											<StarRating
												rating={review.rating}
												size={12}
											/>
										</div>
										<span className="ml-auto text-xs text-gray-400">
											{review.created_at
												? new Date(
														review.created_at,
													).toLocaleDateString()
												: "Just now"}
										</span>
									</div>
									{review.comment && (
										<p className="text-gray-700 text-sm">
											{review.comment}
										</p>
									)}
									{review.owner_reply && (
										<div className="mt-2 bg-orange-50 rounded-xl p-3">
											<p className="text-xs font-semibold text-orange-700 mb-1">
												Owner replied:
											</p>
											<p className="text-sm text-gray-700">
												{review.owner_reply}
											</p>
										</div>
									)}
								</div>
							))
						)}
					</div>
				)}

				{activeTab === "info" && (
					<div className="space-y-3">
						<div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
							<h3 className="font-bold text-gray-900">About</h3>
							<p className="text-gray-600 text-sm leading-relaxed">
								{business.description ||
									"No description available."}
							</p>
						</div>
						<div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
							<h3 className="font-bold text-gray-900">
								Contact & Location
							</h3>
							{[
								{
									icon: MapPin,
									label: business.address,
									show: !!business.address,
								},
								{
									icon: Phone,
									label: business.phone,
									show: !!business.phone,
								},
								{
									icon: Mail,
									label: business.email,
									show: !!business.email,
								},
								{
									icon: Globe,
									label: business.website,
									show: !!business.website,
								},
							]
								.filter((i) => i.show)
								.map(({ icon: Icon, label }) => (
									<div
										key={label}
										className="flex items-center gap-2 text-sm text-gray-600"
									>
										<Icon
											size={15}
											className="text-orange-500 shrink-0"
										/>
										<span>{label}</span>
									</div>
								))}
						</div>
						<div className="bg-white rounded-2xl border border-gray-100 p-4">
							<h3 className="font-bold text-gray-900 mb-3">
								Opening Hours
							</h3>
							<div className="grid grid-cols-2 gap-y-1.5">
								{days.map((day) => {
									const isToday = day === today;
									const isOpen =
										business.open_days?.includes(day) ||
										false;
									return (
										<div
											key={day}
											className={`flex items-center justify-between col-span-2 py-1 px-2 rounded-lg text-sm ${isToday ? "bg-orange-50" : ""}`}
										>
											<span
												className={`font-medium ${isToday ? "text-orange-600" : "text-gray-700"}`}
											>
												{day}
												{isToday ? " (Today)" : ""}
											</span>
											<span
												className={
													isOpen
														? "text-gray-600"
														: "text-gray-400"
												}
											>
												{isOpen
													? `${business.opening_time} – ${business.closing_time}`
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
		</div>
	);
}
