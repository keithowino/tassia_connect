import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
	User,
	Phone,
	Heart,
	Store,
	LogOut,
	Edit2,
	Check,
	X,
	Mail,
	Calendar,
} from "lucide-react";
import { useAuth } from "../lib/context/AuthContext";
import { businessAPI, favoritesAPI, userAPI } from "../lib/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import BusinessCard from "../components/business/BusinessCard";
import MetaDataInsert from "../lib/MetaDataInsert";
import data from "../lib/data";

export default function Profile() {
	const { user, profile, signOut, refreshProfile } = useAuth();
	const navigate = useNavigate();
	const [favorites, setFavorites] = useState([]);
	const [myBusinesses, setMyBusinesses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editing, setEditing] = useState(false);
	const [editForm, setEditForm] = useState({
		fullName: "",
		phoneNumber: "",
		location: "",
	});
	const [saving, setSaving] = useState(false);
	const [activeTab, setActiveTab] = useState("favorites");

	// Redirect if not logged in
	useEffect(() => {
		if (!user) {
			navigate("/auth");
			return;
		}

		// Set edit form with user data
		setEditForm({
			fullName: profile?.fullName || user?.fullName || "",
			phoneNumber: profile?.phoneNumber || user?.phoneNumber || "",
			location: profile?.location || user?.location || "",
		});
	}, [user, profile, navigate]);

	// Fetch user data
	useEffect(() => {
		if (!user) return;

		const fetchUserData = async () => {
			setLoading(true);
			try {
				// Fetch favorites in parallel with businesses
				const [favoritesRes, businessesRes] = await Promise.all([
					favoritesAPI.getMyFavorites().catch(() => ({ data: [] })),
					businessAPI.getMyBusinesses().catch(() => ({ data: [] })),
				]);

				// Process favorites
				const favoriteBusinesses = favoritesRes.data
					.filter((fav) => fav.businessId)
					.map((fav) => fav.businessId);

				// Fetch full business details for favorites
				const favoriteDetails = [];
				for (const biz of favoriteBusinesses) {
					// If business object is populated, use it; otherwise fetch
					if (biz._id) {
						favoriteDetails.push(biz);
					}
				}
				setFavorites(favoriteDetails);

				// Process user's businesses
				const userBusinesses = businessesRes.data || [];
				setMyBusinesses(userBusinesses);
			} catch (error) {
				console.error("Error fetching profile data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, [user]);

	const handleSaveProfile = async () => {
		if (!user) return;
		setSaving(true);

		try {
			const response = await userAPI.updateProfile({
				fullName: editForm.fullName,
				phoneNumber: editForm.phoneNumber,
				location: editForm.location,
			});

			// Refresh user data
			await refreshProfile();
			setEditing(false);
		} catch (error) {
			console.error("Error updating profile:", error);
			alert(error.response?.data?.message || "Failed to update profile");
		} finally {
			setSaving(false);
		}
	};

	const handleSignOut = async () => {
		await signOut();
		navigate("/");
	};

	const getUserRole = () => {
		return profile?.role || user?.role || "user";
	};

	const getUserFullName = () => {
		return profile?.fullName || user?.fullName || "User";
	};

	const getUserEmail = () => {
		return user?.email || profile?.email || "";
	};

	const getUserPhone = () => {
		return profile?.phoneNumber || user?.phoneNumber || "";
	};

	const getUserLocation = () => {
		return profile?.location || user?.location || "";
	};

	const getUserAvatar = () => {
		return profile?.profileImage || user?.profileImage || null;
	};

	const formatDate = (dateString) => {
		if (!dateString) return "N/A";
		const date = new Date(dateString);
		return date.toLocaleDateString("en-KE", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	if (!user) return null;

	const isBusinessOwner =
		getUserRole() === "business_owner" || getUserRole() === "admin";
	const isAdmin = getUserRole() === "admin";

	return (
		<>
			<MetaDataInsert
				title={
					user
						? `${getUserFullName() || getUserEmail()}'s Profile`
						: "My Profile"
				}
				description={
					user
						? `View ${getUserFullName()}'s profile, saved businesses, and order history on ${data.metadata.name}.`
						: "Manage your Tassia Connect profile, view saved businesses, and track orders."
				}
			/>
			<section className="max-w-xl mx-auto px-4 py-4 space-y-4 mb-20">
				{/* Profile Card */}
				<div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
					<div className="flex items-start gap-4">
						{/* Avatar */}
						<div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
							{getUserAvatar() ? (
								<img
									src={getUserAvatar()}
									alt={getUserFullName()}
									className="w-16 h-16 rounded-2xl object-cover"
								/>
							) : (
								<span className="text-white font-extrabold text-2xl">
									{getUserFullName()?.[0]?.toUpperCase() ||
										"U"}
								</span>
							)}
						</div>

						<div className="flex-1 min-w-0">
							{editing ? (
								<div className="space-y-2">
									<input
										value={editForm.fullName}
										onChange={(e) =>
											setEditForm((p) => ({
												...p,
												fullName: e.target.value,
											}))
										}
										className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
										placeholder="Full name"
									/>
									<input
										value={editForm.phoneNumber}
										onChange={(e) =>
											setEditForm((p) => ({
												...p,
												phoneNumber: e.target.value,
											}))
										}
										className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
										placeholder="Phone number"
									/>
									<input
										value={editForm.location}
										onChange={(e) =>
											setEditForm((p) => ({
												...p,
												location: e.target.value,
											}))
										}
										className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
										placeholder="Location (e.g., Tassia, Nairobi)"
									/>
									<div className="flex gap-2">
										<button
											onClick={handleSaveProfile}
											disabled={saving}
											className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-600 disabled:opacity-50 transition-colors"
										>
											<Check size={13} />{" "}
											{saving ? "Saving..." : "Save"}
										</button>
										<button
											onClick={() => {
												setEditing(false);
												setEditForm({
													fullName: getUserFullName(),
													phoneNumber: getUserPhone(),
													location: getUserLocation(),
												});
											}}
											className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors"
										>
											<X size={13} /> Cancel
										</button>
									</div>
								</div>
							) : (
								<>
									<div className="flex items-center justify-between">
										<h1 className="font-bold text-gray-900 text-lg leading-tight">
											{getUserFullName()}
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

									<div className="space-y-1 mt-1">
										<p className="text-gray-500 text-sm flex items-center gap-1.5">
											<Mail size={13} /> {getUserEmail()}
										</p>
										{getUserPhone() && (
											<p className="text-gray-500 text-sm flex items-center gap-1.5">
												<Phone size={13} />{" "}
												{getUserPhone()}
											</p>
										)}
										{getUserLocation() && (
											<p className="text-gray-500 text-sm flex items-center gap-1.5">
												📍 {getUserLocation()}
											</p>
										)}
									</div>

									<div className="flex items-center gap-2 mt-2">
										<span className="inline-block text-xs bg-orange-100 text-orange-700 font-medium px-2 py-0.5 rounded-full capitalize">
											{getUserRole().replace("_", " ")}
										</span>
										{user?.createdAt && (
											<span className="inline-block text-xs text-gray-400">
												Member since{" "}
												{formatDate(user.createdAt)}
											</span>
										)}
									</div>
								</>
							)}
						</div>
					</div>
				</div>

				{/* Tabs */}
				<div className="flex gap-1 bg-gray-100 rounded-2xl p-1">
					<button
						onClick={() => setActiveTab("favorites")}
						className={`flex-1 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
							activeTab === "favorites"
								? "bg-white text-gray-900 shadow-sm"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						<Heart size={15} /> Saved ({favorites.length})
					</button>

					{isBusinessOwner && (
						<button
							onClick={() => setActiveTab("businesses")}
							className={`flex-1 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
								activeTab === "businesses"
									? "bg-white text-gray-900 shadow-sm"
									: "text-gray-500 hover:text-gray-700"
							}`}
						>
							<Store size={15} /> My Businesses (
							{myBusinesses.length})
						</button>
					)}

					{isAdmin && (
						<button
							onClick={() => setActiveTab("admin")}
							className={`flex-1 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
								activeTab === "admin"
									? "bg-white text-gray-900 shadow-sm"
									: "text-gray-500 hover:text-gray-700"
							}`}
						>
							⚙️ Admin
						</button>
					)}
				</div>

				{/* Tab Content */}
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
							<p className="text-gray-500 font-medium">
								No saved businesses yet
							</p>
							<p className="text-sm text-gray-400 mt-1">
								Save businesses you love to see them here
							</p>
							<Link
								to="/discover"
								className="mt-4 inline-block bg-orange-500 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors"
							>
								Explore Businesses
							</Link>
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{favorites.map((biz) => (
								<BusinessCard
									key={biz._id || biz.id}
									business={biz}
								/>
							))}
						</div>
					)
				) : activeTab === "businesses" ? (
					<div>
						<Link
							to="/dashboard/new"
							className="block mb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center py-3 rounded-xl font-semibold text-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm"
						>
							+ Register New Business
						</Link>

						{myBusinesses.length === 0 ? (
							<div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
								<Store
									size={40}
									className="text-gray-300 mx-auto mb-3"
								/>
								<p className="text-gray-500 font-medium">
									No businesses listed yet
								</p>
								<p className="text-sm text-gray-400 mt-1">
									Register your first business to get started
								</p>
							</div>
						) : (
							<div className="space-y-3">
								{myBusinesses.map((biz) => (
									<div
										key={biz._id}
										className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 hover:shadow-sm transition-shadow"
									>
										<div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
											{biz.logo ? (
												<img
													src={biz.logo}
													alt={biz.businessName}
													className="w-12 h-12 rounded-xl object-cover"
												/>
											) : (
												<Store
													size={20}
													className="text-orange-500"
												/>
											)}
										</div>

										<div className="flex-1">
											<p className="font-bold text-gray-900">
												{biz.businessName}
											</p>
											<p className="text-sm text-gray-500">
												{biz.category ||
													"Uncategorized"}
											</p>
											<span
												className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
													biz.isVerified
														? "bg-green-100 text-green-700"
														: biz.isActive
															? "bg-yellow-100 text-yellow-700"
															: "bg-red-100 text-red-600"
												}`}
											>
												{biz.isVerified
													? "Verified"
													: biz.isActive
														? "Active"
														: "Inactive"}
											</span>
										</div>

										<Link
											to={`/dashboard/${biz._id}`}
											className="text-orange-500 text-sm font-semibold hover:text-orange-600 transition-colors"
										>
											Manage →
										</Link>
									</div>
								))}
							</div>
						)}
					</div>
				) : activeTab === "admin" && isAdmin ? (
					<div className="space-y-3">
						<Link
							to="/admin"
							className="block bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition-shadow"
						>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
									<Store
										size={20}
										className="text-purple-600"
									/>
								</div>
								<div>
									<p className="font-semibold text-gray-900">
										Manage Businesses
									</p>
									<p className="text-sm text-gray-500">
										Review and manage all businesses
									</p>
								</div>
							</div>
						</Link>

						<Link
							to="/admin/categories"
							className="block bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition-shadow"
						>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
									📁
								</div>
								<div>
									<p className="font-semibold text-gray-900">
										Manage Categories
									</p>
									<p className="text-sm text-gray-500">
										Add or edit business categories
									</p>
								</div>
							</div>
						</Link>

						<Link
							to="/admin/users"
							className="block bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition-shadow"
						>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
									<User
										size={20}
										className="text-green-600"
									/>
								</div>
								<div>
									<p className="font-semibold text-gray-900">
										Manage Users
									</p>
									<p className="text-sm text-gray-500">
										View and manage user accounts
									</p>
								</div>
							</div>
						</Link>
					</div>
				) : null}

				{/* Sign Out Button */}
				<button
					onClick={handleSignOut}
					className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-2xl font-semibold text-sm hover:bg-red-100 transition-colors mt-4"
				>
					<LogOut size={16} /> Sign Out
				</button>
			</section>
		</>
	);
}
