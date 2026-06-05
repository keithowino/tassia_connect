import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
	Store,
	ShoppingCart,
	Star,
	MessageSquare,
	Users,
	Package,
	TrendingUp,
	ArrowRight,
	Eye,
} from "lucide-react";
import { useAuth } from "../../lib/context/AuthContext";
import {
	businessAPI,
	orderAPI,
	reviewAPI,
	communityAPI,
	adminAPI,
	productAPI,
} from "../../lib/api";
import StatCard from "../../components/admin/StatCard";
import StatusBadge from "../../components/admin/StatusBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function Overview() {
	const { user, profile } = useAuth();
	const [loading, setLoading] = useState(true);
	const [businesses, setBusinesses] = useState([]);
	const [orders, setOrders] = useState([]);
	const [reviews, setReviews] = useState([]);
	const [posts, setPosts] = useState([]);
	const [products, setProducts] = useState([]);
	const [users, setUsers] = useState([]);
	const [error, setError] = useState(null);

	// Check admin access
	useEffect(() => {
		const userRole = profile?.role || user?.role;
		if (userRole !== "admin") {
			window.location.href = "/";
		}
	}, [profile, user]);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError(null);
			try {
				const [
					businessesRes,
					ordersRes,
					reviewsRes,
					postsRes,
					productsRes,
					usersRes,
				] = await Promise.all([
					businessAPI.getAll().catch(() => ({ data: [] })),
					orderAPI.getAll().catch(() => ({ data: [] })),
					reviewAPI.getAll().catch(() => ({ data: [] })),
					communityAPI.getAll().catch(() => ({ data: [] })),
					productAPI.getAll().catch(() => ({ data: [] })),
					adminAPI.getAllUsers().catch(() => ({ data: [] })),
				]);

				setBusinesses(businessesRes.data || []);
				setOrders(ordersRes.data || []);
				setReviews(reviewsRes.data || []);

				// Handle nested posts data
				const postsData = postsRes.data?.posts || postsRes.data || [];
				setPosts(postsData);

				setProducts(productsRes.data || []);
				setUsers(usersRes.data || []);
			} catch (err) {
				console.error("Error fetching admin data:", err);
				setError("Failed to load dashboard data");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const pendingBusinesses = businesses.filter(
		(b) => !b.isVerified && !b.isActive,
	);
	const pendingOrders = orders.filter((o) => o.status === "pending");
	const totalRevenue = orders
		.filter((o) => o.status === "delivered")
		.reduce((sum, o) => sum + (o.total || 0), 0);
	const recentOrders = orders.slice(0, 5);
	const recentBusinesses = businesses.slice(0, 5);

	const stats = [
		{
			icon: Store,
			label: "Total Businesses",
			value: businesses.length,
			iconBg: "bg-orange-50",
			iconColor: "text-orange-500",
		},
		{
			icon: ShoppingCart,
			label: "Total Orders",
			value: orders.length,
			iconBg: "bg-blue-50",
			iconColor: "text-blue-500",
		},
		{
			icon: TrendingUp,
			label: "Revenue (KES)",
			value: `${totalRevenue.toLocaleString()}`,
			iconBg: "bg-emerald-50",
			iconColor: "text-emerald-500",
		},
		{
			icon: Users,
			label: "Total Users",
			value: users.length,
			iconBg: "bg-violet-50",
			iconColor: "text-violet-500",
		},
		{
			icon: Star,
			label: "Reviews",
			value: reviews.length,
			iconBg: "bg-amber-50",
			iconColor: "text-amber-500",
		},
		{
			icon: Package,
			label: "Products",
			value: products.length,
			iconBg: "bg-cyan-50",
			iconColor: "text-cyan-500",
		},
		{
			icon: MessageSquare,
			label: "Community Posts",
			value: posts.length,
			iconBg: "bg-green-50",
			iconColor: "text-green-500",
		},
		{
			icon: Store,
			label: "Pending Approval",
			value: pendingBusinesses.length,
			iconBg: "bg-red-50",
			iconColor: "text-red-500",
		},
	];

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-[60vh]">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	return (
		<div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
			<div>
				<h1 className="text-xl font-bold text-gray-900">
					Dashboard Overview
				</h1>
				<p className="text-sm text-gray-500 mt-0.5">
					Welcome back,{" "}
					{profile?.fullName || user?.fullName || "Admin"}. Here's
					what's happening.
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
				{stats.map((s) => (
					<StatCard key={s.label} {...s} />
				))}
			</div>

			<div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
				{/* Recent Orders */}
				<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
					<div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
						<h2 className="text-sm font-semibold text-gray-900">
							Recent Orders
						</h2>
						<Link
							to="/admin/orders"
							className="text-xs text-orange-500 font-medium flex items-center gap-1 hover:underline"
						>
							View all <ArrowRight className="w-3 h-3" />
						</Link>
					</div>
					<div className="divide-y divide-gray-100">
						{recentOrders.length === 0 ? (
							<p className="text-sm text-gray-500 text-center py-8">
								No orders yet
							</p>
						) : (
							recentOrders.map((order) => (
								<div
									key={order._id}
									className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
								>
									<div>
										<p className="text-sm font-medium text-gray-900">
											{order.orderNumber ||
												order._id
													.slice(0, 8)
													.toUpperCase()}
										</p>
										<p className="text-xs text-gray-500">
											{order.userId?.fullName ||
												"Customer"}{" "}
											•{" "}
											{format(
												new Date(order.createdAt),
												"MMM d, HH:mm",
											)}
										</p>
									</div>
									<div className="flex items-center gap-3">
										<StatusBadge status={order.status} />
										<span className="text-sm font-semibold text-gray-900">
											KES{" "}
											{(
												order.total || 0
											).toLocaleString()}
										</span>
									</div>
								</div>
							))
						)}
					</div>
				</div>

				{/* Recent Businesses */}
				<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
					<div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
						<h2 className="text-sm font-semibold text-gray-900">
							Recent Businesses
						</h2>
						<Link
							to="/admin/businesses"
							className="text-xs text-orange-500 font-medium flex items-center gap-1 hover:underline"
						>
							View all <ArrowRight className="w-3 h-3" />
						</Link>
					</div>
					<div className="divide-y divide-gray-100">
						{recentBusinesses.length === 0 ? (
							<p className="text-sm text-gray-500 text-center py-8">
								No businesses yet
							</p>
						) : (
							recentBusinesses.map((biz) => (
								<div
									key={biz._id}
									className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
								>
									<div className="flex items-center gap-3">
										{biz.logo ? (
											<img
												src={biz.logo}
												alt=""
												className="w-8 h-8 rounded-lg object-cover"
											/>
										) : (
											<div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
												<Store className="w-4 h-4 text-orange-500" />
											</div>
										)}
										<div>
											<p className="text-sm font-medium text-gray-900">
												{biz.businessName}
											</p>
											<p className="text-xs text-gray-500">
												{biz.category ||
													"Uncategorized"}
											</p>
										</div>
									</div>
									<StatusBadge
										status={
											biz.isVerified
												? "verified"
												: biz.isActive
													? "active"
													: "pending"
										}
									/>
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
