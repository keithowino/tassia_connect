import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
	Store,
	Plus,
	Edit2,
	Trash2,
	Eye,
	Star,
	ShoppingCart,
	TrendingUp,
	ChevronLeft,
	Save,
	X,
	Package,
	Wrench,
	Clock,
	ClipboardList,
} from "lucide-react";
import { useAuth } from "../lib/context/AuthContext";
import { businessAPI, productAPI, orderAPI, categoryAPI } from "../lib/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import MetaDataInsert from "../lib/MetaDataInsert";
import data from "../lib/data";
import OrdersTab from "../components/business/OrdersTab";

export default function BusinessDashboard() {
	const { businessId } = useParams();
	const isNew = businessId === "new";
	const { user, profile } = useAuth();
	const navigate = useNavigate();

	const [business, setBusiness] = useState(null);
	const [categories, setCategories] = useState([]);
	const [products, setProducts] = useState([]);
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(!isNew);
	const [tab, setTab] = useState(isNew ? "settings" : "overview");
	const [saving, setSaving] = useState(false);
	const [showProductForm, setShowProductForm] = useState(false);
	const [editingProduct, setEditingProduct] = useState(null);
	const [form, setForm] = useState({
		businessName: "",
		tagline: "",
		description: "",
		category: "",
		location: {
			address: "",
			floor_unit: "",
			location_label: "Tassia Complex",
			coordinates: {
				lat: "",
				lng: "",
			},
		},
		phone: "",
		whatsapp: "",
		email: "",
		website: "",
		opening_time: "08:00",
		closing_time: "20:00",
		delivery_available: false,
		delivery_fee: 0,
		min_order: 0,
		cover_image: "",
		logo: "",
		open_days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	});
	const [productForm, setProductForm] = useState({
		name: "",
		description: "",
		price: 0,
		category: "general",
		image_url: "",
		isAvailable: true,
		stock: 0,
	});

	// Check admin access
	useEffect(() => {
		const userRole = profile?.role || user?.role;
		if (userRole !== "business_owner" && userRole !== "admin") {
			navigate("/");
			return;
		}
		if (!user) {
			navigate("/auth");
			return;
		}
	}, [user, profile, navigate]);

	// Fetch categories
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await categoryAPI.getAll();
				setCategories(response.data || []);
			} catch (error) {
				console.error("Error fetching categories:", error);
			}
		};
		fetchCategories();
	}, []);

	// Fetch business data
	useEffect(() => {
		if (!isNew && businessId) {
			const fetchBusinessData = async () => {
				setLoading(true);
				try {
					// Fetch business details
					const businessRes = await businessAPI.getById(businessId);
					const businessData = businessRes.data;

					// Check if user owns this business
					if (
						businessData.ownerId?._id !== user?._id &&
						profile?.role !== "admin"
					) {
						navigate("/dashboard");
						return;
					}

					setBusiness(businessData);

					setForm({
						businessName: businessData.businessName || "",
						tagline: businessData.tagline || "",
						description: businessData.description || "",
						category: businessData.category || "",
						location: {
							address: businessData.location?.address || "",
							floor_unit: businessData.location?.floor_unit || "",
							location_label:
								businessData.location?.label ||
								"Tassia Complex",
							coordinates: {
								lat:
									businessData.location?.coordinates?.lat ||
									0,
								lng:
									businessData.location?.coordinates?.lng ||
									0,
							},
						},
						phone: businessData.phone || "",
						whatsapp: businessData.whatsapp || "",
						email: businessData.email || "",
						website: businessData.website || "",
						opening_time: businessData.opening_time || "08:00",
						closing_time: businessData.closing_time || "20:00",
						delivery_available:
							businessData.delivery_available || false,
						delivery_fee: businessData.delivery_fee || 0,
						min_order: businessData.min_order || 0,
						cover_image: businessData.coverImage || "",
						logo: businessData.logo || "",
						open_days: businessData.open_days || [
							"Mon",
							"Tue",
							"Wed",
							"Thu",
							"Fri",
							"Sat",
						],
					});

					// Fetch products
					const productsRes =
						await productAPI.getByBusiness(businessId);
					setProducts(productsRes.data || []);

					// Fetch orders
					const ordersRes =
						await orderAPI.getBusinessOrders(businessId);
					setOrders(ordersRes.data || []);
				} catch (error) {
					console.error("Error fetching business data:", error);
					if (error.response?.status === 404) {
						navigate("/dashboard/new");
					}
				} finally {
					setLoading(false);
				}
			};

			fetchBusinessData();
		}
	}, [businessId, isNew, user, profile, navigate]);

	const generateSlug = (name) => {
		return (
			name
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/(^-|-$)/g, "") +
			"-" +
			Date.now().toString(36)
		);
	};

	const getCurrentLocation = () => {
		if (!navigator.geolocation) {
			alert(
				"Geolocation is not supported by your browser. Please enter coordinates manually.",
			);
			return;
		}

		// Show loading indicator
		setSaving(true);

		navigator.geolocation.getCurrentPosition(
			(position) => {
				setForm((prev) => ({
					...prev,
					location: {
						...prev.location,
						coordinates: {
							lat: position.coords.latitude,
							lng: position.coords.longitude,
						},
					},
				}));
				setSaving(false);
				alert(
					"✅ Location captured successfully! You can adjust the coordinates if needed.",
				);
			},
			(error) => {
				setSaving(false);
				switch (error.code) {
					case error.PERMISSION_DENIED:
						alert(
							"📍 Location access denied. Please enable location in your browser settings or enter coordinates manually.",
						);
						break;
					case error.POSITION_UNAVAILABLE:
						alert(
							"📍 Location information unavailable. Please enter coordinates manually.",
						);
						break;
					case error.TIMEOUT:
						alert(
							"📍 Location request timed out. Please try again or enter manually.",
						);
						break;
					default:
						alert(
							"📍 Could not get your location. Please enter coordinates manually.",
						);
				}
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 0,
			},
		);
	};

	const handleSaveBusiness = async () => {
		if (!user || !form.businessName.trim()) {
			alert("Please enter a business name");
			return;
		}
		setSaving(true);

		try {
			const payload = {
				businessName: form.businessName,
				tagline: form.tagline,
				description: form.description,
				category: form.category,
				email: form.email,
				phone: form.phone,
				whatsapp: form.whatsapp,
				website: form.website,
				location: {
					address: form.location?.address || "",
					floor_unit: form.location?.floor_unit || "",
					location_label:
						form.location?.location_label || "Tassia Complex",
					coordinates: {
						lat: form.location?.coordinates?.lat
							? parseFloat(form.location.coordinates.lat)
							: 0,
						lng: form.location?.coordinates?.lng
							? parseFloat(form.location.coordinates.lng)
							: 0,
					},
				},
				opening_time: form.opening_time,
				closing_time: form.closing_time,
				open_days: form.open_days,
				delivery_available: form.delivery_available,
				delivery_fee: form.delivery_fee,
				min_order: form.min_order,
				coverImage: form.cover_image,
				logo: form.logo,
			};

			let response;
			if (isNew) {
				response = await businessAPI.create(payload);
				navigate(`/dashboard/${response.data._id}`, { replace: true });
			} else if (business) {
				response = await businessAPI.update(business._id, payload);
				setBusiness(response.data);
			}
		} catch (error) {
			console.error("Error saving business:", error);
			alert(error.response?.data?.message || "Error saving business");
		} finally {
			setSaving(false);
		}
	};

	const handleAddProduct = async () => {
		if (!business || !productForm.name.trim()) {
			alert("Please enter a product name");
			return;
		}

		try {
			const payload = {
				businessId: business._id,
				name: productForm.name,
				description: productForm.description,
				price: productForm.price,
				category: productForm.category,
				image_url: productForm.image_url, // Will be converted to images array by backend
				isAvailable: productForm.isAvailable,
				stock: productForm.stock,
			};

			let response;
			if (editingProduct) {
				response = await productAPI.update(editingProduct._id, payload);
				setProducts((prev) =>
					prev.map((p) =>
						p._id === editingProduct._id ? response.data : p,
					),
				);
			} else {
				response = await productAPI.create(payload);
				setProducts((prev) => [...prev, response.data]);
			}

			setProductForm({
				name: "",
				description: "",
				price: 0,
				category: "general",
				image_url: "",
				isAvailable: true,
				stock: 0,
			});
			setEditingProduct(null);
			setShowProductForm(false);
		} catch (error) {
			console.error("Error saving product:", error);
			alert(error.response?.data?.message || "Error saving product");
		}
	};

	const editProduct = (product) => {
		// Get the first image from the images array or use existing image_url
		const productImage =
			product.images && product.images.length > 0
				? product.images[0]
				: product.image_url || "";

		setEditingProduct(product);
		setProductForm({
			name: product.name,
			description: product.description || "",
			price: product.price,
			category: product.category || "general",
			image_url: productImage,
			isAvailable: product.isAvailable !== false,
			stock: product.stock || 0,
		});
		setShowProductForm(true);
	};

	const deleteProduct = async (id) => {
		if (!window.confirm("Delete this item?")) return;
		try {
			await productAPI.delete(id);
			setProducts((prev) => prev.filter((p) => p._id !== id));
		} catch (error) {
			console.error("Error deleting product:", error);
			alert(error.response?.data?.message || "Error deleting product");
		}
	};

	const handleUpdateStatus = async (orderId, newStatus) => {
		try {
			const response = await orderAPI.updateStatus(orderId, newStatus);
			setOrders((prev) =>
				prev.map((o) => (o._id === orderId ? response.data : o)),
			);
		} catch (error) {
			console.error("Error updating order status:", error);
			alert(error.response?.data?.message || "Error updating order");
		}
	};

	const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

	const toggleDay = (day) =>
		setForm((prev) => ({
			...prev,
			open_days: prev.open_days.includes(day)
				? prev.open_days.filter((d) => d !== day)
				: [...prev.open_days, day],
		}));

	const getUserRole = () => profile?.role || user?.role || "user";
	const isAdmin = getUserRole() === "admin";

	// Helper function to get product image from images array or image_url
	const getProductImage = (product) => {
		if (product.images && product.images.length > 0) {
			return product.images[0];
		}
		return product.image_url || null;
	};

	if (getUserRole() !== "business_owner" && getUserRole() !== "admin") {
		return (
			<div className="text-center py-20 text-gray-500">Access denied</div>
		);
	}

	if (loading)
		return (
			<div className="flex justify-center py-20">
				<LoadingSpinner size="lg" />
			</div>
		);

	return (
		<>
			<MetaDataInsert
				title={isNew ? "Register Business" : "Business Dashboard"}
				description={
					isNew
						? `List your business on ${data.metadata.name} to reach hundreds of local customers. Free registration for Tassia Complex businesses.`
						: "Manage your business profile, products, orders, and analytics from your dashboard."
				}
			/>
			<section className="max-w-3xl mx-auto px-4 py-4 space-y-4 mb-20">
				<div className="flex items-center gap-3">
					<Link
						to="/profile"
						className="p-2 rounded-full hover:bg-gray-100"
					>
						<ChevronLeft size={20} />
					</Link>
					<div>
						<h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
							<Store size={20} className="text-orange-500" />
							{isNew
								? "Register Business"
								: business?.businessName || "Dashboard"}
						</h1>
						{business && (
							<span
								className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
									business.isVerified
										? "bg-green-100 text-green-700"
										: business.isActive
											? "bg-yellow-100 text-yellow-700"
											: "bg-red-100 text-red-600"
								}`}
							>
								{business.isVerified
									? "Verified"
									: business.isActive
										? "Active"
										: "Pending"}
							</span>
						)}
					</div>
				</div>

				{!isNew && business && (
					<>
						<div className="grid grid-cols-3 gap-3">
							{[
								{
									icon: (
										<Eye
											size={18}
											className="text-blue-500"
										/>
									),
									label: "Views",
									value: business.viewCount || 0,
								},
								{
									icon: (
										<Star
											size={18}
											className="text-amber-500"
										/>
									),
									label: "Avg Rating",
									value: business.averageRating
										? business.averageRating.toFixed(1)
										: "N/A",
								},
								{
									icon: (
										<ShoppingCart
											size={18}
											className="text-green-500"
										/>
									),
									label: "Orders",
									value: orders.length,
								},
							].map((s) => (
								<div
									key={s.label}
									className="bg-white rounded-2xl border border-gray-100 p-3 text-center shadow-sm"
								>
									<div className="flex justify-center mb-1">
										{s.icon}
									</div>
									<p className="font-extrabold text-gray-900 text-xl">
										{s.value}
									</p>
									<p className="text-xs text-gray-500">
										{s.label}
									</p>
								</div>
							))}
						</div>

						<div className="flex gap-1 bg-gray-100 rounded-2xl p-1 overflow-x-auto">
							{["overview", "products", "orders", "settings"].map(
								(t) => (
									<button
										key={t}
										onClick={() => setTab(t)}
										className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
											tab === t
												? "bg-white text-gray-900 shadow-sm"
												: "text-gray-500 hover:text-gray-700"
										}`}
									>
										{t}
									</button>
								),
							)}
						</div>
					</>
				)}

				{(tab === "settings" || isNew) && (
					<div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4 shadow-sm">
						<h2 className="font-bold text-gray-900 mb-3">
							Business Details
						</h2>

						{/* Business Name */}
						<div>
							<label className="block text-xs font-semibold text-gray-600 mb-1">
								Business Name *
							</label>
							<input
								type="text"
								placeholder="e.g. Mama Njeri's Kitchen"
								value={form.businessName}
								onChange={(e) =>
									setForm((prev) => ({
										...prev,
										businessName: e.target.value,
									}))
								}
								className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
							/>
						</div>

						{/* Tagline */}
						<div>
							<label className="block text-xs font-semibold text-gray-600 mb-1">
								Tagline
							</label>
							<input
								type="text"
								placeholder="Short catchy description (e.g., Best coffee in town!)"
								value={form.tagline}
								onChange={(e) =>
									setForm((prev) => ({
										...prev,
										tagline: e.target.value,
									}))
								}
								className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
							/>
						</div>

						{/* Description */}
						<div>
							<label className="block text-xs font-semibold text-gray-600 mb-1">
								Description
							</label>
							<textarea
								placeholder="Tell customers about your business..."
								value={form.description}
								onChange={(e) =>
									setForm((prev) => ({
										...prev,
										description: e.target.value,
									}))
								}
								rows={3}
								className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
							/>
						</div>

						{/* Category */}
						<div>
							<label className="block text-xs font-semibold text-gray-600 mb-1">
								Category
							</label>
							<select
								value={form.category}
								onChange={(e) =>
									setForm((prev) => ({
										...prev,
										category: e.target.value,
									}))
								}
								className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
							>
								<option value="">Select Category...</option>
								{categories.map((c) => (
									<option key={c._id} value={c.name}>
										{c.name}
									</option>
								))}
							</select>
						</div>

						{/* Phone */}
						<div>
							<label className="block text-xs font-semibold text-gray-600 mb-1">
								Phone
							</label>
							<input
								type="tel"
								placeholder="0712 345 678"
								value={form.phone}
								onChange={(e) =>
									setForm((prev) => ({
										...prev,
										phone: e.target.value,
									}))
								}
								className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
							/>
						</div>

						{/* WhatsApp */}
						<div>
							<label className="block text-xs font-semibold text-gray-600 mb-1">
								WhatsApp
							</label>
							<input
								type="tel"
								placeholder="254712345678 (include country code)"
								value={form.whatsapp}
								onChange={(e) =>
									setForm((prev) => ({
										...prev,
										whatsapp: e.target.value,
									}))
								}
								className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
							/>
						</div>

						{/* Email */}
						<div>
							<label className="block text-xs font-semibold text-gray-600 mb-1">
								Email
							</label>
							<input
								type="email"
								placeholder="contact@yourbusiness.com"
								value={form.email}
								onChange={(e) =>
									setForm((prev) => ({
										...prev,
										email: e.target.value,
									}))
								}
								className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
							/>
						</div>

						{/* Location Coordinates */}
						<div className="grid grid-cols-3 gap-3">
							<div>
								<label className="block text-xs font-semibold text-gray-600 mb-1">
									Latitude
								</label>
								<input
									type="text"
									placeholder="e.g., -1.2921"
									value={form.location.coordinates.lat || ""}
									onChange={(e) =>
										setForm((prev) => ({
											...prev,
											location: {
												...prev.location,
												coordinates: {
													...prev.location
														.coordinates,
													lat: e.target.value,
												},
											},
										}))
									}
									className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
								/>
								<p className="text-[10px] text-gray-400 mt-0.5">
									Get from Google Maps
								</p>
							</div>
							<div>
								<label className="block text-xs font-semibold text-gray-600 mb-1">
									Longitude
								</label>
								<input
									type="text"
									placeholder="e.g., 36.8219"
									value={form.location.coordinates.lng || ""}
									onChange={(e) =>
										setForm((prev) => ({
											...prev,
											location: {
												...prev.location,
												coordinates: {
													...prev.location
														.coordinates,
													lng: e.target.value,
												},
											},
										}))
									}
									className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
								/>
							</div>
							<div className="flex items-center justify-start">
								<button
									type="button"
									onClick={getCurrentLocation}
									disabled={saving}
									className="w-full px-3 py-2.5 rounded-lg text-xs font-medium transition-all bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
								>
									{saving
										? "📍 Getting location..."
										: "📍 Use My Location"}
								</button>
							</div>
						</div>

						{/* Address */}
						<div>
							<label className="block text-xs font-semibold text-gray-600 mb-1">
								Address
							</label>
							<input
								type="text"
								placeholder="e.g. Tassia Complex, Block B"
								value={form.location.address}
								onChange={(e) =>
									setForm((prev) => ({
										...prev,
										location: {
											...prev.location,
											address: e.target.value,
										},
									}))
								}
								className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
							/>
						</div>

						{/* Floor / Unit */}
						<div>
							<label className="block text-xs font-semibold text-gray-600 mb-1">
								Floor / Unit
							</label>
							<input
								type="text"
								placeholder="e.g. Ground Floor, Shop 12"
								value={form.location.floor_unit}
								onChange={(e) =>
									setForm((prev) => ({
										...prev,
										location: {
											...prev.location,
											floor_unit: e.target.value,
										},
									}))
								}
								className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
							/>
						</div>

						{/* Cover Image URL */}
						<div>
							<label className="block text-xs font-semibold text-gray-600 mb-1">
								Cover Image URL
							</label>
							<input
								type="url"
								placeholder="https://..."
								value={form.cover_image}
								onChange={(e) =>
									setForm((prev) => ({
										...prev,
										cover_image: e.target.value,
									}))
								}
								className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
							/>
						</div>

						{/* Opening Hours */}
						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-xs font-semibold text-gray-600 mb-1">
									Opens
								</label>
								<input
									type="time"
									value={form.opening_time}
									onChange={(e) =>
										setForm((prev) => ({
											...prev,
											opening_time: e.target.value,
										}))
									}
									className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-gray-600 mb-1">
									Closes
								</label>
								<input
									type="time"
									value={form.closing_time}
									onChange={(e) =>
										setForm((prev) => ({
											...prev,
											closing_time: e.target.value,
										}))
									}
									className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
								/>
							</div>
						</div>

						{/* Open Days */}
						<div>
							<label className="block text-xs font-semibold text-gray-600 mb-2">
								Open Days
							</label>
							<div className="flex gap-1.5 flex-wrap">
								{DAYS.map((day) => (
									<button
										key={day}
										type="button"
										onClick={() => toggleDay(day)}
										className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
											form.open_days.includes(day)
												? "bg-orange-500 text-white"
												: "bg-gray-100 text-gray-600"
										}`}
									>
										{day}
									</button>
								))}
							</div>
						</div>

						{/* Delivery Available Toggle */}
						<label className="flex items-center gap-2.5 cursor-pointer">
							<div
								onClick={() =>
									setForm((prev) => ({
										...prev,
										delivery_available:
											!prev.delivery_available,
									}))
								}
								className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
									form.delivery_available
										? "bg-orange-500"
										: "bg-gray-300"
								}`}
							>
								<div
									className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
										form.delivery_available
											? "translate-x-5"
											: "translate-x-1"
									}`}
								/>
							</div>
							<span className="text-sm text-gray-700 font-medium">
								Offer Delivery
							</span>
						</label>

						{/* Delivery Fee & Min Order */}
						{form.delivery_available && (
							<div className="grid grid-cols-2 gap-3">
								<div>
									<label className="block text-xs font-semibold text-gray-600 mb-1">
										Delivery Fee (KES)
									</label>
									<input
										type="number"
										placeholder="Delivery Fee (KES)"
										value={form.delivery_fee}
										onChange={(e) =>
											setForm((prev) => ({
												...prev,
												delivery_fee: Number(
													e.target.value,
												),
											}))
										}
										className="border w-full border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
									/>
								</div>

								<div>
									<label className="block text-xs font-semibold text-gray-600 mb-1">
										Min Order (KES)
									</label>
									<input
										type="number"
										placeholder="Min Order (KES)"
										value={form.min_order}
										onChange={(e) =>
											setForm((prev) => ({
												...prev,
												min_order: Number(
													e.target.value,
												),
											}))
										}
										className="border w-full border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
									/>
								</div>
							</div>
						)}

						{/* Submit Button */}
						<button
							onClick={handleSaveBusiness}
							disabled={saving}
							className="w-full bg-orange-500 text-white py-3 rounded-2xl font-bold hover:bg-orange-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
						>
							<Save size={18} />{" "}
							{saving
								? "Saving..."
								: isNew
									? "Submit for Approval"
									: "Save Changes"}
						</button>

						{isNew && (
							<p className="text-xs text-gray-400 text-center">
								Your listing will be reviewed before going live
							</p>
						)}
					</div>
				)}

				{/* Products Tab */}
				{tab === "products" && business && (
					<div className="space-y-3">
						<button
							onClick={() => {
								setShowProductForm(true);
								setEditingProduct(null);
								setProductForm({
									name: "",
									description: "",
									price: 0,
									category: "general",
									image_url: "",
									isAvailable: true,
									stock: 0,
								});
							}}
							className="w-full flex items-center justify-center gap-2 bg-orange-50 text-orange-600 border border-orange-200 py-2.5 rounded-2xl font-semibold text-sm hover:bg-orange-100 transition-colors"
						>
							<Plus size={16} /> Add Product / Service
						</button>

						{showProductForm && (
							<div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
								<div className="flex items-center justify-between">
									<h3 className="font-bold text-gray-900 text-sm">
										{editingProduct
											? "Edit Item"
											: "New Item"}
									</h3>
									<button
										onClick={() => {
											setShowProductForm(false);
											setEditingProduct(null);
										}}
									>
										<X
											size={16}
											className="text-gray-400"
										/>
									</button>
								</div>

								<input
									placeholder="Item Name *"
									value={productForm.name}
									onChange={(e) =>
										setProductForm((prev) => ({
											...prev,
											name: e.target.value,
										}))
									}
									className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
								/>

								<textarea
									placeholder="Description"
									value={productForm.description}
									onChange={(e) =>
										setProductForm((prev) => ({
											...prev,
											description: e.target.value,
										}))
									}
									rows={2}
									className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-orange-400"
								/>

								<input
									type="number"
									placeholder="Price (KES) *"
									value={productForm.price}
									onChange={(e) =>
										setProductForm((prev) => ({
											...prev,
											price: Number(e.target.value),
										}))
									}
									className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
								/>

								<select
									value={productForm.category}
									onChange={(e) =>
										setProductForm((prev) => ({
											...prev,
											category: e.target.value,
										}))
									}
									className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
								>
									<option value="general">General</option>
									<option value="food">
										Food & Beverages
									</option>
									<option value="clothing">
										Clothing & Fashion
									</option>
									<option value="electronics">
										Electronics
									</option>
									<option value="beauty">
										Beauty & Personal Care
									</option>
									<option value="services">Services</option>
								</select>

								<input
									placeholder="Image URL"
									value={productForm.image_url}
									onChange={(e) =>
										setProductForm((prev) => ({
											...prev,
											image_url: e.target.value,
										}))
									}
									className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
								/>

								<div className="grid grid-cols-2 gap-3">
									<div>
										<label className="block text-xs font-semibold text-gray-600 mb-1">
											Stock Quantity
										</label>
										<input
											type="number"
											placeholder="Stock"
											value={productForm.stock}
											onChange={(e) =>
												setProductForm((prev) => ({
													...prev,
													stock: Number(
														e.target.value,
													),
												}))
											}
											className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
										/>
									</div>
									<div>
										<label className="block text-xs font-semibold text-gray-600 mb-1">
											Available
										</label>
										<label className="flex items-center gap-2 cursor-pointer mt-2">
											<input
												type="checkbox"
												checked={
													productForm.isAvailable
												}
												onChange={(e) =>
													setProductForm((prev) => ({
														...prev,
														isAvailable:
															e.target.checked,
													}))
												}
												className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
											/>
											<span className="text-sm text-gray-600">
												Available for purchase
											</span>
										</label>
									</div>
								</div>

								<button
									onClick={handleAddProduct}
									className="w-full bg-orange-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-orange-600 transition-colors"
								>
									{editingProduct
										? "Update Item"
										: "Add Item"}
								</button>
							</div>
						)}

						{products.length === 0 ? (
							<div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
								<Package
									size={40}
									className="text-gray-300 mx-auto mb-2"
								/>
								<p className="text-gray-500 text-sm">
									No products or services yet
								</p>
							</div>
						) : (
							products.map((product) => (
								<div
									key={product._id}
									className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm"
								>
									{getProductImage(product) && (
										<img
											src={getProductImage(product)}
											alt={product.name}
											className="w-12 h-12 rounded-lg object-cover shrink-0"
										/>
									)}
									<div className="flex-1 min-w-0">
										<p className="font-semibold text-gray-900 text-sm">
											{product.name}
										</p>
										<p className="text-orange-500 font-bold text-sm">
											KES {product.price.toLocaleString()}
										</p>
										<div className="flex items-center gap-2 mt-1">
											<span className="text-xs text-gray-400 capitalize">
												{product.category || "general"}
											</span>
											{!product.isAvailable && (
												<span className="text-xs text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">
													Out of Stock
												</span>
											)}
											{product.stock > 0 &&
												product.stock < 10 && (
													<span className="text-xs text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-full">
														Only {product.stock}{" "}
														left
													</span>
												)}
										</div>
									</div>
									<div className="flex gap-1">
										<button
											onClick={() => editProduct(product)}
											className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
										>
											<Edit2 size={15} />
										</button>
										<button
											onClick={() =>
												deleteProduct(product._id)
											}
											className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
										>
											<Trash2 size={15} />
										</button>
									</div>
								</div>
							))
						)}
					</div>
				)}

				{tab === "orders" && business && (
					// <div className="max-w-xl mx-auto px-4 py-6 mb-20">
					<div className="max-w-xl mx-auto mb-20">
						<OrdersTab
							orders={orders}
							onUpdateStatus={handleUpdateStatus}
						/>
					</div>
				)}

				{/* Overview Tab */}
				{tab === "overview" && business && (
					<div className="space-y-4">
						{!business.isVerified && (
							<div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
								<p className="text-yellow-800 font-semibold text-sm">
									Awaiting Approval
								</p>
								<p className="text-yellow-700 text-xs mt-1">
									Your business is under review. This usually
									takes 24-48 hours.
								</p>
							</div>
						)}

						<div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2 shadow-sm">
							<h2 className="font-bold text-gray-900 mb-3">
								Quick Info
							</h2>
							<p className="text-sm text-gray-600">
								<span className="font-medium">Category:</span>{" "}
								{business.category || "Uncategorized"}
							</p>
							<p className="text-sm text-gray-600">
								<span className="font-medium">Location:</span>{" "}
								{business.location?.label ||
									business.location?.address ||
									"Not specified"}
							</p>
							<p className="text-sm text-gray-600">
								<span className="font-medium">Hours:</span>{" "}
								{business.opening_time} –{" "}
								{business.closing_time}
							</p>
							<p className="text-sm text-gray-600">
								<span className="font-medium">Products:</span>{" "}
								{products.length} listed
							</p>
							{business.tagline && (
								<p className="text-sm text-gray-600">
									<span className="font-medium">
										Tagline:
									</span>{" "}
									{business.tagline}
								</p>
							)}
						</div>

						{business.slug && (
							<Link
								to={`/business/${business.slug}`}
								className="block w-full text-center bg-gray-900 text-white py-3 rounded-2xl font-semibold text-sm hover:bg-gray-800 transition-colors"
							>
								View Public Profile
							</Link>
						)}
					</div>
				)}
			</section>
		</>
	);
}
