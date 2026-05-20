import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
	User,
	Phone,
	Heart,
	Store,
	LogOut,
	CreditCard as Edit2,
	Check,
	X,
} from "lucide-react";
import { db } from "../lib/firebase.config";
import {
	collection,
	query,
	where,
	getDocs,
	doc,
	getDoc,
	updateDoc,
	orderBy,
} from "firebase/firestore";
import { useAuth } from "../lib/context/AuthContext";
import LoadingSpinner from "../components/common/LoadingSpinner";
import BusinessCard from "../components/business/BusinessCard";
import MetaDataInsert from "../lib/MetaDataInsert";

export default function Profile() {
	const { user, profile, signOut, refreshProfile } = useAuth();
	const navigate = useNavigate();
	const [favorites, setFavorites] = useState([]);
	const [myBusinesses, setMyBusinesses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editing, setEditing] = useState(false);
	const [editForm, setEditForm] = useState({ full_name: "", phone: "" });
	const [saving, setSaving] = useState(false);
	const [activeTab, setActiveTab] = useState("favorites");

	useEffect(() => {
		if (!user) {
			navigate("/auth");
			return;
		}
		setEditForm({
			full_name: profile?.full_name || "",
			phone: profile?.phone || "",
		});

		const fetchData = async () => {
			setLoading(true);
			try {
				// Fetch favorites with business details
				const favoritesQuery = query(
					collection(db, "favorites"),
					where("user_id", "==", user.uid),
					orderBy("created_at", "desc"),
				);
				const favoritesSnapshot = await getDocs(favoritesQuery);
				const favoriteBusinesses = [];

				for (const favDoc of favoritesSnapshot.docs) {
					const favData = favDoc.data();
					if (favData.business_id) {
						// Fetch the actual business data using getDoc with document reference
						const businessRef = doc(
							db,
							"businesses",
							favData.business_id,
						);
						const businessDoc = await getDoc(businessRef);

						if (businessDoc.exists()) {
							const businessData = {
								id: businessDoc.id,
								...businessDoc.data(),
							};

							// Fetch category if exists - using getDoc
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

							favoriteBusinesses.push(businessData);
						}
					}
				}
				setFavorites(favoriteBusinesses);

				// Fetch user's businesses if business owner or admin
				if (
					profile?.role === "business_owner" ||
					profile?.role === "admin"
				) {
					const businessesQuery = query(
						collection(db, "businesses"),
						where("owner_id", "==", user.uid),
						orderBy("created_at", "desc"),
					);
					const businessesSnapshot = await getDocs(businessesQuery);
					const userBusinesses = [];

					for (const bizDoc of businessesSnapshot.docs) {
						const businessData = {
							id: bizDoc.id,
							...bizDoc.data(),
						};

						// Fetch category if exists - using getDoc
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

						userBusinesses.push(businessData);
					}
					setMyBusinesses(userBusinesses);
				}
			} catch (error) {
				console.error("Error fetching profile data:", error);
			}
			setLoading(false);
		};

		fetchData();
	}, [user, profile, navigate]);

	const handleSaveProfile = async () => {
		if (!user) return;
		setSaving(true);
		try {
			const profileRef = doc(db, "profiles", user.uid);
			await updateDoc(profileRef, {
				full_name: editForm.full_name,
				phone: editForm.phone,
				updated_at: new Date().toISOString(),
			});
			await refreshProfile();
		} catch (error) {
			console.error("Error updating profile:", error);
		} finally {
			setSaving(false);
			setEditing(false);
		}
	};

	const handleSignOut = async () => {
		await signOut();
		navigate("/");
	};

	if (!user) return null;

	return (
		<>
			<MetaDataInsert title="Profile" />
			<section className="max-w-xl mx-auto px-4 py-4 space-y-4">
				{/* Profile Card */}
				<div className="bg-white rounded-2xl border border-gray-100 p-5">
					<div className="flex items-start gap-4">
						<div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center shrink-0">
							{profile?.avatar_url ? (
								<img
									src={profile.avatar_url}
									alt={profile?.full_name || "Profile"}
									className="w-16 h-16 rounded-2xl object-cover"
								/>
							) : (
								<span className="text-orange-600 font-extrabold text-2xl">
									{profile?.full_name?.[0]?.toUpperCase() ||
										"U"}
								</span>
							)}
						</div>
						<div className="flex-1 min-w-0">
							{editing ? (
								<div className="space-y-2">
									<input
										value={editForm.full_name}
										onChange={(e) =>
											setEditForm((p) => ({
												...p,
												full_name: e.target.value,
											}))
										}
										className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
										placeholder="Full name"
									/>
									<input
										value={editForm.phone}
										onChange={(e) =>
											setEditForm((p) => ({
												...p,
												phone: e.target.value,
											}))
										}
										className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
										placeholder="Phone number"
									/>
									<div className="flex gap-2">
										<button
											onClick={handleSaveProfile}
											disabled={saving}
											className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-600 disabled:opacity-50"
										>
											<Check size={13} />{" "}
											{saving ? "Saving..." : "Save"}
										</button>
										<button
											onClick={() => setEditing(false)}
											className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-200"
										>
											<X size={13} /> Cancel
										</button>
									</div>
								</div>
							) : (
								<>
									<div className="flex items-center justify-between">
										<h1 className="font-bold text-gray-900 text-lg leading-tight">
											{profile?.full_name || "User"}
										</h1>
										<button
											onClick={() => setEditing(true)}
											className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
											aria-label="Edit profile"
										>
											<Edit2
												size={16}
												className="text-gray-400"
											/>
										</button>
									</div>
									<p className="text-gray-500 text-sm">
										{user.email}
									</p>
									{profile?.phone && (
										<div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
											<Phone size={13} /> {profile.phone}
										</div>
									)}
									<span className="mt-1.5 inline-block text-xs bg-orange-100 text-orange-700 font-medium px-2 py-0.5 rounded-full capitalize">
										{profile?.role?.replace("_", " ") ||
											"user"}
									</span>
								</>
							)}
						</div>
					</div>
				</div>

				{/* Tabs */}
				<div className="flex gap-1 bg-gray-100 rounded-2xl p-1">
					<button
						onClick={() => setActiveTab("favorites")}
						className={`flex-1 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${activeTab === "favorites" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
					>
						<Heart size={15} /> Saved ({favorites.length})
					</button>
					{(profile?.role === "business_owner" ||
						profile?.role === "admin") && (
						<button
							onClick={() => setActiveTab("businesses")}
							className={`flex-1 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${activeTab === "businesses" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
						>
							<Store size={15} /> My Businesses (
							{myBusinesses.length})
						</button>
					)}
				</div>

				{loading ? (
					<div className="flex justify-center py-12">
						<LoadingSpinner size="lg" />
					</div>
				) : activeTab === "favorites" ? (
					favorites.length === 0 ? (
						<div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
							<Heart
								size={40}
								className="text-gray-300 mx-auto mb-3"
							/>
							<p className="text-gray-500">
								No saved businesses yet
							</p>
							<Link
								to="/discover"
								className="mt-3 inline-block text-orange-500 font-medium text-sm"
							>
								Explore businesses
							</Link>
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{favorites.map((biz) => (
								<BusinessCard key={biz.id} business={biz} />
							))}
						</div>
					)
				) : (
					<div>
						<Link
							to="/dashboard/new"
							className="block mb-3 bg-orange-500 text-white text-center py-2.5 rounded-xl font-semibold text-sm hover:bg-orange-600 transition-colors"
						>
							+ Register New Business
						</Link>
						{myBusinesses.length === 0 ? (
							<div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
								<Store
									size={40}
									className="text-gray-300 mx-auto mb-3"
								/>
								<p className="text-gray-500">
									No businesses listed yet
								</p>
							</div>
						) : (
							<div className="space-y-3">
								{myBusinesses.map((biz) => (
									<div
										key={biz.id}
										className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3"
									>
										<div className="flex-1">
											<p className="font-bold text-gray-900">
												{biz.name}
											</p>
											<p className="text-sm text-gray-500">
												{biz.categories?.name ||
													"Uncategorized"}
											</p>
											<span
												className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
													biz.status === "approved"
														? "bg-green-100 text-green-700"
														: biz.status ===
															  "pending"
															? "bg-yellow-100 text-yellow-700"
															: "bg-red-100 text-red-600"
												}`}
											>
												{biz.status || "pending"}
											</span>
										</div>
										<Link
											to={`/dashboard/${biz.id}`}
											className="text-orange-500 text-sm font-semibold hover:text-orange-600"
										>
											Manage
										</Link>
									</div>
								))}
							</div>
						)}
					</div>
				)}

				<button
					onClick={handleSignOut}
					className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-2xl font-semibold text-sm hover:bg-red-100 transition-colors"
				>
					<LogOut size={16} /> Sign Out
				</button>
			</section>
		</>
	);
}
