import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	ShoppingCart,
	Bell,
	User,
	Menu,
	X,
	MapPin,
	ChevronDown,
} from "lucide-react";
import { useAuth } from "../../lib/context/AuthContext";
import { useCart } from "../../lib/context/CartContext";

export default function Header() {
	const { user, profile, signOut } = useAuth();
	const { itemCount, setIsOpen: setCartOpen } = useCart();
	const [menuOpen, setMenuOpen] = useState(false);
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const navigate = useNavigate();

	const handleSignOut = async () => {
		await signOut();
		setUserMenuOpen(false);
		navigate("/");
	};

	return (
		<header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
			<div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
				<Link to="/" className="flex items-center gap-2 shrink-0">
					<div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
						<MapPin
							size={16}
							className="text-white"
							strokeWidth={2.5}
						/>
					</div>
					<span className="font-bold text-gray-900 text-lg leading-none">
						Tassia<span className="text-orange-500">Connect</span>
					</span>
				</Link>

				<div className="hidden sm:flex items-center gap-1 bg-gray-50 rounded-full px-3 py-1.5 text-sm text-gray-500 border border-gray-200">
					<MapPin size={14} className="text-orange-500" />
					<span>Tassia Complex, Embakasi</span>
					<ChevronDown size={14} />
				</div>

				<nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
					<Link
						to="/discover"
						className="hover:text-orange-500 transition-colors"
					>
						Discover
					</Link>
					<Link
						to="/community"
						className="hover:text-orange-500 transition-colors"
					>
						Community
					</Link>
					<Link
						to="/orders"
						className="hover:text-orange-500 transition-colors"
					>
						Orders
					</Link>
				</nav>

				<div className="flex items-center gap-2">
					<button
						onClick={() => setCartOpen(true)}
						className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
						aria-label="Open shopping cart"
					>
						<ShoppingCart size={20} className="text-gray-600" />
						{itemCount > 0 && (
							<span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
								{itemCount > 9 ? "9+" : itemCount}
							</span>
						)}
					</button>

					{user ? (
						<div className="relative">
							<button
								onClick={() => setUserMenuOpen(!userMenuOpen)}
								className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
								aria-label="User menu"
							>
								<div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
									{profile?.avatar_url ? (
										<img
											src={profile.avatar_url}
											alt={
												profile?.full_name ||
												"User avatar"
											}
											className="w-8 h-8 rounded-full object-cover"
										/>
									) : (
										<span className="text-orange-600 font-bold text-sm">
											{profile?.full_name?.[0]?.toUpperCase() ||
												"U"}
										</span>
									)}
								</div>
							</button>
							{userMenuOpen && (
								<>
									<div className="absolute right-0 top-12 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
										<div className="px-4 py-2 border-b border-gray-100">
											<p className="font-semibold text-gray-900 text-sm truncate">
												{profile?.full_name || "User"}
											</p>
											<p className="text-xs text-gray-500 capitalize">
												{profile?.role || "user"}
											</p>
										</div>
										<Link
											to="/profile"
											onClick={() =>
												setUserMenuOpen(false)
											}
											className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
										>
											My Profile
										</Link>
										<Link
											to="/orders"
											onClick={() =>
												setUserMenuOpen(false)
											}
											className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
										>
											My Orders
										</Link>
										{(profile?.role === "business_owner" ||
											profile?.role === "admin") && (
											<Link
												to="/dashboard"
												onClick={() =>
													setUserMenuOpen(false)
												}
												className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
											>
												Business Dashboard
											</Link>
										)}
										{profile?.role === "admin" && (
											<Link
												to="/admin"
												onClick={() =>
													setUserMenuOpen(false)
												}
												className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
											>
												Admin Panel
											</Link>
										)}
										<button
											onClick={handleSignOut}
											className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
										>
											Sign Out
										</button>
									</div>
									{/* Backdrop for closing menu when clicking outside */}
									<div
										className="fixed inset-0 z-40"
										onClick={() => setUserMenuOpen(false)}
										aria-hidden="true"
									/>
								</>
							)}
						</div>
					) : (
						<Link
							to="/auth"
							className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors"
						>
							Sign In
						</Link>
					)}

					<button
						className="md:hidden p-2 rounded-full hover:bg-gray-100"
						onClick={() => setMenuOpen(!menuOpen)}
						aria-label={menuOpen ? "Close menu" : "Open menu"}
					>
						{menuOpen ? <X size={20} /> : <Menu size={20} />}
					</button>
				</div>
			</div>

			{/* Mobile menu */}
			{menuOpen && (
				<div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-2">
					<Link
						to="/discover"
						onClick={() => setMenuOpen(false)}
						className="py-2 text-gray-700 font-medium"
					>
						Discover
					</Link>
					<Link
						to="/community"
						onClick={() => setMenuOpen(false)}
						className="py-2 text-gray-700 font-medium"
					>
						Community
					</Link>
					<Link
						to="/orders"
						onClick={() => setMenuOpen(false)}
						className="py-2 text-gray-700 font-medium"
					>
						Orders
					</Link>
				</div>
			)}
		</header>
	);
}
