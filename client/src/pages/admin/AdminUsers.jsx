import { useState, useEffect } from "react";
import {
	Users,
	Mail,
	Phone,
	Calendar,
	Shield,
	User as UserIcon,
	Store,
	Star,
} from "lucide-react";
import { format } from "date-fns";
import { adminAPI } from "../../lib/api";
import PageHeader from "../../components/admin/PageHeader";
import SearchFilter from "../../components/admin/SearchFilter";
import DataTable from "../../components/admin/DataTable";
import StatusBadge from "../../components/admin/StatusBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const USER_ROLES = [
	{
		value: "user",
		label: "User",
		icon: UserIcon,
		color: "bg-gray-100 text-gray-700",
	},
	{
		value: "business_owner",
		label: "Business Owner",
		icon: Store,
		color: "bg-orange-100 text-orange-700",
	},
	{
		value: "admin",
		label: "Admin",
		icon: Shield,
		color: "bg-purple-100 text-purple-700",
	},
];

export default function AdminUsers() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [roleFilter, setRoleFilter] = useState("all");
	const [selectedUser, setSelectedUser] = useState(null);
	const [refetchKey, setRefetchKey] = useState(0);

	const fetchUsers = async () => {
		setLoading(true);
		try {
			const response = await adminAPI.getAllUsers();
			setUsers(response.data || []);
		} catch (error) {
			console.error("Error fetching users:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, [refetchKey]);

	const updateUserRole = async (userId, newRole) => {
		try {
			await adminAPI.updateUserRole(userId, newRole);
			setRefetchKey((prev) => prev + 1);
		} catch (error) {
			console.error("Error updating user role:", error);
			alert(
				error.response?.data?.message || "Failed to update user role",
			);
		}
	};

	const filtered = users.filter((u) => {
		const matchSearch =
			!search ||
			u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
			u.email?.toLowerCase().includes(search.toLowerCase());
		const matchRole = roleFilter === "all" || u.role === roleFilter;
		return matchSearch && matchRole;
	});

	// Get stats
	const totalUsers = users.length;
	const activeUsers = users.filter((u) => u.isActive !== false).length;
	const businessOwners = users.filter(
		(u) => u.role === "business_owner",
	).length;
	const admins = users.filter((u) => u.role === "admin").length;

	const stats = [
		{
			label: "Total Users",
			value: totalUsers,
			icon: Users,
			color: "bg-blue-50 text-blue-600",
		},
		{
			label: "Active Users",
			value: activeUsers,
			icon: UserIcon,
			color: "bg-green-50 text-green-600",
		},
		{
			label: "Business Owners",
			value: businessOwners,
			icon: Store,
			color: "bg-orange-50 text-orange-600",
		},
		{
			label: "Admins",
			value: admins,
			icon: Shield,
			color: "bg-purple-50 text-purple-600",
		},
	];

	const formatDate = (dateString) => {
		if (!dateString) return "—";
		return new Date(dateString).toLocaleDateString("en-KE", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const getRoleBadge = (role) => {
		const config =
			USER_ROLES.find((r) => r.value === role) || USER_ROLES[0];
		return <StatusBadge status={role} />;
	};

	const columns = [
		{
			key: "user",
			label: "User",
			render: (row) => (
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shrink-0">
						<span className="text-white font-bold text-sm">
							{row.fullName?.[0]?.toUpperCase() ||
								row.email?.[0]?.toUpperCase() ||
								"U"}
						</span>
					</div>
					<div className="min-w-0">
						<p className="text-sm font-semibold text-gray-900 truncate">
							{row.fullName || "—"}
						</p>
						<p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
							<Mail className="w-3 h-3" /> {row.email}
						</p>
					</div>
				</div>
			),
		},
		{
			key: "role",
			label: "Role",
			render: (row) => getRoleBadge(row.role || "user"),
		},
		{
			key: "contact",
			label: "Contact",
			render: (row) => (
				<div>
					{row.phoneNumber && (
						<p className="text-xs text-gray-500 flex items-center gap-1">
							<Phone className="w-3 h-3" /> {row.phoneNumber}
						</p>
					)}
					{!row.phoneNumber && (
						<span className="text-xs text-gray-400 italic">
							No phone
						</span>
					)}
				</div>
			),
		},
		{
			key: "joined",
			label: "Joined",
			render: (row) => (
				<div>
					<span className="text-xs text-gray-500">
						{formatDate(row.createdAt)}
					</span>
					<p className="text-[10px] text-gray-400 mt-0.5">
						{row.createdAt
							? format(new Date(row.createdAt), "HH:mm")
							: ""}
					</p>
				</div>
			),
		},
		{
			key: "activity",
			label: "Activity",
			render: (row) => (
				<div className="flex items-center gap-2">
					<span className="text-xs text-gray-500">
						{row.isActive !== false ? "🟢 Active" : "⚫ Inactive"}
					</span>
					{row.authProvider === "google" && (
						<span className="text-xs text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full">
							Google
						</span>
					)}
				</div>
			),
		},
	];

	// User Detail Modal Component
	const UserDetailModal = ({ user, onClose, onRoleChange }) => {
		const [isUpdating, setIsUpdating] = useState(false);
		const [selectedRole, setSelectedRole] = useState(user?.role || "user");

		if (!user) return null;

		const handleRoleUpdate = async () => {
			if (selectedRole === user.role) {
				onClose();
				return;
			}
			setIsUpdating(true);
			try {
				await onRoleChange(user._id, selectedRole);
				onClose();
			} catch (error) {
				console.error("Error updating role:", error);
			} finally {
				setIsUpdating(false);
			}
		};

		return (
			<>
				<div
					className="fixed inset-0 bg-black/50 z-50"
					onClick={onClose}
				/>
				<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-xl z-50">
					<div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between rounded-t-2xl">
						<h3 className="text-lg font-bold text-gray-900 truncate">
							{user.fullName || "User Details"}
						</h3>
						<button
							onClick={onClose}
							className="p-1 rounded-lg hover:bg-gray-100"
						>
							✕
						</button>
					</div>
					<div className="p-5 space-y-4">
						{/* Avatar Section */}
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
								<span className="text-white font-bold text-2xl">
									{user.fullName?.[0]?.toUpperCase() ||
										user.email?.[0]?.toUpperCase() ||
										"U"}
								</span>
							</div>
							<div>
								<p className="font-semibold text-gray-900 text-lg">
									{user.fullName || "User"}
								</p>
								<p className="text-sm text-gray-500">
									{user.email}
								</p>
							</div>
						</div>

						{/* User Information */}
						<div className="grid grid-cols-2 gap-4 text-sm pt-2">
							<div>
								<p className="text-xs text-gray-500 font-medium">
									User ID
								</p>
								<p className="font-mono text-xs text-gray-600 mt-0.5 truncate">
									{user._id}
								</p>
							</div>
							<div>
								<p className="text-xs text-gray-500 font-medium">
									Role
								</p>
								<select
									value={selectedRole}
									onChange={(e) =>
										setSelectedRole(e.target.value)
									}
									className="mt-0.5 w-full px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400"
									disabled={isUpdating}
								>
									{USER_ROLES.map((role) => (
										<option
											key={role.value}
											value={role.value}
										>
											{role.label}
										</option>
									))}
								</select>
							</div>
							<div>
								<p className="text-xs text-gray-500 font-medium">
									Phone
								</p>
								<p className="text-sm text-gray-700 mt-0.5">
									{user.phoneNumber || "—"}
								</p>
							</div>
							<div>
								<p className="text-xs text-gray-500 font-medium">
									Location
								</p>
								<p className="text-sm text-gray-700 mt-0.5">
									{user.location || "—"}
								</p>
							</div>
							<div>
								<p className="text-xs text-gray-500 font-medium">
									Auth Provider
								</p>
								<p className="text-sm text-gray-700 mt-0.5 capitalize">
									{user.authProvider || "email"}
								</p>
							</div>
							<div>
								<p className="text-xs text-gray-500 font-medium">
									Member Since
								</p>
								<p className="text-sm text-gray-700 mt-0.5">
									{formatDate(user.createdAt)}
								</p>
							</div>
						</div>

						{/* Action Buttons */}
						{selectedRole !== user.role && (
							<div className="pt-4 border-t border-gray-100">
								<button
									onClick={handleRoleUpdate}
									disabled={isUpdating}
									className="w-full bg-orange-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
								>
									{isUpdating ? "Updating..." : "Update Role"}
								</button>
							</div>
						)}
					</div>
				</div>
			</>
		);
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-[60vh]">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	return (
		<div className="space-y-6 max-w-7xl mx-auto">
			<PageHeader
				title="Users"
				subtitle={`${totalUsers} total users · ${businessOwners} business owners`}
				onRefresh={() => setRefetchKey((prev) => prev + 1)}
			/>

			{/* Stats Grid */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{stats.map((stat) => {
					const Icon = stat.icon;
					return (
						<div
							key={stat.label}
							className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm"
						>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-2xl font-bold text-gray-900">
										{stat.value}
									</p>
									<p className="text-xs text-gray-500 mt-0.5">
										{stat.label}
									</p>
								</div>
								<div
									className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}
								>
									<Icon className="w-5 h-5" />
								</div>
							</div>
						</div>
					);
				})}
			</div>

			<SearchFilter
				search={search}
				onSearchChange={setSearch}
				filters={[
					{
						key: "role",
						value: roleFilter,
						onChange: setRoleFilter,
						placeholder: "Role",
						allLabel: "All Roles",
						options: USER_ROLES.map((r) => ({
							value: r.value,
							label: r.label,
						})),
					},
				]}
			/>

			<DataTable
				columns={columns}
				data={filtered}
				emptyIcon={Users}
				emptyMessage="No users found"
				onRowClick={setSelectedUser}
			/>

			<UserDetailModal
				user={selectedUser}
				onClose={() => setSelectedUser(null)}
				onRoleChange={updateUserRole}
			/>
		</div>
	);
}
