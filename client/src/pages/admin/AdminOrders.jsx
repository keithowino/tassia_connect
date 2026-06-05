import { useState, useEffect } from "react";
import { ShoppingCart, Package, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { orderAPI, businessAPI } from "../../lib/api";
import PageHeader from "../../components/admin/PageHeader";
import SearchFilter from "../../components/admin/SearchFilter";
import DataTable from "../../components/admin/DataTable";
import StatusBadge from "../../components/admin/StatusBadge";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const ORDER_STATUSES = [
	"pending",
	"confirmed",
	"preparing",
	"ready",
	"delivered",
	"cancelled",
];
const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

export default function AdminOrders() {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [paymentFilter, setPaymentFilter] = useState("all");
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [confirmAction, setConfirmAction] = useState(null);
	const [refetchKey, setRefetchKey] = useState(0);

	const fetchOrders = async () => {
		setLoading(true);
		try {
			const response = await orderAPI.getAll();
			setOrders(response.data || []);
		} catch (error) {
			console.error("Error fetching orders:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchOrders();
	}, [refetchKey]);

	const updateOrderStatus = async (orderId, newStatus) => {
		try {
			await orderAPI.updateStatus(orderId, newStatus);
			setRefetchKey((prev) => prev + 1);
		} catch (error) {
			console.error("Error updating order status:", error);
			alert(
				error.response?.data?.message ||
					"Failed to update order status",
			);
		}
	};

	const updatePaymentStatus = async (orderId, newStatus) => {
		try {
			// You'll need to add this endpoint to your backend
			await orderAPI.updatePaymentStatus(orderId, newStatus);
			setRefetchKey((prev) => prev + 1);
		} catch (error) {
			console.error("Error updating payment status:", error);
			alert(
				error.response?.data?.message ||
					"Failed to update payment status",
			);
		}
	};

	const filtered = orders.filter((o) => {
		const orderNumber = o.orderNumber || o._id?.slice(0, 8).toUpperCase();
		const customerName = o.userId?.fullName || "Customer";
		const matchSearch =
			!search ||
			orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
			customerName?.toLowerCase().includes(search.toLowerCase());
		const matchStatus = statusFilter === "all" || o.status === statusFilter;
		const matchPayment =
			paymentFilter === "all" || o.paymentStatus === paymentFilter;
		return matchSearch && matchStatus && matchPayment;
	});

	const handleApprove = (order) => {
		setConfirmAction({
			order,
			action: "approve",
			title: "Confirm Order?",
			description: `Are you sure you want to confirm order #${order.orderNumber || order._id?.slice(0, 8).toUpperCase()}?`,
			onConfirm: () => updateOrderStatus(order._id, "confirmed"),
		});
	};

	const handleCancel = (order) => {
		setConfirmAction({
			order,
			action: "cancel",
			title: "Cancel Order?",
			description: `Are you sure you want to cancel order #${order.orderNumber || order._id?.slice(0, 8).toUpperCase()}?`,
			onConfirm: () => updateOrderStatus(order._id, "cancelled"),
			destructive: true,
		});
	};

	const OrderDetailSheet = ({ order, onClose }) => {
		if (!order) return null;

		const orderNumber =
			order.orderNumber || order._id?.slice(0, 8).toUpperCase();
		const customerName = order.userId?.fullName || "Customer";
		const customerEmail = order.userId?.email || "—";
		const businessName = order.businessId?.businessName || "—";

		return (
			<>
				<div
					className="fixed inset-0 bg-black/50 z-50"
					onClick={onClose}
				/>
				<div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto">
					<div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
						<h2 className="text-lg font-bold text-gray-900 font-mono">
							{orderNumber}
						</h2>
						<button
							onClick={onClose}
							className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
						>
							<XCircle className="w-5 h-5 text-gray-500" />
						</button>
					</div>

					<div className="p-5 space-y-5">
						{/* Status Badges */}
						<div className="flex items-center gap-2">
							<StatusBadge status={order.status} />
							<StatusBadge
								status={order.paymentStatus || "pending"}
							/>
						</div>

						{/* Customer & Business Info */}
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<p className="text-xs text-gray-500 font-medium">
									Customer
								</p>
								<p className="font-medium text-gray-900 mt-0.5">
									{customerName}
								</p>
								<p className="text-xs text-gray-500 mt-0.5">
									{customerEmail}
								</p>
							</div>
							<div>
								<p className="text-xs text-gray-500 font-medium">
									Payment Method
								</p>
								<p className="font-medium text-gray-900 mt-0.5 uppercase">
									{order.paymentMethod || "—"}
								</p>
							</div>
							<div>
								<p className="text-xs text-gray-500 font-medium">
									Date
								</p>
								<p className="font-medium text-gray-900 mt-0.5">
									{order.createdAt
										? format(
												new Date(order.createdAt),
												"PPpp",
											)
										: "—"}
								</p>
							</div>
							<div>
								<p className="text-xs text-gray-500 font-medium">
									Business
								</p>
								<p className="font-medium text-gray-900 mt-0.5">
									{businessName}
								</p>
							</div>
						</div>

						{/* Delivery Address */}
						{order.deliveryAddress?.address && (
							<div>
								<p className="text-xs text-gray-500 font-medium mb-1">
									Delivery Address
								</p>
								<p className="text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">
									{order.deliveryAddress.address}
									{order.deliveryAddress.floorUnit &&
										`, ${order.deliveryAddress.floorUnit}`}
									{order.deliveryAddress.instructions && (
										<span className="text-xs text-gray-500 block mt-1">
											Note:{" "}
											{order.deliveryAddress.instructions}
										</span>
									)}
								</p>
							</div>
						)}

						{/* Special Instructions */}
						{order.specialInstructions && (
							<div>
								<p className="text-xs text-gray-500 font-medium mb-1">
									Special Instructions
								</p>
								<p className="text-sm text-gray-700 italic">
									"{order.specialInstructions}"
								</p>
							</div>
						)}

						{/* Items */}
						<div>
							<p className="text-xs text-gray-500 font-medium mb-2">
								Items
							</p>
							<div className="space-y-2">
								{order.items?.map((item, i) => (
									<div
										key={i}
										className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
									>
										<div className="flex items-center gap-2">
											<Package className="w-4 h-4 text-gray-400" />
											<div>
												<p className="text-sm font-medium text-gray-900">
													{item.name}
												</p>
												<p className="text-xs text-gray-500">
													Qty: {item.quantity}
												</p>
											</div>
										</div>
										<p className="text-sm font-semibold text-gray-900">
											KES{" "}
											{(
												(item.price || 0) *
												(item.quantity || 1)
											).toLocaleString()}
										</p>
									</div>
								))}
							</div>
						</div>

						{/* Totals */}
						<div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
							<div className="flex justify-between">
								<span className="text-gray-500">Subtotal</span>
								<span className="text-gray-900">
									KES {(order.subtotal || 0).toLocaleString()}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-500">
									Tax (16% VAT)
								</span>
								<span className="text-gray-900">
									KES {(order.tax || 0).toLocaleString()}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-500">
									Delivery Fee
								</span>
								<span className="text-gray-900">
									KES{" "}
									{(order.deliveryFee || 0).toLocaleString()}
								</span>
							</div>
							<div className="flex justify-between font-bold text-base pt-1 border-t border-gray-100">
								<span className="text-gray-900">Total</span>
								<span className="text-orange-600">
									KES {(order.total || 0).toLocaleString()}
								</span>
							</div>
						</div>

						{/* Status Update Actions */}
						<div className="space-y-3 pt-2">
							<div>
								<p className="text-xs text-gray-500 font-medium mb-1.5">
									Update Order Status
								</p>
								<select
									value={order.status}
									onChange={(e) => {
										updateOrderStatus(
											order._id,
											e.target.value,
										);
										onClose();
									}}
									className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
								>
									{ORDER_STATUSES.map((s) => (
										<option key={s} value={s}>
											{s.replace(/_/g, " ")}
										</option>
									))}
								</select>
							</div>
							<div>
								<p className="text-xs text-gray-500 font-medium mb-1.5">
									Update Payment Status
								</p>
								<select
									value={order.paymentStatus || "pending"}
									onChange={(e) => {
										updatePaymentStatus(
											order._id,
											e.target.value,
										);
										onClose();
									}}
									className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
								>
									{PAYMENT_STATUSES.map((s) => (
										<option key={s} value={s}>
											{s}
										</option>
									))}
								</select>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	};

	const columns = [
		{
			key: "orderNumber",
			label: "Order #",
			render: (row) => (
				<span className="font-mono text-sm font-medium text-gray-900">
					{row.orderNumber || row._id?.slice(0, 8).toUpperCase()}
				</span>
			),
		},
		{
			key: "customer",
			label: "Customer",
			render: (row) => (
				<div>
					<p className="text-sm font-medium text-gray-900">
						{row.userId?.fullName || "Customer"}
					</p>
					<p className="text-xs text-gray-500">
						{row.userId?.email || ""}
					</p>
				</div>
			),
		},
		{
			key: "total",
			label: "Total",
			render: (row) => (
				<span className="text-sm font-semibold text-gray-900">
					KES {(row.total || 0).toLocaleString()}
				</span>
			),
		},
		{
			key: "status",
			label: "Status",
			render: (row) => <StatusBadge status={row.status} />,
		},
		{
			key: "payment",
			label: "Payment",
			render: (row) => (
				<div className="flex items-center gap-2">
					<StatusBadge status={row.paymentStatus || "pending"} />
					<span className="text-[10px] text-gray-400 uppercase">
						{row.paymentMethod || "—"}
					</span>
				</div>
			),
		},
		{
			key: "date",
			label: "Date",
			render: (row) => (
				<span className="text-xs text-gray-500">
					{row.createdAt
						? format(new Date(row.createdAt), "MMM d, HH:mm")
						: "—"}
				</span>
			),
		},
		{
			key: "actions",
			label: "",
			cellClassName: "text-right",
			render: (row) =>
				row.status === "pending" ? (
					<div className="flex items-center justify-end gap-1.5">
						<button
							onClick={(e) => {
								e.stopPropagation();
								handleApprove(row);
							}}
							className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors"
						>
							<CheckCircle className="w-3.5 h-3.5" />
							Approve
						</button>
						<button
							onClick={(e) => {
								e.stopPropagation();
								handleCancel(row);
							}}
							className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium transition-colors"
						>
							<XCircle className="w-3.5 h-3.5" />
							Cancel
						</button>
					</div>
				) : (
					<span className="text-xs text-gray-400 italic">—</span>
				),
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
		<div className="space-y-4 max-w-7xl mx-auto">
			<PageHeader
				title="Orders"
				subtitle={`${orders.length} total orders`}
				onRefresh={() => setRefetchKey((prev) => prev + 1)}
			/>

			<SearchFilter
				search={search}
				onSearchChange={setSearch}
				filters={[
					{
						key: "status",
						value: statusFilter,
						onChange: setStatusFilter,
						placeholder: "Status",
						allLabel: "All Statuses",
						options: ORDER_STATUSES.map((s) => ({
							value: s,
							label: s.replace(/_/g, " "),
						})),
					},
					{
						key: "payment",
						value: paymentFilter,
						onChange: setPaymentFilter,
						placeholder: "Payment",
						allLabel: "All Payments",
						options: PAYMENT_STATUSES.map((s) => ({
							value: s,
							label: s,
						})),
					},
				]}
			/>

			<DataTable
				columns={columns}
				data={filtered}
				emptyIcon={ShoppingCart}
				emptyMessage="No orders found"
				onRowClick={setSelectedOrder}
			/>

			<OrderDetailSheet
				order={selectedOrder}
				onClose={() => setSelectedOrder(null)}
			/>

			<ConfirmDialog
				open={!!confirmAction}
				onOpenChange={() => setConfirmAction(null)}
				title={confirmAction?.title || ""}
				description={confirmAction?.description || ""}
				onConfirm={() => {
					confirmAction?.onConfirm();
					setConfirmAction(null);
				}}
				destructive={confirmAction?.destructive || false}
			/>
		</div>
	);
}
