import { Link, useLocation } from "react-router-dom";
import data from "../../lib/data";
import {
	ClipboardList,
	Home,
	MessageSquare,
	Search,
	ShieldCheck,
	User,
} from "lucide-react";

const BottomNav = () => {
	const location = useLocation();
	// const { user, profile } = useAuth();
	const user = true;
	const profile = data.dummyUserProfile;
	const isAdmin = profile?.role === "admin";

	const navItems = [
		{ to: "/", icon: Home, label: "Home" },
		{ to: "/discover", icon: Search, label: "Discover" },
		{ to: "/community", icon: MessageSquare, label: "Community" },
		...(isAdmin
			? [{ to: "/admin", icon: ShieldCheck, label: "Admin" }]
			: [{ to: "/orders", icon: ClipboardList, label: "Orders" }]),
		{ to: "/profile", icon: User, label: "Profile" },
	];

	return (
		<nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 safe-area-inset-bottom">
			<div className="flex">
				{navItems.map(({ to, icon: Icon, label }) => {
					const isActive =
						location.pathname === to ||
						(to !== "/" && location.pathname.startsWith(to));
					const isAdminTab = to === "/admin";
					return (
						<Link
							key={to}
							to={to === "/profile" && !user ? "/auth" : to}
							className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
								isActive
									? isAdminTab
										? "text-orange-500"
										: "text-orange-500"
									: "text-gray-500"
							}`}
						>
							<Icon
								size={22}
								strokeWidth={isActive ? 2.5 : 1.8}
							/>
							<span className="text-[10px] font-medium">
								{label}
							</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
};

export default BottomNav;
