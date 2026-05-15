import { ChevronRight, ClipboardList, Package } from "lucide-react";
import MetaDataInsert from "../lib/MetaDataInsert";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import data from "../lib/data";
import { useData } from "../lib/context/DataContext";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Orders = () => {
	const { dummyOrders, STATUS_CONFIG } = useData();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	// const { user } = useAuth();
	const navigate = useNavigate();

	const user = data.dummyUserProfile;

	useEffect(() => {
		if (!user) {
			navigate("/auth");
			return;
		}
		// supabase
		//   .from('orders')
		//   .select('*, businesses(name, logo, cover_image, slug), order_items(*)')
		//   .eq('customer_id', user.id)
		//   .order('created_at', { ascending: false })
		//   .then(({ data }) => {
		//     if (data) setOrders(data as Order[]);
		//     setLoading(false);
		//   });

		// dummy tryCatch action
		try {
			setOrders(dummyOrders);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	}, [user, navigate]);

	if (loading) {
		return (
			<div className="flex justify-center py-20">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	return (
		<>
			<MetaDataInsert title="Orders" />
			<section className="max-w-xl mx-auto px-4 py-4">
				<h1 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
					<ClipboardList size={22} className="text-orange-500" /> My
					Orders
				</h1>

				{orders.length === 0 ? (
					<div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
						<ClipboardList
							size={48}
							className="text-gray-300 mx-auto mb-3"
						/>
						<p className="font-semibold text-gray-700">
							No orders yet
						</p>
						<p className="text-gray-400 text-sm mt-1">
							Order from local businesses around you
						</p>
						<Link
							to="/discover"
							className="mt-4 inline-block bg-orange-500 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors"
						>
							Browse Businesses
						</Link>
					</div>
				) : (
					<div className="space-y-3">
						{orders.map((order) => {
							const status =
								STATUS_CONFIG[order.status] ||
								STATUS_CONFIG.pending;
							const biz = order.businesses; // as { name: string; logo: string; slug: string } | undefined
							return (
								<div
									key={order.id}
									className="bg-white rounded-2xl border border-gray-100 p-4"
								>
									<div className="flex items-center gap-3">
										<div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
											{biz?.logo ? (
												<img
													src={biz.logo}
													alt={biz.name}
													className="w-12 h-12 rounded-xl object-cover"
												/>
											) : (
												<Package
													size={22}
													className="text-orange-500"
												/>
											)}
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-center justify-between">
												<p className="font-bold text-gray-900 text-sm truncate">
													{biz?.name || "Business"}
												</p>
												<ChevronRight
													size={16}
													className="text-gray-400 shrink-0"
												/>
											</div>
											<p className="text-xs text-gray-500 mt-0.5">
												{new Date(
													order.created_at,
												).toLocaleDateString("en-KE", {
													day: "numeric",
													month: "short",
													year: "numeric",
													hour: "2-digit",
													minute: "2-digit",
												})}
											</p>
											<div className="flex items-center justify-between mt-2">
												<span
													className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}
												>
													{status.icon} {status.label}
												</span>
												<span className="font-bold text-orange-500">
													KES{" "}
													{order.total_amount.toLocaleString()}
												</span>
											</div>
										</div>
									</div>
									{order.order_items &&
										order.order_items.length > 0 && (
											<div className="mt-3 pt-3 border-t border-gray-50">
												<p className="text-xs text-gray-400">
													{order.order_items
														.map(
															(i) =>
																`${i.name} ×${i.quantity}`,
														)
														.join(", ")}
												</p>
											</div>
										)}
									<div className="mt-3 flex items-center justify-between">
										<span className="text-xs text-gray-400 capitalize">
											{order.order_type}
										</span>
										{order.notes && (
											<span className="text-xs text-gray-400 italic truncate max-w-[200px]">
												"{order.notes}"
											</span>
										)}
									</div>
								</div>
							);
						})}
					</div>
				)}
			</section>
		</>
	);
};

export default Orders;
