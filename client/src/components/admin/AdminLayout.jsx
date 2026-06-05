// import { ShieldCheck } from "lucide-react";
// import React, { useEffect } from "react";
// import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
// import { useCommon } from "../../lib/context/CommonContext";
// import { useAuth } from "../../lib/context/AuthContext";

// const AdminLayout = () => {
// 	const { user, profile } = useAuth();
// 	const { adminNavItems } = useCommon();

// 	const navigate = useNavigate();
// 	const location = useLocation();

// 	// Check admin access
// 	useEffect(() => {
// 		const userRole = profile?.role || user?.role;
// 		if (userRole !== "admin") {
// 			navigate("/");
// 			return;
// 		}
// 		if (!user) {
// 			navigate("/auth");
// 			return;
// 		}
// 	}, [profile, user, navigate]);

// 	const isAdmin = profile?.role === "admin" || user?.role === "admin";
// 	if (!isAdmin) return null;

// 	return (
// 		// <section className="min-h-screen bg-gray-50">
// 		<section className="relative bg-gray-50">
// 			{/* Admin Sidebar */}
// 			{/* <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40"> */}
// 			<div className="fixed left-0 h-full w-64 bg-white border-r border-gray-200 z-40">
// 				<div className="p-6 border-b border-gray-200">
// 					<div className="flex items-center gap-2">
// 						<ShieldCheck size={24} className="text-orange-500" />
// 						<span className="font-bold text-gray-900">
// 							Admin Panel
// 						</span>
// 					</div>
// 				</div>
// 				<nav className="p-4 space-y-1">
// 					{adminNavItems.map((item) => {
// 						const Icon = item.icon;
// 						const isActive = location.pathname === item.path;
// 						return (
// 							<Link
// 								key={item.path}
// 								to={item.path}
// 								className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
// 									isActive
// 										? "bg-orange-50 text-orange-600"
// 										: "text-gray-600 hover:bg-gray-50"
// 								}`}
// 							>
// 								<Icon size={18} />
// 								{item.label}
// 							</Link>
// 						);
// 					})}
// 				</nav>
// 			</div>
// 			{/* Main Content */}
// 			<div className="ml-64">
// 				<div className="p-6">
// 					<Outlet />
// 				</div>
// 			</div>
// 		</section>
// 	);
// };

// export default AdminLayout;

import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
	LayoutDashboard,
	Store,
	ShoppingCart,
	Star,
	MessageSquare,
	Users,
	Package,
	Tags,
	ChevronLeft,
	ChevronRight,
	LogOut,
	Shield,
	Menu,
	X,
} from "lucide-react";
import { useAuth } from "../../lib/context/AuthContext";
import { useCommon } from "../../lib/context/CommonContext";

export default function AdminLayout() {
	const { user, profile, signOut } = useAuth();
	const { adminNavItems } = useCommon();
	const navigate = useNavigate();
	const location = useLocation();
	const [collapsed, setCollapsed] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

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

	const isActive = (item) => {
		if (item.exact) return location.pathname === item.path;
		return location.pathname.startsWith(item.path);
	};

	const handleLogout = async () => {
		await signOut();
		navigate("/");
	};

	const isAdmin = profile?.role === "admin" || user?.role === "admin";
	if (!isAdmin) return null;

	const SidebarContent = () => (
		<div className="flex flex-col h-full">
			{/* Logo */}
			<div className="px-4 py-5 flex items-center gap-3">
				<div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shrink-0">
					<Shield className="w-5 h-5 text-white" />
				</div>
				{!collapsed && (
					<div className="overflow-hidden">
						<h1 className="font-bold text-gray-800 text-sm tracking-tight truncate">
							Admin Panel
						</h1>
						<p className="text-[10px] text-gray-400 tracking-wider uppercase">
							Dashboard
						</p>
					</div>
				)}
			</div>

			{/* Navigation */}
			<nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
				{adminNavItems.map((item) => (
					<Link
						key={item.path}
						to={item.path}
						onClick={() => setMobileOpen(false)}
						className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 group ${
							isActive(item)
								? "bg-orange-50 text-orange-600 shadow-sm"
								: "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
						}`}
					>
						<item.icon
							className={`w-[18px] h-[18px] shrink-0 ${!isActive(item) ? "opacity-60 group-hover:opacity-100" : ""}`}
						/>
						{!collapsed && (
							<span className="truncate">{item.label}</span>
						)}
					</Link>
				))}
			</nav>

			{/* Footer */}
			<div className="px-3 py-4 border-t border-gray-100">
				<div className="flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-gray-500 w-full">
					<div className="w-[18px] h-[18px] shrink-0 rounded-full bg-orange-100 flex items-center justify-center">
						<span className="text-orange-600 font-semibold text-xs">
							{(
								profile?.fullName?.[0] ||
								user?.fullName?.[0] ||
								"A"
							).toUpperCase()}
						</span>
					</div>
					{!collapsed && (
						<>
							{/* <span className="text-sm text-gray-600 hidden sm:inline"> */}
							<span className="text-sm text-gray-600">
								{profile?.fullName || user?.fullName || "Admin"}
							</span>
						</>
					)}
				</div>
				<button
					onClick={handleLogout}
					className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all w-full"
				>
					<LogOut className="w-[18px] h-[18px] shrink-0" />
					{!collapsed && <span>Sign Out</span>}
				</button>
			</div>
		</div>
	);

	return (
		<div className="flex h-screen overflow-hidden bg-gray-50">
			{/* Desktop Sidebar */}
			<aside
				className={`hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 shrink-0 ${
					collapsed ? "w-[68px]" : "w-[240px]"
				}`}
			>
				<SidebarContent />
				<button
					onClick={() => setCollapsed(!collapsed)}
					className="absolute hidden lg:flex w-6 h-6 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors z-10"
					style={{
						left: collapsed ? "54px" : "226px",
						bottom: "80px",
					}}
				>
					{collapsed ? (
						<ChevronRight className="w-3 h-3" />
					) : (
						<ChevronLeft className="w-3 h-3" />
					)}
				</button>
			</aside>

			{/* Mobile overlay */}
			{mobileOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-40 lg:hidden"
					onClick={() => setMobileOpen(false)}
				/>
			)}

			{/* Mobile Sidebar */}
			<aside
				className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-gray-200 transition-transform duration-300 lg:hidden ${
					mobileOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="absolute top-3 right-3">
					<button
						onClick={() => setMobileOpen(false)}
						className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
					>
						<X className="w-4 h-4 text-gray-500" />
					</button>
				</div>
				<SidebarContent />
			</aside>

			{/* Main content */}
			<main className="flex-1 flex flex-col overflow-hidden">
				{/* Top bar */}
				<header className="lg:hidden h-14 shrink-0 border-b border-gray-200 bg-white/80 backdrop-blur-sm flex items-center px-4 gap-3">
					<button
						onClick={() => setMobileOpen(true)}
						className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
					>
						<Menu className="w-4 h-4 text-gray-600" />
					</button>
					<div className="flex-1" />
				</header>

				{/* Page content */}
				<div className="flex-1 overflow-y-auto py-2 px-4 lg:px-6 lg:py-4">
					<Outlet />
				</div>
			</main>
		</div>
	);
}
