import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	ShoppingCart,
	Bell,
	User,
	Menu,
	X,
	MapPin,
	ChevronDown,
	Home,
	Compass,
	Users,
	ShoppingBag,
} from "lucide-react";
import { useAuth } from "../../lib/context/AuthContext";
import { useCart } from "../../lib/context/CartContext";

export default function Header() {
	const { user, profile, signOut } = useAuth();
	const { itemCount, setIsOpen: setCartOpen } = useCart();
	const [menuOpen, setMenuOpen] = useState(false);
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const userMenuRef = useRef(null);
	const navigate = useNavigate();

	// Handle scroll effect
	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Close user menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				userMenuRef.current &&
				!userMenuRef.current.contains(event.target)
			) {
				setUserMenuOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSignOut = async () => {
		await signOut();
		setUserMenuOpen(false);
		setMenuOpen(false);
		navigate("/");
	};

	const getUserInitials = () => {
		if (profile?.fullName) {
			return profile.fullName
				.split(" ")
				.map((name) => name[0])
				.join("")
				.toUpperCase()
				.slice(0, 2);
		}
		if (user?.fullName) {
			return user.fullName
				.split(" ")
				.map((name) => name[0])
				.join("")
				.toUpperCase()
				.slice(0, 2);
		}
		if (user?.email) {
			return user.email[0].toUpperCase();
		}
		return "U";
	};

	const getUserDisplayName = () => {
		if (profile?.fullName) return profile.fullName;
		if (user?.fullName) return user.fullName;
		if (user?.email) return user.email.split("@")[0];
		return "User";
	};

	const getUserRole = () => {
		return profile?.role || user?.role || "user";
	};

	const getUserAvatar = () => {
		return profile?.profileImage || user?.profileImage || null;
	};

	return (
		<>
			<header
				className={`sticky top-0 z-50 transition-all duration-200 ${
					scrolled
						? "bg-white/95 backdrop-blur-md shadow-sm"
						: "bg-white shadow-sm border-b border-gray-100"
				}`}
			>
				<div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
					{/* Logo */}
					<Link
						to="/"
						className="flex items-center gap-2 shrink-0 group"
					>
						<div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
							<MapPin
								size={16}
								className="text-white"
								strokeWidth={2.5}
							/>
						</div>
						<span className="font-bold text-gray-900 text-lg leading-none">
							Tassia
							<span className="text-orange-500">Connect</span>
						</span>
					</Link>

					{/* Location Badge (Desktop) */}
					<div className="hidden sm:flex items-center gap-1 bg-orange-50 rounded-full px-3 py-1.5 text-sm text-gray-600 border border-orange-100">
						<MapPin size={14} className="text-orange-500" />
						<span className="text-gray-700">
							Tassia Complex, Embakasi
						</span>
						<ChevronDown size={14} className="text-gray-400" />
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
						<Link
							to="/discover"
							className="hover:text-orange-500 transition-colors flex items-center gap-1"
						>
							<Compass size={16} />
							Discover
						</Link>
						<Link
							to="/community"
							className="hover:text-orange-500 transition-colors flex items-center gap-1"
						>
							<Users size={16} />
							Community
						</Link>
						{user && (
							<Link
								to="/orders"
								className="hover:text-orange-500 transition-colors flex items-center gap-1"
							>
								<ShoppingBag size={16} />
								Orders
							</Link>
						)}
					</nav>

					{/* Right Side Actions */}
					<div className="flex items-center gap-2">
						{/* Cart Button */}
						<button
							onClick={() => setCartOpen(true)}
							className="relative p-2 rounded-full hover:bg-gray-100 transition-colors group"
							aria-label="Open shopping cart"
						>
							<ShoppingCart
								size={20}
								className="text-gray-600 group-hover:text-orange-500 transition-colors"
							/>
							{itemCount > 0 && (
								<span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs rounded-full flex items-center justify-center font-bold px-1.5 shadow-sm animate-pulse">
									{itemCount > 9 ? "9+" : itemCount}
								</span>
							)}
						</button>

						{/* User Menu / Auth Button */}
						{user ? (
							<div className="relative" ref={userMenuRef}>
								<button
									onClick={() =>
										setUserMenuOpen(!userMenuOpen)
									}
									className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
									aria-label="User menu"
								>
									<div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-sm">
										{getUserAvatar() ? (
											<img
												src={getUserAvatar()}
												alt={getUserDisplayName()}
												className="w-8 h-8 rounded-full object-cover"
											/>
										) : (
											<span className="text-white font-bold text-sm">
												{getUserInitials()}
											</span>
										)}
									</div>
									<ChevronDown
										size={14}
										className="text-gray-400 hidden sm:block"
									/>
								</button>

								{/* Dropdown Menu */}
								{userMenuOpen && (
									<div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
										{/* User Info */}
										<div className="px-4 py-3 border-b border-gray-100">
											<p className="font-semibold text-gray-900 text-sm truncate">
												{getUserDisplayName()}
											</p>
											<p className="text-xs text-gray-500 truncate">
												{user?.email}
											</p>
											<span className="inline-block mt-1.5 text-xs font-medium capitalize bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
												{getUserRole()}
											</span>
										</div>

										{/* Menu Items */}
										<div className="py-1">
											<Link
												to="/profile"
												onClick={() =>
													setUserMenuOpen(false)
												}
												className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
											>
												👤 My Profile
											</Link>
											<Link
												to="/orders"
												onClick={() =>
													setUserMenuOpen(false)
												}
												className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
											>
												📦 My Orders
											</Link>

											{(getUserRole() ===
												"business_owner" ||
												getUserRole() === "admin") && (
												<Link
													to="/dashboard"
													onClick={() =>
														setUserMenuOpen(false)
													}
													className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
												>
													🏪 Business Dashboard
												</Link>
											)}

											{getUserRole() === "admin" && (
												<>
													<Link
														to="/admin"
														onClick={() =>
															setUserMenuOpen(
																false,
															)
														}
														className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
													>
														⚙️ Admin Panel
													</Link>
													<Link
														to="/admin/categories"
														onClick={() =>
															setUserMenuOpen(
																false,
															)
														}
														className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
													>
														📁 Manage Categories
													</Link>
												</>
											)}
										</div>

										{/* Divider */}
										<div className="border-t border-gray-100 my-1"></div>

										{/* Sign Out */}
										<button
											onClick={handleSignOut}
											className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
										>
											🚪 Sign Out
										</button>
									</div>
								)}
							</div>
						) : (
							<Link
								to="/auth"
								className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-1.5 rounded-full text-sm font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm hover:shadow-md"
							>
								Sign In
							</Link>
						)}

						{/* Mobile Menu Button */}
						<button
							className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
							onClick={() => setMenuOpen(!menuOpen)}
							aria-label={menuOpen ? "Close menu" : "Open menu"}
						>
							{menuOpen ? <X size={20} /> : <Menu size={20} />}
						</button>
					</div>
				</div>

				{/* Mobile Navigation Menu */}
				{menuOpen && (
					<div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-2 animate-in slide-in-from-top duration-200">
						<Link
							to="/discover"
							onClick={() => setMenuOpen(false)}
							className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
						>
							<Compass size={18} className="text-gray-500" />
							Discover
						</Link>
						<Link
							to="/community"
							onClick={() => setMenuOpen(false)}
							className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
						>
							<Users size={18} className="text-gray-500" />
							Community
						</Link>
						{user && (
							<>
								<Link
									to="/orders"
									onClick={() => setMenuOpen(false)}
									className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
								>
									<ShoppingBag
										size={18}
										className="text-gray-500"
									/>
									My Orders
								</Link>
								<Link
									to="/profile"
									onClick={() => setMenuOpen(false)}
									className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
								>
									👤 My Profile
								</Link>
								{(getUserRole() === "business_owner" ||
									getUserRole() === "admin") && (
									<Link
										to="/dashboard"
										onClick={() => setMenuOpen(false)}
										className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
									>
										🏪 Business Dashboard
									</Link>
								)}
								{getUserRole() === "admin" && (
									<Link
										to="/admin"
										onClick={() => setMenuOpen(false)}
										className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
									>
										⚙️ Admin Panel
									</Link>
								)}
								<button
									onClick={handleSignOut}
									className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-red-600 font-medium hover:bg-red-50 transition-colors"
								>
									🚪 Sign Out
								</button>
							</>
						)}
					</div>
				)}
			</header>
		</>
	);
}
