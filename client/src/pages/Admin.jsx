// // former
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
// 	ShieldCheck,
// 	CheckCircle,
// 	XCircle,
// 	Eye,
// 	RefreshCw,
// 	Store,
// 	Users,
// 	Star,
// 	MessageSquare,
// 	AlertCircle,
// } from "lucide-react";
// import { useAuth } from "../lib/context/AuthContext";
// import { businessAPI, reviewAPI, communityAPI, adminAPI } from "../lib/api";
// import LoadingSpinner from "../components/common/LoadingSpinner";
// import MetaDataInsert from "../lib/MetaDataInsert";

// export default function Admin() {
// 	const { user, profile } = useAuth();
// 	const navigate = useNavigate();
// 	const [tab, setTab] = useState("businesses");
// 	const [businesses, setBusinesses] = useState([]);
// 	const [reviews, setReviews] = useState([]);
// 	const [posts, setPosts] = useState([]);
// 	const [users, setUsers] = useState([]);
// 	const [loading, setLoading] = useState(true);
// 	const [stats, setStats] = useState({
// 		businesses: 0,
// 		users: 0,
// 		orders: 0,
// 		reviews: 0,
// 		posts: 0,
// 	});
// 	const [error, setError] = useState(null);

// 	// Check admin access
// 	useEffect(() => {
// 		const userRole = profile?.role || user?.role;
// 		if (userRole && userRole !== "admin") {
// 			navigate("/");
// 			return;
// 		}
// 		if (!user) {
// 			navigate("/auth");
// 			return;
// 		}
// 	}, [profile, user, navigate]);

// 	// Fetch all admin data
// 	useEffect(() => {
// 		if (profile?.role === "admin" || user?.role === "admin") {
// 			fetchAllData();
// 		}
// 	}, [profile, user]);

// 	const fetchAllData = async () => {
// 		setLoading(true);
// 		setError(null);

// 		try {
// 			const [businessesRes, reviewsRes, postsRes, usersRes, statsRes] =
// 				await Promise.all([
// 					businessAPI.getAll().catch((err) => ({ data: [] })),
// 					reviewAPI.getAll().catch((err) => ({ data: [] })),
// 					communityAPI.getAll().catch((err) => ({ data: [] })),
// 					adminAPI.getAllUsers().catch((err) => ({ data: [] })),
// 					adminAPI.getStats().catch((err) => ({ data: {} })),
// 				]);

// 			// Safely extract posts data
// 			const rawPostsData = postsRes.data;
// 			let postsArray = [];

// 			if (rawPostsData) {
// 				if (Array.isArray(rawPostsData)) {
// 					postsArray = rawPostsData;
// 				} else if (
// 					rawPostsData.posts &&
// 					Array.isArray(rawPostsData.posts)
// 				) {
// 					postsArray = rawPostsData.posts;
// 				} else if (
// 					rawPostsData.data &&
// 					Array.isArray(rawPostsData.data)
// 				) {
// 					postsArray = rawPostsData.data;
// 				}
// 			}

// 			setBusinesses(
// 				Array.isArray(businessesRes.data) ? businessesRes.data : [],
// 			);
// 			setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
// 			setPosts(postsArray);
// 			setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);

