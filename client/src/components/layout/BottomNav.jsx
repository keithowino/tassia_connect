import { Link, useLocation } from "react-router-dom";
import {
	Home,
	Search,
	MessageSquare,
	ClipboardList,
	User,
	ShieldCheck,
	ShoppingBag,
	Store,
} from "lucide-react";
import { useAuth } from "../../lib/context/AuthContext";

export default function BottomNav() {
	const location = useLocation();
	const { user, profile } = useAuth();

	// Get user role safely (supports both profile and user objects)
	const getUserRole = () => {
		if (profile?.role) return profile.role;
		if (user?.role) return user.role;
		return "user";
	};

	const isAdmin = getUserRole() === "admin";
	const isBusinessOwner = getUserRole() === "business_owner";

	// Check if user is logged in
	const isAuthenticated = !!user;

	// Define navigation items based on user role
	const navItems = [
		{
			to: "/",
			icon: Home,
			label: "Home",
			requiresAuth: false,
		},
		{
			to: "/discover",
			icon: Search,
			label: "Discover",
			requiresAuth: false,
		},
		{
			to: "/community",
			icon: MessageSquare,
			label: "Community",
			requiresAuth: false,
		},
	];

	// Add role-specific items
	if (isAdmin) {
		navItems.push({
			to: "/admin",
			icon: ShieldCheck,
			label: "Admin",
			requiresAuth: true,
		});
	} else if (isBusinessOwner) {
		navItems.push({
			to: "/dashboard",
			icon: Store,
			label: "Dashboard",
			requiresAuth: true,
		});
		navItems.push({
			to: "/orders",
			icon: ClipboardList,
			label: "Orders",
			requiresAuth: true,
		});
	} else if (isAuthenticated) {
		// Regular user
		navItems.push({
			to: "/orders",
			icon: ShoppingBag,
			label: "Orders",
			requiresAuth: true,
		});
	}

	// Profile is always last (redirects to auth if not logged in)
	navItems.push({
		to: "/profile",
		icon: User,
		label: "Profile",
		requiresAuth: false, // Will redirect to auth if not logged in
		authRequired: true, // Special flag for profile
	});

	// Don't show bottom nav on auth page
	if (location.pathname === "/auth") {
		return null;
	}

	return (
		<nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 safe-area-inset-bottom shadow-lg">
			<div className="flex items-center justify-around max-w-md mx-auto">
				{navItems.map(
					({ to, icon: Icon, label, requiresAuth, authRequired }) => {
						// Determine if the link should be active
						const isActive =
							location.pathname === to ||
							(to !== "/" && location.pathname.startsWith(to));

						// Determine the actual link destination
						let linkTo = to;
						if (authRequired && !isAuthenticated) {
							linkTo = "/auth";
						} else if (to === "/dashboard" && isBusinessOwner) {
							// Business owners should go to their dashboard
							linkTo = "/dashboard";
						}

						// Don't render if requiresAuth and user not authenticated (except profile which redirects)
						if (requiresAuth && !isAuthenticated && !authRequired) {
							return null;
						}

						return (
							<Link
								key={to}
								to={linkTo}
								className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-all duration-200 ${
									isActive
										? "text-orange-500"
										: "text-gray-500 hover:text-gray-700"
								}`}
								aria-label={label}
								aria-current={isActive ? "page" : undefined}
							>
								<Icon
									size={22}
									strokeWidth={isActive ? 2.5 : 1.8}
									className="transition-transform duration-200"
								/>
								<span className="text-[10px] font-medium">
									{label}
								</span>
							</Link>
						);
					},
				)}
			</div>
		</nav>
	);
}
