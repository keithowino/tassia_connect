import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
	Store,
	Plus,
	CreditCard as Edit2,
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
import LoadingSpinner from "../components/common/LoadingSpinner";
import MetaDataInsert from "../lib/MetaDataInsert";

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

	const [form, setForm] = useState({
		name: "",
		tagline: "",
		description: "",
		category_id: "",
		address: "",
		floor_unit: "",
		location_label: "Tassia Complex",
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
		open_days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	});

	const [productForm, setProductForm] = useState({
		name: "",
		description: "",
		price: 0,
		type: "product",
		image_url: "",
		available: true,
	});

	useEffect(() => {
		if (!user) {
			navigate("/auth");
			return;
		}

		const fetchCategories = async () => {
			const categoriesQuery = query(
				collection(db, "categories"),
				orderBy("sort_order"),
			);
			const categoriesSnapshot = await getDocs(categoriesQuery);
			const categoriesData = categoriesSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setCategories(categoriesData);
		};

		fetchCategories();

		if (!isNew && businessId) {
			const fetchBusinessData = async () => {
				try {
					// Fetch business
					const businessRef = doc(db, "businesses", businessId);
					const businessDoc = await getDoc(businessRef);

					if (!businessDoc.exists()) {
						navigate("/dashboard/new");
						return;
					}

					const businessData = {
						id: businessDoc.id,
						...businessDoc.data(),
					};

					// Fetch category if exists
					if (businessData.category_id) {
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
					}

					setBusiness(businessData);
					setForm({
						name: businessData.name || "",
						tagline: businessData.tagline || "",
						description: businessData.description || "",
						category_id: businessData.category_id || "",
						address: businessData.address || "",
						floor_unit: businessData.floor_unit || "",
						location_label:
							businessData.location_label || "Tassia Complex",
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
						cover_image: businessData.cover_image || "",
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
					const productsQuery = query(
						collection(db, "products_services"),
						where("business_id", "==", businessId),
						orderBy("sort_order"),
					);
					const productsSnapshot = await getDocs(productsQuery);
					const productsData = productsSnapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}));
					setProducts(productsData);

					// Fetch orders
					const ordersQuery = query(
						collection(db, "orders"),
						where("business_id", "==", businessId),
						orderBy("created_at", "desc"),
						limit(20),
					);
					const ordersSnapshot = await getDocs(ordersQuery);
					const ordersData = [];

					for (const orderDoc of ordersSnapshot.docs) {
						const orderData = {
							id: orderDoc.id,
							...orderDoc.data(),
						};

						// Fetch order items
						const orderItemsQuery = query(
							collection(db, "order_items"),
							where("order_id", "==", orderDoc.id),
						);
						const orderItemsSnapshot =
							await getDocs(orderItemsQuery);
						orderData.order_items = orderItemsSnapshot.docs.map(
							(doc) => ({
								id: doc.id,
								...doc.data(),
							}),
						);

						ordersData.push(orderData);
					}
					setOrders(ordersData);
					setLoading(false);
				} catch (error) {
					console.error("Error fetching business data:", error);
					setLoading(false);
				}
			};

			fetchBusinessData();
		}
	}, [user, businessId, isNew, navigate]);

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

	const handleSaveBusiness = async () => {
		if (!user || !form.name.trim()) return;
		setSaving(true);

		try {
			const payload = {
				...form,
				owner_id: user.uid,
				slug: business?.slug || generateSlug(form.name),
				updated_at: new Date().toISOString(),
			};

			if (isNew) {
				payload.created_at = new Date().toISOString();
				payload.status = "pending";
				payload.view_count = 0;
				payload.average_rating = 0;

				const docRef = await addDoc(
					collection(db, "businesses"),
					payload,
				);
				const newBusinessDoc = await getDoc(docRef);
				const newBusiness = { id: docRef.id, ...newBusinessDoc.data() };

				// Fetch category if exists
				if (newBusiness.category_id) {
					const categoryRef = doc(
						db,
						"categories",
						newBusiness.category_id,
					);
					const categoryDoc = await getDoc(categoryRef);
					if (categoryDoc.exists()) {
						newBusiness.categories = {
							id: categoryDoc.id,
							...categoryDoc.data(),
						};
					}
				}

				setBusiness(newBusiness);
				navigate(`/dashboard/${docRef.id}`, { replace: true });
			} else if (business) {
				const businessRef = doc(db, "businesses", business.id);
				await updateDoc(businessRef, payload);

				const updatedBusinessDoc = await getDoc(businessRef);
				const updatedBusiness = {
					id: business.id,
					...updatedBusinessDoc.data(),
				};

				// Fetch category if exists
				if (updatedBusiness.category_id) {
					const categoryRef = doc(
						db,
						"categories",
						updatedBusiness.category_id,
					);
					const categoryDoc = await getDoc(categoryRef);
					if (categoryDoc.exists()) {
						updatedBusiness.categories = {
							id: categoryDoc.id,
							...categoryDoc.data(),
						};
					}
				}

				setBusiness(updatedBusiness);
			}
		} catch (error) {
			console.error("Error saving business:", error);
			alert("Error saving business: " + error.message);
		} finally {
			setSaving(false);
		}
	};

	const handleAddProduct = async () => {
		if (!business || !productForm.name.trim()) return;

		try {
			const payload = {
				...productForm,
				business_id: business.id,
				sort_order: products.length,
				created_at: new Date().toISOString(),
			};

			const docRef = await addDoc(
				collection(db, "products_services"),
				payload,
			);
			const newProduct = { id: docRef.id, ...payload };
			setProducts((prev) => [...prev, newProduct]);
			setProductForm({
				name: "",
				description: "",
				price: 0,
				type: "product",
				image_url: "",
				available: true,
			});
			setShowProductForm(false);
		} catch (error) {
			console.error("Error adding product:", error);
		}
	};

	const deleteProduct = async (id) => {
		if (!window.confirm("Delete this item?")) return;
		try {
			const productRef = doc(db, "products_services", id);
			await deleteDoc(productRef);
			setProducts((prev) => prev.filter((p) => p.id !== id));
		} catch (error) {
			console.error("Error deleting product:", error);
		}
	};

	const updateOrderStatus = async (orderId, status) => {
		try {
			const orderRef = doc(db, "orders", orderId);
			await updateDoc(orderRef, {
				status,
				updated_at: new Date().toISOString(),
			});
			setOrders((prev) =>
				prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
			);
		} catch (error) {
			console.error("Error updating order status:", error);
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

	if (
		!user ||
		(profile?.role !== "business_owner" && profile?.role !== "admin")
	) {
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
			<MetaDataInsert title="Dashboard" />
			<section className="max-w-3xl mx-auto px-4 py-4 space-y-4">
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
								: business?.name || "Dashboard"}
						</h1>
						{business && (
							<span
								className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
									business.status === "approved"
										? "bg-green-100 text-green-700"
										: business.status === "pending"
											? "bg-yellow-100 text-yellow-700"
											: "bg-red-100 text-red-600"
								}`}
							>
								{business.status || "pending"}
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
									value: business.view_count || 0,
								},
								{
									icon: (
										<Star
											size={18}
											className="text-amber-500"
										/>
									),
									label: "Avg Rating",
									value:
										business.average_rating > 0
											? business.average_rating.toFixed(1)
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
									className="bg-white rounded-2xl border border-gray-100 p-3 text-center"
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
										className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
									>
										{t}
									</button>
								),
							)}
						</div>
					</>
				)}

				{(tab === "settings" || isNew) && (
					<div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4">
						<h2 className="font-bold text-gray-900">
							Business Details
						</h2>
						{[
							{
								label: "Business Name *",
								key: "name",
								type: "text",
								placeholder: "e.g. Mama Njeri's Kitchen",
							},
							{
								label: "Tagline",
								key: "tagline",
								type: "text",
								placeholder: "Short catchy description",
							},
							{
								label: "Phone",
								key: "phone",
								type: "tel",
								placeholder: "0712 345 678",
							},
							{
								label: "WhatsApp",
								key: "whatsapp",
								type: "tel",
								placeholder: "254712345678",
							},
							{
								label: "Email",
								key: "email",
								type: "email",
								placeholder: "",
							},
							{
								label: "Address",
								key: "address",
								type: "text",
								placeholder: "e.g. Tassia Complex, Block B",
							},
							{
								label: "Floor / Unit",
								key: "floor_unit",
								type: "text",
								placeholder: "Ground Floor, Shop 12",
							},
							{
								label: "Cover Image URL",
								key: "cover_image",
								type: "url",
								placeholder: "https://...",
							},
						].map((field) => (
							<div key={field.key}>
								<label className="block text-xs font-semibold text-gray-600 mb-1">
									{field.label}
								</label>
								<input
									type={field.type}
									value={form[field.key]}
									onChange={(e) =>
										setForm((prev) => ({
											...prev,
											[field.key]: e.target.value,
										}))
									}
									placeholder={field.placeholder}
									className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
								/>
							</div>
						))}

						<div>
							<label className="block text-xs font-semibold text-gray-600 mb-1">
								Category
							</label>
							<select
								value={form.category_id}
								onChange={(e) =>
									setForm((prev) => ({
										...prev,
										category_id: e.target.value,
									}))
								}
								className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
							>
								<option value="">Select category...</option>
								{categories.map((c) => (
									<option key={c.id} value={c.id}>
										{c.name}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-xs font-semibold text-gray-600 mb-1">
								Description
							</label>
							<textarea
								value={form.description}
								onChange={(e) =>
									setForm((prev) => ({
										...prev,
										description: e.target.value,
									}))
								}
								rows={3}
								placeholder="Tell customers about your business..."
								className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
							/>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-xs font-semibold text-gray-600 mb-1">
									Opens
								</label>
								<input
									type="time"
									value={form.opening_time}
									onChange={(e) =>
										setForm((p) => ({
											...p,
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
										setForm((p) => ({
											...p,
											closing_time: e.target.value,
										}))
									}
									className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
								/>
							</div>
						</div>

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
										className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${form.open_days.includes(day) ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"}`}
									>
										{day}
									</button>
								))}
							</div>
						</div>

						<label className="flex items-center gap-2.5 cursor-pointer">
							<div
								onClick={() =>
									setForm((p) => ({
										...p,
										delivery_available:
											!p.delivery_available,
									}))
								}
								className={`w-10 h-6 rounded-full transition-colors relative ${form.delivery_available ? "bg-orange-500" : "bg-gray-300"}`}
							>
								<div
									className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.delivery_available ? "translate-x-5" : "translate-x-1"}`}
								/>
							</div>
							<span className="text-sm text-gray-700 font-medium">
								Offer Delivery
							</span>
						</label>

						{form.delivery_available && (
							<div className="grid grid-cols-2 gap-3">
								<div>
									<label className="block text-xs font-semibold text-gray-600 mb-1">
										Delivery Fee (KES)
									</label>
									<input
										type="number"
										value={form.delivery_fee}
										onChange={(e) =>
											setForm((p) => ({
												...p,
												delivery_fee: Number(
													e.target.value,
												),
											}))
										}
										className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
									/>
								</div>
								<div>
									<label className="block text-xs font-semibold text-gray-600 mb-1">
										Min Order (KES)
									</label>
									<input
										type="number"
										value={form.min_order}
										onChange={(e) =>
											setForm((p) => ({
												...p,
												min_order: Number(
													e.target.value,
												),
											}))
										}
										className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
									/>
								</div>
							</div>
						)}

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

				{tab === "products" && business && (
					<div className="space-y-3">
						<button
							onClick={() => setShowProductForm(!showProductForm)}
							className="w-full flex items-center justify-center gap-2 bg-orange-50 text-orange-600 border border-orange-200 py-2.5 rounded-2xl font-semibold text-sm hover:bg-orange-100 transition-colors"
						>
							<Plus size={16} /> Add Product / Service
						</button>

						{showProductForm && (
							<div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
								<div className="flex items-center justify-between">
									<h3 className="font-bold text-gray-900 text-sm">
										New Item
									</h3>
									<button
										onClick={() =>
											setShowProductForm(false)
										}
									>
										<X
											size={16}
											className="text-gray-400"
										/>
									</button>
								</div>
								<div className="flex gap-2">
									{["product", "service"].map((t) => (
										<button
											key={t}
											type="button"
											onClick={() =>
												setProductForm((p) => ({
													...p,
													type: t,
												}))
											}
											className={`flex-1 py-2 rounded-xl border text-xs font-semibold capitalize flex items-center justify-center gap-1 transition-all ${productForm.type === t ? "border-orange-400 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-600"}`}
										>
											{t === "product" ? (
												<>
													<Package size={13} />{" "}
													Product
												</>
											) : (
												<>
													<Wrench size={13} /> Service
												</>
											)}
										</button>
									))}
								</div>
								{[
									{
										label: "Name *",
										key: "name",
										type: "text",
									},
									{
										label: "Description",
										key: "description",
										type: "text",
									},
									{
										label: "Image URL",
										key: "image_url",
										type: "url",
									},
								].map((f) => (
									<div key={f.key}>
										<label className="block text-xs font-semibold text-gray-600 mb-1">
											{f.label}
										</label>
										<input
											type={f.type}
											value={productForm[f.key]}
											onChange={(e) =>
												setProductForm((p) => ({
													...p,
													[f.key]: e.target.value,
												}))
											}
											className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
										/>
									</div>
								))}
								<div>
									<label className="block text-xs font-semibold text-gray-600 mb-1">
										Price (KES) *
									</label>
									<input
										type="number"
										value={productForm.price}
										onChange={(e) =>
											setProductForm((p) => ({
												...p,
												price: Number(e.target.value),
											}))
										}
										className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
									/>
								</div>
								<button
									onClick={handleAddProduct}
									className="w-full bg-orange-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-orange-600 transition-colors"
								>
									Add Item
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
									key={product.id}
									className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3"
								>
									{product.image_url && (
										<img
											src={product.image_url}
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
										<span className="text-xs text-gray-400 capitalize">
											{product.type}
										</span>
									</div>
									<button
										onClick={() =>
											deleteProduct(product.id)
										}
										className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
									>
										<Trash2 size={15} />
									</button>
								</div>
							))
						)}
					</div>
				)}

				{tab === "orders" && business && (
					<div className="space-y-3">
						<h2 className="font-bold text-gray-900 flex items-center gap-2">
							<ClipboardList
								size={18}
								className="text-orange-500"
							/>{" "}
							Incoming Orders
						</h2>
						{orders.length === 0 ? (
							<div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
								<TrendingUp
									size={40}
									className="text-gray-300 mx-auto mb-2"
								/>
								<p className="text-gray-500 text-sm">
									No orders yet
								</p>
							</div>
						) : (
							orders.map((order) => (
								<div
									key={order.id}
									className="bg-white rounded-2xl border border-gray-100 p-4"
								>
									<div className="flex items-center justify-between mb-2">
										<span className="font-mono text-xs text-gray-400">
											#
											{order.id.slice(0, 8).toUpperCase()}
										</span>
										<span className="font-bold text-orange-500">
											KES{" "}
											{order.total_amount.toLocaleString()}
										</span>
									</div>
									{order.order_items && (
										<p className="text-sm text-gray-600 mb-2">
											{order.order_items
												.map(
													(i) =>
														`${i.name} ×${i.quantity}`,
												)
												.join(", ")}
										</p>
									)}
									{order.notes && (
										<p className="text-xs text-gray-400 italic mb-2">
											"{order.notes}"
										</p>
									)}
									<div className="flex items-center gap-2 flex-wrap">
										{[
											"pending",
											"accepted",
											"preparing",
											"ready",
											"completed",
										].map((s) => (
											<button
												key={s}
												onClick={() =>
													updateOrderStatus(
														order.id,
														s,
													)
												}
												className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize transition-all ${order.status === s ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
											>
												{s}
											</button>
										))}
									</div>
									<p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
										<Clock size={11} />{" "}
										{order.created_at
											? new Date(
													order.created_at,
												).toLocaleString("en-KE")
											: "Just now"}
									</p>
								</div>
							))
						)}
					</div>
				)}

				{tab === "overview" && business && (
					<div className="space-y-4">
						{business.status === "pending" && (
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
						<div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
							<h2 className="font-bold text-gray-900 mb-3">
								Quick Info
							</h2>
							<p className="text-sm text-gray-600">
								<span className="font-medium">Category:</span>{" "}
								{business.categories?.name || "Uncategorized"}
							</p>
							<p className="text-sm text-gray-600">
								<span className="font-medium">Location:</span>{" "}
								{business.location_label}, {business.floor_unit}
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
						</div>
						<Link
							to={`/business/${business.slug}`}
							className="block w-full text-center bg-gray-900 text-white py-3 rounded-2xl font-semibold text-sm hover:bg-gray-800 transition-colors"
						>
							View Public Profile
						</Link>
					</div>
				)}
			</section>
		</>
	);
}