// 			const statsData = statsRes.data;
// 			setStats({
// 				businesses:
// 					statsData.totalBusinesses ||
// 					businessesRes.data?.length ||
// 					0,
// 				users: statsData.totalUsers || usersRes.data?.length || 0,
// 				orders: statsData.totalOrders || 0,
// 				reviews: statsData.totalReviews || reviewsRes.data?.length || 0,
// 				posts: statsData.totalPosts || postsArray.length || 0,
// 			});
// 		} catch (error) {
// 			console.error("Error fetching admin data:", error);
// 			setError("Failed to load admin data. Please try again.");
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	const updateBusinessStatus = async (businessId, status) => {
// 		try {
// 			await businessAPI.updateStatus(businessId, { status });
// 			// Update local state
// 			setBusinesses((prev) =>
// 				prev.map((b) =>
// 					b._id === businessId
// 						? { ...b, status, isActive: status === "approved" }
// 						: b,
// 				),
// 			);
// 		} catch (error) {
// 			console.error("Error updating business status:", error);
// 			alert(
// 				error.response?.data?.message ||
// 					"Failed to update business status",
// 			);
// 		}
// 	};

// 	const togglePinPost = async (postId, currentPinned) => {
// 		try {
// 			await communityAPI.togglePin(postId);
// 			setPosts((prev) =>
// 				prev.map((p) =>
// 					p._id === postId ? { ...p, pinned: !currentPinned } : p,
// 				),
// 			);
// 		} catch (error) {
// 			console.error("Error toggling pin:", error);
// 			alert(error.response?.data?.message || "Failed to update post");
// 		}
// 	};

// 	const deleteReview = async (reviewId) => {
// 		if (!window.confirm("Are you sure you want to delete this review?"))
// 			return;

// 		try {
// 			await reviewAPI.delete(reviewId);
// 			setReviews((prev) => prev.filter((r) => r._id !== reviewId));
// 			setStats((prev) => ({ ...prev, reviews: prev.reviews - 1 }));
// 		} catch (error) {
// 			console.error("Error deleting review:", error);
// 			alert(error.response?.data?.message || "Failed to delete review");
// 		}
// 	};

// 	const deletePost = async (postId) => {
// 		if (!window.confirm("Are you sure you want to delete this post?"))
// 			return;

// 		try {
// 			await communityAPI.delete(postId);
// 			setPosts((prev) => prev.filter((p) => p._id !== postId));
// 			setStats((prev) => ({ ...prev, posts: prev.posts - 1 }));
// 		} catch (error) {
// 			console.error("Error deleting post:", error);
// 			alert(error.response?.data?.message || "Failed to delete post");
// 		}
// 	};

// 	const formatDate = (dateString) => {
// 		if (!dateString) return "Unknown date";
// 		const date = new Date(dateString);
// 		const now = new Date();
// 		const diffTime = Math.abs(now - date);
// 		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

// 		if (diffDays === 1) return "Yesterday";
// 		if (diffDays < 7) return `${diffDays} days ago`;
// 		return date.toLocaleDateString("en-KE", {
// 			day: "numeric",
// 			month: "short",
// 			year: "numeric",
// 		});
// 	};

// 	const STAT_ITEMS = [
// 		{
// 			icon: <Store size={20} className="text-orange-500" />,
// 			label: "Businesses",
// 			value: stats.businesses,
// 		},
// 		{
// 			icon: <Users size={20} className="text-blue-500" />,
// 			label: "Total Users",
// 			value: stats.users,
// 		},
// 		{
// 			icon: <Star size={20} className="text-amber-500" />,
// 			label: "Reviews",
// 			value: stats.reviews,
// 		},
// 		{
// 			icon: <MessageSquare size={20} className="text-green-500" />,
// 			label: "Community Posts",
// 			value: stats.posts,
// 		},
// 	];

// 	// Check admin access
// 	const isAdmin = profile?.role === "admin" || user?.role === "admin";
// 	if (!isAdmin) return null;

// 	return (
// 		<>
// 			<MetaDataInsert
// 				title="Admin Panel"
// 				description="Administrative dashboard for managing businesses, users, reviews, and community content."
// 				keywords="admin, moderation, business approval"
// 			/>
// 			<section className="max-w-4xl mx-auto px-4 py-4 space-y-4 mb-20">
// 				{/* Header */}
// 				<div className="flex items-center justify-between">
// 					<h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
// 						<ShieldCheck size={22} className="text-orange-500" />
// 						Admin Panel
// 					</h1>
// 					<button
// 						onClick={fetchAllData}
// 						className="p-2 rounded-full hover:bg-gray-100 transition-colors"
// 						aria-label="Refresh data"
// 					>
// 						<RefreshCw size={18} className="text-gray-500" />
// 					</button>
// 				</div>

// 				{/* Error Message */}
// 				{error && (
// 					<div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
// 						<AlertCircle size={16} className="text-red-500" />
// 						<p className="text-sm text-red-600 flex-1">{error}</p>
// 						<button
// 							onClick={() => setError(null)}
// 							className="text-red-400 hover:text-red-600"
// 						>
// 							✕
// 						</button>
// 					</div>
// 				)}

// 				{/* Stats Grid */}
// 				<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
// 					{STAT_ITEMS.map((s) => (
// 						<div
// 							key={s.label}
// 							className="bg-white rounded-2xl border border-gray-100 p-3 text-center shadow-sm hover:shadow-md transition-shadow"
// 						>
// 							<div className="flex justify-center mb-1">
// 								{s.icon}
// 							</div>
// 							<p className="font-extrabold text-gray-900 text-xl">
// 								{s.value}
// 							</p>
// 							<p className="text-xs text-gray-500">{s.label}</p>
// 						</div>
// 					))}
// 				</div>

// 				{/* Tab Navigation */}
// 				<div className="flex gap-1 bg-gray-100 rounded-2xl p-1">
// 					{[
// 						{ id: "businesses", label: "Businesses", icon: Store },
// 						{ id: "reviews", label: "Reviews", icon: Star },
// 						{
// 							id: "community",
// 							label: "Community",
// 							icon: MessageSquare,
// 						},
// 						{ id: "users", label: "Users", icon: Users },
// 					].map((t) => (
// 						<button
// 							key={t.id}
// 							onClick={() => setTab(t.id)}
// 							className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all flex items-center justify-center gap-1 ${
// 								tab === t.id
// 									? "bg-white text-gray-900 shadow-sm"
// 									: "text-gray-500 hover:text-gray-700"
// 							}`}
// 						>
// 							<t.icon size={14} />
// 							{t.label}
// 						</button>
// 					))}
// 				</div>

// 				{/* Content */}
// 				{loading ? (
// 					<div className="flex justify-center py-12">
// 						<LoadingSpinner size="lg" />
// 					</div>
// 				) : (
// 					<>
// 						{/* Businesses Tab */}
// 						{tab === "businesses" && (
// 							<div className="space-y-3">
// 								{businesses.length === 0 ? (
// 									<div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
// 										<Store
// 											size={40}
// 											className="text-gray-300 mx-auto mb-3"
// 										/>
// 										<p className="text-gray-500">
// 											No businesses found
// 										</p>
// 									</div>
// 								) : (
// 									businesses.map((biz) => (
// 										<div
// 											key={biz._id}
// 											className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition-shadow"
// 										>
// 											<div className="flex items-start justify-between gap-3">
// 												<div className="flex-1 min-w-0">
// 													<p className="font-bold text-gray-900">
// 														{biz.businessName}
// 													</p>
// 													<p className="text-xs text-gray-500">
// 														{biz.category ||
// 															"Uncategorized"}{" "}
// 														•{" "}
// 														{biz.location
// 															?.address ||
// 															"No location"}
// 													</p>
// 													<p className="text-xs text-gray-400 mt-0.5">
// 														Owner:{" "}
// 														{biz.ownerId
// 															?.fullName ||
// 															"Unknown"}{" "}
// 														• Created:{" "}
// 														{formatDate(
// 															biz.createdAt,
// 														)}
// 													</p>
// 													<div className="flex items-center gap-2 mt-1">
// 														<Eye
// 															size={12}
// 															className="text-gray-400"
// 														/>
// 														<span className="text-xs text-gray-400">
// 															Views:{" "}
// 															{biz.viewCount || 0}
// 														</span>
// 													</div>
// 												</div>

// 												<div className="flex flex-col gap-1.5 shrink-0">
// 													<span
// 														className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
// 															biz.isVerified
// 																? "bg-green-100 text-green-700"
// 																: biz.isActive
// 																	? "bg-yellow-100 text-yellow-700"
// 																	: "bg-red-100 text-red-600"
// 														}`}
// 													>
// 														{biz.isVerified
// 															? "Verified"
// 															: biz.isActive
// 																? "Active"
// 																: "Pending"}
// 													</span>

// 													{!biz.isVerified && (
// 														<button
// 															onClick={() =>
// 																updateBusinessStatus(
// 																	biz._id,
// 																	"approved",
// 																)
// 															}
// 															className="flex items-center gap-0.5 text-xs text-green-600 font-medium hover:text-green-800"
// 														>
// 															<CheckCircle
// 																size={13}
// 															/>{" "}
// 															Verify
// 														</button>
// 													)}

// 													{biz.isActive && (
// 														<button
// 															onClick={() =>
// 																updateBusinessStatus(
// 																	biz._id,
// 																	"rejected",
// 																)
// 															}
// 															className="flex items-center gap-0.5 text-xs text-red-500 font-medium hover:text-red-700"
// 														>
// 															<XCircle
// 																size={13}
// 															/>{" "}
// 															Suspend
// 														</button>
// 													)}
// 												</div>
// 											</div>
// 										</div>
// 									))
// 								)}
// 							</div>
// 						)}

// 						{/* Reviews Tab */}
// 						{tab === "reviews" && (
// 							<div className="space-y-3">
// 								{reviews.length === 0 ? (
// 									<div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
// 										<Star
// 											size={40}
// 											className="text-gray-300 mx-auto mb-3"
// 										/>
// 										<p className="text-gray-500">
// 											No reviews found
// 										</p>
// 									</div>
// 								) : (
// 									reviews.map((review) => (
// 										<div
// 											key={review._id}
// 											className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition-shadow"
// 										>
// 											<div className="flex items-start justify-between">
// 												<div className="flex-1">
// 													<p className="font-semibold text-gray-900 text-sm">
// 														{review.userId
// 															?.fullName ||
// 															review.userName ||
// 															"Anonymous User"}
// 													</p>
// 													<p className="text-xs text-gray-500">
// 														on{" "}
// 														{review.businessId
// 															?.businessName ||
// 															"Unknown Business"}
// 													</p>
// 													<div className="flex items-center gap-1 mt-1">
// 														{[1, 2, 3, 4, 5].map(
// 															(star) => (
// 																<span
// 																	key={star}
// 																	className={`text-sm ${
// 																		star <=
// 																		review.rating
// 																			? "text-amber-500"
// 																			: "text-gray-300"
// 																	}`}
// 																>
// 																	★
// 																</span>
// 															),
// 														)}
// 													</div>
// 													{review.comment && (
// 														<p className="text-sm text-gray-600 mt-2">
// 															{review.comment}
// 														</p>
// 													)}
// 													<p className="text-xs text-gray-400 mt-2">
// 														{formatDate(
// 															review.createdAt,
// 														)}
// 													</p>
// 												</div>
// 												<button
// 													onClick={() =>
// 														deleteReview(review._id)
// 													}
// 													className="text-xs text-red-500 hover:text-red-700 font-medium ml-2"
// 												>
// 													Delete
// 												</button>
// 											</div>
// 										</div>
// 									))
// 								)}
// 							</div>
// 						)}

// 						{/* Community Posts Tab */}
// 						{tab === "community" && (
// 							<div className="space-y-3">
// 								{!posts || posts.length === 0 ? (
// 									<div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
// 										<MessageSquare
// 											size={40}
// 											className="text-gray-300 mx-auto mb-3"
// 										/>
// 										<p className="text-gray-500">
// 											No community posts found
// 										</p>
// 									</div>
// 								) : (
// 									posts.map((post) => (
// 										<div
// 											key={post._id}
// 											className={`bg-white rounded-2xl border p-4 hover:shadow-sm transition-shadow ${
// 												post.pinned
// 													? "border-orange-200 bg-orange-50/30"
// 													: "border-gray-100"
// 											}`}
// 										>
// 											<div className="flex items-start justify-between">
// 												<div className="flex-1">
// 													<p className="font-bold text-gray-900 text-sm">
// 														{post.title}
// 													</p>
// 													<p className="text-xs text-gray-500">
// 														By{" "}
// 														{post.authorId
// 															?.fullName ||
// 															post.authorName ||
// 															"Anonymous"}{" "}
// 														•
// 														{formatDate(
// 															post.createdAt,
// 														)}{" "}
// 														•
// 														<span
// 															className={`ml-1 px-1.5 py-0.5 rounded-full text-xs capitalize ${
// 																post.type ===
// 																"announcement"
// 																	? "bg-blue-100 text-blue-700"
// 																	: post.type ===
// 																		  "deal"
// 																		? "bg-green-100 text-green-700"
// 																		: "bg-gray-100 text-gray-600"
// 															}`}
// 														>
// 															{post.type ||
// 																"general"}
// 														</span>
// 													</p>
// 													<p className="text-sm text-gray-600 mt-2 line-clamp-2">
// 														{post.content}
// 													</p>
// 												</div>
// 												<div className="flex flex-col gap-2 ml-2 shrink-0">
// 													<button
// 														onClick={() =>
// 															togglePinPost(
// 																post._id,
// 																post.pinned,
// 															)
// 														}
// 														className={`text-xs font-medium px-2 py-1 rounded-lg transition-colors ${
// 															post.pinned
// 																? "bg-orange-100 text-orange-700 hover:bg-orange-200"
// 																: "bg-gray-100 text-gray-600 hover:bg-gray-200"
// 														}`}
// 													>
// 														{post.pinned
// 															? "Unpin"
// 															: "Pin"}
// 													</button>
// 													<button
// 														onClick={() =>
// 															deletePost(post._id)
// 														}
// 														className="text-xs text-red-500 hover:text-red-700 font-medium"
// 													>
// 														Delete
// 													</button>
// 												</div>
// 											</div>
// 										</div>
// 									))
// 								)}
// 							</div>
// 						)}

// 						{/* Users Tab */}
// 						{tab === "users" && (
// 							<div className="space-y-3">
// 								{users.length === 0 ? (
// 									<div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
// 										<Users
// 											size={40}
// 											className="text-gray-300 mx-auto mb-3"
// 										/>
// 										<p className="text-gray-500">
// 											No users found
// 										</p>
// 									</div>
// 								) : (
// 									users.map((user) => (
// 										<div
// 											key={user._id}
// 											className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition-shadow"
// 										>
// 											<div className="flex items-start justify-between">
// 												<div className="flex-1">
// 													<div className="flex items-center gap-2">
// 														<p className="font-semibold text-gray-900">
// 															{user.fullName}
// 														</p>
// 														<span
// 															className={`text-xs px-2 py-0.5 rounded-full capitalize ${
// 																user.role ===
// 																"admin"
// 																	? "bg-purple-100 text-purple-700"
// 																	: user.role ===
// 																		  "business_owner"
// 																		? "bg-orange-100 text-orange-700"
// 																		: "bg-gray-100 text-gray-600"
// 															}`}
// 														>
// 															{user.role?.replace(
// 																"_",
// 																" ",
// 															) || "user"}
// 														</span>
// 													</div>
// 													<p className="text-sm text-gray-500 mt-0.5">
// 														{user.email}
// 													</p>
// 													{user.phoneNumber && (
// 														<p className="text-xs text-gray-400 mt-1">
// 															📞{" "}
// 															{user.phoneNumber}
// 														</p>
// 													)}
// 													<p className="text-xs text-gray-400 mt-1">
// 														Joined:{" "}
// 														{formatDate(
// 															user.createdAt,
// 														)}
// 													</p>
// 												</div>
// 												<div className="flex flex-col gap-1.5 shrink-0">
// 													<button
// 														onClick={() => {
// 															// View user profile - could implement modal
// 															console.log(
// 																"View user:",
// 																user,
// 															);
// 														}}
// 														className="text-xs text-blue-500 hover:text-blue-700 font-medium"
// 													>
// 														View Details
// 													</button>
// 												</div>
// 											</div>
// 										</div>
// 									))
// 								)}
// 							</div>
// 						)}
// 					</>
// 				)}
// 			</section>
// 		</>
// 	);
// }

import { useEffect } from "react";
import {
	useNavigate,
	Routes,
	Route,
	Link,
	useLocation,
} from "react-router-dom";
import {
	ShieldCheck,
	LayoutDashboard,
	Store,
	Star,
	MessageSquare,
	Users,
	Package,
} from "lucide-react";
import { useAuth } from "../lib/context/AuthContext";
import Overview from "./admin/Overview";
// Import other admin pages as you create them:
// import AdminBusinesses from "./admin/Businesses";
// import AdminOrders from "./admin/Orders";
// import AdminReviews from "./admin/Reviews";
// import AdminCommunity from "./admin/Community";
// import AdminUsers from "./admin/Users";
// import AdminProducts from "./admin/Products";

export default function Admin() {
	const { user, profile } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	// Check admin access
	useEffect(() => {
		const userRole = profile?.role || user?.role;
		if (userRole !== "admin") {
			navigate("/");
			return;
		}
		if (!user) {
			navigate("/auth");
			return;
		}
	}, [profile, user, navigate]);

	const isAdmin = profile?.role === "admin" || user?.role === "admin";
	if (!isAdmin) return null;

	const navItems = [
		{ path: "/admin", label: "Overview", icon: LayoutDashboard },
		{ path: "/admin/businesses", label: "Businesses", icon: Store },
		{ path: "/admin/orders", label: "Orders", icon: Package },
		{ path: "/admin/reviews", label: "Reviews", icon: Star },
		{ path: "/admin/community", label: "Community", icon: MessageSquare },
		{ path: "/admin/users", label: "Users", icon: Users },
	];

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Admin Sidebar */}
			<div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40">
				<div className="p-6 border-b border-gray-200">
					<div className="flex items-center gap-2">
						<ShieldCheck size={24} className="text-orange-500" />
						<span className="font-bold text-gray-900">
							Admin Panel
						</span>
					</div>
				</div>
				<nav className="p-4 space-y-1">
					{navItems.map((item) => {
						const Icon = item.icon;
						const isActive = location.pathname === item.path;
						return (
							<Link
								key={item.path}
								to={item.path}
								className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
									isActive
										? "bg-orange-50 text-orange-600"
										: "text-gray-600 hover:bg-gray-50"
								}`}
							>
								<Icon size={18} />
								{item.label}
							</Link>
						);
					})}
				</nav>
			</div>

			{/* Main Content */}
			<div className="ml-64">
				<div className="p-6">
					<Routes>
						<Route path="/" element={<Overview />} />
						{/* Add more routes as you create the components */}
						{/* <Route path="/businesses" element={<AdminBusinesses />} /> */}
						{/* <Route path="/orders" element={<AdminOrders />} /> */}
						{/* <Route path="/reviews" element={<AdminReviews />} /> */}
						{/* <Route path="/community" element={<AdminCommunity />} /> */}
						{/* <Route path="/users" element={<AdminUsers />} /> */}
					</Routes>
				</div>
			</div>
		</div>
	);
}
