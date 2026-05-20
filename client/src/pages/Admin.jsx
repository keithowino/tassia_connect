import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	ShieldCheck,
	CheckCircle,
	XCircle,
	Eye,
	RefreshCw,
	Store,
	Users,
	Star,
	MessageSquare,
} from "lucide-react";
import { db } from "../lib/firebase.config";
import {
	collection,
	query,
	orderBy,
	getDocs,
	getCountFromServer,
	doc,
	updateDoc,
	deleteDoc,
	getDoc,
	where,
} from "firebase/firestore";
import { useAuth } from "../lib/context/AuthContext";
import LoadingSpinner from "../components/common/LoadingSpinner";
import MetaDataInsert from "../lib/MetaDataInsert";

export default function Admin() {
	const { profile } = useAuth();
	const navigate = useNavigate();
	const [tab, setTab] = useState("businesses");
	const [businesses, setBusinesses] = useState([]);
	const [reviews, setReviews] = useState([]);
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState({
		businesses: 0,
		users: 0,
		orders: 0,
		reviews: 0,
	});

	useEffect(() => {
		if (profile && profile.role !== "admin") {
			navigate("/");
			return;
		}
		if (!profile) return;
		fetchAll();
	}, [profile, navigate]);

	const fetchAll = async () => {
		setLoading(true);

		try {
			// Fetch businesses with related data
			const businessesQuery = query(
				collection(db, "businesses"),
				orderBy("created_at", "desc"),
			);
			const businessesSnapshot = await getDocs(businessesQuery);
			const businessesData = [];

			for (const bizDoc of businessesSnapshot.docs) {
				const bizData = { id: bizDoc.id, ...bizDoc.data() };

				// Fetch category if exists - FIXED: Use getDoc with document ID
				if (bizData.category_id) {
					const categoryRef = doc(
						db,
						"categories",
						bizData.category_id,
					);
					const categoryDoc = await getDoc(categoryRef);
					if (categoryDoc.exists()) {
						bizData.categories = {
							id: categoryDoc.id,
							...categoryDoc.data(),
						};
					}
				}

				// Fetch owner profile - FIXED: Use getDoc with owner_id as document ID
				if (bizData.owner_id) {
					const ownerRef = doc(db, "profiles", bizData.owner_id);
					const ownerDoc = await getDoc(ownerRef);
					if (ownerDoc.exists()) {
						bizData.profiles = ownerDoc.data();
					}
				}

				businessesData.push(bizData);
			}
			setBusinesses(businessesData);

			// Fetch reviews with related data
			const reviewsQuery = query(
				collection(db, "reviews"),
				orderBy("created_at", "desc"),
			);
			const reviewsSnapshot = await getDocs(reviewsQuery);
			const reviewsData = [];

			for (const reviewDoc of reviewsSnapshot.docs) {
				const reviewData = { id: reviewDoc.id, ...reviewDoc.data() };

				// Fetch user profile - FIXED: Use getDoc with user_id as document ID
				if (reviewData.user_id) {
					const userRef = doc(db, "profiles", reviewData.user_id);
					const userDoc = await getDoc(userRef);
					if (userDoc.exists()) {
						reviewData.profiles = userDoc.data();
					}
				}

				// Fetch business name - FIXED: Use getDoc with business_id as document ID
				if (reviewData.business_id) {
					const businessRef = doc(
						db,
						"businesses",
						reviewData.business_id,
					);
					const businessDoc = await getDoc(businessRef);
					if (businessDoc.exists()) {
						reviewData.businesses = {
							name: businessDoc.data().name,
						};
					}
				}

				reviewsData.push(reviewData);
			}
			setReviews(reviewsData);

			// Fetch community posts with related data
			const postsQuery = query(
				collection(db, "community_posts"),
				orderBy("created_at", "desc"),
			);
			const postsSnapshot = await getDocs(postsQuery);
			const postsData = [];

			for (const postDoc of postsSnapshot.docs) {
				const postData = { id: postDoc.id, ...postDoc.data() };

				// Fetch user profile - FIXED: Use getDoc with author_id (not user_id)
				const authorId = postData.author_id || postData.user_id;
				if (authorId) {
					const userRef = doc(db, "profiles", authorId);
					const userDoc = await getDoc(userRef);
					if (userDoc.exists()) {
						postData.profiles = userDoc.data();
					}
				}

				postsData.push(postData);
			}
			setPosts(postsData);

			// Get counts - Note: getCountFromServer doesn't work with where clauses in some Firebase versions
			// Alternative approach for counts:
			const [
				businessesSnapshot_all,
				usersSnapshot,
				ordersSnapshot,
				reviewsSnapshot_all,
			] = await Promise.all([
				getDocs(
					query(
						collection(db, "businesses"),
						where("status", "==", "approved"),
					),
				),
				getDocs(collection(db, "profiles")),
				getDocs(collection(db, "orders")),
				getDocs(collection(db, "reviews")),
			]);

			setStats({
				businesses: businessesSnapshot_all.size,
				users: usersSnapshot.size,
				orders: ordersSnapshot.size,
				reviews: reviewsSnapshot_all.size,
			});
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	const updateBusinessStatus = async (id, status) => {
		try {
			const businessRef = doc(db, "businesses", id);
			await updateDoc(businessRef, { status });
			setBusinesses((prev) =>
				prev.map((b) => (b.id === id ? { ...b, status: status } : b)),
			);
		} catch (error) {
			console.error("Error updating business status:", error);
		}
	};

	const togglePin = async (postId, pinned) => {
		try {
			const postRef = doc(db, "community_posts", postId);
			await updateDoc(postRef, { pinned: !pinned });
			setPosts((prev) =>
				prev.map((p) =>
					p.id === postId ? { ...p, pinned: !pinned } : p,
				),
			);
		} catch (error) {
			console.error("Error toggling pin:", error);
		}
	};

	const deleteReview = async (reviewId) => {
		if (!window.confirm("Delete this review?")) return;
		try {
			const reviewRef = doc(db, "reviews", reviewId);
			await deleteDoc(reviewRef);
			setReviews((prev) => prev.filter((r) => r.id !== reviewId));
		} catch (error) {
			console.error("Error deleting review:", error);
		}
	};

	const STAT_ITEMS = [
		{
			icon: <Store size={20} className="text-orange-500" />,
			label: "Active Businesses",
			value: stats.businesses,
		},
		{
			icon: <Users size={20} className="text-blue-500" />,
			label: "Total Users",
			value: stats.users,
		},
		{
			icon: <Star size={20} className="text-amber-500" />,
			label: "Total Reviews",
			value: stats.reviews,
		},
		{
			icon: <MessageSquare size={20} className="text-green-500" />,
			label: "Total Orders",
			value: stats.orders,
		},
	];

	if (!profile || profile.role !== "admin") return null;

	return (
		<>
			<MetaDataInsert title="Admin" />
			<section className="max-w-4xl mx-auto px-4 py-4 space-y-4">
				<div className="flex items-center justify-between">
					<h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
						<ShieldCheck size={22} className="text-orange-500" />{" "}
						Admin Panel
					</h1>
					<button
						onClick={fetchAll}
						className="p-2 rounded-full hover:bg-gray-100 transition-colors"
					>
						<RefreshCw size={18} className="text-gray-500" />
					</button>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
					{STAT_ITEMS.map((s) => (
						<div
							key={s.label}
							className="bg-white rounded-2xl border border-gray-100 p-3 text-center"
						>
							<div className="flex justify-center mb-1">
								{s.icon}
							</div>
							<p className="font-extrabold text-gray-900 text-xl">
								{s.value}
							</p>
							<p className="text-xs text-gray-500">{s.label}</p>
						</div>
					))}
				</div>

				<div className="flex gap-1 bg-gray-100 rounded-2xl p-1">
					{["businesses", "reviews", "community"].map((t) => (
						<button
							key={t}
							onClick={() => setTab(t)}
							className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
						>
							{t}
						</button>
					))}
				</div>

				{loading ? (
					<div className="flex justify-center py-12">
						<LoadingSpinner size="lg" />
					</div>
				) : (
					<>
						{tab === "businesses" && (
							<div className="space-y-3">
								{businesses.map((biz) => (
									<div
										key={biz.id}
										className="bg-white rounded-2xl border border-gray-100 p-4"
									>
										<div className="flex items-start justify-between gap-3">
											<div className="flex-1 min-w-0">
												<p className="font-bold text-gray-900">
													{biz.name}
												</p>
												<p className="text-xs text-gray-500">
													{biz.categories?.name ||
														"Uncategorized"}{" "}
													· {biz.location_label}
												</p>
												<p className="text-xs text-gray-400 mt-0.5">
													Owner:{" "}
													{biz.profiles?.full_name ||
														biz.profiles?.name ||
														"Unknown"}{" "}
													·{" "}
													{biz.created_at
														? new Date(
																biz.created_at,
															).toLocaleDateString()
														: "Unknown date"}
												</p>
												<div className="flex items-center gap-2 mt-1">
													<Eye
														size={12}
														className="text-gray-400"
													/>
													<span className="text-xs text-gray-400">
														{biz.view_count || 0}{" "}
														views
													</span>
												</div>
											</div>
											<div className="flex flex-col gap-1.5 shrink-0">
												<span
													className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
														biz.status ===
														"approved"
															? "bg-green-100 text-green-700"
															: biz.status ===
																  "pending"
																? "bg-yellow-100 text-yellow-700"
																: "bg-red-100 text-red-600"
													}`}
												>
													{biz.status || "pending"}
												</span>
												{biz.status !== "approved" && (
													<button
														onClick={() =>
															updateBusinessStatus(
																biz.id,
																"approved",
															)
														}
														className="flex items-center gap-0.5 text-xs text-green-600 font-medium hover:text-green-800"
													>
														<CheckCircle
															size={13}
														/>{" "}
														Approve
													</button>
												)}
												{biz.status !== "rejected" && (
													<button
														onClick={() =>
															updateBusinessStatus(
																biz.id,
																"rejected",
															)
														}
														className="flex items-center gap-0.5 text-xs text-red-500 font-medium hover:text-red-700"
													>
														<XCircle size={13} />{" "}
														Reject
													</button>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						)}

						{tab === "reviews" && (
							<div className="space-y-3">
								{reviews.map((review) => (
									<div
										key={review.id}
										className="bg-white rounded-2xl border border-gray-100 p-4"
									>
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<p className="font-semibold text-gray-900 text-sm">
													{review.profiles
														?.full_name ||
														review.profiles?.name ||
														"Anonymous User"}
												</p>
												<p className="text-xs text-gray-500">
													on{" "}
													{review.businesses?.name ||
														"Unknown Business"}
												</p>
												<div className="flex items-center gap-1 mt-1">
													{"★".repeat(review.rating)}
													{"☆".repeat(
														5 - review.rating,
													)}
												</div>
												{review.comment && (
													<p className="text-sm text-gray-600 mt-1">
														{review.comment}
													</p>
												)}
												<p className="text-xs text-gray-400 mt-1">
													{review.created_at
														? new Date(
																review.created_at,
															).toLocaleDateString()
														: "Unknown date"}
												</p>
											</div>
											<button
												onClick={() =>
													deleteReview(review.id)
												}
												className="text-xs text-red-500 hover:text-red-700 font-medium ml-2"
											>
												Delete
											</button>
										</div>
									</div>
								))}
							</div>
						)}

						{tab === "community" && (
							<div className="space-y-3">
								{posts.map((post) => (
									<div
										key={post.id}
										className="bg-white rounded-2xl border border-gray-100 p-4"
									>
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<p className="font-bold text-gray-900 text-sm">
													{post.title}
												</p>
												<p className="text-xs text-gray-500">
													{post.profiles?.full_name ||
														post.profiles?.name ||
														"Anonymous"}{" "}
													·{" "}
													{post.created_at
														? new Date(
																post.created_at,
															).toLocaleDateString()
														: "Unknown date"}
												</p>
												<p className="text-sm text-gray-600 mt-1 line-clamp-2">
													{post.content}
												</p>
											</div>
											<button
												onClick={() =>
													togglePin(
														post.id,
														post.pinned,
													)
												}
												className={`ml-2 text-xs font-medium shrink-0 ${post.pinned ? "text-orange-500 hover:text-orange-700" : "text-gray-400 hover:text-orange-500"}`}
											>
												{post.pinned ? "Unpin" : "Pin"}
											</button>
										</div>
									</div>
								))}
							</div>
						)}
					</>
				)}
			</section>
		</>
	);
}
