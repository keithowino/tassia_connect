import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
	ChevronLeft,
	MapPin,
	ShoppingCart,
	MessageCircle,
	CheckCircle,
	Clock,
	Building,
} from "lucide-react";
import { useAuth } from "../lib/context/AuthContext";
import { useCart } from "../lib/context/CartContext";
import { businessAPI } from "../lib/api";
import MetaDataInsert from "../lib/MetaDataInsert";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function Checkout() {
	const { businessId } = useParams();
	const { user } = useAuth();
	const {
		items,
		total,
		cartBusinessName,
		clearCart,
		createOrder,
		loading: cartLoading,
	} = useCart();
	const navigate = useNavigate();

	const [orderType, setOrderType] = useState("pickup");
	const [address, setAddress] = useState("");
	const [floorUnit, setFloorUnit] = useState("");
	const [instructions, setInstructions] = useState("");
	const [notes, setNotes] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [orderId, setOrderId] = useState("");
	const [orderNumber, setOrderNumber] = useState("");
	const [business, setBusiness] = useState(null);
	const [businessLoading, setBusinessLoading] = useState(true);
	const [estimatedTime, setEstimatedTime] = useState("20-30");

	// Redirect if not logged in
	useEffect(() => {
		if (!user) {
			navigate("/auth");
			return;
		}
	}, [user, navigate]);

	// Redirect if cart is empty
	useEffect(() => {
		if (!cartLoading && items.length === 0 && !success) {
			navigate("/discover");
			return;
		}
	}, [items.length, success, navigate, cartLoading]);

	// Fetch business details for delivery fee and estimated time
	useEffect(() => {
		if (!businessId) return;

		const fetchBusiness = async () => {
			setBusinessLoading(true);
			try {
				const response = await businessAPI.getById(businessId);
				setBusiness(response.data);

				// Calculate estimated delivery time based on business type
				if (response.data.category?.toLowerCase().includes("food")) {
					setEstimatedTime("25-40");
				} else if (
					response.data.category
						?.toLowerCase()
						.includes("electronics")
				) {
					setEstimatedTime("30-45");
				} else {
					setEstimatedTime("20-30");
				}
			} catch (error) {
				console.error("Error fetching business:", error);
			} finally {
				setBusinessLoading(false);
			}
		};

		fetchBusiness();
	}, [businessId]);

	const getDeliveryFee = () => {
		if (orderType === "pickup") return 0;
		return business?.delivery_fee || 50; // Default delivery fee
	};

	const getFinalTotal = () => {
		const deliveryFee = getDeliveryFee();
		const tax = total * 0.16; // 16% VAT
		return total + deliveryFee + tax;
	};

	const handleOrder = async () => {
		if (!businessId || !user) return;

		if (orderType === "delivery" && !address.trim()) {
			alert("Please enter a delivery address");
			return;
		}

		setLoading(true);

		try {
			const deliveryDetails = {
				type: orderType,
				address: orderType === "delivery" ? address : null,
				floor_unit: orderType === "delivery" ? floorUnit : null,
				instructions: instructions,
				notes: notes,
			};

			const paymentMethod = "mpesa"; // Default, can be extended later

			const result = await createOrder(deliveryDetails, paymentMethod);

			if (result) {
				setOrderId(result._id);
				setOrderNumber(result.orderNumber);
				setSuccess(true);
			} else {
				alert("Failed to place order. Please try again.");
			}
		} catch (error) {
			console.error("Error placing order:", error);
			alert(
				error.response?.data?.message ||
					"Failed to place order. Please try again.",
			);
		} finally {
			setLoading(false);
		}
	};

	if (businessLoading || cartLoading) {
		return (
			<div className="flex justify-center py-20">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	if (success) {
		return (
			<>
				<MetaDataInsert
					title="Order Confirmed"
					description="Your order has been placed successfully. Track your order status in real-time."
				/>

				<section className="max-w-md mx-auto px-4 py-16 text-center">
					<div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
						<CheckCircle size={40} className="text-green-500" />
					</div>
					<h1 className="text-2xl font-extrabold text-gray-900 mb-2">
						Order Placed!
					</h1>
					<p className="text-gray-500 mb-6">
						Your order has been sent to{" "}
						<strong>
							{cartBusinessName || business?.businessName}
						</strong>
						. They'll confirm shortly.
					</p>

					<div className="bg-orange-50 rounded-2xl p-4 mb-6 text-left space-y-2">
						<div className="flex justify-between items-center">
							<span className="text-sm text-orange-700">
								Order Number:
							</span>
							<span className="font-mono font-bold text-orange-800">
								{orderNumber ||
									orderId.slice(0, 8).toUpperCase()}
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm text-orange-700">
								Status:
							</span>
							<span className="inline-flex items-center gap-1 text-sm font-bold text-yellow-600">
								<Clock size={14} /> Pending
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm text-orange-700">
								Est. Time:
							</span>
							<span className="text-sm font-medium text-orange-800">
								{orderType === "delivery"
									? `${estimatedTime} minutes`
									: "Ready for pickup"}
							</span>
						</div>
					</div>

					<div className="space-y-3">
						<Link
							to="/orders"
							className="block w-full bg-orange-500 text-white py-3 rounded-2xl font-bold hover:bg-orange-600 transition-colors"
						>
							Track Order
						</Link>
						<Link
							to="/discover"
							className="block w-full bg-gray-100 text-gray-700 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
						>
							Continue Browsing
						</Link>
					</div>
				</section>
			</>
		);
	}

	return (
		<>
			<MetaDataInsert
				title="Checkout"
				description="Complete your order securely. Review items, confirm delivery details, and make payment."
			/>

			<div className="max-w-md mx-auto px-4 py-4 mb-20">
				{/* Header */}
				<div className="flex items-center gap-3 mb-6">
					<button
						onClick={() => navigate(-1)}
						className="p-2 rounded-full hover:bg-gray-100 transition-colors"
						aria-label="Go back"
					>
						<ChevronLeft size={20} />
					</button>
					<h1 className="text-xl font-bold text-gray-900">
						Checkout
					</h1>
				</div>

				<div className="space-y-4">
					{/* Order Summary */}
					<div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
						<h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
							<ShoppingCart
								size={18}
								className="text-orange-500"
							/>
							Your Order
						</h2>
						<p className="text-sm text-gray-500 mb-3">
							{cartBusinessName || business?.businessName}
						</p>

						<div className="space-y-2 max-h-60 overflow-y-auto">
							{items.map((item) => {
								const productId =
									item.product._id || item.product.id;
								return (
									<div
										key={productId}
										className="flex items-center justify-between py-1.5"
									>
										<span className="text-sm text-gray-700">
											{item.product.name} ×{" "}
											{item.quantity}
										</span>
										<span className="text-sm font-semibold text-gray-900">
											KES{" "}
											{(
												item.product.price *
												item.quantity
											).toLocaleString()}
										</span>
									</div>
								);
							})}
						</div>

						{/* Price Breakdown */}
						<div className="border-t border-gray-100 mt-3 pt-3 space-y-1.5">
							<div className="flex items-center justify-between text-sm">
								<span className="text-gray-500">Subtotal</span>
								<span className="text-gray-700">
									KES {total.toLocaleString()}
								</span>
							</div>
							<div className="flex items-center justify-between text-sm">
								<span className="text-gray-500">
									Delivery Fee
								</span>
								<span className="text-gray-700">
									{orderType === "delivery"
										? `KES ${getDeliveryFee().toLocaleString()}`
										: "Free"}
								</span>
							</div>
							<div className="flex items-center justify-between text-sm">
								<span className="text-gray-500">
									Tax (16% VAT)
								</span>
								<span className="text-gray-700">
									KES {(total * 0.16).toLocaleString()}
								</span>
							</div>
							<div className="border-t border-gray-100 mt-2 pt-2 flex items-center justify-between">
								<span className="font-bold text-gray-900">
									Total
								</span>
								<span className="font-bold text-orange-500 text-lg">
									KES {getFinalTotal().toLocaleString()}
								</span>
							</div>
						</div>
					</div>

					{/* Order Type */}
					<div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
						<h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
							<Building size={18} className="text-orange-500" />
							Delivery Options
						</h2>
						<div className="flex gap-2">
							{["pickup", "delivery"].map((type) => (
								<button
									key={type}
									onClick={() => setOrderType(type)}
									className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold capitalize transition-all ${
										orderType === type
											? "border-orange-400 bg-orange-50 text-orange-700"
											: "border-gray-200 text-gray-600 hover:border-gray-300"
									}`}
								>
									{type === "pickup" ? "Pickup" : "Delivery"}
								</button>
							))}
						</div>

						{orderType === "delivery" && (
							<div className="mt-4 space-y-3">
								<div className="relative">
									<MapPin
										size={16}
										className="absolute left-3 top-3.5 text-gray-400"
									/>
									<input
										type="text"
										placeholder="Street address or building name"
										value={address}
										onChange={(e) =>
											setAddress(e.target.value)
										}
										className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
									/>
								</div>
								<input
									type="text"
									placeholder="Floor, unit, or room number (optional)"
									value={floorUnit}
									onChange={(e) =>
										setFloorUnit(e.target.value)
									}
									className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
								/>
								<textarea
									placeholder="Delivery instructions (e.g., gate code, landmark)"
									value={instructions}
									onChange={(e) =>
										setInstructions(e.target.value)
									}
									rows={2}
									className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
								/>
							</div>
						)}
					</div>

					{/* Special Instructions */}
					<div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
						<h2 className="font-bold text-gray-900 mb-3">
							Special Instructions
						</h2>
						<textarea
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							placeholder="Any special requests for the business? (e.g., no onions, extra sauce)"
							rows={3}
							className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
						/>
					</div>

					{/* Place Order Button */}
					<button
						onClick={handleOrder}
						disabled={
							loading ||
							(orderType === "delivery" && !address.trim())
						}
						className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-base hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{loading
							? "Placing Order..."
							: `Place Order · KES ${getFinalTotal().toLocaleString()}`}
					</button>

					{/* Info Note */}
					<p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
						<MessageCircle size={12} /> Business will confirm via
						WhatsApp/Call
					</p>

					{orderType === "delivery" && !address.trim() && (
						<p className="text-center text-xs text-red-400">
							Please enter a delivery address to continue
						</p>
					)}
				</div>
			</div>
		</>
	);
}
